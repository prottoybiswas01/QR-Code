import express from 'express';
import {
  createQRCode,
  getUserQRCodes,
  getQRCodeById,
  updateQRCode,
  duplicateQRCode,
  deleteQRCode,
} from '../controllers/qrController.js';
import { getQRAnalytics } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createQRLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All QR management routes require authentication
router.use(requireAuth);

router.route('/')
  .post(createQRLimiter, createQRCode)
  .get(getUserQRCodes);

router.route('/:id')
  .get(getQRCodeById)
  .put(updateQRCode)
  .delete(deleteQRCode);

router.post('/:id/duplicate', duplicateQRCode);
router.get('/:id/analytics', getQRAnalytics);

export default router;
