import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AsyncQuestion } from '../../types/astrology.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Mic,
  FileText,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  ShieldCheck,
  Send,
  HelpCircle,
  User,
  Flame,
  Award,
  Zap,
} from 'lucide-react';

interface AsyncQuestionHubProps {
  onOpenConsult?: () => void;
}

export const AsyncQuestionHub: React.FC<AsyncQuestionHubProps> = ({ onOpenConsult }) => {
  const {
    asyncQuestions,
    submitAsyncQuestion,
    simulateAcharyaReply,
    walletBalance,
    setOpenPaymentModal,
    familyProfiles,
    activeFamilyProfile,
    astrologers,
    addNotification,
  } = useApp();

  // Filter tabs
  const [activeTab, setActiveTab] = useState<'all' | 'voice' | 'text' | 'pending'>('all');

  // Currently playing audio question id
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);

  // New question form state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>('');
  const [category, setCategory] = useState<'Career' | 'Marriage' | 'Finance' | 'Health' | 'Kundli Dosha' | 'General'>('Career');
  const [responseType, setResponseType] = useState<'voice_note' | 'text'>('voice_note');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeFamilyProfile?.id || familyProfiles[0]?.id || '1');
  const [selectedAstroId, setSelectedAstroId] = useState<string>(astrologers[0]?.id || '1');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active profile
  const currentProfile = familyProfiles.find((p) => p.id === selectedProfileId) || familyProfiles[0];
  const selectedAstrologer = astrologers.find((a) => a.id === selectedAstroId) || astrologers[0];

  // Pricing: Voice note ₹99, Written report ₹149
  const currentPrice = responseType === 'voice_note' ? 99 : 149;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioSynthesis.stopSpeaking();
    };
  }, []);

  // Filtered list
  const filteredQuestions = asyncQuestions.filter((q) => {
    if (activeTab === 'voice') return q.responseType === 'voice_note';
    if (activeTab === 'text') return q.responseType === 'text';
    if (activeTab === 'pending') return q.status === 'PENDING';
    return true;
  });

  // Handle Play/Pause Voice Note
  const handleTogglePlay = (q: AsyncQuestion) => {
    if (!q.answerText) return;

    if (playingId === q.id) {
      audioSynthesis.stopSpeaking();
      setPlayingId(null);
      setPlaybackProgress(0);
    } else {
      audioSynthesis.stopSpeaking();
      setPlayingId(q.id);
      setPlaybackProgress(5);

      audioSynthesis.speakNarration(q.answerText, {
        lang: 'hi-IN',
        rate: playbackSpeed,
        onStart: () => {
          setPlayingId(q.id);
        },
        onEnd: () => {
          setPlayingId(null);
          setPlaybackProgress(100);
        },
      });

      // Simulated playback ticker
      const totalSec = q.audioDurationSecs || 120;
      let curSec = 0;
      const interval = setInterval(() => {
        if (!audioSynthesis.isSpeaking()) {
          clearInterval(interval);
          setPlayingId(null);
          setPlaybackProgress(0);
          return;
        }
        curSec += 1;
        setPlaybackProgress(Math.min(98, Math.round((curSec / totalSec) * 100)));
      }, 1000);
    }
  };

  // Handle New Question Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (walletBalance < currentPrice) {
      setOpenPaymentModal(true);
      return;
    }

    setIsSubmitting(true);
    submitAsyncQuestion({
      question: questionText.trim(),
      category,
      profileName: `${currentProfile.name} (${currentProfile.relation})`,
      birthDetails: `${currentProfile.dob}, ${currentProfile.tob}, ${currentProfile.pob} | ${currentProfile.rashi}`,
      price: currentPrice,
      responseType,
      assignedAstrologer: selectedAstrologer.name,
      astrologerTitle: selectedAstrologer.title,
      astrologerAvatar: selectedAstrologer.avatar,
    });

    setIsSubmitting(false);
    setShowSubmitModal(false);
    setQuestionText('');
  };

  // WhatsApp Share Answer
  const handleShareAnswer = (q: AsyncQuestion) => {
    const text =
      `🪔 *12Rashi Astrologer Consultation Reply* 🪔\n` +
      `Seeker: *${q.profileName}*\n` +
      `Assigned Acharya: *${q.assignedAstrologer}*\n` +
      `Question: "${q.question}"\n\n` +
      `*Astrological Guidance:*\n${q.answerText || 'Analysis under preparation'}\n\n` +
      (q.prescribedRemedy ? `*Prescribed Remedy:* ${q.prescribedRemedy}\n` : '') +
      (q.remedyMantra ? `*Mantra:* ${q.remedyMantra}\n` : '') +
      `\nVerified on 12Rashi: https://12rashi.com`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold border border-amber-300/30">
            <Mic className="w-3.5 h-3.5" />
            <span>Asynchronous Voice Notes & Written Jyotish Guidance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            Ask an Astrologer (पूछिए ज्योतिषी से)
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            No scheduling or live calls required. Submit your specific query along with your birth chart. Verified Vedic Acharyas record an authentic <strong>2-minute personalized voice note</strong> or a structured written prediction with scriptural remedies within 24 hours.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="py-3 px-6 rounded-2xl bg-white text-orange-950 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-amber-100 transition transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-orange-600" />
              <span>Ask a Question (From ₹99)</span>
            </button>

            {onOpenConsult && (
              <button
                onClick={onOpenConsult}
                className="py-3 px-5 rounded-2xl bg-black/25 hover:bg-black/35 text-white font-bold text-xs sm:text-sm border border-white/20 transition cursor-pointer flex items-center gap-2"
              >
                <span>Prefer Live 1-on-1 Call?</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-amber-200/90 ml-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Confidential • Verified Astrologers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Guarantee Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">₹99 Only</div>
            <div className="text-[11px] text-stone-500">2-Min Voice Note</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">₹149 Only</div>
            <div className="text-[11px] text-stone-500">Written Dossier</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">&lt; 24 Hours</div>
            <div className="text-[11px] text-stone-500">Guaranteed Response</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">Classical</div>
            <div className="text-[11px] text-stone-500">Vedic Scriptural Parihara</div>
          </div>
        </div>
      </div>

      {/* Tabs Filter & Action */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800">
          {[
            { id: 'all', label: `All Queries (${asyncQuestions.length})` },
            { id: 'voice', label: `Audio Notes (${asyncQuestions.filter((q) => q.responseType === 'voice_note').length})` },
            { id: 'text', label: `Written (${asyncQuestions.filter((q) => q.responseType === 'text').length})` },
            { id: 'pending', label: `In Progress (${asyncQuestions.filter((q) => q.status === 'PENDING').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>New Question</span>
        </button>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 mx-auto flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No Questions Found in This Category
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Ask any specific question about your Career, Kundli Milan, Marriage, or Finance for as low as ₹99.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="py-2.5 px-6 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-orange-600"
            >
              Ask Acharya Now
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isPlaying = playingId === q.id;
            const isAnswered = q.status === 'ANSWERED';
            const isTranscriptOpen = expandedTranscriptId === q.id;

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isPlaying
                    ? 'border-orange-500 ring-2 ring-orange-400/30'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Header Bar */}
                <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300">
                      {q.category}
                    </span>

                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{q.submittedAt}</span>
                    </span>

                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Seeker: <strong className="text-stone-700 dark:text-stone-300">{q.profileName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAnswered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Answered by {q.assignedAstrologer}</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Acharya Reviewing (Within 24h)</span>
                        </span>

                        {/* Test simulate instant answer */}
                        <button
                          onClick={() => simulateAcharyaReply(q.id)}
                          className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold cursor-pointer transition shadow-xs"
                          title="Simulate instant astrologer voice note reply for live demonstration"
                        >
                          <Zap className="w-3 h-3 inline mr-1" />
                          Simulate Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seeker Question Text */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide block">
                      Seeker Query:
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      "{q.question}"
                    </h3>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      Birth Coordinates: {q.birthDetails}
                    </div>
                  </div>

                  {/* ANSWER SECTION */}
                  {isAnswered && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-4">
                      {/* Astrologer Card & Voice Note Waveform Player */}
                      {q.responseType === 'voice_note' ? (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 dark:from-stone-800/80 dark:via-stone-800 dark:to-stone-800/80 border border-orange-200 dark:border-stone-700 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              {q.astrologerAvatar ? (
                                <img
                                  src={q.astrologerAvatar}
                                  alt={q.assignedAstrologer}
                                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-400 shadow-sm"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                  {q.assignedAstrologer[0]}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                                  {q.assignedAstrologer}
                                </h4>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                  {q.astrologerTitle || 'Verified Vedic Astrologer'} • Official Audio Recording
                                </p>
                              </div>
                            </div>

                            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-stone-900 px-2.5 py-1 rounded-full border border-orange-200 dark:border-stone-700">
                              Duration: {Math.floor((q.audioDurationSecs || 120) / 60)}:
                              {String((q.audioDurationSecs || 120) % 60).padStart(2, '0')} min
                            </span>
                          </div>

                          {/* Audio Waveform Player Control Bar */}
                          <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-orange-200/80 dark:border-stone-700/80 flex items-center gap-3">
                            {/* Play/Pause Button */}
                            <button
                              onClick={() => handleTogglePlay(q)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:scale-105 cursor-pointer shrink-0 ${
                                isPlaying
                                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>

                            {/* Waveform Visualization Bars */}
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                                <span>{isPlaying ? 'Playing Pandit Voice Note...' : 'Tap Play to Listen'}</span>
                                <span>{isPlaying ? `${playbackProgress}%` : `${Math.floor((q.audioDurationSecs || 120) / 60)}:${String((q.audioDurationSecs || 120) % 60).padStart(2, '0')}`}</span>
                              </div>

                              {/* Frequency Bars Animation */}
                              <div className="flex items-center gap-1 h-6">
                                {[18, 35, 60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75, 95, 60, 45, 70, 80, 55, 30].map(
                                  (height, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex-1 rounded-full transition-all duration-200 ${
                                        isPlaying
                                          ? 'bg-orange-500 animate-pulse'
                                          : 'bg-stone-200 dark:bg-stone-700'
                                      }`}
                                      style={{
                                        height: isPlaying ? `${Math.max(20, (height * playbackProgress) / 100)}%` : `${height * 0.4}%`,
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Speed Control */}
                            <button
                              onClick={() => {
                                const nextSpeed = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1.0;
                                setPlaybackSpeed(nextSpeed);
                              }}
                              className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200 cursor-pointer"
                              title="Toggle Playback Speed"
                            >
                              {playbackSpeed}x
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={() => handleShareAnswer(q)}
                              className="p-2 rounded-xl text-stone-400 hover:text-emerald-600 transition cursor-pointer"
                              title="Share Answer on WhatsApp"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Written Report Card */
                        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Official Written Jyotish Guidance by {q.assignedAstrologer}</span>
                            </span>
                            <button
                              onClick={() => handleShareAnswer(q)}
                              className="text-xs text-stone-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                            {q.answerText}
                          </p>
                        </div>
                      )}

                      {/* Devanagari Transcript Toggle */}
                      {q.responseType === 'voice_note' && (
                        <div>
                          <button
                            onClick={() =>
                              setExpandedTranscriptId(isTranscriptOpen ? null : q.id)
                            }
                            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>{isTranscriptOpen ? 'Hide Full Transcript (लिखित प्रतिलिपि छिपाएं)' : 'Read Transcript (लिखित प्रतिलिपि पढ़ें)'}</span>
                          </button>

                          {isTranscriptOpen && (
                            <div className="mt-2 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-xs font-serif leading-relaxed text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                              {q.answerText}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prescribed Scriptural Remedy Card */}
                      {q.prescribedRemedy && (
                        <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            ॐ
                          </div>
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-orange-900 dark:text-orange-200 uppercase tracking-wide text-[10px] block">
                              Prescribed Scriptural Remedy (वैदिक परिहार):
                            </span>
                            <p className="text-stone-800 dark:text-stone-200 font-medium">
                              {q.prescribedRemedy}
                            </p>
                            {q.remedyMantra && (
                              <div className="text-orange-700 dark:text-orange-300 font-serif font-bold text-xs pt-1">
                                जप मन्त्र: {q.remedyMantra}
                              </div>
                            )}
                            {q.remedyMuhurat && (
                              <div className="text-[10px] text-stone-500 font-mono">
                                Auspicious Muhurat: {q.remedyMuhurat}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Question Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-white/20">
                  <HelpCircle className="w-5 h-5 text-amber-200" />
                </span>
                <div>
                  <h3 className="font-bold text-base leading-tight">Ask an Astrologer</h3>
                  <p className="text-[11px] text-amber-100">
                    24-Hour Guaranteed Personal Voice Note or Detailed Report
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
              {/* Category Pills */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Topic of Consultation
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Career', 'Marriage', 'Finance', 'Health', 'Kundli Dosha', 'General'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                        category === cat
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family Profile Switcher */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Seeker Birth Chart Profile
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {familyProfiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        selectedProfileId === p.id
                          ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {p.name} ({p.relation})
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-stone-400 mt-1 font-mono">
                  Coordinates: {currentProfile.dob} • {currentProfile.tob} • {currentProfile.pob} ({currentProfile.rashi})
                </div>
              </div>

              {/* Response Format Selection */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Format of Delivery
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResponseType('voice_note')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                      responseType === 'voice_note'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <Mic className="w-5 h-5 text-orange-600" />
                    <span>2-Min Voice Note</span>
                    <span className="text-[10px] font-mono font-bold text-orange-600">₹99</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResponseType('text')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                      responseType === 'text'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span>Written Dossier</span>
                    <span className="text-[10px] font-mono font-bold text-orange-600">₹149</span>
                  </button>
                </div>
              </div>

              {/* Astrologer Picker */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Assign To Vedic Acharya
                </label>
                <select
                  value={selectedAstroId}
                  onChange={(e) => setSelectedAstroId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs border border-stone-200 dark:border-stone-700 outline-hidden"
                >
                  {astrologers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.title} ({a.experienceYears} yrs exp • {a.languages.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Your Question (Specific details get the best astrological clarity)
                </label>
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. When will I receive a favorable promotion? Is this year auspicious for property purchase? Are there remedies for my current Shani Sade Sati?"
                  required
                  className="w-full p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500 border border-stone-200 dark:border-stone-700 resize-none"
                />
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Wallet Balance: ₹{walletBalance}</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Total: <strong className="text-orange-600 text-sm">₹{currentPrice}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !questionText.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Question for ₹{currentPrice} (24h Delivery)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
