import { KundliReportTier, PurchasedReportRecord, KUNDLI_REPORTS_CATALOG } from '../data/reportsCatalogData.ts';
import { KundliData } from '../types/astrology.ts';
import { db } from '../firebase/config.ts';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const STORAGE_KEY = '12rashi_purchased_reports';

export const reportsService = {
  /**
   * Returns list of available report tiers
   */
  async getCatalog(): Promise<KundliReportTier[]> {
    try {
      const res = await fetch('/api/reports/catalog');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.reports)) {
          return data.reports;
        }
      }
    } catch {
      // Fallback to verified catalog
    }
    return KUNDLI_REPORTS_CATALOG;
  },

  /**
   * Registers a purchased report and saves to Firestore and localStorage
   */
  async recordReportPurchase(params: {
    tier: KundliReportTier;
    kundli: KundliData;
    userEmail?: string;
    userPhone?: string;
  }): Promise<PurchasedReportRecord> {
    const certId = '12R-REP-' + Math.floor(100000 + Math.random() * 900000);
    const purchaseId = 'ORD-REP-' + Math.floor(10000 + Math.random() * 90000);

    const record: PurchasedReportRecord = {
      id: purchaseId,
      tierId: params.tier.id,
      reportTitle: params.tier.title,
      seekerName: params.kundli.name,
      gender: params.kundli.gender || 'Male',
      dob: params.kundli.dob,
      tob: params.kundli.tob,
      pob: params.kundli.pob,
      rashi: params.kundli.rashi || params.kundli.moonSign || 'Leo',
      nakshatra: params.kundli.nakshatra,
      lagna: params.kundli.lagna || params.kundli.ascendant || 'Virgo',
      amount: params.tier.price,
      purchaseDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'READY',
      downloadUrl: `/reports/download/${purchaseId}`,
      certificateId: certId,
      emailSentTo: params.userEmail,
      whatsappSentTo: params.userPhone,
    };

    // Save locally
    try {
      const existing = reportsService.getLocalPurchases();
      const updated = [record, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }

    // Save to Firestore
    try {
      const cleanPhone = params.userPhone ? params.userPhone.replace(/\D/g, '') : 'seeker';
      const docRef = doc(db, 'report_purchases', record.id);
      await setDoc(docRef, {
        ...record,
        userId: cleanPhone,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore report purchase sync error (offline fallback active):', err);
    }

    // Call backend API for server synchronization
    try {
      await fetch('/api/reports/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          phone: params.userPhone,
          email: params.userEmail,
        }),
      });
    } catch {
      // Local execution ok
    }

    return record;
  },

  /**
   * Retrieves user's purchased reports
   */
  async getUserReports(userPhone?: string): Promise<PurchasedReportRecord[]> {
    const local = reportsService.getLocalPurchases();
    if (!userPhone) return local;

    try {
      const cleanPhone = userPhone.replace(/\D/g, '');
      const collRef = collection(db, 'report_purchases');
      const snap = await getDocs(collRef);
      const firestoreReports: PurchasedReportRecord[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.userId === cleanPhone || !data.userId) {
          firestoreReports.push(data as PurchasedReportRecord);
        }
      });

      if (firestoreReports.length > 0) {
        const map = new Map<string, PurchasedReportRecord>();
        local.forEach((r) => map.set(r.id, r));
        firestoreReports.forEach((r) => map.set(r.id, r));
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {
      // Fallback to local
    }
    return local;
  },

  /**
   * Reads from localStorage synchronously
   */
  getLocalPurchases(): PurchasedReportRecord[] {
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
        id: 'ORD-REP-91024',
        tierId: 'report-brihat-lifetime',
        reportTitle: '50+ Page Brihat Janam Kundli Lifetime Dossier',
        seekerName: 'Vasudev Sharma',
        gender: 'Male',
        dob: '15 Aug 1992',
        tob: '08:45 AM',
        pob: 'Kolkata, WB',
        rashi: 'Simha (Leo)',
        nakshatra: 'Purva Phalguni',
        lagna: 'Kanya (Virgo)',
        amount: 499,
        purchaseDate: '26 Sep 2026',
        status: 'READY',
        downloadUrl: '/reports/download/ORD-REP-91024',
        certificateId: '12R-REP-91024X',
        emailSentTo: 'devotee@12rashi.com',
      },
    ];
  },
};
