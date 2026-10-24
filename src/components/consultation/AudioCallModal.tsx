import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { agoraService } from '../../services/agoraService.ts';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ShieldCheck,
  Wifi,
  Radio,
} from 'lucide-react';

export const AudioCallModal: React.FC = () => {
  const { activeConsultation, endConsultation, walletBalance, currentKundli } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showKundliDetails, setShowKundliDetails] = useState(false);
  const [isLiveAgora, setIsLiveAgora] = useState(false);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    if (!activeConsultation || activeConsultation.type !== 'audio') return;

    const channel = `channel_voice_${activeConsultation.astrologer.id}`;
    setChannelName(channel);

    let isMounted = true;

    const initAgoraAudio = async () => {
      const res = await agoraService.joinSession(channel, {
        video: false,
        handlers: {
          onRemoteUserJoined: (user) => {
            console.log('Agora Voice: Remote user joined', user.uid);
          },
          onRemoteAudioReady: () => {
            console.log('Agora Voice: Remote audio streaming');
          },
        },
      });

      if (isMounted) {
        setIsLiveAgora(res.isLiveAgora);
      }
    };

    initAgoraAudio();

    return () => {
      isMounted = false;
      agoraService.leaveSession();
    };
  }, [activeConsultation]);

  if (!activeConsultation || activeConsultation.type !== 'audio') return null;

  const { astrologer, elapsedSeconds } = activeConsultation;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = async () => {
    const muted = await agoraService.toggleMute();
    setIsMuted(muted);
  };

  const handleHangup = async () => {
    await agoraService.leaveSession();
    endConsultation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-orange-500/30 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center justify-between min-h-[540px] text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        {/* Subtle Cosmic Background Circles */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status & Rate */}
        <div className="w-full flex items-center justify-between text-xs text-stone-300">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Agora Voice HD</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-stone-800 border border-stone-700 font-mono text-amber-300 font-bold">
            ₹{astrologer.callRate}/min • Bal: ₹{walletBalance}
          </span>
        </div>

        {/* Channel Room indicator */}
        <div className="w-full flex justify-center mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-stone-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Room: {channelName}</span>
          </span>
        </div>

        {/* Center: Astrologer Portrait & Aura Rings */}
        <div className="flex flex-col items-center my-4">
          <div className="relative mb-5">
            {/* Animated pulsating aura rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 animate-ping opacity-25 scale-125" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 animate-pulse opacity-40 scale-110" />

            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-2xl"
            />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1 text-center">
            {astrologer.name}
          </h2>
          <p className="text-xs text-amber-300/90 text-center font-medium">
            {astrologer.title}
          </p>

          {/* Connected Call Timer */}
          <div className="mt-4 font-mono text-2xl font-black text-amber-400 tracking-wider">
            {formatTimer(elapsedSeconds)}
          </div>

          {/* 5-Min Free Trial Badge */}
          {activeConsultation.isFreeTrial && (activeConsultation.freeSecondsRemaining ?? 0) > 0 ? (
            <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>
                FREE TRIAL: {Math.floor((activeConsultation.freeSecondsRemaining || 0) / 60)}m{' '}
                {(activeConsultation.freeSecondsRemaining || 0) % 60}s FREE (₹0)
              </span>
            </div>
          ) : (
            <div className="mt-2 px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-mono">
              Fair-Billing: ₹{astrologer.callRate}/m (₹{(astrologer.callRate / 60).toFixed(2)}/s)
            </div>
          )}

          {/* Telephony PSTN Masking Notice */}
          <div className="mt-2 text-[10px] text-stone-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Caller ID Masked (+91 11-4084XXXX) • Private Bridge</span>
          </div>

          {/* Voice Wave Animation Bars */}
          <div className="flex items-center gap-1.5 mt-3 h-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={`w-1 bg-gradient-to-t from-orange-500 to-amber-300 rounded-full transition-all ${
                  isMuted ? 'h-1 opacity-40' : 'animate-pulse'
                }`}
                style={{
                  height: isMuted ? '4px' : `${20 + (Math.sin(i * 1.5) * 12 + 10)}px`,
                  animationDuration: `${0.6 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Kundli Preview Trigger */}
        <div className="w-full mb-4">
          <button
            onClick={() => setShowKundliDetails((prev) => !prev)}
            className="w-full py-2 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-xs font-semibold text-stone-200 flex items-center justify-between cursor-pointer transition"
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-orange-400" />
              <span>{currentKundli?.name}’s Lagna: {currentKundli?.ascendant}</span>
            </span>
            <span className="text-amber-400 text-[11px] underline">
              {showKundliDetails ? 'Hide Details' : 'View Astrologer Chart'}
            </span>
          </button>

          {showKundliDetails && currentKundli && (
            <div className="mt-2 p-3 bg-stone-950/90 rounded-xl border border-stone-800 text-xs space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span>Moon Sign (Rashi):</span>
                <strong className="text-white">{currentKundli.moonSign}</strong>
              </div>
              <div className="flex justify-between">
                <span>Current Mahadasha:</span>
                <strong className="text-amber-300">{currentKundli.vimshottariDasha.mahadasha}</strong>
              </div>
              <div className="flex justify-between">
                <span>Manglik Dosha:</span>
                <strong className={currentKundli.doshas.manglik.hasDosha ? 'text-red-400' : 'text-emerald-400'}>
                  {currentKundli.doshas.manglik.hasDosha ? 'Active' : 'Clear'}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Call Action Buttons */}
        <div className="flex items-center justify-center gap-6 w-full pt-2">
          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
              isMuted ? 'bg-red-600/30 text-red-400 border border-red-500' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleHangup}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 cursor-pointer ring-4 ring-red-600/30"
            title="Disconnect Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn((prev) => !prev)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
              isSpeakerOn ? 'bg-orange-600/30 text-orange-400 border border-orange-500' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
