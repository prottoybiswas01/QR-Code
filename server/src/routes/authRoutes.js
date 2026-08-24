import express from 'express';
import { getProfile, updateProfile, syncFirebaseUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.post('/sync', requireAuth, syncFirebaseUser);

export default router;
