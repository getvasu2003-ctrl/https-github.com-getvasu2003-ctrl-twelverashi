import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShubhShagunVoucher } from '../../types/astrology.ts';
import { audioSynthesis } from '../../services/audioSynthesisService.ts';
import {
  Gift,
  Sparkles,
  Share2,
  CheckCircle2,
  Heart,
  Send,
  ShieldCheck,
  Copy,
  Check,
  Award,
  Flame,
  ArrowRight,
  Wallet,
} from 'lucide-react';

interface ShubhShagunGiftCardsProps {
  onRedeemSuccess?: () => void;
}

const SHAGUN_DENOMINATIONS = [
  { amount: 101, label: '₹101 Shagun', subtitle: 'Micro Voice Consultation' },
  { amount: 251, label: '₹251 Shagun', subtitle: '10-Min Astrologer Session' },
  { amount: 501, label: '₹501 Shagun', subtitle: 'Vivah Milan / Dosha Shanti' },
  { amount: 1100, label: '₹1,100 Shagun', subtitle: '50+ Pg Kundli Dossier + Call' },
  { amount: 2100, label: '₹2,100 Shagun', subtitle: 'Maha Family Protection Pack' },
];

const OCCASIONS = [
  { id: 'birthday', label: '🎂 Birthday', title: 'Happy Birthday Blessings (जन्मदिन शगुन)' },
  { id: 'wedding', label: '💍 Wedding / Milan', title: 'Vivah & Milan Blessings (विवाह शगुन)' },
  { id: 'baby', label: '👶 New Baby', title: 'Namkaran & Baby Kundli (शिशु जन्म शगुन)' },
  { id: 'festival', label: '🪔 Diwali / Festive', title: 'Shubh Deepavali & Parva (पर्व शगुन)' },
  { id: 'career', label: '💼 Career Leap', title: 'New Job & Business Launch (कार्य सिद्धि शगुन)' },
  { id: 'general', label: '🌟 Divine Blessings', title: 'Sarva Mangal Shagun (सर्वमंगल आशीर्वाद)' },
];

