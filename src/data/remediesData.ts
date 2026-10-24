// Sacred Vedic Mantras, Stotras, Vrat (Fasting), Daan (Charity), and Non-Physical Astrological Remedies
// 100% Non-Physical Spiritual & Karma Guidance - No Physical Goods or Dropshipping

export interface VedicMantraRemedy {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'health' | 'wealth' | 'protection' | 'career' | 'relationship' | 'graha_shanti' | 'dosha_nivaran';
  deity: string;
  rulingPlanet: string;
  associatedRashis: string[];
  sanskritVerse: string;
  transliteration: string;
  meaning: string;
  benefits: string[];
  jaapCount: number; // e.g., 108 or 1008
  prescribedMala: string; // e.g. 'Rudraksha Mala', 'Kamal Gatta Mala', 'Tulsi Mala', 'Sphatik Mala', 'Mental Chanting (Manasika Japa)'
  bestTiming: string;
  rules: string[];
  audioGuide?: {
    duration: string;
    reader: string;
  };
  virtualSankalpAvailable?: boolean;
  sankalpOfferingDakshina?: number; // Dakshina for virtual priest sankalp at sacred peeths
  templeLocation?: string;
}

export interface PlanetaryVratRemedy {
  id: string;
  day: string;
  title: string;
  hindiTitle: string;
  rulingPlanet: string;
  deity: string;
  recommendedFor: string[];
  fastingRules: string[];
  foodsAllowed: string[];
  foodsAvoided: string[];
  breakingFastMuhurat: string;
  associatedMantra: string;
}

export interface VedicDaanSevaRemedy {
  id: string;
  title: string;
  hindiTitle: string;
  planetPacified: string;
  targetLifeSphere: string;
  sevaType: 'Gau Seva (Cow)' | 'Pakshi Seva (Birds)' | 'Shwan Seva (Dogs)' | 'Pipilika Seva (Ants)' | 'Annadaan (Food)' | 'Jal Seva (Water)' | 'Vastra Seva (Blankets)';
  actionGuidelines: string[];
  idealDayAndTime: string;
  karmicSignificance: string;
}

export interface DoshaKarmaRemedy {
  id: string;
  doshaName: string;
  hindiName: string;
  planetaryCause: string;
  symptoms: string[];
  nonPhysicalProtocols: string[];
  primaryMantra: string;
  dailyDiscipline: string[];
}

