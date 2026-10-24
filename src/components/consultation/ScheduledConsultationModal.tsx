import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Calendar, Sparkles } from 'lucide-react';
import { AstrologerSlotScheduler } from '../astrologers/AstrologerSlotScheduler.tsx';

export const ScheduledConsultationModal: React.FC = () => {
  const {
    openSlotBookingModal,
    setOpenSlotBookingModal,
    selectedBookingAstrologer,
    setSelectedBookingAstrologer,
    astrologers,
  } = useApp();

  const [chosenAstro, setChosenAstro] = useState(selectedBookingAstrologer || astrologers[0]);

  useEffect(() => {
    if (selectedBookingAstrologer) {
      setChosenAstro(selectedBookingAstrologer);
    } else if (astrologers.length > 0 && !chosenAstro) {
      setChosenAstro(astrologers[0]);
    }
  }, [selectedBookingAstrologer, astrologers]);

  if (!openSlotBookingModal || !chosenAstro) return null;

  const handleClose = () => {
    setOpenSlotBookingModal(false);
    setSelectedBookingAstrologer(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <Calendar className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  Schedule Guaranteed Consultation
                </h3>
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.2 rounded-full">
                  ⚡ Automated Engine
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                Lentlo Automated Slot Booking • Pre-Calculated Panchang & Time Slots
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

        {/* Astrologer Picker Strip if multiple astrologers */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={chosenAstro.avatar}
              alt={chosenAstro.name}
              className="w-9 h-9 rounded-xl object-cover border-2 border-orange-500 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                Booking Session With
              </span>
              <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate block">
                {chosenAstro.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-stone-500 hidden sm:inline">Switch Astrologer:</span>
            <select
              value={chosenAstro.id}
              onChange={(e) => {
                const found = astrologers.find((a) => a.id === e.target.value);
                if (found) setChosenAstro(found);
              }}
              className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 outline-hidden cursor-pointer"
            >
              {astrologers.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.specialties[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Automated Scheduler Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          <AstrologerSlotScheduler
            astrologer={chosenAstro}
            onBookingSuccess={() => {}}
            onSwitchToOverview={handleClose}
          />
        </div>
      </div>
    </div>
  );
};
