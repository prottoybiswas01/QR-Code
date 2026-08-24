import express from 'express';
import { handleDynamicRedirect, getPublicQRData } from '../controllers/redirectController.js';
import { scanLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public permanent dynamic scan redirect: GET /q/:slug
router.get('/q/:slug', scanLimiter, handleDynamicRedirect);

// Public API data resolver for frontend client viewers: GET /api/public/q/:slug
router.get('/api/public/q/:slug', getPublicQRData);

export default router;
