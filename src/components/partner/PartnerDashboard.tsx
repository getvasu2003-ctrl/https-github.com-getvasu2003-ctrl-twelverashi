import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { liveChatSyncService, ChatSessionMeta } from '../../services/liveChatSyncService.ts';
import { ChatMessage } from '../../types/astrology.ts';
import {
  UserCheck,
  Power,
  DollarSign,
  PhoneCall,
  MessageSquare,
  Video,
  Star,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  LogOut,
  Calendar,
  Settings,
  Sparkles,
  Search,
  Eye,
  Play,
  RotateCcw,
  Check,
  Compass,
  ShoppingBag,
  Bell,
  Coffee,
  HelpCircle,
  Radio,
  Wifi,
  Send,
} from 'lucide-react';
import { AstrologerSpecialty, PartnerConsultationRecord } from '../../types/astrology.ts';

export const PartnerDashboard: React.FC = () => {
  const {
    partnerAstrologer,
    partnerAuthUser,
    logoutPartner,
    updatePartnerStatus,
    updatePartnerProfile,
    updatePartnerRates,
    partnerSchedule,
    updatePartnerSchedule,
    partnerEarnings,
    partnerConsultationRecords,
    addConsultationNoteAndRemedy,
    partnerPayoutRecords,
    requestPartnerPayout,
    incomingConsultation,
    acceptIncomingConsultation,
    rejectIncomingConsultation,
    startConsultation,
    userProfile,
    currentKundli,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'availability' | 'earnings' | 'history' | 'interactions' | 'live-chat'
  >('overview');

  // Real-time Multi-User Live Chat Workstation States
  const [liveSessions, setLiveSessions] = useState<ChatSessionMeta[]>([]);
  const [selectedLiveChannel, setSelectedLiveChannel] = useState<string>('');
  const [liveChannelMessages, setLiveChannelMessages] = useState<ChatMessage[]>([]);
  const [astrologerReplyText, setAstrologerReplyText] = useState('');
  const [isSeekerTyping, setIsSeekerTyping] = useState(false);
  const liveChatEndRef = useRef<HTMLDivElement>(null);

  // Profile Form States
  const [name, setName] = useState(partnerAstrologer.name);
  const [title, setTitle] = useState(partnerAstrologer.title);
  const [experienceYears, setExperienceYears] = useState(partnerAstrologer.experienceYears);
  const [education, setEducation] = useState(partnerAstrologer.education);
  const [about, setAbout] = useState(partnerAstrologer.about);
  const [languagesStr, setLanguagesStr] = useState(partnerAstrologer.languages.join(', '));
  const [selectedSpecialties, setSelectedSpecialties] = useState<AstrologerSpecialty[]>(
    partnerAstrologer.specialties
  );
  const [avatarUrl, setAvatarUrl] = useState(partnerAstrologer.avatar);
  const [profileSaved, setProfileSaved] = useState(false);

  // Availability & Rates Form States
  const [chatRate, setChatRate] = useState(partnerAstrologer.chatRate);
  const [callRate, setCallRate] = useState(partnerAstrologer.callRate);
  const [videoRate, setVideoRate] = useState(partnerAstrologer.videoRate);
  const [promoOffer, setPromoOffer] = useState(partnerSchedule.promotionalOfferActive);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Payout Form States
  const [withdrawAmount, setWithdrawAmount] = useState<number>(partnerEarnings.pendingPayout || 5000);
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'NEFT/IMPS'>('UPI');
  const [payoutDestination, setPayoutDestination] = useState('9831039814@upi');

  // Client Interaction states
  const [selectedRecord, setSelectedRecord] = useState<PartnerConsultationRecord>(
    partnerConsultationRecords[0]
  );
  const [caseNote, setCaseNote] = useState(selectedRecord?.notes || '');
  const [prescribedRemedy, setPrescribedRemedy] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showRecordingPlayer, setShowRecordingPlayer] = useState(false);

  const allSpecialties: AstrologerSpecialty[] = [
    'Vedic Astrology',
    'Kundli & Horoscope',
    'Tarot Reading',
    'Numerology',
    'Vastu Shastra',
    'KP Astrology',
    'Palmistry',
    'Prashna Kundli',
    'Nadi Jyotish',
    'Love & Relationship',
    'Career & Wealth',
  ];

  // Poll active chat sessions for the astrologer console
  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await liveChatSyncService.getActiveSessions(partnerAstrologer.id);
      setLiveSessions(sessions);
      if (sessions.length > 0 && !selectedLiveChannel) {
        setSelectedLiveChannel(sessions[0].channelId);
      }
    };

    fetchSessions();
    const timer = setInterval(fetchSessions, 2000);
    return () => clearInterval(timer);
  }, [partnerAstrologer.id, selectedLiveChannel]);

  // Subscribe to selected live channel
  useEffect(() => {
    if (!selectedLiveChannel) return;

    const unsubscribe = liveChatSyncService.subscribe(
      selectedLiveChannel,
      'astrologer',
      (messages, meta) => {
        setLiveChannelMessages(messages);
        setIsSeekerTyping(meta.isTyping && meta.typingSender === 'user');
      }
    );

    return () => unsubscribe();
  }, [selectedLiveChannel]);

  useEffect(() => {
    liveChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveChannelMessages, isSeekerTyping]);

  const handleSendAstrologerReply = async (customText?: string, remedy?: ChatMessage['remedyDetails']) => {
    const textToSend = (customText || astrologerReplyText).trim();
    if (!textToSend && !remedy) return;

    if (!customText) setAstrologerReplyText('');
    liveChatSyncService.setTyping(selectedLiveChannel, 'astrologer', false);

    await liveChatSyncService.sendMessage({
      channelId: selectedLiveChannel,
      sender: 'astrologer',
      senderName: partnerAstrologer.name,
      text: textToSend,
      remedyDetails: remedy,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerProfile({
      name,
      title,
      experienceYears: Number(experienceYears),
      education,
      about,
      avatar: avatarUrl,
      specialties: selectedSpecialties,
      languages: languagesStr.split(',').map((s) => s.trim()),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerRates({
      chatRate: Number(chatRate),
      callRate: Number(callRate),
      videoRate: Number(videoRate),
    });
    updatePartnerSchedule({
      promotionalOfferActive: promoOffer,
    });
    setScheduleSaved(true);
    setTimeout(() => setScheduleSaved(false), 2500);
  };

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestPartnerPayout(withdrawAmount, payoutMethod, payoutDestination);
  };

  const handleSaveCaseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    addConsultationNoteAndRemedy(selectedRecord.id, caseNote, prescribedRemedy);
    setNoteSaved(true);
    setPrescribedRemedy('');
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const toggleSpecialty = (spec: AstrologerSpecialty) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Astrologer Identity & Live Controls */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <img
              src={partnerAstrologer.avatar}
              alt={partnerAstrologer.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stone-950 ${
                partnerAstrologer.status === 'online'
                  ? 'bg-emerald-500'
                  : partnerAstrologer.status === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {partnerAstrologer.name}
              </h1>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Acharya Verified
              </span>
            </div>

            <p className="text-xs text-amber-200/90 mt-0.5 font-medium">
              {partnerAstrologer.title} • {partnerAstrologer.experienceYears} Years Vedic Experience
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-300">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {partnerAstrologer.rating} Rating
              </span>
              <span>•</span>
              <span>{(partnerAstrologer.reviewsCount / 1000).toFixed(1)}k Sessions</span>
              <span>•</span>
              <span className="text-stone-400">ID: {partnerAuthUser?.id || '#12R-ASTRO-01'}</span>
            </div>
          </div>
        </div>

        {/* Live Availability Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Availability Status Bar */}
          <div className="bg-stone-800/90 p-1.5 rounded-2xl border border-stone-700 flex items-center gap-1">
            <button
              onClick={() => updatePartnerStatus('online')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                partnerAstrologer.status === 'online'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Online</span>
            </button>

            <button
              onClick={() => updatePartnerStatus('busy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                partnerAstrologer.status === 'busy'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              In Call
            </button>

            <button
              onClick={() => updatePartnerStatus('offline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                partnerAstrologer.status === 'offline'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Offline
            </button>
          </div>

          <button
            onClick={logoutPartner}
            className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-bold border border-red-500/30 cursor-pointer transition flex items-center gap-1.5"
            title="Log Out of Astrologer Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Incoming Call / Chat Alert Banner (Real-time demo) */}
      {incomingConsultation && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-2xl border-2 border-amber-300 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ⚡ Incoming {incomingConsultation.type.toUpperCase()} Consultation
              </span>
              <h4 className="text-base font-bold mt-0.5">{incomingConsultation.clientName}</h4>
              <p className="text-xs text-amber-200">
                Rate: ₹{incomingConsultation.ratePerMin}/min • Awaiting connection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={acceptIncomingConsultation}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Consultation</span>
            </button>

            <button
              onClick={rejectIncomingConsultation}
              className="py-2.5 px-3 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      )}

      {/* Agora WebRTC Live Calling Engine Status Card */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 p-3.5 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Agora WebRTC Media Gateway</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Ready
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Two-way audio & 1080p video consultation ready. Noise suppression (ANS/AEC) & per-second billing active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              navigator.mediaDevices?.getUserMedia({ audio: true, video: true })
                .then(() => alert('Webcam & Microphone test successful! Hardware is ready for live Agora consultations.'))
                .catch((e) => alert('Microphone/Camera check: ' + e.message));
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 cursor-pointer transition flex items-center gap-1.5"
            title="Check camera and microphone before taking live calls"
          >
            <Video className="w-3.5 h-3.5 text-orange-400" />
            <span>Test Camera & Mic</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Astrologer Console */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-stone-200 dark:border-stone-800">
        {[
          { id: 'overview', label: 'Console Overview', icon: TrendingUp },
          { id: 'live-chat', label: `Live Seeker Chat (${liveSessions.length})`, icon: MessageSquare, badge: liveSessions.length > 0 },
          { id: 'profile', label: 'Personal Profile', icon: UserCheck },
          { id: 'availability', label: 'Availability & Pricing', icon: Clock },
          { id: 'earnings', label: 'Earnings & Payouts', icon: DollarSign },
          { id: 'history', label: 'Consultation History', icon: FileText },
          { id: 'interactions', label: 'Client Prescriptions & Notes', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONSOLE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Financial & Session Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Today's Earnings</span>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                ₹{partnerEarnings.today.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18% higher than average</span>
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Weekly Revenue</span>
              <div className="text-2xl font-black text-orange-600 mt-1">
                ₹{partnerEarnings.week.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                72 Sessions Completed
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Month to Date</span>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                ₹{partnerEarnings.month.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                80% Astrologer Net Share
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 border border-amber-300 dark:border-stone-700 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Available for Withdrawal
              </span>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                ₹{partnerEarnings.pendingPayout.toLocaleString()}
              </div>
              <button
                onClick={() => setActiveTab('earnings')}
                className="mt-2 w-full py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-xs transition"
              >
                Withdraw to Bank / UPI
              </button>
            </div>
          </div>

          {/* Quick Consultation Station */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Live Consultation Queue & Workstation
                  </h3>
                </div>
                <span className="text-xs text-stone-500">
                  Current Status: <strong className="text-emerald-600 uppercase">{partnerAstrologer.status}</strong>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Upcoming Client: Priyadarshini Sengupta
                  </span>
                  <p className="text-stone-500 mt-0.5">
                    Topic: Marriage Compatibility & Kaal Sarp Dosh • Moon Sign: Vrishabha
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startConsultation(partnerAstrologer, 'chat')}
                    className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Launch Chat</span>
                  </button>

                  <button
                    onClick={() => startConsultation(partnerAstrologer, 'audio')}
                    className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Launch Voice</span>
                  </button>
                </div>
              </div>

              {/* Consultation Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Call Pick-up Rate</span>
                  <div className="font-black text-sm text-stone-900 dark:text-stone-100 mt-0.5">99.4%</div>
                </div>
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Avg. Duration</span>
                  <div className="font-black text-sm text-stone-900 dark:text-stone-100 mt-0.5">18.5 mins</div>
                </div>
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Client Satisfaction</span>
                  <div className="font-black text-sm text-amber-500 mt-0.5">4.96 / 5.0</div>
                </div>
              </div>
            </div>

            {/* Quick Rules & DLT Status */}
            <div className="lg:col-span-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Partner Policy & Compliance</span>
              </h4>

              <div className="space-y-2 text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                <p>✓ All consultations are routed through 12Rashi's 256-bit encrypted audio/video nodes.</p>
                <p>✓ 80% net consultation fees are credited instantly upon completion.</p>
                <p>✓ Daily DLT SMS session summaries sent to registered mobile: <strong>9831039814</strong>.</p>
                <p>✓ Maintain dignified Parashari astrological ethics without inducing fear or superstitious panic.</p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block text-[10px]">Headquarters Support:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  Laxman Apt, Pulin Khatick Rd, Kolkata - 700016
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE MANAGEMENT */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Manage Personal Astrologer Profile
              </h3>
              <p className="text-xs text-stone-500">
                Changes made here reflect immediately across the public 12Rashi Astrologer Directory.
              </p>
            </div>

            {profileSaved && (
              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Profile Saved & Live!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Professional Title / Tagline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Years of Astrological Experience
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Sanskrit / Gurukul Education & Degrees
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Avatar Photo URL
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1.5">
                Specialties & Areas of Mastery (Select All That Apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allSpecialties.map((spec) => {
                  const isChecked = selectedSpecialties.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialty(spec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        isChecked
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Consultation Languages (Comma separated)
              </label>
              <input
                type="text"
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                required
                placeholder="Hindi, English, Bengali, Sanskrit"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Detailed Astrological Bio & Lineage (Parampara)
              </label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Profile Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: AVAILABILITY & PRICING */}
      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
              Set Per-Minute Consultation Rates
            </h3>

            <form onSubmit={handleSaveAvailability} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-stone-800/80 border border-orange-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-stone-900 dark:text-stone-100 block">
                      Live Chat Rate (₹ / minute)
                    </label>
                    <span className="text-[10px] text-stone-500">Your 80% Net Share: ₹{(chatRate * 0.8).toFixed(1)}/min</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm text-orange-600">
                    <span>₹</span>
                    <input
                      type="number"
                      value={chatRate}
                      onChange={(e) => setChatRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-orange-200 dark:border-stone-700 pt-3">
                  <div>
                    <label className="font-bold text-stone-900 dark:text-stone-100 block">
                      Audio Voice Call Rate (₹ / minute)
                    </label>
                    <span className="text-[10px] text-stone-500">Your 80% Net Share: ₹{(callRate * 0.8).toFixed(1)}/min</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm text-red-600">
                    <span>₹</span>
                    <input
                      type="number"
                      value={callRate}
                      onChange={(e) => setCallRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-orange-200 dark:border-stone-700 pt-3">
                  <div>
                    <label className="font-bold text-stone-900 dark:text-stone-100 block">
                      HD Video Call Rate (₹ / minute)
                    </label>
                    <span className="text-[10px] text-stone-500">Your 80% Net Share: ₹{(videoRate * 0.8).toFixed(1)}/min</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm text-rose-600">
                    <span>₹</span>
                    <input
                      type="number"
                      value={videoRate}
                      onChange={(e) => setVideoRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Promotional introductory offer */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">
                    Introductory First 5-Mins 20% Discount
                  </span>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    Boosts client order frequency by up to 35%.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={promoOffer}
                  onChange={(e) => setPromoOffer(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{scheduleSaved ? 'Rates & Discounts Saved!' : 'Save Pricing Settings'}</span>
              </button>
            </form>
          </div>

          {/* Weekly Working Hours Schedule */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Weekly Availability Schedule</span>
            </h3>

            <p className="text-stone-500 text-[11px]">
              Set your recurring weekly shifts. The 12Rashi app will automatically notify seekers when your consultation window opens!
            </p>

            <div className="space-y-2">
              {Object.entries(partnerSchedule.workingHours).map(([day, config]) => (
                <div
                  key={day}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 w-24">
                      {day}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <span className="font-mono text-stone-600 dark:text-stone-300 font-medium">
                    {config.from} - {config.to}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Withdrawal Form */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
                Request Payout Transfer
              </h3>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
                <span className="text-xs text-stone-500 uppercase font-semibold">Current Available Balance</span>
                <div className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">
                  ₹{partnerEarnings.pendingPayout.toLocaleString()}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  80% Astrologer Net Share • Zero Commission on Tips
                </span>
              </div>

              <form onSubmit={handleWithdrawRequest} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    max={partnerEarnings.pendingPayout}
                    min={500}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Payout Destination Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('UPI');
                        setPayoutDestination('9831039814@upi');
                      }}
                      className={`py-2 px-3 rounded-xl border font-bold transition cursor-pointer text-center ${
                        payoutMethod === 'UPI'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600'
                      }`}
                    >
                      Instant UPI Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('NEFT/IMPS');
                        setPayoutDestination('HDFC Bank A/C ...9814 (IFSC: HDFC0000124)');
                      }}
                      className={`py-2 px-3 rounded-xl border font-bold transition cursor-pointer text-center ${
                        payoutMethod === 'NEFT/IMPS'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600'
                      }`}
                    >
                      Direct Bank NEFT
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    {payoutMethod === 'UPI' ? 'Registered UPI ID' : 'Bank Account Details'}
                  </label>
                  <input
                    type="text"
                    value={payoutDestination}
                    onChange={(e) => setPayoutDestination(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawAmount <= 0 || partnerEarnings.pendingPayout <= 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs shadow-md cursor-pointer transition disabled:opacity-50"
                >
                  Submit Withdrawal Request
                </button>
              </form>
            </div>

            {/* Payout History Ledger */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
                Settled Payouts & UTR Receipts
              </h3>

              <div className="space-y-3">
                {partnerPayoutRecords.map((po) => (
                  <div
                    key={po.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {po.id} • {po.requestedDate}
                      </span>
                      <span className="font-black text-emerald-600 text-sm">
                        ₹{po.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>Destination: <strong>{po.destinationAccount}</strong></span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {po.status}
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700">
                      Banking UTR: {po.utrNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONSULTATION HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Complete Consultation Ledger & Client Reviews
            </h3>
            <span className="text-xs text-stone-500">
              Showing {partnerConsultationRecords.length} recent sessions
            </span>
          </div>

          <div className="space-y-3">
            {partnerConsultationRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {record.clientName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold uppercase">
                      {record.type} ({record.durationMinutes} mins)
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {record.clientCity} • {record.clientRashi}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-400 text-[11px]">{record.date}</span>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 text-sm">
                        +₹{record.netEarned}
                      </span>
                      <span className="text-[10px] text-stone-400 block">(Gross: ₹{record.grossAmount})</span>
                    </div>
                  </div>
                </div>

                {/* Review Quote */}
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{record.rating}.0 Client Rating</span>
                  </div>
                  <p className="italic">"{record.reviewText}"</p>
                </div>

                {/* Case Note & Action to View Interaction */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-stone-500 truncate max-w-lg">
                    <strong>Astrologer Note:</strong> {record.notes}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setCaseNote(record.notes);
                      setActiveTab('interactions');
                    }}
                    className="text-xs text-orange-600 hover:underline font-bold cursor-pointer shrink-0"
                  >
                    Open Case File →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CLIENT INTERACTIONS & PRESCRIPTIONS */}
      {activeTab === 'interactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Client Selector List */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 pb-2 border-b border-stone-100 dark:border-stone-800">
              Active Client Case Files
            </h4>

            <div className="space-y-2">
              {partnerConsultationRecords.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => {
                    setSelectedRecord(rec);
                    setCaseNote(rec.notes);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer ${
                    selectedRecord?.id === rec.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {rec.clientName}
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">{rec.type}</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    {rec.clientRashi} • {rec.clientCity}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Client Case Workstation */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5 text-xs">
            {selectedRecord && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      Case File: {selectedRecord.clientName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Consultation #{selectedRecord.id} • {selectedRecord.date}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-xs">
                    Client Rashi: {selectedRecord.clientRashi}
                  </span>
                </div>

                {/* Confidential Astrologer Notes */}
                <form onSubmit={handleSaveCaseNote} className="space-y-4">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Confidential Astrological Case Assessment & Transit Notes
                    </label>
                    <textarea
                      rows={3}
                      value={caseNote}
                      onChange={(e) => setCaseNote(e.target.value)}
                      placeholder="Write your personal astrological findings, Dasha notes, and house placements..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden leading-relaxed"
                    />
                  </div>

                  {/* Digital Jyotish Prescription Issuer */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block text-xs">
                      Prescribe AstroStore Remedy to Client
                    </span>

                    <div className="flex gap-2">
                      <select
                        value={prescribedRemedy}
                        onChange={(e) => setPrescribedRemedy(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                      >
                        <option value="">-- Choose Recommended Gemstone / Remedy --</option>
                        <option value="Natural Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti">
                          Natural Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti
                        </option>
                        <option value="Certified Zambian Emerald (Panna) 4.50 Ratti">
                          Certified Zambian Emerald (Panna) 4.50 Ratti
                        </option>
                        <option value="Original 5 Mukhi Nepali Rudraksha Mala (108+1 Beads)">
                          Original 5 Mukhi Nepali Rudraksha Mala (108+1 Beads)
                        </option>
                        <option value="Rare 7 Mukhi Nepali Mahalakshmi Rudraksha Bead">
                          Rare 7 Mukhi Nepali Mahalakshmi Rudraksha Bead
                        </option>
                        <option value="24K Gold-Plated Meru Prustha Shree Yantra">
                          24K Gold-Plated Meru Prustha Shree Yantra
                        </option>
                        <option value="Navgraha Shanti Complete Vedic Pooja Kit">
                          Navgraha Shanti Complete Vedic Pooja Kit
                        </option>
                      </select>
                    </div>

                    {/* Active Prescribed Remedies List */}
                    {selectedRecord.prescribedRemedies.length > 0 && (
                      <div className="pt-2 border-t border-amber-500/20">
                        <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">
                          Previously Prescribed for this Client:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedRecord.prescribedRemedies.map((rem, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-medium"
                            >
                              💎 {rem}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{noteSaved ? 'Case Note & Prescription Stored!' : 'Save Client Interaction Record'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB: REAL-TIME SEEKER LIVE CHAT WORKSTATION */}
      {activeTab === 'live-chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Seeker Sessions Queue */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Live Seeker Channels ({liveSessions.length})
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Real-Time
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {liveSessions.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3 text-stone-400">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Awaiting Incoming Seeker Chats
                  </p>
                  <p className="text-[11px] text-stone-400">
                    When a seeker clicks "Chat" on your profile, their encrypted consultation room instantly appears here.
                  </p>
                  <button
                    onClick={() => {
                      startConsultation(partnerAstrologer, 'chat');
                    }}
                    className="mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-xs hover:from-orange-600 hover:to-amber-600 cursor-pointer transition"
                  >
                    Open Seeker Chat Modal Test
                  </button>
                </div>
              ) : (
                liveSessions.map((sess) => {
                  const isSelected = selectedLiveChannel === sess.channelId;
                  return (
                    <button
                      key={sess.channelId}
                      onClick={() => setSelectedLiveChannel(sess.channelId)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                            {sess.clientName}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {sess.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-1 italic">
                        "{sess.lastMessage}"
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200/50 dark:border-stone-800 text-[10px]">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          Rashi: {sess.clientRashi}
                        </span>
                        <span className="text-stone-400 font-mono">
                          {sess.messageCount} msg{sess.messageCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Real-Time Astrologer Consultation Workstation */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col h-[650px] overflow-hidden">
            {selectedLiveChannel ? (
              <>
                {/* Channel Header */}
                <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/30">
                      {liveSessions.find((s) => s.channelId === selectedLiveChannel)?.clientName.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">
                          {liveSessions.find((s) => s.channelId === selectedLiveChannel)?.clientName || 'Live Seeker'}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Seeker Connected Live
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Rashi: {liveSessions.find((s) => s.channelId === selectedLiveChannel)?.clientRashi || 'Vedic Seeker'} • Rate: ₹{partnerAstrologer.chatRate}/min
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400 bg-stone-800 px-2 py-1 rounded-lg">
                    {selectedLiveChannel}
                  </span>
                </div>

                {/* Live Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 dark:bg-stone-950/50">
                  {liveChannelMessages.map((m) => {
                    const isAstro = m.sender === 'astrologer';
                    const isSys = m.sender === 'system';

                    if (isSys) {
                      return (
                        <div key={m.id} className="text-center my-2">
                          <span className="inline-block text-[10px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-300/40">
                            {m.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAstro ? 'items-end' : 'items-start'} max-w-[85%] ${isAstro ? 'ml-auto' : 'mr-auto'}`}
                      >
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-0.5">
                          <span className="font-semibold text-stone-600 dark:text-stone-300">
                            {isAstro ? `You (${partnerAstrologer.name})` : m.senderName}
                          </span>
                          <span>• {m.timestamp}</span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isAstro
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                              : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.text}</p>

                          {m.isRemedy && m.remedyDetails && (
                            <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200">
                              <span className="font-bold text-[10px] uppercase block tracking-wider text-amber-700 dark:text-amber-400">
                                📜 Prescribed Astro Remedy
                              </span>
                              <p className="text-xs font-bold mt-0.5">{m.remedyDetails.title}</p>
                              {m.remedyDetails.mantra && (
                                <p className="text-[11px] font-mono text-orange-600 dark:text-orange-400 mt-0.5">
                                  {m.remedyDetails.mantra}
                                </p>
                              )}
                              {m.remedyDetails.suggestedGemstone && (
                                <p className="text-[11px] mt-0.5">
                                  Gemstone: <strong>{m.remedyDetails.suggestedGemstone}</strong>
                                </p>
                              )}
                              {m.remedyDetails.productName && (
                                <p className="text-[11px] mt-0.5">
                                  Item: <strong>{m.remedyDetails.productName}</strong>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isSeekerTyping && (
                    <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-200 dark:border-stone-700 w-36">
                      <span className="text-[10px] text-stone-400 font-bold">Seeker typing</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce delay-200" />
                    </div>
                  )}

                  <div ref={liveChatEndRef} />
                </div>

                {/* Instant Jyotish Prescription Quick-Action Bar */}
                <div className="p-2.5 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
                    ⚡ Instant Remedies:
                  </span>

                  <button
                    onClick={() =>
                      handleSendAstrologerReply(
                        'Based on your birth chart analysis, reciting the Shukra Beej Mantra every Friday and offering white sweets or green grass to a cow will balance your relationships.',
                        {
                          title: 'Prescribed Shukra Beej Mantra & Gau Seva',
                          mantra: 'ॐ शुं शुक्राय नमः (Om Shum Shukraya Namaha)',
                          actionType: 'spiritual_sadhana',
                        }
                      )
                    }
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-orange-500 font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <span>Prescribe Shukra Mantra & Gau Seva</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSendAstrologerReply(
                        'Jupiter is transiting favorably. To strengthen financial stability and career growth, recite the Brihaspati Beej Mantra 108 times and observe Thursday fasting.',
                        {
                          title: 'Prescribed Brihaspati Mantra & Thursday Vrat',
                          mantra: 'ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namaha)',
                          actionType: 'spiritual_sadhana',
                        }
                      )
                    }
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-orange-500 font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Prescribe Guru Mantra & Fasting</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSendAstrologerReply(
                        'Your 10th house indicates karmic clearing. Offer water to Lord Surya at sunrise and maintain daily meditation.',
                        undefined
                      )
                    }
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-orange-500 font-medium cursor-pointer transition"
                  >
                    <span>Surya Arghya Upaya</span>
                  </button>
                </div>

                {/* Astrologer Reply Input Bar */}
                <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={astrologerReplyText}
                    onChange={(e) => {
                      setAstrologerReplyText(e.target.value);
                      liveChatSyncService.setTyping(selectedLiveChannel, 'astrologer', true);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAstrologerReply()}
                    placeholder="Type your astrological consultation reply to the seeker..."
                    className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs px-4 py-2.5 rounded-xl outline-hidden focus:ring-2 focus:ring-orange-500"
                  />

                  <button
                    onClick={() => handleSendAstrologerReply()}
                    disabled={!astrologerReplyText.trim()}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs disabled:opacity-50 cursor-pointer transition shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2">
                <MessageSquare className="w-10 h-10 text-stone-300 dark:text-stone-600" />
                <h4 className="font-bold text-stone-600 dark:text-stone-300 text-sm">
                  Select a live consultation channel
                </h4>
                <p className="text-xs max-w-sm">
                  Choose a seeker consultation channel on the left to begin real-time astrological reading and prescribe remedies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
