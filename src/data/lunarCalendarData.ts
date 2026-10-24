import { LunarPhaseEvent } from '../types/astrology.ts';

export const LUNAR_PHASE_EVENTS: LunarPhaseEvent[] = [
  // --- 2026 UPCOMING DATES ---
  {
    id: 'lunar-2026-10-10',
    nameEn: 'Sarva Pitru Amavasya (Mahalaya Amavasya)',
    nameHi: 'सर्वपितृ अमावस्या (महालया)',
    nameSa: 'सर्वपितृ मोक्ष अमावस्या',
    type: 'new_moon',
    date: '2026-10-10',
    formattedDate: 'Saturday, 10 Oct 2026',
    vedicMonth: 'Ashwin (अश्विन कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 09 Oct 07:18 PM • Ends: 10 Oct 05:40 PM',
    nakshatra: 'Hasta & Chitra',
    illuminationPct: 0,
    deity: 'Lord Yama, Pitru Devas & Mahakali',
    spiritualSignificance:
      'The supreme annual culmination of Pitru Paksha. It provides final liberation and ancestral satisfaction for all departed souls whose death tithi is unknown. Gratifying ancestors on this day cleanses Pitru Dosha and bestows long lineage, family peace, and financial blessings.',
    recommendedRituals: [
      'Sarva Pitru Shraddha & Tarpana with black sesame (Kala Til), barley, and Kusha grass',
      'Panchagavya Snan and feeding cows (Gau Seva), crows, and dogs before noon',
      'Brahmabhoj: Feeding Satvik meal to 5 Brahmins or needy people',
      'Lighting a mustard oil lamp facing South at sunset to guide departed souls',
    ],
    prescribedDaan: [
      'Black sesame seeds (Kala Til)',
      'Raw grain bags (Anna Daan)',
      'Copper vessels & woolen clothes',
      'Panch Daan (Salt, Ghee, Jaggery, Gold/Silver, Clothes)',
    ],
    mantra: {
      sanskrit: 'ॐ पितृगणाय विद्महे जगतधारिणाय धीमहि तन्नो पितृ प्रचोदयात्',
      transliteration: 'Om Pitruganaya Vidmahe Jagat-dharinaya Dhimahi Tanno Pitru Prachodayat',
      meaning: 'We meditate upon the ancestral spirits who sustain the universal lineage; may they illuminate and bless our intellect.',
    },
    keyConsultationFocus:
      'Pitru Dosha diagnostic reading, resolving unexplained domestic discord, clearing delays in progeny or marriage caused by ancestral debts.',
    dosAndDonts: {
      dos: [
        'Perform Tarpana between 11:30 AM and 01:30 PM (Abhijit/Aparahna Kaal)',
        'Maintain absolute sattvic diet and practice forgiveness',
        'Offer food and water to birds and cows',
      ],
      donts: [
        'Do not start new business inaugurations or sign real estate deeds today',
        'Avoid hair cutting, nail trimming, and non-vegetarian food',
        'Do not engage in egoistic arguments or worldly boastfulness',
      ],
    },
  },
  {
    id: 'lunar-2026-10-25',
    nameEn: 'Sharad Purnima (Kojagari Lakshmi Purnima)',
    nameHi: 'शरद पूर्णिमा (कोजागरी लक्ष्मी पूजा)',
    nameSa: 'रास पूर्णिमा / कौमुदी महोत्सव',
    type: 'full_moon',
    date: '2026-10-25',
    formattedDate: 'Sunday, 25 Oct 2026',
    vedicMonth: 'Ashwin (अश्विन शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 24 Oct 11:28 PM • Ends: 25 Oct 09:44 PM',
    nakshatra: 'Ashwini & Bharani',
    illuminationPct: 100,
    deity: 'Goddess Mahalakshmi, Chandra Deva & Lord Krishna',
    spiritualSignificance:
      'The moon shines in its complete 16 divine kalas (splendors). Celestial nectar (Amrit) is believed to rain down upon Earth. Goddess Mahalakshmi roams the earth asking "Ko Jagarti?" (Who is awake?), blessing vigilant seekers with immense wealth, radiant health, and spiritual bliss.',
    recommendedRituals: [
      'Prepare sweet rice milk kheer and place it under direct moonlight overnight to absorb divine nectar',
      'Kojagari Lakshmi Puja at midnight with 16 lamps, lotus flowers, and betel leaves',
      'Chandra Arghya with raw milk and silver vessel while chanting the Chandra Beej Mantra',
      'Satyanarayan Vrat and Katha during evening twilight',
    ],
    prescribedDaan: [
      'Cow milk, ghee, and freshly prepared kheer',
      'Silver coins or silver ornaments to priests',
      'White clothes, pearls, and camphor (Karpur)',
    ],
    mantra: {
      sanskrit: 'ॐ श्रीं ह्रीं क्लीं ऐं सौं ॐ ह्रीं क ए ई ल ह्रीं ह स क ह ल ह्रीं सकल ह्रीं सौं ऐं क्लीं ह्रीं श्रीं',
      transliteration: 'Om Shreem Hreem Kleem Mahalakshmaye Namah • Om Som Somaya Namah',
      meaning: 'Salutations to the Supreme Goddess Lakshmi who bestows wealth, nourishment, and sovereign tranquility.',
    },
    keyConsultationFocus:
      'Wealth attraction muhurat, Kuber-Lakshmi yantra activation, relationship harmony & Chandra dosha calming consultation.',
    dosAndDonts: {
      dos: [
        'Stay awake (Jagram) during midnight meditation and Lakshmi Stotram chanting',
        'Consume the moon-blessed Kheer as Prasad the following morning',
        'Wear white or silk attire during evening rituals',
      ],
      donts: [
        'Avoid consuming sour, spicy, or stale foods on this holy night',
        'Do not sleep during the midnight Brahma window if observing Kojagari Vrat',
        'Avoid negative speech, harsh tone, or borrowing money',
      ],
    },
  },
  {
    id: 'lunar-2026-11-09',
    nameEn: 'Kartika Amavasya (Diwali Maha Lakshmi Amavasya)',
    nameHi: 'कार्तिक अमावस्या (दीपावली महालक्ष्मी पूजन)',
    nameSa: 'दीपावली / सुखरात्रि अमावस्या',
    type: 'new_moon',
    date: '2026-11-09',
    formattedDate: 'Monday, 09 Nov 2026',
    vedicMonth: 'Kartika (कार्तिक कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 08 Nov 04:35 PM • Ends: 09 Nov 03:10 PM',
    nakshatra: 'Swati & Vishakha',
    illuminationPct: 0,
    deity: 'Maha Lakshmi, Lord Ganesha & Lord Kubera',
    spiritualSignificance:
      'The sacred night when supreme light triumphs over primordial darkness. Despite being the darkest Amavasya of the year, it is transformed into the brightest spiritual festival through deepams. Mahalakshmi emerged from the churning of the cosmic ocean on this tithi.',
    recommendedRituals: [
      'Chopda Pujan (consecration of business accounting books and vaults) in Shubh Lagna',
      'Grand Maha Lakshmi & Kuber Puja during Sthir Lagna (Pradosh / Vrishabha Lagna)',
      'Lighting 21 clay mustard oil and cow ghee lamps (Deep Daan) across threshold',
      'Recitation of Sri Suktam and Kanakadhara Stotram 11 times',
    ],
    prescribedDaan: [
      'Gold/Silver coins to daughters and temple trusts',
      'Warm clothes and sweets to underprivileged families',
      'Deep Daan at riverside, peepal tree, and local temple',
    ],
    mantra: {
      sanskrit: 'ॐ श्रीं महालक्ष्म्यै नमः • ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये नमः',
      transliteration: 'Om Shreem Mahalakshmyai Namah • Om Yakshaya Kuberaya Vaishravanaya Dhanadhanyadhipataye Namah',
      meaning: 'Salutations to Goddess Lakshmi and Lord Kubera, the eternal custodians of spiritual and material abundance.',
    },
    keyConsultationFocus:
      'Exact Sthir Lagna calculation for ledger pujan, annual financial astrology forecast, auspicious investment timing.',
    dosAndDonts: {
      dos: [
        'Cleanse all entrances with gangajal, draw swastikas with kumkum and rice flour',
        'Keep one Akhand Deep burning through the entire night',
        'Consult your Acharya for the specific minute of your Vrishabha Lagna entry',
      ],
      donts: [
        'Do not leave any corner of the premises dark or neglected',
        'Avoid gambling, intoxication, or quarreling during Lakshmi puja',
        'Never lend money or hand over broomsticks after sunset',
      ],
    },
  },
  {
    id: 'lunar-2026-11-24',
    nameEn: 'Kartika Purnima (Dev Diwali & Tripurari Purnima)',
    nameHi: 'कार्तिक पूर्णिमा (देव दीपावली व त्रिपुरारी पूर्णिमा)',
    nameSa: 'त्रिपुरारी पूर्णिमा / महा कार्तिकी',
    type: 'full_moon',
    date: '2026-11-24',
    formattedDate: 'Tuesday, 24 Nov 2026',
    vedicMonth: 'Kartika (कार्तिक शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 23 Nov 08:15 PM • Ends: 24 Nov 06:42 PM',
    nakshatra: 'Krittika',
    illuminationPct: 100,
    deity: 'Lord Shiva (Tripurantaka), Lord Vishnu (Matsya Avatar) & Ganga Mata',
    spiritualSignificance:
      'Lord Shiva annihilated the three demon citadels (Tripurasura) on this day. In gratitude, all 33 crore celestial gods descended to the Ghats of Kashi (Varanasi) to celebrate Dev Diwali. A single bath in a holy river equals thousands of Ashwamedha Yagnas.',
    recommendedRituals: [
      'Dev Diwali Deep Daan: Light lamps on riverbanks, ponds, and under Tulsi plants',
      'Holy dip (Kartika Snan) at sunrise in Ganga or water sanctified with Ganga jal',
      'Rudra Abhishekam with sugarcane juice and cow milk for Lord Shiva',
      'Satyanarayan Katha and Matsya Avatar Jayanti remembrance',
    ],
    prescribedDaan: [
      'Ghee lamps and cotton wicks to Shiva temples',
      'Til (sesame), amla (Indian gooseberry), and warm blankets',
      'Food donation (Annadaan) to sadhus and pilgrims',
    ],
    mantra: {
      sanskrit: 'ॐ नमः शिवाय • ॐ नमो भगवते वासुदेवाय',
      transliteration: 'Om Namah Shivaya • Om Namo Bhagavate Vasudevaya',
      meaning: 'Salutations to the Supreme Lord Shiva, the destroyer of tri-fold ignorance, and Lord Vishnu who protects all cosmos.',
    },
    keyConsultationFocus:
      'Spiritual karma clearing, planetary debt removal, auspicious property possession (Griha Pravesh) muhurat analysis.',
    dosAndDonts: {
      dos: [
        'Offer 365 wicks deepam to Lord Vishnu for clearing year-long omissions',
        'Feed cows with fresh green grass and jaggery',
        'Chant the Vishnu Sahasranama with family',
      ],
      donts: [
        'Avoid consuming brinjal, urad dal, or heavy fried items',
        'Do not disrespect water bodies or leave lamps extinguished prematurely',
        'Avoid idle chatter during twilight prayers',
      ],
    },
  },
  {
    id: 'lunar-2026-12-08',
    nameEn: 'Margashirsha Amavasya (Bhauma Amavasya)',
    nameHi: 'मार्गशीर्ष अमावस्या (भौम अमावस्या)',
    nameSa: 'मार्गशीर्ष दर्श अमावस्या',
    type: 'new_moon',
    date: '2026-12-08',
    formattedDate: 'Tuesday, 08 Dec 2026',
    vedicMonth: 'Margashirsha (मार्गशीर्ष कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 08 Dec 04:15 AM • Ends: 09 Dec 02:40 AM',
    nakshatra: 'Jyeshtha & Mula',
    illuminationPct: 0,
    deity: 'Lord Hanuman, Lord Subramanya & Pitru Devas',
    spiritualSignificance:
      'Because it coincides with Mangalvara (Tuesday), it creates the powerful Bhauma Amavasya yoga. Highly effective for liberating individuals from severe debt traps (Rina Vimochana), property disputes, and malefic Mars / Rahu-Ketu Gandanta afflictions.',
    recommendedRituals: [
      'Recitation of Rina Vimochana Mangala Stotram 21 times',
      'Offering sindoor, jasmine oil (Chameli tel), and betel leaf garland to Lord Hanuman',
      'Pitru Tarpana with black sesame and copper vessel at noon',
      'Chanting Hanuman Chalisa and Sundarkand in the evening',
    ],
    prescribedDaan: [
      'Red lentils (Masoor dal) and jaggery to construction laborers',
      'Copper utensils and red cloth to Brahmin priests',
      'Food to stray dogs and monkeys',
    ],
    mantra: {
      sanskrit: 'ॐ मंगलाय नमः • ॐ हं हनुमते रुद्रात्मकाय हुं फट्',
      transliteration: 'Om Mangalaya Namah • Om Ham Hanumate Rudratmakaya Hum Phat',
      meaning: 'Salutations to Mars and the radiant Rudra incarnation Lord Hanuman, who destroys all worldly debts and perils.',
    },
    keyConsultationFocus:
      'Debt recovery strategies, land ownership litigation remedies, Manglik Dosha pacification, and blood pressure/vitality remedies.',
    dosAndDonts: {
      dos: [
        'Light a four-faced mustard oil lamp at Hanuman temple after sunset',
        'Perform silent contemplation and seek blessings from maternal uncles',
        'Fast on salt-free fruits or milk if physically able',
      ],
      donts: [
        'Avoid anger, heated verbal arguments, and road rage',
        'Do not purchase iron products or leather items today',
        'Avoid undertaking surgeries or risky adventures',
      ],
    },
  },
  {
    id: 'lunar-2026-12-23',
    nameEn: 'Margashirsha Purnima (Dattatreya Jayanti)',
    nameHi: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती)',
    nameSa: 'श्री दत्तात्रेय जयंती पूर्णिमा',
    type: 'full_moon',
    date: '2026-12-23',
    formattedDate: 'Wednesday, 23 Dec 2026',
    vedicMonth: 'Margashirsha (मार्गशीर्ष शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 23 Dec 05:40 AM • Ends: 24 Dec 03:52 AM',
    nakshatra: 'Mrigashirsha & Ardra',
    illuminationPct: 100,
    deity: 'Lord Dattatreya (Trimurti Incarnation) & Lord Chandra',
    spiritualSignificance:
      'The appearance day of Lord Dattatreya, the combined incarnation of Brahma, Vishnu, and Shiva. Lord Krishna praises Margashirsha as his own self in the Bhagavad Gita ("Māsānāṁ Mārga-śhīrṣho ’ham"). Supreme day for spiritual initiation, Guru blessing, and academic brilliance.',
    recommendedRituals: [
      'Dattatreya Stotram and Gurucharitra path at dawn',
      'Chandra Darshan with sweet milk arghya in evening',
      'Offering chana dal, jaggery, and yellow flowers to Lord Dattatreya',
      'Annapurna Vrat observance for perpetual abundance in the home kitchen',
    ],
    prescribedDaan: [
      'Grains, flour, and groceries to Annakshetra or temple kitchens',
      'Yellow garments, spiritual scriptures, and notebooks to students',
      'Feeding cows and dogs (the four companions of Lord Dattatreya)',
    ],
    mantra: {
      sanskrit: 'ॐ दिगंबराय विद्महे अवधूताय धीमहि तन्नो दत्तः प्रचोदयात् • ॐ द्रां दत्तात्रेयाय नमः',
      transliteration: 'Om Digambaraya Vidmahe Avadhutaya Dhimahi Tanno Dattah Prachodayat',
      meaning: 'We meditate upon the sovereign unclad master Dattatreya; may that supreme Avadhuta kindle our inner intellect.',
    },
    keyConsultationFocus:
      'Higher education hurdles, career guidance with Guru-Jupiter remedies, finding a spiritual mentor, child focus improvement.',
    dosAndDonts: {
      dos: [
        'Express gratitude to teachers, mentors, and parents early in the morning',
        'Keep water and grain bowls on rooftops for birds',
        'Meditate on the unity of Brahma, Vishnu, and Shiva',
      ],
      donts: [
        'Avoid cynicism, questioning sacred traditions disrespectfully',
        'Do not waste food in any form',
        'Avoid turning away any mendicant who visits your door',
      ],
    },
  },

  // --- 2027 UPCOMING DATES ---
  {
    id: 'lunar-2027-01-07',
    nameEn: 'Pausha Amavasya',
    nameHi: 'पौष अमावस्या',
    nameSa: 'पौष कृष्ण अमावस्या',
    type: 'new_moon',
    date: '2027-01-07',
    formattedDate: 'Thursday, 07 Jan 2027',
    vedicMonth: 'Pausha (पौष कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 06 Jan 06:20 PM • Ends: 07 Jan 04:45 PM',
    nakshatra: 'Purva Ashadha',
    illuminationPct: 0,
    deity: 'Surya Deva, Lord Brihaspati & Pitrus',
    spiritualSignificance:
      'Coinciding with Guruvara (Thursday) in the mystical winter month of Pausha. Dedicated to harmonizing solar vitality and ancestral peace just before Makar Sankranti. Excellent for curing health ailments related to bone, eyes, and heart.',
    recommendedRituals: [
      'Surya Arghya with copper lota containing red chandan, akshat, and water at sunrise',
      'Aditya Hridaya Stotram recitation three times facing East',
      'Pitru Tarpana with black sesame and kush grass',
      'Lighting cow ghee lamps under a Peepal tree',
    ],
    prescribedDaan: [
      'Warm woolen shawls and blankets to the elderly',
      'Jaggery, sesame laddoos, and pure cow ghee',
      'Yellow grains and turmeric to temple priests',
    ],
    mantra: {
      sanskrit: 'ॐ घृणिः सूर्याय नमः • ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      transliteration: 'Om Ghrinih Suryaya Namah • Om Graam Greem Graum Sah Gurave Namah',
      meaning: 'Salutations to the luminous Sun Lord who sustains all vitality, and Lord Brihaspati the guru of gods.',
    },
    keyConsultationFocus:
      'Father-son ancestral alignment, chronic health diagnostics, government job / authority recognition muhurat.',
    dosAndDonts: {
      dos: [
        'Wake up before sunrise (Brahma Muhurat) and bathe in warm water with holy gangajal',
        'Serve hot meals to vulnerable elderly people',
        'Maintain quiet introspection',
      ],
      donts: [
        'Do not engage in legal conflict or courtroom confrontations today',
        'Avoid cold or refrigerated food',
        'Do not speak ill of fatherly figures or lineage elders',
      ],
    },
  },
  {
    id: 'lunar-2027-01-22',
    nameEn: 'Pausha Purnima (Shakambhari Purnima & Pushya Nakshatra)',
    nameHi: 'पौष पूर्णिमा (शाकम्भरी पूर्णिमा)',
    nameSa: 'शाकम्भरी नवरात्रि समापन पूर्णिमा',
    type: 'full_moon',
    date: '2027-01-22',
    formattedDate: 'Friday, 22 Jan 2027',
    vedicMonth: 'Pausha (पौष शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 21 Jan 04:12 PM • Ends: 22 Jan 02:30 PM',
    nakshatra: 'Pushya (The King of Nakshatras)',
    illuminationPct: 100,
    deity: 'Goddess Shakambhari & Chandra Deva',
    spiritualSignificance:
      'The commencement of the holy Magha Snan month and the grand culmination of Shakambhari Navratri. Falling under the supremely benevolent Pushya Nakshatra on a Friday (Shukravara), it forms an extraordinary Amrit Siddhi Yoga for purchasing gold, property, and medicinal herbs.',
    recommendedRituals: [
      'Magha Snan resolution at dawn in sacred water',
      'Shakambhari Devi puja offering green leafy vegetables, fruits, and lotus flowers',
      'Satyanarayan Vrat and sweet panchamrit preparation',
      'Chandra Darshan with arghya at nightfall',
    ],
    prescribedDaan: [
      'Fresh green vegetables, grains, and fruits to community kitchens',
      'White sweets, silver items, and perfumed oils to mothers/women',
      'Support to local farmers and cows',
    ],
    mantra: {
      sanskrit: 'ॐ शाकम्भरी देव्यै नमः • ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      transliteration: 'Om Shakambhari Devyai Namah • Om Aim Hreem Kleem Chamundayai Vichche',
      meaning: 'Salutations to Mother Shakambhari, who quenches the hunger of all living creatures with eternal vegetation.',
    },
    keyConsultationFocus:
      'Pushya Nakshatra gold & luxury asset purchase muhurat, fertility and maternal health consultation, herbal wellness guidance.',
    dosAndDonts: {
      dos: [
        'Inaugurate new learning ventures or invest in long-term stable assets',
        'Prepare food with grateful reverence to mother nature',
        'Light a fragrant incense stick in every room',
      ],
      donts: [
        'Avoid wasting vegetables or discarding uneaten food',
        'Do not engage in harsh speech with women of the household',
        'Avoid gloomy thoughts in the evening',
      ],
    },
  },
  {
    id: 'lunar-2027-02-06',
    nameEn: 'Magha Amavasya (Mauni Amavasya & Shani Amavasya)',
    nameHi: 'माघ अमावस्या (मौनी अमावस्या व शनि अमावस्या)',
    nameSa: 'महा माघी दर्श अमावस्या',
    type: 'new_moon',
    date: '2027-02-06',
    formattedDate: 'Saturday, 06 Feb 2027',
    vedicMonth: 'Magha (माघ कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 05 Feb 10:48 AM • Ends: 06 Feb 09:15 AM',
    nakshatra: 'Shravana (Chandra ruled, Vishnu deity)',
    illuminationPct: 0,
    deity: 'Lord Shiva, Lord Shani Deva & Rishi Manu',
    spiritualSignificance:
      'The most celebrated Amavasya in the entire Hindu calendar. Falling on a Saturday (Shanivara), it forms the extraordinarily potent Shani Mauni Amavasya. Millions take royal holy baths at Prayagraj Sangam. Practicing complete silence (Mauna Vrat) dissolves lifetime karmic speech faults and calms malefic Saturn / Rahu.',
    recommendedRituals: [
      'Mauna Vrat: Observe complete speech silence until afternoon or for 24 hours',
      'Sangam or holy river bath before sunrise while remembering the sapta-gangas',
      'Mustard oil shadow donation (Chhaya Daan) for Lord Shani Deva: look at your reflection in a bowl of mustard oil and donate it',
      'Shani Chalisa and Mahamrityunjaya Japa with rudraksha mala',
    ],
    prescribedDaan: [
      'Mustard oil, black sesame seeds, black umbrella, and iron footwear',
      'Black blanket and warm socks to leprosy patients or street workers',
      'Khichdi (rice-urad dal mix) distribution to the poor',
    ],
    mantra: {
      sanskrit: 'ॐ शं शनैश्चराय नमः • ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      transliteration: 'Om Sham Shanaishcharaya Namah • Om Tryambakam Yajamahe Sugandhim Pushtivardhanam',
      meaning: 'Salutations to Lord Saturn, the dispenser of just karmas, and the three-eyed Lord Shiva who grants immortality from fear of death.',
    },
    keyConsultationFocus:
      'Sade Sati, Shani Dhaiya & Kantaka Shani diagnostic, severe chronic disease relief remedies, court case settlement reading.',
    dosAndDonts: {
      dos: [
        'Spend the day in silent japa and spiritual reading without phone calls',
        'Feed black cows, crows, and street dogs with oil-coated rotis',
        'Perform Shiva Linga Jalabhishekam with black sesame seeds',
      ],
      donts: [
        'Strictly avoid gossiping, falsehoods, or abusive expressions',
        'Do not purchase mustard oil or iron items on Saturday (donate what is pre-bought)',
        'Avoid meat, alcohol, and excessive physical sleep',
      ],
    },
  },
  {
    id: 'lunar-2027-02-20',
    nameEn: 'Magha Purnima (Maha Maghi)',
    nameHi: 'माघ पूर्णिमा (महा माघी)',
    nameSa: 'माघ शुक्ल पूर्णिमा',
    type: 'full_moon',
    date: '2027-02-20',
    formattedDate: 'Saturday, 20 Feb 2027',
    vedicMonth: 'Magha (माघ शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 20 Feb 04:55 AM • Ends: 21 Feb 03:08 AM',
    nakshatra: 'Magha',
    illuminationPct: 100,
    deity: 'Lord Madhava (Vishnu), Pitrus & Sant Ravidas',
    spiritualSignificance:
      'The sacred finale of the auspicious Magha Snan month. The scriptures affirm that celestial gods themselves descend incognito to holy confluence waters to attain the merit of Magha Purnima bath. Supreme day for charitable gifts (Kalpavas completion).',
    recommendedRituals: [
      'Early morning bath in holy waters with sesame seeds and gangajal',
      'Satyanarayan Vrat Katha and offering yellow sweets to Lord Vishnu',
      'Offering Arghya to Chandra Deva at moonrise with raw milk and white petals',
      'Sant Ravidas Jayanti bhajan and social service',
    ],
    prescribedDaan: [
      'Warm clothing, sesame-jaggery sweets, and footwear to pilgrims',
      'Religious scriptures like Bhagavad Gita or Ramcharitmanas to sincere seekers',
      'Silver coins, cow donation (Godan) or gau-grass seva',
    ],
    mantra: {
      sanskrit: 'ॐ नमो नारायणाय • ॐ विष्णवे नमः',
      transliteration: 'Om Namo Narayanaya • Om Vishnave Namah',
      meaning: 'Salutations to the omnipresent Lord Narayana, the supreme refuge of all living beings.',
    },
    keyConsultationFocus:
      'Pitru-Devata blessings synchronization, clearing career stagnancy, invoking divine protection for children.',
    dosAndDonts: {
      dos: [
        'Begin day with family prayer and respectful salutations to parents',
        'Light lamps in all four directions of the house at dusk',
        'Consume satvik food sweetened with jaggery',
      ],
      donts: [
        'Avoid sleeping during daytime on Purnima',
        'Do not deny water or food to any visitor',
        'Avoid anger and impulsive financial contracts',
      ],
    },
  },
  {
    id: 'lunar-2027-03-08',
    nameEn: 'Phalguna Amavasya (Somvati Amavasya)',
    nameHi: 'फाल्गुन अमावस्या (सोमवती अमावस्या)',
    nameSa: 'सोमवती दर्श अमावस्या',
    type: 'new_moon',
    date: '2027-03-08',
    formattedDate: 'Monday, 08 Mar 2027',
    vedicMonth: 'Phalguna (फाल्गुन कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 07 Mar 04:22 AM • Ends: 08 Mar 02:40 AM',
    nakshatra: 'Shatabhisha & Purva Bhadrapada',
    illuminationPct: 0,
    deity: 'Lord Shiva & Ashvattha Deva (Sacred Peepal Tree)',
    spiritualSignificance:
      'An extraordinarily auspicious Somvati Amavasya (Amavasya falling on Monday, the day ruled by Chandra and Lord Shiva). Married women perform 108 sacred pradakshinas (circumambulations) around the Peepal tree with sacred thread to pray for marital longevity, family prosperity, and eradication of planetary widowhood doshas.',
    recommendedRituals: [
      '108 Pradakshinas of Peepal tree offering raw thread, turmeric, sweets, and fruits',
      'Shiva Linga Jalabhishekam with raw cow milk, bilva leaves, and honey',
      'Pitru Tarpana with black sesame and gangajal at noon',
      'Mahamrityunjaya Mantra chanting 108 times',
    ],
    prescribedDaan: [
      'Raw milk, rice, white camphor, and silver thread to Shiva temple',
      '108 fruits and sweets distribution to needy women and children',
      'Green fodder to cows (Gau Seva)',
    ],
    mantra: {
      sanskrit: 'ॐ नमः शिवाय • ॐ सोमेश्वराय नमः',
      transliteration: 'Om Namah Shivaya • Om Someshwaraya Namah',
      meaning: 'Salutations to Lord Shiva, the eternal master of the Moon who heals all emotional and physical distress.',
    },
    keyConsultationFocus:
      'Marital compatibility renewal, resolving Mangal-Chandra discord, child welfare and conception (Santan Prapti) remedies.',
    dosAndDonts: {
      dos: [
        'Tie sacred kalava thread around Peepal tree with pure heart and devotion',
        'Fast on milk and fruits until afternoon prayers are completed',
        'Wear fresh white, cream, or light yellow attire',
      ],
      donts: [
        'Never touch the Peepal tree after sunset or on prohibited tithis',
        'Do not engage in spousal quarrels or sharp speech today',
        'Avoid commercial transactions involving debt or lending',
      ],
    },
  },
  {
    id: 'lunar-2027-03-22',
    nameEn: 'Phalguna Purnima (Holika Dahan & Lakshmi Jayanti)',
    nameHi: 'फाल्गुन पूर्णिमा (होलिका दहन व लक्ष्मी जयंती)',
    nameSa: 'हुताशनी पूर्णिमा / फाल्गुनी पूर्णिमा',
    type: 'full_moon',
    date: '2027-03-22',
    formattedDate: 'Monday, 22 Mar 2027',
    vedicMonth: 'Phalguna (फाल्गुन शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 21 Mar 07:45 PM • Ends: 22 Mar 06:12 PM',
    nakshatra: 'Uttara Phalguni',
    illuminationPct: 100,
    deity: 'Lord Narasimha, Bhakt Prahlad & Goddess Mahalakshmi',
    spiritualSignificance:
      'The sacred night of Holika Dahan symbolizing the ultimate victory of steadfast devotion over evil ego. It is also celebrated as Lakshmi Jayanti (the divine appearance day of Goddess Mahalakshmi). The sacred fire incinerates all lingering evil eye (Nazar dosha) and negative planetary vibrations.',
    recommendedRituals: [
      'Holika Dahan Muhurat Puja: offer dry coconut, wheat ears, mustard seeds, and gulal to the sacred fire',
      'Circumambulate the holy bonfire 7 times seeking protection from all negative energies',
      'Lakshmi Jayanti celebration with lotus flower offerings and Sri Suktam chanting',
      'Satyanarayan Vrat with sweet roasted wheat Prasad',
    ],
    prescribedDaan: [
      'Grains, dry coconuts, and sweets to poor families',
      'Gulal, sweets, and clothes to children',
      'Cow dung cakes and fragrant wood to community Holika bonfires',
    ],
    mantra: {
      sanskrit: 'ॐ नृसिंहाय नमः • ॐ क्लीं कृष्णाय गोविंदाय गोपीजनवल्लभाय स्वाहा',
      transliteration: 'Om Nrisimhaya Namah • Om Kleem Krishnaya Govindaya Gopijanavallabhaya Swaha',
      meaning: 'Salutations to Lord Narasimha, the fierce protector of truth who liberates his devotees from all fears.',
    },
    keyConsultationFocus:
      'Nazar Dosha removal, planetary protection yantra consecration, family harmony reading, business revitalization.',
    dosAndDonts: {
      dos: [
        'Collect ashes from the sacred Holika fire next morning to mark the forehead as protective Bhasma',
        'Keep home windows open during dusk to let pure festive air enter',
        'Forgive old grudges and embrace relatives with auspicious tilak',
      ],
      donts: [
        'Avoid performing Holika Dahan during Bhadra Kaal (strictly calculate Shubh Muhurat with astrologer)',
        'Newlyweds should avoid witnessing Holika Dahan according to traditional customs',
        'Avoid burning plastic or impure synthetic items in the holy fire',
      ],
    },
  },
  {
    id: 'lunar-2027-04-06',
    nameEn: 'Chaitra Amavasya (Darsha Amavasya)',
    nameHi: 'चैत्र अमावस्या (दर्श अमावस्या)',
    nameSa: 'संवत समापन दर्श अमावस्या',
    type: 'new_moon',
    date: '2027-04-06',
    formattedDate: 'Tuesday, 06 Apr 2027',
    vedicMonth: 'Chaitra (चैत्र कृष्ण पक्ष)',
    paksha: 'Krishna Paksha',
    tithi: 'Amavasya (अमावस्या)',
    tithiWindow: 'Starts: 05 Apr 08:35 PM • Ends: 06 Apr 06:55 PM',
    nakshatra: 'Revati & Ashwini',
    illuminationPct: 0,
    deity: 'Lord Vishnu, Surya Deva & Pitrus',
    spiritualSignificance:
      'The cosmic threshold concluding the Hindu astronomical year (Vikram Samvat). It prepares the soul and environment for the dawn of the New Year (Chaitra Navratri / Gudi Padwa / Ugadi). Purges the past year’s accumulated karmic debris and welcomes divine renewal.',
    recommendedRituals: [
      'Complete household spiritual cleaning (Shaucha) and cleansing with rock salt water',
      'Pitru Tarpana with black sesame and kusha grass to honor ancestors before the New Year begins',
      'Lighting oil lamps at threshold at sunset',
      'Preparation of sacred Kalash and toran for the upcoming Chaitra Navratri dawn',
    ],
    prescribedDaan: [
      'Water pots (Ghat daan) with sweet water, fans, and umbrellas for the upcoming summer',
      'Food grains and seasonal fruits to brahmins and needy wanderers',
      'New clothes to domestic helpers and service staff',
    ],
    mantra: {
      sanskrit: 'ॐ नमो भगवते वासुदेवाय • ॐ पितृभ्यो नमः स्वधा नमः',
      transliteration: 'Om Namo Bhagavate Vasudevaya • Om Pitrubhyo Namah Swadha Namah',
      meaning: 'Salutations to Lord Vasudeva and our revered ancestors; may their grace guide our new annual cycle.',
    },
    keyConsultationFocus:
      'Annual Varshaphal (Yearly Horoscope) analysis for the new Vikram Samvat, Navratri Ghatasthapana Muhurat timing.',
    dosAndDonts: {
      dos: [
        'Clear all pending debts or settle small financial disputes before the year ends',
        'Express gratitude for all lessons and protections received during the past year',
        'Clean family altar thoroughly and discard old withered flowers',
      ],
      donts: [
        'Avoid entertaining pessimism or regret about bygone events',
        'Do not engage in unhygienic practices or chaotic clutter',
        'Avoid consuming intoxicating substances',
      ],
    },
  },
  {
    id: 'lunar-2027-04-20',
    nameEn: 'Chaitra Purnima (Sri Hanuman Jayanti)',
    nameHi: 'चैत्र पूर्णिमा (श्री हनुमान जयंती)',
    nameSa: 'महावीरी चैत्र पूर्णिमा',
    type: 'full_moon',
    date: '2027-04-20',
    formattedDate: 'Tuesday, 20 Apr 2027',
    vedicMonth: 'Chaitra (चैत्र शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 20 Apr 12:40 AM • Ends: 20 Apr 11:15 PM',
    nakshatra: 'Chitra',
    illuminationPct: 100,
    deity: 'Lord Hanuman & Chandra Deva',
    spiritualSignificance:
      'The glorious appearance day of Sri Hanuman, the Rudra avatar and supreme devotee of Lord Rama. Falling on Mangalvara (Tuesday), Hanuman Jayanti bestows boundless courage, eliminates fear of ghosts, enemies, and adverse Mars / Saturn transits.',
    recommendedRituals: [
      'Offer Chola to Lord Hanuman: Pure vermilion (sindoor) mixed with jasmine oil (chameli tel)',
      'Chant the Hanuman Chalisa 11 or 108 times and recite Bajrang Baan for urgent distress',
      'Offer boondi laddoos, betel leaf with clove (paan beeda), and red flower garlands',
      'Satyanarayan Vrat with evening Chandra Darshan and milk arghya',
    ],
    prescribedDaan: [
      'Red clothes, boondi laddoos, and bananas to temple visitors',
      'Mustard oil and sindoor to Hanuman temples',
      'Water distribution (Prapan) and food to needy seekers',
    ],
    mantra: {
      sanskrit: 'ॐ नमो हनुमते रुद्रावताराय सर्वशत्रुसंहारणाय सर्वरोग हराय सर्ववशीकरणाय रामदूताय स्वाहा',
      transliteration: 'Om Namo Hanumate Rudravataraya Sarvashatru-samharanaya Sarvaroga Haraya Ramadutaya Swaha',
      meaning: 'Salutations to Lord Hanuman, the incarnation of Rudra, who destroys all adversaries and cures all afflictions.',
    },
    keyConsultationFocus:
      'Manglik Dosha pacification, courage for exams/legal battles, real estate dispute resolution, spiritual protection shields.',
    dosAndDonts: {
      dos: [
        'Maintain celibacy (Brahmacharya) and purity of thought and speech today',
        'Raise a red triangular Hanuman flag on the rooftop for household protection',
        'Wear red, saffron, or yellow clothing',
      ],
      donts: [
        'Avoid non-vegetarian food, alcohol, and negative criticism',
        'Never offer women’s makeup items or touch Hanuman idol improperly',
        'Avoid cowardice and negative doubts in your heart',
      ],
    },
  },
  {
    id: 'lunar-2027-05-20',
    nameEn: 'Vaishakha Purnima (Buddha Purnima & Kurma Jayanti)',
    nameHi: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा व कूर्म जयंती)',
    nameSa: 'महा वैशाखी पूर्णिमा',
    type: 'full_moon',
    date: '2027-05-20',
    formattedDate: 'Thursday, 20 May 2027',
    vedicMonth: 'Vaishakha (वैशाख शुक्ल पक्ष)',
    paksha: 'Shukla Paksha',
    tithi: 'Purnima (पूर्णिमा)',
    tithiWindow: 'Starts: 19 May 06:50 PM • Ends: 20 May 05:25 PM',
    nakshatra: 'Vishakha',
    illuminationPct: 100,
    deity: 'Lord Buddha, Lord Kurma (Vishnu Avatar) & Chandra Deva',
    spiritualSignificance:
      'The sacred triple-blessed day marking the Birth, Enlightenment, and Mahaparinirvana of Gautama Buddha, as well as the appearance of Kurma (Tortoise) Avatar of Lord Vishnu during the churning of the cosmic ocean. Supreme day for non-violence, meditation, and inner peace.',
    recommendedRituals: [
      'Practice Vipassana or breath-focused meditation for at least 30 minutes at sunrise',
      'Offer lotus flowers, incense, and candles to Lord Buddha and Lord Vishnu',
      'Satyanarayan Vrat and reading of the Dhammapada / Vishnu Sahasranama',
      'Watering Peepal (Bodhi) tree and circumambulating with grateful reverence',
    ],
    prescribedDaan: [
      'Clay water pots filled with sweet water (Prapan seva)',
      'Umbrellas, sandals, and cotton clothes to summer pilgrims',
      'Releasing captive birds or feeding animals to practice Karuna (compassion)',
    ],
    mantra: {
      sanskrit: 'ॐ नमो भगवते बुद्धाय • ॐ नमो भगवते कूर्माय नमः',
      transliteration: 'Om Namo Bhagavate Buddhaya • Om Namo Bhagavate Kurmaya Namah',
      meaning: 'Salutations to the Awakened One, Lord Buddha, and Lord Kurma who steadies the cosmic axis.',
    },
    keyConsultationFocus:
      'Mental calmness & anxiety resolution, foreign travel & higher wisdom readings, career stability (Kurma steadiness).',
    dosAndDonts: {
      dos: [
        'Practice absolute kindness and avoid squashing insects or harming any living creature',
        'Wear pure white attire to reflect calm lunar tranquility',
        'Spend quiet time reading contemplative wisdom literature',
      ],
      donts: [
        'Strictly avoid slaughter, cruelty, and consuming meat or alcohol',
        'Do not engage in hot-tempered disputes under the noon sun',
        'Avoid greed, over-consumption, or harsh punishment of children/employees',
      ],
    },
  },
];

