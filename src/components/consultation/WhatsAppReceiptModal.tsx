import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Share2,
  CheckCheck,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  Download,
} from 'lucide-react';

export const WhatsAppReceiptModal: React.FC = () => {
  const {
    openWhatsAppReceiptModal,
    setOpenWhatsAppReceiptModal,
    selectedReceiptRecord,
    userProfile,
    walletBalance,
    setOpenPaymentModal,
  } = useApp();

  if (!openWhatsAppReceiptModal || !selectedReceiptRecord) return null;

  const r = selectedReceiptRecord;
  const mins = Math.floor(r.durationSeconds / 60);
  const secs = r.durationSeconds % 60;
  const gstAmount = +(r.cost * 0.18).toFixed(2);
  const totalWithTax = r.cost;

  const handleShareToWhatsApp = () => {
    const text = `📜 *12Rashi Verified Consultation Receipt*\n👤 Astrologer: ${r.astrologerName}\n⏱️ Duration: ${mins}m ${secs}s (Metered @ ₹${r.perSecondRate.toFixed(2)}/sec)\n💰 Amount: ₹${r.cost} (Incl. 18% GST)\n💼 Remaining Balance: ₹${walletBalance}\n\n✨ *Prescribed Remedy:* ${r.prescribedRemedies?.[0]?.title || 'Recite Gayatri Mantra'}\n\nRecharge or Consult Again: https://12rashi.com\nHelpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#EFEAE2] dark:bg-stone-900 rounded-3xl w-full max-w-md shadow-2xl border border-emerald-500/40 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* WhatsApp Verified Business Header */}
        <div className="p-3.5 bg-[#008069] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-[#008069] font-bold flex items-center justify-center text-sm shadow-xs">
              12
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-sm leading-none">
                <span>12Rashi Official Verified</span>
                <span className="text-white text-xs" title="Meta Verified Business">
                  ✓
                </span>
              </div>
              <span className="text-[11px] text-emerald-100 font-mono">+91 9831039814 • Business Account</span>
            </div>
          </div>

          <button
            onClick={() => setOpenWhatsAppReceiptModal(false)}
            className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Area */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-none bg-[size:16px_16px]">
          <div className="text-center">
            <span className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-stone-800 text-stone-500 text-[10px] shadow-xs">
              {r.date} • End-to-end encrypted
            </span>
          </div>

          {/* Official WhatsApp Message Bubble */}
          <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-md space-y-2.5 max-w-[92%] border border-stone-200/80 dark:border-stone-700">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
              <span className="font-bold text-xs text-[#008069] dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>CONSULTATION RECEIPT & TAX INVOICE</span>
              </span>
              <span className="font-mono text-[10px] text-stone-400">#RSH-{r.id.slice(-6).toUpperCase()}</span>
            </div>

            <p className="text-xs leading-relaxed">
              Namaste <strong>{userProfile.name}</strong>, thank you for seeking spiritual guidance on <strong>12Rashi</strong>. Your session details are below:
            </p>

            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-500">Astrologer:</span>
                <span className="font-bold">{r.astrologerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Type:</span>
                <span className="uppercase font-bold">{r.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Duration:</span>
                <span className="font-bold">{mins} min {secs} sec ({r.durationSeconds}s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Billing Rate:</span>
                <span>₹{r.perSecondRate.toFixed(2)}/sec</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200 dark:border-stone-700 font-bold text-xs">
                <span>Total Deducted:</span>
                <span className="text-orange-600 dark:text-orange-400">₹{r.cost}</span>
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Remaining Balance:</span>
                <span>₹{walletBalance}</span>
              </div>
            </div>

            {/* Fair-Billing Guarantee note if refunded */}
            {r.refunded && (
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                🛡️ {r.refundReason}
              </div>
            )}

            {/* Prescribed Remedy in WhatsApp message */}
            {r.prescribedRemedies?.[0] && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 text-[11px] block">
                  ✨ Prescribed Astro Remedy:
                </span>
                <p className="text-[11px] font-medium">{r.prescribedRemedies[0].title}</p>
                {r.prescribedRemedies[0].mantra && (
                  <p className="text-[11px] font-mono text-orange-600">{r.prescribedRemedies[0].mantra}</p>
                )}
              </div>
            )}

            {/* Low Balance 1-Tap UPI Trigger */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setOpenWhatsAppReceiptModal(false);
                  setOpenPaymentModal(true);
                }}
                className="w-full py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <span>⚡ 1-Tap UPI Wallet Recharge</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 pt-1">
              <span>Delivered</span>
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          <button
            onClick={handleShareToWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via WhatsApp</span>
          </button>

          <button
            onClick={() => setOpenWhatsAppReceiptModal(false)}
            className="py-2 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
