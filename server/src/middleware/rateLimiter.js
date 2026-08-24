import rateLimit from 'express-rate-limit';

// Standard API rate limiter: 300 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Dynamic Redirect / Scan limiter (high throughput: 1000 requests per minute)
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many scans detected. Please try again shortly.',
  },
});

// QR Creation limiter: 60 creations per 10 minutes
export const createQRLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'QR code creation limit reached. Please wait a moment before creating more.',
  },
});
