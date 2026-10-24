import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { AstrologerDirectory } from './components/astrologers/AstrologerDirectory.tsx';
import { KundliGenerator } from './components/kundli/KundliGenerator.tsx';
import { AIInsightsEngine } from './components/ai/AIInsightsEngine.tsx';
import { HoroscopeSection } from './components/horoscope/HoroscopeSection.tsx';
import { KundliMilan } from './components/kundli/KundliMilan.tsx';
import { AstroStore } from './components/store/AstroStore.tsx';
import { PartnerDashboard } from './components/partner/PartnerDashboard.tsx';
import { PartnerLogin } from './components/partner/PartnerLogin.tsx';
import { LiveChatModal } from './components/consultation/LiveChatModal.tsx';
import { AudioCallModal } from './components/consultation/AudioCallModal.tsx';
import { VideoCallModal } from './components/consultation/VideoCallModal.tsx';
import { PaymentModal } from './components/wallet/PaymentModal.tsx';
import { DltSmsModal } from './components/dlt/DltSmsModal.tsx';
import { LuckyWheel } from './components/growth/LuckyWheel.tsx';
import { LiveStreamModal } from './components/growth/LiveStreamModal.tsx';
import { PanchangSection } from './components/panchang/PanchangSection.tsx';
import { ConsultationArchiveSection } from './components/consultation/ConsultationArchiveSection.tsx';
import { FamilyProfilesModal } from './components/family/FamilyProfilesModal.tsx';
import { ScheduledConsultationModal } from './components/consultation/ScheduledConsultationModal.tsx';
import { AsyncQuestionModal } from './components/consultation/AsyncQuestionModal.tsx';
import { WhatsAppReceiptModal } from './components/consultation/WhatsAppReceiptModal.tsx';
import { VideoIntroModal } from './components/astrologers/VideoIntroModal.tsx';
import { AstroClubModal } from './components/growth/AstroClubModal.tsx';
import { FairBillingModal } from './components/growth/FairBillingModal.tsx';
import { QrStandeeModal } from './components/growth/QrStandeeModal.tsx';
import { DynamicMetaManager } from './components/seo/DynamicMetaManager.tsx';
import { AstrologerProfileModal } from './components/astrologers/AstrologerProfileModal.tsx';
import { LegalComplianceModal } from './components/legal/LegalComplianceModal.tsx';
import { KundliPdfModal } from './components/kundli/KundliPdfModal.tsx';
import { CustomDomainModal } from './components/domain/CustomDomainModal.tsx';
import { PlayStoreDeployModal } from './components/deploy/PlayStoreDeployModal.tsx';
import { UserLoginModal } from './components/auth/UserLoginModal.tsx';
import { FamilyKundliVaultPage } from './components/family/FamilyKundliVaultPage.tsx';
import { NumerologyPage } from './components/numerology/NumerologyPage.tsx';
import { VastuPage } from './components/vastu/VastuPage.tsx';
import { LivePujaSection } from './components/puja/LivePujaSection.tsx';
import { KundliReportsStore } from './components/reports/KundliReportsStore.tsx';
import { AsyncQuestionHub } from './components/consultation/AsyncQuestionHub.tsx';
import { DailyAudioRashiFalPush } from './components/horoscope/DailyAudioRashiFalPush.tsx';
import { DoshaRemedyBookingModal } from './components/remedies/DoshaRemedyBookingModal.tsx';
import { PrashnaKundliSection } from './components/kundli/PrashnaKundliSection.tsx';
import { TatkalConsultationModal } from './components/consultation/TatkalConsultationModal.tsx';
import { ShubhShagunGiftCards } from './components/growth/ShubhShagunGiftCards.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { MyAstroProfile } from './components/profile/MyAstroProfile.tsx';

