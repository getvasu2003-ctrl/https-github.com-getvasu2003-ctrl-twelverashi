import React, { useState } from 'react';
import { QR_STANDEE_TEMPLATES } from '../../data/lentloFeaturesData.ts';
import {
  X,
  QrCode,
  MapPin,
  Flame,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface QrStandeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrStandeeModal: React.FC<QrStandeeModalProps> = ({ isOpen, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState(QR_STANDEE_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = `https://12rashi.com/scan?ref=${selectedLocation.locationId}&offer=5min_free`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20">
              <QrCode className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Offline-to-Online QR Standees</h3>
              <p className="text-[11px] text-amber-100">Lentlo Location-Tracked Temple & Event QR Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
            Deploy tracked QR standees in partnered temples, gemstone stores, and cultural festivals. When visitors scan, they immediately get a <strong>5-minute free consultation</strong>, and your dashboard attributes the lifetime revenue to that location.
          </p>

          {/* Location Picker */}
          <div>
            <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wide text-[11px]">
              Select Partner Location
            </label>
            <div className="space-y-1.5">
              {QR_STANDEE_TEMPLATES.map((loc) => (
                <div
                  key={loc.locationId}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedLocation.locationId === loc.locationId
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 ring-1 ring-orange-500'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">{loc.locationName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">ID: {loc.locationId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-orange-600 block">{loc.scansCount} Scans</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{loc.conversionsCount} Users</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Standee Mockup / Print Preview */}
          <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-dashed border-orange-400/50 flex flex-col items-center text-center space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider">
              {selectedLocation.freeOffer}
            </span>

            {/* Generated QR Code Graphic */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-stone-200">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <rect width="100" height="100" fill="white" />
                {/* Simulated high-fidelity QR modules */}
                <rect x="10" y="10" width="25" height="25" fill="#ea580c" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#ea580c" />

                <rect x="65" y="10" width="25" height="25" fill="#ea580c" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#ea580c" />

                <rect x="10" y="65" width="25" height="25" fill="#ea580c" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#ea580c" />

                {/* Decorative data pixels */}
                <circle cx="50" cy="50" r="10" fill="#f59e0b" />
                <rect x="42" y="12" width="6" height="6" fill="#ea580c" />
                <rect x="52" y="18" width="6" height="6" fill="#ea580c" />
                <rect x="40" y="75" width="8" height="8" fill="#ea580c" />
                <rect x="70" y="55" width="7" height="7" fill="#ea580c" />
                <rect x="80" y="75" width="8" height="8" fill="#ea580c" />
              </svg>
            </div>

            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {selectedLocation.locationName}
              </h4>
              <p className="text-[11px] text-stone-500 font-mono">
                {currentUrl}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-stone-50"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Copy Tracked URL'}</span>
            </button>

            <button
              onClick={() => alert(`Standee design printable PDF dispatched for ${selectedLocation.locationName}. Ready for A4 / A5 acrylic standee printing.`)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Standee Flyer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
