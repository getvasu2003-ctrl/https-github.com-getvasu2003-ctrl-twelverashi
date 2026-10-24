import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FamilyProfile } from '../../types/astrology.ts';
import {
  X,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const FamilyProfilesModal: React.FC = () => {
  const {
    openFamilyModal,
    setOpenFamilyModal,
    familyProfiles,
    activeFamilyProfile,
    setActiveFamilyProfile,
    addFamilyProfile,
    deleteFamilyProfile,
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [relation, setRelation] = useState<FamilyProfile['relation']>('Spouse');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [dob, setDob] = useState('1996-05-12');
  const [tob, setTob] = useState('08:45');
  const [pob, setPob] = useState('Kolkata, West Bengal');
  const [rashi, setRashi] = useState('Kanya (Virgo)');

  if (!openFamilyModal) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFamilyProfile({
      relation,
      name: name.trim(),
      gender,
      dob,
      tob,
      pob,
      rashi,
      isPrimary: false,
    });

    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <Users className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Family Birth Chart Profiles</h3>
              <p className="text-[11px] text-amber-100">
                Vault Capacity: {familyProfiles.length}/10 Saved • Switch Chart in 1-Click
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenFamilyModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
          <p className="text-xs text-stone-500 leading-relaxed">
            In Vedic traditions, spiritual remedies and planetary effects impact the entire household. Save charts for your spouse, children, and parents to effortlessly switch consultations.
          </p>

          {/* Existing Profiles List */}
          <div className="space-y-2.5">
            {familyProfiles.map((p) => {
              const isActive = activeFamilyProfile?.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    isActive
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-1 ring-orange-500'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{p.name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {p.relation}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            ACTIVE CHART
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {p.dob} • {p.tob} • {p.rashi}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isActive && (
                      <button
                        onClick={() => {
                          setActiveFamilyProfile(p);
                          setOpenFamilyModal(false);
                        }}
                        className="py-1 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-xs transition"
                      >
                        Select
                      </button>
                    )}
                    {familyProfiles.length > 1 && !p.isPrimary && (
                      <button
                        onClick={() => deleteFamilyProfile(p.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Profile Form */}
          {showAddForm ? (
            <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider">
                  Add Family Member
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Relationship
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value="Spouse">Spouse (Patni/Pati)</option>
                    <option value="Child">Child (Santan)</option>
                    <option value="Father">Father (Pita)</option>
                    <option value="Mother">Mother (Mata)</option>
                    <option value="Sibling">Sibling (Bhai/Behen)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Moon Sign (Rashi)
                  </label>
                  <select
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value="Mesha (Aries)">Mesha (Aries)</option>
                    <option value="Vrishabha (Taurus)">Vrishabha (Taurus)</option>
                    <option value="Mithuna (Gemini)">Mithuna (Gemini)</option>
                    <option value="Karka (Cancer)">Karka (Cancer)</option>
                    <option value="Simha (Leo)">Simha (Leo)</option>
                    <option value="Kanya (Virgo)">Kanya (Virgo)</option>
                    <option value="Tula (Libra)">Tula (Libra)</option>
                    <option value="Vrishchika (Scorpio)">Vrishchika (Scorpio)</option>
                    <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
                    <option value="Makara (Capricorn)">Makara (Capricorn)</option>
                    <option value="Kumbha (Aquarius)">Kumbha (Aquarius)</option>
                    <option value="Meena (Pisces)">Meena (Pisces)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Place of Birth
                </label>
                <input
                  type="text"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  placeholder="City, State"
                  required
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition hover:from-orange-600 hover:to-amber-600"
              >
                Save Family Profile
              </button>
            </form>
          ) : familyProfiles.length >= 10 ? (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-300 font-semibold">
              Maximum 10 family Kundli profiles saved. Remove a profile to add a new member.
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-orange-300 dark:border-stone-700 hover:border-orange-500 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition bg-orange-50/20 dark:bg-stone-800/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Family Member Profile ({familyProfiles.length}/10)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