export const VEDIC_LUNAR_RITUAL_GUIDES = [
  {
    phase: 'Purnima (Full Moon / पूर्णिमा)',
    sanskritName: 'पूर्ण चन्द्र प्रकाश • सौम्य अमृत काल',
    illumination: '100% Illumination',
    nature: 'Maximum Sattva Guna & Lunar Radiance',
    colorScheme: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    whyItMatters:
      'In Vedic scriptures, the Moon governs the Mind (Chandra-Manaso Jātah). On Purnima, lunar gravitational and vibrational energy peaks, elevating human emotional consciousness, intuition, and spiritual sensitivity. The cosmic mind is completely illuminated, making prayers, mantras, and prosperity rituals 100 times more potent.',
    keyRituals: [
      'Satyanarayan Vrat & Katha for wealth, abundance, and family concord',
      'Chandra Darshan with raw milk and white flower Arghya at moonrise',
      'Lakshmi-Kuber Aradhana to eliminate chronic poverty and financial instability',
      'Kheer preparation kept under night moonlight to absorb lunar nectar (Amrit)',
    ],
    consultationSignificance:
      'Ideal for booking consultations on: Marriage muhurat, inaugurating commercial enterprises, relationship compatibility healing, activating Moon gemstones (Natural Pearl / Moti), and mental stress alleviation.',
  },
  {
    phase: 'Amavasya (New Moon / अमावस्या)',
    sanskritName: 'अमावस्या • पितृ तृप्ति एवं कर्म शुद्धि',
    illumination: '0% Illumination',
    nature: 'Introspective Shiva-Shakti & Ancestral Alignment',
    colorScheme: 'text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800',
    whyItMatters:
      'On Amavasya, the Sun and Moon are conjunct at the exact same celestial longitude. Lunar light is invisible to human eyes, pulling subtle vital energy inward. It opens the celestial gateway between Earth and the realm of ancestors (Pitru Loka). Negative astral influences are dissolved through charity, silence, and ancestor offerings.',
    keyRituals: [
      'Pitru Tarpana & Shraddha with black sesame seeds (Til) and Kusha grass',
      'Feeding cows (Gau Seva), crows (Kak-bali), dogs, and the needy before afternoon',
      'Deep Daan: Lighting mustard oil lamps facing South at dusk for ancestral guidance',
      'Mauna Sadhana (practicing silence) and Mahamrityunjaya Mantra japa',
    ],
    consultationSignificance:
      'Critical for booking consultations on: Pitru Dosha diagnostics, Kaal Sarp Dosha shanti, Shani Sade Sati pacification, removing chronic roadblocks in career/marriage, and home energy cleansing (Vastu dosha).',
  },
  {
    phase: 'Ekadashi (11th Lunar Day / एकादशी)',
    sanskritName: 'हरि वासर • आत्म संयम एवं व्रत',
    illumination: '70% - 85% Illumination',
    nature: 'Lord Vishnu’s Divine Day for Fasting & Cleansing',
    colorScheme: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-stone-900 border-orange-200 dark:border-orange-900/50',
    whyItMatters:
      'Occurs twice in every lunar month (Shukla and Krishna). Moon is located at approximately 120-132 degrees from the Sun. Science and Ayurveda confirm that the body’s atmospheric moisture balance is optimal for cellular detox and fasting. Grains are avoided to cultivate pure spiritual focus.',
    keyRituals: [
      'Nirjala (waterless) or Phalahari (fruit & milk) fasting dedicated to Lord Vishnu',
      'Recitation of Vishnu Sahasranama and Bhagavad Gita Chapters 12 and 15',
      'Night vigilance (Jagran) and devotional singing',
      'Charity of fruits, water, and warm clothes the next morning on Dwadashi Paran',
    ],
    consultationSignificance:
      'Ideal for booking consultations on: Spiritual progress, overcoming difficult planetary Dashas (especially Rahu and Ketu), and selecting personal Ishta Devata mantras.',
  },
];
