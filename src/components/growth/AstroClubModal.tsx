import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MEMBERSHIP_TIERS } from '../../data/lentloFeaturesData.ts';
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  FileText,
  Star,
} from 'lucide-react';

import { createCashfreeOrder, openCashfreeCheckout, verifyCashfreePayment } from '../../services/apiService.ts';

export const AstroClubModal: React.FC = () => {
  const {
    openMembershipModal,
    setOpenMembershipModal,
    membershipTier,
    setMembershipTier,
    walletBalance,
    deductWallet,
    setOpenPaymentModal,
    addNotification,
    userProfile,
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<string>('club_gold');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [statusText, setStatusText] = useState('');

  if (!openMembershipModal) return null;

  const currentPlan = MEMBERSHIP_TIERS.find((t) => t.id === selectedTier) || MEMBERSHIP_TIERS[1];

  const handleSubscribeViaCashfree = async () => {
    setIsSubscribing(true);
    setStatusText('Creating Cashfree VIP Subscription Order...');
    try {
      const orderRes = await createCashfreeOrder({
        amount: currentPlan.price,
        customerName: userProfile.name || 'Vasu Sharma',
        customerEmail: userProfile.email || '12rashi.com@gmail.com',
        customerPhone: userProfile.phone || '9831039814',
        orderNote: `12Rashi VIP Club Subscription: ${currentPlan.name}`,
      });

      if (!orderRes.success || !orderRes.payment_session_id) {
        throw new Error(orderRes.error || 'Failed to initialize Cashfree session');
      }

      setStatusText('Opening Cashfree Checkout...');
      const checkoutRes = await openCashfreeCheckout(orderRes.payment_session_id);

      const verifyRes = await verifyCashfreePayment(orderRes.order_id!);
      if (verifyRes.isPaid || checkoutRes.success) {
        const tierKey = currentPlan.id === 'club_platinum' ? 'platinum' : currentPlan.id === 'club_gold' ? 'gold' : 'silver';
        setMembershipTier(tierKey);
        addNotification(
          'VIP Club Activated via Cashfree!',
          `Welcome to ${currentPlan.name}! ${currentPlan.includedMinutes} minutes added with ${currentPlan.queuePriority}.`,
          'discount'
        );
        setIsSubscribing(false);
        setStatusText('');
        setOpenMembershipModal(false);
        return;
      }
      setIsSubscribing(false);
      setStatusText('');
    } catch (err: any) {
      console.error('Cashfree VIP error:', err);
      // Fallback
      setIsSubscribing(false);
      setStatusText('');
    }
  };

  const handleSubscribeWallet = () => {
    if (walletBalance < currentPlan.price) {
      setOpenPaymentModal(true);
      return;
    }

    setIsSubscribing(true);
    deductWallet(currentPlan.price, `Astro Club: ${currentPlan.name}`);
    setTimeout(() => {
      setIsSubscribing(false);
      const tierKey = currentPlan.id === 'club_platinum' ? 'platinum' : currentPlan.id === 'club_gold' ? 'gold' : 'silver';
      setMembershipTier(tierKey);
      addNotification(
        'Astro Club Membership Activated!',
        `Welcome to ${currentPlan.name}! ${currentPlan.includedMinutes} minutes added to your account with ${currentPlan.queuePriority}.`,
        'discount'
      );
      setOpenMembershipModal(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-amber-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <Crown className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">Astro Club VIP Memberships</h3>
              <p className="text-[11px] text-amber-100">
                Lentlo Recurring Subscription • Bundled Minutes • Fast-Track Queue Priority
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenMembershipModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 dark:text-stone-300">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Predictable Guidance for Spiritual Peace of Mind
            </h4>
            <p className="text-stone-500 text-xs">
              Never worry about per-minute top-ups. Enjoy guaranteed monthly consultation minutes, queue-jumping privileges, and comprehensive annual charts.
            </p>
          </div>

          {/* Membership Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MEMBERSHIP_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 shadow-md'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-xs">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{tier.name}</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-serif font-bold text-2xl text-orange-600 dark:text-orange-400">
                        ₹{tier.price}
                      </span>
                      <span className="text-stone-400 text-[11px]">/month</span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2 text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{tier.includedMinutes} Consultation Mins</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{tier.queuePriority}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                        <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{tier.freeReport}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      className={`w-full py-1.5 rounded-xl font-bold text-xs transition ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefit Highlights */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Unused minutes carry forward up to 90 days</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Cancel or pause anytime with 1 click</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>10% extra discount on AstroStore remedies</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Wallet Balance: ₹{walletBalance}</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                Plan Charge: <span className="text-orange-600">₹{currentPlan.price}/month</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSubscribeViaCashfree}
                disabled={isSubscribing}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Crown className="w-4 h-4 text-amber-200" />
                <span>
                  {isSubscribing && statusText ? statusText : `Pay ₹${currentPlan.price} via Cashfree PG`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSubscribeWallet}
                disabled={isSubscribing}
                className="py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Deduct from Wallet (₹{walletBalance})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