const MainAppContent: React.FC = () => {
  const {
    role,
    setRole,
    isPartnerAuthenticated,
    openQrStandeeModal,
    setOpenQrStandeeModal,
    selectedProfileAstrologer,
    openCustomDomainModal,
    setOpenCustomDomainModal,
    openPlayStoreModal,
    setOpenPlayStoreModal,
    openLoginModal,
    setOpenLoginModal,
    openAstroProfileModal,
    setOpenAstroProfileModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (
        paramTab &&
        [
          'astrologers',
          'panchang',
          'kundli',
          'prashna',
          'gift-cards',
          'ai-insights',
          'horoscope',
          'milan',
          'store',
          'archive',
          'family-vault',
          'login',
          'numerology',
          'vastu',
          'live-puja',
          'reports',
          'async-qa',
          'daily-audio',
          'my-profile',
        ].includes(paramTab)
      ) {
        return paramTab;
      }
    }
    return 'astrologers';
  });

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {/* If in Partner mode, check authentication */}
        {role === 'partner' ? (
          isPartnerAuthenticated ? (
            <PartnerDashboard />
          ) : (
            <PartnerLogin onBackToSeeker={() => setRole('user')} />
          )
        ) : (
          <>
            {activeTab === 'astrologers' && (
              <AstrologerDirectory
                onOpenPrashna={() => setActiveTab('prashna')}
                onOpenGiftCards={() => setActiveTab('gift-cards')}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'panchang' && (
              <PanchangSection onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'kundli' && (
              <KundliGenerator
                onOpenReports={() => setActiveTab('reports')}
                onOpenPrashna={() => setActiveTab('prashna')}
              />
            )}
            {activeTab === 'prashna' && (
              <PrashnaKundliSection onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'reports' && (
              <KundliReportsStore onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'gift-cards' && (
              <ShubhShagunGiftCards onRedeemSuccess={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'async-qa' && (
              <AsyncQuestionHub onOpenConsult={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'daily-audio' && (
              <DailyAudioRashiFalPush onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'ai-insights' && <AIInsightsEngine />}
            {activeTab === 'horoscope' && (
              <HoroscopeSection onOpenAudioBroadcast={() => setActiveTab('daily-audio')} />
            )}
            {activeTab === 'milan' && <KundliMilan />}
            {activeTab === 'store' && (
              <AstroStore
                onOpenLivePuja={() => setActiveTab('live-puja')}
                onOpenReports={() => setActiveTab('reports')}
                onOpenGiftCards={() => setActiveTab('gift-cards')}
              />
            )}
            {activeTab === 'live-puja' && (
              <LivePujaSection onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'archive' && <ConsultationArchiveSection />}
            {activeTab === 'family-vault' && (
              <FamilyKundliVaultPage
                onOpenAstrologers={() => setActiveTab('astrologers')}
                onOpenKundliMilan={() => setActiveTab('milan')}
              />
            )}
            {activeTab === 'login' && (
              <UserLoginModal
                isOpen={true}
                onClose={() => setActiveTab('astrologers')}
                isPage={true}
              />
            )}
            {activeTab === 'numerology' && (
              <NumerologyPage onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'vastu' && (
              <VastuPage onConsultClick={() => setActiveTab('astrologers')} />
            )}
            {activeTab === 'my-profile' && (
              <MyAstroProfile onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Interactive Consultation Modals */}
      <LiveChatModal />
      <AudioCallModal />
      <VideoCallModal />
      <TatkalConsultationModal />

      {/* Payment Gateway & Subscriptions */}
      <PaymentModal />

      {/* DLT SMS Compliance Modal */}
      <DltSmsModal />

      {/* Growth & Interactive Features */}
      <OnboardingModal onNavigate={(tab) => setActiveTab(tab)} />
      <LuckyWheel />
      <LiveStreamModal />

      {/* Lentlo Platform Differentiator Modals */}
      <FamilyProfilesModal />
      <ScheduledConsultationModal />
      <AsyncQuestionModal />
      <WhatsAppReceiptModal />
      <VideoIntroModal />
      <AstroClubModal />
      <FairBillingModal />
      <QrStandeeModal isOpen={openQrStandeeModal} onClose={() => setOpenQrStandeeModal(false)} />

      {/* Verified Astrologer Profile Modal */}
      <AstrologerProfileModal />

      {/* Mandatory Legal & IT Rules 2021 Compliance Center */}
      <LegalComplianceModal />

      {/* Comprehensive Janam Kundli Print / PDF Export */}
      <KundliPdfModal />

      {/* Contextual 1-Tap Dosha Shanti & Remedy Booking Modal */}
      <DoshaRemedyBookingModal />

      {/* Custom Domain & DNS Mapping Manager */}
      <CustomDomainModal isOpen={openCustomDomainModal} onClose={() => setOpenCustomDomainModal(false)} />

      {/* Google Play Store Release & .AAB Packaging Center */}
      <PlayStoreDeployModal isOpen={openPlayStoreModal} onClose={() => setOpenPlayStoreModal(false)} />

      {/* User Login & Mobile Number Verification Modal */}
      <UserLoginModal isOpen={openLoginModal} onClose={() => setOpenLoginModal(false)} />

      {/* My Astro Profile Dedicated Modal */}
      {openAstroProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setOpenAstroProfileModal(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <MyAstroProfile
              isModalView={true}
              onCloseModal={() => setOpenAstroProfileModal(false)}
              onNavigateTab={(tab) => {
                setOpenAstroProfileModal(false);
                setActiveTab(tab);
              }}
            />
          </div>
        </div>
      )}

      {/* Dynamic SEO Meta Tag & Schema.org Manager */}
      <DynamicMetaManager
        activeTab={activeTab}
        selectedAstrologer={selectedProfileAstrologer}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
