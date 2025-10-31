'use client';

import firebaseConfig from '@/app/config/constants/firebase.config';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let firebaseApp: FirebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

if (typeof window !== 'undefined' && auth.settings) {
    auth.settings.appVerificationDisabledForTesting =
        process.env.NEXT_PUBLIC_FIREBASE_DISABLE_APP_VERIFICATION === 'true';
}

export { firebaseApp, auth };
