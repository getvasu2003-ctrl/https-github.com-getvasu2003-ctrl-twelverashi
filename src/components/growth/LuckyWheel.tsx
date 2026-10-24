import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Sparkles, X, Gift, Award, CheckCircle2 } from 'lucide-react';

export const LuckyWheel: React.FC = () => {
  const { openLuckyWheel, setOpenLuckyWheel, rechargeWallet, addNotification } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  if (!openLuckyWheel) return null;

  const prizes = [
    { label: '₹50 Free Credits', reward: 50, color: '#EA580C' },
    { label: '10% Off Astrologer Call', reward: 0, color: '#DC2626' },
    { label: '₹100 Wallet Bonus', reward: 100, color: '#D97706' },
    { label: 'Free Kundli PDF Report', reward: 0, color: '#B91C1C' },
    { label: '₹25 Free Credits', reward: 25, color: '#991B1B' },
    { label: '20% AstroStore Voucher', reward: 0, color: '#C2410C' },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    setRotation((prev) => prev + randomDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const chosenPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setWonPrize(chosenPrize.label);

      if (chosenPrize.reward > 0) {
        rechargeWallet(chosenPrize.reward, 'Chakra Lucky Spin Win', 0);
      } else {
        addNotification('Astro Lucky Prize Won!', `${chosenPrize.label} unlocked for your account.`, 'discount');
      }
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-amber-300 dark:border-stone-700 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setOpenLuckyWheel(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Daily Subscriber Lucky Chakra</span>
        </div>

        <h3 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100">
          Spin & Win Free Consultations
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Spin the sacred cosmic wheel every 24 hours for instant wallet cash and discounts!
        </p>

        {/* Wheel Graphic */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          {/* Pointer needle */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

          {/* Rotating Wheel SVG */}
          <div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-all ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3.5s' : '0s',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {prizes.map((p, i) => {
                const angle = 360 / prizes.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                return (
                  <path
                    key={i}
                    d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                    fill={p.color}
                  />
                );
              })}
              {/* Inner Center Hub */}
              <circle cx="100" cy="100" r="28" fill="#1C1917" stroke="#FDE047" strokeWidth="3" />
              <text x="100" y="105" textAnchor="middle" fill="#FEF08A" fontSize="12" fontWeight="bold">
                12R
              </text>
            </svg>
          </div>
        </div>

        {wonPrize ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 space-y-2 mb-4 animate-in zoom-in-95">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
              🎉 Congratulations! You Won:
            </span>
            <div className="text-lg font-black text-stone-900 dark:text-stone-100">{wonPrize}</div>
            <p className="text-[11px] text-stone-500">Reward applied automatically to your 12Rashi profile.</p>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSpinning ? 'Consulting the Cosmic Wheel...' : 'Spin the Chakra Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