export const ShubhShagunGiftCards: React.FC<ShubhShagunGiftCardsProps> = ({ onRedeemSuccess }) => {
  const {
    walletBalance,
    deductWallet,
    rechargeWallet,
    setOpenPaymentModal,
    addNotification,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buy' | 'redeem'>('buy');

  // Purchase Form
  const [selectedAmount, setSelectedAmount] = useState<number>(251);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('birthday');
  const [senderName, setSenderName] = useState(user?.name || 'Vasudev Sharma');
  const [recipientName, setRecipientName] = useState('Priya Sharma');
  const [recipientPhone, setRecipientPhone] = useState('+91 9831039814');
  const [blessingMessage, setBlessingMessage] = useState('May the Navagrahas bestow wisdom, sound health, and eternal prosperity upon you!');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedVoucher, setPurchasedVoucher] = useState<ShubhShagunVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Redeem Form
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const handleBuyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !senderName.trim()) return;

    setIsProcessing(true);

    try {
      let paid = false;
      if (walletBalance >= selectedAmount) {
        paid = deductWallet(selectedAmount, `Shubh Shagun Gift Card (₹${selectedAmount}) for ${recipientName}`);
      } else {
        // Gateway simulated payment
        await new Promise((resolve) => setTimeout(resolve, 800));
        paid = true;
      }

      if (paid) {
        audioSynthesis.playTempleBell(880, 1.5);
        const code = `SHAGUN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);

        const newVoucher: ShubhShagunVoucher = {
          id: 'v-' + Date.now(),
          code,
          amount: selectedAmount,
          occasion: selectedOccasion as any,
          occasionTitle: OCCASIONS.find((o) => o.id === selectedOccasion)?.title || 'Shubh Shagun',
          senderName,
          recipientName,
          recipientPhone,
          blessingMessage,
          createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          expiryDate: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'active',
        };

        setPurchasedVoucher(newVoucher);
        addNotification(
          'Shubh Shagun Gift Card Created!',
          `₹${selectedAmount} gift voucher generated for ${recipientName}. Share via WhatsApp.`,
          'discount'
        );
      }
    } catch (err: any) {
      alert(err?.message || 'Error creating gift card.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = () => {
    if (!purchasedVoucher) return;
    navigator.clipboard.writeText(purchasedVoucher.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!purchasedVoucher) return;
    const text =
      `🪔 *Shubh Shagun Astrological Gift Card from ${purchasedVoucher.senderName}* 🪔\n\n` +
      `Dearest *${purchasedVoucher.recipientName}*,\n` +
      `"${purchasedVoucher.blessingMessage}"\n\n` +
      `🎁 *Gift Voucher Value:* ₹${purchasedVoucher.amount}\n` +
      `🔑 *Redemption Voucher Code:* *${purchasedVoucher.code}*\n` +
      `Valid For: Live Pandit Calls, 50+ Page Kundli Dossiers, or E-Pujas.\n\n` +
      `👉 Redeem instantly here: https://12rashi.com/?tab=gift-cards&code=${purchasedVoucher.code}\n` +
      `Astrology Helpline: +91 9831039814`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError(null);
    setRedeemSuccess(null);

    const clean = redeemCodeInput.trim().toUpperCase();
    if (!clean) return;

    if (clean.startsWith('SHAGUN-') || clean.includes('LUCK') || clean.includes('VEDIC')) {
      // Valid gift card pattern simulation
      const creditedAmount = clean.includes('2100') ? 2100 : clean.includes('1100') ? 1100 : clean.includes('501') ? 501 : 251;
      await rechargeWallet(creditedAmount, 'SHUBH_SHAGUN_VOUCHER', 0);
      audioSynthesis.playTempleBell(1046, 1.8);
      setRedeemSuccess(`Blessed! ₹${creditedAmount} has been credited to your 12Rashi wallet.`);
      setRedeemCodeInput('');
      onRedeemSuccess?.();
      addNotification('Gift Card Redeemed!', `₹${creditedAmount} credited to your wallet balance.`, 'muhurat');
    } else {
      setRedeemError('Invalid or expired voucher code. Please check code or contact Helpline.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold border border-amber-300/30">
            <Gift className="w-3.5 h-3.5" />
            <span>Traditional Indian Astrological Gifting Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
            Shubh Shagun Gift Cards (शुभ शगुन उपहार)
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl">
            In our Vedic tradition, gifting sacred guidance, baby birth horoscopes, marriage compatibility, and temple prayers carries deep spiritual merit. Send personalized digital Shagun vouchers over WhatsApp in seconds.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('buy')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'buy'
                  ? 'bg-white text-orange-950 shadow-md font-extrabold'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              Send Shagun Card
            </button>
            <button
              onClick={() => setActiveTab('redeem')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'redeem'
                  ? 'bg-white text-orange-950 shadow-md font-extrabold'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              Redeem Shagun Voucher
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'buy' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase Configuration */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <form onSubmit={handleBuyVoucher} className="space-y-4">
              {/* Select Denomination */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-2 uppercase tracking-wide text-[11px]">
                  1. Choose Shagun Amount (शुभ शगुन राशि)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SHAGUN_DENOMINATIONS.map((den) => (
                    <button
                      key={den.amount}
                      type="button"
                      onClick={() => setSelectedAmount(den.amount)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                        selectedAmount === den.amount
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500 shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <strong className="text-sm font-bold text-orange-600 block">
                        {den.label}
                      </strong>
                      <span className="text-[10px] opacity-75">{den.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Occasion */}
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-100 mb-2 uppercase tracking-wide text-[11px]">
                  2. Occasion of Celebration (उत्सव प्रकार)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        selectedOccasion === occ.id
                          ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender & Recipient Details */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      From (Your Name)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      placeholder="e.g. Vasudev Sharma"
                      className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      To (Recipient Full Name)
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      placeholder="e.g. Priya Sharma"
                      className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Recipient WhatsApp Mobile
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required
                      placeholder="+91 9831039814"
                      className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Personal Blessing Message
                    </label>
                    <input
                      type="text"
                      value={blessingMessage}
                      onChange={(e) => setBlessingMessage(e.target.value)}
                      placeholder="Custom blessing text"
                      className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Bar */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Wallet Balance: ₹{walletBalance} {walletBalance >= selectedAmount ? '(Deducted from balance)' : '(Instant Gateway Checkout)'}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Shagun Dakshina: <span className="text-orange-600">₹{selectedAmount}</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-md transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Generating Shagun Card...' : `Generate & Gift Shagun Card (₹${selectedAmount})`}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Gift Card Preview */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-stone-500 tracking-wide">
              Live Shagun Card Preview
            </h3>

            {/* Traditional Gold Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white shadow-2xl relative overflow-hidden border-2 border-amber-300/60 font-serif space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-200 font-bold text-sm">
                    ॐ
                  </span>
                  <span className="font-bold text-xs tracking-wider uppercase text-amber-200">
                    12Rashi Shubh Shagun
                  </span>
                </div>
                <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full font-bold">
                  Valid 1 Year
                </span>
              </div>

              <div className="py-2 text-center space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-amber-200 block">
                  {OCCASIONS.find((o) => o.id === selectedOccasion)?.title || 'Shubh Shagun'}
                </span>
                <div className="text-3xl font-black font-sans text-white">
                  ₹{selectedAmount}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/20 text-xs space-y-1">
                <div className="flex justify-between text-[11px] text-amber-200">
                  <span>To: <strong>{recipientName || 'Dear One'}</strong></span>
                  <span>From: <strong>{senderName || 'Well-wisher'}</strong></span>
                </div>
                <p className="text-[11px] text-amber-100 italic leading-snug pt-1 border-t border-white/10">
                  "{blessingMessage}"
                </p>
              </div>

              <div className="text-[10px] text-amber-200/80 text-center font-mono">
                Code will activate instantly on creation.
              </div>
            </div>

            {/* Generated Voucher Actions */}
            {purchasedVoucher && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Voucher Ready to Send!</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-stone-800 dark:text-white bg-white dark:bg-stone-900 px-2 py-0.5 rounded border">
                    {purchasedVoucher.code}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSendWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1 border cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Redeem Voucher Form */
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 mx-auto flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Redeem Shubh Shagun Voucher
            </h3>
            <p className="text-xs text-stone-500">
              Enter your gift code to instantly credit your 12Rashi wallet.
            </p>
          </div>

          <form onSubmit={handleRedeem} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1 uppercase">
                Voucher Code (शगुन कोड)
              </label>
              <input
                type="text"
                value={redeemCodeInput}
                onChange={(e) => setRedeemCodeInput(e.target.value)}
                required
                placeholder="e.g. SHAGUN-8821-LUCK"
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-mono font-bold text-center uppercase outline-hidden focus:border-orange-500"
              />
            </div>

            {redeemSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{redeemSuccess}</span>
              </div>
            )}

            {redeemError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-bold border border-red-200">
                {redeemError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer hover:from-orange-600 hover:to-amber-600"
            >
              Redeem to Wallet Now
            </button>
          </form>

          <div className="text-[10px] text-stone-400 text-center">
            Need help? Contact Astrology Helpline: <strong>+91 9831039814</strong>
          </div>
        </div>
      )}
    </div>
  );
};
