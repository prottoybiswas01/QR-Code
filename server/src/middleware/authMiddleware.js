import { admin, isFirebaseAdminInitialized } from '../config/firebase.js';
import { User } from '../models/User.js';

/**
 * Middleware to verify Firebase Auth token and attach MongoDB User to req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required. Please sign in.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = null;

    if (isFirebaseAdminInitialized) {
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
      } catch (verifyError) {
        console.error('[Auth Middleware] Firebase token verification failed:', verifyError.message);
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication session. Please sign in again.',
        });
      }
    } else {
      // In development fallback mode without service account credentials,
      // decode base64 payload safely to extract uid and email
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          decodedToken = {
            uid: payload.user_id || payload.sub || payload.uid || 'dev-user-123',
            email: payload.email || 'developer@example.com',
            name: payload.name || 'Developer',
            picture: payload.picture || '',
          };
        } else {
          // Dev test mock token
          decodedToken = {
            uid: token === 'test-token' ? 'test-firebase-uid-001' : token,
            email: 'testuser@example.com',
            name: 'Test User',
          };
        }
      } catch (decodeErr) {
        return res.status(401).json({
          success: false,
          message: 'Malformed authentication token.',
        });
      }
    }

    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({
        success: false,
        message: 'Could not resolve user identity from token.',
      });
    }

    // Sync or retrieve user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || `${decodedToken.uid}@users.qrflex.local`,
        displayName: decodedToken.name || decodedToken.displayName || '',
        photoURL: decodedToken.picture || decodedToken.photoURL || '',
        metadata: {
          lastLoginAt: new Date(),
        },
      });
    } else {
      // Update last login
      user.metadata.lastLoginAt = new Date();
      if (decodedToken.email && user.email !== decodedToken.email) {
        user.email = decodedToken.email;
      }
      await user.save();
    }

    // Attach user to request
    req.user = user;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Optional Auth middleware (e.g. for preview endpoints)
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return requireAuth(req, res, next);
};
