import { User } from '../models/User.js';
import { QRCode } from '../models/QRCode.js';
import { ScanAnalytics } from '../models/ScanAnalytics.js';
import { connectDB } from '../config/db.js';

/**
 * @desc Get current authenticated user profile & quota stats
 * @route GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    await connectDB();
    const user = req.user;
    
    // Calculate current usage stats
    const totalQRs = await QRCode.countDocuments({ userId: user._id });
    const dynamicQRs = await QRCode.countDocuments({ userId: user._id, mode: 'dynamic' });
    const staticQRs = await QRCode.countDocuments({ userId: user._id, mode: 'static' });
    const activeQRs = await QRCode.countDocuments({ userId: user._id, status: 'active' });

    // Aggregate total scans across all user's QRs
    const scanAggregation = await QRCode.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, totalScans: { $sum: '$scanCount' } } },
    ]);
    const totalScans = scanAggregation[0]?.totalScans || 0;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.role,
          plan: user.plan,
          limits: user.limits,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        stats: {
          totalQRs,
          dynamicQRs,
          staticQRs,
          activeQRs,
          totalScans,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update user profile details
 * @route PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { displayName, photoURL } = req.body;
    const user = req.user;

    if (displayName !== undefined) user.displayName = displayName.trim();
    if (photoURL !== undefined) user.photoURL = photoURL.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Sync or Create Firebase user on client login
 * @route POST /api/auth/sync
 */
export const syncFirebaseUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User synchronized successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};
