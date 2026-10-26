export type UserRole = 'user' | 'partner';

export type AstrologerSpecialty = 
  | 'Vedic Astrology'
  | 'Kundli & Horoscope'
  | 'Tarot Reading'
  | 'Numerology'
  | 'Vastu Shastra'
  | 'KP Astrology'
  | 'Palmistry'
  | 'Prashna Kundli'
  | 'Nadi Jyotish'
  | 'Love & Relationship'
  | 'Career & Wealth'
  | 'Health & Medical Astrology'
  | 'Financial & Stock Market'
  | 'Gemology & Lal Kitab'
  | 'Marriage & Manglik Dosha'
  | 'Child & Higher Education';

export interface AstrologerRemedyPrescription {
  title: string;
  category: string;
  mantra?: string;
  fastingDay?: string;
  gemstoneAdvice?: string;
  charitySeva?: string;
  pujaRemedy?: string;
}

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specialties: AstrologerSpecialty[];
  languages: string[];
  callRate: number;      // ₹ / min
  chatRate: number;      // ₹ / min
  videoRate: number;     // ₹ / min
  status: 'online' | 'busy' | 'offline';
  waitTimeMins: number;
  about: string;
  verified: boolean;
  isCelebrity?: boolean;
  isAi?: boolean;
  aiPersona?: string;
  badgeLabel?: string;
  freeTrialAvailable?: boolean;
  education: string;
  ordersCount: number;
  videoIntroUrl?: string;
  videoIntroDurationSecs?: number;
  activeQueueLength?: number;
  fairBillingCompliant?: boolean;
  remedySpecialties?: AstrologerRemedyPrescription[];
  categoryBadge?: string;
}

export type ConsultationType = 'chat' | 'audio' | 'video';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astrologer' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isRemedy?: boolean;
  remedyDetails?: {
    title: string;
    productName?: string;
    mantra?: string;
    suggestedGemstone?: string;
    actionType?: 'spiritual_sadhana' | 'add_to_cart' | 'view_horoscope';
  };
}

export interface PlanetaryPosition {
  planet: string;
  sanskritName: string;
  sign: string;
  signLord: string;
  degree: string;
  house: number;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Mooltrikona' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy' | 'Debilitated';
}

export interface HouseInfo {
  houseNumber: number;
  sign: string;
  signLord: string;
  planets: string[];
  significance: string;
}

export interface KundliData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  ascendant: string;
  ascendantLord?: string;
  lagna?: string;
  moonSign?: string;
  rashi?: string;
  sunSign?: string;
  nakshatra: string;
  nakshatraLord?: string;
  houses: HouseInfo[];
  planets: PlanetaryPosition[];
  planetaryPositions?: PlanetaryPosition[];
  vimshottariDasha?: any;
  doshas?: any;
  remedies?: any[];
  luckScores?: {
    health: number;
    career: number;
    wealth: number;
    relationship: number;
    family: number;
  };
}

export interface RashiInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  nameSa: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
  dates: string;
  today: {
    summary: string;
    career: string;
    love: string;
    health: string;
    luckyNumber: number;
    luckyColor: string;
    luckyTime: string;
    auspiciousDirection: string;
  };
  weekly: string;
  monthly: string;
}

export interface NonPhysicalRemedy {
  id: string;
  title: string;
  category: 'mantra' | 'vrat' | 'daan_seva' | 'dosha_nivaran';
  rulingPlanet?: string;
  benefits: string[];
}

export interface DLTTemplate {
  templateId: string;
  templateName: string;
  headerId: string;
  type: 'Service Implicit' | 'Service Explicit' | 'Promotional';
  content: string;
  entityId: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'recharge' | 'consultation' | 'store_purchase' | 'subscription_gold' | 'subscription_platinum' | 'partner_payout';
  method: 'UPI' | 'QR Code' | 'NetBanking' | 'Card' | 'Wallet';
  description: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  balanceAfter: number;
}

export interface TransitNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'transit' | 'rahu_kaal' | 'muhurat' | 'astrologer' | 'discount' | 'payment';
  read: boolean;
}

export interface GunaMilanResult {
  boyName: string;
  girlName: string;
  boyDob?: string;
  boyTob?: string;
  boyPob?: string;
  boyRashi?: string;
  boyNakshatra?: string;
  boyPada?: number;
  girlDob?: string;
  girlTob?: string;
  girlPob?: string;
  girlRashi?: string;
  girlNakshatra?: string;
  girlPada?: number;
  totalScore: number;
  maxScore: number;
  verdict: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Dosha Detected - Remedy Needed';
  categories: {
    name: string;
    sanskritName: string;
    obtainedScore: number;
    maxScore: number;
    description: string;
    status?: 'Excellent' | 'Favorable' | 'Average' | 'Dosha / Flaw';
  }[];
  manglikBoy: boolean;
  manglikGirl: boolean;
  manglikCancellation?: {
    isCancelled: boolean;
    reason: string;
  };
  nadiDosha?: {
    hasDosha: boolean;
    exceptionFound: boolean;
    details: string;
    remedy: string;
  };
  bhakootDosha?: {
    hasDosha: boolean;
    exceptionFound: boolean;
    details: string;
    remedy: string;
  };
  compatibilityBreakdown?: {
    emotional: number;
    intellectual: number;
    physical: number;
    familyProsperity: number;
    longevityProgeny: number;
  };
  recommendations: string[];
}

