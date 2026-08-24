import { QRCode } from '../models/QRCode.js';
import { ScanAnalytics } from '../models/ScanAnalytics.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';
import { formatStaticPayload } from '../utils/qrFormatter.js';

/**
 * @desc Create a new QR Code (Dynamic or Static)
 * @route POST /api/qr
 */
export const createQRCode = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      name,
      type = 'url',
      mode = 'dynamic',
      destination = '',
      metadata = {},
      customization = {},
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'QR code name is required.' });
    }

    // Check Plan Limits
    const currentQRsCount = await QRCode.countDocuments({ userId: user._id });
    if (currentQRsCount >= user.limits.maxQRs) {
      return res.status(403).json({
        success: false,
        message: `Plan limit reached. You can create up to ${user.limits.maxQRs} QR codes on your current plan.`,
      });
    }

    let slug = null;
    let shortUrl = null;

    if (mode === 'dynamic') {
      const currentDynamicCount = await QRCode.countDocuments({ userId: user._id, mode: 'dynamic' });
      if (currentDynamicCount >= user.limits.maxDynamicQRs) {
        return res.status(403).json({
          success: false,
          message: `Dynamic QR limit reached. You can create up to ${user.limits.maxDynamicQRs} Dynamic QR codes.`,
        });
      }

      slug = await generateUniqueSlug(7);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      shortUrl = `${baseUrl}/q/${slug}`;
    }

    // Format destination/payload
    let formattedDestination = destination;
    if (mode === 'static') {
      formattedDestination = formatStaticPayload(type, destination, metadata);
    }

    const qrCode = await QRCode.create({
      userId: user._id,
      firebaseUid: user.firebaseUid,
      name: name.trim(),
      type,
      mode,
      slug,
      shortUrl,
      destination: formattedDestination,
      metadata,
      customization: {
        fgColor: customization.fgColor || '#000000',
        bgColor: customization.bgColor || '#ffffff',
        gradient: customization.gradient || { type: 'none', color1: '#4f46e5', color2: '#06b6d4', rotation: 0 },
        dotsType: customization.dotsType || 'rounded',
        cornersSquareType: customization.cornersSquareType || 'extra-rounded',
        cornersDotType: customization.cornersDotType || 'dot',
        cornersSquareColor: customization.cornersSquareColor || '',
        cornersDotColor: customization.cornersDotColor || '',
        logoUrl: customization.logoUrl || '',
        logoMargin: customization.logoMargin ?? 5,
        logoSize: customization.logoSize ?? 0.2,
        errorCorrectionLevel: customization.errorCorrectionLevel || (customization.logoUrl ? 'H' : 'Q'),
      },
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: `${mode === 'dynamic' ? 'Dynamic' : 'Static'} QR Code created successfully!`,
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

    const query = { userId: user._id };

    if (type && type !== 'all') {
      query.type = type;
    }
    if (mode && mode !== 'all') {
      query.mode = mode;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { destination: { $regex: search.trim(), $options: 'i' } },
        { 'metadata.ssid': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await QRCode.countDocuments(query);
    const qrcodes = await QRCode.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    res.status(200).json({
      success: true,
      data: qrcodes,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single QR Code by ID (user ownership verified)
 * @route GET /api/qr/:id
 */
export const getQRCodeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const qrCode = await QRCode.findOne({ _id: id, userId: user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found or you do not have permission to access it.',
      });
    }

    res.status(200).json({
      success: true,
      data: qrCode,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update QR Code destination, metadata, or design WITHOUT changing the dynamic slug/image!
 * @route PUT /api/qr/:id
 */
export const updateQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const {
      name,
      destination,
      metadata,
      customization,
      status,
      type,
    } = req.body;

    const qrCode = await QRCode.findOne({ _id: id, userId: user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found or access denied.',
      });
    }

    if (name !== undefined) qrCode.name = name.trim();
    if (type !== undefined) qrCode.type = type;
    if (status !== undefined) qrCode.status = status;

    if (metadata !== undefined) {
      qrCode.metadata = { ...qrCode.metadata.toObject(), ...metadata };
    }

    if (destination !== undefined) {
      if (qrCode.mode === 'static') {
        qrCode.destination = formatStaticPayload(qrCode.type, destination, qrCode.metadata);
      } else {
        qrCode.destination = destination;
      }
    }

    if (customization !== undefined) {
      qrCode.customization = { ...qrCode.customization.toObject(), ...customization };
    }

    // NOTE: qrCode.slug and qrCode.shortUrl are NEVER changed on update to preserve physical QR code scans!
    await qrCode.save();

    res.status(200).json({
      success: true,
      message: 'QR Code updated successfully! Existing printed QR codes will now serve this updated content.',
      data: qrCode,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Duplicate an existing QR Code configuration
 * @route POST /api/qr/:id/duplicate
 */
export const duplicateQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const original = await QRCode.findOne({ _id: id, userId: user._id });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Source QR code not found.' });
    }

    let slug = null;
    let shortUrl = null;

    if (original.mode === 'dynamic') {
      slug = await generateUniqueSlug(7);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      shortUrl = `${baseUrl}/q/${slug}`;
    }

    const duplicated = await QRCode.create({
      userId: user._id,
      firebaseUid: user.firebaseUid,
      name: `${original.name} (Copy)`,
      type: original.type,
      mode: original.mode,
      slug,
      shortUrl,
      destination: original.destination,
      metadata: original.metadata,
      customization: original.customization,
      status: 'active',
      scanCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'QR Code duplicated successfully.',
      data: duplicated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a QR Code and its scan analytics
 * @route DELETE /api/qr/:id
 */
export const deleteQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const qrCode = await QRCode.findOneAndDelete({ _id: id, userId: user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found or already deleted.',
      });
    }

    // Clean up analytics logs for this QR asynchronously
    ScanAnalytics.deleteMany({ qrId: qrCode._id }).catch((err) =>
      console.error('[Analytics Cleanup] Error:', err.message)
    );

    res.status(200).json({
      success: true,
      message: 'QR Code and its scan analytics deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
