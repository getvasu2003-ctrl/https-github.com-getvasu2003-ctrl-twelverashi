import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Lock,
  Receipt,
  FileCheck,
} from 'lucide-react';

export const FairBillingModal: React.FC = () => {
  const { openFairBillingModal, setOpenFairBillingModal } = useApp();

  if (!openFairBillingModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-orange-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Fair-Billing Guarantee™</h3>
              <p className="text-[11px] text-amber-100">Transparent per-second metering & 1st-minute auto refund</p>
            </div>
          </div>

          <button
            onClick={() => setOpenFairBillingModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300">
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Billing complaints and surprise deductions are the most common complaint in the online astrology industry. <strong>12Rashi</strong> operates under a legally backed, transparent per-second billing system:
          </p>

          {/* Core Guarantees Grid */}
          <div className="space-y-3">
            {/* 1. 1st Minute Auto-Drop Protection */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>1. First-Minute Auto-Drop Protection</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                If your call drops or connection fails within the first 60 seconds for any reason, <strong>100% of the session amount is refunded automatically to your wallet</strong>. No support ticket or dispute needed.
              </p>
            </div>

            {/* 2. Strict Per-Second Billing */}
            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 space-y-1">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 font-bold text-xs">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>2. True Per-Second Metering (No Rounding Up)</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                Other apps round up 61 seconds into 2 whole minutes. On 12Rashi, if you talk for 4 minutes and 12 seconds, you are debited strictly for 252 seconds at ₹0.42/sec.
              </p>
            </div>

            {/* 3. Low-Balance Grace Warning */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>3. 2-Minute Grace Alert & In-Call Recharge</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                You receive a gentle warning when 2 minutes of balance remains. You can top up your wallet via UPI with 1-tap without disconnecting the ongoing session.
              </p>
            </div>

            {/* 4. GST Tax Invoices on WhatsApp */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs">
                <Receipt className="w-4 h-4 text-orange-600" />
                <span>4. Verified WhatsApp Receipt & GST Invoice</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                Every consultation generates a tax invoice sent directly to your WhatsApp with duration breakdown, astrologer credentials, and prescribed remedies.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenFairBillingModal(false)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer hover:from-orange-600 hover:to-amber-600"
          >
            Understood & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
