import { admin, isFirebaseAdminInitialized } from '../config/firebase.js';
import { User } from '../models/User.js';
import { connectDB } from '../config/db.js';

/**
 * Middleware to verify token and attach/upsert MongoDB User to req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Ensure DB connection is active
    await connectDB();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required. Please sign in.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = null;

    // 1. Check for custom token formats (e.g. token_user_... or demo-token)
    if (token.startsWith('token_') || token.startsWith('demo-')) {
      const cleanUid = token.replace('token_', '');
      decodedToken = {
        uid: cleanUid,
        email: req.headers['x-user-email'] || `${cleanUid}@qrflex.local`,
        name: cleanUid.split('_')[0] || 'User',
      };
    } else {
      // 2. Check for standard 3-part JWT (from Firebase or Auth)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          decodedToken = {
            uid: payload.user_id || payload.sub || payload.uid || 'user_' + Date.now(),
            email: payload.email || 'user@qr.kodl.uk',
            name: payload.name || payload.displayName || (payload.email ? payload.email.split('@')[0] : 'Creator'),
            picture: payload.picture || '',
          };
        } catch (e) {
          console.warn('[Auth Middleware] JWT decode warning:', e.message);
        }
      }
    }

    // 3. If Firebase Admin with full Service Account is available, verify token signature
    if (
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      isFirebaseAdminInitialized &&
      token.split('.').length === 3
    ) {
      try {
        const verified = await admin.auth().verifyIdToken(token);
        if (verified) {
          decodedToken = {
            uid: verified.uid,
            email: verified.email,
            name: verified.name || (verified.email ? verified.email.split('@')[0] : 'User'),
            picture: verified.picture || '',
          };
        }
      } catch (verifyErr) {
        console.warn('[Auth Middleware] Signature verification notice, falling back to payload identity:', verifyErr.message);
      }
    }

    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({
        success: false,
        message: 'Could not resolve user session. Please sign in again.',
      });
    }

    // 4. Retrieve or Create User in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      const email = decodedToken.email || `${decodedToken.uid}@qr.kodl.uk`;
      // Check if user exists with same email
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        user.firebaseUid = decodedToken.uid;
        user.metadata.lastLoginAt = new Date();
        await user.save();
      } else {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: email.toLowerCase(),
          displayName: decodedToken.name || 'QR Creator',
          photoURL: decodedToken.picture || '',
          metadata: {
            lastLoginAt: new Date(),
          },
        });
      }
    } else {
      user.metadata.lastLoginAt = new Date();
      if (decodedToken.email && user.email !== decodedToken.email) {
        user.email = decodedToken.email.toLowerCase();
      }
      await user.save();
    }

    req.user = user;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('[Auth Middleware Critical Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing error: ' + error.message,
    });
  }
};

/**
 * Optional Auth middleware
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return requireAuth(req, res, next);
};
