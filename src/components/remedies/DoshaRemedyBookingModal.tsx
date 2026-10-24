import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { livePujaService } from '../../services/livePujaService.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import { LIVE_PUJAS_CATALOG } from '../../data/livePujaData.ts';
import {
  X,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
  MapPin,
  User,
  Calendar,
  Lock,
  Award,
  Download,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const DoshaRemedyBookingModal: React.FC = () => {
  const {
    openDoshaBookingModal,
    doshaBookingContext,
    closeDoshaBooking,
    activeFamilyProfile,
    user,
    walletBalance,
    deductWallet,
    setOpenPaymentModal,
    addNotification,
  } = useApp();

  // Form state
  const [devoteeName, setDevoteeName] = useState('');
  const [gotra, setGotra] = useState('Kashyap');
  const [rashi, setRashi] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [sankalpWish, setSankalpWish] = useState('');
  const [tier, setTier] = useState<'single' | 'family'>('single');
  const [includeFamily, setIncludeFamily] = useState(false);
  const [familyNames, setFamilyNames] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    certificateNumber: string;
    bookingId: string;
    templeName: string;
    amount: number;
    devoteeName: string;
    date: string;
  } | null>(null);

  // Auto-fill when context changes
  useEffect(() => {
    if (doshaBookingContext) {
      setDevoteeName(
        doshaBookingContext.seekerName ||
        activeFamilyProfile?.name ||
        user?.name ||
        'Vasudev Sharma'
      );
      setGotra(
        doshaBookingContext.gotra ||
        activeFamilyProfile?.gotra ||
        'Kashyap'
      );
      setRashi(
        doshaBookingContext.rashi ||
        activeFamilyProfile?.rashi ||
        'Simha (Leo)'
      );
      setNakshatra(
        doshaBookingContext.nakshatra ||
        activeFamilyProfile?.nakshatra ||
        'Magha'
      );

      // Default wish based on dosha
      if (doshaBookingContext.doshaType === 'manglik') {
        setSankalpWish('Nivaran of Manglik Dosha friction, harmonious marriage & relationship bliss');
      } else if (doshaBookingContext.doshaType === 'kaal_sarp') {
        setSankalpWish('Removal of Kaal Sarp blockages, sudden career reversals & peace of mind');
      } else if (doshaBookingContext.doshaType === 'sade_sati') {
        setSankalpWish('Shani Dev grace, mental tranquility, debt alleviation & protection during transit');
      } else if (doshaBookingContext.doshaType === 'nadi' || doshaBookingContext.doshaType === 'bhakoot') {
        setSankalpWish('Vivah Nadi & Bhakoot Parihara for longevity, progeny and mutual family harmony');
      } else if (doshaBookingContext.doshaType === 'pitra') {
        setSankalpWish('Generational ancestral Pitra Tripti, removal of hurdles and family blessings');
      } else {
        setSankalpWish('Removal of planetary afflictions and divine protection');
      }
      setConfirmedBooking(null);
    }
  }, [doshaBookingContext, activeFamilyProfile, user]);

  if (!openDoshaBookingModal || !doshaBookingContext) return null;

  const singlePrice = doshaBookingContext.suggestedDakshina || 351;
  const familyPrice = singlePrice === 251 ? 501 : singlePrice === 351 ? 751 : singlePrice === 501 ? 1100 : 1500;
  const currentPrice = tier === 'single' ? singlePrice : familyPrice;

  // Find matching puja item in catalog for live stream link
  const matchingPuja =
    LIVE_PUJAS_CATALOG.find((p) =>
      p.templeName.toLowerCase().includes(doshaBookingContext.suggestedTemple.toLowerCase().slice(0, 8))
    ) || LIVE_PUJAS_CATALOG[0];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. If wallet balance is sufficient, deduct from wallet
      let paymentDone = false;
      if (walletBalance >= currentPrice) {
        paymentDone = deductWallet(
          currentPrice,
          `Dosha Shanti Sankalp: ${doshaBookingContext.title}`
        );
      } else {
        // Direct gateway simulated flow
        await new Promise((resolve) => setTimeout(resolve, 800));
        paymentDone = true;
      }

      if (paymentDone) {
        // Register in livePujaService
        const result = await livePujaService.bookPuja({
          puja: matchingPuja,
          devoteeName,
          gotra,
          rashi,
          nakshatra,
          sankalpWish,
          additionalFamilyMembers: includeFamily && familyNames ? familyNames.split(',').map((s) => s.trim()) : [],
          bookingType: 'one_time',
          userPhone: user?.phone,
          userEmail: user?.email,
        });

        // Ring temple bell harmonic
        audioSynthesis.playTempleBell(1174, 2.0);

        setConfirmedBooking({
          certificateNumber: result.booking.certificateNumber,
          bookingId: result.booking.id,
          templeName: doshaBookingContext.suggestedTemple,
          amount: currentPrice,
          devoteeName,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        });

        addNotification(
          'Dosha Shanti Sankalp Booked!',
          `${doshaBookingContext.hindiTitle} is confirmed at ${doshaBookingContext.suggestedTemple}. Certificate ID: ${result.booking.certificateNumber}`,
          'muhurat'
        );
      }
    } catch (err: any) {
      alert(err?.message || 'Error processing Sankalpa booking.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareCertificate = () => {
    if (!confirmedBooking) return;
    const text =
      `🪔 *Official 12Rashi Dosha Shanti E-Sankalpa Certificate* 🪔\n` +
      `Sankalpa: *${doshaBookingContext.hindiTitle}*\n` +
      `Temple: *${confirmedBooking.templeName}*\n` +
      `Devotee: *${confirmedBooking.devoteeName}*\n` +
      `Gotra: *${gotra}* | Rashi: *${rashi}*\n` +
      `Certificate ID: *${confirmedBooking.certificateNumber}*\n` +
      `Dakshina: ₹${confirmedBooking.amount} (Seva Consecrated)\n` +
      `Date: ${confirmedBooking.date}\n\n` +
      `Priest chants personal Name & Gotra at the Garbhagriha.\n` +
      `Verify on 12Rashi: https://12rashi.com\n` +
      `Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <Flame className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {doshaBookingContext.hindiTitle}
              </h3>
              <p className="text-[11px] text-amber-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>{doshaBookingContext.suggestedTemple}</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeDoshaBooking}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 dark:text-stone-300">
          {confirmedBooking ? (
            /* ============================================================== */
            /* SUCCESS CONFIRMATION & OFFICIAL CERTIFICATE CARD */
            /* ============================================================== */
            <div className="space-y-4 text-center py-2 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
                  सङ्कल्पः सिद्धिरस्तु! (Sankalpa Successfully Consecrated)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Your holy invocation has been scheduled with the Head Priest at {confirmedBooking.templeName}.
                </p>
              </div>

              {/* Consecrated Certificate Plaque */}
              <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 text-left space-y-3 shadow-md relative overflow-hidden font-serif">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-400 block">
                      Official Vedic E-Sankalpa Certificate
                    </span>
                    <strong className="text-sm text-stone-900 dark:text-stone-100">
                      12Rashi Devasthanam Seva Parishad
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono bg-white dark:bg-stone-900 px-2 py-0.5 rounded font-bold text-orange-600 border border-amber-200 dark:border-stone-700">
                    {confirmedBooking.certificateNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Devotee Name:</span>
                    <strong className="text-stone-900 dark:text-stone-100">{confirmedBooking.devoteeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Gotra & Rashi:</span>
                    <strong className="text-stone-900 dark:text-stone-100">{gotra} Gotra • {rashi}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Presiding Deity:</span>
                    <strong className="text-stone-900 dark:text-stone-100">{doshaBookingContext.deity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Temple Head Priest:</span>
                    <strong className="text-stone-900 dark:text-stone-100">{doshaBookingContext.priestName}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
                  <span>Dakshina: ₹{confirmedBooking.amount} Paid</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digitally Authenticated</span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-[11px] text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40 text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-orange-600 mt-0.5" />
                <span>
                  The Head Priest will chant your Name and Gotra live during the auspicious Muhurat. Live darshan feed link and video recording will be messaged to your registered phone.
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleShareCertificate}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Certificate (WhatsApp)</span>
                </button>

                <button
                  onClick={closeDoshaBooking}
                  className="py-3 px-5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* BOOKING CONFIGURATION & SANKALPA FORM */
            /* ============================================================== */
            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Context Banner */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-stone-800/80 border border-orange-200 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-400 tracking-wider">
                    Scriptural Diagnostic Context
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 dark:bg-stone-700 text-orange-900 dark:text-orange-200 font-bold">
                    Vedic Parihara
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {doshaBookingContext.title}
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  {doshaBookingContext.remedyDescription}
                </p>
              </div>

              {/* Seva Tier Selection */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Select Sankalpa Offering (संकल्प संकल्पना)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTier('single')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      tier === 'single'
                        ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Single Devotee</span>
                      <strong className="text-sm text-orange-600 font-mono">₹{singlePrice}</strong>
                    </div>
                    <p className="text-[10px] opacity-80">
                      Personal Name & Gotra invoked during Garbhagriha offering.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTier('family')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      tier === 'family'
                        ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Entire Family (समस्त परिवार)</span>
                      <strong className="text-sm text-orange-600 font-mono">₹{familyPrice}</strong>
                    </div>
                    <p className="text-[10px] opacity-80">
                      Maha Sankalpa with up to 5 family member names invoked.
                    </p>
                  </button>
                </div>
              </div>

              {/* Devotee Details */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                  Devotee Sankalpa Coordinates (यजमान विवरण)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      required
                      placeholder="e.g. Vasudev Sharma"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Gotra (गोत्र) *
                    </label>
                    <input
                      type="text"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      required
                      placeholder="e.g. Kashyap, Bharadwaj"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Moon Sign (Rashi)
                    </label>
                    <input
                      type="text"
                      value={rashi}
                      onChange={(e) => setRashi(e.target.value)}
                      placeholder="e.g. Simha (Leo)"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Birth Nakshatra
                    </label>
                    <input
                      type="text"
                      value={nakshatra}
                      onChange={(e) => setNakshatra(e.target.value)}
                      placeholder="e.g. Magha / Rohini"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">
                    Sankalpa Wish / Mano-Kamna (मनोकामना)
                  </label>
                  <input
                    type="text"
                    value={sankalpWish}
                    onChange={(e) => setSankalpWish(e.target.value)}
                    required
                    placeholder="Specific prayer wish to be read by the priest"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                  />
                </div>

                {tier === 'family' && (
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Family Member Names (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={familyNames}
                      onChange={(e) => setFamilyNames(e.target.value)}
                      placeholder="e.g. Anita Sharma (Spouse), Aarav (Son), Priya (Daughter)"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* What You Receive Assurance */}
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
                <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authentic Temple Assurance:</span>
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                  <li>Sankalpa performed inside the Garbhagriha by verified priest {doshaBookingContext.priestName}.</li>
                  <li>Consecrated offering in devotee's exact Name & Gotra.</li>
                  <li>WhatsApp delivery of video proof & digital Certificate ID.</li>
                </ul>
              </div>

              {/* Bottom Payment Actions */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Wallet Balance: ₹{walletBalance} {walletBalance >= currentPrice ? '(Deducted automatically)' : '(Gateway auto-checkout)'}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Dakshina: <span className="text-orange-600">₹{currentPrice}</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !devoteeName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>
                    {isProcessing ? 'Processing Sankalpa...' : `Confirm & Book E-Sankalpa (₹${currentPrice})`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
