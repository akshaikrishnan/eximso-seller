import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let initializationError: Error | null = null;

const initializeFirebaseAdmin = () => {
    if (adminApp || initializationError) {
        return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        initializationError = new Error(
            'Missing Firebase admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
        );
        return;
    }

    if (!getApps().length) {
        adminApp = initializeApp({
            credential: cert({ projectId, clientEmail, privateKey })
        });
    } else {
        adminApp = getApp();
    }

    adminAuth = getAuth(adminApp);
};

export const getFirebaseAdminAuth = (): Auth => {
    initializeFirebaseAdmin();

    if (initializationError) {
        throw initializationError;
    }

    if (!adminAuth) {
        adminAuth = getAuth(getApp());
    }

    return adminAuth;
};
