import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getAiVedicInsight, askRashiAi, AiInsightResponse } from '../../services/apiService.ts';
import {
  Sparkles,
  Send,
  Compass,
  Flame,
  Bot,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Heart,
  Coins,
  Activity,
  Plane,
  RotateCw,
} from 'lucide-react';

export const AIInsightsEngine: React.FC = () => {
  const { userProfile, currentKundli } = useApp();

  const [activeMode, setActiveMode] = useState<'deep_prediction' | 'rashi_chat'>('deep_prediction');

  // Deep Prediction Form States
  const [seekerName, setSeekerName] = useState(userProfile.name);
  const [selectedRashi, setSelectedRashi] = useState(userProfile.rashi);
  const [category, setCategory] = useState('Career & Professional Promotion');
  const [userQuestion, setUserQuestion] = useState('When will I experience my next big career breakthrough and salary hike?');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<AiInsightResponse | null>(null);

  // Rashi AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Namaste ${userProfile.name}! I am Rashi AI, your 24/7 Vedic astrological intelligence companion. Ask me any question regarding your daily horoscope, Muhurat timing, gemstone suggestions, or planetary transits.`,
      time: 'Just now',
    },
  ]);

  const categories = [
    { label: 'Career & Promotion', icon: Briefcase },
    { label: 'Love & Marriage', icon: Heart },
    { label: 'Wealth & Assets', icon: Coins },
    { label: 'Health & Vitality', icon: Activity },
    { label: 'Foreign Travel & Visa', icon: Plane },
  ];

  const handleGeneratePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);

    const res = await getAiVedicInsight({
      name: seekerName,
      dob: userProfile.dob,
      tob: userProfile.tob,
      pob: userProfile.pob,
      rashi: selectedRashi,
      question: userQuestion,
      category,
    });

    setPredictionResult(res);
    setIsLoading(false);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    const newHistory = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: 'Just now' },
    ];
    setChatMessages(newHistory);
    setChatLoading(true);

    const reply = await askRashiAi(userText, newHistory);
    setChatMessages((prev) => [
      ...prev,
      { sender: 'ai', text: reply, time: 'Just now' },
    ]);
    setChatLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-bold mb-3 border border-amber-200/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated AI Astrological Intelligence alongside Human Astrologers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            AI Vedic Insights Engine
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-50/90 leading-relaxed">
            Harness the power of ancient Parashari astronomical algorithms combined with cutting-edge Gemini reasoning for instant 24/7 life answers.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs max-w-md">
        <button
          onClick={() => setActiveMode('deep_prediction')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMode === 'deep_prediction'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Deep Question Report</span>
        </button>

        <button
          onClick={() => setActiveMode('rashi_chat')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMode === 'rashi_chat'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask Rashi AI (24/7 Chat)</span>
        </button>
      </div>

      {/* Mode 1: Deep Vedic Astrological Prediction */}
      {activeMode === 'deep_prediction' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Formulation Form */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              Submit Life Query for AI Analysis
            </h3>

            <form onSubmit={handleGeneratePrediction} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Seeker’s Name
                </label>
                <input
                  type="text"
                  value={seekerName}
                  onChange={(e) => setSeekerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Moon Sign / Rashi
                </label>
                <select
                  value={selectedRashi}
                  onChange={(e) => setSelectedRashi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                >
                  <option value="Aries (Mesha)">Aries (Mesha)</option>
                  <option value="Taurus (Vrishabha)">Taurus (Vrishabha)</option>
                  <option value="Gemini (Mithuna)">Gemini (Mithuna)</option>
                  <option value="Cancer (Karka)">Cancer (Karka)</option>
                  <option value="Leo (Simha)">Leo (Simha)</option>
                  <option value="Virgo (Kanya)">Virgo (Kanya)</option>
                  <option value="Libra (Tula)">Libra (Tula)</option>
                  <option value="Scorpio (Vrishchika)">Scorpio (Vrishchika)</option>
                  <option value="Sagittarius (Dhanu)">Sagittarius (Dhanu)</option>
                  <option value="Capricorn (Makara)">Capricorn (Makara)</option>
                  <option value="Aquarius (Kumbha)">Aquarius (Kumbha)</option>
                  <option value="Pisces (Meena)">Pisces (Meena)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1.5">
                  Select Question Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setCategory(c.label)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition cursor-pointer ${
                          category === c.label
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Specific Astrological Question
                </label>
                <textarea
                  rows={3}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  required
                  placeholder="e.g. When will I get married? Is overseas travel auspicious for me in 2026-2027?"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Planetary Transits & Dasha...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Vedic Prediction</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Prediction Output Area */}
          <div className="lg:col-span-7">
            {predictionResult ? (
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        Vedic AI Reading for {seekerName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {category} • Moon Sign: {selectedRashi}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {predictionResult.aiModel || 'Gemini 3.8 Flash'}
                  </span>
                </div>

                {/* Comprehensive Vedic Output text */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-line bg-stone-50/60 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-100 dark:border-stone-700/60">
                  {predictionResult.prediction}
                </div>

                {/* Planetary Guidance Callout Grid */}
                {predictionResult.planetaryGuidance && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-stone-800 border border-orange-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Favorable Cycle</span>
                      <div className="font-bold text-xs text-orange-700 dark:text-orange-400 mt-0.5">
                        {predictionResult.planetaryGuidance.favorablePeriod}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-stone-800 border border-red-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Lucky Color</span>
                      <div className="font-bold text-xs text-red-700 dark:text-red-400 mt-0.5">
                        {predictionResult.planetaryGuidance.luckyColor}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Lucky Number</span>
                      <div className="font-bold text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        {predictionResult.planetaryGuidance.luckyNumber}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-stone-800 border border-purple-200 dark:border-stone-700 text-center">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Energy Chakra</span>
                      <div className="font-bold text-xs text-purple-700 dark:text-purple-400 mt-0.5">
                        {predictionResult.planetaryGuidance.keyChakra}
                      </div>
                    </div>
                  </div>
                )}

                {/* Practical Vedic Remedy */}
                {predictionResult.planetaryGuidance?.remedy && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                      Recommended Vedic Upaya (Remedy):
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {predictionResult.planetaryGuidance.remedy}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-stone-800 text-orange-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-stone-800 dark:text-stone-200">
                  Ready for your Astrological Prediction
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mt-1">
                  Select your query category on the left, type your question, and click generate to receive instant insights.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: 24/7 Rashi AI Chat */}
      {activeMode === 'rashi_chat' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden h-[540px] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Rashi AI Companion
                </h4>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online • Instant Answers
                </span>
              </div>
            </div>
            <span className="text-xs text-stone-400">Powered by Gemini 3.8 Flash</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/30 dark:bg-stone-950/40">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">{msg.time}</span>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 w-24">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-200" />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask Rashi AI anything about astrology, remedies, or transit..."
              className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-hidden focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim() || chatLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white disabled:opacity-50 cursor-pointer shadow-md transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
