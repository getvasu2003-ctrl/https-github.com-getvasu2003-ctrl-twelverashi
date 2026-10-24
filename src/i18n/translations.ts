export type SupportedLanguage = 'en' | 'hi';

export interface TranslationDictionary {
  // Navigation tabs
  nav_astrologers: string;
  nav_panchang: string;
  nav_kundli: string;
  nav_ai_insights: string;
  nav_horoscope: string;
  nav_milan: string;
  nav_store: string;
  nav_archive: string;

  // Header quick buttons
  header_switch_chart: string;
  header_astro_club: string;
  header_spin_chakra: string;
  header_live_satsang: string;
  header_wallet: string;
  header_add: string;
  header_partner_console: string;
  header_partner_login: string;
  header_seeker_mode: string;

  // Welcome Free Trial Banner
  trial_badge: string;
  trial_no_recharge: string;
  trial_title: string;
  trial_desc: string;
  trial_cta: string;
  trial_fair_billing: string;

  // Astrologer Directory
  dir_title: string;
  dir_subtitle: string;
  dir_search_placeholder: string;
  dir_online_only: string;
  dir_sort_rating: string;
  dir_sort_experience: string;
  dir_sort_price_low: string;
  dir_sort_orders: string;
  dir_schedule_slot: string;
  dir_ask_question: string;
  dir_fair_billing_guarantee: string;
  dir_profile_btn: string;
  dir_intro_btn: string;
  dir_slot_btn: string;
  dir_chat_btn: string;
  dir_call_btn: string;
  dir_video_btn: string;
  dir_exp_years: string;
  dir_reviews: string;
  dir_languages: string;
  dir_verified: string;
  dir_per_min: string;

  // Kundli
  kundli_title: string;
  kundli_subtitle: string;
  kundli_btn_calc: string;
  kundli_full_name: string;
  kundli_gender: string;
  kundli_male: string;
  kundli_female: string;
  kundli_dob: string;
  kundli_tob: string;
  kundli_pob: string;
  kundli_download_pdf: string;
  kundli_save_profile: string;
  kundli_share: string;
  kundli_lagna: string;
  kundli_moon_sign: string;
  kundli_nakshatra: string;

  // Common
  common_online: string;
  common_busy: string;
  common_away: string;
  common_close: string;
  common_save: string;
  common_cancel: string;
  common_success: string;
  common_disclaimer: string;
  common_rights_reserved: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    // Navigation tabs
    nav_astrologers: 'Live Astrologers',
    nav_panchang: 'Daily Panchang',
    nav_kundli: 'Kundli & Charts',
    nav_ai_insights: 'AI Vedic Engine',
    nav_horoscope: '12 Rashis',
    nav_milan: '36 Guna Milan',
    nav_store: 'Remedies Shop',
    nav_archive: 'My Transcripts & Receipts',

    // Header
    header_switch_chart: 'Switch Chart',
    header_astro_club: 'Astro Club',
    header_spin_chakra: 'Spin Chakra',
    header_live_satsang: 'Live Satsang',
    header_wallet: 'Wallet',
    header_add: 'Add',
    header_partner_console: 'Partner Console',
    header_partner_login: 'Astrologer Login',
    header_seeker_mode: 'Seeker Mode',

    // Free Trial Banner
    trial_badge: 'New Seeker Welcome Gift',
    trial_no_recharge: 'No Wallet Recharge Required',
    trial_title: 'Your First 5 Minutes Are 100% Free (₹0)',
    trial_desc:
      'Consult top verified Vedic Astrologers, Tarot Readers, or KP masters live via phone call or chat. Experience authentic spiritual guidance with our Fair-Billing Guarantee™.',
    trial_cta: 'Claim ₹0 Free Call',
    trial_fair_billing: 'Fair-Billing Guarantee',

    // Directory
    dir_title: "India's Verified Astrologers & Acharyas",
    dir_subtitle: 'Live Audio, Video & Chat with Per-Second Transparent Metering',
    dir_search_placeholder: 'Search astrologer by name, language (Hindi, Bengali...), or topic...',
    dir_online_only: 'Online Only',
    dir_sort_rating: 'Sort: Highest Rated',
    dir_sort_experience: 'Sort: Most Experienced',
    dir_sort_price_low: 'Sort: Lowest Price',
    dir_sort_orders: 'Sort: Most Consultations',
    dir_schedule_slot: 'Schedule Private Slot (15/30m)',
    dir_ask_question: 'Ask a Question (₹99 Flat)',
    dir_fair_billing_guarantee: 'Fair-Billing Guarantee™ (Per-Sec Metering)',
    dir_profile_btn: 'Profile',
    dir_intro_btn: 'Intro',
    dir_slot_btn: 'Slot',
    dir_chat_btn: 'Chat',
    dir_call_btn: 'Call',
    dir_video_btn: 'Video',
    dir_exp_years: 'yrs exp',
    dir_reviews: 'reviews',
    dir_languages: 'Languages:',
    dir_verified: 'Verified',
    dir_per_min: '/min',

    // Kundli
    kundli_title: 'Vedic Janam Kundli & Birth Chart Analysis',
    kundli_subtitle: 'Precise Planetary Degrees, Lagna, Navamsha D9 & Vimshottari Mahadasha',
    kundli_btn_calc: 'Calculate Janam Kundli',
    kundli_full_name: 'Full Name',
    kundli_gender: 'Gender',
    kundli_male: 'Male',
    kundli_female: 'Female',
    kundli_dob: 'Date of Birth',
    kundli_tob: 'Time of Birth',
    kundli_pob: 'Place of Birth (City)',
    kundli_download_pdf: 'Download PDF Report',
    kundli_save_profile: 'Save to Profile',
    kundli_share: 'Share Chart',
    kundli_lagna: 'Lagna (Ascendant)',
    kundli_moon_sign: 'Moon Sign (Rashi)',
    kundli_nakshatra: 'Nakshatra',

