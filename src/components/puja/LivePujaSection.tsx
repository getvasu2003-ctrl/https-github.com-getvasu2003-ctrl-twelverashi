import React, { useState, useEffect } from 'react';
import {
  LIVE_PUJAS_CATALOG,
  LivePujaItem,
  PujaBookingRecord,
} from '../../data/livePujaData.ts';
import { livePujaService } from '../../services/livePujaService.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Flame,
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  Share2,
  Award,
  BookOpen,
  X,
  Radio,
  Users,
  Video,
  ExternalLink,
  ShieldCheck,
  RotateCw,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { createCashfreeOrder, openCashfreeCheckout } from '../../services/apiService.ts';

interface LivePujaSectionProps {
  onConsultClick?: () => void;
}

export const LivePujaSection: React.FC<LivePujaSectionProps> = ({ onConsultClick }) => {
  const { user, activeFamilyProfile, addNotification } = useApp();

  const [pujas, setPujas] = useState<LivePujaItem[]>(LIVE_PUJAS_CATALOG);
  const [selectedPuja, setSelectedPuja] = useState<LivePujaItem>(LIVE_PUJAS_CATALOG[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'darshan' | 'schedule' | 'my_bookings'>('darshan');

  // Interactive Virtual Devotion Animations
  const [flowerShower, setFlowerShower] = useState(false);
  const [diyaLit, setDiyaLit] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);

  // Booking / Subscription Modal State
  const [bookingModalPuja, setBookingModalPuja] = useState<LivePujaItem | null>(null);
  const [bookingType, setBookingType] = useState<'one_time' | 'monthly_subscription'>('one_time');
  const [devoteeName, setDevoteeName] = useState(activeFamilyProfile?.name || user?.name || 'Vasudev Sharma');
  const [gotra, setGotra] = useState(activeFamilyProfile?.gotra || 'Kashyap');
  const [rashi, setRashi] = useState(activeFamilyProfile?.rashi || 'Simha (Leo)');
  const [sankalpWish, setSankalpWish] = useState('Removal of all karmic blockages, health, and family prosperity');
  const [includeFamilyMembers, setIncludeFamilyMembers] = useState(false);
  const [familyMembersText, setFamilyMembersText] = useState('');
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  // User's active bookings and subscriptions
  const [userBookings, setUserBookings] = useState<PujaBookingRecord[]>([]);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    const list = await livePujaService.getUserBookings(user?.phone);
    setUserBookings(list);
  };

  // Play Bell Audio
  const handleRingBell = () => {
    setBellRinging(true);
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6 bell tone
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch {
        // Silent fallback
      }
    }
    setTimeout(() => setBellRinging(false), 1200);
  };

  // Trigger Flower Shower
  const handleOfferFlowers = () => {
    setFlowerShower(true);
    setTimeout(() => setFlowerShower(false), 2500);
  };

  // Trigger Diya
  const handleLightDiya = () => {
    setDiyaLit(true);
  };

  // Filtered pujas
  const filteredPujas =
    categoryFilter === 'all'
      ? pujas
      : pujas.filter((p) => p.category === categoryFilter);

  // Handle Booking & Cashfree Payment Flow
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalPuja) return;

    setIsProcessingBooking(true);
    const amountToPay =
      bookingType === 'monthly_subscription'
        ? bookingModalPuja.monthlySubscriptionFee
        : bookingModalPuja.oneTimeDakshina;

    const note =
      bookingType === 'monthly_subscription'
        ? `Monthly Live Puja Subscription: ${bookingModalPuja.title}`
        : `Live Temple Puja: ${bookingModalPuja.title}`;

    try {
      // 1. Create order on Cashfree
      const order = await createCashfreeOrder({
        amount: amountToPay,
        customerName: devoteeName,
        customerEmail: user?.email || 'devotee@12rashi.com',
        customerPhone: user?.phone || '9831039814',
        orderNote: note,
      });

      const completeBooking = async () => {
        const familyList = includeFamilyMembers
          ? familyMembersText.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined;

        const res = await livePujaService.bookPuja({
          puja: bookingModalPuja,
          devoteeName,
          gotra,
          rashi,
          sankalpWish,
          additionalFamilyMembers: familyList,
          bookingType,
          userPhone: user?.phone,
          userEmail: user?.email,
        });

        if (res.success) {
          addNotification(
            bookingType === 'monthly_subscription'
              ? 'Monthly Puja Subscription Active!'
              : 'Live Puja Booking Confirmed!',
            `Sankalpa confirmed for ${bookingModalPuja.title} at ${bookingModalPuja.templeName}. Digital Certificate: ${res.booking.certificateNumber}`,
            'muhurat'
          );
          await loadBookings();
          setBookingModalPuja(null);
          setActiveTab('my_bookings');
        }
      };

      if (order && order.payment_session_id) {
        const checkoutRes = await openCashfreeCheckout(order.payment_session_id);
        if (checkoutRes && checkoutRes.success) {
          await completeBooking();
        } else if (checkoutRes && checkoutRes.error) {
          alert(checkoutRes.error?.message || 'Payment could not be completed.');
        } else {
          // In simulation or test mode
          await completeBooking();
        }
      } else {
        await completeBooking();
      }
    } catch (err: any) {
      alert(err?.message || 'Unable to process puja booking. Please retry.');
    } finally {
      setIsProcessingBooking(false);
    }
  };

  // Handle Cancel Subscription
  const handleCancelSubscription = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this recurring Puja subscription?')) {
      return;
    }
    const success = await livePujaService.cancelSubscription(bookingId);
    if (success) {
      addNotification('Subscription Cancelled', 'Your recurring Puja subscription has been cancelled.', 'transit');
      await loadBookings();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-stone-800 dark:text-stone-200">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 border border-orange-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Verified Live Temple Streaming & E-Pooja Subscriptions (प्रत्यक्ष दर्शन व ई-पूजा)</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
              Live Temple Darshan & Puja Bookings
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              Participate in authentic daily Aartis and Vedic rituals performed in your Name & Gotra at <strong>Kashi Vishwanath</strong>, <strong>Mahakaleshwar Ujjain</strong>, <strong>Ayodhya Hanumangarhi</strong>, and <strong>Haridwar</strong>. Book single pujas or subscribe to <strong>Monthly / Weekly UPI Autopay</strong>.
            </p>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('darshan')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'darshan'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Live Darshan Hall</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'schedule'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Puja Schedule ({pujas.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'my_bookings'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>My Subscriptions ({userBookings.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE DARSHAN HALL */}
      {activeTab === 'darshan' && (
        <div className="space-y-6">
          {/* Main Broadcast Screen Card */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl relative">
            {/* Flower Shower Animation Overlay */}
            {flowerShower && (
              <div className="absolute inset-0 z-30 pointer-events-none flex justify-around overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl animate-fall"
                    style={{
                      animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                      animationDelay: `${(i % 5) * 0.15}s`,
                    }}
                  >
                    🌸
                  </span>
                ))}
              </div>
            )}

            {/* Top Stream Info Bar */}
            <div className="p-4 bg-stone-950/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-bold text-[11px] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>LIVE DARSHAN</span>
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{selectedPuja.templeName}</h3>
                  <p className="text-[11px] text-stone-400">{selectedPuja.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-300">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  <span>{selectedPuja.liveViewersCount.toLocaleString('en-IN')} Devotees Live</span>
                </span>
                <span className="hidden sm:inline text-stone-600">|</span>
                <span className="hidden sm:inline text-amber-300 font-medium text-[11px]">
                  {selectedPuja.tithiMuhurat}
                </span>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPuja.image}
                alt={selectedPuja.title}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Sanctum Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white space-y-1">
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block">
                      Presiding Deity
                    </span>
                    <strong className="text-sm sm:text-base font-serif">{selectedPuja.deity}</strong>
                  </div>

                  {diyaLit && (
                    <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs font-bold animate-fade-in">
                      <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                      <span>Akhand Ghee Diya Lit by Devotee</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                    {selectedPuja.hindiTitle}
                  </h2>
                  <p className="text-xs text-stone-300 max-w-xl line-clamp-2">
                    {selectedPuja.benefits[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Devotional Offerings Bar */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRingBell}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    bellRinging
                      ? 'bg-amber-500 text-white animate-bounce'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                  title="Ring the sanctum temple bell"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Ring Bell (घंटी बजाएं)</span>
                </button>

                <button
                  onClick={handleLightDiya}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    diyaLit
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                  title="Light sacred virtual ghee lamp"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{diyaLit ? 'Diya Consecrated' : 'Light Diya (दीपदान)'}</span>
                </button>

                <button
                  onClick={handleOfferFlowers}
                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Shower fresh sacred flowers"
                >
                  <span>🌸</span>
                  <span>Offer Flowers (पुष्पार्पण)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBookingType('one_time');
                    setBookingModalPuja(selectedPuja);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-lg"
                >
                  Book Sankalp (₹{selectedPuja.oneTimeDakshina})
                </button>

                {selectedPuja.monthlySubscriptionAvailable && (
                  <button
                    onClick={() => {
                      setBookingType('monthly_subscription');
                      setBookingModalPuja(selectedPuja);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Monthly Autopay (₹{selectedPuja.monthlySubscriptionFee}/mo)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Shrine Switcher Horizontal Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Switch Shrine Live Feed (तीर्थ स्थल चुनें):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pujas.map((p) => {
                const isSelected = selectedPuja.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPuja(p);
                      setDiyaLit(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">
                        {p.location.split(',')[0]}
                      </span>
                      <strong className="text-xs block leading-tight line-clamp-2">
                        {p.templeName}
                      </strong>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-red-500 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>LIVE</span>
                      </span>
                      <span className="text-stone-400">₹{p.oneTimeDakshina}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED PUJAS & SUBSCRIPTION CATALOG */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Shrines (सभी तीर्थ)' },
              { id: 'shiva', label: 'Lord Shiva & Jyotirlinga (शिव/ज्योतिर्लिंग)' },
              { id: 'hanuman', label: 'Lord Hanuman & Ayodhya (हनुमान)' },
              { id: 'vishnu_lakshmi', label: 'Mahalakshmi & Vishnu (लक्ष्मी-वैभव)' },
              { id: 'devi', label: 'Mata Ganga & Shakti Peeth (गंगा/देवी)' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === c.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid of Pujas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPujas.map((puja) => (
              <div
                key={puja.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-stone-700 overflow-hidden shadow-xs transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={puja.image}
                      alt={puja.title}
                      className="w-full h-full object-cover transition transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>{puja.location.split(',')[0]}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-extrabold uppercase">
                      {puja.deity}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                        {puja.title}
                      </h3>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
                        {puja.templeName}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700/60 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                        <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span><strong>Schedule:</strong> {puja.scheduleTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span><strong>Tithi:</strong> {puja.tithiMuhurat}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Vedic Benefits:
                      </span>
                      <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                        {puja.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <strong>Conducted By:</strong> {puja.priestName}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Single Sankalpa</span>
                      <strong className="text-sm font-bold text-stone-900 dark:text-white">
                        ₹{puja.oneTimeDakshina}
                      </strong>
                    </div>

                    {puja.monthlySubscriptionAvailable && (
                      <div className="text-right">
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block">
                          Monthly Autopay
                        </span>
                        <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{puja.monthlySubscriptionFee}/mo
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setBookingType('one_time');
                        setBookingModalPuja(puja);
                      }}
                      className="py-2.5 px-3 rounded-xl border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Book Single
                    </button>

                    <button
                      onClick={() => {
                        setBookingType('monthly_subscription');
                        setBookingModalPuja(puja);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition cursor-pointer text-center shadow-xs"
                    >
                      Subscribe Autopay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY PUJA BOOKINGS & RECURRING SUBSCRIPTIONS */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white">
              My Live Puja Bookings & Subscriptions (ई-पूजा रसीद व सदस्यता)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              View your registered sankalpas, digital certificates consecrated by temple priests, and manage your monthly recurring UPI subscriptions.
            </p>
          </div>

          {userBookings.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
              <Award className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-bold text-stone-700 dark:text-stone-300">No Active Puja Bookings</h3>
              <p className="text-xs text-stone-500">
                You can book a live temple sankalpa or subscribe to monthly pujas from the schedule.
              </p>
              <button
                onClick={() => setActiveTab('schedule')}
                className="py-2 px-4 rounded-xl bg-orange-500 text-white text-xs font-bold transition hover:bg-orange-600 cursor-pointer"
              >
                Browse Puja Schedule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((bkg) => {
                const isSub = bkg.bookingType === 'monthly_subscription';
                const isActive = bkg.status === 'CONFIRMED' || bkg.status === 'ACTIVE_SUBSCRIPTION';

                return (
                  <div
                    key={bkg.id}
                    className="rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-6 shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-3">
                      <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">
                        {isSub ? 'SUBSCRIPTION ID:' : 'BOOKING ID:'} {bkg.id}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{bkg.status}</span>
                      </span>
                    </div>

                    <div className="pt-4 space-y-2">
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                        {bkg.pujaTitle}
                      </h3>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                        {bkg.templeName} • {bkg.location}
                      </p>

                      <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Devotee Name</span>
                          <strong className="text-stone-900 dark:text-white">{bkg.devoteeName}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Gotra</span>
                          <strong className="text-stone-900 dark:text-white">{bkg.gotra}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Booking Date</span>
                          <span>{bkg.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">
                            {isSub ? 'Monthly Fee' : 'Dakshina'}
                          </span>
                          <span className="font-bold text-emerald-600">
                            ₹{bkg.amount} {isSub ? '/month' : ''}
                          </span>
                        </div>
                      </div>

                      {bkg.sankalpWish && (
                        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300">
                          <strong>Sankalpa Wish:</strong> {bkg.sankalpWish}
                        </div>
                      )}

                      {bkg.additionalFamilyMembers && bkg.additionalFamilyMembers.length > 0 && (
                        <div className="text-[11px] text-stone-500">
                          <strong>Family Members Included:</strong> {bkg.additionalFamilyMembers.join(', ')}
                        </div>
                      )}

                      {isSub && bkg.nextRenewalDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                          <RotateCw className="w-3 h-3 text-amber-500" />
                          <span>Next Auto-Renewal: {bkg.nextRenewalDate} (UPI Autopay)</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-mono">Cert #{bkg.certificateNumber}</span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              alert(
                                `Digital Certificate ${bkg.certificateNumber} verified on 12Rashi Temple Ledger.\nPriest Invocation: ${bkg.pujaTitle} at ${bkg.templeName}.\nDevotee: ${bkg.devoteeName} (${bkg.gotra}).`
                              )
                            }
                            className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
                          >
                            Digital Certificate
                          </button>

                          {isSub && bkg.status === 'ACTIVE_SUBSCRIPTION' && (
                            <button
                              onClick={() => handleCancelSubscription(bkg.id)}
                              className="text-red-500 hover:text-red-600 font-bold cursor-pointer"
                            >
                              Cancel Autopay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SANKALPA BOOKING & SUBSCRIPTION MODAL */}
      {bookingModalPuja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-white/20">
                  <Award className="w-5 h-5 text-amber-200" />
                </span>
                <div>
                  <h3 className="font-bold text-base">
                    {bookingType === 'monthly_subscription'
                      ? 'Subscribe to Monthly Live Puja'
                      : 'Book Live Temple Sankalpa'}
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    {bookingModalPuja.templeName} ({bookingModalPuja.location})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingModalPuja(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Puja Overview Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                <strong className="block font-semibold text-sm">{bookingModalPuja.title}</strong>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Priests will chant your Name, Gotra, and Prayer Intention in the sanctum sanctorum during the live ritual. 100% non-physical spiritual seva.
                </p>
              </div>

              {/* Booking Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setBookingType('one_time')}
                  className={`py-2 rounded-xl font-bold transition text-xs cursor-pointer ${
                    bookingType === 'one_time'
                      ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Single Puja (₹{bookingModalPuja.oneTimeDakshina})
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('monthly_subscription')}
                  disabled={!bookingModalPuja.monthlySubscriptionAvailable}
                  className={`py-2 rounded-xl font-bold transition text-xs cursor-pointer ${
                    bookingType === 'monthly_subscription'
                      ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Monthly Autopay (₹{bookingModalPuja.monthlySubscriptionFee}/mo)
                </button>
              </div>

              {/* Devotee Input Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Primary Devotee Full Name *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Gotra (गोत्र) *
                  </label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Janma Rashi
                  </label>
                  <input
                    type="text"
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Amount to Authorize
                  </label>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                    ₹
                    {bookingType === 'monthly_subscription'
                      ? `${bookingModalPuja.monthlySubscriptionFee} / month`
                      : bookingModalPuja.oneTimeDakshina}
                  </div>
                </div>
              </div>

              {/* Include Family Members Checkbox */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={includeFamilyMembers}
                    onChange={(e) => setIncludeFamilyMembers(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Include Family Members in Sankalpa (परिवार के सदस्यों के नाम)</span>
                </label>

                {includeFamilyMembers && (
                  <div className="space-y-1 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sharma (Spouse), Aarav Sharma (Son)"
                      value={familyMembersText}
                      onChange={(e) => setFamilyMembersText(e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-[10px] text-stone-500">
                      Separate names with commas. Up to 4 family members will be included in the prayer.
                    </span>
                  </div>
                )}
              </div>

              {/* Prayer Intention */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Sankalpa Prayer / Intention (मनोकामना)
                </label>
                <textarea
                  rows={2}
                  value={sankalpWish}
                  onChange={(e) => setSankalpWish(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Cashfree Security Notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Secured by Cashfree Payments (RBI Authorized). Supports UPI, GPay, PhonePe, Paytm, and NetBanking.
                </span>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalPuja(null)}
                  className="flex-1 py-3 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessingBooking}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  {isProcessingBooking
                    ? 'Connecting Cashfree Gateway...'
                    : bookingType === 'monthly_subscription'
                    ? `Authorize Autopay (₹${bookingModalPuja.monthlySubscriptionFee}/mo)`
                    : `Offer Dakshina (₹${bookingModalPuja.oneTimeDakshina})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
