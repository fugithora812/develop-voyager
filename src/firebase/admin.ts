import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin SDK configuration for Vercel deployment

const getServiceAccount = (): any => {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (typeof envKey === 'string' && envKey.length > 0) {
    return JSON.parse(envKey);
  }

  // For local development, try to load the file if it exists
  try {
    return require('../../firebaseSecretKey.json');
  } catch {
    throw new Error('Firebase service account key not found. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
  }
};

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: cert(getServiceAccount()),
  });

export const auth = getAuth();