    // Common
    common_online: 'Online',
    common_busy: 'Busy',
    common_away: 'Away',
    common_close: 'Close',
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_success: 'Success',
    common_disclaimer: 'Astrological Disclaimer',
    common_rights_reserved: 'All rights reserved.',
  },
  hi: {
    // Navigation tabs
    nav_astrologers: 'लाइव ज्योतिषी',
    nav_panchang: 'दैनिक पंचांग',
    nav_kundli: 'जन्म कुंडली',
    nav_ai_insights: 'एआई वैदिक गणना',
    nav_horoscope: '12 राशियां',
    nav_milan: '36 गुण मिलान',
    nav_store: 'रत्न एवं उपाय',
    nav_archive: 'परामर्श व रसीदें',

    // Header
    header_switch_chart: 'कुंडली बदलें',
    header_astro_club: 'एस्ट्रो क्लब',
    header_spin_chakra: 'चक्र घुमाएं',
    header_live_satsang: 'लाइव सत्संग',
    header_wallet: 'वॉलेट',
    header_add: 'जोड़ें',
    header_partner_console: 'ज्योतिषी पोर्टल',
    header_partner_login: 'ज्योतिषी लॉगिन',
    header_seeker_mode: 'उपयोगकर्ता मोड',

    // Free Trial Banner
    trial_badge: 'नए उपयोगकर्ताओं के लिए विशेष उपहार',
    trial_no_recharge: 'बिना किसी वॉलेट रिचार्ज के',
    trial_title: 'आपके पहले 5 मिनट 100% मुफ्त हैं (₹0)',
    trial_desc:
      'शीर्ष सत्यापित वैदिक ज्योतिषियों, टैरो रीडर्स या केपी विशेषज्ञों से फोन कॉल या चैट द्वारा तुरंत जुड़ें। हमारी फेयर-बिलिंग गारंटी™ के साथ प्रामाणिक आध्यात्मिक मार्गदर्शन का अनुभव करें।',
    trial_cta: '₹0 मुफ्त कॉल शुरू करें',
    trial_fair_billing: 'फेयर-बिलिंग गारंटी',

    // Directory
    dir_title: 'भारत के शीर्ष सत्यापित ज्योतिषी एवं आचार्य',
    dir_subtitle: 'प्रति-सेकंड पारदर्शी बिलिंग के साथ लाइव ऑडियो, वीडियो और चैट',
    dir_search_placeholder: 'ज्योतिषी का नाम, भाषा (हिंदी, अंग्रेजी...) या विशेषज्ञता खोजें...',
    dir_online_only: 'केवल ऑनलाइन',
    dir_sort_rating: 'क्रम: उच्चतम रेटिंग',
    dir_sort_experience: 'क्रम: अधिकतम अनुभव',
    dir_sort_price_low: 'क्रम: न्यूनतम दर',
    dir_sort_orders: 'क्रम: सर्वाधिक परामर्श',
    dir_schedule_slot: 'निजी समय बुक करें (15/30 मिनट)',
    dir_ask_question: 'एक प्रश्न पूछें (मात्र ₹99)',
    dir_fair_billing_guarantee: 'फेयर-बिलिंग गारंटी™ (प्रति-सेकंड बिलिंग)',
    dir_profile_btn: 'प्रोफाइल',
    dir_intro_btn: 'वीडियो',
    dir_slot_btn: 'स्लॉट',
    dir_chat_btn: 'चैट',
    dir_call_btn: 'कॉल',
    dir_video_btn: 'वीडियो',
    dir_exp_years: 'वर्ष अनुभव',
    dir_reviews: 'समीक्षाएं',
    dir_languages: 'भाषाएं:',
    dir_verified: 'सत्यापित',
    dir_per_min: '/मिनट',

    // Kundli
    kundli_title: 'वैदिक जन्म कुंडली एवं भविष्य फल विश्लेषण',
    kundli_subtitle: 'सटीक ग्रह स्थिति, लग्न, नवमांश (D9) एवं विंशोत्तरी महादशा',
    kundli_btn_calc: 'जन्म कुंडली बनाएं',
    kundli_full_name: 'पूरा नाम',
    kundli_gender: 'लिंग',
    kundli_male: 'पुरुष',
    kundli_female: 'महिला',
    kundli_dob: 'जन्म तिथि',
    kundli_tob: 'जन्म समय',
    kundli_pob: 'जन्म स्थान (शहर)',
    kundli_download_pdf: 'पीडीएफ रिपोर्ट डाउनलोड करें',
    kundli_save_profile: 'प्रोफाइल में सहेजें',
    kundli_share: 'कुंडली साझा करें',
    kundli_lagna: 'लग्न (प्रथम भाव)',
    kundli_moon_sign: 'चंद्र राशि',
    kundli_nakshatra: 'जन्म नक्षत्र',

    // Common
    common_online: 'ऑनलाइन',
    common_busy: 'व्यस्त',
    common_away: 'उपलब्ध नहीं',
    common_close: 'बंद करें',
    common_save: 'सहेजें',
    common_cancel: 'रद्द करें',
    common_success: 'सफल',
    common_disclaimer: 'ज्योतिषीय अस्वीकरण',
    common_rights_reserved: 'सर्वाधिकार सुरक्षित।',
  },
};
