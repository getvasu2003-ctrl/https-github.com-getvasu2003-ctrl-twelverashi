import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ConsultationArchiveRecord } from '../../types/astrology.ts';
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Video,
  MessageSquare,
  ExternalLink,
  Volume2,
  RotateCcw,
  Sparkles,
  Receipt,
  Download,
} from 'lucide-react';

export const ConsultationArchiveSection: React.FC = () => {
  const { consultationArchive, setSelectedReceiptRecord, setOpenWhatsAppReceiptModal, setOpenFairBillingModal } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'chat' | 'audio' | 'video'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const filtered = consultationArchive.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const handleOpenReceipt = (rec: ConsultationArchiveRecord) => {
    setSelectedReceiptRecord(rec);
    setOpenWhatsAppReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3 border border-amber-200/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span>Fair-Billing Guarantee & Permanent Customer Archive</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            My Consultations & Session Transcripts
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-50/90 leading-relaxed">
            Review past astrological guidance, voice recordings, prescribed mantras, and verified WhatsApp tax invoices. Every second is metered transparently.
          </p>
        </div>

        {/* Fair-billing guarantee badge trigger */}
        <div className="mt-4 flex items-center gap-3 relative z-10">
          <button
            onClick={() => setOpenFairBillingModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>View Fair-Billing Guarantee (Per-Second & 1st-Min Refund)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {(['all', 'chat', 'audio', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer capitalize ${
                filterType === t
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
              }`}
            >
              {t === 'all' ? 'All Consultations' : `${t} Sessions`}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
          Showing {filtered.length} Recorded Sessions
        </span>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 space-y-3">
            <FileText className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className="font-bold text-base text-stone-800 dark:text-stone-200">No Past Consultations in this category</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Your consultation transcripts, remedies, and call recordings will automatically appear here once completed.
            </p>
          </div>
        ) : (
          filtered.map((record) => {
            const isAudio = record.type === 'audio';
            const isVideo = record.type === 'video';
            const isChat = record.type === 'chat';

            return (
              <div
                key={record.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header: Astrologer & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={record.astrologerAvatar}
                      alt={record.astrologerName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500/50 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                          {record.astrologerName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 flex items-center gap-1">
                          {isAudio && <Phone className="w-3 h-3" />}
                          {isVideo && <Video className="w-3 h-3" />}
                          {isChat && <MessageSquare className="w-3 h-3" />}
                          <span>{record.type}</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{record.astrologerTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs text-stone-400">{record.date}</span>
                    <button
                      onClick={() => handleOpenReceipt(record)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      title="View Official WhatsApp Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Receipt</span>
                    </button>
                  </div>
                </div>

                {/* Per-Second Fair Billing Breakdown */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Duration:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        {formatSecs(record.durationSeconds)} ({record.durationSeconds}s)
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Metered Rate:</span>
                      <span className="font-mono text-stone-700 dark:text-stone-300">
                        ₹{record.perSecondRate.toFixed(2)}/sec
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Total Deducted:</span>
                      <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                        ₹{record.cost}
                      </span>
                    </div>
                  </div>

                  {record.refunded ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{record.refundReason}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Per-second billing verified</span>
                    </div>
                  )}
                </div>

                {/* Transcript Snippet */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
                    Consultation Summary & Transcript
                  </span>
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 italic leading-relaxed">
                    "{record.transcriptSnippet}"
                  </div>
                </div>

                {/* Audio Recording Player Simulation (if audio/video) */}
                {record.hasAudioRecording && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-orange-600 animate-pulse" />
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        Both-Party Consented Audio Recording ({formatSecs(record.durationSeconds)})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (playingAudioId === record.id) {
                          setPlayingAudioId(null);
                        } else {
                          setPlayingAudioId(record.id);
                        }
                      }}
                      className="py-1 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs transition"
                    >
                      {playingAudioId === record.id ? 'Pause Playback ⏸' : 'Listen Recording ▶'}
                    </button>
                  </div>
                )}

                {/* Prescribed Remedies with AstroStore integration */}
                {record.prescribedRemedies && record.prescribedRemedies.length > 0 && (
                  <div className="space-y-2 text-xs pt-1">
                    <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prescribed Astrological Remedies</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {record.prescribedRemedies.map((rem, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-1.5"
                        >
                          <div className="font-bold text-stone-900 dark:text-stone-100">{rem.title}</div>
                          {rem.mantra && (
                            <p className="font-mono text-orange-700 dark:text-orange-400 text-xs">{rem.mantra}</p>
                          )}
                          {rem.productName && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                                {rem.productName}
                              </span>
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-md">
                                Mantra Sadhana
                              </span>
                            </div>
                          )}
                          {rem.gemstone && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                                {rem.gemstone}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                Planetary Beej Chanting
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
