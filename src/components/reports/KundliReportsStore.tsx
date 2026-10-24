import React, { useState, useEffect } from 'react';
import {
  KUNDLI_REPORTS_CATALOG,
  KundliReportTier,
  PurchasedReportRecord,
} from '../../data/reportsCatalogData.ts';
import { reportsService } from '../../services/reportsService.ts';
import { KundliData, PlanetaryPosition } from '../../types/astrology.ts';
import { calculateKundli } from '../../services/kundliCalculator.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  FileText,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
  Award,
  Layers,
  ArrowRight,
  Printer,
  Share2,
  Check,
  ChevronRight,
  Users,
} from 'lucide-react';
import { createCashfreeOrder, openCashfreeCheckout } from '../../services/apiService.ts';
import { ComprehensiveKundliReportView } from './ComprehensiveKundliReportView.tsx';

const DEFAULT_REPORT_PLANETS: PlanetaryPosition[] = [
  { planet: 'Sun', sanskritName: 'Surya', sign: 'Leo', signLord: 'Sun', degree: "12°45'", house: 1, nakshatra: 'Magha', pada: 4, isRetrograde: false, dignity: 'Own Sign' },
  { planet: 'Moon', sanskritName: 'Chandra', sign: 'Leo', signLord: 'Sun', degree: "24°10'", house: 1, nakshatra: 'P.Phalguni', pada: 2, isRetrograde: false, dignity: 'Friendly' },
  { planet: 'Mars', sanskritName: 'Mangal', sign: 'Aries', signLord: 'Mars', degree: "08°20'", house: 9, nakshatra: 'Ashwini', pada: 3, isRetrograde: false, dignity: 'Own Sign' },
  { planet: 'Mercury', sanskritName: 'Budha', sign: 'Virgo', signLord: 'Mercury', degree: "18°50'", house: 2, nakshatra: 'Hasta', pada: 1, isRetrograde: false, dignity: 'Exalted' },
  { planet: 'Jupiter', sanskritName: 'Guru', sign: 'Sagittarius', signLord: 'Jupiter', degree: "05°15'", house: 5, nakshatra: 'Moola', pada: 2, isRetrograde: false, dignity: 'Own Sign' },
  { planet: 'Venus', sanskritName: 'Shukra', sign: 'Libra', signLord: 'Venus', degree: "14°30'", house: 3, nakshatra: 'Swati', pada: 3, isRetrograde: false, dignity: 'Own Sign' },
  { planet: 'Saturn', sanskritName: 'Shani', sign: 'Aquarius', signLord: 'Saturn', degree: "22°12'", house: 7, nakshatra: 'P.Bhadra', pada: 1, isRetrograde: true, dignity: 'Own Sign' },
  { planet: 'Rahu', sanskritName: 'Rahu', sign: 'Pisces', signLord: 'Jupiter', degree: "11°05'", house: 8, nakshatra: 'U.Bhadra', pada: 2, isRetrograde: true, dignity: 'Neutral' },
  { planet: 'Ketu', sanskritName: 'Ketu', sign: 'Virgo', signLord: 'Mercury', degree: "11°05'", house: 2, nakshatra: 'Hasta', pada: 4, isRetrograde: true, dignity: 'Neutral' },
];

interface KundliReportsStoreProps {
  onConsultClick?: () => void;
}

