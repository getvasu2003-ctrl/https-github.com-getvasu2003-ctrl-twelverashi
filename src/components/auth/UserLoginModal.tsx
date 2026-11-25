import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Gift,
  RefreshCw,
  Compass,
  PhoneCall,
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean;
}

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const POPULAR_INDIAN_CITIES = [
  'New Delhi, India',
  'Mumbai, India',
  'Kolkata, India',
  'Bengaluru, India',
  'Hyderabad, India',
  'Chennai, India',
  'Pune, India',
  'Jaipur, India',
];

function sanitizeIndianPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(2, 12);
  }
  if (digits.length > 10 && digits.startsWith('0')) {
    return digits.slice(1, 11);
  }
  return digits.slice(0, 10);
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  isPage = false,
}) => {
  const {
    user,
    isUserLoggedIn,
    loginWithPhone,
    logoutUser,
    saveAstroProfile,
    setOpenAstroProfileModal,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState<'text' | 'voice' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(180);

  // Step 3: Optional fast new-user cosmic profile setup
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState<'male' | 'female' | 'other'>('male');
  const [userDob, setUserDob] = useState('');
  const [userTob, setUserTob] = useState('09:30');
  const [unknownTob, setUnknownTob] = useState(false);
  const [userPob, setUserPob] = useState('New Delhi, India');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyingRef = useRef(false);

  // Resend cooldown & 3-minute DLT OTP expiry countdown
  useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setOtpExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Verify OTP strictly against live MSG91 / Jio DLT server endpoint (zero dummy OTPs)
  const submitOtpVerification = useCallback(
    async (fullOtp: string) => {
      if (verifyingRef.current) return;
      if (!/^\d{6}$/.test(fullOtp)) {
        setErrorMessage('Please enter the complete 6-digit OTP received via SMS.');
        return;
      }

      verifyingRef.current = true;
      setIsLoading(true);
      setErrorMessage('');
      setSuccessNotice('');

      const cleanDigits = sanitizeIndianPhoneInput(phoneNumber);

      try {
        const res = await fetch('/api/sms/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanDigits, otp: fullOtp }),
        });
        const data = await res.json();

        if (res.ok && data.success && data.verified) {
          const loginResult = await loginWithPhone(cleanDigits);
          if (loginResult.success) {
            if (loginResult.isNewUser) {
              setSuccessNotice('Mobile verified! Personalize your free Janam Kundli below.');
              setStep('profile');
            } else {
              setSuccessNotice('Welcome back! Mobile verified via Jio DLT.');
              setTimeout(() => {
                onClose();
              }, 650);
            }
          }
        } else {
          setErrorMessage(
            data.message || 'Incorrect or expired OTP code. Please check the SMS from TWRSHI.'
          );
          setOtpDigits(['', '', '', '', '', '']);
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }
      } catch {
        setErrorMessage(
          'Unable to reach verification server. Please check your internet connection and try again.'
        );
      } finally {
        setIsLoading(false);
        verifyingRef.current = false;
      }
    },
    [phoneNumber, loginWithPhone, onClose]
  );

  // Android Chrome / TWA WebOTP API support for 1-tap automatic SMS OTP fill
  useEffect(() => {
    if (step !== 'otp' || typeof window === 'undefined' || !('OTPCredential' in window)) {
      return;
    }

    const abortController = new AbortController();
    const nav = navigator as Navigator & {
      credentials?: {
        get: (opts: any) => Promise<{ code?: string } | null>;
      };
    };

    nav.credentials
      ?.get({
        otp: { transport: ['sms'] },
        signal: abortController.signal,
      })
      .then((otpCred) => {
        const code = otpCred?.code?.replace(/\D/g, '').slice(0, 6);
        if (code && code.length === 6) {
          setOtpDigits(code.split(''));
          submitOtpVerification(code);
        }
      })
      .catch(() => {
        // User dismissed prompt or browser aborted — manual input works smoothly
      });

    return () => abortController.abort();
  }, [step, submitOtpVerification]);

  // Reset modal flow cleanly when reopened while logged out
  useEffect(() => {
    if (isOpen && !isUserLoggedIn && step !== 'profile') {
      setErrorMessage('');
    }
  }, [isOpen, isUserLoggedIn, step]);

  if (!isOpen && !isPage) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    const cleanDigits = sanitizeIndianPhoneInput(phoneNumber);
    if (!INDIAN_MOBILE_REGEX.test(cleanDigits)) {
      setErrorMessage('Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanDigits, purpose: 'login' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPhoneNumber(cleanDigits);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessNotice(`Live SMS OTP sent via TWRSHI to +91 ${cleanDigits}`);
        setStep('otp');
        setResendTimer(30);
        setOtpExpiryTimer(data.expiresInSeconds || 180);
      } else {
        setErrorMessage(
          data.message || 'Could not dispatch SMS OTP right now. Please try again in a moment.'
        );
      }
    } catch {
      setErrorMessage(
        'Network error while sending SMS OTP. Please verify your internet connection and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    // Support OS keyboard SMS autofill pasting all 6 digits into box 0
    if (cleaned.length >= 6) {
      const six = cleaned.slice(0, 6).split('');
      setOtpDigits(six);
      inputRefs.current[5]?.focus();
      submitOtpVerification(six.join(''));
      return;
    }

    const digit = cleaned.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMessage('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const joined = newDigits.join('');
    if (joined.length === 6) {
      submitOtpVerification(joined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasteData.length, 5);
      inputRefs.current[nextFocus]?.focus();
      if (pasteData.length === 6) {
        submitOtpVerification(pasteData);
      }
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOtpVerification(otpDigits.join(''));
  };

  const handleResendOtp = async (retryType: 'text' | 'voice' = 'text') => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(retryType);
    setErrorMessage('');
    setSuccessNotice('');

    try {
      const cleanDigits = sanitizeIndianPhoneInput(phoneNumber);
      const res = await fetch('/api/sms/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanDigits, retryType }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessNotice(
          retryType === 'voice'
            ? `Voice call OTP initiated to +91 ${cleanDigits}. Please pick up to hear your code.`
            : `Fresh SMS OTP sent via TWRSHI to +91 ${cleanDigits}.`
        );
        setResendTimer(30);
        setOtpExpiryTimer(180);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      } else {
        setErrorMessage(data.message || 'Unable to resend OTP right now. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while resending OTP. Please try again.');
    } finally {
      setIsResending(null);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedName = userName.trim();
    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your name so your Kundli & Acharyas can greet you properly.');
      return;
    }

    setIsLoading(true);
    try {
      await saveAstroProfile({
        name: trimmedName,
        gender: userGender,
        dob: userDob || '1995-05-15',
        tob: unknownTob ? '06:00' : userTob || '09:30',
        pob: userPob.trim() || 'New Delhi, India',
      });
      setSuccessNotice('Cosmic Profile & Janam Kundli saved!');
      setTimeout(() => {
        setStep('phone');
        onClose();
      }, 600);
    } catch {
      setErrorMessage('Could not save profile right now. You can update it anytime from My Profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatExpiry = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const showProfileSetup = step === 'profile' && isUserLoggedIn;

  const content = (
    <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md shadow-2xl border border-orange-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
      {/* Header Banner */}
      <div className="relative p-6 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner shrink-0">
              {showProfileSetup ? (
                <Sparkles className="w-5 h-5 text-amber-200" />
              ) : (
                <Phone className="w-5 h-5 text-amber-200" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-snug">
                {showProfileSetup
                  ? 'Personalize Your Kundli'
                  : isUserLoggedIn
                    ? 'My 12Rashi Account'
                    : step === 'otp'
                      ? 'Verify SMS OTP'
                      : 'Sign In with Mobile'}
              </h2>
              <p className="text-xs text-amber-100 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {showProfileSetup
                    ? 'Step 2 of 2 · Instant Free Birth Chart'
                    : 'Jio DLT Verified (TWRSHI) · 100% Private'}
                </span>
              </p>
            </div>
          </div>

          {!isPage && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sign in dialog"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="p-6 space-y-5 text-stone-800 dark:text-stone-200 overflow-y-auto">
        {/* STEP 3: NEW USER QUICK COSMIC PROFILE SETUP */}
        {showProfileSetup ? (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Your mobile is verified and your <strong>5-Min Free Call + ₹100 Welcome Credit</strong> are ready. Add your birth details once to unlock personalized daily Muhurat, Rashi Fal & Janam Kundli.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-600" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                maxLength={60}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setUserGender(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition cursor-pointer ${
                    userGender === g
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  value={userDob}
                  onChange={(e) => setUserDob(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Time of Birth</span>
                </label>
                <input
                  type="time"
                  value={userTob}
                  disabled={unknownTob}
                  onChange={(e) => setUserTob(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unknownTob}
                onChange={(e) => setUnknownTob(e.target.checked)}
                className="rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span>I don&apos;t know my exact birth time (Use Sunrise / Prashna mode)</span>
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Place of Birth</span>
              </label>
              <input
                type="text"
                value={userPob}
                onChange={(e) => setUserPob(e.target.value)}
                placeholder="City, State"
                maxLength={80}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_INDIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setUserPob(city)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                      userPob === city
                        ? 'bg-orange-100 dark:bg-orange-950/60 border-orange-400 text-orange-800 dark:text-orange-200'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-orange-300'
                    }`}
                  >
                    {city.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculating Janam Kundli...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Generate Free Kundli & Enter App</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                onClose();
              }}
              className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
            >
              Skip for now — Browse Astrologers
            </button>
          </form>
        ) : isUserLoggedIn && user ? (
          /* LOGGED IN ACCOUNT VIEW */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-stone-900 dark:text-white truncate">
                    {user.name}
                  </h3>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono tabular-nums mt-0.5">+91 {user.phone}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-semibold tabular-nums">
                  Wallet Balance: ₹{user.walletBalance}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-stone-500 block text-[11px] font-medium">5-Min Free Call</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <Gift className="w-3.5 h-3.5" />
                  {user.freeTrialClaimed ? 'Claimed' : 'Active & Ready'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <span className="text-stone-500 block text-[11px] font-medium">Family Vault</span>
                <span className="text-stone-800 dark:text-stone-200 font-bold block mt-1">
                  Up to 10 Free Charts
                </span>
              </div>
            </div>

            {/* Permanent Janam Kundli Status */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-orange-600" />
                  <span>Permanent Janam Kundli</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {user.kundliSummary ? 'Linked' : 'Not Set'}
                </span>
              </div>

              {user.kundliSummary ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] text-stone-500 block">Ascendant (लग्न)</span>
                    <strong className="text-orange-600 block mt-0.5 truncate">{user.kundliSummary.ascendant}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] text-stone-500 block">Moon Sign (राशि)</span>
                    <strong className="text-stone-800 dark:text-stone-200 block mt-0.5 truncate">{user.kundliSummary.moonSign}</strong>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug">
                  Add your birth date, time and city once to auto-fill every consultation & daily Rashi Fal.
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setOpenAstroProfileModal(true);
                }}
                className="w-full min-h-[42px] py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{user.kundliSummary ? 'View / Edit My Astro Profile' : 'Set Up My Astro Profile'}</span>
              </button>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={logoutUser}
                className="flex-1 min-h-[44px] py-3 px-4 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl transition text-xs cursor-pointer text-center"
              >
                Log Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition text-xs cursor-pointer shadow-md text-center"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: MOBILE NUMBER INPUT */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Enter your mobile number to receive a live 6-digit SMS OTP from <strong>TWRSHI</strong>. New accounts unlock a <strong>5-Minute Free Consultation</strong> and <strong>₹100 Welcome Credit</strong>.
                </p>

                <div className="space-y-1.5">
                  <label htmlFor="rashi-login-phone" className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Indian Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-stone-300 dark:border-stone-700 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 bg-white dark:bg-stone-800 transition">
                    <div className="flex items-center gap-1.5 px-3.5 bg-stone-100 dark:bg-stone-700/50 text-stone-700 dark:text-stone-300 text-xs font-bold border-r border-stone-300 dark:border-stone-700 shrink-0">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="rashi-login-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(sanitizeIndianPhoneInput(e.target.value));
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="9876543210"
                      maxLength={14}
                      className="w-full px-3.5 py-3.5 text-sm font-semibold tracking-wider tabular-nums bg-transparent outline-none text-stone-900 dark:text-white placeholder:text-stone-400"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Real SMS OTP delivered via Reliance Jio DLT / MSG91 · Zero spam calls
                  </p>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !INDIAN_MOBILE_REGEX.test(phoneNumber)}
                  className="w-full min-h-[48px] py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Live SMS OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-stone-600 dark:text-stone-400">
                  <div className="py-2 px-1 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                    <strong className="block text-stone-900 dark:text-stone-100">5 Min Free</strong>
                    <span>First Call</span>
                  </div>
                  <div className="py-2 px-1 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                    <strong className="block text-stone-900 dark:text-stone-100">Per-Sec</strong>
                    <span>Fair Billing</span>
                  </div>
                  <div className="py-2 px-1 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                    <strong className="block text-stone-900 dark:text-stone-100">10 Charts</strong>
                    <span>Free Vault</span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: LIVE 6-DIGIT OTP VERIFICATION */}
            {step === 'otp' && (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 dark:text-stone-400">
                    SMS sent to <strong className="text-stone-900 dark:text-stone-100 font-mono tabular-nums">+91 {phoneNumber}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setErrorMessage('');
                      setSuccessNotice('');
                    }}
                    className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* 6-Digit OTP Input Boxes (supports SMS Autofill & Paste) */}
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      aria-label={`OTP digit ${index + 1}`}
                      className="w-11 sm:w-12 h-13 text-center text-xl font-bold font-mono tabular-nums rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>Sender ID: <strong className="font-mono text-stone-700 dark:text-stone-200">TWRSHI</strong></span>
                  <span className="tabular-nums">
                    {otpExpiryTimer > 0
                      ? `Expires in ${formatExpiry(otpExpiryTimer)}`
                      : 'OTP expired — please resend'}
                  </span>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successNotice && !errorMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successNotice}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="w-full min-h-[48px] py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Live OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>

                {/* Real SMS & Voice Call Retry Controls */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    {resendTimer > 0 ? `Retry available in ${resendTimer}s` : "Didn't receive SMS?"}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleResendOtp('text')}
                      disabled={resendTimer > 0 || isLoading || isResending !== null}
                      className={`font-bold transition cursor-pointer ${
                        resendTimer > 0 || isResending !== null
                          ? 'text-stone-400 cursor-not-allowed'
                          : 'text-orange-600 dark:text-orange-400 hover:underline'
                      }`}
                    >
                      {isResending === 'text' ? 'Sending...' : 'Resend SMS'}
                    </button>
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <button
                      type="button"
                      onClick={() => handleResendOtp('voice')}
                      disabled={resendTimer > 0 || isLoading || isResending !== null}
                      className={`font-bold inline-flex items-center gap-1 transition cursor-pointer ${
                        resendTimer > 0 || isResending !== null
                          ? 'text-stone-400 cursor-not-allowed'
                          : 'text-emerald-700 dark:text-emerald-400 hover:underline'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{isResending === 'voice' ? 'Calling...' : 'OTP via Call'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Footer Assurance */}
      <div className="p-3.5 bg-stone-50 dark:bg-stone-900/70 border-t border-stone-200 dark:border-stone-800 text-center text-[11px] text-stone-500 flex items-center justify-center gap-2 shrink-0">
        <Lock className="w-3.5 h-3.5 text-stone-400" />
        <span>12Rashi Astrology (12rashi Infotech) · TRAI DLT Secured</span>
      </div>
    </div>
  );

  if (isPage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {content}
    </div>
  );
};
