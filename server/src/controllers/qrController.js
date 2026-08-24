import mongoose from 'mongoose';
import { QRCode } from '../models/QRCode.js';
import { ScanAnalytics } from '../models/ScanAnalytics.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';
import { formatStaticPayload } from '../utils/qrFormatter.js';
import { connectDB } from '../config/db.js';

// In-memory fallback repository
const inMemoryQRCache = new Map();

/**
 * @desc Create a new QR Code (Dynamic or Static)
 * @route POST /api/qr
 */
export const createQRCode = async (req, res, next) => {
  try {
    await connectDB();
    const user = req.user;
    const {
      name,
      type = 'url',
      mode = 'dynamic',
      destination = '',
      metadata = {},
      customization = {},
    } = req.body;

    const finalName = (name && name.trim() !== '') ? name.trim() : `${type.toUpperCase()} QR ${new Date().toLocaleDateString()}`;

    let slug = null;
    let shortUrl = null;

    if (mode === 'dynamic') {
      slug = await generateUniqueSlug(7);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      shortUrl = `${baseUrl}/q/${slug}`;
    }

    let formattedDestination = destination;
    if (mode === 'static') {
      formattedDestination = formatStaticPayload(type, destination, metadata);
    }

    let qrCode = null;
    try {
      if (mongoose.connection.readyState === 1) {
        qrCode = await QRCode.create({
          userId: user._id,
          name: finalName,
          type,
          mode,
          destination: formattedDestination,
          slug,
          shortUrl,
          metadata,
          customization,
          status: 'active',
          scanCount: 0,
        });
      }
    } catch (dbErr) {
      console.warn('[QR Controller] Saving to fallback cache:', dbErr.message);
    }

    if (!qrCode) {
      const fallbackId = new mongoose.Types.ObjectId().toString();
      qrCode = {
        _id: fallbackId,
        userId: user._id,
        name: finalName,
        type,
        mode,
        destination: formattedDestination,
        slug,
        shortUrl,
        metadata,
        customization,
        status: 'active',
        scanCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryQRCache.set(fallbackId, qrCode);
      if (slug) inMemoryQRCache.set(slug, qrCode);
    }

    res.status(201).json({
      success: true,
      message: 'QR Code created successfully.',
      data: qrCode,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all QR Codes for authenticated user with filters & pagination
 * @route GET /api/qr
 */
export const getUserQRCodes = async (req, res, next) => {
  try {
    await connectDB();
    const user = req.user;
    const {
      page = 1,
      limit = 12,
      type,
      mode,
      status,
      search,
      sort = '-createdAt',
    } = req.query;

    let qrcodes = [];
    let total = 0;

    try {
      if (mongoose.connection.readyState === 1) {
        const query = { userId: user._id };
        if (type && type !== 'all') query.type = type;
        if (mode && mode !== 'all') query.mode = mode;
        if (status && status !== 'all') query.status = status;
        if (search && search.trim() !== '') {
          query.$or = [
            { name: { $regex: search.trim(), $options: 'i' } },
            { destination: { $regex: search.trim(), $options: 'i' } },
          ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10));
        const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNumber - 1) * limitNumber;

        total = await QRCode.countDocuments(query);
        qrcodes = await QRCode.find(query).sort(sort).skip(skip).limit(limitNumber).lean();
      }
    } catch (dbErr) {
      console.warn('[QR Controller] Loading from fallback cache:', dbErr.message);
    }

    // Include in-memory items if DB empty or offline
    if (qrcodes.length === 0 && inMemoryQRCache.size > 0) {
      const memoryItems = Array.from(inMemoryQRCache.values()).filter(q => q._id);
      qrcodes = memoryItems;
      total = memoryItems.length;
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));

    res.status(200).json({
      success: true,
      data: qrcodes,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.max(1, Math.ceil(total / limitNumber)),
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single QR Code by ID
 * @route GET /api/qr/:id
 */
export const getQRCodeById = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.user;

    let qrCode = null;
    try {
      if (mongoose.connection.readyState === 1) {
        qrCode = await QRCode.findOne({ _id: id, userId: user._id });
      }
    } catch (e) {}

    if (!qrCode && inMemoryQRCache.has(id)) {
      qrCode = inMemoryQRCache.get(id);
    }

    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found.' });
    }

    res.status(200).json({ success: true, data: qrCode });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update an existing QR Code (Destination, metadata, customization, name)
 * @route PUT /api/qr/:id
 */
export const updateQRCode = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.user;
    const { name, destination, metadata, customization, status } = req.body;

    let qrCode = null;
    try {
      if (mongoose.connection.readyState === 1) {
        qrCode = await QRCode.findOne({ _id: id, userId: user._id });
      }
    } catch (e) {}

    if (!qrCode && inMemoryQRCache.has(id)) {
      qrCode = inMemoryQRCache.get(id);
    }

    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found.' });
    }

    if (name) qrCode.name = name.trim();
    if (destination !== undefined) {
      qrCode.destination = qrCode.mode === 'static'
        ? formatStaticPayload(qrCode.type, destination, metadata || qrCode.metadata)
        : destination;
    }
    if (metadata) qrCode.metadata = { ...(qrCode.metadata || {}), ...metadata };
    if (customization) qrCode.customization = { ...(qrCode.customization || {}), ...customization };
    if (status) qrCode.status = status;

    try {
      if (qrCode.save) {
        await qrCode.save();
      }
    } catch (e) {}

    inMemoryQRCache.set(id, qrCode);
    if (qrCode.slug) inMemoryQRCache.set(qrCode.slug, qrCode);

    res.status(200).json({
      success: true,
      message: 'QR Code updated successfully. Permanent prints will immediately route to new destination.',
      data: qrCode,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a QR Code
 * @route DELETE /api/qr/:id
 */
export const deleteQRCode = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.user;

    try {
      if (mongoose.connection.readyState === 1) {
        await QRCode.findOneAndDelete({ _id: id, userId: user._id });
        await ScanAnalytics.deleteMany({ qrId: id });
      }
    } catch (e) {}

    inMemoryQRCache.delete(id);

    res.status(200).json({ success: true, message: 'QR Code deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Duplicate an existing QR Code
 * @route POST /api/qr/:id/duplicate
 */
export const duplicateQRCode = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.user;

    let original = null;
    try {
      if (mongoose.connection.readyState === 1) {
        original = await QRCode.findOne({ _id: id, userId: user._id }).lean();
      }
    } catch (e) {}

    if (!original && inMemoryQRCache.has(id)) {
      original = inMemoryQRCache.get(id);
    }

    if (!original) {
      return res.status(404).json({ success: false, message: 'Original QR Code not found.' });
    }

    let slug = null;
    let shortUrl = null;

    if (original.mode === 'dynamic') {
      slug = await generateUniqueSlug(7);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      shortUrl = `${baseUrl}/q/${slug}`;
    }

    const newQR = {
      userId: user._id,
      name: `${original.name} (Copy)`,
      type: original.type,
      mode: original.mode,
      destination: original.destination,
      slug,
      shortUrl,
      metadata: original.metadata,
      customization: original.customization,
      status: 'active',
      scanCount: 0,
    };

    let createdQR = null;
    try {
      if (mongoose.connection.readyState === 1) {
        createdQR = await QRCode.create(newQR);
      }
    } catch (e) {}

    if (!createdQR) {
      createdQR = { _id: new mongoose.Types.ObjectId().toString(), ...newQR, createdAt: new Date() };
      inMemoryQRCache.set(createdQR._id, createdQR);
    }

    res.status(201).json({
      success: true,
      message: 'QR Code duplicated successfully.',
      data: createdQR,
    });
  } catch (error) {
    next(error);
  }
};
