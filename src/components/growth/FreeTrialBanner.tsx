import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { useTranslation } from '../../i18n/useTranslation.ts';
import { Sparkles, Gift, PhoneCall, ShieldCheck, Check, Clock } from 'lucide-react';

export const FreeTrialBanner: React.FC = () => {
  const { hasClaimedFreeTrial, astrologers, startConsultation, setOpenFairBillingModal } = useApp();
  const { t } = useTranslation();

  if (hasClaimedFreeTrial) return null;

  const onlineAstro = astrologers.find((a) => a.status === 'online') || astrologers[0];

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200 flex items-center justify-center shrink-0 shadow-inner">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-orange-700 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
                {t('trial_badge')}
              </span>
              <span className="text-amber-100 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-200" />
                {t('trial_no_recharge')}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-serif tracking-tight mt-0.5">
              {t('trial_title')}
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed max-w-xl">
              {t('trial_desc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-center">
          <button
            onClick={() => setOpenFairBillingModal(true)}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span>{t('trial_fair_billing')}</span>
          </button>

          {onlineAstro && (
            <button
              onClick={() => startConsultation(onlineAstro, 'audio')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition transform hover:scale-105 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-orange-600" />
              <span>{t('trial_cta')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
