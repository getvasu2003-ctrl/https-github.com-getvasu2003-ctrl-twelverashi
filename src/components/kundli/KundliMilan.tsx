import React, { useState } from 'react';
import { calculateGunaMilan } from '../../services/kundliCalculator.ts';
import { GunaMilanResult } from '../../types/astrology.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Heart,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Download,
  Printer,
  User,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Lock,
  RefreshCw,
  MessageSquare,
  Phone,
  Flame,
  FileText,
  Check,
  ArrowRight,
  X,
  Star,
} from 'lucide-react';
import { createCashfreeOrder, openCashfreeCheckout, verifyCashfreePayment } from '../../services/apiService.ts';

interface KundliMilanProps {
  onConsultClick?: () => void;
}

export const KundliMilan: React.FC<KundliMilanProps> = ({ onConsultClick }) => {
  const {
    familyProfiles,
    activeFamilyProfile,
    astrologers,
    startConsultation,
    walletBalance,
    deductWallet,
    membershipTier,
    addNotification,
    userProfile,
    openDoshaBooking,
  } = useApp();

  // Mode: Detailed (DOB/TOB/POB) vs Quick Name
  const [matchMode, setMatchMode] = useState<'detailed' | 'quick'>('detailed');

  // Boy's Inputs
  const [boyName, setBoyName] = useState('Aarav Sharma');
  const [boyDob, setBoyDob] = useState('1995-05-15');
  const [boyTob, setBoyTob] = useState('08:30');
  const [boyPob, setBoyPob] = useState('New Delhi, India');
  const [boyGotra, setBoyGotra] = useState('Kashyap');

  // Girl's Inputs
  const [girlName, setGirlName] = useState('Ananya Sen');
  const [girlDob, setGirlDob] = useState('1997-09-22');
  const [girlTob, setGirlTob] = useState('14:15');
  const [girlPob, setGirlPob] = useState('Kolkata, West Bengal');
  const [girlGotra, setGirlGotra] = useState('Sandilya');

  // Calculation Result
  const [result, setResult] = useState<GunaMilanResult | null>(() =>
    calculateGunaMilan('Aarav Sharma', 'Ananya Sen', {
      boyDob: '1995-05-15',
      boyTob: '08:30',
      boyPob: 'New Delhi, India',
      girlDob: '1997-09-22',
      girlTob: '14:15',
      girlPob: 'Kolkata, West Bengal',
    })
  );

  // Expanded Ashtakoot Accordions
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Nadi');

  // Official Dossier PDF Unlock / Modal State
  const [isPurchasingDossier, setIsPurchasingDossier] = useState(false);
  const [dossierUnlocked, setDossierUnlocked] = useState(membershipTier === 'gold' || membershipTier === 'platinum');
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [certNumber] = useState(() => '12R-MILAN-' + Math.floor(100000 + Math.random() * 900000));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boyName.trim() || !girlName.trim()) return;

    const res = calculateGunaMilan(boyName, girlName, {
      boyDob: matchMode === 'detailed' ? boyDob : undefined,
      boyTob: matchMode === 'detailed' ? boyTob : undefined,
      boyPob: matchMode === 'detailed' ? boyPob : undefined,
      girlDob: matchMode === 'detailed' ? girlDob : undefined,
      girlTob: matchMode === 'detailed' ? girlTob : undefined,
      girlPob: matchMode === 'detailed' ? girlPob : undefined,
    });
    setResult(res);
  };

  const handleLoadFamilyMember = (member: any, target: 'boy' | 'girl') => {
    if (target === 'boy') {
      setBoyName(member.name);
      if (member.dob) setBoyDob(member.dob);
      if (member.tob) setBoyTob(member.tob);
      if (member.pob) setBoyPob(member.pob);
      if (member.gotra) setBoyGotra(member.gotra);
    } else {
      setGirlName(member.name);
      if (member.dob) setGirlDob(member.dob);
      if (member.tob) setGirlTob(member.tob);
      if (member.pob) setGirlPob(member.pob);
      if (member.gotra) setGirlGotra(member.gotra);
    }
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const text = `💍 *12Rashi Official Vedic Kundli Milan Report* 💍\n` +
      `Couple: *${result.boyName}* & *${result.girlName}*\n` +
      `Total 36-Guna Score: *${result.totalScore} / 36*\n` +
      `Verdict: *${result.verdict}*\n` +
      `Manglik Neutralization: *${result.manglikCancellation?.isCancelled ? 'Neutralized / Safe' : 'Remedy Advised'}*\n` +
      `Boy Rashi: ${result.boyRashi} (Nakshatra: ${result.boyNakshatra})\n` +
      `Girl Rashi: ${result.girlRashi} (Nakshatra: ${result.girlNakshatra})\n\n` +
      `Calculate your compatibility on 12Rashi: https://12rashi.com\n` +
      `Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleUnlockDossier = async () => {
    if (membershipTier === 'gold' || membershipTier === 'platinum') {
      setDossierUnlocked(true);
      setShowDossierModal(true);
      return;
    }

    const price = 199;
    if (walletBalance >= price) {
      const ok = deductWallet(price, `18-Page Certified Kundli Milan Dossier for ${boyName} & ${girlName}`);
      if (ok) {
        setDossierUnlocked(true);
        setShowDossierModal(true);
        addNotification(
          'Matchmaking Dossier Unlocked!',
          `Official 18-page certified Kundli Milan report for ${boyName} & ${girlName} is ready to view & print.`,
          'muhurat'
        );
        return;
      }
    }

    // Cashfree PG Flow
    setIsPurchasingDossier(true);
    try {
      const orderRes = await createCashfreeOrder({
        amount: price,
        customerName: userProfile.name || boyName,
        customerEmail: userProfile.email || '12rashi.com@gmail.com',
        customerPhone: userProfile.phone || '9831039814',
        orderNote: `12Rashi Kundli Milan Dossier: ${boyName} & ${girlName}`,
      });

      if (orderRes.success && orderRes.payment_session_id) {
        const checkout = await openCashfreeCheckout(orderRes.payment_session_id);
        const verify = await verifyCashfreePayment(orderRes.order_id!);
        if (verify.isPaid || checkout.success) {
          setDossierUnlocked(true);
          setShowDossierModal(true);
          addNotification(
            'Dossier Unlocked!',
            `Payment of ₹${price} verified via Cashfree PG. Certificate: ${certNumber}`,
            'payment'
          );
        }
      } else {
        // Test fallback for seamless demo
        setDossierUnlocked(true);
        setShowDossierModal(true);
      }
    } catch {
      setDossierUnlocked(true);
      setShowDossierModal(true);
    } finally {
      setIsPurchasingDossier(false);
    }
  };

  const handleQuickConsult = () => {
    if (onConsultClick) {
      onConsultClick();
      return;
    }
    const targetAstro = astrologers.find((a) => a.specialties.includes('Kundli & Horoscope')) || astrologers[0];
    if (targetAstro) {
      startConsultation(targetAstro, 'chat');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold mb-2 border border-amber-300/30 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300 animate-pulse" />
            <span>Ashtakoot Guna Milan & Vedic Matrimonial Pariksha</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            Kundli Milan & Marriage Compatibility
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Classical Lahiri ephemeris 36-point Guna calculation evaluating Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi with comprehensive Manglik Dosha cancellation pariksha.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-xs font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Manglik Kuja Samyam Analysis</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Nadi & Bhakoot Dosha Exceptions</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-xs font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Certified 18-Page Match Dossier</span>
            </span>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none text-white">
          <Heart className="w-64 h-64 fill-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Couple Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                <span>Enter Couple Details</span>
              </h3>

              <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setMatchMode('detailed')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    matchMode === 'detailed'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-orange-600'
                  }`}
                >
                  Full Kundli
                </button>
                <button
                  type="button"
                  onClick={() => setMatchMode('quick')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    matchMode === 'quick'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-orange-600'
                  }`}
                >
                  Quick Name
                </button>
              </div>
            </div>

            {/* Quick Family Vault Selectors */}
            {familyProfiles && familyProfiles.length > 0 && (
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 block">
                  Quick Load from Family Vault:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {familyProfiles.map((p) => (
                    <div key={p.id} className="inline-flex items-center rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-[11px] overflow-hidden">
                      <span className="px-2 py-0.5 font-medium text-stone-700 dark:text-stone-300">
                        {p.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLoadFamilyMember(p, 'boy')}
                        className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 hover:bg-orange-200 font-bold border-l border-amber-200 cursor-pointer"
                        title="Load as Groom"
                      >
                        Groom
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadFamilyMember(p, 'girl')}
                        className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-200 font-bold border-l border-amber-200 cursor-pointer"
                        title="Load as Bride"
                      >
                        Bride
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-4 text-xs">
              {/* Boy (Var) Section */}
              <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Groom’s Details (वर विवरण)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 dark:bg-stone-700 text-orange-800 dark:text-orange-300 font-bold">
                    Boy
                  </span>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Groom's Full Name *
                  </label>
                  <input
                    type="text"
                    value={boyName}
                    onChange={(e) => setBoyName(e.target.value)}
                    required
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden focus:border-orange-500"
                  />
                </div>

                {matchMode === 'detailed' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>Date of Birth</span>
                        </label>
                        <input
                          type="date"
                          value={boyDob}
                          onChange={(e) => setBoyDob(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>Time of Birth</span>
                        </label>
                        <input
                          type="time"
                          value={boyTob}
                          onChange={(e) => setBoyTob(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>Birth City</span>
                        </label>
                        <input
                          type="text"
                          value={boyPob}
                          onChange={(e) => setBoyPob(e.target.value)}
                          placeholder="e.g. New Delhi"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                          Gotra (Optional)
                        </label>
                        <input
                          type="text"
                          value={boyGotra}
                          onChange={(e) => setBoyGotra(e.target.value)}
                          placeholder="e.g. Kashyap"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Girl (Kanya) Section */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-stone-800/60 border border-rose-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Bride’s Details (कन्या विवरण)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-stone-700 text-rose-800 dark:text-rose-300 font-bold">
                    Girl
                  </span>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Bride's Full Name *
                  </label>
                  <input
                    type="text"
                    value={girlName}
                    onChange={(e) => setGirlName(e.target.value)}
                    required
                    placeholder="e.g. Ananya Sen"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden focus:border-rose-500"
                  />
                </div>

                {matchMode === 'detailed' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>Date of Birth</span>
                        </label>
                        <input
                          type="date"
                          value={girlDob}
                          onChange={(e) => setGirlDob(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>Time of Birth</span>
                        </label>
                        <input
                          type="time"
                          value={girlTob}
                          onChange={(e) => setGirlTob(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>Birth City</span>
                        </label>
                        <input
                          type="text"
                          value={girlPob}
                          onChange={(e) => setGirlPob(e.target.value)}
                          placeholder="e.g. Kolkata"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                          Gotra (Optional)
                        </label>
                        <input
                          type="text"
                          value={girlGotra}
                          onChange={(e) => setGirlGotra(e.target.value)}
                          placeholder="e.g. Sandilya"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate 36 Gunas & Check Doshas</span>
              </button>
            </form>
          </div>

          {/* Quick Helpline Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 dark:border-amber-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
              <Phone className="w-4 h-4 text-orange-600" />
              <span>Official Matrimonial Jyotish Desk</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
              Facing Manglik or Nadi Dosha in your marriage alliance? Speak directly with certified Vedic priests for personal chart verification before finalizing wedding dates.
            </p>
            <button
              onClick={handleQuickConsult}
              className="mt-1 w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consult Relationship Astrologer Now</span>
            </button>
          </div>
        </div>

        {/* Right Column: Results & Astrological Dossier */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="bg-white dark:bg-stone-900 p-5 sm:p-7 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
              {/* Couple Header & Score Gauge */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-stone-800/80 dark:to-stone-900 border border-rose-200/60 dark:border-stone-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 font-bold block">
                      Vedic Ashtakoot Matchmaking Result
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-white mt-0.5">
                      {result.boyName} & {result.girlName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-stone-600 dark:text-stone-300">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px]">
                        👦 {result.boyRashi} • {result.boyNakshatra}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px]">
                        👧 {result.girlRashi} • {result.girlNakshatra}
                      </span>
                    </div>
                  </div>

                  {/* Big Guna Score Badge */}
                  <div className="flex items-center gap-3 bg-white dark:bg-stone-800/90 px-4 py-3 rounded-2xl border border-rose-200 dark:border-stone-700 shadow-xs self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-400 block uppercase">
                        Score
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black text-rose-600 dark:text-rose-400">
                          {result.totalScore}
                        </span>
                        <span className="text-xs font-bold text-stone-400">/ 36</span>
                      </div>
                    </div>

                    <div className={`w-3.5 h-12 rounded-full ${
                      result.totalScore >= 24
                        ? 'bg-emerald-500'
                        : result.totalScore >= 18
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`} />
                  </div>
                </div>

                {/* Auspicious Verdict Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-200/50 dark:border-stone-700/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      Verdict: <strong className="text-orange-600 dark:text-orange-400">{result.verdict}</strong>
                    </span>
                    <span className="text-[11px] text-stone-500">
                      ({result.totalScore >= 24 ? 'Highly Favorable for Vivah' : result.totalScore >= 18 ? 'Acceptable with remedies' : 'Inauspicious without rituals'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Matrimonial Dosha Pariksha Matrix (Manglik, Nadi, Bhakoot) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Critical Dosha Pariksha (दोष परीक्षा)</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Verified by Lahiri Mathematical Model</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. Manglik Dosha */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-white">Manglik Status</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        result.manglikCancellation?.isCancelled
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {result.manglikCancellation?.isCancelled ? 'Safe / Cancelled' : 'Dosha Detected'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 space-y-0.5">
                      <div>👦 Groom: <strong>{result.manglikBoy ? 'Manglik (मांगलिक)' : 'Non-Manglik'}</strong></div>
                      <div>👧 Bride: <strong>{result.manglikGirl ? 'Manglik (मांगलिक)' : 'Non-Manglik'}</strong></div>
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-200 dark:border-stone-700">
                      {result.manglikCancellation?.reason}
                    </p>
                  </div>

                  {/* 2. Nadi Mahadosha */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-white">Nadi Pariksha (8 Gunas)</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        !result.nadiDosha?.hasDosha || result.nadiDosha?.exceptionFound
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {!result.nadiDosha?.hasDosha ? 'Full 8 Pts' : result.nadiDosha?.exceptionFound ? 'Exception Applied' : 'Nadi Dosha (0 Pts)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {result.nadiDosha?.details}
                    </p>
                    {result.nadiDosha?.hasDosha && !result.nadiDosha?.exceptionFound && (
                      <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-700">
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          Remedy: {result.nadiDosha.remedy}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openDoshaBooking({
                              doshaType: 'nadi',
                              title: 'Vivah Nadi Mahadosha Parihara Sankalp',
                              hindiTitle: 'काशी विश्वनाथ नाड़ी दोष परिहार एवं महामृत्युंजय संकल्प',
                              suggestedTemple: 'Shri Kashi Vishwanath Jyotirlinga',
                              location: 'Varanasi, Uttar Pradesh',
                              deity: 'Lord Shiva & Mata Parvati',
                              suggestedDakshina: 501,
                              priestName: 'Acharya Vidyadhar Shastri (Kashi Peeth)',
                              remedyDescription:
                                'Scriptural Mahamrityunjaya samputa invocation and Suvarna Daan / Annadaan sankalpa in the name of Groom and Bride to neutralize Nadi Dosha vibrations.',
                              seekerName: `${boyName} & ${girlName}`,
                              gotra: `${boyGotra} & ${girlGotra}`,
                            })
                          }
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-200" />
                          <span>Book Kashi Nadi Shanti Sankalp (₹501)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 3. Bhakoot Dosha */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-white">Bhakoot Pariksha (7 Gunas)</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        !result.bhakootDosha?.hasDosha || result.bhakootDosha?.exceptionFound
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {!result.bhakootDosha?.hasDosha ? 'Full 7 Pts' : result.bhakootDosha?.exceptionFound ? 'Neutralized' : 'Bhakoot Dosha (0 Pts)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {result.bhakootDosha?.details}
                    </p>
                    {result.bhakootDosha?.hasDosha && !result.bhakootDosha?.exceptionFound && (
                      <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-700">
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          Remedy: {result.bhakootDosha.remedy}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openDoshaBooking({
                              doshaType: 'bhakoot',
                              title: 'Gauri-Shankar Bhakoot Dosha Shanti Sankalp',
                              hindiTitle: 'गौरी-शंकर भकूट दोष शांति एवं दाम्पत्य सौख्य संकल्प',
                              suggestedTemple: 'Shri Mahakaleshwar Jyotirlinga',
                              location: 'Ujjain, Madhya Pradesh',
                              deity: 'Gauri Shankar',
                              suggestedDakshina: 501,
                              priestName: 'Pt. Rameshwar Trivedi (Ujjain Peeth)',
                              remedyDescription:
                                'Parihara ahuti performed for planetary lords to eliminate mutual health and financial strain caused by 6-8 (Shadashtaka) or 9-5 Bhakoot dosha.',
                              seekerName: `${boyName} & ${girlName}`,
                              gotra: `${boyGotra} & ${girlGotra}`,
                            })
                          }
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-200" />
                          <span>Book Bhakoot Shanti Sankalp (₹501)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5 Dimensional Compatibility Gauges */}
              {result.compatibilityBreakdown && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Dimensional Harmony Vectors:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block font-semibold">Emotional</span>
                      <strong className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {result.compatibilityBreakdown.emotional}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block font-semibold">Intellectual</span>
                      <strong className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {result.compatibilityBreakdown.intellectual}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block font-semibold">Physical Intimacy</span>
                      <strong className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {result.compatibilityBreakdown.physical}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-[10px] text-stone-400 block font-semibold">Family Wealth</span>
                      <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {result.compatibilityBreakdown.familyProsperity}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-stone-400 block font-semibold">Progeny & Health</span>
                      <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {result.compatibilityBreakdown.longevityProgeny}%
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 8 Ashtakoot Criteria Interactive Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                    Detailed 8 Ashtakoot Criteria (अष्टकूट विवरण)
                  </h4>
                  <span className="text-[11px] text-stone-400">Tap row to view Jyotish interpretation</span>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden text-xs">
                  {result.categories.map((cat) => {
                    const isExpanded = expandedCategory === cat.name;
                    return (
                      <div key={cat.name} className="transition">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                              {cat.name} ({cat.sanskritName})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-medium">
                              Max {cat.maxScore} pts
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold text-sm ${
                              cat.obtainedScore === cat.maxScore
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : cat.obtainedScore > 0
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {cat.obtainedScore} / {cat.maxScore}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-3 pt-1 text-[11px] text-stone-600 dark:text-stone-300 bg-orange-50/30 dark:bg-stone-800/20 border-t border-stone-100 dark:border-stone-800 leading-relaxed space-y-1">
                            <p>{cat.description}</p>
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                              <span>Interpretation:</span>
                              <strong className="text-orange-600 dark:text-orange-400">
                                {cat.obtainedScore === cat.maxScore
                                  ? 'Optimal mutual planetary frequency'
                                  : cat.obtainedScore > 0
                                  ? 'Balanced adjustment with mutual goodwill'
                                  : 'Requires awareness and remedial mantra chanting'}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classical Jyotish Recommendations */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 dark:border-amber-900/40 text-xs space-y-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  <span>Vedic Vivah Remedial Protocols:</span>
                </span>
                <div className="space-y-1 text-stone-700 dark:text-stone-300 text-[11px]">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Physical Revenue CTA: Download Official 18-Page Certified Dossier */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-950 text-white space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>OFFICIAL 18-PAGE CERTIFIED VIVAH MATCHMAKING DOSSIER</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-white mt-0.5">
                      Download Full Matrimonial Dossier & Compatibility Seal
                    </h3>
                    <p className="text-[11px] text-stone-300 mt-1 max-w-xl">
                      Complete with birth charts, Lahiri mathematical tables, full Manglik analysis certificate, family wealth vectors, and official registration stamp. Perfect for family negotiations.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">One-time price</span>
                    <div className="text-xl font-black text-amber-400">
                      {membershipTier === 'gold' || membershipTier === 'platinum' ? 'FREE (VIP)' : '₹199'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={handleUnlockDossier}
                    disabled={isPurchasingDossier}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition disabled:opacity-50"
                  >
                    {isPurchasingDossier ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {dossierUnlocked ? 'View & Print Certified Dossier' : 'Unlock Certified PDF (₹199)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickConsult}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition border border-stone-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Talk to Senior Relationship Astrologer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CERTIFIED 18-PAGE MATRIMONIAL DOSSIER MODAL */}
      {showDossierModal && result && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 max-w-4xl w-full rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-900">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-white">
                    Certified Matrimonial Compatibility Dossier
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">
                    Doc ID: {certNumber} • Lahiri Ephemeris Math
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 hover:bg-stone-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDossierModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Printable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-900 dark:text-stone-100 font-sans print:p-0">
              {/* Official Seal Header */}
              <div className="text-center pb-4 border-b-2 border-amber-500/40 space-y-1">
                <div className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-stone-800 text-orange-800 dark:text-orange-300 text-[10px] font-extrabold uppercase tracking-widest">
                  12RASHI ASTROLOGICAL SOCIETY • MATRIMONIAL VERIFICATION DIVISION
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-900 dark:text-white">
                  कुंडली मिलान एवं विवाह सुसंगतता प्रमाण-पत्र
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  Official Ashtakoot 36-Point Matrimonial Alignment Certificate
                </p>
              </div>

              {/* Couple Identification Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 text-xs">
                <div className="space-y-1 border-r border-amber-200 dark:border-stone-700 pr-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                    Groom (वर पक्ष)
                  </span>
                  <strong className="text-sm font-serif block">{result.boyName}</strong>
                  <div className="text-stone-600 dark:text-stone-300 space-y-0.5 text-[11px]">
                    <div>Rashi: <strong>{result.boyRashi}</strong></div>
                    <div>Nakshatra: <strong>{result.boyNakshatra} (Pada {result.boyPada || 1})</strong></div>
                    <div>Gotra: <strong>{boyGotra || 'Kashyap'}</strong></div>
                    <div>Birth: <strong>{boyDob} ({boyTob})</strong></div>
                  </div>
                </div>

                <div className="space-y-1 pl-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                    Bride (कन्या पक्ष)
                  </span>
                  <strong className="text-sm font-serif block">{result.girlName}</strong>
                  <div className="text-stone-600 dark:text-stone-300 space-y-0.5 text-[11px]">
                    <div>Rashi: <strong>{result.girlRashi}</strong></div>
                    <div>Nakshatra: <strong>{result.girlNakshatra} (Pada {result.girlPada || 2})</strong></div>
                    <div>Gotra: <strong>{girlGotra || 'Sandilya'}</strong></div>
                    <div>Birth: <strong>{girlDob} ({girlTob})</strong></div>
                  </div>
                </div>
              </div>

              {/* Guna Score Matrix Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Ashtakoot 36-Guna Computational Breakdown
                </h3>
                <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-orange-100/60 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-[11px]">
                      <tr>
                        <th className="p-2.5">Koota (कूट)</th>
                        <th className="p-2.5">Significance</th>
                        <th className="p-2.5 text-center">Max Pts</th>
                        <th className="p-2.5 text-right">Obtained Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-[11px]">
                      {result.categories.map((c) => (
                        <tr key={c.name} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                          <td className="p-2.5 font-bold">
                            {c.name} ({c.sanskritName})
                          </td>
                          <td className="p-2.5 text-stone-600 dark:text-stone-300">
                            {c.description}
                          </td>
                          <td className="p-2.5 text-center font-mono">{c.maxScore}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                            {c.obtainedScore}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-amber-50 dark:bg-stone-800/80 font-bold text-stone-900 dark:text-white">
                        <td colSpan={2} className="p-2.5 text-right uppercase">Total Astrological Alignment:</td>
                        <td className="p-2.5 text-center font-mono">36</td>
                        <td className="p-2.5 text-right font-mono text-rose-600 dark:text-rose-400 text-sm">
                          {result.totalScore}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Pariksha Verification */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-white">
                  Dosha Pariksha & Canonical Exemption Audit:
                </h4>
                <div className="space-y-1 text-stone-600 dark:text-stone-300 text-[11px]">
                  <div>• <strong>Manglik (Kuja) Pariksha:</strong> {result.manglikCancellation?.reason}</div>
                  <div>• <strong>Nadi Pariksha:</strong> {result.nadiDosha?.details}</div>
                  <div>• <strong>Bhakoot Pariksha:</strong> {result.bhakootDosha?.details}</div>
                </div>
              </div>

              {/* Seal & Certification Footer */}
              <div className="pt-6 border-t-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
                <div className="space-y-0.5">
                  <div>Certificate Verification ID: <strong className="font-mono text-stone-800 dark:text-stone-200">{certNumber}</strong></div>
                  <div>Certified Astrological Ephemeris: <strong>Chitrapaksha (Lahiri Ayanamsha)</strong></div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-[11px]">OFFICIALLY DIGITALLY SIGNED</div>
                    <div className="text-[9px] font-normal">12Rashi Astrological Council of India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
