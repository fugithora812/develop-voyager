import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import serviceAccount from '../../firebaseSecretKey.json';
export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    // @ts-expect-error eslint-disable-line
    credential: cert(serviceAccount),
  });

export const auth = getAuth();
