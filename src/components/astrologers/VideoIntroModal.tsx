import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Play,
  ShieldCheck,
  Star,
  Award,
  Video,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const VideoIntroModal: React.FC = () => {
  const {
    openVideoIntroModal,
    setOpenVideoIntroModal,
    selectedVideoAstro,
    setSelectedVideoAstro,
    startConsultation,
    setOpenSlotBookingModal,
    setSelectedBookingAstrologer,
  } = useApp();

  if (!openVideoIntroModal || !selectedVideoAstro) return null;

  const a = selectedVideoAstro;

  const handleStart = (type: 'audio' | 'video' | 'chat') => {
    setOpenVideoIntroModal(false);
    startConsultation(a, type);
  };

  const handleBookSlot = () => {
    setOpenVideoIntroModal(false);
    setSelectedBookingAstrologer(a);
    setOpenSlotBookingModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20">
              <Video className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Astrologer Video Intro</h3>
              <p className="text-[11px] text-amber-100">Hear voice, clarity & demeanor before consulting</p>
            </div>
          </div>

          <button
            onClick={() => setOpenVideoIntroModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
          {/* Simulated Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-lg group">
            {a.videoIntroUrl ? (
              <video
                src={a.videoIntroUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4 space-y-2">
                <Play className="w-12 h-12 text-orange-500 mx-auto" />
                <span className="text-white font-bold block">35-Second Acharya Introduction</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Acharya Recording</span>
            </div>
          </div>

          {/* Astrologer Credentials */}
          <div className="flex items-start gap-3 pt-1">
            <img
              src={a.avatar}
              alt={a.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/60 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100 truncate">{a.name}</h4>
                {a.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium truncate">{a.title}</p>
              <div className="flex items-center gap-2 mt-1 text-stone-500 text-[11px]">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{a.rating}</span>
                </span>
                <span>•</span>
                <span>{a.experienceYears} Years Exp</span>
                <span>•</span>
                <span>{a.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Bio statement */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 leading-relaxed text-stone-600 dark:text-stone-300">
            "{a.about}"
          </div>

          {/* Specialities Chips */}
          <div className="flex flex-wrap gap-1.5">
            {a.specialties.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-[11px] font-semibold"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Action Consultation CTAs */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStart('chat')}
                className="py-2 px-2 rounded-xl border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 font-bold text-xs flex flex-col items-center justify-center cursor-pointer transition"
              >
                <MessageSquare className="w-4 h-4 mb-0.5" />
                <span>Chat ₹{a.chatRate}/m</span>
              </button>

              <button
                onClick={() => handleStart('audio')}
                className="py-2 px-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex flex-col items-center justify-center shadow-xs cursor-pointer transition"
              >
                <Phone className="w-4 h-4 mb-0.5" />
                <span>Call ₹{a.callRate}/m</span>
              </button>

              <button
                onClick={() => handleStart('video')}
                className="py-2 px-2 rounded-xl border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 font-bold text-xs flex flex-col items-center justify-center cursor-pointer transition"
              >
                <Video className="w-4 h-4 mb-0.5" />
                <span>Video ₹{a.videoRate}/m</span>
              </button>
            </div>

            <button
              onClick={handleBookSlot}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs cursor-pointer shadow-xs transition hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Schedule Fixed-Price Slot with {a.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