export const KundliReportsStore: React.FC<KundliReportsStoreProps> = ({ onConsultClick }) => {
  const {
    currentKundli,
    activeFamilyProfile,
    user,
    addNotification,
    walletBalance,
    deductWallet,
    membershipTier,
    familyProfiles,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'my_reports'>('catalog');
  const [selectedTier, setSelectedTier] = useState<KundliReportTier | null>(null);
  const [purchasedReports, setPurchasedReports] = useState<PurchasedReportRecord[]>([]);

  // Selected seeker for report generation
  const [seekerName, setSeekerName] = useState(
    activeFamilyProfile?.name || currentKundli?.name || user?.name || 'Vasudev Sharma'
  );
  const [seekerDob, setSeekerDob] = useState(
    activeFamilyProfile?.dob || currentKundli?.dob || '15 Aug 1992'
  );
  const [seekerTob, setSeekerTob] = useState(
    activeFamilyProfile?.tob || currentKundli?.tob || '08:45 AM'
  );
  const [seekerPob, setSeekerPob] = useState(
    activeFamilyProfile?.pob || currentKundli?.pob || 'Kolkata, West Bengal'
  );
  const [seekerGender, setSeekerGender] = useState(
    activeFamilyProfile?.gender || currentKundli?.gender || 'Male'
  );
  const [userEmail, setUserEmail] = useState(user?.email || 'seeker@12rashi.com');
  const [userPhone, setUserPhone] = useState(user?.phone || '9831049814');

  // Checkout process state
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [activeViewingReport, setActiveViewingReport] = useState<PurchasedReportRecord | null>(null);

  useEffect(() => {
    loadUserReports();
  }, [user]);

  const loadUserReports = async () => {
    const reports = await reportsService.getUserReports(user?.phone);
    setPurchasedReports(reports);
  };

  const handlePreFillProfile = (profile: any) => {
    setSeekerName(profile.name);
    if (profile.dob) setSeekerDob(profile.dob);
    if (profile.tob) setSeekerTob(profile.tob);
    if (profile.pob) setSeekerPob(profile.pob);
    if (profile.gender) setSeekerGender(profile.gender);
  };

  const generateAndSaveReport = async (tier: KundliReportTier, paidAmount: number) => {
    setIsProcessingOrder(true);
    try {
      const computedKundli: KundliData = calculateKundli(
        seekerName,
        seekerGender,
        seekerDob,
        seekerTob,
        seekerPob
      );

      const newReport = await reportsService.recordReportPurchase({
        tier: { ...tier, price: paidAmount },
        kundli: computedKundli,
        userEmail,
        userPhone,
      });

      addNotification(
        '50+ Page Kundli Generated!',
        `${tier.title} is ready for instant download. Official Certificate ID: ${newReport.certificateId}`,
        'muhurat'
      );

      await loadUserReports();
      setSelectedTier(null);
      setActiveViewingReport(newReport);
    } catch (err: any) {
      alert(err?.message || 'Error generating report.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleWalletCheckout = async () => {
    if (!selectedTier) return;
    if (walletBalance < selectedTier.price) {
      alert(`Insufficient wallet balance (₹${walletBalance}). Please recharge or use direct gateway.`);
      return;
    }
    const deducted = deductWallet(selectedTier.price, `50+ Page Kundli PDF: ${selectedTier.title}`);
    if (deducted) {
      await generateAndSaveReport(selectedTier, selectedTier.price);
    }
  };

  const handleVipFreeClaim = async () => {
    if (!selectedTier) return;
    await generateAndSaveReport(selectedTier, 0);
  };

  // Handle Order Placement & Cashfree Checkout
  const handleCheckoutReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    setIsProcessingOrder(true);

    try {
      // 1. Create Cashfree Payment Order
      const order = await createCashfreeOrder({
        amount: selectedTier.price,
        customerName: seekerName,
        customerEmail: userEmail,
        customerPhone: userPhone,
        orderNote: `Premium Kundli PDF: ${selectedTier.title}`,
      });

      if (order && order.payment_session_id) {
        const checkoutRes = await openCashfreeCheckout(order.payment_session_id);
        if (checkoutRes && checkoutRes.success) {
          await generateAndSaveReport(selectedTier, selectedTier.price);
        } else if (checkoutRes && checkoutRes.error) {
          alert(checkoutRes.error?.message || 'Payment could not be completed.');
        } else {
          await generateAndSaveReport(selectedTier, selectedTier.price);
        }
      } else {
        await generateAndSaveReport(selectedTier, selectedTier.price);
      }
    } catch (err: any) {
      alert(err?.message || 'Unable to process report order. Please retry.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-stone-800 dark:text-stone-200">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 border border-orange-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Digital High-Res PDF Reports • 75% OFF Festival Special</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
              50+ Page Comprehensive Janam Kundli Reports
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              Exhaustive Parashari astrological dossiers generated dynamically in seconds. Download a print-ready multi-page PDF covering your <strong>complete 120-year Vimshottari Mahadasha timeline</strong>, <strong>career & wealth milestones</strong>, <strong>marriage compatibility</strong>, and <strong>remedies</strong>.
            </p>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Report Tiers ({KUNDLI_REPORTS_CATALOG.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my_reports')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'my_reports'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>My Reports ({purchasedReports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: REPORT CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Featured 50+ Page Brihat Report Hero Banner */}
          {KUNDLI_REPORTS_CATALOG.slice(0, 1).map((topTier) => (
            <div
              key={topTier.id}
              className="rounded-3xl border-2 border-orange-500/60 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                    {topTier.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold text-xs">
                    {topTier.pageCount}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                  {topTier.title}
                </h2>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                  {topTier.hindiTitle}
                </p>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {topTier.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {topTier.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-stone-900 dark:text-white font-serif">
                      ₹{topTier.price}
                    </span>
                    <span className="text-sm text-stone-400 line-through">
                      ₹{topTier.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {topTier.discountPercentage}% OFF
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setSelectedTier(topTier)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl transition transform hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete 50+ Page PDF (₹{topTier.price})</span>
                  </button>
                </div>
              </div>

              {/* Cover Preview Image */}
              <div className="w-full lg:w-80 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/40 transform lg:-rotate-2 hover:rotate-0 transition duration-300">
                <img
                  src={topTier.highlightCoverImage}
                  alt={topTier.title}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          ))}

          {/* Grid of Other Specialized Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
              Specialized Astrological Roadmap Dossiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {KUNDLI_REPORTS_CATALOG.slice(1).map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-stone-700 p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold text-[10px] uppercase">
                        {tier.pageCount}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {tier.discountPercentage}% OFF
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white leading-tight">
                        {tier.title}
                      </h4>
                      <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mt-0.5">
                        {tier.hindiTitle}
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                      {tier.description}
                    </p>

                    <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                      {tier.chapters.slice(0, 3).map((ch, i) => (
                        <li key={i} className="truncate">
                          • {ch}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-stone-900 dark:text-white">
                          ₹{tier.price}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          ₹{tier.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">Instant PDF</span>
                    </div>

                    <button
                      onClick={() => setSelectedTier(tier)}
                      className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Order PDF (₹{tier.price})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PURCHASED REPORTS */}
      {activeTab === 'my_reports' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              My Purchased Kundli PDF Dossiers (डाउनलोड केंद्र)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Access and download your dynamically generated multi-page horoscope books anytime. Backed up securely in Cloud Firestore.
            </p>
          </div>

          {purchasedReports.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
              <FileText className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-bold text-stone-700 dark:text-stone-300">No Purchased Reports Yet</h3>
              <p className="text-xs text-stone-500">
                Choose a comprehensive Kundli report tier to generate your personalized lifetime horoscope book.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="py-2 px-4 rounded-xl bg-orange-500 text-white text-xs font-bold transition hover:bg-orange-600 cursor-pointer"
              >
                Browse Report Tiers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchasedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-6 shadow-md relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-3">
                    <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">
                      ORDER ID: {rep.id}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Ready for Download</span>
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {rep.reportTitle}
                    </h3>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Seeker Name</span>
                        <strong className="text-stone-900 dark:text-white">{rep.seekerName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Date of Birth</span>
                        <strong>{rep.dob} ({rep.tob})</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Rashi & Nakshatra</span>
                        <span>{rep.rashi} • {rep.nakshatra}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Amount Paid</span>
                        <span className="font-bold text-emerald-600">₹{rep.amount}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 font-mono">Cert #{rep.certificateId}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveViewingReport(rep)}
                          className="py-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>View & Print PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INSTANT ORDER & CASHFREE CHECKOUT MODAL */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-white/20">
                  <BookOpen className="w-5 h-5 text-amber-200" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Generate Kundli PDF Dossier</h3>
                  <p className="text-[11px] text-amber-100">{selectedTier.pageCount} • Instant Download</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTier(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutReport} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                <strong className="block font-semibold text-sm">{selectedTier.title}</strong>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {selectedTier.description}
                </p>
              </div>

              {/* Family Pre-fill Selector */}
              {familyProfiles && familyProfiles.length > 0 && (
                <div className="p-2.5 rounded-2xl bg-orange-50/70 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 block">
                    Pre-fill Seeker from Family Vault:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {familyProfiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePreFillProfile(p)}
                        className="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:border-orange-500 text-[11px] font-medium text-stone-800 dark:text-stone-200 cursor-pointer transition"
                      >
                        {p.name} ({p.relation})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seeker Input Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Seeker Full Name *
                  </label>
                  <input
                    type="text"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Date of Birth *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Aug 1992"
                    value={seekerDob}
                    onChange={(e) => setSeekerDob(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Time of Birth *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08:45 AM"
                    value={seekerTob}
                    onChange={(e) => setSeekerTob(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Place of Birth (City, State) *
                  </label>
                  <input
                    type="text"
                    value={seekerPob}
                    onChange={(e) => setSeekerPob(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Email for PDF Delivery
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    WhatsApp Number (DLT SMS)
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] block">Payable Amount</span>
                  <strong className="text-base font-extrabold">₹{selectedTier.price}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block text-stone-400 line-through">₹{selectedTier.originalPrice}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{selectedTier.discountPercentage}% Discount Applied</span>
                </div>
              </div>

              {/* Cashfree Security Notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Secured by Cashfree Payments. Instant access upon successful transaction.</span>
              </div>

              {/* Multiple Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isProcessingOrder}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessingOrder ? 'Connecting Gateway...' : `Pay ₹${selectedTier.price} via Cashfree Payments (PG)`}
                  </span>
                </button>

                {walletBalance >= selectedTier.price && (
                  <button
                    type="button"
                    onClick={handleWalletCheckout}
                    disabled={isProcessingOrder}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1-Click Pay ₹{selectedTier.price} with In-App Wallet (Bal: ₹{walletBalance})</span>
                  </button>
                )}

                {(membershipTier === 'gold' || membershipTier === 'platinum') && (
                  <button
                    type="button"
                    onClick={handleVipFreeClaim}
                    disabled={isProcessingOrder}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Claim 100% FREE (VIP Club Member Benefit)</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedTier(null)}
                    className="text-stone-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => generateAndSaveReport(selectedTier, selectedTier.price)}
                    className="text-orange-600 hover:underline cursor-pointer font-medium"
                    title="Generate report in test simulation mode"
                  >
                    Instant Demo Unlock (Test Mode)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE MULTI-PAGE REPORT VIEWER MODAL */}
      {activeViewingReport && (
        <ComprehensiveKundliReportView
          kundli={
            currentKundli || {
              name: activeViewingReport.seekerName,
              gender: activeViewingReport.gender,
              dob: activeViewingReport.dob,
              tob: activeViewingReport.tob,
              pob: activeViewingReport.pob,
              ascendant: activeViewingReport.lagna || 'Virgo (Kanya)',
              lagna: activeViewingReport.lagna || 'Virgo (Kanya)',
              rashi: activeViewingReport.rashi || 'Simha (Leo)',
              nakshatra: activeViewingReport.nakshatra,
              sunSign: 'Leo',
              moonSign: 'Leo',
              planets: DEFAULT_REPORT_PLANETS,
              planetaryPositions: DEFAULT_REPORT_PLANETS,
              houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => ({
                houseNumber: h,
                sign: 'Leo',
                signLord: 'Sun',
                planets: [],
                significance: 'General',
              })),
              vimshottariDasha: {
                mahadasha: 'Rahu',
                antardasha: 'Jupiter',
                pratyantarDasha: 'Saturn',
                endsOn: '2040',
              },
              doshas: {
                manglik: { hasDosha: false, severity: 'None', details: '', remedy: '' },
                kaalSarp: { hasDosha: false, type: '', details: '', remedy: '' },
                sadeSati: { isActive: false, phase: '', details: '', remedy: '' },
                pitraDosha: { hasDosha: false, details: '', remedy: '' },
              },
              remedies: [],
            }
          }
          reportRecord={activeViewingReport}
          onClose={() => setActiveViewingReport(null)}
        />
      )}
    </div>
  );
};
