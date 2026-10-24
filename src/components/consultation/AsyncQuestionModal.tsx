import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  HelpCircle,
  Sparkles,
  Mic,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AsyncQuestionModal: React.FC = () => {
  const {
    openAsyncQuestionModal,
    setOpenAsyncQuestionModal,
    familyProfiles,
    activeFamilyProfile,
    submitAsyncQuestion,
    walletBalance,
    setOpenPaymentModal,
    astrologers,
  } = useApp();

  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<'Career' | 'Marriage' | 'Finance' | 'Health' | 'Kundli Dosha' | 'General'>('Career');
  const [responseType, setResponseType] = useState<'text' | 'voice_note'>('voice_note');
  const [selectedProfileId, setSelectedProfileId] = useState(activeFamilyProfile?.id || familyProfiles[0]?.id);
  const [selectedAstroName, setSelectedAstroName] = useState(astrologers[0]?.name || 'Acharya Brihaspati (AI)');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!openAsyncQuestionModal) return null;

  const currentProfile = familyProfiles.find((p) => p.id === selectedProfileId) || familyProfiles[0];
  const price = 99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (walletBalance < price) {
      setOpenPaymentModal(true);
      return;
    }

    submitAsyncQuestion({
      question: questionText.trim(),
      category,
      profileName: `${currentProfile.name} (${currentProfile.relation})`,
      birthDetails: `${currentProfile.dob}, ${currentProfile.tob}, ${currentProfile.pob} | ${currentProfile.rashi}`,
      price,
      responseType,
      assignedAstrologer: selectedAstroName,
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setQuestionText('');
    setOpenAsyncQuestionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <HelpCircle className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Ask an Astrologer (₹99)</h3>
              <p className="text-[11px] text-amber-100">
                Lentlo Micro-Consultation • 24-Hour Guaranteed Voice / Written Answer
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

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                Question Dispatched to Acharya!
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                Your question has been assigned to <strong>{selectedAstroName}</strong>. You will receive your {responseType === 'voice_note' ? 'personal 2-minute voice note' : 'detailed written report'} in your <strong>Consultation Archive</strong> within 24 hours.
              </p>

              <button
                onClick={handleClose}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition"
              >
                Done & View History
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Pills */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Topic of Guidance
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
                  Attached Birth Profile
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {familyProfiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        selectedProfileId === p.id
                          ? 'bg-orange-500 text-white border-orange-600'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {p.name} ({p.relation})
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-stone-400 mt-1 font-mono">
                  Birth: {currentProfile.dob} • {currentProfile.tob} • {currentProfile.pob}
                </div>
              </div>

              {/* Response Format: Text or Voice Note */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Desired Response Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResponseType('voice_note')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                      responseType === 'voice_note'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-orange-600" />
                    <span>2-Min Audio Voice Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResponseType('text')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                      responseType === 'text'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Written Detailed Report</span>
                  </button>
                </div>
              </div>

              {/* Question Textarea */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Your Question
                </label>
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. When will I receive a promotion or job change? Will my partner compatibility overcome family hesitation? Should I wear a Blue Sapphire or Emerald?"
                  required
                  className="w-full p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-2 focus:ring-orange-500 border border-transparent dark:border-stone-700 resize-none"
                />
              </div>

              {/* Astrologer preference */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
                  Assign To Astrologer
                </label>
                <select
                  value={selectedAstroName}
                  onChange={(e) => setSelectedAstroName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs border border-stone-200 dark:border-stone-700 outline-hidden"
                >
                  {astrologers.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} — {a.title} ({a.experienceYears} yrs exp)
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit & Pricing */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Wallet Balance: ₹{walletBalance}</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Fee: <span className="text-orange-600">₹{price} flat</span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Question for ₹{price} (Answer in 24h)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
