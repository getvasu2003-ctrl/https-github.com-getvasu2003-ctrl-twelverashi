import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  User,
  AlertCircle,
  Download,
  Share2,
  Bell,
  Wallet,
  ArrowRight,
  RefreshCw,
  Sun,
  Moon,
  Sunset,
} from 'lucide-react';
import { Astrologer } from '../../types/astrology.ts';
import { nativeNotificationService } from '../../services/nativeNotificationService.ts';

interface AstrologerSlotSchedulerProps {
  astrologer: Astrologer;
  onBookingSuccess?: () => void;
  onSwitchToOverview?: () => void;
}

export const AstrologerSlotScheduler: React.FC<AstrologerSlotSchedulerProps> = ({
  astrologer,
  onBookingSuccess,
  onSwitchToOverview,
}) => {
  const {
    familyProfiles,
    activeFamilyProfile,
    addScheduledBooking,
    walletBalance,
    setOpenPaymentModal,
    userProfile,
    addNotification,
  } = useApp();

  // 1. Generate 10 consecutive upcoming calendar dates automatically from local time
  const dynamicDates = useMemo(() => {
    const list = [];
    const today = new Date();

    const muhuratVibes = [
      'Amrit Siddhi Yog',
      'Shubh Muhurat',
      'Sarvartha Siddhi',
      'Guru Pushya Yog',
      'Ravi Pushya Yog',
      'Labha Muhurat',
      'Amrit Choghadiya',
    ];

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayIndex = d.getDay();
      const isWeekend = dayIndex === 0 || dayIndex === 6;
      const isToday = i === 0;
      const isTomorrow = i === 1;

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();

      let label = isToday
        ? 'Today'
        : isTomorrow
        ? 'Tomorrow'
        : `${dayName}, ${dayNum} ${monthShort}`;

      const fullDateStr = `${fullDayName}, ${dayNum} ${monthShort} ${d.getFullYear()}`;

      list.push({
        dateObj: d,
        isoDate: d.toISOString().split('T')[0],
        label,
        fullDateStr,
        dayName,
        dayNum,
        monthShort,
        isToday,
        isTomorrow,
        isWeekend,
        muhurat: muhuratVibes[i % muhuratVibes.length],
      });
    }
    return list;
  }, []);

  // Form states
  const [selectedDateItem, setSelectedDateItem] = useState(dynamicDates[1] || dynamicDates[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM - 11:30 AM');
  const [consultType, setConsultType] = useState<'video' | 'audio' | 'chat'>('video');
  const [durationMins, setDurationMins] = useState<15 | 30 | 45>(30);
  const [selectedProfileId, setSelectedProfileId] = useState(activeFamilyProfile?.id || familyProfiles[0]?.id || 'self');
  const [consultTopic, setConsultTopic] = useState('Career & Promotions');
  const [userNotes, setUserNotes] = useState('');
  const [whatsappReminder, setWhatsappReminder] = useState(true);

  // Success Confirmation State
  const [confirmedBookingData, setConfirmedBookingData] = useState<{
    id: string;
    bookingRef: string;
    date: string;
    timeSlot: string;
    type: string;
    duration: number;
    price: number;
    profileName: string;
  } | null>(null);

  // Automated time slots definitions with Vedic energies
  const slotsCatalog = useMemo(() => {
    return [
      // Morning (Pratah Kaal)
      { id: 'm1', period: 'morning', time: '09:00 AM - 09:30 AM', label: 'Brahma & Surya Hora', status: 'available' },
      { id: 'm2', period: 'morning', time: '10:00 AM - 10:30 AM', label: 'Abhijit Muhurat (Auspicious)', status: 'filling_fast' },
      { id: 'm3', period: 'morning', time: '11:00 AM - 11:30 AM', label: 'Shubh Choghadiya', status: 'available' },
      { id: 'm4', period: 'morning', time: '11:45 AM - 12:15 PM', label: 'Midday Planetary Alignment', status: 'available' },
      // Afternoon (Madhyanha)
      { id: 'a1', period: 'afternoon', time: '02:00 PM - 02:30 PM', label: 'Amrit Kaal Window', status: 'available' },
      { id: 'a2', period: 'afternoon', time: '03:00 PM - 03:30 PM', label: 'Labha Muhurat', status: 'filling_fast' },
      { id: 'a3', period: 'afternoon', time: '04:00 PM - 04:30 PM', label: 'Mercury (Budha) Hora', status: 'available' },
      // Evening / Night (Sandhya / Nishita)
      { id: 'e1', period: 'evening', time: '06:00 PM - 06:30 PM', label: 'Godhuli Muhurat (Golden Hour)', status: 'filling_fast' },
      { id: 'e2', period: 'evening', time: '07:00 PM - 07:30 PM', label: 'Jupiter (Brihaspati) Energy', status: 'available' },
      { id: 'e3', period: 'evening', time: '08:00 PM - 08:30 PM', label: 'Peak Consultation Hours', status: 'filling_fast' },
      { id: 'e4', period: 'evening', time: '09:00 PM - 09:30 PM', label: 'Night Calm Horary Window', status: 'available' },
      { id: 'e5', period: 'evening', time: '10:00 PM - 10:30 PM', label: 'Quiet Astrological Reflection', status: 'available' },
    ];
  }, []);

  const visibleSlots = useMemo(() => {
    if (selectedPeriod === 'all') return slotsCatalog;
    return slotsCatalog.filter((s) => s.period === selectedPeriod);
  }, [selectedPeriod, slotsCatalog]);

  // Pricing calculation based on duration & rate
  const calculatedPrice = useMemo(() => {
    if (durationMins === 15) {
      return consultType === 'chat' ? 199 : consultType === 'audio' ? 299 : 399;
    }
    if (durationMins === 30) {
      return consultType === 'chat' ? 349 : consultType === 'audio' ? 549 : 699;
    }
    // 45 mins
    return consultType === 'chat' ? 499 : consultType === 'audio' ? 799 : 999;
  }, [durationMins, consultType]);

  const currentProfile = familyProfiles.find((p) => p.id === selectedProfileId) || familyProfiles[0] || {
    name: userProfile.name || 'Self',
    relation: 'Self',
    rashi: userProfile.rashi || 'Leo (Simha)',
    dob: userProfile.dob || '1995-08-15',
  };

  const handleConfirmBooking = () => {
    if (walletBalance < calculatedPrice) {
      setOpenPaymentModal(true);
      return;
    }

    const bookingRef = '12R-' + Math.floor(100000 + Math.random() * 900000);

    addScheduledBooking({
      astrologerId: astrologer.id,
      astrologerName: astrologer.name,
      astrologerAvatar: astrologer.avatar,
      astrologerTitle: astrologer.title,
      profileName: `${currentProfile.name} (${currentProfile.relation || 'Self'})`,
      date: selectedDateItem.fullDateStr,
      timeSlot: selectedTimeSlot,
      durationMins,
      price: calculatedPrice,
      type: consultType,
      whatsappReminder,
    });

    setConfirmedBookingData({
      id: 'sb-' + Date.now(),
      bookingRef,
      date: selectedDateItem.fullDateStr,
      timeSlot: selectedTimeSlot,
      type: consultType.toUpperCase(),
      duration: durationMins,
      price: calculatedPrice,
      profileName: currentProfile.name,
    });

    addNotification(
      'Guaranteed Slot Booked',
      `Your ${durationMins}-min ${consultType} consultation with ${astrologer.name} is confirmed for ${selectedDateItem.label} at ${selectedTimeSlot}.`,
      'muhurat'
    );

    if (onBookingSuccess) {
      onBookingSuccess();
    }
  };

  // Generate .ics calendar invite for download
  const handleDownloadCalendar = () => {
    if (!confirmedBookingData) return;
    const title = `Vedic Consultation with ${astrologer.name} - 12Rashi`;
    const desc = `Scheduled ${confirmedBookingData.duration}-minute private Vedic consultation for ${confirmedBookingData.profileName}. Reference: ${confirmedBookingData.bookingRef}. Access your consultation at https://12rashi.com`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//12Rashi Astrology//Automated Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:12Rashi Consultation Network (Online)`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `12Rashi-Appointment-${confirmedBookingData.bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SUCCESS VIEW
  if (confirmedBookingData) {
    return (
      <div className="p-5 space-y-5 animate-in fade-in zoom-in-95">
        <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:border-emerald-800/60 p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Guaranteed Appointment Confirmed
            </span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif pt-1">
              Your Slot is Confirmed with {astrologer.name}!
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
              Our automated engine has blocked this exclusive time window on {astrologer.name}'s calendar. Your chart analysis will be prepared in advance.
            </p>
          </div>

          {/* Ticket Summary Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 text-left max-w-md mx-auto shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 text-xs">
              <span className="text-stone-500">Booking Reference</span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                {confirmedBookingData.bookingRef}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 text-[10px] block">Date</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBookingData.date}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Time Window</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBookingData.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Session Format</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBookingData.type} ({confirmedBookingData.duration} Mins)
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Consulting For</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBookingData.profileName}
                </span>
              </div>
            </div>

            {whatsappReminder && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                <Bell className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Automated WhatsApp reminders & direct room link will be sent to <strong>+91 {userProfile.phone}</strong> 15 mins before start.
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={handleDownloadCalendar}
              className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={async () => {
                if (!confirmedBookingData) return;
                await nativeNotificationService.deliverConsultationNotification(
                  {
                    id: confirmedBookingData.id,
                    astrologerId: astrologer.id,
                    astrologerName: astrologer.name,
                    astrologerAvatar: astrologer.avatar,
                    astrologerTitle: astrologer.title,
                    profileName: confirmedBookingData.profileName,
                    date: confirmedBookingData.date,
                    timeSlot: confirmedBookingData.timeSlot,
                    durationMins: confirmedBookingData.duration,
                    price: confirmedBookingData.price,
                    type: confirmedBookingData.type.toLowerCase() as any,
                    status: 'CONFIRMED',
                    whatsappReminder: true,
                    bookedAt: 'Just now',
                  },
                  'upcoming_15m'
                );
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/80 hover:bg-orange-200 text-orange-950 dark:text-orange-200 border border-orange-300 dark:border-orange-800 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              <Bell className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Test Native 15-Min Reminder</span>
            </button>

            <button
              onClick={() => {
                setConfirmedBookingData(null);
                if (onSwitchToOverview) onSwitchToOverview();
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              <span>Back to Astrologer Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SCHEDULING FORM
  return (
    <div className="space-y-5 text-xs text-stone-700 dark:text-stone-300">
      {/* Intro Guarantee Ribbon */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
              Automated Slot Booking Guarantee
            </h4>
            <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.2 rounded-full">
              NO WAITING QUEUE
            </span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
            Reserve dedicated 1-on-1 private time with <strong>{astrologer.name}</strong>. The astrologer will review your Kundli birth chart prior to the session.
          </p>
        </div>
      </div>

      {/* STEP 1: Select Consultation Format & Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Consultation Format & Duration</span>
          </span>
          <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
            {durationMins} Mins • ₹{calculatedPrice} flat
          </span>
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setConsultType('video')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              consultType === 'video'
                ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 shadow-xs ring-1 ring-orange-500'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Video className={`w-4 h-4 ${consultType === 'video' ? 'text-orange-600' : 'text-stone-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">HD Video</span>
            </div>
            <div className="pt-2">
              <span className="font-bold text-xs block">Video Call</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Chart screen-share</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setConsultType('audio')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              consultType === 'audio'
                ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 shadow-xs ring-1 ring-orange-500'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Phone className={`w-4 h-4 ${consultType === 'audio' ? 'text-orange-600' : 'text-stone-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Direct Audio</span>
            </div>
            <div className="pt-2">
              <span className="font-bold text-xs block">Voice Call</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Confidential voice</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setConsultType('chat')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              consultType === 'chat'
                ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 shadow-xs ring-1 ring-orange-500'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <MessageSquare className={`w-4 h-4 ${consultType === 'chat' ? 'text-orange-600' : 'text-stone-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Encrypted</span>
            </div>
            <div className="pt-2">
              <span className="font-bold text-xs block">Live Chat</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Saved transcript</span>
            </div>
          </button>
        </div>

        {/* Duration selector */}
        <div className="flex items-center gap-2 pt-1">
          {[15, 30, 45].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setDurationMins(mins as any)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                durationMins === mins
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-transparent hover:bg-stone-200'
              }`}
            >
              <span>{mins} Minutes</span>
              {mins === 30 && <span className="ml-1 text-[10px] text-amber-400">★ Popular</span>}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Automated Dynamic Date Selector (Next 10 Days) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Select Future Date</span>
          </span>
          <span className="text-[10px] text-stone-500">
            Auspicious Gochar Transits Calculated
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {dynamicDates.map((item) => {
            const isSelected = selectedDateItem.isoDate === item.isoDate;
            return (
              <button
                key={item.isoDate}
                type="button"
                onClick={() => setSelectedDateItem(item)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[76px] transition cursor-pointer border shrink-0 text-center ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500 text-white shadow-md scale-102 font-bold'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-orange-300 text-stone-800 dark:text-stone-200'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-orange-100' : 'text-stone-400'}`}>
                  {item.isToday ? 'Today' : item.isTomorrow ? 'Tmrw' : item.dayName}
                </span>
                <span className="text-base font-extrabold my-0.5 leading-tight">
                  {item.dayNum}
                </span>
                <span className={`text-[9px] ${isSelected ? 'text-orange-200' : 'text-stone-400'}`}>
                  {item.monthShort}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Panchang / Muhurat Indicator */}
        <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-stone-700 dark:text-stone-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Panchang Vibrations: <strong>{selectedDateItem.muhurat}</strong></span>
          </span>
          <span className="text-orange-600 dark:text-orange-400 font-bold">
            {selectedDateItem.fullDateStr}
          </span>
        </div>
      </div>

      {/* STEP 3: Automated Time Slot Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Select Specific Time Slot</span>
          </span>

          {/* Period Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedPeriod('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                selectedPeriod === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              All Slots
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('morning')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-0.5 ${
                selectedPeriod === 'morning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Sun className="w-2.5 h-2.5" />
              <span>Morning</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('afternoon')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-0.5 ${
                selectedPeriod === 'afternoon'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Sunset className="w-2.5 h-2.5" />
              <span>Afternoon</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('evening')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-0.5 ${
                selectedPeriod === 'evening'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Moon className="w-2.5 h-2.5" />
              <span>Evening</span>
            </button>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {visibleSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedTimeSlot(slot.time)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/60 ring-1 ring-orange-500 shadow-2xs'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 font-mono">
                    {slot.time.split(' - ')[0]}
                  </span>
                  {slot.status === 'filling_fast' ? (
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded">
                      1 Left
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Slot Available" />
                  )}
                </div>

                <div className="pt-1.5">
                  <span className="text-[10px] text-stone-500 block">
                    to {slot.time.split(' - ')[1]}
                  </span>
                  <span className="text-[9px] text-stone-400 block truncate font-sans">
                    {slot.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 4: Consulting Seeker Profile & Focus Topic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Family Member Picker */}
        <div className="space-y-1.5">
          <label className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[10px] flex items-center gap-1">
            <User className="w-3 h-3 text-orange-500" />
            <span>Consulting Seeker Profile</span>
          </label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-semibold outline-hidden focus:ring-1 focus:ring-orange-500"
          >
            {familyProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.relation}) • {p.rashi}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-stone-400 block">
            Birth chart for {currentProfile.name} will be auto-attached.
          </span>
        </div>

        {/* Topic of Guidance */}
        <div className="space-y-1.5">
          <label className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>Primary Focus Topic</span>
          </label>
          <select
            value={consultTopic}
            onChange={(e) => setConsultTopic(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-semibold outline-hidden focus:ring-1 focus:ring-orange-500"
          >
            <option value="Career & Promotions">Career, Promotion & Job Change</option>
            <option value="Kundli Milan & Marriage">Kundli Milan, Marriage & Love</option>
            <option value="Kaal Sarp & Shani Sade Sati">Kaal Sarp, Sade Sati & Doshas</option>
            <option value="Financial Growth & Business">Financial Wealth, Debt & Business</option>
            <option value="Family Peace & Health">Family Harmony & Vitality</option>
            <option value="Prashna Horary / Urgent Dilemma">Immediate Horary / Prashna Decision</option>
          </select>
          <span className="text-[10px] text-stone-400 block">
            Guarantees targeted remedies and Dasha calculations.
          </span>
        </div>
      </div>

      {/* Optional User Question / Details */}
      <div className="space-y-1">
        <label className="font-bold text-stone-700 dark:text-stone-300 text-[10px]">
          Specific Query or Questions for {astrologer.name} (Optional)
        </label>
        <input
          type="text"
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="e.g. Planning job switch in IT next month, will planetary transit favor overseas move?"
          className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs outline-hidden focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Automated Notifications Options */}
      <div className="space-y-2">
        <div className="p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-600 shrink-0" />
            <div>
              <span className="font-bold text-orange-950 dark:text-orange-200 text-xs block">
                Device Native Push Reminders (15 Mins Before)
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">
                Automatic lock-screen alert on this device when session window approaches.
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
            Enabled
          </span>
        </div>

        {/* Automated WhatsApp and SMS Reminder Alert Box */}
        <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs block">
                Automated WhatsApp & SMS Notifications
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                Calendar invite + reminder ping sent to <strong>+91 {userProfile.phone || '9831039814'}</strong>
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={whatsappReminder}
              onChange={(e) => setWhatsappReminder(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>
      </div>

      {/* Pricing Summary & Confirmation Bar */}
      <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 block text-[10px]">Consultation Fee</span>
            <span className="font-bold text-lg text-stone-900 dark:text-stone-100 font-serif">
              ₹{calculatedPrice} <span className="text-xs font-normal text-stone-400 font-sans">({durationMins} Mins Flat)</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-stone-500 block text-[10px]">Your Wallet Balance</span>
            <span className={`font-bold text-sm font-mono ${walletBalance >= calculatedPrice ? 'text-emerald-600' : 'text-red-500'}`}>
              ₹{walletBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Confirmation Button */}
        {walletBalance >= calculatedPrice ? (
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition transform active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Guarantee Slot with {astrologer.name}</span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Wallet balance is ₹{(calculatedPrice - walletBalance).toFixed(2)} short for this slot.</span>
            </div>
            <button
              type="button"
              onClick={() => setOpenPaymentModal(true)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
            >
              <Wallet className="w-4 h-4" />
              <span>Recharge Wallet (₹{(calculatedPrice - walletBalance).toFixed(0)}) & Confirm Slot</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