export interface PartnerAuthUser {
  id: string;
  astrologerId: string;
  name: string;
  email: string;
  phone: string;
  role: 'partner_astrologer';
  joinedDate: string;
  panVerified: boolean;
  kycVerified: boolean;
  token: string;
  rating: number;
}

export interface PartnerConsultationRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  clientRashi: string;
  clientCity: string;
  type: ConsultationType;
  date: string;
  durationMinutes: number;
  ratePerMin: number;
  grossAmount: number;
  netEarned: number; // 70% astrologer share (70/30 revenue split)
  rating: number;
  reviewText: string;
  notes: string;
  prescribedRemedies: string[];
  status: 'completed' | 'missed' | 'cancelled';
}

export interface PartnerPayoutRecord {
  id: string;
  amount: number;
  method: 'UPI' | 'NEFT/IMPS';
  destinationAccount: string;
  utrNumber: string;
  requestedDate: string;
  status: 'PROCESSED' | 'PENDING' | 'IN_TRANSIT';
}

export interface PartnerSchedule {
  autoOnline: boolean;
  workingHours: {
    [day: string]: { enabled: boolean; from: string; to: string };
  };
  breakMode: boolean;
  breakDurationMins: number;
  promotionalOfferActive: boolean;
  promotionalDiscountPercent: number;
}

export type FamilyRelation =
  | 'Self'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Child'
  | 'Father'
  | 'Mother'
  | 'Brother'
  | 'Sister'
  | 'Sibling'
  | 'Grandfather'
  | 'Grandmother'
  | 'Father-in-law'
  | 'Mother-in-law'
  | 'Friend'
  | 'Other';

export interface FamilyProfile {
  id: string;
  relation: FamilyRelation;
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  tob: string;
  pob: string;
  rashi: string;
  nakshatra?: string;
  lagna?: string;
  gotra?: string;
  notes?: string;
  isPrimary?: boolean;
  createdAt?: string;
}

export interface KundliSummary {
  ascendant: string;
  ascendantLord: string;
  moonSign: string;
  moonSignLord: string;
  sunSign: string;
  nakshatra: string;
  nakshatraLord: string;
  charan: number;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  currentMahadasha?: string;
  currentAntardasha?: string;
  manglikStatus?: string;
  kalsarpaStatus?: string;
  sadeSatiStatus?: string;
  luckyNumber?: number;
  luckyColor?: string;
  luckyGemstone?: string;
  luckyDirection?: string;
  deity?: string;
  mantra?: string;
  careerFocus?: string;
  healthNote?: string;
  generatedAt: string;
}

export interface UserAccount {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  tob?: string;
  pob?: string;
  rashi?: string;
  walletBalance: number;
  freeTrialClaimed: boolean;
  createdAt: string;
  isVerified: boolean;
  kundliSummary?: KundliSummary;
}

export interface ScheduledBooking {
  id: string;
  astrologerId: string;
  astrologerName: string;
  astrologerAvatar: string;
  astrologerTitle: string;
  profileName: string;
  date: string;
  timeSlot: string;
  durationMins: number;
  price: number;
  type: ConsultationType;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  whatsappReminder: boolean;
  bookedAt: string;
}

export interface AsyncQuestion {
  id: string;
  question: string;
  category: 'Career' | 'Marriage' | 'Finance' | 'Health' | 'Kundli Dosha' | 'General';
  profileName: string;
  birthDetails: string;
  price: number;
  responseType: 'text' | 'voice_note';
  status: 'PENDING' | 'ANSWERED';
  submittedAt: string;
  answeredAt?: string;
  assignedAstrologer: string;
  astrologerTitle?: string;
  astrologerAvatar?: string;
  answerText?: string;
  audioDurationSecs?: number;
  prescribedRemedy?: string;
  remedyMantra?: string;
  remedyMuhurat?: string;
}

