import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  PhoneCall,
  Clock,
  ShieldCheck,
  Award,
  Flame,
  FileText,
  Volume2,
  Users,
  CheckCircle2,
  HelpCircle,
  Zap,
  Gift,
  Play,
  RotateCcw,
  Star,
  Mic,
  Headphones,
  Check,
} from 'lucide-react';

interface OnboardingModalProps {
  onNavigate?: (tab: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onNavigate }) => {
  const {
    openOnboardingModal,
    setOpenOnboardingModal,
    hasClaimedFreeTrial,
    claimFreeTrial,
    addNotification,
    setOpenAsyncQuestionModal,
    setOpenTatkalModal,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedInquiryGoal, setSelectedInquiryGoal] = useState<string>('career');
  const [interactiveKundliTab, setInteractiveKundliTab] = useState<'lagna' | 'planets' | 'dasha'>('lagna');
  const [selectedDemoRashi, setSelectedDemoRashi] = useState<string>('Mesha (Aries)');
  const [isPlayingDemoAudio, setIsPlayingDemoAudio] = useState(false);
  const [demoSeedNumber, setDemoSeedNumber] = useState<number>(108);

  const totalSlides = 5;

  // Keyboard navigation & lock scroll
  useEffect(() => {
    if (!openOnboardingModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openOnboardingModal, currentSlide]);

  if (!openOnboardingModal) return null;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      audioSynthesis.playTempleBell(659, 0.4);
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      audioSynthesis.playTempleBell(523, 0.3);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('12rashi_onboarding_completed', 'true');
    } catch {
      // ignore
    }
    setOpenOnboardingModal(false);
  };

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('12rashi_onboarding_completed', 'true');
    } catch {
      // ignore
    }
    if (!hasClaimedFreeTrial) {
      claimFreeTrial();
    }
    audioSynthesis.playTempleBell(880, 1.4);
    addNotification(
      'Welcome to 12Rashi!',
      'Your onboarding tour is complete. ₹100 Welcome consultation credit is active.',
      'muhurat'
    );
    setOpenOnboardingModal(false);
  };

  const handleDirectFeatureLaunch = (tab: string) => {
    handleDismiss();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handlePlaySampleAudio = () => {
    if (isPlayingDemoAudio) {
      audioSynthesis.stopSpeaking();
      setIsPlayingDemoAudio(false);
      return;
    }

    setIsPlayingDemoAudio(true);
    const text = `Hari Om. Daily Vedic forecast for ${selectedDemoRashi}. Today Moon transits an auspicious Nakshatra, creating strong Dhana Yoga for business decisions. Shubh Abhijit Muhurat is active between 11:45 AM and 12:30 PM. Chant Om Namah Shivaya for divine peace.`;
    audioSynthesis.speakNarration(text, {
      lang: 'en-IN',
      rate: 1.0,
      pitch: 1.0,
      onEnd: () => setIsPlayingDemoAudio(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar with Progress Indicator and Skip */}
        <div className="p-4 sm:px-6 sm:py-3.5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Platform Tour
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Step {currentSlide + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="text-xs font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition px-2 py-1 rounded-lg cursor-pointer"
            >
              Skip Tour
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label="Close onboarding modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Step Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 h-1 transition-all duration-300 ease-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Scrollable Slide Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* SLIDE 0: Welcome to 12Rashi */}
          {currentSlide === 0 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg mx-auto mb-1">
                  <Compass className="w-7 h-7 text-amber-100 animate-spin-slow" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  Welcome to 12Rashi
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                  India’s trusted Vedic Astrology sanctuary. Authentic Parashari ephemeris, 1,500+ verified Acharyas, transparent per-second billing, and microsecond accuracy.
                </p>
              </div>

              {/* Inquiry Goal Selector */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-extrabold uppercase tracking-wide text-stone-700 dark:text-stone-300">
                  What is your primary focus today? (Select one)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'career',
                      icon: '💼',
                      title: 'Career & Wealth Growth',
                      desc: 'Promotion timing, foreign travel & financial dashas',
                    },
                    {
                      id: 'marriage',
                      icon: '💍',
                      title: 'Love & Kundli Milan',
                      desc: '36-Guna compatibility, Manglik dosha & marriage dates',
                    },
                    {
                      id: 'daily',
                      icon: '🧭',
                      title: 'Daily Panchang & Rashi Fal',
                      desc: 'Shubh Muhurat, Rahu Kaal & daily 2-minute audio forecast',
                    },
                    {
                      id: 'family',
                      icon: '👨‍👩‍👧‍👦',
                      title: 'Family Kundlis & Remedies',
                      desc: 'Family vault with 10 charts, dosha shanti & sacred mantras',
                    },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        setSelectedInquiryGoal(goal.id);
                        audioSynthesis.playTempleBell(784, 0.2);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                        selectedInquiryGoal === goal.id
                          ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/20'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-orange-300'
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{goal.icon}</span>
                      <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                          {goal.title}
                        </strong>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                          {goal.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">1,500+</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Verified Acharyas</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">Fair-Billing</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Per-Sec Billing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">₹100 Credit</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Welcome Gift</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: Janam & 50+ Page Kundli Reports */}
          {currentSlide === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Feature Pillar 1</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                  Janam Kundli & 50+ Page Brihat Dossiers
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Calculate full Vedic natal charts instantly for free, or download an exhaustive 50+ page Brihat Kundli PDF dossier with a 120-year Vimshottari Mahadasha timeline.
                </p>
              </div>

              {/* Interactive Kundli Preview Tab */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Live Chart Preview
                  </span>
                  <div className="flex gap-1">
                    {(['lagna', 'planets', 'dasha'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setInteractiveKundliTab(tab);
                          audioSynthesis.playTempleBell(880, 0.2);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer capitalize ${
                          interactiveKundliTab === tab
                            ? 'bg-orange-500 text-white'
                            : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content simulation */}
                {interactiveKundliTab === 'lagna' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 block font-bold">ASCENDANT (लग्न)</span>
                      <strong className="text-sm text-orange-600 block mt-0.5">Mesha (Aries)</strong>
                      <span className="text-[10px] text-stone-500">Lord: Mars (मंगल)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 block font-bold">MOON SIGN (राशि)</span>
                      <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">Vrishabha (Taurus)</strong>
                      <span className="text-[10px] text-stone-500">Exalted (उच्च राशि)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 block font-bold">NAKSHATRA (नक्षत्र)</span>
                      <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">Rohini Pada 2</strong>
                      <span className="text-[10px] text-stone-500">Lord: Moon (चन्द्र)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] text-stone-400 block font-bold">SUN SIGN (सूर्य)</span>
                      <strong className="text-sm text-stone-900 dark:text-stone-100 block mt-0.5">Simha (Leo)</strong>
                      <span className="text-[10px] text-stone-500">Own Sign (स्वराशि)</span>
                    </div>
                  </div>
                )}

                {interactiveKundliTab === 'planets' && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-800 dark:text-stone-200">Sun (सूर्य):</span> 14° Leo (5th House)
                    </div>
                    <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-800 dark:text-stone-200">Jupiter (गुरु):</span> 21° Cancer (Exalted)
                    </div>
                    <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-800 dark:text-stone-200">Venus (शुक्र):</span> 18° Libra (Malavya Yoga)
                    </div>
                  </div>
                )}

                {interactiveKundliTab === 'dasha' && (
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                      <span>Current Mahadasha: Jupiter (गुरु)</span>
                      <span className="text-emerald-600 font-extrabold">Active 16-Year Phase</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Sub-Period (Antardasha): Saturn (शनि) · Brings steady professional recognition and long-term asset accumulation.
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <div className="text-xs">
                  <strong className="text-stone-900 dark:text-stone-100 block">
                    Ready to calculate your personal birth chart?
                  </strong>
                  <span className="text-stone-600 dark:text-stone-400">
                    Takes only 10 seconds. Free instant calculation.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDirectFeatureLaunch('kundli')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Open Kundli Generator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 2: Verified Expert Consultations & ₹99 Voice Notes */}
          {currentSlide === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Feature Pillar 2</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                  Expert Consultations & Voice Notes
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Speak live with India’s top certified astrologers or submit private asynchronous voice questions. Protected by our 100% Fair-Billing Guarantee.
                </p>
              </div>

              {/* Consultation Format Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Live Call & Chat
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    Transparent per-second billing with auto refund in the 1st minute if unsatisfied.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                    <Mic className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Voice Note Q&A (₹99)
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    No time for a live call? Ask targeted questions and get a personalized audio recording.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-50/80 dark:bg-stone-800/60 border border-red-200 dark:border-stone-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Tatkal VIP (&lt;60s)
                  </strong>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    Emergency priority queue for urgent decisions. Instant connect with senior astrologers.
                  </p>
                </div>
              </div>

              {/* Interactive Sample Astrologer Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg font-serif">
                    आ
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-sm font-bold">Acharya Vidyadhar Shastri</strong>
                      <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">4.96 ★</span>
                    </div>
                    <span className="text-xs text-amber-100 block">
                      Vedic Parashari & KP Gold Medalist · 24 Years Exp.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleDismiss();
                    setOpenTatkalModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white text-orange-950 font-extrabold text-xs shadow-md hover:bg-amber-100 transition cursor-pointer shrink-0"
                >
                  Connect Live
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 3: Daily Horoscopes & 2-Minute Audio Rashi Fal */}
          {currentSlide === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Feature Pillar 3</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                  Daily Audio Rashi Fal & Morning Muhurat
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Start every morning with your personalized 2-minute spoken horoscope forecast, auspicious Abhijit Choghadiya timings, and daily Rahu Kaal warnings.
                </p>
              </div>

              {/* Interactive Rashi Selector & Audio Demo */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  Choose your Moon Sign (Rashi) to test the daily audio:
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {[
                    'Mesha (Aries)',
                    'Vrishabha (Taurus)',
                    'Mithuna (Gemini)',
                    'Karka (Cancer)',
                    'Simha (Leo)',
                    'Kanya (Virgo)',
                    'Tula (Libra)',
                    'Vrishchika (Scorpio)',
                    'Dhanu (Sagittarius)',
                    'Makara (Capricorn)',
                    'Kumbha (Aquarius)',
                    'Meena (Pisces)',
                  ].map((rashi) => (
                    <button
                      key={rashi}
                      type="button"
                      onClick={() => {
                        setSelectedDemoRashi(rashi);
                        if (isPlayingDemoAudio) {
                          audioSynthesis.stopSpeaking();
                          setIsPlayingDemoAudio(false);
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer text-left truncate ${
                        selectedDemoRashi === rashi
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {rashi.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Spoken Audio Player Simulation */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      Spoken Forecast for {selectedDemoRashi}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Vedic Chime + Natural Narration (English & Hindi)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaySampleAudio}
                    className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingDemoAudio ? 'Stop Preview' : 'Play Preview'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Launch Action */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-500">Free daily service with automated 6:00 AM push alerts</span>
                <button
                  type="button"
                  onClick={() => handleDirectFeatureLaunch('daily-audio')}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Go to Daily Audio Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 4: "Unknown Birth Time" Prashna & Family Vault */}
          {currentSlide === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Feature Pillar 4</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                  Zero Birth-Time Limits & Family Vault
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Never get blocked by missing hospital records. Cast instant KP Prashna Horary charts, and securely store horoscopes for up to 10 family members in your Family Vault.
                </p>
              </div>

              {/* KP Prashna Simulation Card */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      Prashna Kundli (Unknown Birth Time)
                    </strong>
                    <span className="text-[11px] text-stone-500">
                      Pick any sacred seed (1 to 249) to compute instant binary answers
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 uppercase">
                    No Birth Time
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="249"
                    value={demoSeedNumber}
                    onChange={(e) => setDemoSeedNumber(parseInt(e.target.value) || 1)}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="w-16 text-center font-mono font-bold text-xs p-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                    #{demoSeedNumber}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">VERDICT SIMULATION:</span>
                    <strong className="text-emerald-600 font-black">
                      {demoSeedNumber % 2 === 0 ? 'Favorable Outcome (कार्य सिद्धि)' : 'Highly Favorable (शुभ योग)'}
                    </strong>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold">
                    Confidence: 94% · Timing: Within 3 Weeks
                  </span>
                </div>
              </div>

              {/* Welcome Bonus Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white space-y-1.5 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <strong className="text-sm font-bold">Your ₹100 Free Consultation Bonus is Ready</strong>
                </div>
                <p className="text-xs text-emerald-100 leading-snug">
                  Apply your introductory credit towards your first live astrologer call or asynchronous voice note.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation & Action Bar */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/80 flex items-center justify-between gap-3">
          {/* Slide Indicator Beads */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  audioSynthesis.playTempleBell(659, 0.2);
                  setCurrentSlide(idx);
                }}
                className={`transition-all duration-200 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-2 rounded-full bg-orange-500'
                    : 'w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev and Next Action Buttons */}
          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                type="button"
                onClick={goToPrevSlide}
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={goToNextSlide}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentSlide === totalSlides - 1 ? 'Start Exploring (Claim ₹100)' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
