import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Astrologer,
  ConsultationType,
  PaymentTransaction,
  TransitNotification,
  KundliData,
  PartnerAuthUser,
  PartnerConsultationRecord,
  PartnerPayoutRecord,
  PartnerSchedule,
  FamilyProfile,
  UserAccount,
  ScheduledBooking,
  AsyncQuestion,
  MorningPushSubscription,
  DoshaBookingContext,
  TransitNudge,
  ConsultationArchiveRecord,
  KundliSummary,
} from '../types/astrology.ts';
import { INITIAL_ASTROLOGERS } from '../data/astrologersData.ts';
import { calculateKundli } from '../services/kundliCalculator.ts';
import { dispatchDltSms } from '../services/apiService.ts';
import {
  INITIAL_FAMILY_PROFILES,
  INITIAL_SCHEDULED_BOOKINGS,
  INITIAL_ASYNC_QUESTIONS,
  PERSONALIZED_TRANSIT_NUDGES,
  INITIAL_CONSULTATION_ARCHIVE,
} from '../data/lentloFeaturesData.ts';
import { firestoreSyncService } from '../services/firestoreSyncService.ts';
import {
  saveUserToFirestore,
  getUserFromFirestore,
  getFamilyProfilesFromFirestore,
  saveFamilyProfileToFirestore,
  deleteFamilyProfileFromFirestore,
  saveKundliSummaryToUser,
} from '../firebase/userStore.ts';
import { fcmService } from '../services/fcmService.ts';
import { audioSynthesis } from '../services/audioSynthesisService.ts';
import { nativeNotificationService } from '../services/nativeNotificationService.ts';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  // User Info
  userProfile: {
    name: string;
    phone: string;
    email: string;
    rashi: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    subscription: 'none' | 'gold' | 'platinum';
  };
  updateUserProfile: (data: Partial<AppContextType['userProfile']>) => void;
  // Partner (Astrologer) Profile & Auth
  isPartnerAuthenticated: boolean;
  partnerAuthUser: PartnerAuthUser | null;
  loginPartner: (astrologerId: string, customPhone?: string) => Promise<boolean>;
  logoutPartner: () => void;
  registerPartner: (newAstro: Partial<Astrologer>, phone: string, email: string) => Promise<boolean>;
  partnerAstrologer: Astrologer;
  updatePartnerProfile: (updated: Partial<Astrologer>) => void;
  updatePartnerStatus: (status: 'online' | 'busy' | 'offline') => void;
  updatePartnerRates: (rates: { callRate?: number; chatRate?: number; videoRate?: number }) => void;
  partnerSchedule: PartnerSchedule;
  updatePartnerSchedule: (sched: Partial<PartnerSchedule>) => void;
  partnerEarnings: {
    today: number;
    week: number;
    month: number;
    totalConsultations: number;
    pendingPayout: number;
  };
  partnerConsultationRecords: PartnerConsultationRecord[];
  addConsultationNoteAndRemedy: (id: string, notes: string, remedy: string) => void;
  partnerPayoutRecords: PartnerPayoutRecord[];
  requestPartnerPayout: (amount: number, method: 'UPI' | 'NEFT/IMPS', accountDetails: string) => void;
  incomingConsultation: {
    id: string;
    clientName: string;
    type: ConsultationType;
    ratePerMin: number;
    timestamp: number;
  } | null;
  acceptIncomingConsultation: () => void;
  rejectIncomingConsultation: () => void;
  // Wallet & Payments
  walletBalance: number;
  rechargeWallet: (amount: number, method: string, bonusPercent?: number) => Promise<string>;
  deductWallet: (amount: number, description: string) => boolean;
  transactions: PaymentTransaction[];
  // Active Consultation
  activeConsultation: {
    astrologer: Astrologer;
    type: ConsultationType;
    startTime: number;
    elapsedSeconds: number;
    totalDeducted: number;
    isFreeTrial?: boolean;
    freeSecondsRemaining?: number;
  } | null;
  startConsultation: (astro: Astrologer, type: ConsultationType) => boolean;
  endConsultation: () => void;
  // Kundli
  currentKundli: KundliData | null;
  setCurrentKundli: (k: KundliData | null) => void;
  savedKundlis: KundliData[];
  saveKundli: (k: KundliData) => void;
  // Dark mode & Localization
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  // Notifications & Transits
  notifications: TransitNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: TransitNotification['type']) => void;
  pushPermission: 'default' | 'granted' | 'denied';
  requestPushPermission: () => Promise<void>;
  sendDailyHoroscopePush: (rashiName?: string) => Promise<boolean>;
  sendConsultationReminderPush: (
    booking: ScheduledBooking,
    type?: 'confirmed' | 'upcoming_15m' | 'starting_now'
  ) => Promise<boolean>;
  // UI Dialog Controls
  openPaymentModal: boolean;
  setOpenPaymentModal: (open: boolean) => void;
  openDltModal: boolean;
  setOpenDltModal: (open: boolean) => void;
  openLuckyWheel: boolean;
  setOpenLuckyWheel: (open: boolean) => void;
  openLiveStream: boolean;
  setOpenLiveStream: (open: boolean) => void;
  astrologers: Astrologer[];

  // Lentlo Features & Family Kundli Vault (Up to 10)
  familyProfiles: FamilyProfile[];
  activeFamilyProfile: FamilyProfile | null;
  setActiveFamilyProfile: (p: FamilyProfile | null) => void;
  addFamilyProfile: (p: Omit<FamilyProfile, 'id'>) => boolean;
  updateFamilyProfile: (id: string, data: Partial<FamilyProfile>) => void;
  deleteFamilyProfile: (id: string) => void;

  // User Account & Mobile Number Verification
  user: UserAccount | null;
  isUserLoggedIn: boolean;
  openLoginModal: boolean;
  setOpenLoginModal: (open: boolean) => void;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  logoutUser: () => void;
  updateUserAccount: (data: Partial<UserAccount>) => void;

  scheduledBookings: ScheduledBooking[];
  addScheduledBooking: (b: Omit<ScheduledBooking, 'id' | 'bookedAt' | 'status'>) => void;
  cancelScheduledBooking: (id: string) => void;

  asyncQuestions: AsyncQuestion[];
  submitAsyncQuestion: (q: Omit<AsyncQuestion, 'id' | 'status' | 'submittedAt'>) => void;
  answerAsyncQuestion: (
    id: string,
    answerText: string,
    remedy?: string,
    audioDurationSecs?: number,
    remedyMantra?: string,
    remedyMuhurat?: string
  ) => void;
  simulateAcharyaReply: (id: string) => void;

  morningPushSubscription: MorningPushSubscription;
  updateMorningPushSubscription: (sub: Partial<MorningPushSubscription>) => void;
  triggerTestMorningPush: () => void;

  panchangCity: string;
  setPanchangCity: (c: string) => void;

  transitNudges: TransitNudge[];
  consultationArchive: ConsultationArchiveRecord[];
  addConsultationArchive: (rec: ConsultationArchiveRecord) => void;

  membershipTier: 'free' | 'silver' | 'gold' | 'platinum';
  setMembershipTier: (t: 'free' | 'silver' | 'gold' | 'platinum') => void;

  openFamilyModal: boolean;
  setOpenFamilyModal: (open: boolean) => void;
  openSlotBookingModal: boolean;
  setOpenSlotBookingModal: (open: boolean) => void;
  selectedBookingAstrologer: Astrologer | null;
  setSelectedBookingAstrologer: (a: Astrologer | null) => void;
  openAsyncQuestionModal: boolean;
  setOpenAsyncQuestionModal: (open: boolean) => void;
  openWhatsAppReceiptModal: boolean;
  setOpenWhatsAppReceiptModal: (open: boolean) => void;
  selectedReceiptRecord: ConsultationArchiveRecord | null;
  setSelectedReceiptRecord: (r: ConsultationArchiveRecord | null) => void;
  openVideoIntroModal: boolean;
  setOpenVideoIntroModal: (open: boolean) => void;
  selectedVideoAstro: Astrologer | null;
  setSelectedVideoAstro: (a: Astrologer | null) => void;
  openMembershipModal: boolean;
  setOpenMembershipModal: (open: boolean) => void;
  openFairBillingModal: boolean;
  setOpenFairBillingModal: (open: boolean) => void;
  openQrStandeeModal: boolean;
  setOpenQrStandeeModal: (open: boolean) => void;
  selectedProfileAstrologer: Astrologer | null;
  setSelectedProfileAstrologer: (a: Astrologer | null) => void;
  openLegalModal: boolean;
  setOpenLegalModal: (open: boolean) => void;
  openCustomDomainModal: boolean;
  setOpenCustomDomainModal: (open: boolean) => void;
  openPlayStoreModal: boolean;
  setOpenPlayStoreModal: (open: boolean) => void;
  legalModalTab: 'disclaimer' | 'privacy' | 'terms' | 'grievance' | 'deletion';
  setLegalModalTab: (tab: 'disclaimer' | 'privacy' | 'terms' | 'grievance' | 'deletion') => void;
  hasClaimedFreeTrial: boolean;
  claimFreeTrial: () => void;
  openKundliPdfModal: boolean;
  setOpenKundliPdfModal: (open: boolean) => void;
  queueStatus: { astrologerId: string; position: number; estimatedWaitMins: number } | null;
  joinQueue: (astrologerId: string) => void;
  leaveQueue: () => void;
  openDoshaBookingModal: boolean;
  doshaBookingContext: DoshaBookingContext | null;
  openDoshaBooking: (ctx: DoshaBookingContext) => void;
  closeDoshaBooking: () => void;
  openTatkalModal: boolean;
  setOpenTatkalModal: (open: boolean) => void;
  openOnboardingModal: boolean;
  setOpenOnboardingModal: (open: boolean) => void;
  openAstroProfileModal: boolean;
  setOpenAstroProfileModal: (open: boolean) => void;
  saveAstroProfile: (birthDetails: {
    name: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
    tob: string;
    pob: string;
  }) => Promise<KundliSummary>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('user');
  const [astrologers, setAstrologers] = useState<Astrologer[]>(INITIAL_ASTROLOGERS);

  // User details
  const [userProfile, setUserProfile] = useState<{
    name: string;
    phone: string;
    email: string;
    rashi: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    subscription: 'none' | 'gold' | 'platinum';
  }>(() => {
    try {
      const stored = localStorage.getItem('12rashi_user_profile');
      if (stored) return JSON.parse(stored);
      const userStored = localStorage.getItem('12rashi_user');
      if (userStored) {
        const u = JSON.parse(userStored);
        return {
          name: u.name || '',
          phone: u.phone || '',
          email: u.email || '',
          rashi: u.rashi || '',
          gender: u.gender || 'Male',
          dob: u.dob || '',
          tob: u.tob || '12:00',
          pob: u.pob || '',
          subscription: 'none',
        };
      }
    } catch {}
    return {
      name: '',
      phone: '',
      email: '',
      rashi: '',
      gender: 'Male',
      dob: '',
      tob: '12:00',
      pob: '',
      subscription: 'none',
    };
  });

  // Partner Authentication & Profiles
  const [isPartnerAuthenticated, setIsPartnerAuthenticated] = useState<boolean>(false);
  const [partnerAuthUser, setPartnerAuthUser] = useState<PartnerAuthUser | null>(null);

  const [partnerAstrologer, setPartnerAstrologer] = useState<Astrologer>(INITIAL_ASTROLOGERS[0]);

  // Partner weekly availability schedule
  const [partnerSchedule, setPartnerSchedule] = useState<PartnerSchedule>({
    autoOnline: true,
    workingHours: {
      Monday: { enabled: true, from: '09:00 AM', to: '09:00 PM' },
      Tuesday: { enabled: true, from: '09:00 AM', to: '09:00 PM' },
      Wednesday: { enabled: true, from: '09:00 AM', to: '09:00 PM' },
      Thursday: { enabled: true, from: '09:00 AM', to: '09:00 PM' },
      Friday: { enabled: true, from: '09:00 AM', to: '09:00 PM' },
      Saturday: { enabled: true, from: '09:00 AM', to: '10:00 PM' },
      Sunday: { enabled: true, from: '10:00 AM', to: '08:00 PM' },
    },
    breakMode: false,
    breakDurationMins: 15,
    promotionalOfferActive: true,
    promotionalDiscountPercent: 20,
  });

  const [partnerEarnings, setPartnerEarnings] = useState({
    today: 2850,
    week: 18400,
    month: 64200,
    totalConsultations: 124,
    pendingPayout: 18400,
  });

  // Partner past consultation records
  const [partnerConsultationRecords, setPartnerConsultationRecords] = useState<PartnerConsultationRecord[]>([
    {
      id: 'CR-101',
      clientName: 'Rohan Gupta',
      clientPhone: '+91 98310*****',
      clientRashi: 'Aries (Mesha)',
      clientCity: 'Kolkata, WB',
      type: 'audio',
      date: 'Today, 11:20 AM',
      durationMinutes: 14,
      ratePerMin: 25,
      grossAmount: 350,
      netEarned: 245, // 70% of 350 (70/30 revenue share)
      rating: 5,
      reviewText: 'Acharyaji predicted my promotion month with 100% accuracy. Very blessed reading!',
      notes: 'Jupiter transit in 9th house indicates high overseas fortune in Nov 2026. Prescribed Yellow Sapphire or 5 Mukhi Rudraksha.',
      prescribedRemedies: ['Natural Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti', 'Gayatri Mantra 108x daily at sunrise'],
      status: 'completed',
    },
    {
      id: 'CR-102',
      clientName: 'Deepika Sen',
      clientPhone: '+91 94330*****',
      clientRashi: 'Cancer (Karka)',
      clientCity: 'Howrah, WB',
      type: 'chat',
      date: 'Yesterday, 06:45 PM',
      durationMinutes: 22,
      ratePerMin: 20,
      grossAmount: 440,
      netEarned: 308, // 70% of 440 (70/30 revenue share)
      rating: 5,
      reviewText: 'Prescribed simple remedies for Manglik dosha. Extremely patient and scholarly.',
      notes: 'Boy has Mars in 8th house, girl has Moon-Saturn conjunction. Recommended Hanuman Chalisa and silver snake pair ritual.',
      prescribedRemedies: ['24K Gold-Plated Meru Prustha Shree Yantra', 'Hanuman Chalisa recitation on Tuesdays'],
      status: 'completed',
    },
    {
      id: 'CR-103',
      clientName: 'Amitabh Banerji',
      clientPhone: '+91 98301*****',
      clientRashi: 'Leo (Simha)',
      clientCity: 'Kolkata, WB',
      type: 'video',
      date: '26 Sep 2026, 04:15 PM',
      durationMinutes: 20,
      ratePerMin: 45,
      grossAmount: 900,
      netEarned: 630, // 70% of 900 (70/30 revenue share)
      rating: 4.9,
      reviewText: 'Excellent advice on entrance door placement without any wall demolition.',
      notes: 'Main factory gate was in South-West Nairutya kona causing cash blockage. Advised copper pyramid installation.',
      prescribedRemedies: ['Navgraha Shanti & Dosh Nivaran Complete Vedic Pooja Kit'],
      status: 'completed',
    },
    {
      id: 'CR-104',
      clientName: 'Priya Mukherjee',
      clientPhone: '+91 98311*****',
      clientRashi: 'Taurus (Vrishabha)',
      clientCity: 'Salt Lake, Kolkata',
      type: 'chat',
      date: '25 Sep 2026, 08:30 PM',
      durationMinutes: 18,
      ratePerMin: 20,
      grossAmount: 360,
      netEarned: 252, // 70% of 360 (70/30 revenue share)
      rating: 5,
      reviewText: 'Calmed my mind and explained the Rahu Antardasha timeline so clearly.',
      notes: 'Rahu Mahadasha active. Advised feeding black dogs on Saturdays and wearing silver ring.',
      prescribedRemedies: ['Original 5 Mukhi Nepali Rudraksha Mala'],
      status: 'completed',
    },
  ]);

  // Partner past payout records
  const [partnerPayoutRecords, setPartnerPayoutRecords] = useState<PartnerPayoutRecord[]>([
    {
      id: 'PO-9821',
      amount: 12500,
      method: 'UPI',
      destinationAccount: '9831039814@upi',
      utrNumber: 'UPI/428901842019/12R',
      requestedDate: '24 Sep 2026',
      status: 'PROCESSED',
    },
    {
      id: 'PO-9822',
      amount: 15200,
      method: 'NEFT/IMPS',
      destinationAccount: 'HDFC Bank A/C ...9814 (IFSC: HDFC0000124)',
      utrNumber: 'HDFC983103981421',
      requestedDate: '17 Sep 2026',
      status: 'PROCESSED',
    },
  ]);

  const [incomingConsultation, setIncomingConsultation] = useState<{
    id: string;
    clientName: string;
    type: ConsultationType;
    ratePerMin: number;
    timestamp: number;
  } | null>(null);

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('12rashi_wallet_balance');
      if (stored !== null) return Number(stored);
    } catch {}
    return 100; // ₹100 Welcome Shubh Shagun Bonus for first consultation
  });
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('12rashi_transactions');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'TXN12R-WELCOME',
        amount: 100,
        type: 'credit',
        category: 'recharge',
        method: 'PROMO',
        description: '12Rashi Welcome Bonus & First Consultation Credit',
        timestamp: 'Welcome Shagun',
        status: 'SUCCESS',
        balanceAfter: 100,
      },
    ];
  });

  // Consultation
  const [activeConsultation, setActiveConsultation] = useState<AppContextType['activeConsultation']>(null);

  // Saved & Active Kundli
  const [savedKundlis, setSavedKundlis] = useState<KundliData[]>([]);
  const [currentKundli, setCurrentKundli] = useState<KundliData | null>(null);

  // Initialize default Kundli only if user has birth details
  useEffect(() => {
    if (userProfile.name && userProfile.dob && userProfile.pob) {
      const defaultK = calculateKundli(
        userProfile.name,
        userProfile.gender,
        userProfile.dob,
        userProfile.tob || '12:00',
        userProfile.pob
      );
      setCurrentKundli(defaultK);
      setSavedKundlis([defaultK]);
    }
  }, [userProfile.name, userProfile.gender, userProfile.dob, userProfile.tob, userProfile.pob]);

  // Theme & Language
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem('12rashi_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('12rashi_language', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Push Notifications & Planetary Transits
  const [pushPermission, setPushPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [notifications, setNotifications] = useState<TransitNotification[]>([
    {
      id: 'notif-1',
      title: 'Auspicious Abhijit Muhurat Today',
      message: 'Abhijit Muhurat is active from 11:48 AM to 12:36 PM. Ideal for starting financial and educational work.',
      timestamp: '15 mins ago',
      type: 'muhurat',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Chandra Transit Alert (Moon in Vrishabha)',
      message: 'Chandra has entered exalted Taurus. Favorable planetary wave for artistic, culinary, and romantic projects.',
      timestamp: '2 hours ago',
      type: 'transit',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Rahu Kaal Warning Today',
      message: 'Rahu Kaal will occur today from 04:30 PM to 06:00 PM. Avoid executing new business agreements during this time.',
      timestamp: 'Today 07:00 AM',
      type: 'rahu_kaal',
      read: false,
    },
  ]);

  // Modal dialog states
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [openDltModal, setOpenDltModal] = useState<boolean>(false);
  const [openLuckyWheel, setOpenLuckyWheel] = useState<boolean>(false);
  const [openLiveStream, setOpenLiveStream] = useState<boolean>(false);

  // User Account & Mobile Auth States
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('12rashi_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  // Lentlo Feature States & Family Vault (Max 10)
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>(() => {
    try {
      const stored = localStorage.getItem('12rashi_family_vault');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 10);
        }
      }
    } catch {}
    return INITIAL_FAMILY_PROFILES.slice(0, 10);
  });
  const [activeFamilyProfile, setActiveFamilyProfile] = useState<FamilyProfile | null>(() => {
    try {
      const stored = localStorage.getItem('12rashi_family_vault');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch {}
    return null;
  });
  const [scheduledBookings, setScheduledBookings] = useState<ScheduledBooking[]>(() => {
    try {
      const saved = localStorage.getItem('12rashi_scheduled_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_SCHEDULED_BOOKINGS;
  });
  const [asyncQuestions, setAsyncQuestions] = useState<AsyncQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('12rashi_async_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ASYNC_QUESTIONS;
  });

  const [morningPushSubscription, setMorningPushSubscription] = useState<MorningPushSubscription>(() => {
    try {
      const saved = localStorage.getItem('12rashi_morning_push');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: false,
      timeSlot: '06:30',
      targetRashi: '',
      whatsappAlerts: false,
      whatsappPhone: '',
      browserPushAllowed: false,
      subscriptionPlan: 'trial',
      trialDaysLeft: 7,
      includeAudioFal: true,
      includeMuhuratAlerts: true,
      includeRahuKaalWarning: true,
    };
  });
  const [panchangCity, setPanchangCity] = useState<string>('Kolkata');
  const [transitNudges] = useState<TransitNudge[]>(PERSONALIZED_TRANSIT_NUDGES);
  const [consultationArchive, setConsultationArchive] = useState<ConsultationArchiveRecord[]>(INITIAL_CONSULTATION_ARCHIVE);
  const [membershipTier, setMembershipTier] = useState<'free' | 'silver' | 'gold' | 'platinum'>('free');

  // Lentlo Dialog Controls
  const [openFamilyModal, setOpenFamilyModal] = useState<boolean>(false);
  const [openSlotBookingModal, setOpenSlotBookingModal] = useState<boolean>(false);
  const [selectedBookingAstrologer, setSelectedBookingAstrologer] = useState<Astrologer | null>(null);
  const [openAsyncQuestionModal, setOpenAsyncQuestionModal] = useState<boolean>(false);
  const [openWhatsAppReceiptModal, setOpenWhatsAppReceiptModal] = useState<boolean>(false);
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<ConsultationArchiveRecord | null>(null);
  const [openVideoIntroModal, setOpenVideoIntroModal] = useState<boolean>(false);
  const [selectedVideoAstro, setSelectedVideoAstro] = useState<Astrologer | null>(null);
  const [openMembershipModal, setOpenMembershipModal] = useState<boolean>(false);
  const [openFairBillingModal, setOpenFairBillingModal] = useState<boolean>(false);
  const [openQrStandeeModal, setOpenQrStandeeModal] = useState<boolean>(false);
  const [selectedProfileAstrologer, setSelectedProfileAstrologer] = useState<Astrologer | null>(() => {
    if (typeof window !== 'undefined') {
      const astroId = new URLSearchParams(window.location.search).get('astrologer');
      if (astroId) {
        return INITIAL_ASTROLOGERS.find((a) => a.id === astroId) || null;
      }
    }
    return null;
  });
  const [openLegalModal, setOpenLegalModal] = useState<boolean>(false);
  const [openDoshaBookingModal, setOpenDoshaBookingModalState] = useState<boolean>(false);
  const [doshaBookingContext, setDoshaBookingContext] = useState<DoshaBookingContext | null>(null);

  const openDoshaBooking = (ctx: DoshaBookingContext) => {
    setDoshaBookingContext(ctx);
    setOpenDoshaBookingModalState(true);
  };

  const closeDoshaBooking = () => {
    setOpenDoshaBookingModalState(false);
    setDoshaBookingContext(null);
  };
  const [openTatkalModal, setOpenTatkalModal] = useState<boolean>(false);
  const [openCustomDomainModal, setOpenCustomDomainModal] = useState<boolean>(false);
  const [openPlayStoreModal, setOpenPlayStoreModal] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'disclaimer' | 'privacy' | 'terms' | 'grievance' | 'deletion'>('disclaimer');
  const [hasClaimedFreeTrial, setHasClaimedFreeTrial] = useState<boolean>(() => {
    try {
      return localStorage.getItem('12rashi_claimed_trial') === 'true';
    } catch {
      return false;
    }
  });
  const claimFreeTrial = () => {
    setHasClaimedFreeTrial(true);
    try {
      localStorage.setItem('12rashi_claimed_trial', 'true');
    } catch {
      // ignore
    }
  };
  const [openKundliPdfModal, setOpenKundliPdfModal] = useState<boolean>(false);
  const [openOnboardingModal, setOpenOnboardingModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem('12rashi_onboarding_completed') !== 'true';
    } catch {
      return false;
    }
  });
  const [openAstroProfileModal, setOpenAstroProfileModal] = useState<boolean>(false);
  const [queueStatus, setQueueStatus] = useState<{ astrologerId: string; position: number; estimatedWaitMins: number } | null>(null);

  // Native Device Push Notifications & Consultation Reminder Monitoring
  useEffect(() => {
    if (nativeNotificationService.isSupported()) {
      setPushPermission(nativeNotificationService.getPermissionStatus() as any);
    }

    nativeNotificationService.startBackgroundScheduler(
      () => scheduledBookings,
      () => userProfile.rashi || morningPushSubscription.targetRashi,
      () => morningPushSubscription
    );

    return () => {
      nativeNotificationService.stopBackgroundScheduler();
    };
  }, [scheduledBookings, userProfile.rashi, morningPushSubscription]);

  // Sync with Firestore when logged in
  useEffect(() => {
    if (user?.uid) {
      getFamilyProfilesFromFirestore(user.uid).then((cloudProfiles) => {
        if (cloudProfiles && cloudProfiles.length > 0) {
          setFamilyProfiles(cloudProfiles.slice(0, 10));
          setActiveFamilyProfile(cloudProfiles[0]);
          try {
            localStorage.setItem('12rashi_family_vault', JSON.stringify(cloudProfiles.slice(0, 10)));
          } catch {}
        }
      }).catch((err) => console.warn('Could not sync cloud family profiles:', err));
    }
  }, [user?.uid]);

  const loginWithPhone = async (phone: string, name?: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const uid = 'user_' + cleanPhone;

    let existingProfile = await getUserFromFirestore(uid);
    let currentUserData: UserAccount;

    if (existingProfile) {
      currentUserData = {
        ...existingProfile,
        isVerified: true,
      };
    } else {
      currentUserData = {
        uid,
        phone: cleanPhone,
        name: name || 'Astro Seeker',
        walletBalance: 100,
        freeTrialClaimed: true,
        createdAt: new Date().toISOString(),
        isVerified: true,
      };
      await saveUserToFirestore(currentUserData);
    }

    setUser(currentUserData);
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        name: currentUserData.name || prev.name,
        phone: currentUserData.phone || prev.phone,
        rashi: currentUserData.rashi || prev.rashi,
        gender: currentUserData.gender || prev.gender,
        dob: currentUserData.dob || prev.dob,
        tob: currentUserData.tob || prev.tob,
        pob: currentUserData.pob || prev.pob,
      };
      try {
        localStorage.setItem('12rashi_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    try {
      localStorage.setItem('12rashi_user', JSON.stringify(currentUserData));
    } catch {}

    // Load saved family profiles from Firestore
    try {
      const cloudProfiles = await getFamilyProfilesFromFirestore(uid);
      if (cloudProfiles && cloudProfiles.length > 0) {
        setFamilyProfiles(cloudProfiles.slice(0, 10));
        setActiveFamilyProfile(cloudProfiles[0]);
      }
    } catch (err) {
      console.warn('Could not load cloud family profiles:', err);
    }

    addNotification(
      'Account Verified',
      `Welcome to 12Rashi, ${currentUserData.name}! 5-Min Free Consultation Voucher Active.`,
      'muhurat'
    );
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('12rashi_user');
    } catch {}
    addNotification('Logged Out', 'You have been signed out safely.', 'transit');
  };

  const updateUserAccount = (data: Partial<UserAccount>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('12rashi_user', JSON.stringify(updated));
      } catch {}
      saveUserToFirestore(updated).catch(() => {});
      return updated;
    });
  };

  const saveAstroProfile = async (birthDetails: {
    name: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
    tob: string;
    pob: string;
  }): Promise<KundliSummary> => {
    // 1. Calculate Janam Kundli
    const calculatedKundli = calculateKundli(
      birthDetails.name,
      birthDetails.gender,
      birthDetails.dob,
      birthDetails.tob,
      birthDetails.pob
    );

    setCurrentKundli(calculatedKundli);

    const asc = calculatedKundli.ascendant || calculatedKundli.lagna || 'Mesha (Aries)';
    const moon = calculatedKundli.moonSign || calculatedKundli.rashi || 'Mesha (Aries)';
    const sun = calculatedKundli.sunSign || 'Simha (Leo)';
    const nak = calculatedKundli.nakshatra || 'Ashwini';
    const nakLord = calculatedKundli.nakshatraLord || 'Ketu';

    const SIGN_LORDS_MAP: Record<string, string> = {
      'Aries (Mesha)': 'Mars (मंगल)',
      'Taurus (Vrishabha)': 'Venus (शुक्र)',
      'Gemini (Mithuna)': 'Mercury (बुध)',
      'Cancer (Karka)': 'Moon (चन्द्र)',
      'Leo (Simha)': 'Sun (सूर्य)',
      'Virgo (Kanya)': 'Mercury (बुध)',
      'Libra (Tula)': 'Venus (शुक्र)',
      'Scorpio (Vrishchika)': 'Mars (मंगल)',
      'Sagittarius (Dhanu)': 'Jupiter (गुरु)',
      'Capricorn (Makara)': 'Saturn (शनि)',
      'Aquarius (Kumbha)': 'Saturn (शनि)',
      'Pisces (Meena)': 'Jupiter (गुरु)',
    };

    const ascLord = calculatedKundli.ascendantLord || SIGN_LORDS_MAP[asc] || 'Mars (मंगल)';
    const moonLord = SIGN_LORDS_MAP[moon] || 'Mars (मंगल)';

    // Deterministic Ashtakoot attributes
    const varnaList = ['Brahmin (विप्र)', 'Kshatriya (क्षत्रिय)', 'Vaishya (वैश्य)', 'Shudra (शूद्र)'];
    const yoniList = ['Ashwa (Horse)', 'Gaja (Elephant)', 'Mesha (Ram)', 'Sarpa (Serpent)', 'Simha (Lion)', 'Go (Cow)', 'Vyaghra (Tiger)'];
    const ganaList = ['Deva Gana (दैव)', 'Manushya Gana (मानव)', 'Rakshasa Gana (राक्षस)'];
    const nadiList = ['Adi (आदि)', 'Madhya (मध्य)', 'Antya (अन्त्य)'];

    const charanNum = ((nak.length * 3) % 4) + 1;
    const varnaVal = varnaList[moon.length % 4];
    const vashyaVal = moon.includes('Cancer') || moon.includes('Pisces') ? 'Jalachar (Water)' : 'Chatushpada (Quadruped)';
    const yoniVal = yoniList[nak.length % 7];
    const ganaVal = ganaList[nak.length % 3];
    const nadiVal = nadiList[nak.length % 3];

    // 2. Build summary
    const summary: KundliSummary = {
      ascendant: asc,
      ascendantLord: ascLord,
      moonSign: moon,
      moonSignLord: moonLord,
      sunSign: sun,
      nakshatra: nak,
      nakshatraLord: nakLord,
      charan: charanNum,
      varna: varnaVal,
      vashya: vashyaVal,
      yoni: yoniVal,
      gana: ganaVal,
      nadi: nadiVal,
      currentMahadasha: calculatedKundli.vimshottariDasha?.currentMahadasha?.planet || 'Jupiter (गुरु)',
      currentAntardasha: calculatedKundli.vimshottariDasha?.currentAntardasha?.planet || 'Saturn (शनि)',
      manglikStatus: calculatedKundli.doshas?.manglik?.hasDosha ? 'Present (मांगलिक)' : 'Non-Manglik (दोष मुक्त)',
      kalsarpaStatus: calculatedKundli.doshas?.kalsarpa?.hasDosha ? calculatedKundli.doshas?.kalsarpa?.type : 'Absent (शुभ)',
      sadeSatiStatus: calculatedKundli.doshas?.sadeSati?.status || 'No Active Sade Sati Phase',
      luckyNumber: calculatedKundli.luckScores?.wealth ? (calculatedKundli.luckScores.wealth % 9) + 1 : 7,
      luckyColor: moon.includes('Aries') ? 'Red & Coral' : moon.includes('Taurus') ? 'White & Pink' : 'Golden Yellow',
      luckyGemstone: moon.includes('Aries') ? 'Red Coral (मूंगा)' : moon.includes('Taurus') ? 'Diamond / Opal' : 'Yellow Sapphire (पुखराज)',
      luckyDirection: 'North-East (ईशान कोण)',
      deity: 'Lord Shiva & Hanuman Ji',
      mantra: 'ॐ नमः शिवाय (Om Namah Shivaya)',
      careerFocus: 'Strong 10th House alignment indicating leadership, technology or consulting success.',
      healthNote: 'Maintain balanced Pitta-Kapha dosha; practice daily Surya Namaskar.',
      generatedAt: new Date().toISOString(),
    };

    // 3. Update userProfile in context
    setUserProfile((prev) => ({
      ...prev,
      name: birthDetails.name,
      gender: birthDetails.gender,
      dob: birthDetails.dob,
      tob: birthDetails.tob,
      pob: birthDetails.pob,
      rashi: moon,
    }));

    // 4. Update and persist in user account
    if (user) {
      const updatedUser: UserAccount = {
        ...user,
        name: birthDetails.name,
        gender: birthDetails.gender,
        dob: birthDetails.dob,
        tob: birthDetails.tob,
        pob: birthDetails.pob,
        rashi: moon,
        kundliSummary: summary,
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('12rashi_user', JSON.stringify(updatedUser));
      } catch {}
      await saveKundliSummaryToUser(user.uid, summary, {
        dob: birthDetails.dob,
        tob: birthDetails.tob,
        pob: birthDetails.pob,
        rashi: moon,
        gender: birthDetails.gender,
        name: birthDetails.name,
      });
    } else {
      try {
        localStorage.setItem('12rashi_guest_kundli_summary', JSON.stringify(summary));
        localStorage.setItem('12rashi_guest_birth_details', JSON.stringify(birthDetails));
      } catch {}
    }

    addNotification(
      'Permanent Janam Kundli Saved! 🌟',
      `Your natal chart summary (Lagna: ${summary.ascendant}, Rashi: ${summary.moonSign}) is permanently linked to your profile.`,
      'muhurat'
    );

    return summary;
  };

  const addFamilyProfile = (p: Omit<FamilyProfile, 'id'>): boolean => {
    if (familyProfiles.length >= 10) {
      addNotification(
        'Vault Capacity Reached',
        'Maximum 10 family Kundli profiles reached. Please remove a profile to add another.',
        'transit'
      );
      return false;
    }

    const newProfile: FamilyProfile = {
      ...p,
      id: 'fam-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedList = [...familyProfiles, newProfile].slice(0, 10);
    setFamilyProfiles(updatedList);
    setActiveFamilyProfile(newProfile);

    try {
      localStorage.setItem('12rashi_family_vault', JSON.stringify(updatedList));
    } catch {}

    if (user?.uid) {
      saveFamilyProfileToFirestore(user.uid, newProfile).catch(() => {});
    }

    addNotification(
      'Family Profile Added',
      `Created birth profile for ${newProfile.name} (${newProfile.relation}). (${updatedList.length}/10 slots used)`,
      'muhurat'
    );
    return true;
  };

  const updateFamilyProfile = (id: string, data: Partial<FamilyProfile>) => {
    const updatedList = familyProfiles.map((p) => (p.id === id ? { ...p, ...data } : p));
    setFamilyProfiles(updatedList);
    const updatedOne = updatedList.find((p) => p.id === id);
    if (updatedOne && activeFamilyProfile?.id === id) {
      setActiveFamilyProfile(updatedOne);
    }
    try {
      localStorage.setItem('12rashi_family_vault', JSON.stringify(updatedList));
    } catch {}
    if (user?.uid && updatedOne) {
      saveFamilyProfileToFirestore(user.uid, updatedOne).catch(() => {});
    }
    addNotification('Profile Updated', 'Family Kundli details updated successfully.', 'muhurat');
  };

  const deleteFamilyProfile = (id: string) => {
    const updatedList = familyProfiles.filter((p) => p.id !== id);
    setFamilyProfiles(updatedList);
    if (activeFamilyProfile?.id === id) {
      setActiveFamilyProfile(updatedList[0] || null);
    }
    try {
      localStorage.setItem('12rashi_family_vault', JSON.stringify(updatedList));
    } catch {}
    if (user?.uid) {
      deleteFamilyProfileFromFirestore(user.uid, id).catch(() => {});
    }
    addNotification('Profile Removed', 'Family Kundli profile removed from vault.', 'transit');
  };

  const addScheduledBooking = (b: Omit<ScheduledBooking, 'id' | 'bookedAt' | 'status'>) => {
    const newBooking: ScheduledBooking = {
      ...b,
      id: 'sb-' + Date.now(),
      status: 'CONFIRMED',
      bookedAt: 'Just now',
    };
    setScheduledBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('12rashi_scheduled_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setWalletBalance((prev) => Math.max(0, prev - b.price));
    addNotification('Slot Confirmed!', `Booked ${b.durationMins}-min ${b.type} session with ${b.astrologerName} on ${b.date} at ${b.timeSlot}. WhatsApp reminder scheduled.`, 'muhurat');

    // Trigger instant device native push notification
    nativeNotificationService.deliverConsultationNotification(newBooking, 'confirmed');
  };

  const cancelScheduledBooking = (id: string) => {
    const b = scheduledBookings.find((s) => s.id === id);
    if (b) {
      setWalletBalance((prev) => prev + b.price);
      setScheduledBookings((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        try {
          localStorage.setItem('12rashi_scheduled_bookings', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      addNotification('Booking Cancelled & Refunded', `₹${b.price} has been refunded to your wallet for slot on ${b.date}.`, 'discount');
    }
  };

  const submitAsyncQuestion = (q: Omit<AsyncQuestion, 'id' | 'status' | 'submittedAt'>) => {
    const newQ: AsyncQuestion = {
      ...q,
      id: 'aq-' + Date.now(),
      status: 'PENDING',
      submittedAt: 'Just now',
    };
    setAsyncQuestions((prev) => {
      const updated = [newQ, ...prev];
      try {
        localStorage.setItem('12rashi_async_questions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setWalletBalance((prev) => Math.max(0, prev - q.price));
    addNotification('Question Submitted', `Your question has been assigned to ${q.assignedAstrologer}. Verified answer guaranteed within 24 hours.`, 'astrologer');
  };

  const answerAsyncQuestion = (
    id: string,
    answerText: string,
    remedy?: string,
    audioDurationSecs: number = 145,
    remedyMantra?: string,
    remedyMuhurat?: string
  ) => {
    setAsyncQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'ANSWERED' as const,
            answeredAt: 'Just now',
            answerText,
            audioDurationSecs,
            prescribedRemedy: remedy || q.prescribedRemedy,
            remedyMantra: remedyMantra || q.remedyMantra,
            remedyMuhurat: remedyMuhurat || q.remedyMuhurat,
          };
        }
        return q;
      });
      try {
        localStorage.setItem('12rashi_async_questions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addNotification(
      'Astrologer Voice Reply Ready!',
      'Your assigned Acharya has sent a personalized response. Tap to listen in Ask a Question.',
      'astrologer'
    );
  };

  const simulateAcharyaReply = (id: string) => {
    const target = asyncQuestions.find((q) => q.id === id);
    if (!target) return;

    const sampleAnswers = [
      {
        answerText: `हरि ॐ! आपके प्रश्न का सूक्ष्म ज्योतिषीय विश्लेषण किया गया। आपकी जन्म पत्रिका के अनुसार वर्तमान दशा अनुकूल है। गोचर का बृहस्पति आपके शुभ भावों को सक्रिय कर रहा है। आने वाले 3 माह के भीतर आपके रुके हुए कार्य गति पकड़ेंगे। मनोकामना सिद्धि हेतु नित्य सूर्य नमस्कार करें तथा पक्षियों को सप्तधान्य डालें।`,
        remedy: 'Daily Aditya Hridaya Stotram + Feed birds soaked grains at sunrise',
        mantra: 'ॐ सूर्याय नमः (108 जप प्रातःकाल)',
        muhurat: 'Sunday during Ravi Hora (06:00 AM - 07:00 AM)',
      },
      {
        answerText: `शुभम भवतु! आपके लग्न और चंद्र राशि का समन्वय अत्यंत शुभ फलदायक है। शनि की ढैय्या अथवा साढ़े साती का प्रभाव नगण्य है। व्यापार एवं कर्मक्षेत्र में निवेश के लिए आगामी शुक्ल पक्ष की तृतीया तिथि से नवीन अवसर मिलेंगे। शनिवार को पीपल वृक्ष के समीप सरसों के तेल का दीपक प्रज्वलित करें।`,
        remedy: 'Mustard oil lamp under Peepal tree on Saturdays + Chant Shani Gayatri',
        mantra: 'ॐ शं शनैश्चराय नमः',
        muhurat: 'Saturday evening after sunset (Pradosh Kaal)',
      },
    ];
    const picked = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
    answerAsyncQuestion(id, picked.answerText, picked.remedy, 140, picked.mantra, picked.muhurat);
  };

  const updateMorningPushSubscription = (sub: Partial<MorningPushSubscription>) => {
    setMorningPushSubscription((prev) => {
      const updated = { ...prev, ...sub };
      try {
        localStorage.setItem('12rashi_morning_push', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addNotification('Morning Alerts Updated', 'Your morning audio Rashi Fal and Muhurat push preferences have been saved.', 'muhurat');
  };

  const triggerTestMorningPush = async () => {
    addNotification(
      '🌅 Daily Morning Muhurat Push',
      `शुभ प्रभात! Today's Abhijit Muhurat: 11:38 AM - 12:26 PM (Most Auspicious). Rahu Kaal: 12:00 PM - 01:30 PM. Your daily Audio Rashi Fal for ${morningPushSubscription.targetRashi} is ready to listen!`,
      'muhurat'
    );
    await nativeNotificationService.deliverDailyHoroscopePush(morningPushSubscription.targetRashi);
    try {
      await fcmService.sendTestDeviceAlert('muhurat', morningPushSubscription.targetRashi);
    } catch {}
  };

  const addConsultationArchive = (rec: ConsultationArchiveRecord) => {
    setConsultationArchive((prev) => [rec, ...prev]);
  };

  const joinQueue = (astrologerId: string) => {
    const astro = astrologers.find((a) => a.id === astrologerId);
    if (!astro) return;
    const pos = (astro.activeQueueLength || 1) + 1;
    setQueueStatus({
      astrologerId,
      position: pos,
      estimatedWaitMins: pos * 4,
    });
    addNotification('Joined Waitlist Queue', `You are #${pos} in line for ${astro.name}. You will be alerted when it is your turn!`, 'astrologer');
  };

  const leaveQueue = () => {
    setQueueStatus(null);
    addNotification('Queue Left', 'You have left the waitlist.', 'discount');
  };

  // Toggle dark mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for real-time Firebase Cloud Messaging (FCM) push notifications
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    fcmService.listenToForegroundMessages((payload) => {
      addNotification(
        payload.title,
        payload.body,
        (payload.alertType as any) || 'muhurat'
      );
      audioSynthesis.playTempleBell(987, 0.9);
    }).then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleRole = () => setRole((prev) => (prev === 'user' ? 'partner' : 'user'));

  const updateUserProfile = (data: Partial<AppContextType['userProfile']>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...data };
      firestoreSyncService.saveUserProfile(updated as any, walletBalance);
      return updated;
    });
  };

  const updatePartnerStatus = (status: 'online' | 'busy' | 'offline') => {
    setPartnerAstrologer((prev) => ({ ...prev, status }));
  };

  const loginPartner = async (astrologerId: string, customPhone?: string): Promise<boolean> => {
    const targetAstro = astrologers.find((a) => a.id === astrologerId) || astrologers[0];
    setPartnerAstrologer(targetAstro);
    setIsPartnerAuthenticated(true);
    setPartnerAuthUser({
      id: 'AUTH-' + targetAstro.id,
      astrologerId: targetAstro.id,
      name: targetAstro.name,
      email: `${targetAstro.name.toLowerCase().replace(/[^a-z]/g, '')}@12rashi.com`,
      phone: customPhone || '9831039814',
      role: 'partner_astrologer',
      joinedDate: '15 March 2024',
      panVerified: true,
      kycVerified: true,
      token: 'jwt_12rashi_' + Date.now(),
      rating: targetAstro.rating,
    });
    setRole('partner');
    addNotification('Partner Logged In', `Welcome back, ${targetAstro.name}. You are now live on the 12Rashi Astrologer Portal.`, 'astrologer');
    return true;
  };

  const logoutPartner = () => {
    setIsPartnerAuthenticated(false);
    setPartnerAuthUser(null);
    setRole('user');
    addNotification('Logged Out', 'Successfully signed out of the 12Rashi Astrologer Partner console.', 'discount');
  };

  const registerPartner = async (newAstroData: Partial<Astrologer>, phone: string, email: string): Promise<boolean> => {
    const newId = 'astro-' + (astrologers.length + 1);
    const newAstrologer: Astrologer = {
      id: newId,
      name: newAstroData.name || 'Acharya Seeker',
      title: newAstroData.title || 'Vedic Jyotish & Kundli Consultant',
      avatar: newAstroData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      rating: 4.95,
      reviewsCount: 1,
      experienceYears: newAstroData.experienceYears || 10,
      specialties: newAstroData.specialties || ['Vedic Astrology', 'Kundli & Horoscope'],
      languages: newAstroData.languages || ['Hindi', 'English', 'Bengali'],
      callRate: newAstroData.callRate || 25,
      chatRate: newAstroData.chatRate || 20,
      videoRate: newAstroData.videoRate || 45,
      status: 'online',
      waitTimeMins: 0,
      about: newAstroData.about || 'Certified Vedic Astrologer providing authentic horoscope consultation on 12Rashi.',
      verified: true,
      education: newAstroData.education || 'Acharya Degree in Jyotish Vidya',
      ordersCount: 1,
    };

    setAstrologers((prev) => [newAstrologer, ...prev]);
    setPartnerAstrologer(newAstrologer);
    setIsPartnerAuthenticated(true);
    setPartnerAuthUser({
      id: 'AUTH-' + newId,
      astrologerId: newId,
      name: newAstrologer.name,
      email,
      phone,
      role: 'partner_astrologer',
      joinedDate: 'Today',
      panVerified: true,
      kycVerified: true,
      token: 'jwt_12rashi_' + Date.now(),
      rating: 4.95,
    });
    setRole('partner');
    addNotification('Partner Account Approved', `Congratulations ${newAstrologer.name}! Your astrologer profile has been verified and activated on 12Rashi.`, 'astrologer');
    return true;
  };

  const updatePartnerProfile = (updated: Partial<Astrologer>) => {
    setPartnerAstrologer((prev) => {
      const merged = { ...prev, ...updated };
      setAstrologers((list) => list.map((a) => (a.id === merged.id ? merged : a)));
      return merged;
    });
    addNotification('Profile Updated', 'Your astrologer public credentials and bio have been synchronized in real-time.', 'astrologer');
  };

  const updatePartnerRates = (rates: { callRate?: number; chatRate?: number; videoRate?: number }) => {
    setPartnerAstrologer((prev) => {
      const merged = {
        ...prev,
        callRate: rates.callRate ?? prev.callRate,
        chatRate: rates.chatRate ?? prev.chatRate,
        videoRate: rates.videoRate ?? prev.videoRate,
      };
      setAstrologers((list) => list.map((a) => (a.id === merged.id ? merged : a)));
      return merged;
    });
  };

  const updatePartnerSchedule = (sched: Partial<PartnerSchedule>) => {
    setPartnerSchedule((prev) => ({ ...prev, ...sched }));
    addNotification('Availability Schedule Saved', 'Updated operating hours and automatic online transit triggers.', 'astrologer');
  };

  const addConsultationNoteAndRemedy = (consultationId: string, notes: string, remedy: string) => {
    setPartnerConsultationRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === consultationId) {
          return {
            ...rec,
            notes,
            prescribedRemedies: remedy ? [...rec.prescribedRemedies, remedy] : rec.prescribedRemedies,
          };
        }
        return rec;
      })
    );
    addNotification('Client Case Note Saved', 'Confidential astrological assessment and prescription stored.', 'astrologer');
  };

  const requestPartnerPayout = (
    amountOrUpi: number | string,
    method: 'UPI' | 'NEFT/IMPS' = 'UPI',
    accountDetails?: string
  ) => {
    const payoutAmount = typeof amountOrUpi === 'number' ? amountOrUpi : partnerEarnings.pendingPayout;
    const dest = typeof amountOrUpi === 'string' ? amountOrUpi : (accountDetails || '9831039814@upi');

    if (payoutAmount <= 0) return;

    const utr = (method === 'UPI' ? 'UPI/' : 'NEFT/') + Math.floor(100000000000 + Math.random() * 900000000000);
    const newRecord: PartnerPayoutRecord = {
      id: 'PO-' + Math.floor(1000 + Math.random() * 9000),
      amount: payoutAmount,
      method,
      destinationAccount: dest,
      utrNumber: utr,
      requestedDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PROCESSED',
    };

    setPartnerEarnings((prev) => ({
      ...prev,
      pendingPayout: Math.max(0, prev.pendingPayout - payoutAmount),
    }));

    setPartnerPayoutRecords((prev) => [newRecord, ...prev]);

    // Send DLT SMS alert
    dispatchDltSms({
      mobileNumber: partnerAuthUser?.phone || '9831039814',
      templateId: '1207161829038472915',
      headerId: 'RSHDLT',
      variables: [String(payoutAmount), String(Math.max(0, partnerEarnings.pendingPayout - payoutAmount)), utr],
    });

    addNotification(
      'Payout Request Initiated',
      `₹${payoutAmount} has been queued for transfer to ${dest}. Direct settlement via DLT-approved node.`,
      'discount'
    );
  };

  const acceptIncomingConsultation = () => {
    if (!incomingConsultation) return;
    addNotification(
      'Consultation Accepted',
      `Connected with ${incomingConsultation.clientName} for ${incomingConsultation.type.toUpperCase()} consultation.`,
      'astrologer'
    );
    setIncomingConsultation(null);
  };

  const rejectIncomingConsultation = () => {
    setIncomingConsultation(null);
  };

  // Periodic simulated incoming consultation in Partner mode to showcase real-time multi-astrologer experience!
  useEffect(() => {
    if (role === 'partner' && partnerAstrologer.status === 'online') {
      const timer = setTimeout(() => {
        if (!incomingConsultation) {
          setIncomingConsultation({
            id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
            clientName: 'Priya Mukherjee (Kolkata)',
            type: 'chat',
            ratePerMin: partnerAstrologer.chatRate,
            timestamp: Date.now(),
          });
        }
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [role, partnerAstrologer.status, incomingConsultation]);

  // Wallet Functions
  const rechargeWallet = async (amount: number, method: string, bonusPercent = 0): Promise<string> => {
    const bonus = Math.round((amount * bonusPercent) / 100);
    const totalCredit = amount + bonus;
    const newBal = walletBalance + totalCredit;
    const txnId = 'TXN12R' + Date.now().toString(36).toUpperCase();

    setWalletBalance(newBal);
    firestoreSyncService.saveUserProfile(userProfile, newBal);

    const newTxn: PaymentTransaction = {
      id: txnId,
      amount: totalCredit,
      type: 'credit',
      category: 'recharge',
      method: method as any,
      description: bonus > 0 
        ? `Wallet Recharge ₹${amount} + ₹${bonus} (${bonusPercent}% festive bonus)`
        : `Wallet Recharge via ${method}`,
      timestamp: 'Just now',
      status: 'SUCCESS',
      balanceAfter: newBal,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    firestoreSyncService.logWalletTransaction(userProfile.phone, {
      amount: totalCredit,
      type: 'credit',
      description: newTxn.description,
      referenceId: txnId,
    });

    // Send DLT SMS Confirmation notification
    dispatchDltSms({
      mobileNumber: userProfile.phone,
      templateId: '1207161829038472915',
      headerId: 'RSHDLT',
      variables: [String(totalCredit), String(newBal), txnId],
    });

    addNotification(
      'Wallet Recharged Successfully',
      `₹${totalCredit} added to your 12Rashi wallet via ${method}. Enjoy your live consultations!`,
      'discount'
    );

    return txnId;
  };

  const deductWallet = (amount: number, description: string): boolean => {
    if (walletBalance < amount) {
      setOpenPaymentModal(true);
      return false;
    }
    const newBal = walletBalance - amount;
    setWalletBalance(newBal);
    firestoreSyncService.saveUserProfile(userProfile, newBal);

    const newTxn: PaymentTransaction = {
      id: 'TXN12R' + Date.now().toString(36).toUpperCase(),
      amount: amount,
      type: 'debit',
      category: 'consultation',
      method: 'Wallet',
      description: description,
      timestamp: 'Just now',
      status: 'SUCCESS',
      balanceAfter: newBal,
    };
    setTransactions((prev) => [newTxn, ...prev]);
    firestoreSyncService.logWalletTransaction(userProfile.phone, {
      amount: amount,
      type: 'debit',
      description: description,
      referenceId: newTxn.id,
    });
    return true;
  };

  // Consultation handler
  const startConsultation = (astro: Astrologer, type: ConsultationType): boolean => {
    const isFreeTrial = !hasClaimedFreeTrial;
    const rate = type === 'audio' ? astro.callRate : type === 'chat' ? astro.chatRate : astro.videoRate;
    // Require minimum 2 minutes balance to initiate consultation unless on 5-Min Free Trial
    const minRequired = isFreeTrial ? 0 : rate * 2;
    if (walletBalance < minRequired) {
      setOpenPaymentModal(true);
      return false;
    }

    if (isFreeTrial) {
      addNotification(
        'Welcome Free Trial Activated',
        `Your first 5 minutes with ${astro.name} are 100% FREE (₹0). Enjoy your consultation!`,
        'discount'
      );
    }

    setActiveConsultation({
      astrologer: astro,
      type,
      startTime: Date.now(),
      elapsedSeconds: 0,
      totalDeducted: 0,
      isFreeTrial,
      freeSecondsRemaining: isFreeTrial ? 300 : 0,
    });

    // Send DLT SMS alert
    dispatchDltSms({
      mobileNumber: userProfile.phone,
      templateId: '1207161829038472912',
      headerId: 'RSHDLT',
      variables: [userProfile.name, astro.name, 'https://12rashi.com/session'],
    });

    return true;
  };

  const endConsultation = () => {
    if (activeConsultation) {
      const { astrologer, type, elapsedSeconds, totalDeducted } = activeConsultation;
      const rate = type === 'audio' ? astrologer.callRate : type === 'chat' ? astrologer.chatRate : astrologer.videoRate;
      const perSecRate = +(rate / 60).toFixed(3);

      // Lentlo Fair-Billing Guarantee:
      // If disconnected or ended within 60 seconds, 100% refund automatically!
      let isRefunded = false;
      let refundReason: string | undefined = undefined;
      let finalCost = totalDeducted;

      if (elapsedSeconds < 60) {
        isRefunded = true;
        refundReason = 'Fair-Billing Guarantee: Disconnected under 60s (Auto-Refunded to wallet)';
        if (totalDeducted > 0) {
          setWalletBalance((b) => b + totalDeducted);
        }
        finalCost = 0;
        addNotification(
          'Fair-Billing Guarantee Applied',
          `Your session with ${astrologer.name} was under 60 seconds. ₹${totalDeducted} has been automatically refunded to your wallet!`,
          'discount'
        );
      } else {
        addNotification(
          'Consultation Completed',
          `Session with ${astrologer.name} ended (${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s). WhatsApp receipt sent.`,
          'astrologer'
        );
      }

      // Create Archive Record for customer record & WhatsApp receipt
      const newArchiveRecord: ConsultationArchiveRecord = {
        id: 'hist-' + Date.now(),
        astrologerId: astrologer.id,
        astrologerName: astrologer.name,
        astrologerTitle: astrologer.title,
        astrologerAvatar: astrologer.avatar,
        type,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        durationSeconds: elapsedSeconds,
        cost: finalCost,
        perSecondRate: perSecRate,
        refunded: isRefunded,
        refundReason,
        prescribedRemedies: [
          {
            title: 'Personalized Astro Remedy',
            mantra: 'ॐ नमः शिवाय (108 times daily at sunrise)',
            productName: 'Govt. Certified 5-Mukhi Nepali Rudraksha',
          },
        ],
        transcriptSnippet: `Live ${type.toUpperCase()} consultation regarding life milestones, planetary transit impact, and auspicious timings.`,
        whatsappReceiptSent: true,
        hasAudioRecording: type === 'audio' || type === 'video',
      };

      setConsultationArchive((prev) => [newArchiveRecord, ...prev]);

      firestoreSyncService.recordConsultation({
        id: newArchiveRecord.id,
        userId: userProfile.phone || 'seeker',
        astrologerId: astrologer.id,
        astrologerName: astrologer.name,
        type,
        ratePerMin: astrologer.chatRate,
        durationSeconds: elapsedSeconds,
        totalAmount: finalCost,
        notes: newArchiveRecord.transcriptSnippet,
      });

      // If consultation was with a human partner astrologer, credit 70% share to partner earnings (70/30 split)
      if (finalCost > 0 && (astrologer.id === partnerAstrologer.id || astrologer.id.startsWith('partner-') || !astrologer.isAi)) {
        const netPartnerShare = Math.round(finalCost * 0.70); // 70% Astrologer Net Share / 30% Platform
        setPartnerEarnings((prev) => ({
          ...prev,
          today: prev.today + netPartnerShare,
          week: prev.week + netPartnerShare,
          month: prev.month + netPartnerShare,
          pendingPayout: prev.pendingPayout + netPartnerShare,
          totalConsultations: prev.totalConsultations + 1,
        }));

        const newPartnerRecord: PartnerConsultationRecord = {
          id: 'CR-' + Date.now().toString().slice(-4),
          clientName: userProfile.name || 'Client Seeker',
          clientPhone: userProfile.phone ? `${userProfile.phone.slice(0, 5)}*****` : '+91 98310*****',
          clientRashi: userProfile.rashi || 'General',
          clientCity: userProfile.pob || 'India',
          type,
          date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
          ratePerMin: rate,
          grossAmount: finalCost,
          netEarned: netPartnerShare,
          rating: 5,
          reviewText: 'Consultation completed successfully.',
          notes: newArchiveRecord.transcriptSnippet,
          prescribedRemedies: ['Personalized Astro Remedy'],
          status: 'completed',
        };
        setPartnerConsultationRecords((prev) => [newPartnerRecord, ...prev]);
      }

      // Pop WhatsApp receipt preview dialog automatically
      setSelectedReceiptRecord(newArchiveRecord);
      setOpenWhatsAppReceiptModal(true);
    }

    setActiveConsultation(null);
  };

  // Active consultation timer and minute billing deduction
  useEffect(() => {
    if (!activeConsultation) return;

    const interval = setInterval(() => {
      setActiveConsultation((prev) => {
        if (!prev) return null;
        const newElapsed = prev.elapsedSeconds + 1;

        // If on 5-Minute Welcome Free Trial (300 seconds)
        if (prev.isFreeTrial && newElapsed <= 300) {
          const freeSecsLeft = Math.max(0, 300 - newElapsed);

          if (newElapsed === 300) {
            claimFreeTrial();
            addNotification(
              'Welcome Free Trial Concluded',
              'Your first 5 minutes free trial has concluded. Session continuing with transparent per-second billing.',
              'astrologer'
            );
          }

          return {
            ...prev,
            elapsedSeconds: newElapsed,
            freeSecondsRemaining: freeSecsLeft,
          };
        }

        // Standard Billing: Every 60 seconds, deduct per-minute charge from wallet
        if (newElapsed > 0 && newElapsed % 60 === 0) {
          const rate = prev.type === 'audio'
            ? prev.astrologer.callRate
            : prev.type === 'chat'
            ? prev.astrologer.chatRate
            : prev.astrologer.videoRate;

          if (walletBalance >= rate) {
            setWalletBalance((b) => b - rate);
            return {
              ...prev,
              elapsedSeconds: newElapsed,
              totalDeducted: prev.totalDeducted + rate,
              isFreeTrial: false,
              freeSecondsRemaining: 0,
            };
          } else {
            // Insufficient balance, auto end session gracefully
            addNotification(
              'Consultation Concluded',
              'Session ended due to low wallet balance. Please recharge wallet to reconnect with Acharyaji.',
              'payment'
            );
            setOpenPaymentModal(true);
            return null;
          }
        }

        return { ...prev, elapsedSeconds: newElapsed };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeConsultation, walletBalance]);

  // Kundli Save
  const saveKundli = (k: KundliData) => {
    setSavedKundlis((prev) => {
      const exists = prev.some((item) => item.name === k.name && item.dob === k.dob);
      if (exists) return prev;
      return [k, ...prev];
    });
    addNotification('Kundli Saved', `Birth chart for ${k.name} has been securely saved to your profile.`, 'transit');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (title: string, message: string, type: TransitNotification['type'] = 'transit') => {
    const newNotif: TransitNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // If browser notifications are permitted, trigger native notification too
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.log('Notification trigger note:', e);
      }
    }
  };

  const requestPushPermission = async () => {
    const perm = await nativeNotificationService.requestPermission();
    if (perm !== 'unsupported') {
      setPushPermission(perm as any);
      if (perm === 'granted') {
        addNotification(
          'Device Push Notifications Activated!',
          'You will receive native lock-screen notifications for daily horoscope and 15-minute consultation reminders.',
          'transit'
        );
      }
    } else {
      setPushPermission('granted');
    }
  };

  const sendDailyHoroscopePush = async (rashiName?: string) => {
    const target = rashiName || userProfile.rashi || morningPushSubscription.targetRashi || 'Leo';
    const sent = await nativeNotificationService.deliverDailyHoroscopePush(target);
    if (sent) {
      addNotification(
        '✨ Daily Horoscope Delivered',
        `Native push notification delivered to device for ${target}.`,
        'transit'
      );
    }
    return sent;
  };

  const sendConsultationReminderPush = async (
    booking: ScheduledBooking,
    type: 'confirmed' | 'upcoming_15m' | 'starting_now' = 'upcoming_15m'
  ) => {
    return nativeNotificationService.deliverConsultationNotification(booking, type);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        userProfile,
        updateUserProfile,
        isPartnerAuthenticated,
        partnerAuthUser,
        loginPartner,
        logoutPartner,
        registerPartner,
        partnerAstrologer,
        updatePartnerProfile,
        updatePartnerStatus,
        updatePartnerRates,
        partnerSchedule,
        updatePartnerSchedule,
        partnerEarnings,
        partnerConsultationRecords,
        addConsultationNoteAndRemedy,
        partnerPayoutRecords,
        requestPartnerPayout,
        incomingConsultation,
        acceptIncomingConsultation,
        rejectIncomingConsultation,
        walletBalance,
        rechargeWallet,
        deductWallet,
        transactions,
        activeConsultation,
        startConsultation,
        endConsultation,
        currentKundli,
        setCurrentKundli,
        savedKundlis,
        saveKundli,
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
        notifications,
        markNotificationRead,
        addNotification,
        pushPermission,
        requestPushPermission,
        sendDailyHoroscopePush,
        sendConsultationReminderPush,
        openPaymentModal,
        setOpenPaymentModal,
        openDltModal,
        setOpenDltModal,
        openLuckyWheel,
        setOpenLuckyWheel,
        openLiveStream,
        setOpenLiveStream,
        astrologers,
        // Lentlo Features
        familyProfiles,
        activeFamilyProfile,
        setActiveFamilyProfile,
        addFamilyProfile,
        updateFamilyProfile,
        deleteFamilyProfile,
        user,
        isUserLoggedIn: Boolean(user),
        openLoginModal,
        setOpenLoginModal,
        loginWithPhone,
        logoutUser,
        updateUserAccount,
        scheduledBookings,
        addScheduledBooking,
        cancelScheduledBooking,
        asyncQuestions,
        submitAsyncQuestion,
        answerAsyncQuestion,
        simulateAcharyaReply,
        morningPushSubscription,
        updateMorningPushSubscription,
        triggerTestMorningPush,
        panchangCity,
        setPanchangCity,
        transitNudges,
        consultationArchive,
        addConsultationArchive,
        membershipTier,
        setMembershipTier,
        openFamilyModal,
        setOpenFamilyModal,
        openSlotBookingModal,
        setOpenSlotBookingModal,
        selectedBookingAstrologer,
        setSelectedBookingAstrologer,
        openAsyncQuestionModal,
        setOpenAsyncQuestionModal,
        openWhatsAppReceiptModal,
        setOpenWhatsAppReceiptModal,
        selectedReceiptRecord,
        setSelectedReceiptRecord,
        openVideoIntroModal,
        setOpenVideoIntroModal,
        selectedVideoAstro,
        setSelectedVideoAstro,
        openMembershipModal,
        setOpenMembershipModal,
        openFairBillingModal,
        setOpenFairBillingModal,
        openQrStandeeModal,
        setOpenQrStandeeModal,
        selectedProfileAstrologer,
        setSelectedProfileAstrologer,
        openLegalModal,
        setOpenLegalModal,
        openCustomDomainModal,
        setOpenCustomDomainModal,
        openPlayStoreModal,
        setOpenPlayStoreModal,
        legalModalTab,
        setLegalModalTab,
        hasClaimedFreeTrial,
        claimFreeTrial,
        openKundliPdfModal,
        setOpenKundliPdfModal,
        queueStatus,
        joinQueue,
        leaveQueue,
        openDoshaBookingModal,
        doshaBookingContext,
        openDoshaBooking,
        closeDoshaBooking,
        openTatkalModal,
        setOpenTatkalModal,
        openOnboardingModal,
        setOpenOnboardingModal,
        openAstroProfileModal,
        setOpenAstroProfileModal,
        saveAstroProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
