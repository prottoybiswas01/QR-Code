import { QRCode } from '../models/QRCode.js';
import { ScanAnalytics } from '../models/ScanAnalytics.js';
import { parseScanRequest } from '../utils/analyticsParser.js';

/**
 * Log scan event asynchronously without blocking response
 * @param {object} qrCode 
 * @param {import('express').Request} req 
 */
const logScanEvent = async (qrCode, req) => {
  try {
    const scanData = parseScanRequest(req);

    // Update QRCode counter and lastScanned timestamp
    await QRCode.findByIdAndUpdate(qrCode._id, {
      $inc: { scanCount: 1 },
      $set: { lastScannedAt: new Date() },
    });

    // Create ScanAnalytics entry
    await ScanAnalytics.create({
      qrId: qrCode._id,
      slug: qrCode.slug,
      timestamp: new Date(),
      deviceType: scanData.deviceType,
      os: scanData.os,
      browser: scanData.browser,
      ipHash: scanData.ipHash,
      referer: scanData.referer,
      userAgent: scanData.userAgent,
      country: scanData.country,
    });
  } catch (err) {
    console.error('[Analytics Error] Failed to log scan:', err.message);
  }
};

/**
 * @desc Public dynamic redirect & destination resolver
 * @route GET /q/:slug
 */
export const handleDynamicRedirect = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const qrCode = await QRCode.findOne({ slug });

    if (!qrCode) {
      // If client requests JSON
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'QR Code not found or has been removed.' });
      }
      return res.redirect(`${clientUrl}/view/not-found`);
    }

    if (qrCode.status !== 'active') {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(403).json({
          success: false,
          status: qrCode.status,
          message: 'This QR Code has been disabled or paused by the owner.',
        });
      }
      return res.redirect(`${clientUrl}/view/disabled?slug=${slug}`);
    }

    // Log scan analytics asynchronously
    logScanEvent(qrCode, req);

    // If client requested via JSON API
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(200).json({
        success: true,
        data: qrCode,
      });
    }

    // Handle Direct Redirect for web URLs and Social Platforms
    if (qrCode.type === 'url' || qrCode.type === 'facebook' || qrCode.type === 'instagram') {
      let target = qrCode.destination;
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = `https://${target}`;
      }
      return res.redirect(302, target);
    }

    if (qrCode.type === 'whatsapp') {
      const phone = (qrCode.metadata?.recipient || qrCode.destination || '').replace(/[^0-9+]/g, '');
      const msg = encodeURIComponent(qrCode.metadata?.message || '');
      const waUrl = `https://wa.me/${phone}${msg ? `?text=${msg}` : ''}`;
      return res.redirect(302, waUrl);
    }

    // For Wi-Fi, Text, vCard, Location, Email, Phone, SMS -> Direct to frontend viewer portal
    return res.redirect(302, `${clientUrl}/view/${slug}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get public QR details for frontend viewer page
 * @route GET /api/public/q/:slug
 */
export const getPublicQRData = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const qrCode = await QRCode.findOne({ slug }).select('-userId -firebaseUid');

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found.',
      });
    }

    if (qrCode.status !== 'active') {
      return res.status(403).json({
        success: false,
        status: qrCode.status,
        message: 'This QR code is currently inactive or disabled.',
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
