import React from 'react';
import { Logo } from './common/Logo.tsx';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ExternalLink,
  MessageSquareText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Footer: React.FC<{ setActiveTab: (t: string) => void }> = ({ setActiveTab }) => {
  const {
    setOpenDltModal,
    setOpenPaymentModal,
    setOpenFairBillingModal,
    setOpenMembershipModal,
    setOpenQrStandeeModal,
    setOpenLegalModal,
    setLegalModalTab,
    setOpenCustomDomainModal,
    setOpenPlayStoreModal,
  } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t-4 border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust & Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-stone-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700/50">
            <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Verified</h4>
              <p className="text-[11px] text-stone-400">Acharyas & Grandmasters</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700/50">
            <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Payments</h4>
              <p className="text-[11px] text-stone-400">UPI, QR, Cards & NetBanking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700/50">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 Availability</h4>
              <p className="text-[11px] text-stone-400">Live Audio, Video & Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700/50">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vedic Remedies</h4>
              <p className="text-[11px] text-stone-400">100% Non-Physical Mantras & Sadhana</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-stone-800">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-xs text-stone-400 leading-relaxed">
              12Rashi is an authentic Vedic astrology portal, bridging ancient
              Parashari astrological wisdom with live consultations, AI predictions, and lab-certified remedies.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a
                href="tel:9831039814"
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>+91 9831039814 (Helpline & WhatsApp)</span>
              </a>

              <a
                href="mailto:12rashi.com@gmail.com"
                className="flex items-center gap-2 text-stone-300 hover:text-white"
              >
                <Mail className="w-4 h-4 shrink-0 text-orange-400" />
                <span>12rashi.com@gmail.com</span>
              </a>

              <div className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Laxman Apartment, 3rd Floor, Pulin Khatick Road, Kolkata - 700016, West Bengal</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Consultations */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Live Consultations
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('astrologers')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Talk to Vedic Astrologers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('astrologers')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Chat with Tarot Readers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('astrologers')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  KP Astrology Experts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('astrologers')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Numerology & Name Correction
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('milan')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Marriage Kundli Milan (36 Gunas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ai-insights')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  AI Jyotish Insights (24/7)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Astrology Services & Rashis */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Vedic Services & Remedies
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('panchang')}
                  className="hover:text-orange-400 transition cursor-pointer text-amber-300 font-semibold"
                >
                  Daily Panchang & Choghadiya Muhurat
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('archive')}
                  className="hover:text-orange-400 transition cursor-pointer text-orange-400 font-semibold"
                >
                  My Consultation Archive & Receipts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('kundli')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Free Kundli (Birth Chart) Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:text-amber-400 transition cursor-pointer text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>50+ Page Brihat Kundli PDF Dossier (₹499)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('horoscope')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Daily Horoscope (12 Rashis)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('store')}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  Vedic Remedies & 108 Jaap Mala
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('live-puja')}
                  className="hover:text-amber-400 transition cursor-pointer text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Live Temple Darshan & E-Puja</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenFairBillingModal(true)}
                  className="hover:text-emerald-400 transition cursor-pointer text-emerald-400 font-bold"
                >
                  Fair-Billing Guarantee™ (Per-Second Metering)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenMembershipModal(true)}
                  className="hover:text-orange-400 transition cursor-pointer text-amber-300 font-semibold"
                >
                  Astro Club VIP Membership Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenQrStandeeModal(true)}
                  className="hover:text-orange-400 transition cursor-pointer text-stone-300"
                >
                  Temple & Shop QR Standees (Offline-to-Online)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: DLT Compliance & Official Verification */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              DLT SMS Compliance
            </h3>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Fully registered with TRAI (Telecom Regulatory Authority of India) under Telecom Commercial Communications Customer Preference Regulations (TCCCPR 2018).
            </p>

            <div className="bg-stone-800 p-3 rounded-lg border border-stone-700 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-400">Entity:</span>
                <span className="font-semibold text-white">12RASHIINFOTECH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Principal Entity ID:</span>
                <span className="font-mono text-amber-300 font-bold">1201171886368224321</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Approved Header:</span>
                <span className="font-mono text-emerald-400 font-bold">TWRSHI (1205174948652740996)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Telecom & Gateway:</span>
                <span className="text-stone-300">Reliance Jio DLT / MSG91</span>
              </div>
            </div>

            <button
              onClick={() => setOpenDltModal(true)}
              className="mt-3 w-full py-1.5 px-3 rounded bg-orange-600/30 hover:bg-orange-600/40 text-orange-300 text-xs font-semibold border border-orange-500/40 flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify DLT Registration</span>
            </button>
          </div>
        </div>

        {/* Legal & Regulatory Compliance Links (Mandatory for App Stores & India IT Rules) */}
        <div className="pt-6 pb-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-stone-400">
            <button
              onClick={() => {
                setLegalModalTab('disclaimer');
                setOpenLegalModal(true);
              }}
              className="hover:text-amber-400 transition cursor-pointer underline text-[11px]"
            >
              Astrological Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('grievance');
                setOpenLegalModal(true);
              }}
              className="hover:text-amber-400 transition cursor-pointer underline text-[11px] text-amber-300/90 font-semibold"
            >
              Grievance Officer (IT Rules 2021)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setOpenLegalModal(true);
              }}
              className="hover:text-amber-400 transition cursor-pointer underline text-[11px]"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('terms');
                setOpenLegalModal(true);
              }}
              className="hover:text-amber-400 transition cursor-pointer underline text-[11px]"
            >
              Terms & Fair-Billing
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalModalTab('deletion');
                setOpenLegalModal(true);
              }}
              className="hover:text-rose-400 transition cursor-pointer underline text-[11px] text-rose-300/80"
            >
              Delete Account & Data
            </button>
            <span>•</span>
            <button
              onClick={() => setOpenCustomDomainModal(true)}
              className="hover:text-emerald-400 transition cursor-pointer underline text-[11px] text-emerald-300/90 font-semibold"
            >
              Custom Domain & DNS
            </button>
            <span>•</span>
            <button
              onClick={() => setOpenPlayStoreModal(true)}
              className="hover:text-sky-400 transition cursor-pointer underline text-[11px] text-sky-300/90 font-semibold flex items-center gap-1"
            >
              <span>Play Store Launch Center</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-500 font-mono">
            Intermediary Intermediary Guidelines Compliance: 12RASHIINFOTECH
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} 12Rashi Astrological Services Pvt. Ltd. All rights reserved.
            Headquarters: Laxman Apartment, 3rd Floor, Pulin Khatick Road, Kolkata - 700015, India.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-400 text-[11px]">Accepted Payment Modes:</span>
            <div className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 rounded-md border border-stone-700">
              <span className="font-bold text-white text-[11px]">UPI</span>
              <span className="text-stone-500">•</span>
              <span className="font-bold text-amber-400 text-[11px]">Google Pay</span>
              <span className="text-stone-500">•</span>
              <span className="font-bold text-purple-400 text-[11px]">PhonePe</span>
              <span className="text-stone-500">•</span>
              <span className="font-bold text-blue-400 text-[11px]">Paytm</span>
              <span className="text-stone-500">•</span>
              <span className="font-bold text-green-400 text-[11px]">RuPay / NetBanking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
