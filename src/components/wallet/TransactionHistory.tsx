import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { PaymentTransaction } from '../../types/astrology.ts';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  PlusCircle,
  FileText,
  PhoneCall,
  MessageSquare,
  Video,
  Flame,
  Calendar,
  Sparkles,
  HelpCircle,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface TransactionHistoryProps {
  onAddMoneyClick?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onAddMoneyClick }) => {
  const { walletBalance, transactions, userProfile } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'recharges' | 'consultations' | 'bookings_pujas' | 'refunds'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy transaction ID handler
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compute summary metrics
  const { totalAdded, totalSpent, totalRefunded } = useMemo(() => {
    let added = 0;
    let spent = 0;
    let refunded = 0;

    transactions.forEach((t) => {
      if (t.type === 'credit') {
        if (t.description?.toLowerCase().includes('refund')) {
          refunded += t.amount;
        } else {
          added += t.amount;
        }
      } else if (t.type === 'debit') {
        spent += t.amount;
      }
    });

    return { totalAdded: added, totalSpent: spent, totalRefunded: refunded };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type / Category Filter
      if (activeFilter === 'recharges') {
        if (t.type !== 'credit' || t.description?.toLowerCase().includes('refund')) return false;
      } else if (activeFilter === 'consultations') {
        if (t.type !== 'debit' || (!t.description?.toLowerCase().includes('consultation') && !t.description?.toLowerCase().includes('minute') && !t.description?.toLowerCase().includes('call') && !t.description?.toLowerCase().includes('chat'))) {
          // If category is consultation and not booking/puja
          if (t.category !== 'consultation') return false;
        }
      } else if (activeFilter === 'bookings_pujas') {
        const desc = t.description?.toLowerCase() || '';
        if (!desc.includes('booking') && !desc.includes('sankalp') && !desc.includes('puja') && !desc.includes('ask pandit')) return false;
      } else if (activeFilter === 'refunds') {
        if (!t.description?.toLowerCase().includes('refund')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesMethod = t.method?.toLowerCase().includes(q);
        const matchesCategory = t.category?.toLowerCase().includes(q);
        if (!matchesId && !matchesDesc && !matchesMethod && !matchesCategory) return false;
      }

      return true;
    });
  }, [transactions, activeFilter, searchQuery]);

  // Helper to determine specific category icon & color
  const getTransactionVisuals = (t: PaymentTransaction) => {
    const desc = t.description?.toLowerCase() || '';
    const isRefund = desc.includes('refund');

    if (isRefund) {
      return {
        icon: ShieldCheck,
        iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        badgeText: 'Auto-Refund',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      };
    }

    if (t.type === 'credit') {
      return {
        icon: ArrowDownLeft,
        iconBg: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
        badgeText: 'Recharge Credit',
        badgeColor: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800',
      };
    }

    if (desc.includes('video')) {
      return {
        icon: Video,
        iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        badgeText: 'Video Call',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      };
    }

    if (desc.includes('chat')) {
      return {
        icon: MessageSquare,
        iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        badgeText: 'Chat Consultation',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      };
    }

    if (desc.includes('puja') || desc.includes('sankalp')) {
      return {
        icon: Flame,
        iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        badgeText: 'Sacred Puja',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      };
    }

    if (desc.includes('booking') || desc.includes('slot')) {
      return {
        icon: Calendar,
        iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        badgeText: 'Slot Booking',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
      };
    }

    return {
      icon: PhoneCall,
      iconBg: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
      badgeText: 'Consultation',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    };
  };

  // Print/Download Statement
  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="space-y-4 text-stone-800 dark:text-stone-200">
      {/* Wallet Balance & Financial Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white shadow-lg border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300/90 uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>12Rashi Sacred Account Balance</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                ₹{walletBalance}
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                100% Protected
              </span>
            </div>
            <p className="text-[11px] text-stone-300 mt-1">
              Per-second billing with Fair-Billing Guarantee™ (Under-60s full auto refund).
            </p>
          </div>

          {onAddMoneyClick && (
            <button
              onClick={onAddMoneyClick}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition transform hover:scale-[1.02] shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Money via UPI / PG</span>
            </button>
          )}
        </div>

        {/* Financial Flow Statistics Row */}
        <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center sm:text-left">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-medium">Total Added</span>
            <span className="text-sm font-bold text-emerald-300">₹{totalAdded}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-medium">Total Spent</span>
            <span className="text-sm font-bold text-amber-300">₹{totalSpent}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 block font-medium">Auto-Refunded</span>
            <span className="text-sm font-bold text-purple-300">₹{totalRefunded}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setActiveFilter('recharges')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'recharges'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Recharges
            </button>
            <button
              onClick={() => setActiveFilter('consultations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'consultations'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveFilter('bookings_pujas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'bookings_pujas'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Bookings & Pujas
            </button>
            <button
              onClick={() => setActiveFilter('refunds')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'refunds'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Refunds
            </button>
          </div>

          {/* Statement Export Button */}
          {transactions.length > 0 && (
            <button
              onClick={handlePrintStatement}
              className="inline-flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 transition cursor-pointer self-end sm:self-auto shrink-0"
              title="Print or Save Statement as PDF"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Statement</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Acharya, Ref ID, or service..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-1 focus:ring-orange-500 text-stone-800 dark:text-stone-200 placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chronological List of Transactions */}
      <div className="space-y-2.5 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-stone-700 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                {searchQuery || activeFilter !== 'all' ? 'No Matching Transactions Found' : 'No Wallet Activity Yet'}
              </h5>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                {searchQuery || activeFilter !== 'all'
                  ? 'Try clearing your search query or selecting a different filter.'
                  : 'Your account balance is currently ₹0. Once you recharge via Cashfree UPI or consult an Acharya, a transparent itemized log will appear here.'}
              </p>
            </div>
            {onAddMoneyClick && (
              <button
                onClick={onAddMoneyClick}
                className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Recharge Wallet</span>
              </button>
            )}
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const visual = getTransactionVisuals(t);
            const VisualIcon = visual.icon;
            const isCredit = t.type === 'credit';

            return (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 hover:border-orange-300 dark:hover:border-stone-600 transition shadow-2xs hover:shadow-xs space-y-2"
              >
                {/* Header row: Icon, Category/Title & Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${visual.iconBg} shadow-inner`}>
                      <VisualIcon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-1">
                          {t.description || (isCredit ? 'Wallet Credit' : 'Service Deduction')}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold border ${visual.badgeColor}`}>
                          {visual.badgeText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{t.timestamp}</span>
                        </span>
                        <span>•</span>
                        <span>Via {t.method || 'Wallet'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Amount */}
                  <div className="text-right shrink-0">
                    <div className={`text-sm sm:text-base font-black ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-800 dark:text-stone-200'}`}>
                      {isCredit ? `+₹${t.amount}` : `-₹${t.amount}`}
                    </div>
                    {typeof t.balanceAfter === 'number' && (
                      <div className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                        Bal: ₹{t.balanceAfter}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer row: Ref ID, Copy button, Status & WhatsApp support */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                    <span>Ref:</span>
                    <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">
                      {t.id}
                    </span>
                    <button
                      onClick={() => handleCopy(t.id)}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-400 hover:text-stone-600 cursor-pointer transition ml-0.5"
                      title="Copy Reference ID"
                    >
                      {copiedId === t.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[9px] bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{t.status || 'SUCCESS'}</span>
                    </span>

                    <a
                      href={`https://wa.me/919831039814?text=${encodeURIComponent(`Pranam! I need assistance regarding my 12Rashi transaction: ${t.id} for ₹${t.amount}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-orange-600 transition flex items-center gap-0.5 font-medium"
                      title="Query or report issue with this transaction"
                    >
                      <span>Help</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Support & Grievance Helpline Bar */}
      <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-stone-800/50 border border-orange-200/70 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          <span>Billing Grievances & Instant Resolution:</span>
        </div>
        <a
          href="tel:9831039814"
          className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
        >
          <PhoneCall className="w-3 h-3" />
          <span>+91 9831039814</span>
        </a>
      </div>
    </div>
  );
};
