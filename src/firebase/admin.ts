import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin SDK configuration for Vercel deployment

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getServiceAccount = (): any => {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (typeof envKey === 'string' && envKey.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(envKey);
  }
  
  // For local development, try to load the file if it exists
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-var-requires
    return require('../../firebaseSecretKey.json');
  } catch {
    throw new Error('Firebase service account key not found. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
  }
};

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    credential: cert(getServiceAccount()),
  });

export const auth = getAuth();
