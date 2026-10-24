import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Send, Radio, Heart, Flame, Gift, Users, Star } from 'lucide-react';

export const LiveStreamModal: React.FC = () => {
  const { openLiveStream, setOpenLiveStream, userProfile, deductWallet, walletBalance, setOpenPaymentModal, addNotification } = useApp();

  const [streamChat, setStreamChat] = useState<Array<{ user: string; text: string; isGift?: boolean; giftAmt?: number; giftName?: string }>>([
    { user: 'Vikram Sengupta', text: 'Har Har Mahadev Acharyaji! Pranam from Kolkata.' },
    { user: 'Kavita Nair', text: 'Please explain the upcoming Jupiter transit in Taurus for Karka rashi!' },
    { user: 'Rajesh Verma', text: 'Sent Diya & Master Dakshina! 🙏', isGift: true, giftAmt: 101, giftName: '🥥 Sacred Nariyal Offering' },
    { user: 'Suman Roy', text: 'Can wearing 5 mukhi rudraksha calm Rahu mahadasha anxiety?' },
  ]);
  const [commentInput, setCommentInput] = useState('');

  const PUJA_GIFTS = [
    { name: '🪔 Diya Light', amount: 21 },
    { name: '🌸 Pushpa Archana', amount: 51 },
    { name: '🥥 Sacred Nariyal', amount: 101 },
    { name: '🪙 Master Dakshina', amount: 251 },
    { name: '🐚 Shankh Abhishek', amount: 501 },
  ];

  if (!openLiveStream) return null;

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    setStreamChat((p) => [
      ...p,
      { user: userProfile.name, text: commentInput.trim() },
    ]);
    setCommentInput('');
  };

  const handleSendGift = (gift: { name: string; amount: number }) => {
    if (walletBalance < gift.amount) {
      addNotification(
        'Low Wallet Balance',
        `Recharge ₹${gift.amount - walletBalance} to offer ${gift.name} to Acharyaji.`,
        'payment'
      );
      setOpenPaymentModal(true);
      return;
    }

    const success = deductWallet(gift.amount, `Live Stream Puja Offering: ${gift.name} (₹${gift.amount})`);
    if (success) {
      setStreamChat((p) => [
        ...p,
        {
          user: userProfile.name,
          text: `Offered ${gift.name} (₹${gift.amount})! May divine planetary blessings bestow peace.`,
          isGift: true,
          giftAmt: gift.amount,
          giftName: gift.name,
        },
      ]);
      addNotification(
        'Puja Offering Sent',
        `Offered ${gift.name} of ₹${gift.amount} to Acharya Brihaspati (AI)!`,
        'astrologer'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-stone-900 border border-orange-500/40 rounded-3xl w-full max-w-4xl h-[88vh] flex flex-col md:flex-row overflow-hidden text-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* Left Video Stream Area */}
        <div className="flex-1 bg-stone-950 relative flex flex-col justify-between overflow-hidden">
          {/* Top Live Badges */}
          <div className="p-4 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5 animate-ping" />
                <span>LIVE SATSANG</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-black/60 text-stone-200 text-xs font-semibold border border-white/10 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>1,842 Viewing</span>
              </span>
            </div>

            <button
              onClick={() => setOpenLiveStream(false)}
              className="md:hidden p-1.5 rounded-full bg-black/50 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stream Broadcast simulation visuals */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
              alt="Acharya Brihaspati (AI)"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

            <div className="absolute text-center max-w-md p-4">
              <h3 className="text-xl font-bold drop-shadow-md text-amber-200">
                Daily Maha Jyotish Satsang & Kundli Q&A
              </h3>
              <p className="text-xs text-white/90 drop-shadow-md mt-1">
                Hosted by Acharya Brihaspati (AI) • 24/7 Live Vedic Jyotish & Kundli Stream
              </p>
            </div>
          </div>

          {/* Bottom Stream Actions */}
          <div className="p-3 z-10 bg-gradient-to-t from-black/95 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Sacred Puja Dakshina:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {PUJA_GIFTS.map((g) => (
                <button
                  key={g.amount}
                  onClick={() => handleSendGift(g)}
                  className="px-2.5 py-1 rounded-xl bg-orange-600/90 hover:bg-orange-600 text-white text-[11px] font-bold cursor-pointer transition shadow-xs whitespace-nowrap flex items-center gap-1 border border-orange-400/40"
                  title={`Send ${g.name} (₹${g.amount})`}
                >
                  <span>{g.name}</span>
                  <span className="text-amber-200">₹{g.amount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Chat Sidebar */}
        <div className="w-full md:w-80 bg-stone-900 border-l border-stone-800 flex flex-col h-72 md:h-full">
          <div className="p-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Live Satsang Chat</span>
            </h4>
            <button
              onClick={() => setOpenLiveStream(false)}
              className="hidden md:inline-block text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {streamChat.map((c, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl ${
                  c.isGift
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                    : 'bg-stone-800/80 text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-amber-400 text-[11px]">{c.user}</span>
                  {c.isGift && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black text-[10px]">
                      SuperChat ₹{c.giftAmt}
                    </span>
                  )}
                </div>
                <p className="leading-relaxed text-[11px]">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="Ask a question in live stream..."
              className="flex-1 bg-stone-800 text-stone-100 text-xs px-3 py-2 rounded-xl outline-hidden focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={handleSendComment}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
