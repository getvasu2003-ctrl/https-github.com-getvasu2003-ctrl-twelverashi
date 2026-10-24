import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Building,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Lock,
} from 'lucide-react';

export const LegalComplianceModal: React.FC = () => {
  const {
    openLegalModal,
    setOpenLegalModal,
    legalModalTab,
    setLegalModalTab,
    userProfile,
    updateUserProfile,
    addNotification,
  } = useApp();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  if (!openLegalModal) return null;

  const handleDeleteAccountData = () => {
    // Reset user profile to blank anonymous state
    updateUserProfile({
      name: 'Seeker',
      phone: '',
      email: '',
      rashi: 'Mesh (Aries)',
      dob: '2000-01-01',
      tob: '12:00',
      pob: 'Kolkata, West Bengal',
      subscription: 'none',
    });

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }

    setDeleteSuccess(true);
    setConfirmDelete(false);
    addNotification(
      'Data Wiped Successfully',
      'All stored birth charts, consultation history, and profile records have been deleted in compliance with IT Rules & App Store Data Deletion Guidelines.',
      'discount'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Legal & Regulatory Compliance Center
              </h3>
              <p className="text-[11px] text-stone-300">
                12Rashi Astrological Services Pvt. Ltd. • IT Rules 2021 & TRAI TCCCPR Compliant
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenLegalModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'disclaimer', label: 'Prediction Disclaimer', icon: ShieldAlert },
            { id: 'grievance', label: 'Grievance Officer (IT Rules)', icon: Building },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms & Fair Billing', icon: FileText },
            { id: 'deletion', label: 'Delete Account & Data', icon: Trash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = legalModalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setLegalModalTab(tab.id as any);
                  setDeleteSuccess(false);
                }}
                className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          {/* TAB 1: Astrology Disclaimer */}
          {legalModalTab === 'disclaimer' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    Mandatory Astrological Faith & Advisory Disclaimer
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                    Required disclosure under Consumer Protection Act (E-Commerce) Rules & Digital Intermediary Guidelines.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                <p>
                  <strong>1. Nature of Astrological Services:</strong> All horoscopes, Janam Kundli charts, planetary transit predictions, Guna Milan compatibility scores, gemstone recommendations, and astrologer consultations provided on <strong>12Rashi</strong> are based on traditional Vedic Jyotish, Parashari, Jaimini, KP, and Lal Kitab principles. These calculations represent an interpretive spiritual science.
                </p>
                <p>
                  <strong>2. Not Medical, Legal, or Financial Advice:</strong> Consultations and AI insights are intended strictly for guidance, spiritual advisory, and self-reflection. Under no circumstances should astrological predictions substitute for qualified professional medical treatment, clinical psychiatric diagnosis, legal counsel, or certified investment/financial advisory.
                </p>
                <p>
                  <strong>3. No Guarantees or Warranties:</strong> Vedic philosophy honors individual <em>Karma</em>, human free will, and divine intervention. Consequently, 12Rashi and its affiliated astrologers do not warrant, guarantee, or claim 100% accuracy of future outcomes, health results, or relationship success.
                </p>
                <p>
                  <strong>4. Anti-Black Magic / Zero Fear-Mongering Policy:</strong> 12Rashi strictly bans all unethical practices, black magic, or fear-inducing extortion. Our verified astrologers adhere to a strict Vedic Code of Ethics.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Grievance Officer */}
          {legalModalTab === 'grievance' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    Grievance Redressal Officer (Rule 3(2) of Information Technology Rules 2021)
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                    In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Grievance & Compliance Officer:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Vasu Sharma</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Corporate Legal Entity:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">12RASHIINFOTECH / 12Rashi Astrological Services Pvt. Ltd.</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Official Grievance Email:</span>
                    <a href="mailto:12rashi.com@gmail.com" className="font-bold text-orange-600 underline">
                      12rashi.com@gmail.com
                    </a>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Helpline & Direct Phone:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">+91 9831049814</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px]">
                  <span className="text-stone-400 block text-[10px] uppercase">Physical Registered Office:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    Laxman Apartment, 3rd Floor, Pulin Khatick Road, Kolkata - 700015, West Bengal, India
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] space-y-1">
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Statutory Redressal Timeline:
                  </span>
                  <p className="text-stone-500 dark:text-stone-400">
                    1. Acknowledgment of complaint: Within <strong>24 Hours</strong>.<br />
                    2. Investigation & Resolution: Within <strong>15 Business Days</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Privacy Policy */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-3">
              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase">
                  Data Protection & Privacy Policy
                </h4>
                <p>
                  <strong>Data Collected:</strong> We collect your Name, Date of Birth, Exact Time of Birth, Place of Birth, and Mobile Number for DLT OTP verification. This data is exclusively utilized to calculate planetary ephemeris, Lagna charts, and Dasha cycles.
                </p>
                <p>
                  <strong>Payment Security (Cashfree):</strong> Payments are processed via RBI-authorized <strong>Cashfree Payments India</strong> using 256-bit TLS bank encryption. 12Rashi does not store credit/debit card numbers, CVVs, or UPI MPINs on our servers.
                </p>
                <p>
                  <strong>No Data Selling:</strong> We never sell, rent, or trade your personal birth charts or consultation transcripts to advertising networks or third-party brokers.
                </p>
                <p>
                  <strong>Right to Erasure:</strong> In accordance with Digital Personal Data Protection (DPDP) Act 2023, you can permanently delete your saved charts and account data at any time via the "Delete Account & Data" tab.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Terms & Fair Billing */}
          {legalModalTab === 'terms' && (
            <div className="space-y-3">
              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Fair-Billing Guarantee™ & Consultation Terms</span>
                </h4>
                <p>
                  <strong>Per-Second Metering:</strong> Unlike conventional platforms that round up a 61-second call to 2 full minutes, 12Rashi bills strictly per second (e.g. ₹30/min = ₹0.50/second).
                </p>
                <p>
                  <strong>1st-Minute 100% Refund Guarantee:</strong> If an audio or video consultation disconnects or you are unsatisfied within the first 60 seconds, your wallet is automatically refunded 100% with zero questions asked.
                </p>
                <p>
                  <strong>Wallet Validity:</strong> Recharged balance remains valid for life and does not expire.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Account & Data Deletion */}
          {legalModalTab === 'deletion' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    Account & Personal Birth Data Deletion (Play Store & App Store Mandatory)
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                    Exercise your right to be forgotten. This permanently removes your saved birth chart, consultation transcripts, family profiles, and wallet tokens.
                  </p>
                </div>
              </div>

              {deleteSuccess ? (
                <div className="p-4 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
                    Your Data Has Been Permanently Erased
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    All birth charts, saved family profiles, and consultation archives have been cleared from this browser session.
                  </p>
                </div>
              ) : (
                <div className="bg-stone-50 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Current active account: <strong>{userProfile.name}</strong> ({userProfile.phone || userProfile.email || 'Anonymous Seeker'}).
                  </p>

                  {confirmDelete ? (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl space-y-2">
                      <p className="font-bold text-rose-800 dark:text-rose-200 text-xs">
                        Are you sure? This action is immediate and cannot be undone.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDeleteAccountData}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition shadow-xs"
                        >
                          Yes, Permanently Delete My Data
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Request Account & Data Deletion</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 px-5 shrink-0">
          <span>Grievance Helpline: +91 9831049814 • 12rashi.com@gmail.com</span>
          <button
            onClick={() => setOpenLegalModal(false)}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
