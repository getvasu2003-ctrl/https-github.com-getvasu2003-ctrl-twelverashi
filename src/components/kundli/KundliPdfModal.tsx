import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Compass,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const KundliPdfModal: React.FC = () => {
  const { currentKundli, openKundliPdfModal, setOpenKundliPdfModal } = useApp();

  if (!openKundliPdfModal || !currentKundli) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl max-h-[94vh] shadow-2xl border border-orange-300 dark:border-stone-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0 print:hidden border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-600/30 text-orange-400">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Vedic Janam Kundli Report – Print / PDF Export
              </h3>
              <p className="text-[11px] text-stone-400">
                AstroSage / AstroTalk Production Format with Lagna, Navamsha, Dasha & Remedies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={() => setOpenKundliPdfModal(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-950 font-serif print:p-0 print:m-0 print:bg-white print:text-black">
          {/* Document Header with Official Seal */}
          <div className="border-b-2 border-orange-600 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-serif text-2xl font-black shadow-md border-2 border-amber-300">
                12R
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-orange-950 dark:text-orange-400 font-serif">
                  12Rashi Astrological Services
                </h1>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                  Vedic Horoscope & Ephemeris Center • Kolkata Headquarters
                </p>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mt-0.5 font-sans">
                  <span>Helpline: +91 9831049814</span>
                  <span>•</span>
                  <span>Certificate ID: 12R-KUN-{Date.now().toString(36).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right font-sans">
              <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 font-bold text-xs uppercase tracking-wider inline-block">
                Authentic Vedic Janam Kundli
              </span>
              <p className="text-[10px] text-stone-500 mt-1">Parashari & Lahiri Ayanamsha (Chitra Paksha)</p>
            </div>
          </div>

          {/* Seeker Vital Biodata & Avakahada Coordinates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs bg-orange-50/50 dark:bg-stone-900/60 p-4 rounded-2xl border border-orange-200 dark:border-stone-800">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Seeker Name:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{currentKundli.name}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Birth Date & Time:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{currentKundli.dob} • {currentKundli.tob}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Place of Birth:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{currentKundli.pob}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Gender:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{currentKundli.gender}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Lagna (Ascendant):</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{currentKundli.ascendant} ({currentKundli.ascendantLord})</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Moon Sign (Rashi):</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{currentKundli.moonSign}</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Janma Nakshatra:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{currentKundli.nakshatra} ({currentKundli.nakshatraLord})</span>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Current Mahadasha:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{currentKundli.vimshottariDasha.mahadasha} Mahadasha</span>
            </div>
          </div>

          {/* Kundli Charts Grid (Lagna D1 & Navamsha D9) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {/* Lagna Chart (D1) */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5">
                <span className="font-bold text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400">
                  Lagna Chart (D1) – Ascendant & Houses
                </span>
                <span className="text-[10px] text-stone-400">Main Life Foundation</span>
              </div>

              <div className="aspect-square max-w-[280px] mx-auto p-2 bg-orange-50/30 dark:bg-stone-950 rounded-xl border border-orange-300 dark:border-stone-700 relative flex items-center justify-center">
                {/* Traditional Vedic Diamond Layout representation */}
                <div className="w-full h-full border border-orange-400 relative">
                  {/* Central diagonal cross */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border-t border-b border-orange-400/40 rotate-45" />
                  </div>
                  {/* House 1: Lagna */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 block">1 (Lagna)</span>
                    <span className="text-[11px] font-mono font-bold text-stone-900 dark:text-stone-100">{currentKundli.ascendant}</span>
                  </div>
                  {/* House 4: Sukha */}
                  <div className="absolute top-1/2 left-2 -translate-y-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 4</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Moon/Rahu</span>
                  </div>
                  {/* House 7: Kalatra (Marriage) */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 7</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Venus</span>
                  </div>
                  {/* House 10: Karma */}
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 10</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Sun/Merc</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] uppercase tracking-widest text-orange-500/50 font-bold">12RASHI D1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navamsha Chart (D9) */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5">
                <span className="font-bold text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  Navamsha Chart (D9) – Destiny & Marriage
                </span>
                <span className="text-[10px] text-stone-400">Spiritual Maturity</span>
              </div>

              <div className="aspect-square max-w-[280px] mx-auto p-2 bg-amber-50/30 dark:bg-stone-950 rounded-xl border border-amber-300 dark:border-stone-700 relative flex items-center justify-center">
                <div className="w-full h-full border border-amber-400 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border-t border-b border-amber-400/40 rotate-45" />
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">1 (Navamsha)</span>
                    <span className="text-[11px] font-mono font-bold text-stone-900 dark:text-stone-100">{currentKundli.moonSign}</span>
                  </div>
                  <div className="absolute top-1/2 left-2 -translate-y-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 4</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Jupiter</span>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 7</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Mars</span>
                  </div>
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 text-center">
                    <span className="text-[10px] font-bold text-stone-500 block">House 10</span>
                    <span className="text-[10px] font-mono text-stone-800 dark:text-stone-200">Saturn</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] uppercase tracking-widest text-amber-500/50 font-bold">12RASHI D9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Planetary Coordinates Table */}
          <div className="font-sans space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wide text-stone-900 dark:text-stone-100">
              Graha Spashta (Planetary Degrees & Dignities)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Planet</th>
                    <th className="p-2.5">Degree</th>
                    <th className="p-2.5">Sign (Rashi)</th>
                    <th className="p-2.5">House</th>
                    <th className="p-2.5">Nakshatra</th>
                    <th className="p-2.5">Dignity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {currentKundli.planets.map((p) => (
                    <tr key={p.planet} className="hover:bg-stone-50 dark:hover:bg-stone-900">
                      <td className="p-2.5 font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>{p.planet}</span>
                        {p.isRetrograde && (
                          <span className="px-1 text-[9px] bg-red-100 text-red-700 font-bold rounded">R</span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono">{p.degree}</td>
                      <td className="p-2.5">{p.sign}</td>
                      <td className="p-2.5 font-semibold">House {p.house}</td>
                      <td className="p-2.5">{p.nakshatra} ({p.pada})</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.dignity === 'Exalted' || p.dignity === 'Own Sign'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : p.dignity === 'Debilitated' || p.dignity === 'Enemy'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}
                        >
                          {p.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Vedic Remedies & Astrological Prescription */}
          <div className="font-sans p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wide text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Personalized Jyotish Remedies & Energized Items</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Recommended Gemstone:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Govt. Lab Certified Yellow Sapphire</span>
                <p className="text-[11px] text-stone-500 mt-1">Strengthens Jupiter (Guru) for wisdom, wealth and career growth.</p>
              </div>

              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Energized Rudraksha:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">5-Mukhi Nepali Rudraksha Bead</span>
                <p className="text-[11px] text-stone-500 mt-1">Pacifies planetary malefic doshas and brings mental tranquility.</p>
              </div>

              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Sacred Vedic Beej Mantra:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">ॐ बृं बृहस्पतये नमः</span>
                <p className="text-[11px] text-stone-500 mt-1">Recite 108 times daily facing East during Brahma Muhurat.</p>
              </div>
            </div>
          </div>

          {/* Official Verification Stamp, Signature & First Call Voucher */}
          <div className="border-t-2 border-stone-200 dark:border-stone-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-dashed border-stone-400 flex items-center justify-center text-center p-1 bg-stone-50 dark:bg-stone-900">
                <span className="text-[9px] font-mono text-stone-500 font-bold uppercase">12RASHI OFFICIAL SEAL</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Verified by 12Rashi Astrological Council</span>
                <span className="text-[11px] text-stone-500">Chief Astrologer: Pt. Vasudev Shastri (Kolkata)</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">TRAI DLT Header: TWRSHI • Entity: 12RASHIINFOTECH</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 dark:bg-stone-900 border border-orange-300 dark:border-stone-700 text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-orange-600 block">New Seeker Consultation Voucher</span>
              <span className="font-mono font-black text-stone-900 dark:text-stone-100 text-sm">KUNDLI100</span>
              <p className="text-[10px] text-stone-500">Use on 12rashi.com for ₹100 Off any Acharya Call</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs px-6 shrink-0 print:hidden">
          <span className="text-stone-500 text-[11px]">
            Tip: Select "Save as PDF" in your system print destination.
          </span>
          <button
            onClick={() => setOpenKundliPdfModal(false)}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
