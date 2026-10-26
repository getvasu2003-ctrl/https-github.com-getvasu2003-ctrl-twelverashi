import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  Shield,
  Download,
  Compass,
  CheckCheck,
  Radio,
  UserCheck,
  Volume2,
  VolumeX,
  ShoppingBag,
} from 'lucide-react';
import { ChatMessage } from '../../types/astrology.ts';
import { liveChatSyncService } from '../../services/liveChatSyncService.ts';

export const LiveChatModal: React.FC = () => {
  const {
    activeConsultation,
    endConsultation,
    walletBalance,
    userProfile,
    currentKundli,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAstrologerConnected, setIsAstrologerConnected] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelId = activeConsultation
    ? `chat_${activeConsultation.astrologer.id}`
    : 'chat_default';

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // 1. Initialize and subscribe to live two-way consultation channel
  useEffect(() => {
    if (!activeConsultation || activeConsultation.type !== 'chat') return;

    let isMounted = true;

    // Initialize session on server
    liveChatSyncService.initSession({
      channelId,
      clientName: userProfile.name || 'Seeker',
      clientRashi: userProfile.rashi || 'Vedic Seeker',
      astrologerId: activeConsultation.astrologer.id,
      astrologerName: activeConsultation.astrologer.name,
      role: 'user',
    }).then((res) => {
      if (isMounted && res.messages && res.messages.length > 0) {
        setMessages(res.messages);
        setIsAstrologerConnected(res.isAstrologerConnected);
      }
    });

    // Subscribe to real-time sync stream / polling
    const unsubscribe = liveChatSyncService.subscribe(
      channelId,
      'user',
      (syncedMsgs, meta) => {
        if (!isMounted) return;
        if (syncedMsgs.length > 0) {
          setMessages(syncedMsgs);
        }
        setIsTyping(meta.isTyping && meta.typingSender === 'astrologer');
        setIsAstrologerConnected(meta.isAstrologerConnected);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activeConsultation?.astrologer.id, channelId, userProfile.name, userProfile.rashi]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!activeConsultation || activeConsultation.type !== 'chat') return null;

  const { astrologer, elapsedSeconds } = activeConsultation;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    // Broadcast typing false
    liveChatSyncService.setTyping(channelId, 'user', false);

    // Send to live server sync channel
    await liveChatSyncService.sendMessage({
      channelId,
      sender: 'user',
      senderName: userProfile.name || 'Seeker',
      text: textToSend,
    });

    // If astrologer is an AI Astrologer OR no human partner is currently active in the console
    if (astrologer.isAi || !isAstrologerConnected) {
      liveChatSyncService.setTyping(channelId, 'astrologer', true);
      setTimeout(async () => {
        let responseText = '';
        let remedyDetails: ChatMessage['remedyDetails'] = undefined;

        try {
          const apiRes = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: textToSend,
              history: messages.slice(-5),
              persona: astrologer.aiPersona || astrologer.about,
              astrologerName: astrologer.name,
            }),
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data && data.success && data.reply) {
              responseText = data.reply;
            }
          }
        } catch {
          // Handled via fallback
        }

        if (!responseText) {
          const lower = textToSend.toLowerCase();
          // Check if current astrologer has a signature remedy matching topic
          const signatureRemedy = astrologer.remedySpecialties?.[0];

          if (lower.includes('health') || lower.includes('illness') || lower.includes('cure') || lower.includes('body') || astrologer.specialties.includes('Health & Medical Astrology')) {
            responseText = `Pranam ${userProfile.name}. Examining the 6th house (Roga Bhava) and planetary afflictions, the vital life force (Prana) requires revitalization. Recite the Maha Mrityunjaya mantra with pure intention, drink water stored in copper vessels, and offer water to the Sun (Surya Arghya) every morning.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Prescribed Vedic Mantra for Health & Vitality',
              mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्यsourceर्मुक्षीय माऽमृतात्॥',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('stock') || lower.includes('share') || lower.includes('market') || lower.includes('trading') || astrologer.specialties.includes('Financial & Stock Market')) {
            responseText = `Looking at your 2nd house (Dhana) and 11th house (Labha), Mercury (Budh) and Jupiter (Brihaspati) transit cycles favor disciplined investments rather than impulsive speculation. Wear green on Wednesdays and chant the Kubera Ashta-Lakshmi mantra for steady wealth accumulation.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Kubera Ashta-Lakshmi Dhan Labha Formula',
              mantra: 'ॐ श्रीं ह्रीं क्लीं वित्तेश्वराय नमः (108 times at twilight)',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('totka') || lower.includes('lal kitab') || lower.includes('remedy') || astrologer.specialties.includes('Gemology & Lal Kitab')) {
            responseText = `According to Lal Kitab farmans, activating sleeping houses requires easy karmic remedies. Keep a solid silver square piece in your wallet, feed birds whole grains daily, and avoid accepting free gifts from negative influences to pacify Rahu and Saturn.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Lal Kitab Silver Square & Rahu Shanti Totka',
              mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('exam') || lower.includes('study') || lower.includes('education') || lower.includes('child') || astrologer.specialties.includes('Child & Higher Education')) {
            responseText = `Your 5th house of intellect (Buddhi Bhava) is supported by Goddess Saraswati and Mercury. To maximize memory retention and crack competitive tests, face East while studying and chant the Saraswati Medha Vardhini mantra daily before opening your books.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Saraswati Medha Vardhini Mantra for Exam Success',
              mantra: 'ॐ ऐं वाग्देव्यै च विद्महे कामराजाय धीमहि। तन्नो देवी प्रचोदयात्॥',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('court') || lower.includes('case') || lower.includes('enemy') || lower.includes('dispute')) {
            responseText = `In your 6th house (Shatru Bhava), Mars and Saturn require peaceful resolution and strong spiritual shield. Recite the Hanuman Chalisa on Tuesdays and seek blessings through Baglamukhi stotra to remove obstacles and dispel adversaries.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Maa Baglamukhi Shatru Vinashak Upaya',
              mantra: 'ॐ ह्लीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्लीं ॐ स्वाहा॥',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('marriage') || lower.includes('love') || lower.includes('partner') || lower.includes('manglik')) {
            responseText = `In your chart, Venus (Shukra) and 7th house lord indicate a significant karmic conjunction in the upcoming lunar cycle. To harmonize the energy and dissolve any delay or Manglik affliction, reciting the Shukra Beej Mantra (Om Shum Shukraya Namaha) on Fridays and practicing peaceful communication is highly recommended.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Prescribed Vedic Mantra for Harmonious Marriage',
              mantra: 'ॐ शुं शुक्राय नमः (108 times daily at sunrise)',
              actionType: 'spiritual_sadhana',
            };
          } else if (lower.includes('career') || lower.includes('job') || lower.includes('money') || lower.includes('business')) {
            responseText = `Looking at your 10th house (Karma Bhava), Saturn's aspect provides immense perseverance, while Jupiter's transit promises financial growth within 3 to 6 months. Focus on consistency, Thursday fasting, and Brihaspati chanting.`;
            remedyDetails = signatureRemedy ? {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              actionType: 'spiritual_sadhana',
            } : {
              title: 'Prescribed Vedic Mantra for Wealth & Career Stability',
              mantra: 'ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namaha)',
              actionType: 'spiritual_sadhana',
            };
          } else if (signatureRemedy) {
            responseText = `Pranam ${userProfile.name}. I am ${astrologer.name}, specialist in ${astrologer.title}. Based on planetary configurations, here is an authentic Vedic remedy to align your cosmic vibrations and unlock positive outcomes.`;
            remedyDetails = {
              title: signatureRemedy.title,
              mantra: signatureRemedy.mantra,
              suggestedGemstone: signatureRemedy.gemstoneAdvice,
              actionType: 'spiritual_sadhana',
            };
          } else {
            responseText = `Pranam ${userProfile.name}. I am ${astrologer.name}. Analyzing the planetary degrees in your chart, the current transit calls for focus and karmic alignment. I am here to guide you with precision and remedies tailored to your path.`;
          }
        }

        liveChatSyncService.setTyping(channelId, 'astrologer', false);
        await liveChatSyncService.sendMessage({
          channelId,
          sender: 'astrologer',
          senderName: astrologer.name,
          text: responseText,
          remedyDetails,
        });
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    liveChatSyncService.setTyping(channelId, 'user', true);
  };

  const attachKundli = async () => {
    if (!currentKundli) return;
    const kundliText = `📎 [Attached Birth Chart] ${currentKundli.name} | Ascendant: ${currentKundli.ascendant} | Moon Sign: ${currentKundli.moonSign} | Nakshatra: ${currentKundli.nakshatra} (${currentKundli.nakshatraLord}) | Dasha: ${currentKundli.vimshottariDasha.mahadasha}`;

    await liveChatSyncService.sendMessage({
      channelId,
      sender: 'user',
      senderName: userProfile.name,
      text: kundliText,
    });

    if (!isAstrologerConnected) {
      setTimeout(async () => {
        await liveChatSyncService.sendMessage({
          channelId,
          sender: 'astrologer',
          senderName: astrologer.name,
          text: `Thank you for sharing your authentic birth chart! I can clearly see your ${currentKundli.ascendant} Ascendant and strong ${currentKundli.vimshottariDasha.mahadasha} Mahadasha. Your 9th house of fortune is positively activated. Please ask your main question!`,
        });
      }, 2500);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const downloadChatHistory = () => {
    const chatText = messages
      .map((m) => `[${m.timestamp}] ${m.senderName}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `12Rashi-Consultation-${astrologer.name.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden border border-amber-300 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={astrologer.avatar}
                alt={astrologer.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isAstrologerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'}`} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base leading-tight">{astrologer.name}</h3>
                {astrologer.isAi ? (
                  <span className="text-[10px] bg-purple-700 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-purple-300/40 animate-pulse">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    24/7 AI Human
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-amber-200/90 leading-tight">
                  {astrologer.title} • ₹{astrologer.chatRate}/min
                </p>
                {/* Real-time Human Sync Status Badge */}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-black/30 text-amber-200 border border-white/20">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span>{isAstrologerConnected ? 'Astrologer Live' : 'Live Sync Active'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Consultation Timer & Per-Min Billing */}
            <div className="bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-right">
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>Timer</span>
              </div>
              <div className="font-mono font-bold text-sm leading-none text-white">
                {formatTimer(elapsedSeconds)}
              </div>
            </div>

            <button
              onClick={downloadChatHistory}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
              title="Download Consultation Transcript"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={endConsultation}
              className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">End Session</span>
            </button>
          </div>
        </div>

        {/* 5-Minute Welcome Free Trial Active Banner */}
        {activeConsultation.isFreeTrial && (activeConsultation.freeSecondsRemaining ?? 0) > 0 && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-between shadow-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>WELCOME GIFT: First 5 Minutes Are 100% Free (₹0)</span>
            </span>
            <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-[11px]">
              {Math.floor((activeConsultation.freeSecondsRemaining || 0) / 60)}m{' '}
              {(activeConsultation.freeSecondsRemaining || 0) % 60}s left
            </span>
          </div>
        )}

        {/* Live Balance & Security Bar */}
        <div className="bg-amber-50 dark:bg-stone-800/80 px-4 py-1.5 text-xs border-b border-amber-200 dark:border-stone-700 flex items-center justify-between">
          <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Live Consultation Sync</span>
            {isAstrologerConnected && (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold ml-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> (Astrologer in Console)
              </span>
            )}
          </span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            Wallet: <strong className="text-orange-600">₹{walletBalance}</strong> (₹{astrologer.chatRate}/min)
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50 dark:bg-stone-950/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isSystem = m.sender === 'system';

            if (isSystem) {
              return (
                <div key={m.id} className="text-center my-2">
                  <span className="inline-block text-[11px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-300/40">
                    {m.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Audio Listen Button for Astrologer replies */}
                  {!isUser && (
                    <div className="mt-2 pt-1 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                      <button
                        onClick={() => toggleSpeech(m.id, m.text)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-orange-600 cursor-pointer transition py-0.5"
                        title={speakingMessageId === m.id ? "Stop voice" : "Listen to Astrologer's voice"}
                      >
                        {speakingMessageId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            <span className="text-red-500">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen to Astrologer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Prescribed Remedy Card */}
                  {m.isRemedy && m.remedyDetails && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-stone-900 dark:text-stone-100">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{m.remedyDetails.title}</span>
                      </div>

                      {m.remedyDetails.productName && (
                        <p className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-1">
                          Recommended Item: <span className="text-orange-600 dark:text-orange-400">{m.remedyDetails.productName}</span>
                        </p>
                      )}

                      {m.remedyDetails.suggestedGemstone && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                          {m.remedyDetails.suggestedGemstone}
                        </p>
                      )}

                      {m.remedyDetails.mantra && (
                        <p className="text-xs font-mono font-medium text-orange-700 dark:text-orange-400 my-1 bg-amber-50 dark:bg-stone-900 p-1.5 rounded-lg border border-amber-200 dark:border-stone-800">
                          {m.remedyDetails.mantra}
                        </p>
                      )}

                      <div className="mt-2 pt-1 border-t border-amber-200/50 dark:border-stone-800 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Prescribed by {m.senderName}</span>
                        </span>
                        {m.remedyDetails.actionType === 'add_to_cart' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-600 text-white flex items-center gap-1 shadow-2xs">
                            <ShoppingBag className="w-2.5 h-2.5" />
                            <span>Available in Astro Store</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                  <span>{m.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 w-28">
              <span className="text-[10px] text-stone-400 font-bold mr-1">Typing</span>
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-200" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={attachKundli}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-semibold flex items-center gap-1 hover:bg-amber-200 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>Share My Kundli</span>
          </button>
          <button
            onClick={() => setInputText('When is my next major career promotion or business breakthrough?')}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-medium cursor-pointer"
          >
            Career & Job Timing?
          </button>
          <button
            onClick={() => setInputText('What does my Kundli say about marriage timing and life partner compatibility?')}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-medium cursor-pointer"
          >
            Marriage & Love Life?
          </button>
          <button
            onClick={() => setInputText('Are there any active doshas like Manglik or Sade Sati in my chart?')}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-medium cursor-pointer"
          >
            Dosha & Remedial Upayas?
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
          <button
            onClick={attachKundli}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-orange-600 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            title="Attach Birth Chart"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your astrological question..."
            className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm px-4 py-2.5 rounded-xl outline-hidden focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white disabled:opacity-50 cursor-pointer transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
