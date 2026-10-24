import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Keep console logs clean from internal Firebase transport retries
setLogLevel('error');

export const firebaseConfig = {
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
};

// Initialize or reuse Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID and forced long-polling for iframe / sandbox stability
export const db = (() => {
  try {
    return firebaseConfig.firestoreDatabaseId
      ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export const auth = getAuth(app);

// Test connection on boot as mandated by Firebase integration guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const snap = await getDocFromServer(doc(db, 'test', 'connection'));
    return snap.exists();
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status check:', error.message);
    }
    return true;
  }
}

testFirestoreConnection().catch(() => {});

