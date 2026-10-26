import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from '../common/Logo.tsx';
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Sparkles,
  ArrowRight,
  UserCheck,
  Award,
  DollarSign,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Building,
  GraduationCap,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { AstrologerSpecialty } from '../../types/astrology.ts';

interface PartnerLoginProps {
  onBackToSeeker?: () => void;
}

export const PartnerLogin: React.FC<PartnerLoginProps> = ({ onBackToSeeker }) => {
  const { loginPartner, registerPartner, astrologers, toggleRole } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'apply'>('signin');
  const [authMode, setAuthMode] = useState<'password' | 'dlt_otp'>('password');

  // Sign In form fields
  const [identifier, setIdentifier] = useState('9831039814');
  const [password, setPassword] = useState('12rashi@2026');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application form fields
  const [applyName, setApplyName] = useState('');
  const [applyTitle, setApplyTitle] = useState('Vedic Astrologer & Kundli Specialist');
  const [applyPhone, setApplyPhone] = useState('9831039814');
  const [applyEmail, setApplyEmail] = useState('acharyaji@12rashi.com');
  const [applyExp, setApplyExp] = useState(12);
  const [applyEducation, setApplyEducation] = useState('Shri Lal Bahadur Shastri National Sanskrit University (Acharya)');
  const [applySpecialty, setApplySpecialty] = useState<AstrologerSpecialty>('Vedic Astrology');
  const [applyChatRate, setApplyChatRate] = useState(20);
  const [applyCallRate, setApplyCallRate] = useState(25);
  const [applyVideoRate, setApplyVideoRate] = useState(45);
  const [applyAbout, setApplyAbout] = useState('Learned Parashari and Jaimini astrology under hereditary guru parampara. 12+ years guiding seekers worldwide.');

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('748291');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Find matching astrologer or default to first
    const matched = astrologers.find(
      (a) => a.id === identifier || a.name.toLowerCase().includes(identifier.toLowerCase())
    ) || astrologers[0];

    await loginPartner(matched.id, identifier);
    setIsSubmitting(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim()) return;
    setIsSubmitting(true);

    await registerPartner(
      {
        name: applyName,
        title: applyTitle,
        experienceYears: applyExp,
        education: applyEducation,
        specialties: [applySpecialty, 'Kundli & Horoscope', 'Career & Wealth'],
        chatRate: applyChatRate,
        callRate: applyCallRate,
        videoRate: applyVideoRate,
        about: applyAbout,
      },
      applyPhone,
      applyEmail
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-amber-300/80 dark:border-stone-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95">
        
        {/* Left Side: Astrologer Partner Brand Identity & Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-800 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle cosmic circle graphic */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <Logo size="md" showTagline={false} />

            <div className="pt-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Partner Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mt-2 leading-tight">
                Empowering India's Foremost Astrologers
              </h2>
              <p className="text-xs text-amber-100/90 mt-2 leading-relaxed">
                Connect with thousands of authentic seekers worldwide. Conduct live voice, video, and chat sessions with transparent 70/30 revenue share (70% Astrologer / 30% Platform) and daily UPI settlements.
              </p>
            </div>

            {/* Platform Advantages List */}
            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">70/30 Astrologer Revenue Share</span>
                  <p className="text-[11px] text-amber-200/80">70% net consultation fee directly to Astrologer with zero commission on tips.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">Flexible Real-Time Availability</span>
                  <p className="text-[11px] text-amber-200/80">Go online or offline with 1 click; work at your own hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">TRAI DLT Verified Network</span>
                  <p className="text-[11px] text-amber-200/80">Registered Entity: 1201171886368224321</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom helpline info */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-[11px] text-amber-200/90">
            <span>Astrologer Partner Onboarding Desk:</span>
            <div className="font-bold text-white text-xs mt-0.5">
              📞 +91 9831039814 • 12rashi.com@gmail.com
            </div>
          </div>
        </div>

        {/* Right Side: Login & Registration Tabs */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-stone-900">
          <div>
            {/* Top Switcher: Sign In vs Apply as Partner */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`text-sm font-bold pb-1 transition cursor-pointer border-b-2 ${
                    activeTab === 'signin'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  Astrologer Sign In
                </button>
                <span className="text-stone-300 dark:text-stone-700">|</span>
                <button
                  onClick={() => setActiveTab('apply')}
                  className={`text-sm font-bold pb-1 transition cursor-pointer border-b-2 ${
                    activeTab === 'apply'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  Join as Partner Astrologer
                </button>
              </div>

              <button
                onClick={onBackToSeeker || toggleRole}
                className="text-xs text-stone-500 hover:text-orange-600 font-semibold cursor-pointer transition"
              >
                ← Back to Seeker App
              </button>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-5">
                {/* Auth Mode Toggle: Password vs DLT OTP */}
                <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl max-w-xs text-xs">
                  <button
                    onClick={() => setAuthMode('password')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      authMode === 'password'
                        ? 'bg-white dark:bg-stone-900 text-orange-600 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Password Login
                  </button>
                  <button
                    onClick={() => setAuthMode('dlt_otp')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      authMode === 'dlt_otp'
                        ? 'bg-white dark:bg-stone-900 text-orange-600 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>DLT OTP</span>
                  </button>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Astrologer ID / Registered Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        placeholder="e.g. 9831039814 or Registered Name"
                        className="w-full pl-3 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  {authMode === 'password' ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                          Security Password
                        </label>
                        <span className="text-[11px] text-orange-600 cursor-pointer hover:underline">
                          Forgot Password?
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-3 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        TRAI DLT Verified One-Time Password
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit OTP (Try 748291)"
                          className="flex-1 px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs outline-hidden font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer border border-stone-200 dark:border-stone-700 shrink-0"
                        >
                          {otpSent ? 'Resend (58s)' : 'Send DLT OTP'}
                        </button>
                      </div>
                      {otpSent && (
                        <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>OTP sent to your registered mobile number via SMS.</span>
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Authenticating...' : 'Enter Astrologer Console'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ASTROLOGER REGISTRATION & APPLICATION */}
            {activeTab === 'apply' && (
              <form onSubmit={handleApply} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Astrologer Legal Full Name
                  </label>
                  <input
                    type="text"
                    value={applyName}
                    onChange={(e) => setApplyName(e.target.value)}
                    required
                    placeholder="e.g. Acharya Vasudev Shastri"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={applyTitle}
                      onChange={(e) => setApplyTitle(e.target.value)}
                      required
                      placeholder="e.g. Senior Vedic Jyotish Master"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={applyExp}
                      onChange={(e) => setApplyExp(Number(e.target.value))}
                      required
                      min={1}
                      max={60}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Vedic Gurukul / University Credentials
                  </label>
                  <input
                    type="text"
                    value={applyEducation}
                    onChange={(e) => setApplyEducation(e.target.value)}
                    required
                    placeholder="e.g. Sampurnanand Sanskrit Vishwavidyalaya, Varanasi"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                      Chat Rate (₹/m)
                    </label>
                    <input
                      type="number"
                      value={applyChatRate}
                      onChange={(e) => setApplyChatRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                      Call Rate (₹/m)
                    </label>
                    <input
                      type="number"
                      value={applyCallRate}
                      onChange={(e) => setApplyCallRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                      Video (₹/m)
                    </label>
                    <input
                      type="number"
                      value={applyVideoRate}
                      onChange={(e) => setApplyVideoRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Bio & Astrological Lineage
                  </label>
                  <textarea
                    rows={2}
                    value={applyAbout}
                    onChange={(e) => setApplyAbout(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-300/60 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300">
                  <span>DLT Registered SMS OTP will be dispatched to <strong>{applyPhone}</strong> upon submission.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Submit & Activate Partner Profile</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
