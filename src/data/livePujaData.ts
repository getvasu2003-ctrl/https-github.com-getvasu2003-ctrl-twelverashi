// Live Temple Puja, Daily Darshan & Subscriptions Data
// Connecting real humans to authentic sacred Vedic shrines across India

export interface LivePujaItem {
  id: string;
  title: string;
  hindiTitle: string;
  templeName: string;
  location: string;
  deity: string;
  image: string;
  embedStreamUrl: string; // Live stream embed link (YouTube Live / HLS / Live Darshan Feed)
  isCurrentlyLive: boolean;
  liveViewersCount: number;
  scheduleTime: string;
  tithiMuhurat: string;
  benefits: string[];
  oneTimeDakshina: number;
  monthlySubscriptionAvailable: boolean;
  monthlySubscriptionFee: number;
  subscriptionFrequency: 'Monthly (हर मास)' | 'Weekly (साप्ताहिक)';
  priestName: string;
  sankalpGuidelines: string;
  category: 'shiva' | 'hanuman' | 'vishnu_lakshmi' | 'devi' | 'navagraha';
}

export interface PujaBookingRecord {
  id: string;
  pujaId: string;
  pujaTitle: string;
  templeName: string;
  location: string;
  devoteeName: string;
  gotra: string;
  rashi: string;
  nakshatra?: string;
  sankalpWish: string;
  additionalFamilyMembers?: string[];
  bookingType: 'one_time' | 'monthly_subscription';
  amount: number;
  status: 'CONFIRMED' | 'ACTIVE_SUBSCRIPTION' | 'COMPLETED' | 'CANCELLED';
  date: string;
  nextRenewalDate?: string;
  certificateNumber: string;
  cashfreeOrderId?: string;
  liveStreamUrl: string;
}

