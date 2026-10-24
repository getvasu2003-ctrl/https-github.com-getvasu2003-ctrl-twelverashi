import React, { useState, useEffect } from 'react';
import {
  VASTU_ZONES,
  VastuDirection,
  RoomAuditInput,
  VastuAuditResult,
  performVastuAudit,
} from '../../services/vastuService.ts';
import {
  Compass,
  Home,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Droplets,
  Flame,
  Globe2,
  Wind,
  Layers,
  PhoneCall,
  Info,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

const DIRECTIONS: VastuDirection[] = [
  'North',
  'North-East',
  'East',
  'South-East',
  'South',
  'South-West',
  'West',
  'North-West',
];

interface VastuPageProps {
  onConsultClick?: () => void;
}

export const VastuPage: React.FC<VastuPageProps> = ({ onConsultClick }) => {
  const [selectedDirection, setSelectedDirection] = useState<VastuDirection>('North-East');

  const [auditInput, setAuditInput] = useState<RoomAuditInput>({
    mainEntrance: 'North-East',
    kitchen: 'South-East',
    masterBedroom: 'South-West',
    mandir: 'North-East',
    toilet: 'North-West',
    livingRoom: 'North',
    staircase: 'South',
    waterStorage: 'North',
  });

  const [auditResult, setAuditResult] = useState<VastuAuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vastu/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditInput),
      });
      const data = await res.json();
      if (data.success && data.auditResult) {
        setAuditResult(data.auditResult);
      } else {
        setAuditResult(performVastuAudit(auditInput));
      }
    } catch {
      setAuditResult(performVastuAudit(auditInput));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunAudit();
  }, []);

  const currentZone = VASTU_ZONES[selectedDirection];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-stone-800 dark:text-stone-200">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 border border-emerald-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Vedic Vastu Shastra Architecture Engine (वास्तु शास्त्र)</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Vastu Purusha Mandala & Home Audit
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed">
            Align your home or office with the 8 cosmic directions and Pancha Mahabhuta (5 Elements). Audit room directions, identify critical Vastu Doshas, and implement <strong>proven non-demolition remedies (बिना तोड़-फोड़ के उपाय)</strong>.
          </p>
        </div>
      </div>

      {/* Section 1: Interactive Directional Compass & 8-Zone Explorer */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-orange-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
              Cosmic Directions
            </span>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-0.5">
              Interactive 8-Zone Vastu Explorer
            </h2>
          </div>
          <p className="text-xs text-stone-400">
            Tap any direction to inspect its ruling deity, element, and ideal room placements
          </p>
        </div>

        {/* Direction Tabs Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {DIRECTIONS.map((dir) => {
            const isSelected = selectedDirection === dir;
            return (
              <button
                key={dir}
                onClick={() => setSelectedDirection(dir)}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-t from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{dir}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  {dir === 'North' && 'कुबेर'}
                  {dir === 'North-East' && 'ईशान'}
                  {dir === 'East' && 'इंद्र'}
                  {dir === 'South-East' && 'आग्नेय'}
                  {dir === 'South' && 'यम'}
                  {dir === 'South-West' && 'नैऋत्य'}
                  {dir === 'West' && 'वरुण'}
                  {dir === 'North-West' && 'वायव्य'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Zone Card */}
        {currentZone && (
          <div className="p-6 rounded-3xl bg-orange-50/50 dark:bg-stone-800/50 border border-orange-200 dark:border-stone-700 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {currentZone.direction} Zone
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {currentZone.hindiName}
                </h3>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {currentZone.attribute}
              </p>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Ruling Deity:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{currentZone.rulingDeity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ruling Planet:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{currentZone.planet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pancha Mahabhuta:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{currentZone.element}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800/40">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ideal Room Placements
              </span>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                {currentZone.idealRooms.map((room, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{room}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/40">
              <span className="font-bold text-rose-800 dark:text-rose-400 uppercase text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Strictly Forbidden (Causes Doshas)
              </span>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                {currentZone.forbiddenRooms.map((room, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{room}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                <span className="text-stone-500 block">Auspicious Colors:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{currentZone.favorableColors.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Interactive Room Direction Audit Tool */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-orange-200 dark:border-stone-800 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
            Comprehensive Analysis
          </span>
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-0.5">
            Full Home & Office Vastu Audit
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Select the compass direction where each room is located in your house to calculate your total Vastu Score
          </p>
        </div>

        <form onSubmit={handleRunAudit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Main Entrance */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🚪 Main Entrance (मुख्य द्वार)
              </label>
              <select
                value={auditInput.mainEntrance}
                onChange={(e) => setAuditInput({ ...auditInput, mainEntrance: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 2. Kitchen */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🔥 Kitchen / Cooktop (रसोई)
              </label>
              <select
                value={auditInput.kitchen}
                onChange={(e) => setAuditInput({ ...auditInput, kitchen: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 3. Master Bedroom */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🛏️ Master Bedroom (शयन कक्ष)
              </label>
              <select
                value={auditInput.masterBedroom}
                onChange={(e) => setAuditInput({ ...auditInput, masterBedroom: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 4. Mandir */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🪔 Mandir / Puja Room (पूजा घर)
              </label>
              <select
                value={auditInput.mandir}
                onChange={(e) => setAuditInput({ ...auditInput, mandir: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 5. Toilet */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🚽 Toilet / Commode (शौचालय)
              </label>
              <select
                value={auditInput.toilet}
                onChange={(e) => setAuditInput({ ...auditInput, toilet: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 6. Living Room */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🛋️ Living Room / Hall (बैठक)
              </label>
              <select
                value={auditInput.livingRoom}
                onChange={(e) => setAuditInput({ ...auditInput, livingRoom: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 7. Staircase */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                🪜 Staircase (सीढ़ियां)
              </label>
              <select
                value={auditInput.staircase}
                onChange={(e) => setAuditInput({ ...auditInput, staircase: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 8. Water Storage */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                💧 Water Sump / Tank (जल संचय)
              </label>
              <select
                value={auditInput.waterStorage}
                onChange={(e) => setAuditInput({ ...auditInput, waterStorage: e.target.value as VastuDirection })}
                className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition cursor-pointer text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{loading ? 'Evaluating Energy Zones...' : 'Generate Vastu Audit Report'}</span>
            </button>
          </div>
        </form>

        {/* Audit Report Results */}
        {auditResult && (
          <div className="space-y-8 pt-6 border-t border-stone-200 dark:border-stone-800 animate-fade-in">
            {/* Top Score Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 to-stone-950 border border-emerald-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Overall Compliance Score
                </span>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-4xl md:text-5xl font-extrabold font-serif text-white">
                    {auditResult.score}%
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    {auditResult.grade}
                  </span>
                </div>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  {auditResult.summary}
                </p>
              </div>

              {/* Pancha Tattva Element Barometer */}
              <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 min-w-[240px] space-y-2 text-xs">
                <span className="font-bold text-stone-300 block text-[11px] uppercase">
                  Pancha Tattva Balance
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-sky-400" /> Water (Jal):</span>
                    <strong className="text-sky-400">{auditResult.elementalBalance.water}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> Fire (Agni):</span>
                    <strong className="text-orange-400">{auditResult.elementalBalance.fire}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Globe2 className="w-3 h-3 text-amber-500" /> Earth (Prithvi):</span>
                    <strong className="text-amber-500">{auditResult.elementalBalance.earth}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-teal-400" /> Air (Vayu):</span>
                    <strong className="text-teal-400">{auditResult.elementalBalance.air}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Dosha & Remedial Breakdown */}
            {auditResult.doshas.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    Identified Vastu Doshas & Non-Demolition Remedies ({auditResult.doshas.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auditResult.doshas.map((dosha, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                            {dosha.room} in {dosha.direction}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {dosha.impact}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          dosha.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {dosha.severity} Dosha
                        </span>
                      </div>

                      {/* Remedy Box */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                        <strong className="block text-amber-900 dark:text-amber-200 font-semibold text-[11px]">
                          Vedic Non-Demolition Remedy:
                        </strong>
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                          {dosha.remedy}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {dosha.nonDemolitionTools.map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-[10px] font-bold border border-stone-200 dark:border-stone-700"
                            >
                              🔧 {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-200">
                  Zero Critical Vastu Doshas Found!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-lg mx-auto">
                  Your chosen room layout satisfies all sacred directional rules of the Vastu Purusha Mandala.
                </p>
              </div>
            )}

            {/* General Daily Vedic Household Enhancements */}
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Daily Golden Vastu Rules for Prosperity</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-600 dark:text-stone-400">
                {auditResult.generalRemedies.map((rem, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
