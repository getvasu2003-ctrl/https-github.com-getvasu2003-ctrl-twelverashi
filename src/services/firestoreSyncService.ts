import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config.ts';

export interface UserProfileData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  rashi: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  subscription: string;
  walletBalance?: number;
}

export const firestoreSyncService = {
  /**
   * Syncs user profile and wallet balance to Cloud Firestore
   */
  async saveUserProfile(user: UserProfileData, walletBalance?: number) {
    try {
      const cleanPhone = user.phone ? user.phone.replace(/\D/g, '') : 'default_user';
      const userRef = doc(db, 'users', cleanPhone);

      await setDoc(
        userRef,
        {
          id: cleanPhone,
          name: user.name || 'Seeker',
          phone: user.phone || '',
          email: user.email || '',
          rashi: user.rashi || 'Mesh (Aries)',
          gender: user.gender || 'Male',
          dob: user.dob || '',
          tob: user.tob || '',
          pob: user.pob || '',
          subscription: user.subscription || 'none',
          walletBalance: typeof walletBalance === 'number' ? walletBalance : 500,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.warn('Firestore user profile sync error (offline fallback active):', err);
      return false;
    }
  },

  /**
   * Fetches user profile from Firestore if it exists
   */
  async getUserProfile(phone: string): Promise<UserProfileData | null> {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone) return null;

      const userRef = doc(db, 'users', cleanPhone);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        return snap.data() as UserProfileData;
      }
    } catch (err) {
      console.warn('Firestore fetch user error:', err);
    }
    return null;
  },

  /**
   * Persists a wallet transaction to Firestore
   */
  async logWalletTransaction(
    phone: string,
    tx: {
      amount: number;
      type: 'credit' | 'debit';
      description: string;
      referenceId?: string;
    }
  ) {
    try {
      const cleanPhone = phone ? phone.replace(/\D/g, '') : 'default_user';
      const txsRef = collection(db, 'users', cleanPhone, 'transactions');
      await addDoc(txsRef, {
        ...tx,
        userId: cleanPhone,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore transaction log error:', err);
    }
  },

  /**
   * Persists completed consultation session to Firestore
   */
  async recordConsultation(record: {
    id: string;
    userId: string;
    astrologerId: string;
    astrologerName: string;
    type: string;
    ratePerMin: number;
    durationSeconds: number;
    totalAmount: number;
    notes?: string;
    remedies?: string;
  }) {
    try {
      const docRef = doc(db, 'consultations', record.id);
      await setDoc(docRef, {
        ...record,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore record consultation error:', err);
    }
  },

  /**
   * Persists AstroStore order to Firestore
   */
  async saveStoreOrder(order: {
    id: string;
    userId: string;
    items: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: string;
    cashfreeOrderId?: string;
  }) {
    try {
      const docRef = doc(db, 'orders', order.id);
      await setDoc(docRef, {
        ...order,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore save order error:', err);
    }
  },
};
