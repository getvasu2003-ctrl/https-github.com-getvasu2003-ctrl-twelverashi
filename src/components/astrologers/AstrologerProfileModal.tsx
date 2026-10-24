import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Star,
  ShieldCheck,
  Phone,
  MessageSquare,
  Video,
  Play,
  Calendar,
  Award,
  BookOpen,
  Globe2,
  Crown,
  Share2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AstrologerSlotScheduler } from './AstrologerSlotScheduler.tsx';

export const AstrologerProfileModal: React.FC = () => {
  const {
    selectedProfileAstrologer,
    setSelectedProfileAstrologer,
    startConsultation,
    setSelectedVideoAstro,
    setOpenVideoIntroModal,
    addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'schedule'>('overview');

  if (!selectedProfileAstrologer) return null;

  const astro = selectedProfileAstrologer;
  const isOnline = astro.status === 'online';
  const isBusy = astro.status === 'busy';

  const handleShare = () => {
    const url = `${window.location.origin}/?tab=astrologers&astrologer=${astro.id}`;
    navigator.clipboard?.writeText(url);
    addNotification(
      'Profile Link Copied',
      `Shareable profile link for ${astro.name} copied to clipboard.`,
      'astrologer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-orange-300 dark:border-stone-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Ribbon */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20">
              <Award className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  Verified Astrologer Profile
                </h3>
                {astro.isAi ? (
                  <span className="text-[10px] bg-purple-700 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-purple-300/40">
                    <Award className="w-3 h-3 text-amber-300" />
                    24/7 AI EXPERT
                  </span>
                ) : astro.isCelebrity ? (
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 fill-stone-950" />
                    CELEBRITY EXPERT
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    VERIFIED EXPERT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-100 font-mono">
                Canonical ID: 12rashi.com/astrologers/{astro.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
              title="Share profile link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProfileAstrologer(null)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Overview vs Automated Scheduler */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 shrink-0 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-stone-900 shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bio & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs font-bold transition cursor-pointer border-b-2 flex items-center gap-2 relative ${
              activeTab === 'schedule'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-stone-900 shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span>Schedule Consultation</span>
            <span className="text-[9px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-1.5 py-0.2 rounded-full font-black animate-pulse">
              ⚡ Automated Slots
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 dark:text-stone-300">
          {activeTab === 'overview' ? (
            <>
              {/* Main Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-orange-50/50 dark:bg-stone-800/80 border border-orange-200/60 dark:border-stone-700">
                <div className="relative shrink-0">
                  <img
                    src={astro.avatar}
                    alt={astro.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
                  />
                  {/* Play video intro button */}
                  <button
                    onClick={() => {
                      setSelectedVideoAstro(astro);
                      setOpenVideoIntroModal(true);
                    }}
                    className="absolute -top-2 -left-2 p-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg cursor-pointer transition transform hover:scale-110 flex items-center justify-center ring-2 ring-white dark:ring-stone-900"
                    title="Watch verified video intro"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </button>

                  <span
                    className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-xs ${
                      isOnline ? 'bg-emerald-500' : isBusy ? 'bg-amber-500' : 'bg-stone-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{isOnline ? 'Online' : isBusy ? 'Busy' : 'Away'}</span>
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                      {astro.name}
                    </h3>
                    {astro.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Expert
                      </span>
                    )}
                    {astro.experienceYears >= 20 && !astro.isAi && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-500/40">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        Senior Master Jyotish
                      </span>
                    )}
                  </div>

                  <p className="text-orange-600 dark:text-orange-400 font-semibold text-xs">
                    {astro.title}
                  </p>

                  {/* Rating, Experience, Consultations */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-stone-600 dark:text-stone-300 pt-1">
                    <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{astro.rating}</span>
                      <span className="text-stone-400 text-[10px]">({astro.reviewsCount} reviews)</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold">{astro.experienceYears} Years Exp</span>
                    <span>•</span>
                    <span className="font-semibold">{(astro.ordersCount / 1000).toFixed(1)}k+ Sessions</span>
                  </div>
                </div>
              </div>

              {/* Callout Card to Schedule Future Slots */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-orange-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-500 text-white">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                      Book a Dedicated Private Slot with {astro.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    Reserve an upcoming date & exact time slot without waiting in live queue. Includes chart pre-analysis and automated WhatsApp reminder alerts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-1.5 transition transform active:scale-95"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* About / Bio */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-xs">
                  About & Vedic Lineage
                </h4>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-950 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                  {astro.about ||
                    `${astro.name} is a renowned Vedic scholar practicing sacred astrology for over ${astro.experienceYears} years. Trained in traditional Gurukul Parampara, specializing in natal chart evaluation, career predictions, and auspicious gemstone recommendations.`}
                </p>
              </div>

              {/* Specialties & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span>Astrological Specialties</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {astro.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-medium text-[11px] border border-stone-200 dark:border-stone-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    <span>Languages & Education</span>
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Languages Spoken:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {astro.languages.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Vedic Credentials:</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {astro.education || 'Classical Jyotish Canons & Parashari Siddhanta'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescribed Signature Remedies & Suggestions */}
              {astro.remedySpecialties && astro.remedySpecialties.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Signature Remedies & Suggestions ({astro.remedySpecialties.length})</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
                      {astro.categoryBadge || 'Sacred Upayas'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {astro.remedySpecialties.map((rem, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-stone-900 rounded-xl p-3 border border-amber-300/40 dark:border-stone-800 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {rem.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.2 rounded">
                            {rem.category}
                          </span>
                        </div>

                        {rem.mantra && (
                          <p className="text-[11px] font-mono text-orange-700 dark:text-orange-400 bg-amber-50 dark:bg-stone-950 p-1.5 rounded-md border border-amber-200 dark:border-stone-800 break-words">
                            {rem.mantra}
                          </p>
                        )}

                        <div className="text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5 pt-1">
                          {rem.fastingDay && (
                            <p className="flex items-center gap-1">
                              <span className="text-stone-400 font-medium">Auspicious Day:</span>
                              <strong className="text-stone-700 dark:text-stone-300">{rem.fastingDay}</strong>
                            </p>
                          )}
                          {rem.gemstoneAdvice && (
                            <p className="flex items-center gap-1">
                              <span className="text-stone-400 font-medium">Gemstone / Yantra:</span>
                              <span className="text-stone-700 dark:text-stone-300">{rem.gemstoneAdvice}</span>
                            </p>
                          )}
                          {rem.charitySeva && (
                            <p className="flex items-center gap-1">
                              <span className="text-stone-400 font-medium">Karma Daan:</span>
                              <span className="text-stone-700 dark:text-stone-300">{rem.charitySeva}</span>
                            </p>
                          )}
                          {rem.pujaRemedy && (
                            <p className="flex items-center gap-1">
                              <span className="text-stone-400 font-medium">Puja / Ritual:</span>
                              <span className="text-orange-600 dark:text-orange-400 font-semibold">{rem.pujaRemedy}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Fair-Billing Guarantee */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100 uppercase text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Fair-Billing Guarantee™ Consultation Rates</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    PER-SECOND METERED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-sans">Live Chat</span>
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      ₹{astro.chatRate}/m
                    </span>
                    <span className="text-[9px] text-stone-400 block font-sans">₹{(astro.chatRate / 60).toFixed(2)}/s</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-sans">Audio Call</span>
                    <span className="font-bold text-sm text-orange-600 dark:text-orange-400">
                      ₹{astro.callRate}/m
                    </span>
                    <span className="text-[9px] text-stone-400 block font-sans">₹{(astro.callRate / 60).toFixed(2)}/s</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-sans">HD Video</span>
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      ₹{astro.videoRate}/m
                    </span>
                    <span className="text-[9px] text-stone-400 block font-sans">₹{(astro.videoRate / 60).toFixed(2)}/s</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* AUTOMATED SCHEDULER TAB */
            <AstrologerSlotScheduler
              astrologer={astro}
              onSwitchToOverview={() => setActiveTab('overview')}
            />
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {activeTab === 'overview' ? (
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 text-orange-700 dark:text-orange-300 border border-orange-400/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>Schedule Future Slot</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('overview')}
              className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Bio & Credentials</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProfileAstrologer(null);
                startConsultation(astro, 'chat');
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Live Chat (₹{astro.chatRate}/m)</span>
            </button>

            <button
              onClick={() => {
                setSelectedProfileAstrologer(null);
                startConsultation(astro, 'audio');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now (₹{astro.callRate}/m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
