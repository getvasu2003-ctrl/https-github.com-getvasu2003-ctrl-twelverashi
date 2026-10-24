import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FamilyProfile, FamilyRelation } from '../../types/astrology.ts';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Download,
  PhoneCall,
  HeartHandshake,
  Star,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Eye,
  Info,
  X,
} from 'lucide-react';

const RELATIONS: FamilyRelation[] = [
  'Self',
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother',
  'Father-in-law',
  'Mother-in-law',
  'Child',
  'Other',
];

const RASHIS = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

interface FamilyKundliVaultPageProps {
  onOpenAstrologers?: () => void;
  onOpenKundliMilan?: (profile: FamilyProfile) => void;
}

export const FamilyKundliVaultPage: React.FC<FamilyKundliVaultPageProps> = ({
  onOpenAstrologers,
  onOpenKundliMilan,
}) => {
  const {
    familyProfiles,
    activeFamilyProfile,
    setActiveFamilyProfile,
    addFamilyProfile,
    deleteFamilyProfile,
    updateFamilyProfile,
    setOpenKundliPdfModal,
    setOpenLoginModal,
    isUserLoggedIn,
    user,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedViewProfile, setSelectedViewProfile] = useState<FamilyProfile | null>(null);

  // Form Fields
  const [relation, setRelation] = useState<FamilyRelation>('Spouse');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [dob, setDob] = useState('1996-05-12');
  const [tob, setTob] = useState('08:45');
  const [pob, setPob] = useState('Kolkata, West Bengal');
  const [rashi, setRashi] = useState('Kanya (Virgo)');
  const [nakshatra, setNakshatra] = useState('Hasta');
  const [lagna, setLagna] = useState('Simha (Leo)');
  const [gotra, setGotra] = useState('Kashyap');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const count = familyProfiles.length;
  const isMaxReached = count >= 10;
  const remainingSlots = Math.max(0, 10 - count);

  const resetForm = () => {
    setEditingId(null);
    setRelation('Spouse');
    setName('');
    setGender('female');
    setDob('1996-05-12');
    setTob('08:45');
    setPob('Kolkata, West Bengal');
    setRashi('Kanya (Virgo)');
    setNakshatra('Hasta');
    setLagna('Simha (Leo)');
    setGotra('Kashyap');
    setNotes('');
    setFormError('');
    setShowForm(false);
  };

  const handleStartEdit = (p: FamilyProfile) => {
    setEditingId(p.id);
    setRelation(p.relation);
    setName(p.name);
    setGender(p.gender);
    setDob(p.dob);
    setTob(p.tob);
    setPob(p.pob);
    setRashi(p.rashi);
    setNakshatra(p.nakshatra || 'Ashwini');
    setLagna(p.lagna || 'Mesha (Aries)');
    setGotra(p.gotra || '');
    setNotes(p.notes || '');
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter family member full name');
      return;
    }

    if (!editingId && isMaxReached) {
      setFormError('Maximum 10 family Kundli profiles reached. Please delete a profile first.');
      return;
    }

    if (editingId) {
      updateFamilyProfile(editingId, {
        relation,
        name: name.trim(),
        gender,
        dob,
        tob,
        pob,
        rashi,
        nakshatra,
        lagna,
        gotra,
        notes,
      });
    } else {
      addFamilyProfile({
        relation,
        name: name.trim(),
        gender,
        dob,
        tob,
        pob,
        rashi,
        nakshatra,
        lagna,
        gotra,
        notes,
        isPrimary: false,
      });
    }

    resetForm();
  };

  const calculateAge = (dateString: string) => {
    try {
      const birth = new Date(dateString);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 0 ? `${age} yrs` : '';
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 border border-orange-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Household Chart Vault (Up to 10 Profiles)</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
              Family Kundli Vault
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              In Vedic astrology, planetary transits and family karma impact the entire household. Save Janam Kundli charts for your spouse, children, and parents to seamlessly switch active charts during live consultations.
            </p>

            {/* Cloud Sync Status */}
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isUserLoggedIn ? `Cloud Synced to +91 ${user?.phone}` : 'Stored locally (Sign in to back up)'}
                </span>
              </div>
              {!isUserLoggedIn && (
                <button
                  onClick={() => setOpenLoginModal(true)}
                  className="text-orange-400 underline hover:text-orange-300 font-bold cursor-pointer"
                >
                  Sign In with Mobile
                </button>
              )}
            </div>
          </div>

          {/* Quota Progress Meter */}
          <div className="bg-stone-900/80 backdrop-blur-md p-5 rounded-2xl border border-orange-500/20 text-center min-w-[220px] shrink-0 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
              Vault Capacity
            </span>
            <div className="text-3xl font-extrabold text-orange-400 flex items-center justify-center gap-1">
              <span>{count}</span>
              <span className="text-stone-500 text-xl font-normal">/ 10</span>
            </div>

            {/* 10-Segment Visual Gauge */}
            <div className="flex justify-center gap-1 px-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 w-3.5 rounded-xs transition-all ${
                    idx < count
                      ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-xs shadow-orange-500/50'
                      : 'bg-stone-800 border border-stone-700'
                  }`}
                  title={`Slot ${idx + 1}: ${idx < count ? 'Occupied' : 'Available'}`}
                />
              ))}
            </div>

            <p className="text-[11px] text-stone-400 font-medium">
              {isMaxReached ? (
                <span className="text-amber-400 font-bold">10/10 Slots Full</span>
              ) : (
                <span>{remainingSlots} free slots remaining</span>
              )}
            </p>

            <button
              onClick={() => {
                if (isMaxReached) return;
                resetForm();
                setShowForm(true);
              }}
              disabled={isMaxReached}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md ${
                isMaxReached
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal / Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-white/20">
                  <Users className="w-5 h-5 text-amber-200" />
                </span>
                <div>
                  <h3 className="font-bold text-base">
                    {editingId ? 'Edit Family Kundli Profile' : 'Add Family Member Kundli'}
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    Slot {editingId ? 'Update' : `${count + 1} of 10`} • Accurate birth coordinates for Vedic charts
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Relationship */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Relationship *
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as FamilyRelation)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {RELATIONS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanka Sharma"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="female">Female (स्त्री)</option>
                    <option value="male">Male (पुरुष)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span>Date of Birth *</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Time of Birth */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Time of Birth (24h) *</span>
                  </label>
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Place of Birth */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Place of Birth (City, State) *</span>
                  </label>
                  <input
                    type="text"
                    value={pob}
                    onChange={(e) => setPob(e.target.value)}
                    placeholder="e.g. Kolkata, West Bengal"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Janma Rashi */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Janma Rashi (Moon Sign)
                  </label>
                  <select
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {RASHIS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Nakshatra */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Janma Nakshatra
                  </label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Gotra */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Gotra (Optional)
                  </label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    placeholder="e.g. Kashyap, Bharadwaj"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Lagna / Ascendant */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Lagna / Ascendant
                  </label>
                  <select
                    value={lagna}
                    onChange={(e) => setLagna(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {RASHIS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Astrological Concerns / Life Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Preparing for competitive exams; checking Sade Sati remedies..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 px-4 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 transition cursor-pointer text-center"
                >
                  {editingId ? 'Save Changes' : 'Save to Kundli Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Info Box */}
      <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-start gap-3 text-xs text-stone-700 dark:text-stone-300">
        <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p>
            <strong>How Active Charts Work:</strong> Whichever family member is marked as <strong>&quot;Active Chart&quot;</strong> will automatically be used when consulting an astrologer, downloading Janam Kundli PDFs, or reading daily transit remedies.
          </p>
        </div>
      </div>

      {/* Grid of Saved Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {familyProfiles.map((p, idx) => {
          const isActive = activeFamilyProfile?.id === p.id;
          const age = calculateAge(p.dob);

          return (
            <div
              key={p.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 ring-2 ring-orange-500/50 shadow-xl shadow-orange-500/10'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-stone-700 shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ${
                      p.gender === 'female'
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white'
                        : 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white'
                    }`}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-stone-900 dark:text-white leading-tight">
                          {p.name}
                        </h3>
                        {age && (
                          <span className="text-[10px] text-stone-400 font-semibold">({age})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-[10px] font-bold border border-orange-200 dark:border-orange-800">
                          {p.relation}
                        </span>
                        {p.isPrimary && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            Primary Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Slot Number Badge */}
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                </div>

                {/* Birth Coordinates */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{p.dob}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{p.tob}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{p.pob}</span>
                  </div>
                </div>

                {/* Astrological Rashi & Nakshatra Pill */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-amber-900/60 dark:text-amber-300/60">
                      Janma Rashi:
                    </span>
                    <strong className="text-amber-900 dark:text-amber-200 font-serif">
                      {p.rashi}
                    </strong>
                  </div>
                  {p.nakshatra && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-stone-500">Nakshatra:</span>
                      <span className="text-stone-800 dark:text-stone-200 font-semibold">{p.nakshatra}</span>
                    </div>
                  )}
                  {p.lagna && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-stone-500">Lagna:</span>
                      <span className="text-stone-800 dark:text-stone-200 font-semibold">{p.lagna}</span>
                    </div>
                  )}
                  {p.gotra && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-stone-500">Gotra:</span>
                      <span className="text-stone-800 dark:text-stone-200 font-semibold">{p.gotra}</span>
                    </div>
                  )}
                </div>

                {p.notes && (
                  <p className="text-[11px] text-stone-500 italic bg-stone-50 dark:bg-stone-800/40 p-2 rounded-lg line-clamp-2">
                    &quot;{p.notes}&quot;
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/70 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                {/* Active Toggle */}
                {isActive ? (
                  <div className="w-full py-2 px-3 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Chart for Consultations</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveFamilyProfile(p)}
                    className="w-full py-2 px-3 rounded-xl border border-orange-500/40 hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Set as Active Chart</span>
                  </button>
                )}

                {/* Sub Actions */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setActiveFamilyProfile(p);
                      setOpenKundliPdfModal(true);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                    title="Export Janam Kundli PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-500" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(p)}
                    className="py-1.5 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                    title="Edit profile"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Edit</span>
                  </button>

                  {!p.isPrimary && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete Kundli profile for ${p.name}?`)) {
                          deleteFamilyProfile(p.id);
                        }
                      }}
                      className="py-1.5 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-stone-500 hover:text-rose-600 font-semibold flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Slot Placeholder Cards (if < 10) */}
        {!isMaxReached && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="rounded-3xl border-2 border-dashed border-orange-300/80 dark:border-stone-700 hover:border-orange-500 dark:hover:border-orange-500 p-8 flex flex-col items-center justify-center gap-3 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer min-h-[300px] group bg-orange-50/20 dark:bg-stone-900/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-stone-800 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition shadow-sm text-orange-600 dark:text-orange-400">
              <Plus className="w-7 h-7" />
            </div>
            <div className="text-center">
              <span className="font-bold text-sm block text-stone-700 dark:text-stone-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                + Add Family Member #{count + 1}
              </span>
              <span className="text-xs text-stone-400 mt-1 block">
                Save spouse, children, or parents chart
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