export const VEDIC_REMEDIES: VedicMantraRemedy[] = [
  {
    id: 'mantra-1',
    title: 'Maha Mrityunjaya Mantra',
    hindiTitle: 'महामृत्युंजय संजीवनी महामंत्र',
    category: 'health',
    deity: 'Lord Shiva (Tryambaka)',
    rulingPlanet: 'Saturn (Shani) & Rahu',
    associatedRashis: ['Makar (Capricorn)', 'Kumbh (Aquarius)', 'All 12 Rashis'],
    sanskritVerse: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat ||',
    meaning: 'We meditate upon the Three-Eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe cucumber is severed effortlessly from its vine, may we be liberated from fear of disease, premature mortality, and delusion, anchored in immortality.',
    benefits: [
      'Supreme life-shield against acute illness, unexpected accidents, and lingering fear',
      'Neutralizes severe Sade Sati, Maraka Dashas, and Rahu transits',
      'Restores cellular vitality and infuses Prana Shakti through sacred acoustic resonance',
    ],
    jaapCount: 108,
    prescribedMala: 'Authentic 5-Mukhi Rudraksha or Mental Chanting (Manasika Japa)',
    bestTiming: 'Brahma Muhurat (4:30 AM - 6:00 AM) or Sandhya Kaal (Sunset)',
    rules: [
      'Sit comfortably facing North or East on a wool or clean cloth asana.',
      'Keep a copper or brass tumbler of drinking water during chanting, then drink as energized Jal.',
      'Pronounce each syllable with reverent clarity; avoid rushing.',
    ],
    audioGuide: {
      duration: '11:08 Mins (108 Chants)',
      reader: 'Acharya Vidyadhar Shastri (Kashi Peeth)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 501,
    templeLocation: 'Kashi Vishwanath Temple, Varanasi',
  },
  {
    id: 'mantra-2',
    title: 'Gayatri Maha Mantra',
    hindiTitle: 'गायत्री वेदमंत्र (ऋग्वेद ३.६२.१०)',
    category: 'career',
    deity: 'Goddess Savitri & Surya Narayana',
    rulingPlanet: 'Sun (Surya)',
    associatedRashis: ['Singh (Leo)', 'Mesha (Aries)', 'All 12 Rashis'],
    sanskritVerse: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    transliteration: 'Om Bhur Bhuvah Swah Tat Savitur Varenyam Bhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayat ||',
    meaning: 'We meditate on the transcendental spiritual radiance of the divine Sun, the Creator of the three worlds. May that Supreme Illumination awaken and inspire our intellect and moral clarity.',
    benefits: [
      'Elevates willpower, academic concentration, and leadership presence',
      'Neutralizes Surya afflictions, parental misunderstandings, and bureaucratic hurdles',
      'Purifies ancestral karma and burns accumulated mental toxins',
    ],
    jaapCount: 108,
    prescribedMala: 'Tulsi Mala, Rakt Chandan Mala, or Finger Chanting (Kar Mala)',
    bestTiming: 'Sunrise (Surya Arghya Kaal) or Noon (Madhyahna)',
    rules: [
      'Face East in the morning; offer clean water to the rising sun with a copper vessel.',
      'Maintain pure vegetarian discipline and calm, quiet breathing.',
    ],
    audioGuide: {
      duration: '08:45 Mins (108 Chants)',
      reader: 'Pt. Rameshwar Dwivedi (Haridwar)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 251,
    templeLocation: 'Surya Kund, Haridwar',
  },
  {
    id: 'mantra-3',
    title: 'Maha Lakshmi Beej & Kanakadhara Stotram',
    hindiTitle: 'महालक्ष्मी कनकधारा धन-समृद्धि मंत्र',
    category: 'wealth',
    deity: 'Goddess Mahalakshmi & Lord Vishnu',
    rulingPlanet: 'Venus (Shukra) & Jupiter (Guru)',
    associatedRashis: ['Vrishabha (Taurus)', 'Tula (Libra)', 'Dhanu (Sagittarius)'],
    sanskritVerse: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥\nवन्दे पद्मकरां प्रसन्नवदनां सौभाग्यदां भाग्यदाम्।',
    transliteration: 'Om Shreem Hreem Kleem Shreem Siddha Lakshmyai Namah || Vande Padmakaram Prasanna-Vadanam Saubhagyadam Bhagyadam ||',
    meaning: 'Salutations to Supreme Goddess Mahalakshmi, radiant with lotuses in Her hands, who removes poverty consciousness and showers auspicious wealth, dharma, and lasting happiness.',
    benefits: [
      'Dissolves chronic debt cycles and clears commercial stagnation',
      'Attracts righteous income opportunities, business growth, and family prosperity',
      'Infuses the home with gentle beauty, mutual generosity, and peaceful vibes',
    ],
    jaapCount: 108,
    prescribedMala: 'Kamal Gatta (Lotus Seed) or Sphatik (Quartz) Mala',
    bestTiming: 'Friday evenings (Shukravara Sandhya) during Pradosh Kaal',
    rules: [
      'Light a pure cow ghee diya or sesame lamp in the North-East (Ishanya) corner.',
      'Wear clean, light pink or white attire while meditating.',
    ],
    audioGuide: {
      duration: '15:20 Mins (Full Stotram)',
      reader: 'Vidushi Malini Sharma',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 501,
    templeLocation: 'Mahalakshmi Temple, Kolhapur',
  },
  {
    id: 'mantra-4',
    title: 'Hanuman Vadvanal & Sankat Mochan Stotram',
    hindiTitle: 'हनुमान संकटमोचन व वज्र सुरक्षा कवच',
    category: 'protection',
    deity: 'Lord Hanuman (Panchamukhi)',
    rulingPlanet: 'Mars (Mangal) & Saturn (Shani)',
    associatedRashis: ['Mesha (Aries)', 'Vrishchik (Scorpio)', 'Makar', 'Kumbh'],
    sanskritVerse: 'ॐ हं हनुमते रुद्रात्मकाय हुं फट्॥\nअतुलितबलधामं हेमशैलाभदेहं दनुजवनकृशानुं ज्ञानिनामग्रगण्यम्।',
    transliteration: 'Om Ham Hanumate Rudratmakaya Hum Phat || Atulita-Bala-Dhamam Hema-Shailabha-Deham Danuja-Vana-Krishanum Jnaninam-Agra-Ganyam ||',
    meaning: 'Salutations to Lord Hanuman, the roar of Rudra, possessor of inexhaustible divine strength, illuminating as a golden mountain, foremost amongst seekers, dispeller of all fear.',
    benefits: [
      'Shields against psychic vulnerability, sudden panic, and malicious jealousy (Nazar)',
      'Subdues hostile legal delays, property conflicts, and courage deficits',
      'Provides peaceful relief during Shani Sade Sati, Dhaiya, and Mangal afflictions',
    ],
    jaapCount: 108,
    prescribedMala: 'Rudraksha Mala or Kar Mala (Finger Segments)',
    bestTiming: 'Tuesday or Saturday evenings, or before retiring to bed',
    rules: [
      'Chant facing South or East.',
      'Apply orange Sindoor tilak on forehead after completing recitation.',
    ],
    audioGuide: {
      duration: '09:30 Mins (108 Beej Chants)',
      reader: 'Swami Ramdas (Ayodhya)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 251,
    templeLocation: 'Hanumangarhi, Ayodhya',
  },
  {
    id: 'mantra-5',
    title: 'Navagraha Peeda Shanti Stotram',
    hindiTitle: 'नवग्रह पीड़ा शांति महास्तोत्र (वेदव्यास रचित)',
    category: 'graha_shanti',
    deity: 'The Nine Planetary Deities (Navagraha)',
    rulingPlanet: 'All 9 Planets (Surya to Ketu)',
    associatedRashis: ['All 12 Rashis'],
    sanskritVerse: 'जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्। तमोरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥\nदधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम्। नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥',
    transliteration: 'Japakusuma-Sankasham Kashyapeyam Mahadyutim | Tamorim Sarva-Papaghnam Pranatosmi Divakaram ||',
    meaning: 'Salutations to Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani, Rahu, and Ketu. May their planetary radiation harmonize with our soul and shower peace across our household.',
    benefits: [
      'Balances turbulence caused by malefic Mahadashas, Antardashas, or retrograde transits',
      'Harmonizes conflicting planetary forces in the native birth chart (Kundli)',
      'Restores domestic peace, emotional composure, and career momentum',
    ],
    jaapCount: 108,
    prescribedMala: 'Sphatik, Rudraksha, or Finger Counting',
    bestTiming: 'Sunday mornings or daily during evening twilight (Sandhya)',
    rules: [
      'Recite all 9 planetary verses in sacred scriptural sequence.',
      'Keep your heart free from vengeance and surrender outcomes to cosmic law.',
    ],
    audioGuide: {
      duration: '12:00 Mins',
      reader: 'Pandit Anant Shastri (Ujjain)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 1100,
    templeLocation: 'Mahakaleshwar Navagraha Temple, Ujjain',
  },
  {
    id: 'mantra-6',
    title: 'Shani Shanti & Dasharatha Shani Stotram',
    hindiTitle: 'शनि शांति एवं राजा दशरथ कृत शनि स्तोत्र',
    category: 'dosha_nivaran',
    deity: 'Lord Shani Dev & Lord Hanuman',
    rulingPlanet: 'Saturn (Shani)',
    associatedRashis: ['Makar (Capricorn)', 'Kumbh (Aquarius)', 'Karka (Cancer)', 'Vrishchik (Scorpio)'],
    sanskritVerse: 'ॐ शं शनैश्चराय नमः॥\nकोणस्थः पिङ्गलो बभ्रुः कृष्णो रौद्रोऽन्तको यमः।\nसौरिः शनैश्चरो मन्दः पिप्पलादेन संस्तुतः॥',
    transliteration: 'Om Sham Shanaishcharaya Namah || Konasthah Pingalo Babhruh Krishno Raudrontako Yamah | Saurih Shanaishcharo Mandah Pippaladena Samstutah ||',
    meaning: 'Salutations to Lord Shanaishchara, the son of the Sun god and Chhaya, the dispenser of cosmic justice. We invoke His ten divine names revealed by sage Pippalada for instant reprieve from misery.',
    benefits: [
      'Soothes acute mental pressure of Sade Sati, Kantaka Shani, and Ashtama Shani',
      'Instills patience, deep meditation, resilience, and karmic detachment',
      'Safeguards bones, nerves, and long-term career stability',
    ],
    jaapCount: 108,
    prescribedMala: 'Rudraksha Mala or Dark Sandalwood Mala',
    bestTiming: 'Saturday evenings after sunset',
    rules: [
      'Light a sesame oil or mustard oil lamp under a Peepal tree or home altar on Saturday.',
      'Treat service workers, domestic staff, and elders with profound humility and kindness.',
    ],
    audioGuide: {
      duration: '14:10 Mins',
      reader: 'Pt. Gangadhar Shastri (Shani Shingnapur)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 501,
    templeLocation: 'Shani Shingnapur, Maharashtra',
  },
  {
    id: 'mantra-7',
    title: 'Surya Aditya Hridaya Stotram',
    hindiTitle: 'आदित्य हृदय स्तोत्र (वाल्मीकि रामायण)',
    category: 'career',
    deity: 'Bhagavan Surya Narayana',
    rulingPlanet: 'Sun (Surya)',
    associatedRashis: ['Singh (Leo)', 'Mesha (Aries)', 'Dhanu (Sagittarius)'],
    sanskritVerse: 'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्। रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम्। उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः॥',
    transliteration: 'Tato Yuddha-Parishrantam Samare Chintaya Sthitam | Ravanam Chagrato Drishtva Yuddhaya Samupasthitam ||',
    meaning: 'Beholding Sri Rama weary on the battlefield, the venerable Sage Agastya imparted this timeless hymn to Lord Surya, granting instant invincibility, supreme vitality, and triumph over all adversaries.',
    benefits: [
      'Accelerates selection in government examinations, public sector promotions, and state honors',
      'Heals chronic low vitality, cardiac fatigue, and self-doubt',
      'Removes ancestral Pitra Dosha through respectful Surya Arghya discipline',
    ],
    jaapCount: 1,
    prescribedMala: 'Recitation with folded hands (Anjali Mudra)',
    bestTiming: 'Sunday sunrise after bathing',
    rules: [
      'Offer clean water with red flowers and a pinch of kumkum to the Sun God.',
      'Recite with clear enunciation standing on a clean mat.',
    ],
    audioGuide: {
      duration: '10:15 Mins',
      reader: 'Pt. Brijesh Mishra (Varanasi)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 351,
    templeLocation: 'Konark Sun Temple / Haridwar Ganga Ghat',
  },
  {
    id: 'mantra-8',
    title: 'Rahu-Ketu Peeda Shamana Mantra',
    hindiTitle: 'राहु-केतु पीड़ा शमन व कालसर्प शांति मंत्र',
    category: 'dosha_nivaran',
    deity: 'Lord Bhairava & Goddess Durga',
    rulingPlanet: 'Rahu & Ketu (Lunar Nodes)',
    associatedRashis: ['All 12 Rashis'],
    sanskritVerse: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः॥\nॐ स्रां स्रीं स्रौं सः केतवे नमः॥\nॐ नमः शिवाय शुभं शुभं कुरु कुरु शिवाय नमः ॐ॥',
    transliteration: 'Om Bhram Bhreem Bhroum Sah Rahave Namah || Om Sram Sreem Sroum Sah Ketave Namah ||',
    meaning: 'Salutations to the shadow planets Rahu and Ketu. Through Lord Shiva’s grace, may cosmic illusions, phantom fears, and karmic knots transform into spiritual awakening.',
    benefits: [
      'Relieves intense Kaal Sarp Dosha, phantom anxieties, and insomnia',
      'Protects against sudden reputational sabotage, addiction, and toxic deceptions',
      'Directs erratic psychic energies toward intuitive genius and spiritual moksha',
    ],
    jaapCount: 108,
    prescribedMala: 'Rudraksha Mala',
    bestTiming: 'Wednesday or Saturday night (during Rahu Kaal or Pradosh)',
    rules: [
      'Feed stray dogs or birds before initiating japa.',
      'Avoid gossip, harsh deceit, and intoxicating substances.',
    ],
    audioGuide: {
      duration: '11:45 Mins',
      reader: 'Acharya Trilokinath',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 751,
    templeLocation: 'Trimbakeshwar Shiva Temple, Nashik',
  },
  {
    id: 'mantra-9',
    title: 'Saraswati Vidya Beej Mantra',
    hindiTitle: 'सरस्वती विद्या व मेधा बुद्धि मंत्र',
    category: 'career',
    deity: 'Goddess Saraswati',
    rulingPlanet: 'Mercury (Budh) & Jupiter (Guru)',
    associatedRashis: ['Mithuna (Gemini)', 'Kanya (Virgo)', 'Meena (Pisces)'],
    sanskritVerse: 'ॐ ऐं वाग्देव्यै च विद्महे कामराजाय धीमहि। तन्नो देवी प्रचोदयात्॥\nॐ ऐं सरस्वत्यै नमः॥',
    transliteration: 'Om Aim Vagdevyai Cha Vidmahe Kama-Rajaya Dheemahi | Tanno Devi Prachodayat || Om Aim Saraswatyai Namah ||',
    meaning: 'We meditate on Goddess Saraswati, the embodiment of divine speech, wisdom, and arts. May the Goddess of Knowledge sharpen our memory, analytical intellect, and spiritual clarity.',
    benefits: [
      'Dissolves exam anxiety, brain fog, and lack of mental focus',
      'Enhances computational acumen, analytical writing, eloquence, and music',
      'Ideal for competitive test candidates, programmers, authors, and scholars',
    ],
    jaapCount: 108,
    prescribedMala: 'Sphatik (Quartz) Mala or White Sandalwood',
    bestTiming: 'Early morning before beginning academic studies or deep work',
    rules: [
      'Keep your study desk clean and free of clutter.',
      'Chant with an attitude of reverence toward books and learning instruments.',
    ],
    audioGuide: {
      duration: '07:15 Mins',
      reader: 'Dr. Sharada Devi (Sringeri)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 251,
    templeLocation: 'Sringeri Sharada Peetham, Karnataka',
  },
  {
    id: 'mantra-10',
    title: 'Swayamvara Parvathi Kalyana Mantra',
    hindiTitle: 'स्वयंवर पार्वती विवाह व दांपत्य सुख मंत्र',
    category: 'relationship',
    deity: 'Goddess Parvathi & Lord Shiva',
    rulingPlanet: 'Venus (Shukra) & Jupiter (Guru)',
    associatedRashis: ['Tula (Libra)', 'Vrishabha (Taurus)', 'Karka (Cancer)'],
    sanskritVerse: 'ॐ ह्रीं योगिनि योगिनि योगेश्वरि योग भयङ्करि सकल स्थावर जङ्गमस्य मुख हृदयं मम वशं आकर्षय आकर्षय नमः॥',
    transliteration: 'Om Hreem Yogini Yogini Yogeshwari Yoga-Bhayankari Sakala-Sthavara-Jangamasya Mukha-Hridayam Mama Vasham Akarshaya Akarshaya Namah ||',
    meaning: 'Salutations to Goddess Parvathi, the Divine Mother of sacred union. Grant a truthful, supportive, and spiritually aligned life companion, and resolve lingering friction in married life.',
    benefits: [
      'Removes recurring obstacles, delays, and mismatches in matchmaking',
      'Heals emotional discord, ego clashes, and misunderstandings between spouses',
      'Creates enduring mutual respect, domestic joy, and family harmony',
    ],
    jaapCount: 108,
    prescribedMala: 'Sphatik Mala or Lotus Seed Mala',
    bestTiming: 'Friday morning or Monday evening during Pradosh Kaal',
    rules: [
      'Offer a red or white flower mentally or to home Shiva-Parvathi altar.',
      'Maintain noble prayer intentions for family welfare rather than selfish coercion.',
    ],
    audioGuide: {
      duration: '10:45 Mins',
      reader: 'Vidushi Kalyani Sundaram (Madurai)',
    },
    virtualSankalpAvailable: true,
    sankalpOfferingDakshina: 501,
    templeLocation: 'Meenakshi Amman Temple, Madurai',
  },
];

// PLANETARY VRAT (FASTING) GUIDELINES
export const PLANETARY_VRAT_GUIDELINES: PlanetaryVratRemedy[] = [
  {
    id: 'vrat-somwar',
    day: 'Monday (सोमवार)',
    title: 'Somwar Vrat (Moon & Shiva Grace)',
    hindiTitle: 'सोमवार व्रत एवं चंद्र शांति',
    rulingPlanet: 'Moon (Chandra)',
    deity: 'Lord Shiva & Chandra Deva',
    recommendedFor: [
      'Calming emotional mood swings, depression, and severe anxiety',
      'Strengthening Mother’s health and domestic peace (Matri Sukha)',
      'Balancing watery elements and sleep patterns',
    ],
    fastingRules: [
      'Bathe in the morning, wear clean white attire, and make a silent sankalpa.',
      'Maintain silence (Mauna) or calm speech during fasting hours.',
      'Perform Abhishek of Shivling with fresh water or milk with raw sesame.',
    ],
    foodsAllowed: ['Milk', 'Fruits (Phalahar)', 'Curd', 'Makhana', 'Singhara flour'],
    foodsAvoided: ['Grains', 'Table salt (Rock salt/Sendha namak only if needed once)', 'Garlic & Onion', 'Spicy foods'],
    breakingFastMuhurat: 'After sighting the evening Moon or performing evening Sandhya Aarti',
    associatedMantra: 'ॐ नमः शिवाय | ॐ सों सोमाय नमः',
  },
  {
    id: 'vrat-mangalwar',
    day: 'Tuesday (मंगलवार)',
    title: 'Mangalwar Vrat (Mars & Hanuman Shakti)',
    hindiTitle: 'मंगलवार व्रत एवं मंगल दोष शमन',
    rulingPlanet: 'Mars (Mangal)',
    deity: 'Lord Hanuman & Mangal Deva',
    recommendedFor: [
      'Pacifying Manglik Dosha and removing marriage delays',
      'Overcoming lethargy, lack of courage, and blood-related issues',
      'Resolving long-standing land, property, or legal disputes',
    ],
    fastingRules: [
      'Wear red or saffron clothing during prayers.',
      'Recite Hanuman Chalisa 7 times and Bajrang Baan once.',
      'Do not consume salt at all throughout the 24 hours for maximum spiritual potency.',
    ],
    foodsAllowed: ['Jaggery (Gud)', 'Wheat halwa made with cow ghee', 'Milk', 'Bananas'],
    foodsAvoided: ['Salt (strictly avoided)', 'Sour items (lemon, tamarind)', 'Fried street foods'],
    breakingFastMuhurat: 'Sunset after lighting a mustard/sesame diya to Lord Hanuman',
    associatedMantra: 'ॐ अं अंगारकाय नमः | ॐ हं हनुमते नमः',
  },
  {
    id: 'vrat-budhwar',
    day: 'Wednesday (बुधवार)',
    title: 'Budhwar Vrat (Mercury & Ganesha Intellect)',
    hindiTitle: 'बुधवार व्रत एवं बुद्धि-व्यापार शुद्धि',
    rulingPlanet: 'Mercury (Budh)',
    deity: 'Lord Ganesha & Budha Deva',
    recommendedFor: [
      'Overcoming speech stammering, communication blockages, and nervy anxiety',
      'Boosting business ledger profits, accounting accuracy, and trade success',
      'Sharpening analytical thinking and school/college performance',
    ],
    fastingRules: [
      'Wear green clothing.',
      'Offer 21 blades of fresh green Durva grass to Lord Ganesha.',
      'Feed green fodder (Palak or grass) to a sacred cow.',
    ],
    foodsAllowed: ['Moong dal khichdi (taken once after sunset)', 'Green fruits', 'Milk'],
    foodsAvoided: ['Non-vegetarian food', 'Eggs', 'Excessive spicy/oily preparations'],
    breakingFastMuhurat: 'Evening after sunset prayer to Lord Ganesha',
    associatedMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः | ॐ गं गणपतये नमः',
  },
  {
    id: 'vrat-guruwar',
    day: 'Thursday (गुरुवार)',
    title: 'Guruwar Vrat (Jupiter & Vishnu Fortune)',
    hindiTitle: 'गुरुवार व्रत एवं बृहस्पति कृपा',
    rulingPlanet: 'Jupiter (Brihaspati)',
    deity: 'Lord Vishnu & Brihaspati Deva',
    recommendedFor: [
      'Receiving blessings for progeny (childbirth) and healthy children',
      'Attaining higher spiritual wisdom, philosophical peace, and righteous mentors',
      'Securing marital harmony and financial abundance',
    ],
    fastingRules: [
      'Wear yellow garments and apply yellow chandan or turmeric tilak.',
      'Do not wash hair or clip nails on Thursdays according to traditional folklore.',
      'Water a Banana tree (Kadali) or Peepal tree with turmeric water.',
    ],
    foodsAllowed: ['Chana dal dishes', 'Besan halwa / laddoos', 'Yellow fruits (papaya, bananas)', 'Milk with saffron'],
    foodsAvoided: ['Salt (strictly avoided in single meal)', 'Sour foods', 'Black or dark clothing'],
    breakingFastMuhurat: 'After listening to Brihaspativar Vrat Katha in evening',
    associatedMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः | ॐ नमो भगवते वासुदेवाय',
  },
  {
    id: 'vrat-shukrawar',
    day: 'Friday (शुक्रवार)',
    title: 'Shukrawar Vrat (Venus & Lakshmi Abundance)',
    hindiTitle: 'शुक्रवार व्रत एवं लक्ष्मी-वैभव प्राप्ति',
    rulingPlanet: 'Venus (Shukra)',
    deity: 'Goddess Lakshmi & Santoshi Mata',
    recommendedFor: [
      'Enhancing personal magnetism, artistic expression, and graceful charisma',
      'Curing aesthetic dissatisfaction, relationship bitterness, and luxury deficits',
      'Attracting sustained financial stability and home refinement',
    ],
    fastingRules: [
      'Wear clean white, cream, or pastel pink attire.',
      'Recite Sri Suktam or Kanakadhara Stotram 3 times.',
      'Strictly do not consume or purchase sour items (Khatta) on this day.',
    ],
    foodsAllowed: ['Kheer (rice cooked in sweet milk)', 'Sabudana kheer', 'White sweets', 'Fruits'],
    foodsAvoided: ['Sour foods (lemon, curd, pickles, amchur)', 'Tamarind', 'Stale food'],
    breakingFastMuhurat: 'Evening after lighting ghee lamp in Ishanya (North-East) corner',
    associatedMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः | ॐ महालक्ष्म्यै नमः',
  },
  {
    id: 'vrat-shanivar',
    day: 'Saturday (शनिवार)',
    title: 'Shanivar Vrat (Saturn Justice & Protection)',
    hindiTitle: 'शनिवार व्रत एवं शनि शांति',
    rulingPlanet: 'Saturn (Shani)',
    deity: 'Lord Shani & Lord Hanuman',
    recommendedFor: [
      'Neutralizing severe afflictions of Shani Sade Sati, Dhaiya, and Mahadasha',
      'Overcoming chronic delays, physical fatigue, and feeling overlooked',
      'Instilling deep patience, humility, and protection from premature downfall',
    ],
    fastingRules: [
      'Wear dark blue or black clothing.',
      'Light a mustard oil lamp under a Peepal tree without touching the tree after sunset.',
      'Help underprivileged manual laborers or elderly persons with quiet dignity.',
    ],
    foodsAllowed: ['Khichdi prepared with black urad dal (taken once at night)', 'Sesame sweets', 'Milk'],
    foodsAvoided: ['Non-veg', 'Alcohol', 'Excessive sweet confections', 'Red meat'],
    breakingFastMuhurat: 'Night after observing stars and offering prayers to Lord Shani',
    associatedMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः | ॐ शं शनैश्चराय नमः',
  },
  {
    id: 'vrat-ekadashi',
    day: 'Ekadashi (एकादशी - Shukla & Krishna Paksha)',
    title: 'Ekadashi Maha Vrat (Universal Spiritual Detox)',
    hindiTitle: 'एकादशी महाव्रत (पापनाशक व मोक्षप्रद)',
    rulingPlanet: 'Universal Planetary Harmony',
    deity: 'Bhagavan Sri Hari Vishnu',
    recommendedFor: [
      'Dissolving accumulated karmic debts and purifying the subtle nadis',
      'Sharpening concentration and bringing calmness to wandering senses',
      'Balancing all planetary transits through supreme devotion',
    ],
    fastingRules: [
      'Refrain from consuming all foodgrains and cereals for 24 hours.',
      'Spend the day in mantra chanting, Gita reading, or sacred reflection.',
      'Break fast (Parana) on Dwadashi tithi during the prescribed morning window.',
    ],
    foodsAllowed: ['Water (or Nirjala if practiced)', 'Fruits', 'Milk', 'Nuts', 'Buckwheat (Kuttu)'],
    foodsAvoided: ['Rice (strictly avoided)', 'Wheat', 'Pulses', 'Corn', 'Mustard seeds'],
    breakingFastMuhurat: 'Next day morning on Dwadashi before Harivasara concludes',
    associatedMantra: 'ॐ नमो नारायणाय | हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
  },
];

// VEDIC DAAN (CHARITY) & JEEV SEVA REMEDIES (STRICTLY NON-PHYSICAL / KARMIC)
export const VEDIC_DAAN_SEVA_REMEDIES: VedicDaanSevaRemedy[] = [
  {
    id: 'seva-gau',
    title: 'Gau Seva (Feeding Sacred Cows)',
    hindiTitle: 'गौ माता की सेवा एवं हरा चारा दान',
    planetPacified: 'Venus (Shukra), Jupiter (Guru) & Moon (Chandra)',
    targetLifeSphere: 'Removes domestic friction, debt, and childlessness karma',
    sevaType: 'Gau Seva (Cow)',
    actionGuidelines: [
      'Visit a nearby Goshala or street cow on Friday or Thursday mornings.',
      'Feed fresh green spinach, fodder grass, or whole wheat dough balls rolled in turmeric and jaggery.',
      'Gently caress the back of the cow and pray with humility for forgiveness of inadvertent errors.',
    ],
    idealDayAndTime: 'Friday or Thursday mornings before breakfast',
    karmicSignificance: 'Scriptures declare that 33 divine energies reside in Gomata; feeding cows directly dissolves malefic planetary sting without costly rituals.',
  },
  {
    id: 'seva-pakshi',
    title: 'Pakshi Seva (Feeding Wild Birds)',
    hindiTitle: 'पक्षियों को दाना व जल सेवा',
    planetPacified: 'Mercury (Budh), Saturn (Shani) & Rahu',
    targetLifeSphere: 'Relieves chronic career blockages, speech anxiety, and debt',
    sevaType: 'Pakshi Seva (Birds)',
    actionGuidelines: [
      'Place a flat earthen saucer of clean drinking water and mixed grains (Satnaja) on terrace or balcony.',
      'Include bajra, cracked wheat, green moong, and sunflower seeds.',
      'Never cage any birds in the home; freeing caged birds brings swift career liberation.',
    ],
    idealDayAndTime: 'Daily morning at sunrise',
    karmicSignificance: 'Birds are heralds of airy Mercury and Ketu. Their joyful calls upon receiving grain dissolve heavy psychological burdens.',
  },
  {
    id: 'seva-shwan',
    title: 'Shwan Seva (Feeding Stray Dogs)',
    hindiTitle: 'श्वान (कुत्ते) सेवा एवं भैरव कृपा',
    planetPacified: 'Ketu, Saturn (Shani) & Rahu',
    targetLifeSphere: 'Protection from black magic, sudden accidents, and toxic fears',
    sevaType: 'Shwan Seva (Dogs)',
    actionGuidelines: [
      'Feed plain sweet milk bread or rotis coated with mustard oil to black or brown stray dogs.',
      'Never kick, beat, or displace resting animals in your locality.',
      'Provide clean drinking water bowls outside your home during scorching summer months.',
    ],
    idealDayAndTime: 'Saturday or Tuesday evenings around sunset',
    karmicSignificance: 'Lord Bhairava’s vehicle is the dog; treating them kindly neutralizes dark Ketu delusions and ward off accidents.',
  },
  {
    id: 'seva-pipilika',
    title: 'Pipilika Seva (Feeding Ants & Micro-Creatures)',
    hindiTitle: 'चींटियों को आटा व चीनी (कसार) दान',
    planetPacified: 'Rahu & Ketu (Karmic Nodes)',
    targetLifeSphere: 'Neutralizes Kaal Sarp Dosha and unexpected financial traps',
    sevaType: 'Pipilika Seva (Ants)',
    actionGuidelines: [
      'Mix roasted whole wheat flour (Atta) with brown sugar or jaggery powder and a pinch of sesame seeds.',
      'Scatter small pinches near the roots of banyan or peepal trees where ants congregate.',
      'Avoid trampling over anthills and practice quiet mindfulness while scattering.',
    ],
    idealDayAndTime: 'Saturday mornings or Wednesday evenings',
    karmicSignificance: 'Feeding thousands of tiny beings generates disproportionate positive merit (Punya) to counteract heavy ancestral nodes.',
  },
  {
    id: 'seva-annadaan',
    title: 'Annadaan (Feeding the Underprivileged)',
    hindiTitle: 'अन्नदान (भूखों को भोजन सेवा)',
    planetPacified: 'Sun (Surya), Jupiter (Guru) & Saturn (Shani)',
    targetLifeSphere: 'Bestows long life, social honor, and freedom from disease',
    sevaType: 'Annadaan (Food)',
    actionGuidelines: [
      'Distribute fresh, warm, wholesome vegetarian meals (khichdi, poori-sabzi, or rice-dal) to hospital caretakers or needy persons.',
      'Offer food with two hands and respectful words: "Namaste, please accept this Prasad."',
      'Never donate leftover or spoiled food.',
    ],
    idealDayAndTime: 'Amavasya (New Moon), Purnima (Full Moon), or your Birthday / Anniversary',
    karmicSignificance: 'Taittiriya Upanishad declares "Annam Brahma" (Food is Divine); satisfying hunger cancels countless subtle horoscope blemishes.',
  },
  {
    id: 'seva-vastra',
    title: 'Vastra Seva (Donating Warm Clothes to Needy)',
    hindiTitle: 'वस्त्र दान (जरूरतमंदों को कम्बल व कपड़े)',
    planetPacified: 'Saturn (Shani) & Rahu',
    targetLifeSphere: 'Eases Sade Sati agony and protects from severe bone/joint afflictions',
    sevaType: 'Vastra Seva (Blankets)',
    actionGuidelines: [
      'Gift thick dark blankets, sweaters, or footwear to elderly rickshaw pullers, pavement dwellers, or security guards during winter.',
      'Ensure the clothes are durable, clean, and dignified.',
      'Do not take selfies or boast of the charity.',
    ],
    idealDayAndTime: 'Saturday during winters or on Shani Jayanti / Amavasya',
    karmicSignificance: 'Saturn represents the impoverished and hard-working. Bringing them warmth directly wins Shani Dev’s protective benevolence.',
  },
];

// MAJOR DOSHA NIVARAN KARMA PROTOCOLS (NON-PHYSICAL)
export const DOSHA_KARMA_PROTOCOLS: DoshaKarmaRemedy[] = [
  {
    id: 'dosha-sade-sati',
    doshaName: 'Shani Sade Sati & Dhaiya (7.5 Years Transit)',
    hindiName: 'शनि साढ़े साती एवं ढैय्या का आत्मिक उपाय',
    planetaryCause: 'Saturn transiting the 12th, 1st, or 2nd house from natal Moon (or 4th/8th house for Dhaiya)',
    symptoms: [
      'Unexplained professional delays despite intense hard work',
      'Mental isolation, melancholy, and feeling misunderstood by relatives',
      'Increased domestic responsibilities and health fatigue',
    ],
    nonPhysicalProtocols: [
      'Recite Hanuman Chalisa daily 3 to 7 times with focused surrender.',
      'Read Chapter 12 of Bhagavad Gita (Bhakti Yoga) every evening.',
      'Practice unconditional humility with junior employees, household helpers, and street cleaners.',
      'Refrain from alcohol, deceptive contracts, and arrogant displays of wealth on Saturdays.',
    ],
    primaryMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (१०८ जप प्रतिदिन)',
    dailyDiscipline: [
      'Sleep on a firm mattress and wake up before sunrise.',
      'Offer water to Peepal tree roots without touching the bark on Saturday mornings.',
      'Maintain an attitude of a detached witness rather than feeling victimized.',
    ],
  },
  {
    id: 'dosha-manglik',
    doshaName: 'Manglik Dosha (Kuja Dosha in Houses 1, 4, 7, 8, 12)',
    hindiName: 'मांगलिक दोष - आध्यात्मिक निवारण',
    planetaryCause: 'Aggressive Mars placed in sensitive houses affecting marriage, temper, and vitality',
    symptoms: [
      'Heated emotional flare-ups and impatience with spouse or partners',
      'Postponed marriage alliances and friction in final wedding negotiations',
      'Impulsive decisions causing physical bruising or property disputes',
    ],
    nonPhysicalProtocols: [
      'Observe salt-free Tuesday fasting with milk and jaggery.',
      'Recite Sundarkand every Tuesday evening or listen to it with family.',
      'Volunteer blood donation once a year if medically healthy (natural Mars pacifier).',
      'Cultivate patience: count to 10 before speaking when feeling irritated.',
    ],
    primaryMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः | ॐ अं अंगारकाय नमः',
    dailyDiscipline: [
      'Water a Tulsi plant daily with reverence (except Sundays).',
      'Practice slow Pranayama (Anulom-Vilom) for 15 minutes each morning.',
      'Speak sweet words to siblings and avoid harsh dominance.',
    ],
  },
  {
    id: 'dosha-kaal-sarp',
    doshaName: 'Kaal Sarp Dosha (All Planets Hemmed between Rahu & Ketu)',
    hindiName: 'कालसर्प दोष - महाकाल शरणागति',
    planetaryCause: 'All 7 classical planets positioned between shadow planets Rahu and Ketu',
    symptoms: [
      'Recurring dreams of snakes, water bodies, or ancestral spirits',
      'Sudden reversals just when reaching the finish line of a major victory',
      'Phobias, suspicious mindset, and unexplained restlessness',
    ],
    nonPhysicalProtocols: [
      'Chant Maha Mrityunjaya Mantra 108 times daily facing North.',
      'Offer raw milk and water to a Shivling on every Pradosh tithi (13th lunar day).',
      'Feed sweet rotis to stray dogs and scatter sugar-flour for ants weekly.',
      'Avoid keeping broken clocks, rusty metals, or unused electronic debris at home.',
    ],
    primaryMantra: 'ॐ नमः शिवाय शुभं शुभं कुरु कुरु शिवाय नमः ॐ',
    dailyDiscipline: [
      'Maintain pure vegetarian food on Nag Panchami and Mondays.',
      'Practice deep surrender: accept that delays are divine redirections.',
      'Never harm any reptile or serpent in nature.',
    ],
  },
  {
    id: 'dosha-pitra',
    doshaName: 'Pitra Dosha (Ancestral Karmic Debt)',
    hindiName: 'पितृ दोष - सेवा एवं तर्पण साधना',
    planetaryCause: 'Sun or Moon afflicted by Rahu, Ketu, or Saturn in 9th, 5th, or 1st house',
    symptoms: [
      'Chronic obstacles in lineage continuation or child health',
      'Persistent financial drain despite decent career income',
      'Lack of peace in family gatherings and ancestral properties',
    ],
    nonPhysicalProtocols: [
      'Offer clean water to the rising Sun daily mixed with raw rice and black sesame seeds (Pitra Arghya).',
      'Feed cows and crows on every Amavasya (New Moon) with home-cooked khichdi or poori.',
      'Speak respectfully of departed ancestors and perform heartfelt prayers for their soul peace.',
      'Plant a Peepal, Banyan, or Neem sapling in a public park and nurture it.',
    ],
    primaryMantra: 'ॐ पितृभ्यो नमः | ॐ नमो भगवते वासुदेवाय',
    dailyDiscipline: [
      'Touch the feet of living parents or elder mentors every morning.',
      'Keep your speech free from spite toward elder generations.',
      'Light a mustard oil diya facing South during sunset on Amavasya.',
    ],
  },
];
