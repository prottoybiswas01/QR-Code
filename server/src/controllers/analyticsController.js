import mongoose from 'mongoose';
import { QRCode } from '../models/QRCode.js';
import { ScanAnalytics } from '../models/ScanAnalytics.js';
import { connectDB } from '../config/db.js';

/**
 * @desc Get aggregated scan analytics for a specific QR code
 * @route GET /api/qr/:id/analytics
 */
export const getQRAnalytics = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const user = req.user;
    const { period = '30d' } = req.query;

    const qrCode = await QRCode.findOne({ _id: id, userId: user._id });
    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found.' });
    }

    // Determine date cutoff
    const now = new Date();
    let startDate = new Date();
    if (period === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === '90d') {
      startDate.setDate(now.getDate() - 90);
    } else {
      // default 30d
      startDate.setDate(now.getDate() - 30);
    }

    const qrObjectId = new mongoose.Types.ObjectId(id);

    // 1. Time-series daily scans
    const timeSeries = await ScanAnalytics.aggregate([
      {
        $match: {
          qrId: qrObjectId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Device Breakdown
    const devices = await ScanAnalytics.aggregate([
      { $match: { qrId: qrObjectId, timestamp: { $gte: startDate } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Operating System Breakdown
    const operatingSystems = await ScanAnalytics.aggregate([
      { $match: { qrId: qrObjectId, timestamp: { $gte: startDate } } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 4. Browser Breakdown
    const browsers = await ScanAnalytics.aggregate([
      { $match: { qrId: qrObjectId, timestamp: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 5. Recent Scan Logs
    const recentScans = await ScanAnalytics.find({ qrId: qrObjectId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        qrCode: {
          id: qrCode._id,
          name: qrCode.name,
          slug: qrCode.slug,
          type: qrCode.type,
          scanCount: qrCode.scanCount,
          lastScannedAt: qrCode.lastScannedAt,
        },
        period,
        timeSeries,
        devices,
        operatingSystems,
        browsers,
        recentScans,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get global dashboard statistics for all user's QR codes
 * @route GET /api/analytics/overview
 */
export const getDashboardOverview = async (req, res, next) => {
  try {
    await connectDB();
    const user = req.user;

    // Fetch all user QR IDs
    const userQRs = await QRCode.find({ userId: user._id }).select('_id name type mode slug scanCount createdAt');
    const qrIds = userQRs.map((q) => q._id);

    const totalQRs = userQRs.length;
    const dynamicQRs = userQRs.filter((q) => q.mode === 'dynamic').length;
    const staticQRs = userQRs.filter((q) => q.mode === 'static').length;
    const totalScans = userQRs.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);

    // Recent 14-day scans across all QRs
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const scanTrends = await ScanAnalytics.aggregate([
      {
        $match: {
          qrId: { $in: qrIds },
          timestamp: { $gte: twoWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          scans: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Device breakdown across user's QRs
    const devices = await ScanAnalytics.aggregate([
      { $match: { qrId: { $in: qrIds } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalQRs,
          dynamicQRs,
          staticQRs,
          totalScans,
        },
        recentQRs: userQRs.slice(0, 5),
        scanTrends,
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
};
