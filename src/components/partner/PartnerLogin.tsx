import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from '../common/Logo.tsx';
import {
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  UserCheck,
  Award,
  DollarSign,
  Clock,
  CheckCircle2,
  Lock,
  Globe,
  Headphones,
  Wallet,
  Calendar,
  Building,
  GraduationCap,
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
  const [otpError, setOtpError] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application form fields
  const [applyName, setApplyName] = useState('');
  const [applyTitle, setApplyTitle] = useState('Senior Vedic Astrologer & Kundli Specialist');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyExp, setApplyExp] = useState(12);
  const [applyEducation, setApplyEducation] = useState('Sampurnanand Sanskrit Vishwavidyalaya, Varanasi (Acharya)');
  const [applySpecialty, setApplySpecialty] = useState<AstrologerSpecialty>('Vedic Astrology');
  const [applyChatRate, setApplyChatRate] = useState(25);
  const [applyCallRate, setApplyCallRate] = useState(30);
  const [applyVideoRate, setApplyVideoRate] = useState(50);
  const [applyAbout, setApplyAbout] = useState('Learned classical Parashari and Jaimini astrology under hereditary guru parampara. 12+ years guiding seekers worldwide in career, relationships, and remedial astrology.');

  React.useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  const handleSendOtp = async () => {
    setOtpError('');
    const digits = identifier.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setOtpError('Enter a valid 10-digit registered Indian mobile number to receive your SMS verification code.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits, purpose: 'partner_login' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpCooldown(30);
      } else {
        setOtpError(data.message || 'Unable to send SMS verification code right now.');
      }
    } catch {
      setOtpError('Network error while sending verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsSubmitting(true);

    if (authMode === 'dlt_otp') {
      const digits = identifier.replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(digits) || !/^\d{6}$/.test(otp.trim())) {
        setOtpError('Enter your registered 10-digit mobile number and the exact 6-digit SMS OTP code.');
        setIsSubmitting(false);
        return;
      }
      try {
        const res = await fetch('/api/sms/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: digits, otp: otp.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success || !data.verified) {
          setOtpError(data.message || 'Invalid or expired OTP code. Please check your SMS.');
          setIsSubmitting(false);
          return;
        }
      } catch {
        setOtpError('Could not verify OTP due to network error. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    // Find matching astrologer or default to first
    const matched = astrologers.find(
      (a) => a.id === identifier || a.name.toLowerCase().includes(identifier.toLowerCase())
    ) || astrologers[0];

    await loginPartner(matched.id, identifier);
    setIsSubmitting(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyPhone.trim()) return;
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
      applyEmail || 'astrologer@12rashi.com'
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-amber-300/80 dark:border-stone-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95">
        
        {/* Left Side: Professional Astrologer Recruitment & Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-800 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <Logo size="md" showTagline={false} />

            <div className="pt-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Partner Recruitment
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mt-2 leading-tight">
                Join India&apos;s Most Trusted Astrologer Network
              </h2>
              <p className="text-xs text-amber-100/90 mt-2 leading-relaxed">
                Connect with thousands of active seekers worldwide. Conduct live voice, video, and chat consultations with transparent daily earnings and guaranteed payouts.
              </p>
            </div>

            {/* Professional Hiring Features */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">70% Net Revenue Share</span>
                  <p className="text-[11px] text-amber-200/80">Keep 70% of consultation revenue with zero commission on devotee tips.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">Daily UPI & Bank Settlements</span>
                  <p className="text-[11px] text-amber-200/80">Automated daily payouts directly to your verified bank or UPI account.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">Flexible 24/7 Schedule</span>
                  <p className="text-[11px] text-amber-200/80">Go online or offline instantly; counsel seekers at your convenience.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white">Global Seeker Exposure</span>
                  <p className="text-[11px] text-amber-200/80">Built-in Kundli calculator, Prashna tools, and client CRM included.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom helpline info */}
          <div className="relative z-10 pt-5 mt-5 border-t border-white/15 text-[11px] text-amber-200/90">
            <span>Astrologer Onboarding Desk:</span>
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
                  type="button"
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
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className={`text-sm font-bold pb-1 transition cursor-pointer border-b-2 ${
                    activeTab === 'apply'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  Join as Expert Astrologer
                </button>
              </div>

              <button
                type="button"
                onClick={onBackToSeeker || toggleRole}
                className="text-xs text-stone-500 hover:text-orange-600 font-semibold cursor-pointer transition"
              >
                ← Back to Seeker App
              </button>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-5">
                {/* Auth Mode Toggle: Password vs OTP */}
                <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl max-w-xs text-xs">
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => setAuthMode('dlt_otp')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      authMode === 'dlt_otp'
                        ? 'bg-white dark:bg-stone-900 text-orange-600 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>SMS OTP</span>
                  </button>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Astrologer ID / Registered Phone Number
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder="e.g. 9831039814 or ID"
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500 font-medium"
                    />
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
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        SMS Verification Code (OTP)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          className="flex-1 px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs outline-hidden font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp || otpCooldown > 0}
                          className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer border border-stone-200 dark:border-stone-700 shrink-0 disabled:opacity-50"
                        >
                          {isSendingOtp
                            ? 'Sending...'
                            : otpCooldown > 0
                              ? `Resend (${otpCooldown}s)`
                              : otpSent
                                ? 'Resend OTP'
                                : 'Send OTP'}
                        </button>
                      </div>
                      {otpError && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
                          {otpError}
                        </p>
                      )}
                      {otpSent && !otpError && (
                        <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verification code sent to your registered mobile.</span>
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
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
                    Astrologer Full Legal Name *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Mobile Number (For UPI Payouts) *
                    </label>
                    <input
                      type="tel"
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={applyEmail}
                      onChange={(e) => setApplyEmail(e.target.value)}
                      required
                      placeholder="astrologer@domain.com"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      Chat (₹/min)
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
                      Call (₹/min)
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
                      Video (₹/min)
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
                    Astrological Lineage & Bio
                  </label>
                  <textarea
                    rows={2}
                    value={applyAbout}
                    onChange={(e) => setApplyAbout(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Submit Application & Activate Console</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