export interface MorningPushSubscription {
  enabled: boolean;
  timeSlot: '05:30' | '06:30' | '07:30' | '08:30';
  targetRashi: string;
  whatsappAlerts: boolean;
  whatsappPhone: string;
  browserPushAllowed: boolean;
  subscriptionPlan: 'trial' | 'monthly' | 'yearly';
  trialDaysLeft: number;
  planExpiryDate?: string;
  includeAudioFal: boolean;
  includeMuhuratAlerts: boolean;
  includeRahuKaalWarning: boolean;
}

export interface DoshaBookingContext {
  doshaType: 'manglik' | 'kaal_sarp' | 'sade_sati' | 'pitra' | 'nadi' | 'bhakoot' | 'general';
  title: string;
  hindiTitle: string;
  suggestedTemple: string;
  location: string;
  deity: string;
  suggestedDakshina: number;
  priestName: string;
  remedyDescription: string;
  seekerName?: string;
  gotra?: string;
  rashi?: string;
  nakshatra?: string;
  partnerName?: string;
}

export interface PrashnaCalculationResult {
  id: string;
  question: string;
  category: 'Career' | 'Marriage' | 'Finance' | 'Health' | 'Travel' | 'Lost Item' | 'General';
  prashnaNumber: number; // 1-249 KP Seed Number
  queryTime: string;
  queryDate: string;
  location: string;
  prashnaLagna: string;
  prashnaLagnaLord: string;
  moonSign: string;
  moonNakshatra: string;
  rulingPlanets: string[];
  karyeshPlanet: string;
  karyeshHouse: number;
  verdict: 'Favorable (कार्य सिद्धि)' | 'Delayed Success (प्रयास से सिद्धि)' | 'Unfavorable / Obstacles (बाधा युक्त)';
  confidencePercentage: number;
  timeframeForecast: string;
  detailedAnalysis: string;
  prescribedRemedy: string;
  suggestedAction: string;
}

export interface ShubhShagunVoucher {
  id: string;
  code: string;
  amount: number;
  occasion: 'birthday' | 'wedding' | 'baby' | 'festival' | 'career' | 'general';
  occasionTitle: string;
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  blessingMessage: string;
  createdAt: string;
  expiryDate: string;
  status: 'active' | 'redeemed';
  redeemedBy?: string;
  redeemedAt?: string;
}

export interface TatkalConsultationSession {
  id: string;
  astrologerId: string;
  astrologerName: string;
  astrologerAvatar: string;
  astrologerTitle: string;
  ratePerMin: number;
  seekerName: string;
  seekerTopic: string;
  status: 'connecting' | 'connected' | 'completed';
  connectedAt?: string;
  durationSeconds: number;
  guaranteeTimerSeconds: number;
}

export interface PanchangDay {
  city: string;
  date: string;
  tithi: string;
  tithiEndTime: string;
  nakshatra: string;
  nakshatraEndTime: string;
  yoga: string;
  karana: string;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  vaar: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  choghadiya: {
    period: string;
    type: 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg';
    isAuspicious: boolean;
  }[];
}

export interface TransitNudge {
  id: string;
  planet: string;
  transitTitle: string;
  houseImpact: string;
  impactScore: 'Positive' | 'Caution' | 'Transformative';
  description: string;
  remedyAction: string;
  validUntil: string;
}

export interface ConsultationArchiveRecord {
  id: string;
  astrologerId: string;
  astrologerName: string;
  astrologerTitle: string;
  astrologerAvatar: string;
  type: ConsultationType;
  date: string;
  durationSeconds: number;
  cost: number;
  perSecondRate: number;
  refunded?: boolean;
  refundReason?: string;
  prescribedRemedies: {
    title: string;
    mantra?: string;
    productName?: string;
    gemstone?: string;
  }[];
  transcriptSnippet: string;
  whatsappReceiptSent: boolean;
  hasAudioRecording?: boolean;
}

export interface QrStandeeConfig {
  locationId: string;
  locationName: string;
  type: 'temple' | 'astrology_center' | 'shop' | 'event';
  freeOffer: string;
  scansCount: number;
  conversionsCount: number;
}

export type LunarPhaseType =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'third_quarter'
  | 'waning_crescent';

export interface LunarPhaseEvent {
  id: string;
  nameEn: string;
  nameHi: string;
  nameSa: string;
  type: 'full_moon' | 'new_moon' | 'ekadashi' | 'pradosh';
  date: string; // YYYY-MM-DD
  formattedDate: string;
  vedicMonth: string;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  tithi: string;
  tithiWindow: string;
  nakshatra: string;
  illuminationPct: number;
  deity: string;
  spiritualSignificance: string;
  recommendedRituals: string[];
  prescribedDaan: string[];
  mantra: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  keyConsultationFocus: string;
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface LunarCalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayOfMonth: number;
  phaseType: LunarPhaseType;
  phaseName: string;
  illuminationPct: number;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  approxTithi: string;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  event?: LunarPhaseEvent;
}


