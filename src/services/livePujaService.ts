import { LivePujaItem, PujaBookingRecord, LIVE_PUJAS_CATALOG } from '../data/livePujaData.ts';
import { db } from '../firebase/config.ts';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY = '12rashi_live_puja_bookings';

export const livePujaService = {
  /**
   * Fetches active pujas catalog
   */
  async getLivePujas(): Promise<LivePujaItem[]> {
    try {
      const res = await fetch('/api/puja/list');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.pujas)) {
          return data.pujas;
        }
      }
    } catch {
      // Fallback to verified catalog
    }
    return LIVE_PUJAS_CATALOG;
  },

  /**
   * Books a one-time Puja or activates a Recurring Monthly/Weekly Subscription
   */
  async bookPuja(params: {
    puja: LivePujaItem;
    devoteeName: string;
    gotra: string;
    rashi: string;
    nakshatra?: string;
    sankalpWish: string;
    additionalFamilyMembers?: string[];
    bookingType: 'one_time' | 'monthly_subscription';
    userPhone?: string;
    userEmail?: string;
  }): Promise<{ success: boolean; booking: PujaBookingRecord; paymentSessionId?: string }> {
    const amount =
      params.bookingType === 'monthly_subscription'
        ? params.puja.monthlySubscriptionFee
        : params.puja.oneTimeDakshina;

    const certNum = 'CERT-VDC-' + Math.floor(100000 + Math.random() * 900000);
    const bookingId = (params.bookingType === 'monthly_subscription' ? 'SUB-' : 'BKG-') + Math.floor(10000 + Math.random() * 90000);

    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Compute next renewal date if subscription
    let nextRenewalDate: string | undefined = undefined;
    if (params.bookingType === 'monthly_subscription') {
      const nextMonth = new Date(today);
      if (params.puja.subscriptionFrequency === 'Weekly (साप्ताहिक)') {
        nextMonth.setDate(nextMonth.getDate() + 7);
      } else {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }
      nextRenewalDate = nextMonth.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const newBooking: PujaBookingRecord = {
      id: bookingId,
      pujaId: params.puja.id,
      pujaTitle: params.puja.title,
      templeName: params.puja.templeName,
      location: params.puja.location,
      devoteeName: params.devoteeName,
      gotra: params.gotra,
      rashi: params.rashi,
      nakshatra: params.nakshatra,
      sankalpWish: params.sankalpWish,
      additionalFamilyMembers: params.additionalFamilyMembers,
      bookingType: params.bookingType,
      amount,
      status: params.bookingType === 'monthly_subscription' ? 'ACTIVE_SUBSCRIPTION' : 'CONFIRMED',
      date: dateFormatted,
      nextRenewalDate,
      certificateNumber: certNum,
      liveStreamUrl: params.puja.embedStreamUrl,
    };

    // Save locally
    try {
      const existing = livePujaService.getLocalBookings();
      const updated = [newBooking, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }

    // Save to Firestore
    try {
      const cleanPhone = params.userPhone ? params.userPhone.replace(/\D/g, '') : 'seeker';
      const docRef = doc(db, 'puja_bookings', newBooking.id);
      await setDoc(docRef, {
        ...newBooking,
        userId: cleanPhone,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore puja booking sync warn (offline fallback active):', err);
    }

    // Call backend API for server synchronization & DLT notification
    try {
      await fetch('/api/puja/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBooking,
          phone: params.userPhone,
          email: params.userEmail,
        }),
      });
    } catch {
      // Local execution ok
    }

    return {
      success: true,
      booking: newBooking,
    };
  },

  /**
   * Retrieves all user bookings from localStorage and Firestore
   */
  async getUserBookings(userPhone?: string): Promise<PujaBookingRecord[]> {
    const local = livePujaService.getLocalBookings();
    if (!userPhone) return local;

    try {
      const cleanPhone = userPhone.replace(/\D/g, '');
      const collRef = collection(db, 'puja_bookings');
      const snap = await getDocs(collRef);
      const firestoreBookings: PujaBookingRecord[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId === cleanPhone || !data.userId) {
          firestoreBookings.push(data as PujaBookingRecord);
        }
      });

      if (firestoreBookings.length > 0) {
        // Merge without duplicates
        const map = new Map<string, PujaBookingRecord>();
        local.forEach((b) => map.set(b.id, b));
        firestoreBookings.forEach((b) => map.set(b.id, b));
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {
      // Return local cache on failure
    }
    return local;
  },

  /**
   * Reads from localStorage synchronously
   */
  getLocalBookings(): PujaBookingRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'BKG-8921',
        pujaId: 'puja-kashi-rudra',
        pujaTitle: 'Maha Rudrabhishek & Ganga Aarti Sankalp',
        templeName: 'Shri Kashi Vishwanath Jyotirlinga',
        location: 'Varanasi (Kashi), Uttar Pradesh',
        devoteeName: 'Vasudev Sharma',
        gotra: 'Kashyap',
        rashi: 'Simha (Leo)',
        sankalpWish: 'Good health, removal of Saturn obstacles, and family prosperity',
        bookingType: 'one_time',
        amount: 501,
        status: 'CONFIRMED',
        date: '28 Sep 2026',
        certificateNumber: 'CERT-VDC-892101',
        liveStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8Wc5V1T5n_x2tL-KashiVishwanath',
      },
    ];
  },

  /**
   * Cancels a recurring subscription
   */
  async cancelSubscription(bookingId: string): Promise<boolean> {
    try {
      const existing = livePujaService.getLocalBookings();
      const updated = existing.map((b) =>
        b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Update in Firestore
      const docRef = doc(db, 'puja_bookings', bookingId);
      await updateDoc(docRef, { status: 'CANCELLED' });

      // Notify backend
      await fetch('/api/puja/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      return true;
    } catch {
      return false;
    }
  },
};
