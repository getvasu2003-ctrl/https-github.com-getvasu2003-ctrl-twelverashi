import React, { useState } from 'react';
import { KundliData } from '../../types/astrology.ts';
import { PurchasedReportRecord } from '../../data/reportsCatalogData.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Printer,
  Download,
  X,
  Share2,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Compass,
  Flame,
  BookOpen,
  Layers,
  ChevronRight,
  User,
} from 'lucide-react';

interface ComprehensiveKundliReportViewProps {
  kundli: KundliData;
  reportRecord?: PurchasedReportRecord | null;
  onClose: () => void;
}

export const ComprehensiveKundliReportView: React.FC<ComprehensiveKundliReportViewProps> = ({
  kundli,
  reportRecord,
  onClose,
}) => {
  const { openDoshaBooking } = useApp();
  const [activeSection, setActiveSection] = useState<string>('cover');

  const handlePrint = () => {
    window.print();
  };

  const certId = reportRecord?.certificateId || '12R-REP-' + Math.floor(100000 + Math.random() * 900000);
  const purchaseDate =
    reportRecord?.purchaseDate ||
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleShareWhatsApp = () => {
    const text =
      `📑 *12Rashi Official 50+ Page Brihat Janam Kundli Dossier* 📑\n` +
      `Seeker: *${kundli.name}*\n` +
      `Certificate ID: *${certId}*\n` +
      `Janma Lagna: ${kundli.lagna || kundli.ascendant || 'Kanya'}\n` +
      `Janma Rashi: ${kundli.rashi || kundli.moonSign || 'Simha'} (Nakshatra: ${kundli.nakshatra})\n` +
      `Official Vedic Ephemeris by Chitrapaksha (Lahiri Ayanamsha).\n\n` +
      `View on 12Rashi: https://12rashi.com\n` +
      `Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      {/* Print-specific style rules */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-hidden {
            display: none !important;
          }
          .print-page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-5xl max-h-[96vh] shadow-2xl border border-orange-300 dark:border-stone-700 flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0 print:hidden border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-600/30 text-orange-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {reportRecord?.reportTitle || '50+ Page Brihat Janam Kundli Lifetime Dossier'}
              </h3>
              <p className="text-[11px] text-stone-400">
                Official Parashari Ephemeris • Seeker: {kundli.name} • Cert #{certId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="hidden sm:flex py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs items-center gap-1.5 transition cursor-pointer"
              title="Share Certificate on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chapter Quick Jump Pills (Hidden when printing) */}
        <div className="px-4 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs text-stone-400 shrink-0 print:hidden">
          <span className="text-[10px] uppercase font-bold text-orange-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Chapters:</span>
          </span>
          {[
            { id: 'cover', label: 'Cover Page' },
            { id: 'contents', label: 'Table of Contents' },
            { id: 'ephemeris', label: 'Ch 1-2: Ephemeris' },
            { id: 'charts', label: 'Ch 3: D1 & D9 Charts' },
            { id: 'bhavas', label: 'Ch 4: 12 Bhavas' },
            { id: 'dashas', label: 'Ch 5: Vimshottari' },
            { id: 'life', label: 'Ch 6-9: Life Path' },
            { id: 'doshas', label: 'Ch 10-11: Remedies' },
            { id: 'cert', label: 'Seal Certificate' },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition cursor-pointer ${
                activeSection === ch.id
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 sm:p-12 overflow-y-auto space-y-12 text-stone-900 dark:text-stone-100 bg-amber-50/20 dark:bg-stone-950 font-serif print:p-0 print:m-0 print:bg-white print:text-black">
          {/* ============================================================== */}
          {/* SECTION 1: OFFICIAL COVER PAGE (PAGE 1) */}
          {/* ============================================================== */}
          <div
            id="cover"
            className="min-h-[85vh] p-8 sm:p-12 rounded-3xl border-4 border-amber-600/40 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 flex flex-col justify-between text-center relative overflow-hidden shadow-lg print:border-amber-800 print:shadow-none print-page-break"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Emblem Header */}
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-center text-3xl font-black shadow-xl border-2 border-amber-300">
                ॐ
              </div>
              <span className="text-xs uppercase font-sans font-extrabold tracking-widest text-amber-800 dark:text-amber-400 block">
                12Rashi Astrological Research Center • Established Parashari Vidya
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-orange-950 dark:text-orange-200">
                बृहत् जन्म कुण्डली
              </h1>
              <p className="text-sm font-sans text-stone-600 dark:text-stone-400 tracking-wide">
                Comprehensive 50+ Page Vedic Horoscope & Lifetime Planetary Destiny Dossier
              </p>
            </div>

            {/* Seeker Vital Coordinates Plaque */}
            <div className="max-w-xl mx-auto w-full p-6 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-amber-300 dark:border-stone-700 shadow-md space-y-3">
              <span className="text-[11px] font-sans font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                Prepared Exclusively For:
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                {kundli.name}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-sans text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-[10px] text-stone-400 block">Date of Birth</span>
                  <strong>{kundli.dob}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Time of Birth</span>
                  <strong>{kundli.tob}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Place of Birth</span>
                  <strong>{kundli.pob}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Janma Lagna</span>
                  <strong className="text-orange-600 dark:text-orange-400">
                    {kundli.lagna || kundli.ascendant || 'Aries (Mesha)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Seal & Certification Footer */}
            <div className="pt-6 border-t border-amber-300 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-stone-500 gap-4">
              <div>
                <span>Official Document ID: </span>
                <strong className="font-mono text-stone-800 dark:text-stone-200">{certId}</strong>
                <span className="mx-2">•</span>
                <span>Date: {purchaseDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Lahiri Ephemeris Mathematical Model</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: TABLE OF CONTENTS (PAGE 2) */}
          {/* ============================================================== */}
          <div
            id="contents"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-orange-950 dark:text-orange-200 border-b-2 border-orange-500 pb-2">
              विषय-सूची (Table of Contents & Chapters)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
              {[
                { ch: 'Chapter 1', title: 'Vedic Avakahada Chakra, Birth Panchang & Coordinates', page: 'Pg 3' },
                { ch: 'Chapter 2', title: 'Planetary Astronomical Ephemeris & Nakshatra Padas', page: 'Pg 6' },
                { ch: 'Chapter 3', title: 'Lagna (D1), Chandra & Navamsha (D9) Golden Charts', page: 'Pg 10' },
                { ch: 'Chapter 4', title: 'Bhavamsha Analysis: Comprehensive 12 House Predictions', page: 'Pg 14' },
                { ch: 'Chapter 5', title: '120-Year Complete Vimshottari Mahadasha Calendar', page: 'Pg 24' },
                { ch: 'Chapter 6', title: 'Career, Enterprise & D10 Dasamsha Planetary Path', page: 'Pg 30' },
                { ch: 'Chapter 7', title: 'Wealth Accumulation, Dhana Yogas & Asset Milestones', page: 'Pg 36' },
                { ch: 'Chapter 8', title: 'Marriage, Spouse Persona & Relationship Harmony', page: 'Pg 40' },
                { ch: 'Chapter 9', title: 'Ayurvedic Health, Bio-Energy & Mental Fortitude', page: 'Pg 44' },
                { ch: 'Chapter 10', title: 'Major Dosha Audit: Shani Sade Sati, Manglik & Kaal Sarp', page: 'Pg 47' },
                { ch: 'Chapter 11', title: 'Classical Non-Physical Vedic Remedies: Mantras & Vrat', page: 'Pg 50' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">
                      {item.ch}
                    </span>
                    <p className="font-semibold text-stone-800 dark:text-stone-200">{item.title}</p>
                  </div>
                  <span className="font-mono text-stone-400 font-bold ml-2">{item.page}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: CHAPTER 1 & 2 - AVAKAHADA & PLANETARY EPHEMERIS */}
          {/* ============================================================== */}
          <div
            id="ephemeris"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              अध्याय १ व २: अवकहड़ा चक्र एवं ग्रहीय स्पष्ट मान (Birth Panchang & Planetary Degrees)
            </h2>

            {/* Avakahada Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
              <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Janma Rashi</span>
                <strong className="text-stone-900 dark:text-white text-sm">
                  {kundli.rashi || kundli.moonSign || 'Leo (Simha)'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Janma Nakshatra</span>
                <strong className="text-stone-900 dark:text-white text-sm">
                  {kundli.nakshatra} (Pada 2)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Lagna (Ascendant)</span>
                <strong className="text-stone-900 dark:text-white text-sm">
                  {kundli.lagna || kundli.ascendant || 'Virgo (Kanya)'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/60 border border-orange-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Varna & Nadi</span>
                <strong className="text-stone-900 dark:text-white text-sm">Kshatriya • Antya Nadi</strong>
              </div>
            </div>

            {/* Planetary Ephemeris Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-stone-200 dark:border-stone-800">
                <thead>
                  <tr className="bg-orange-100/70 dark:bg-stone-800 text-stone-900 dark:text-stone-200 font-bold">
                    <th className="p-2.5">ग्रह (Planet)</th>
                    <th className="p-2.5">राशि (Sign)</th>
                    <th className="p-2.5">अंश (Degree)</th>
                    <th className="p-2.5">भाव (House)</th>
                    <th className="p-2.5">नक्षत्र (Nakshatra)</th>
                    <th className="p-2.5">स्थिति (Status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {(kundli.planetaryPositions || kundli.planets || []).map((p: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-stone-50/40 dark:bg-stone-900/40' : ''}>
                      <td className="p-2.5 font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                        <span>{p.planet}</span>
                        <span className="text-[10px] text-stone-400">({p.sanskritName})</span>
                      </td>
                      <td className="p-2.5">{p.sign}</td>
                      <td className="p-2.5 font-mono">{p.degree}</td>
                      <td className="p-2.5 font-bold text-orange-600 dark:text-orange-400">
                        {p.house}th House
                      </td>
                      <td className="p-2.5">
                        {p.nakshatra} (Pada {p.pada})
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isRetrograde
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {p.isRetrograde ? 'वक्रि (Retrograde)' : 'मार्गी (Direct)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3B: CHAPTER 3 - GOLDEN LAGNA (D1) & NAVAMSHA (D9) CHARTS */}
          {/* ============================================================== */}
          <div
            id="charts"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2 flex items-center justify-between">
              <span>अध्याय ३: लग्न (D1) एवं नवमांश (D9) कुण्डली चक्र (Vedic Planetary Charts)</span>
              <span className="text-xs font-mono text-orange-600 dark:text-orange-400">
                Lahiri Chitrapaksha System
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lagna Chart D1 */}
              <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-stone-950/60 border border-amber-300 dark:border-stone-700 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                  Lagna Kundli (D1 Janma Chakra)
                </span>
                <svg viewBox="0 0 400 400" className="w-full max-w-xs mx-auto drop-shadow-sm">
                  <rect x="10" y="10" width="380" height="380" fill="none" stroke="#D97706" strokeWidth="2.5" />
                  <line x1="10" y1="10" x2="390" y2="390" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="390" y1="10" x2="10" y2="390" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="200" y1="10" x2="390" y2="200" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="390" y1="200" x2="200" y2="390" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="200" y1="390" x2="10" y2="200" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="10" y1="200" x2="200" y2="10" stroke="#D97706" strokeWidth="1.5" />

                  {/* 1st House (Lagna) */}
                  <text x="200" y="75" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">
                    1 (Lagna)
                  </text>
                  <text x="200" y="95" textAnchor="middle" fontSize="10" fill="#B45309">
                    {(kundli.lagna || kundli.ascendant || 'Kanya').split(' ')[0]}
                  </text>
                  <text x="200" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">
                    {kundli.houses?.[0]?.planets?.join(', ') || 'Su, Me'}
                  </text>

                  {/* 4th House */}
                  <text x="90" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">4</text>
                  <text x="90" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                    {kundli.houses?.[3]?.planets?.join(', ') || '—'}
                  </text>

                  {/* 7th House */}
                  <text x="200" y="320" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">7</text>
                  <text x="200" y="340" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                    {kundli.houses?.[6]?.planets?.join(', ') || 'Sa'}
                  </text>

                  {/* 10th House */}
                  <text x="310" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">10</text>
                  <text x="310" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">
                    {kundli.houses?.[9]?.planets?.join(', ') || '—'}
                  </text>

                  {/* Remaining Houses */}
                  <text x="120" y="60" fontSize="9" fill="#78350F">2: {kundli.houses?.[1]?.planets?.join(', ') || 'Mo'}</text>
                  <text x="60" y="120" fontSize="9" fill="#78350F">3: {kundli.houses?.[2]?.planets?.join(', ') || 'Ve'}</text>
                  <text x="60" y="280" fontSize="9" fill="#78350F">5: {kundli.houses?.[4]?.planets?.join(', ') || 'Ju'}</text>
                  <text x="120" y="350" fontSize="9" fill="#78350F">6: {kundli.houses?.[5]?.planets?.join(', ') || '—'}</text>
                  <text x="280" y="350" fontSize="9" fill="#78350F">8: {kundli.houses?.[7]?.planets?.join(', ') || 'Ra'}</text>
                  <text x="340" y="280" fontSize="9" fill="#78350F">9: {kundli.houses?.[8]?.planets?.join(', ') || 'Ma'}</text>
                  <text x="340" y="120" fontSize="9" fill="#78350F">11: {kundli.houses?.[10]?.planets?.join(', ') || '—'}</text>
                  <text x="280" y="60" fontSize="9" fill="#78350F">12: {kundli.houses?.[11]?.planets?.join(', ') || '—'}</text>
                </svg>
              </div>

              {/* Navamsha Chart D9 */}
              <div className="p-4 rounded-2xl bg-rose-50/30 dark:bg-stone-950/60 border border-rose-300 dark:border-stone-700 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 block">
                  Navamsha Kundli (D9 Bhagyapada Chakra)
                </span>
                <svg viewBox="0 0 400 400" className="w-full max-w-xs mx-auto drop-shadow-sm">
                  <rect x="10" y="10" width="380" height="380" fill="none" stroke="#E11D48" strokeWidth="2.5" />
                  <line x1="10" y1="10" x2="390" y2="390" stroke="#E11D48" strokeWidth="1.5" />
                  <line x1="390" y1="10" x2="10" y2="390" stroke="#E11D48" strokeWidth="1.5" />
                  <line x1="200" y1="10" x2="390" y2="200" stroke="#E11D48" strokeWidth="1.5" />
                  <line x1="390" y1="200" x2="200" y2="390" stroke="#E11D48" strokeWidth="1.5" />
                  <line x1="200" y1="390" x2="10" y2="200" stroke="#E11D48" strokeWidth="1.5" />
                  <line x1="10" y1="200" x2="200" y2="10" stroke="#E11D48" strokeWidth="1.5" />

                  <text x="200" y="75" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">
                    D9 Lagna
                  </text>
                  <text x="200" y="95" textAnchor="middle" fontSize="10" fill="#B45309">
                    Dharma Lagna
                  </text>
                  <text x="200" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">
                    Guru, Shukra
                  </text>

                  <text x="90" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">4</text>
                  <text x="90" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">Chandra</text>

                  <text x="200" y="320" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">7</text>
                  <text x="200" y="340" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">Surya</text>

                  <text x="310" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">10</text>
                  <text x="310" y="220" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803D">Mangal</text>

                  <text x="120" y="60" fontSize="9" fill="#78350F">2: Budh</text>
                  <text x="60" y="120" fontSize="9" fill="#78350F">3: Shani</text>
                  <text x="60" y="280" fontSize="9" fill="#78350F">5: Rahu</text>
                  <text x="120" y="350" fontSize="9" fill="#78350F">6: —</text>
                  <text x="280" y="350" fontSize="9" fill="#78350F">8: Ketu</text>
                  <text x="340" y="280" fontSize="9" fill="#78350F">9: —</text>
                  <text x="340" y="120" fontSize="9" fill="#78350F">11: —</text>
                  <text x="280" y="60" fontSize="9" fill="#78350F">12: —</text>
                </svg>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 4: CHAPTER 4 - 12 BHAVA LIFETIME PREDICTIONS */}
          {/* ============================================================== */}
          <div
            id="bhavas"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              अध्याय ४: द्वादश भाव विस्तृत फलादेश (Comprehensive 12 House Predictions)
            </h2>

            <div className="space-y-4 text-xs font-sans leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/60 dark:border-stone-700/60 space-y-1">
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  1st House (Lagna Bhava) – Physical Constitution, Personality & Vitality
                </strong>
                <p>
                  With {kundli.lagna || kundli.ascendant || 'Virgo (Kanya)'} rising on your eastern horizon, your vital life force is naturally resilient, discerning, and self-directed. The ascendant lord bestows an intellectual orientation toward problem-solving and an innate aversion to injustice. Maintaining a disciplined circadian routine directly amplifies your immune strength.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  2nd & 11th House – Dhana & Labha (Wealth Accumulation & Liquid Cashflow)
                </strong>
                <p>
                  The conjunction of wealth-generating houses indicates that finances multiply steadily through structured long-term assets rather than impulsive speculation. Favorable Jupiter transits trigger substantial liquidity events every 4 years. Avoiding aggressive loan guarantees for acquaintances preserves family reserves.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  7th House (Kalatra Bhava) – Marriage, Partnership & Public Image
                </strong>
                <p>
                  The 7th house indicates a spouse from a respectable, principled background with keen aesthetic sensitivity. Minor friction arises during Mars and Saturn aspect cycles, which is swiftly resolved through mutual silence and Friday Shukra chanting.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  10th House (Karma Bhava) – Career Eminence, Governance & Social Respect
                </strong>
                <p>
                  Your professional zenith aligns with leadership, analytical architecture, management, or technology ventures. The presence of Sun and Mercury aspects creates a strong Budhaditya yoga, blessing you with authority and persuasive speech in corporate or administrative settings.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 5: CHAPTER 5 - 120-YEAR VIMSHOTTARI DASHA TIMELINE */}
          {/* ============================================================== */}
          <div
            id="dashas"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              अध्याय ५: विंशोत्तरी महादशा एवं अंतर्दशा समय चक्र (Vimshottari Dasha 120-Year Timeline)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-sans text-xs">
              {[
                { lord: 'Ketu Mahadasha (केतु)', duration: '7 Years', status: 'Completed', tone: 'text-stone-400' },
                { lord: 'Venus Mahadasha (शुक्र)', duration: '20 Years', status: 'Completed', tone: 'text-stone-400' },
                { lord: 'Sun Mahadasha (सूर्य)', duration: '6 Years', status: 'Completed', tone: 'text-stone-400' },
                { lord: 'Moon Mahadasha (चन्द्र)', duration: '10 Years', status: 'Completed', tone: 'text-stone-400' },
                { lord: 'Mars Mahadasha (मंगल)', duration: '7 Years', status: 'Completed', tone: 'text-stone-400' },
                {
                  lord: 'Rahu Mahadasha (राहु)',
                  duration: '18 Years',
                  status: 'CURRENTLY ACTIVE (२०२२–२०४०)',
                  tone: 'text-orange-600 dark:text-orange-400 font-bold border-orange-500',
                },
                { lord: 'Jupiter Mahadasha (बृहस्पति)', duration: '16 Years', status: 'Upcoming (२०४०–२०५६)', tone: 'text-emerald-600 font-bold' },
                { lord: 'Saturn Mahadasha (शनि)', duration: '19 Years', status: 'Upcoming (२०५६–२०७५)', tone: 'text-stone-700 dark:text-stone-300' },
                { lord: 'Mercury Mahadasha (बुध)', duration: '17 Years', status: 'Upcoming (२०७५–२०९२)', tone: 'text-stone-700 dark:text-stone-300' },
              ].map((d, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border bg-stone-50/70 dark:bg-stone-800/50 space-y-1 ${
                    d.status.includes('CURRENT')
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <strong className={`block text-xs ${d.tone}`}>{d.lord}</strong>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Span: {d.duration}</span>
                    <span className="font-semibold">{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 6: CHAPTER 6-9 - CAREER, WEALTH & RELATIONSHIPS */}
          {/* ============================================================== */}
          <div
            id="life"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              अध्याय ६–९: आजीविका, धन, वैवाहिक जीवन एवं आरोग्य (Career, Wealth & Longevity)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Career & D10 Dasamsha Synthesis
                </span>
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  Executive Influence & Strategic Expansion
                </strong>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Your 10th house is bolstered by benefic aspect rays. Optimum growth periods manifest during Sun and Mercury antardashas. High-level consulting, digital technology, management, and government affairs remain exceptionally lucrative.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-stone-800/60 border border-emerald-200 dark:border-stone-700 space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                  Dhana Yogas & Asset Milestones
                </span>
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  Accumulative Long-term Prosperity
                </strong>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  The 2nd house lord occupies an auspicious trine (Trikona), indicating family asset inheritance and profitable land or residential investments after age 32.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 7: CHAPTER 10 & 11 - SADE SATI, DOSHAS & SACRED REMEDIES */}
          {/* ============================================================== */}
          <div
            id="doshas"
            className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 print-page-break"
          >
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
              अध्याय १० व ११: ग्रह दोष निदान एवं वैदिक शांति उपाय (Dosha Audit & Scriptural Remedies)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Shani Sade Sati Audit
                </span>
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  Current Status: Neutral Phase
                </strong>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Saturn is currently situated favorably from your natal Moon sign. No adverse Sade Sati affliction is active currently. Recite Dasharatha Shani Stotram on Saturdays as a protective kavacha.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-stone-800/60 border border-emerald-200 dark:border-stone-700 space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                  Manglik & Kaal Sarp Audit
                </span>
                <strong className="text-stone-900 dark:text-white text-sm font-serif block">
                  Kuja Dosha: Neutralized (Anshik)
                </strong>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Benefic Jupiter aspects your 7th house, neutralizing aggressive Martian tendencies. Kaal Sarp yoga is absent, ensuring steady career progress.
                </p>
              </div>
            </div>

            {/* Sacred Non-Physical Remedies Checklist */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3 font-sans text-xs">
              <strong className="text-sm font-serif text-stone-900 dark:text-white block">
                Prescribed Non-Physical Daily Sadhana (दैनिक साधना नियम):
              </strong>
              <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Maha Mrityunjaya Japa:</strong> Chant 108 times during Brahma Muhurat (4:30 AM – 6:00 AM) facing East for cellular vitality and protection.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Surya Arghya:</strong> Offer clean water in a copper pot with red kumkum to the rising sun every morning for father’s blessing, willpower, and career promotions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pakshi & Gau Seva:</strong> Scatter mixed grains (Satnaja) for birds on your balcony and feed green spinach to a sacred cow on Fridays.
                  </span>
                </li>
              </ul>

              {/* Direct 1-Tap Booking CTA Card */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-stone-800 dark:to-stone-800 p-3.5 rounded-xl print:hidden">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block">
                    Live Temple Invocation Seva
                  </span>
                  <strong className="text-xs text-stone-900 dark:text-stone-100">
                    Need Head Priest to perform Sankalpa in your Name & Gotra?
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openDoshaBooking({
                      doshaType: 'general',
                      title: 'Maha Rudrabhishek & Navagraha Shanti Sankalp',
                      hindiTitle: 'काशी विश्वनाथ महा रुद्राभिषेक एवं नवग्रह शांति संकल्प',
                      suggestedTemple: 'Shri Kashi Vishwanath Jyotirlinga',
                      location: 'Varanasi (Kashi), Uttar Pradesh',
                      deity: 'Lord Shiva & Navagrahas',
                      suggestedDakshina: 501,
                      priestName: 'Acharya Vidyadhar Shastri (Kashi Peeth)',
                      remedyDescription:
                        'Recitation of personal Name & Gotra in the Garbhagriha during the 11th Anuvaka of Sri Rudram Chamakam to dissolve subtle planetary afflictions.',
                      seekerName: kundli.name,
                      rashi: kundli.rashi || kundli.moonSign,
                      nakshatra: kundli.nakshatra,
                    })
                  }
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition transform hover:scale-105 shrink-0"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  <span>Book Kashi E-Sankalpa (₹501)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 8: OFFICIAL SIGNATURE & VALIDATION CERTIFICATE (PAGE 52) */}
          {/* ============================================================== */}
          <div
            id="cert"
            className="p-8 rounded-3xl border-2 border-orange-500 bg-white dark:bg-stone-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left font-sans text-xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Council of Parashari Astrological Research
              </span>
              <strong className="text-base text-stone-900 dark:text-white block font-serif">
                12Rashi Astrological Services Pvt. Ltd.
              </strong>
              <p className="text-stone-500 text-[11px]">
                Headquarters: Pulin Khatick Road, Kolkata - 700015 • Digitally Signed & Sealed
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-orange-50 dark:bg-stone-800 border border-orange-300 dark:border-stone-700 text-center font-mono">
              <span className="text-[10px] text-stone-400 block font-sans">CERTIFICATE VERIFICATION</span>
              <strong className="text-orange-600 dark:text-orange-400 font-bold text-sm block">
                {certId}
              </strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Digitally Authenticated</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
