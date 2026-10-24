import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { RASHIS_DATA } from '../../data/horoscopeData.ts';
import { RashiInfo } from '../../types/astrology.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import { fcmService, FcmSubscriptionStatus } from '../../services/fcmService.ts';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Bell,
  BellRing,
  Sun,
  Moon,
  Clock,
  Sparkles,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Check,
  Compass,
  AlertTriangle,
  Flame,
  Radio,
  Zap,
} from 'lucide-react';
import { nativeNotificationService } from '../../services/nativeNotificationService.ts';

interface DailyAudioRashiFalPushProps {
  onConsultClick?: () => void;
}

export const DailyAudioRashiFalPush: React.FC<DailyAudioRashiFalPushProps> = ({
  onConsultClick,
}) => {
  const {
    morningPushSubscription,
    updateMorningPushSubscription,
    triggerTestMorningPush,
    walletBalance,
    deductWallet,
    setOpenPaymentModal,
    addNotification,
    currentKundli,
    activeFamilyProfile,
    user,
  } = useApp();

  // Find user's rashi or default to Leo
  const defaultRashi =
    RASHIS_DATA.find((r) =>
      r.nameEn.toLowerCase().includes((currentKundli?.moonSign || activeFamilyProfile?.rashi || 'leo').toLowerCase())
    ) || RASHIS_DATA[4]; // Leo default

  const [selectedRashi, setSelectedRashi] = useState<RashiInfo>(defaultRashi);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Subscription state
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isActivatingPlan, setIsActivatingPlan] = useState<boolean>(false);

  // Web Push & FCM permission state
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [fcmStatus, setFcmStatus] = useState<FcmSubscriptionStatus>(() => fcmService.getStatus());
  const [isRegisteringFcm, setIsRegisteringFcm] = useState<boolean>(false);
  const [lastDispatchedAlert, setLastDispatchedAlert] = useState<string | null>(null);

  useEffect(() => {
    setFcmStatus(fcmService.getStatus());
  }, []);

  useEffect(() => {
    return () => {
      audioSynthesis.stopSpeaking();
    };
  }, []);

  const handleRegisterFcm = async () => {
    setIsRegisteringFcm(true);
    try {
      const result = await fcmService.registerForPushNotifications(
        user?.uid || 'seeker_' + Date.now().toString(36),
        {
          targetRashi: `${selectedRashi.nameEn} (${selectedRashi.nameHi})`,
          timeSlot: morningPushSubscription.timeSlot,
          includeAudioFal: morningPushSubscription.includeAudioFal,
          includeMuhuratAlerts: morningPushSubscription.includeMuhuratAlerts,
          includeRahuKaalWarning: morningPushSubscription.includeRahuKaalWarning,
          whatsappPhone: morningPushSubscription.whatsappPhone,
        }
      );

      const status = fcmService.getStatus();
      setFcmStatus(status);
      setBrowserPermission(status.permission);

      if (result.success) {
        updateMorningPushSubscription({ browserPushAllowed: true });
        addNotification(
          'Mobile Push Connected (Firebase FCM) 📱',
          `Your device is registered to receive daily 6:30 AM Rashi Fal and Abhijit Muhurat alerts!`,
          'muhurat'
        );
        audioSynthesis.playTempleBell(880, 1.2);
      } else {
        addNotification('FCM Registration Note', result.error || 'Please allow notifications in browser', 'discount');
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRegisteringFcm(false);
    }
  };

  const handleSendFcmTestAlert = async (type: 'muhurat' | 'audio_fal' | 'rahu_kaal') => {
    setLastDispatchedAlert(`Dispatching ${type}...`);
    try {
      // Deliver native device push notification directly via the Device's Native Notification API
      await nativeNotificationService.deliverDailyHoroscopePush(selectedRashi.nameEn);
      const res = await fcmService.sendTestDeviceAlert(type, `${selectedRashi.nameEn} (${selectedRashi.nameHi})`);
      setLastDispatchedAlert(res.message);
      audioSynthesis.playTempleBell(type === 'rahu_kaal' ? 523 : 987, 0.8);
      addNotification(
        type === 'muhurat' ? '🌞 Muhurat Alert Sent' : type === 'audio_fal' ? '🪐 Audio Fal Sent' : '⚠️ Rahu Kaal Alert Sent',
        res.message,
        'muhurat'
      );
    } catch {
      await nativeNotificationService.deliverDailyHoroscopePush(selectedRashi.nameEn);
      setLastDispatchedAlert('Dispatched native push notification to device');
    }
  };

  const requestBrowserPush = async () => {
    await handleRegisterFcm();
  };

  // Daily script for the selected rashi
  const getAudioNarrationText = (rashi: RashiInfo, lang: 'hi' | 'en'): string => {
    if (lang === 'hi') {
      return `हरि ॐ! 12Rashi दैनिक पंचांग और राशिफल में आपका स्वागत है। आज का दिन ${rashi.nameHi} राशि के जातकों के लिए ग्रहों की विशेष स्थिति लेकर आया है। आपका राशि स्वामी ${rashi.rulingPlanet} आज शुभ भाव में संचरण कर रहा है। ${rashi.today.summary}। कर्मक्षेत्र में: ${rashi.today.career}। पारिवारिक एवं प्रेम संबंध: ${rashi.today.love}। आज का शुभ अंक ${rashi.today.luckyNumber} तथा शुभ रंग ${rashi.today.luckyColor} रहेगा। आज अभिजीत मुहूर्त 11:38 से 12:26 तक है, जिसमें नए कार्यों का शुभारंभ अत्यंत मंगलकारी होगा। दोपहर 12 बजे से 1:30 बजे तक राहुकाल रहेगा, इस अवधि में महत्वपूर्ण निर्णयों से बचें। ॐ नमः शिवाय।`;
    }
    return `Hari Om! Welcome to 12Rashi Daily Astrological Broadcast for ${rashi.nameEn} (${rashi.nameSa}). Today, your ruling planet ${rashi.rulingPlanet} is transiting auspicious cosmic coordinates. ${rashi.today.summary}. In Career and Wealth: ${rashi.today.career}. In Relationships: ${rashi.today.love}. Today's lucky number is ${rashi.today.luckyNumber} and lucky color is ${rashi.today.luckyColor}. Auspicious Abhijit Muhurat is active from 11:38 AM to 12:26 PM. Avoid initiating major ventures during Rahu Kaal from 12:00 PM to 01:30 PM. Have a blessed and prosperous day!`;
  };

  const handleTogglePlayAudio = () => {
    if (isPlaying) {
      audioSynthesis.stopSpeaking();
      setIsPlaying(false);
      setPlaybackProgress(0);
    } else {
      audioSynthesis.stopSpeaking();
      setIsPlaying(true);
      setPlaybackProgress(5);

      const text = getAudioNarrationText(selectedRashi, language);
      audioSynthesis.speakNarration(text, {
        lang: language === 'hi' ? 'hi-IN' : 'en-IN',
        rate: playbackSpeed,
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        },
      });

      // Simulation timer
      let elapsed = 0;
      const totalSec = 110;
      const interval = setInterval(() => {
        if (!audioSynthesis.isSpeaking()) {
          clearInterval(interval);
          setIsPlaying(false);
          setPlaybackProgress(0);
          return;
        }
        elapsed += 1;
        setPlaybackProgress(Math.min(99, Math.round((elapsed / totalSec) * 100)));
      }, 1000);
    }
  };

  const handleShareAudio = () => {
    const text =
      `🎧 *12Rashi Daily Morning Audio Rashi Fal for ${selectedRashi.nameEn} (${selectedRashi.nameHi})* 🎧\n\n` +
      `Ruling Planet: ${selectedRashi.rulingPlanet}\n` +
      `Today's Prediction: "${selectedRashi.today.summary}"\n` +
      `🍀 Lucky Number: ${selectedRashi.today.luckyNumber} | Color: ${selectedRashi.today.luckyColor}\n` +
      `⏳ Abhijit Muhurat: 11:38 AM - 12:26 PM\n` +
      `⚠️ Rahu Kaal: 12:00 PM - 01:30 PM\n\n` +
      `Listen to audio horoscope on 12Rashi: https://12rashi.com\n` +
      `Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubscribePlan = (plan: 'monthly' | 'yearly') => {
    const cost = plan === 'monthly' ? 49 : 149;
    if (walletBalance < cost) {
      setOpenPaymentModal(true);
      return;
    }
    const deducted = deductWallet(cost, `Morning Audio & Muhurat Push Pass (${plan})`);
    if (deducted) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (plan === 'monthly' ? 30 : 365));
      updateMorningPushSubscription({
        subscriptionPlan: plan,
        planExpiryDate: expiry.toLocaleDateString('en-IN'),
        enabled: true,
      });
      addNotification(
        'VIP Morning Push Activated!',
        `Your daily audio Rashi Fal & Muhurat Push subscription is active until ${expiry.toLocaleDateString('en-IN')}.`,
        'muhurat'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold border border-amber-300/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>Daily 6:30 AM Vedic Audio Broadcast & Muhurat Push Service</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            Daily Audio Rashi Fal & Morning Muhurat
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            Start every morning with clarity and cosmic alignment. Listen to your <strong>daily 2-minute personalized Audio Horoscope</strong> spoken by Acharya Devavrat, receive instant <strong>Abhijit Muhurat & Rahu Kaal push alerts</strong>, and get auspicious timings delivered directly to your WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleTogglePlayAudio}
              className="py-3 px-6 rounded-2xl bg-white text-orange-950 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-amber-100 transition transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current text-orange-600" /> : <Play className="w-4 h-4 fill-current text-orange-600" />}
              <span>{isPlaying ? 'Pause Audio' : `Play Today's ${selectedRashi.nameEn} Audio Fal`}</span>
            </button>

            <button
              onClick={triggerTestMorningPush}
              className="py-3 px-5 rounded-2xl bg-black/25 hover:bg-black/35 text-amber-200 font-bold text-xs sm:text-sm border border-amber-300/30 transition cursor-pointer flex items-center gap-2"
              title="Test push notification and sound alert right now"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Test Morning Alert Now</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-amber-200/90 ml-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Chitrapaksha Lahiri Ephemeris Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Rashi Selection Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500">
            Select Rashi for Audio Broadcast (आपकी राशि चुनें)
          </h3>
          <span className="text-[11px] text-orange-600 font-bold">
            Active: {selectedRashi.nameEn} ({selectedRashi.nameHi})
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {RASHIS_DATA.map((rashi) => {
            const isSelected = selectedRashi.id === rashi.id;
            return (
              <button
                key={rashi.id}
                onClick={() => {
                  if (isPlaying) {
                    audioSynthesis.stopSpeaking();
                    setIsPlaying(false);
                  }
                  setSelectedRashi(rashi);
                }}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-white border-orange-600 shadow-md transform scale-105'
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/60 hover:bg-amber-50 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-xl sm:text-2xl leading-none mb-1">{rashi.symbol}</span>
                <span className="text-[11px] font-bold tracking-tight">{rashi.nameEn}</span>
                <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                  {rashi.nameHi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Master Audio Broadcast Studio Card */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
              {selectedRashi.symbol}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {selectedRashi.nameEn} ({selectedRashi.nameSa} / {selectedRashi.nameHi})
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold">
                  {selectedRashi.element} Tatva
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Lord: <strong className="text-orange-600">{selectedRashi.rulingPlanet}</strong> • Daily Audio Duration: ~2:15 mins • Narrated by Acharya Devavrat
              </p>
            </div>
          </div>

          {/* Audio Language & Speed Control */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                हिन्दी स्वर
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => {
                const next = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1.0;
                setPlaybackSpeed(next);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold cursor-pointer"
              title="Change Audio Speed"
            >
              {playbackSpeed}x Speed
            </button>

            <button
              onClick={handleShareAudio}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-emerald-600 transition cursor-pointer"
              title="Share Audio Horoscope"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Player Core Engine */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-stone-800/90 dark:via-stone-800 dark:to-stone-800/90 border border-orange-200 dark:border-stone-700 space-y-4">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlayAudio}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition transform hover:scale-105 cursor-pointer shrink-0 ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-600 dark:text-stone-300">
                <span className="font-bold flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlaying ? 'Broadcasting Vedic Fal...' : 'Ready to Broadcast'}</span>
                </span>
                <span>{isPlaying ? `${playbackProgress}%` : '02:15 min'}</span>
              </div>

              {/* Animated Audio Equalizer Waveform */}
              <div className="flex items-center gap-1 sm:gap-1.5 h-8">
                {[
                  30, 45, 75, 60, 90, 40, 85, 70, 50, 95, 65, 40, 80, 55, 90, 75, 45, 65,
                  85, 50, 70, 90, 60, 40, 80, 55, 95, 70, 50, 30,
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isPlaying
                        ? 'bg-orange-500 animate-pulse'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(15, (val * playbackProgress) / 100)}%`
                        : `${val * 0.35}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Transcript toggle */}
          <div className="pt-2 border-t border-orange-200/60 dark:border-stone-700 flex items-center justify-between text-xs">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{showTranscript ? 'Hide Audio Transcript' : 'Read Full Broadcast Transcript'}</span>
            </button>

            <span className="text-[11px] text-stone-500 font-mono">
              Chitrapaksha Lahiri • Updated Daily 05:00 AM IST
            </span>
          </div>

          {showTranscript && (
            <div className="mt-3 p-4 rounded-xl bg-white dark:bg-stone-900 border border-orange-200 dark:border-stone-700 text-xs sm:text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200 animate-fade-in">
              {getAudioNarrationText(selectedRashi, language)}
            </div>
          )}
        </div>

        {/* Daily Cosmic Coordinates Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide block">
              Lucky Number
            </span>
            <div className="text-lg font-bold text-orange-600 mt-0.5">
              {selectedRashi.today.luckyNumber}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide block">
              Lucky Color
            </span>
            <div className="text-lg font-bold text-amber-600 mt-0.5">
              {selectedRashi.today.luckyColor}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide block">
              Shubh Muhurat
            </span>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">
              11:38 AM - 12:26 PM (Abhijit)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide block">
              Rahu Kaal Caution
            </span>
            <div className="text-sm font-bold text-red-600 mt-0.5">
              12:00 PM - 01:30 PM
            </div>
          </div>
        </div>
      </div>

      {/* Morning Muhurat & Push Subscription Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Automated Morning Alert Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
              Morning Muhurat & Audio Push Service
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Never start an important deed at an inauspicious moment. Receive your daily personalized audio report and auspicious muhurat alerts before you step out.
            </p>
          </div>

          {/* Active plan status */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shrink-0 text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Subscription Status</span>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {morningPushSubscription.subscriptionPlan === 'trial'
                  ? `7-Day Free Trial (${morningPushSubscription.trialDaysLeft} days left)`
                  : `VIP ${morningPushSubscription.subscriptionPlan.toUpperCase()} (Active)`}
              </span>
            </span>
          </div>
        </div>

        {/* Live Muhurat Status Matrix for Today */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Abhijit Muhurat (अभिजीत)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                Auspicious
              </span>
            </div>
            <div className="text-base font-extrabold text-emerald-950 dark:text-emerald-200">
              11:38 AM - 12:26 PM
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
              Ideal for new deals, investments, signing agreements & buying assets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Amrit & Shubh Choghadiya</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                Favorable
              </span>
            </div>
            <div className="text-base font-extrabold text-amber-950 dark:text-amber-200">
              07:00 AM - 08:30 AM & 10:00 - 11:30 AM
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
              Best for travel, medical appointments, and educational activities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-red-800 dark:text-red-300">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Rahu Kaal (राहु काल)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100">
                Caution
              </span>
            </div>
            <div className="text-base font-extrabold text-red-950 dark:text-red-200">
              12:00 PM - 01:30 PM
            </div>
            <p className="text-[11px] text-red-700/80 dark:text-red-400">
              Do not inaugurate ventures or undertake auspicious samskaras during this window.
            </p>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Push Notification & WhatsApp Dispatch Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Preferred Time Slot */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                Morning Alert Timing
              </label>
              <select
                value={morningPushSubscription.timeSlot}
                onChange={(e) =>
                  updateMorningPushSubscription({
                    timeSlot: e.target.value as any,
                  })
                }
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
              >
                <option value="05:30">05:30 AM (Brahma Muhurat & Sadhana)</option>
                <option value="06:30">06:30 AM (Sunrise & Morning Tea - Recommended)</option>
                <option value="07:30">07:30 AM (Commute & Work Readiness)</option>
                <option value="08:30">08:30 AM (Business Day Launch)</option>
              </select>
            </div>

            {/* Target Rashi */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                Subscribed Rashi
              </label>
              <select
                value={morningPushSubscription.targetRashi}
                onChange={(e) =>
                  updateMorningPushSubscription({ targetRashi: e.target.value })
                }
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
              >
                {RASHIS_DATA.map((r) => (
                  <option key={r.id} value={`${r.nameEn} (${r.nameHi})`}>
                    {r.symbol} {r.nameEn} ({r.nameHi})
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp Integration Phone */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                WhatsApp Dispatch Mobile
              </label>
              <input
                type="tel"
                value={morningPushSubscription.whatsappPhone}
                onChange={(e) =>
                  updateMorningPushSubscription({ whatsappPhone: e.target.value })
                }
                placeholder="+91 9831039814"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold outline-hidden"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={morningPushSubscription.includeAudioFal}
                onChange={(e) =>
                  updateMorningPushSubscription({ includeAudioFal: e.target.checked })
                }
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <span>Daily Audio Rashi Fal</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={morningPushSubscription.includeMuhuratAlerts}
                onChange={(e) =>
                  updateMorningPushSubscription({
                    includeMuhuratAlerts: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <span>Shubh Abhijit Alerts</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={morningPushSubscription.includeRahuKaalWarning}
                onChange={(e) =>
                  updateMorningPushSubscription({
                    includeRahuKaalWarning: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <span>Rahu Kaal Warnings</span>
            </label>
          </div>

          {/* Firebase Cloud Messaging (FCM) Device Pairing & Live Test Station */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-amber-50/70 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-amber-200 dark:border-stone-700">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-500 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-stone-900 dark:text-stone-100">
                      Firebase Cloud Messaging (FCM) Device Engine
                    </strong>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      fcmStatus.isRegistered
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {fcmStatus.isRegistered ? 'Device Paired (FCM Active)' : 'Registration Required'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    Delivers daily lock-screen push notifications at {morningPushSubscription.timeSlot} AM IST even when app is closed.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRegisterFcm}
                  disabled={isRegisteringFcm}
                  className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{isRegisteringFcm ? 'Connecting FCM...' : fcmStatus.isRegistered ? 'Re-Sync Device' : 'Enable Mobile FCM Push'}</span>
                </button>
              </div>
            </div>

            {/* Instant Push Alert Test Suite */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Send Instant Test Push Alert to this Device:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSendFcmTestAlert('muhurat')}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <Sun className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-xs text-stone-800 dark:text-stone-200 block">
                      Abhijit Muhurat Alert
                    </strong>
                    <span className="text-[10px] text-stone-500">Instant Shubh window alert</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendFcmTestAlert('audio_fal')}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-orange-300 dark:border-orange-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <strong className="text-xs text-stone-800 dark:text-stone-200 block">
                      Daily Audio Rashi Fal
                    </strong>
                    <span className="text-[10px] text-stone-500">2-Min morning spoken fal</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendFcmTestAlert('rahu_kaal')}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-red-300 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-xs text-stone-800 dark:text-stone-200 block">
                      Rahu Kaal Caution
                    </strong>
                    <span className="text-[10px] text-stone-500">Inauspicious window alert</span>
                  </div>
                </button>
              </div>

              {lastDispatchedAlert && (
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lastDispatchedAlert}</span>
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">Dispatched</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Micro-Subscription Upgrade Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <h4 className="font-bold text-base">
                Upgrade to 12Rashi VIP Morning Push Pass
              </h4>
            </div>
            <p className="text-xs text-amber-100 max-w-xl">
              Lock in guaranteed 365-day morning WhatsApp broadcasts + daily audio horoscopes + personalized Nakshatra muhurat calculations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSubscribePlan('monthly')}
              className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 cursor-pointer transition"
            >
              ₹49 / Month
            </button>

            <button
              onClick={() => handleSubscribePlan('yearly')}
              className="py-2.5 px-5 rounded-xl bg-white text-orange-950 hover:bg-amber-100 text-xs font-extrabold shadow-lg cursor-pointer transition transform hover:scale-105"
            >
              ₹149 / Year (Save 75%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
