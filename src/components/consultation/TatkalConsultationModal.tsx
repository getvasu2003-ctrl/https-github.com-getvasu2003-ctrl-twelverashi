import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Zap,
  Clock,
  ShieldCheck,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  User,
  HeartHandshake,
  Share2,
} from 'lucide-react';

export const TatkalConsultationModal: React.FC = () => {
  const {
    openTatkalModal,
    setOpenTatkalModal,
    astrologers,
    walletBalance,
    deductWallet,
    rechargeWallet,
    setOpenPaymentModal,
    addNotification,
    user,
  } = useApp();

  const [urgentTopic, setUrgentTopic] = useState('Career & Interview Dilemma');
  const [seekerName, setSeekerName] = useState(user?.name || 'Vasudev Sharma');
  const [callState, setCallState] = useState<'idle' | 'searching' | 'connected' | 'ended'>('idle');
  const [searchCountdown, setSearchCountdown] = useState<number>(60);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  // Available Tatkal Astrologer
  const assignedAstro = astrologers.find((a) => a.rating >= 4.9) || astrologers[0];
  const tatkalRatePerMin = 49;

  // Reset when opened
  useEffect(() => {
    if (openTatkalModal) {
      setCallState('idle');
      setSearchCountdown(60);
      setCallDuration(0);
      setIsMuted(false);
    }
  }, [openTatkalModal]);

  // Search Countdown Timer
  useEffect(() => {
    let timer: any;
    if (callState === 'searching') {
      timer = setInterval(() => {
        setSearchCountdown((prev) => {
          if (prev <= 55) {
            // Found and connect!
            clearInterval(timer);
            setCallState('connected');
            audioSynthesis.playTempleBell(987, 1.2);
            addNotification('Tatkal Connected!', `Connected live with ${assignedAstro.name}.`, 'astrologer');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState, assignedAstro]);

  // Active Call Duration Timer
  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!openTatkalModal) return null;

  const currentCallCost = Math.ceil((callDuration / 60) * tatkalRatePerMin);

  const handleStartTatkal = () => {
    if (walletBalance < tatkalRatePerMin) {
      setOpenPaymentModal(true);
      return;
    }
    setCallState('searching');
    setSearchCountdown(60);
    audioSynthesis.playTempleBell(659, 1.0);
  };

  const handleEndCall = () => {
    // Deduct billing if over 60s
    if (callDuration > 60) {
      deductWallet(currentCallCost, `Tatkal VIP Consultation with ${assignedAstro.name} (${Math.ceil(callDuration / 60)} min)`);
    } else {
      addNotification('Fair-Billing Protected', 'Call ended under 60 seconds. Full refund applied.', 'discount');
    }
    setCallState('ended');
  };

  const handleClose = () => {
    if (callState === 'connected') {
      handleEndCall();
    }
    setOpenTatkalModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border-2 border-red-500/40 dark:border-stone-700 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20 animate-pulse">
              <Zap className="w-5 h-5 text-amber-200 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base leading-tight">Tatkal VIP Priority Connect</h3>
                <span className="text-[10px] bg-red-800 text-amber-200 px-2 py-0.5 rounded-full font-extrabold uppercase">
                  60s Guarantee
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                Zero Wait Time • Instant 1-on-1 Emergency Astrological Consultation
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content based on callState */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300">
          {callState === 'idle' && (
            <div className="space-y-5">
              {/* Emergency Assurance Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-stone-800 dark:to-stone-800 border border-red-200 dark:border-red-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Instant Astrologer Dispatch</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    ₹{tatkalRatePerMin} / min
                  </span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  Facing an acute crisis? Tatkal bypasses standard waitlists and routes directly to the senior-most verified Acharya on standby. If you are not connected in <strong>under 60 seconds</strong>, you receive an instant full refund + <strong>₹50 compensation credit</strong>.
                </p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Urgent Topic for Consultation
                  </label>
                  <select
                    value={urgentTopic}
                    onChange={(e) => setUrgentTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                  >
                    <option value="Relationship & Sudden Breakup Crisis">Relationship & Sudden Breakup Crisis</option>
                    <option value="Interview or Exam in next 24 Hours">Interview or Job Decision in next 24 Hours</option>
                    <option value="Financial Loss or Business Emergency">Financial Loss or Business Emergency</option>
                    <option value="Medical / Surgery Muhurat Inquiry">Medical / Surgery Muhurat Inquiry</option>
                    <option value="Property Dispute / Sudden Legal Notice">Property Dispute / Sudden Legal Notice</option>
                  </select>
                </div>
              </div>

              {/* Fair-billing guarantee tag */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Fair-Billing Guarantee:</strong> Billed strictly per second. If disconnected or unsatisfied in the first 60 seconds, 100% refund is credited automatically.
                </span>
              </div>

              {/* Launch Button */}
              <button
                onClick={handleStartTatkal}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-xl transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current text-amber-200" />
                <span>Connect Live in &lt; 60 Seconds (₹{tatkalRatePerMin}/min)</span>
              </button>
            </div>
          )}

          {callState === 'searching' && (
            <div className="py-8 text-center space-y-5 animate-fade-in">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  {searchCountdown}s
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Routing Priority Line to Senior Acharya...
                </h3>
                <p className="text-xs text-stone-500">
                  Targeting available Gold-Medalist astrologers on standby for <strong>{urgentTopic}</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 max-w-sm mx-auto">
                Guarantee: If not connected within 60s, you receive an instant full refund + ₹50 credit.
              </div>

              <button
                onClick={() => setCallState('idle')}
                className="text-xs text-stone-500 hover:underline cursor-pointer"
              >
                Cancel Search
              </button>
            </div>
          )}

          {callState === 'connected' && (
            <div className="space-y-6 py-2 animate-fade-in text-center">
              {/* Connected Astrologer Card */}
              <div className="space-y-2">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={assignedAstro.avatar}
                    alt={assignedAstro.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  {assignedAstro.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {assignedAstro.title} • {assignedAstro.experienceYears} yrs experience
                </p>
              </div>

              {/* Call Timer & Accrued Cost Bar */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-around shadow-inner">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Call Duration</span>
                  <strong className="text-xl font-mono text-emerald-400">
                    {String(Math.floor(callDuration / 60)).padStart(2, '0')}:
                    {String(callDuration % 60).padStart(2, '0')}
                  </strong>
                </div>

                <div className="w-px h-8 bg-stone-800" />

                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Accrued Billing</span>
                  <strong className="text-xl font-mono text-amber-400">
                    ₹{callDuration <= 60 ? 0 : currentCallCost}
                  </strong>
                </div>
              </div>

              {/* Audio Waveform Animation */}
              <div className="flex items-center justify-center gap-1.5 h-10 px-6">
                {[30, 60, 90, 45, 80, 55, 95, 70, 40, 85, 60, 75, 90, 45, 65, 85, 40].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-orange-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${idx * 80}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
                    isMuted ? 'bg-red-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition transform hover:scale-105 cursor-pointer shadow-xl"
                  title="End Consultation"
                >
                  <PhoneOff className="w-6 h-6 fill-current" />
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
                    isSpeakerOn ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                  }`}
                  title="Toggle Speaker"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {callState === 'ended' && (
            <div className="py-4 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  Tatkal Consultation Completed
                </h3>
                <p className="text-xs text-stone-500">
                  Thank you for consulting {assignedAstro.name}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Duration:</span>
                  <strong>{Math.floor(callDuration / 60)} min {callDuration % 60} sec</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Billed Amount:</span>
                  <strong className="text-orange-600">₹{callDuration <= 60 ? 0 : currentCallCost}</strong>
                </div>
                <div className="flex justify-between text-xs border-t border-stone-200 dark:border-stone-700 pt-2">
                  <span className="text-stone-500">Protection:</span>
                  <span className="text-emerald-600 font-bold">Fair-Billing Applied</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="py-2.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Done & Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
