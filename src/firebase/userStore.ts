import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from './config.ts';
import { FamilyProfile, UserAccount } from '../types/astrology.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // In frontend UI, log error and allow local state fallback without crashing
  return errInfo;
}

/**
 * Save user profile to Firestore `users/{uid}`
 */
export async function saveUserToFirestore(user: UserAccount): Promise<boolean> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      id: user.uid,
      phone: user.phone,
      name: user.name,
      email: user.email || '',
      gender: user.gender || 'male',
      dob: user.dob || '',
      tob: user.tob || '',
      pob: user.pob || '',
      rashi: user.rashi || 'Mesha (Aries)',
      walletBalance: user.walletBalance,
      freeTrialClaimed: user.freeTrialClaimed,
      isVerified: user.isVerified,
      kundliSummary: user.kundliSummary || null,
      updatedAt: new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Save or update permanent Janam Kundli summary to user profile in Firestore
 */
export async function saveKundliSummaryToUser(
  uid: string,
  kundliSummary: any,
  birthDetails: {
    dob: string;
    tob: string;
    pob: string;
    rashi?: string;
    gender?: 'male' | 'female' | 'other';
    name?: string;
  }
): Promise<boolean> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        dob: birthDetails.dob,
        tob: birthDetails.tob,
        pob: birthDetails.pob,
        ...(birthDetails.rashi ? { rashi: birthDetails.rashi } : {}),
        ...(birthDetails.gender ? { gender: birthDetails.gender } : {}),
        ...(birthDetails.name ? { name: birthDetails.name } : {}),
        kundliSummary: {
          ...kundliSummary,
          updatedAt: new Date().toISOString(),
        },
        hasPermanentKundli: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Get user profile from Firestore `users/{uid}`
 */
export async function getUserFromFirestore(uid: string): Promise<UserAccount | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

/**
 * Get all family Kundli profiles from `users/{uid}/family_profiles`
 */
export async function getFamilyProfilesFromFirestore(uid: string): Promise<FamilyProfile[]> {
  const path = `users/${uid}/family_profiles`;
  try {
    const colRef = collection(db, 'users', uid, 'family_profiles');
    const snap = await getDocs(colRef);
    const list: FamilyProfile[] = [];
    snap.forEach((d) => {
      list.push(d.data() as FamilyProfile);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

/**
 * Save or update family Kundli profile to `users/{uid}/family_profiles/{profileId}`
 */
export async function saveFamilyProfileToFirestore(
  uid: string,
  profile: FamilyProfile
): Promise<boolean> {
  const path = `users/${uid}/family_profiles/${profile.id}`;
  try {
    const profRef = doc(db, 'users', uid, 'family_profiles', profile.id);
    await setDoc(profRef, {
      ...profile,
      userId: uid,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Delete family Kundli profile from `users/{uid}/family_profiles/{profileId}`
 */
export async function deleteFamilyProfileFromFirestore(
  uid: string,
  profileId: string
): Promise<boolean> {
  const path = `users/${uid}/family_profiles/${profileId}`;
  try {
    const profRef = doc(db, 'users', uid, 'family_profiles', profileId);
    await deleteDoc(profRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    return false;
  }
}
