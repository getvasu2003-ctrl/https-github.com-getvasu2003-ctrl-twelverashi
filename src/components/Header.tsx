import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { useTranslation } from '../i18n/useTranslation.ts';
import { LanguageSwitcher } from './common/LanguageSwitcher.tsx';
import { Logo } from './common/Logo.tsx';
import {
  Wallet,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Radio,
  ShieldCheck,
  Globe,
  UserCheck,
  ChevronDown,
  PhoneCall,
  Phone,
  Menu,
  X,
  PlusCircle,
  Users,
  Crown,
  QrCode,
  Shield,
  Clock,
  Smartphone,
  Zap,
  Gift,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    role,
    setRole,
    toggleRole,
    isPartnerAuthenticated,
    partnerAstrologer,
    walletBalance,
    setOpenPaymentModal,
    setOpenLuckyWheel,
    setOpenLiveStream,
    setOpenDltModal,
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    notifications,
    activeFamilyProfile,
    setOpenFamilyModal,
    membershipTier,
    setOpenMembershipModal,
    setOpenFairBillingModal,
    setOpenQrStandeeModal,
    setOpenCustomDomainModal,
    setOpenPlayStoreModal,
    user,
    isUserLoggedIn,
    setOpenLoginModal,
    setOpenTatkalModal,
    setOpenOnboardingModal,
  } = useApp();

  const { t } = useTranslation();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const primaryNavLinks = [
    { id: 'astrologers', label: t('nav_astrologers'), icon: '🔮' },
    { id: 'kundli', label: t('nav_kundli'), icon: '📜' },
    { id: 'panchang', label: t('nav_panchang'), icon: '🧭' },
    { id: 'daily-audio', label: 'Audio Rashi Fal', icon: '🎧' },
    { id: 'live-puja', label: 'Live Puja', icon: '🔴' },
    { id: 'store', label: 'Remedies', icon: '🪔' },
  ];

  const moreNavLinks = [
    { id: 'prashna', label: 'Prashna (No Birth Time)', icon: '🧭', category: 'Kundli & Horary', badge: 'Instant' },
    { id: 'reports', label: '50+ Pg Kundli PDF', icon: '📑', category: 'Kundli & Horary', badge: '₹499' },
    { id: 'milan', label: '36-Guna Kundli Milan', icon: '💍', category: 'Kundli & Horary' },
    { id: 'async-qa', label: 'Ask Pandit (Voice)', icon: '🎙️', category: 'Consultations', badge: '₹99' },
    { id: 'gift-cards', label: 'Gift Cards (शगुन)', icon: '🎁', category: 'Consultations' },
    { id: 'horoscope', label: 'Daily Horoscope', icon: '🪐', category: 'Daily Insights' },
    { id: 'ai-insights', label: 'Rashi AI Engine', icon: '✨', category: 'Tools & Audits' },
    { id: 'numerology', label: 'Numerology Audit', icon: '🔢', category: 'Tools & Audits' },
    { id: 'vastu', label: 'Vastu Shastra Audit', icon: '🧭', category: 'Tools & Audits' },
    { id: 'my-profile', label: 'My Astro Profile', icon: '🌟', category: 'Personal Vault', badge: 'Permanent' },
    { id: 'family-vault', label: 'Family Vault (10 Charts)', icon: '👨‍👩‍👧‍👦', category: 'Personal Vault' },
    { id: 'archive', label: 'Consultation Archive', icon: '📋', category: 'Personal Vault' },
  ];

  const navLinks = [...primaryNavLinks, ...moreNavLinks];
  const activeMoreItem = moreNavLinks.find((l) => l.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-orange-200/60 dark:border-stone-800 transition-colors shadow-xs">
      {/* Top Banner: Helplines, DLT Compliance Notice & Address Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white text-xs py-1.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3 h-3 text-amber-200" />
              <span>Astrology Helpline:</span>
              <a href="tel:9831039814" className="font-bold underline hover:text-amber-100">
                +91 9831039814
              </a>
            </span>
            <span className="hidden md:inline-block text-amber-200/60">|</span>
            <button
              onClick={() => setOpenFairBillingModal(true)}
              className="hidden lg:inline-flex items-center gap-1 hover:text-amber-200 cursor-pointer font-medium transition"
              title="Fair-Billing Guarantee: Billed per second, not rounded minutes. Auto refund under 60s."
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Fair-Billing Guarantee™ (Per-Sec & 1st-Min Refund)</span>
            </button>
            <span className="hidden lg:inline-block text-amber-200/60">|</span>
            <span className="hidden md:inline-flex items-center gap-1 opacity-90">
              📍 Laxman Apt, Pulin Khatick Rd, Kolkata - 700015
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Tatkal VIP Emergency Call */}
            <button
              onClick={() => setOpenTatkalModal(true)}
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition shadow-xs animate-pulse"
              title="Tatkal VIP Consultation: Instant live connect with senior astrologer in under 60 seconds"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>⚡ Tatkal VIP (Under 60s)</span>
            </button>

            {/* Interactive Platform Tour */}
            <button
              onClick={() => setOpenOnboardingModal(true)}
              className="inline-flex items-center gap-1 bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition border border-amber-300/40"
              title="Take Interactive Platform Tour (Kundli, Astrologers, Horoscopes)"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Tour</span>
            </button>

            {/* Temple & Event QR Standees */}
            <button
              onClick={() => setOpenQrStandeeModal(true)}
              className="hidden sm:inline-flex items-center gap-1 bg-black/20 hover:bg-black/30 text-amber-100 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition border border-white/20"
              title="Temple & Shop QR Standees (Offline-to-Online Engine)"
            >
              <QrCode className="w-3 h-3 text-amber-300" />
              <span>Temple QR Standees</span>
            </button>

            {/* DLT Registration Button */}
            <button
              onClick={() => setOpenDltModal(true)}
              className="inline-flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition border border-amber-300/30"
              title="View TRAI Jio DLT SMS Registration (Header: TWRSHI [1205174948652740996], PE: 1201171886368224321)"
            >
              <ShieldCheck className="w-3 h-3 text-amber-300" />
              <span>Jio DLT (TWRSHI)</span>
            </button>

            {/* Cashfree PG Status */}
            <button
              onClick={() => setOpenPaymentModal(true)}
              className="hidden md:inline-flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition border border-emerald-400/30"
              title="Cashfree Production Gateway Active (App ID: 7323148630f6...)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cashfree PG Active</span>
            </button>

            {/* Distinct Astrologer Partner Login / Console Entry */}
            <button
              onClick={() => {
                if (role === 'user') setRole('partner');
                else toggleRole();
              }}
              className={`text-[11px] px-3 py-1 rounded-full font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                role === 'partner'
                  ? 'bg-amber-400 text-stone-950 ring-1 ring-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 hover:brightness-105'
              }`}
              title="Access Astrologer Partner Console"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {role === 'partner' && isPartnerAuthenticated
                  ? `${partnerAstrologer.name.split(' ')[0]} (Console)`
                  : 'Astrologer Partner Login'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('astrologers')}
          className="cursor-pointer transition hover:opacity-95"
        >
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 relative">
          {primaryNavLinks.map((link) => {
            const isActive = activeTab === link.id && role === 'user';
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (role === 'partner') toggleRole();
                  setActiveTab(link.id);
                  setMoreMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-stone-900'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* More Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMoreItem
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-stone-900'
              }`}
            >
              <span>{activeMoreItem ? activeMoreItem.icon : '✨'}</span>
              <span>{activeMoreItem ? activeMoreItem.label : 'More Services'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {moreMenuOpen && (
              <div
                className="absolute top-full right-0 sm:left-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                <div className="px-3 py-1.5 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span>Sacred Services & Tools</span>
                  <span>11 Options</span>
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto no-scrollbar pt-1.5">
                  {moreNavLinks.map((link) => {
                    const isItemActive = activeTab === link.id && role === 'user';
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          if (role === 'partner') toggleRole();
                          setActiveTab(link.id);
                          setMoreMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left ${
                          isItemActive
                            ? 'bg-orange-500 text-white font-bold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{link.icon}</span>
                          <span className="line-clamp-1">{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                            isItemActive ? 'bg-white text-orange-600' : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lentlo Family Profile Quick Switcher Pill */}
          {role === 'user' && (
            <button
              onClick={() => setActiveTab('family-vault')}
              className="hidden lg:inline-flex items-center gap-1.5 bg-orange-50/70 dark:bg-stone-900 border border-orange-200 dark:border-stone-800 hover:border-orange-400 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 dark:text-stone-300 transition cursor-pointer shadow-2xs"
              title="Family Kundli Vault: Manage birth charts for up to 10 family members"
            >
              <Users className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-bold text-stone-800 dark:text-stone-200 max-w-[110px] truncate">
                {activeFamilyProfile.name.split(' ')[0]} ({activeFamilyProfile.relation})
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
          )}

          {/* Lentlo Astro Club VIP Membership Pill */}
          {role === 'user' && (
            <button
              onClick={() => setOpenMembershipModal(true)}
              className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs ${
                membershipTier !== 'free'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
              title="Astro Club VIP: Priority waitlist, included call minutes & free annual forecast"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{membershipTier !== 'free' ? `${membershipTier.toUpperCase()} VIP` : 'Astro Club'}</span>
            </button>
          )}

          {/* Growth Feature 1: Spin Lucky Chakra */}
          <button
            onClick={() => setOpenLuckyWheel(true)}
            className="hidden xl:inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition transform hover:scale-105 cursor-pointer animate-pulse"
            title="Spin the Daily Lucky Chakra to win free consultation credits & remedies!"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spin Chakra</span>
          </button>

          {/* Growth Feature 2: Live Stream / Satsang */}
          <button
            onClick={() => setOpenLiveStream(true)}
            className="hidden md:inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition cursor-pointer"
            title="Join Live Astrology Satsang & Q&A Stream"
          >
            <Radio className="w-3.5 h-3.5 animate-ping" />
            <span>Live Satsang</span>
          </button>

          {/* User Wallet Balance */}
          {role === 'user' && (
            <div className="flex items-center bg-orange-50/70 dark:bg-stone-900 border border-orange-300 dark:border-stone-700 rounded-full pl-2.5 pr-1 py-1">
              <div className="flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-stone-100">
                <Wallet className="w-3.5 h-3.5 text-orange-600" />
                <span>₹{walletBalance}</span>
              </div>
              <button
                onClick={() => setOpenPaymentModal(true)}
                className="ml-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition shadow-xs flex items-center gap-0.5"
                title="Recharge wallet using UPI, QR Code or NetBanking"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          )}

          {/* User Mobile Login / Profile Button */}
          {role === 'user' && (
            isUserLoggedIn && user ? (
              <button
                onClick={() => setOpenLoginModal(true)}
                className="flex items-center gap-1.5 bg-orange-100/80 dark:bg-stone-800 border border-orange-300 dark:border-stone-700 hover:border-orange-500 rounded-full px-2.5 py-1 text-xs font-bold text-stone-800 dark:text-stone-200 transition cursor-pointer"
                title={`Logged in as ${user.name} (+91 ${user.phone})`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => setOpenLoginModal(true)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition cursor-pointer"
                title="Sign In with Mobile (5-Min Free Call)"
              >
                <Phone className="w-3.5 h-3.5 text-amber-200" />
                <span>Sign In</span>
              </button>
            )
          )}

          {/* Partner Quick Mode Indicator */}
          {role === 'partner' && (
            <button
              onClick={() => setActiveTab('partner-portal')}
              className="bg-amber-100 dark:bg-amber-950/70 border border-amber-400 text-amber-900 dark:text-amber-200 text-xs font-bold px-3 py-1 rounded-full cursor-pointer flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Partner Console</span>
            </button>
          )}

          {/* Custom Domain & DNS Mapping Quick Access */}
          <button
            onClick={() => setOpenCustomDomainModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 cursor-pointer transition text-xs font-semibold"
            title="Custom Domain & DNS Mapping Manager (12rashi.com)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-bold">Domain & DNS</span>
          </button>

          {/* Google Play Store Release Center Quick Access */}
          <button
            onClick={() => setOpenPlayStoreModal(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 cursor-pointer transition text-xs font-semibold"
            title="Google Play Store Release Center & .AAB App Bundle Generator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-bold">Play Store</span>
          </button>

          {/* Dedicated English / Hindi Language Switcher */}
          <LanguageSwitcher />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer((prev) => !prev)}
              className="relative p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              title="Planetary Transits & Notifications"
            >
              <Bell className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifDrawer && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Transits & Alerts
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">Live Gochar</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mobile Push FCM Quick Action */}
                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                    <span className="font-semibold text-[11px]">Mobile FCM Push Alerts</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('daily-audio');
                      setShowNotifDrawer(false);
                    }}
                    className="text-orange-600 dark:text-orange-400 font-bold hover:underline text-[11px] cursor-pointer"
                  >
                    Configure 6:30 AM Push →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                activeTab === link.id
                  ? 'bg-orange-500 text-white'
                  : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}

          {/* Mobile Language Switcher */}
          <div className="pt-2 pb-1 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Language / भाषा:</span>
            <LanguageSwitcher />
          </div>

          {/* Lentlo Shortcuts in Mobile Menu */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setActiveTab('family-vault');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-orange-50 dark:bg-stone-800 border border-orange-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-orange-500" />
              <span className="truncate">Family Vault (10)</span>
            </button>

            <button
              onClick={() => {
                setOpenMembershipModal(true);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Astro Club VIP</span>
            </button>

            <button
              onClick={() => {
                setOpenFairBillingModal(true);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fair Billing</span>
            </button>

            <button
              onClick={() => {
                setOpenQrStandeeModal(true);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-600" />
              <span>QR Standees</span>
            </button>

            <button
              onClick={() => {
                setOpenOnboardingModal(true);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1.5 cursor-pointer col-span-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Take Interactive Platform Tour (Intro to Kundli, Pandits, Rashi Fal)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex gap-2">
            <button
              onClick={() => {
                setOpenLuckyWheel(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spin Wheel</span>
            </button>
            <button
              onClick={() => {
                setOpenLiveStream(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Satsang</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