export const LIVE_PUJAS_CATALOG: LivePujaItem[] = [
  {
    id: 'puja-kashi-rudra',
    title: 'Maha Rudrabhishek & Ganga Aarti Sankalp',
    hindiTitle: 'काशी विश्वनाथ महा रुद्राभिषेक एवं सायंकालीन गंगा आरती',
    templeName: 'Shri Kashi Vishwanath Jyotirlinga',
    location: 'Varanasi (Kashi), Uttar Pradesh',
    deity: 'Lord Shiva (Vishwanath)',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8Wc5V1T5n_x2tL-KashiVishwanath',
    isCurrentlyLive: true,
    liveViewersCount: 3840,
    scheduleTime: 'Daily Evening 6:30 PM - 8:00 PM IST',
    tithiMuhurat: 'Daily Sandhya Pradosh Kaal',
    benefits: [
      'Dissolves lingering illness, acute mental anxiety, and fear of premature accidents',
      'Neutralizes malefic Shani Sade Sati and Rahu-Ketu transits through Bilva Patra & milk abhishek',
      'Priests recite personal Name & Gotra in the sanctum sanctorum (Garbhagriha)',
    ],
    oneTimeDakshina: 501,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 499,
    subscriptionFrequency: 'Monthly (हर मास)',
    priestName: 'Acharya Vidyadhar Shastri (Kashi Peeth)',
    sankalpGuidelines: 'Devotee name and gotra invoked during the 11th Anuvaka of Sri Rudram Chamakam.',
    category: 'shiva',
  },
  {
    id: 'puja-mahakal-bhasma',
    title: 'Mahakaleshwar Bhasma Aarti & Navgraha Shanti',
    hindiTitle: 'उज्जैन महाकालेश्वर भस्म आरती व नवग्रह शांति हवन',
    templeName: 'Shri Mahakaleshwar Jyotirlinga',
    location: 'Ujjain, Madhya Pradesh',
    deity: 'Lord Mahakal & Navagrahas',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_Mahakaleshwar_Live_Official',
    isCurrentlyLive: true,
    liveViewersCount: 5210,
    scheduleTime: 'Daily Early Morning 4:00 AM - 6:00 AM IST',
    tithiMuhurat: 'Brahma Muhurat Amrit Bela',
    benefits: [
      'Supreme shield against Kaal Sarp Dosha, black magic delusions, and chronic blockages',
      'Transforms difficult planetary Mahadashas into peaceful spiritual awakening',
      'Sacred ash (Bhasma) consecrated in the name of the devotee family',
    ],
    oneTimeDakshina: 751,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 699,
    subscriptionFrequency: 'Monthly (हर मास)',
    priestName: 'Pt. Rameshwar Trivedi (Ujjain Peeth)',
    sankalpGuidelines: 'Name and gotra chanted during the special Navagraha Ahuti at the sacred Kunda.',
    category: 'shiva',
  },
  {
    id: 'puja-ayodhya-hanuman',
    title: 'Sankat Mochan Hanuman Path & Ram Lalla Aarti',
    hindiTitle: 'अयोध्या हनुमानगढ़ी संकटमोचन पाठ व रामलला मंगल आरती',
    templeName: 'Hanumangarhi & Shri Ram Janmabhoomi',
    location: 'Ayodhya Dham, Uttar Pradesh',
    deity: 'Lord Hanuman & Bhagavan Sri Ram',
    image: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_Ayodhya_RamMandir_Official',
    isCurrentlyLive: true,
    liveViewersCount: 7420,
    scheduleTime: 'Tuesdays & Saturdays 7:00 AM - 8:30 AM IST',
    tithiMuhurat: 'Mangal Shani Shanti Muhurat',
    benefits: [
      'Destroys legal cases, property disputes, and fear of hidden enemies',
      'Eradicates Manglik Dosha friction and provides courage in difficult career phases',
      'Full recitation of 100 Hanuman Chalisas with Sindoor Arpan in your family name',
    ],
    oneTimeDakshina: 351,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 299,
    subscriptionFrequency: 'Weekly (साप्ताहिक)',
    priestName: 'Mahant Ramdas Ji (Hanumangarhi)',
    sankalpGuidelines: 'Devotee prayer wish recited before the consecrated silver Gada of Lord Hanuman.',
    category: 'hanuman',
  },
  {
    id: 'puja-haridwar-ganga',
    title: 'Har Ki Pauri Maha Ganga Aarti & Pitra Shanti',
    hindiTitle: 'हरिद्वार हर की पौड़ी महा गंगा आरती व पितृ तृप्ति संकल्प',
    templeName: 'Ganga Sabha, Har Ki Pauri',
    location: 'Haridwar, Uttarakhand',
    deity: 'Mata Ganga & Lord Surya',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_GangaSabha_Haridwar_Live',
    isCurrentlyLive: true,
    liveViewersCount: 2950,
    scheduleTime: 'Daily Sunset 6:00 PM - 7:15 PM IST',
    tithiMuhurat: 'Surya Astha Sandhya Muhurat',
    benefits: [
      'Washes away subtle past karma and generational ancestral debts (Pitra Dosha)',
      'Brings deep mental peace, clarity of intellect, and emotional tranquility',
      'Sacred deep-daan (floating earthen ghee lamps) set afloat on holy Ganga in your name',
    ],
    oneTimeDakshina: 251,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 199,
    subscriptionFrequency: 'Monthly (हर मास)',
    priestName: 'Pt. Brijesh Mishra (Ganga Sabha)',
    sankalpGuidelines: 'Copper pot of holy Ganga water energized with Surya Arghya for the devotee.',
    category: 'devi',
  },
  {
    id: 'puja-salangpur-hanuman',
    title: 'Shri Kashtbhanjan Dev Daily Mangla & Rajbhog Darshan',
    hindiTitle: 'श्री कष्टभंजन देव हनुमानजी मंगल दर्शन व बाधा निवारण',
    templeName: 'Shri Kashtbhanjan Dev Hanumanji Mandir',
    location: 'Salangpur, Gujarat',
    deity: 'Kashtbhanjan Hanumanji',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_Salangpur_Kashtbhanjan_Live',
    isCurrentlyLive: true,
    liveViewersCount: 8930,
    scheduleTime: 'Daily Morning 5:30 AM & Afternoon 11:30 AM IST',
    tithiMuhurat: 'Mangla & Rajbhog Muhurat',
    benefits: [
      'World-renowned shrine for complete removal of severe grief, sorrow, and mental unrest',
      'Blesses families with rapid relief from stubborn debt, court cases, and chronic misery',
      'Special Maruti Yantra invoked in devotee’s name by Shastriji',
    ],
    oneTimeDakshina: 501,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 399,
    subscriptionFrequency: 'Monthly (हर मास)',
    priestName: 'Kothari Shastri Swami (Salangpur)',
    sankalpGuidelines: 'Direct Sankalpa performed in front of King of Salangpur Golden Altar.',
    category: 'hanuman',
  },
  {
    id: 'puja-kolhapur-lakshmi',
    title: 'Mahalakshmi Kanakadhara & Sri Suktam Maha Havan',
    hindiTitle: 'कोल्हापुर महालक्ष्मी कनकधारा व श्री सूक्त महाहवन',
    templeName: 'Shri Ambabai Mahalakshmi Temple',
    location: 'Kolhapur, Maharashtra',
    deity: 'Goddess Mahalakshmi',
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
    embedStreamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_Kolhapur_Mahalakshmi_Live',
    isCurrentlyLive: false,
    liveViewersCount: 1650,
    scheduleTime: 'Every Friday Evening 5:00 PM - 7:00 PM IST',
    tithiMuhurat: 'Shukravara Pradosh Kaal',
    benefits: [
      'Unlocks blocked financial cashflow and removes poverty karma (Daridrya Dosh)',
      'Bestows unceasing business expansion, new ventures, and commercial success',
      'Chanting of 16 verses of Rigvedic Sri Suktam with lotus seeds and cow ghee ahutis',
    ],
    oneTimeDakshina: 1100,
    monthlySubscriptionAvailable: true,
    monthlySubscriptionFee: 899,
    subscriptionFrequency: 'Monthly (हर मास)',
    priestName: 'Vidushi Sharada Joshi & Peeth Purohits',
    sankalpGuidelines: 'Sacred Kumkum and Akshata consecrated in devotee’s name during Sahasranamavali.',
    category: 'vishnu_lakshmi',
  },
];
