import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const initFirebaseAdmin = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');

    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("Firebase Admin initialized successfully.");
    return app;
  } else {
    console.warn("Firebase Admin missing credentials. Social Login might fail.");
    return null;
  }
};

export const firebaseApp = initFirebaseAdmin();
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
