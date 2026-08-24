import admin from 'firebase-admin';

let isFirebaseAdminInitialized = false;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    isFirebaseAdminInitialized = true;
    console.log('[Firebase Admin] Initialized with Service Account Credentials.');
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    isFirebaseAdminInitialized = true;
    console.log('[Firebase Admin] Initialized with Project ID.');
  } else {
    console.warn('[Firebase Admin] No service account credentials detected in .env. Falling back to development token verification.');
  }
} catch (error) {
  console.error('[Firebase Admin] Initialization warning:', error.message);
}

export { admin, isFirebaseAdminInitialized };
