// Keyword lexicon: maps romanised Hindi, Devanagari, English and Tamil words to canonical tags.
// Only keywords are mapped. Anything else (e.g. names) is left exactly as spoken.

export type Tag =
  | 'AGE' | 'YEARS' | 'MONTHS' | 'WEEKS' | 'DAYS' | 'PREG' | 'CHILD' | 'BP' | 'BLOOD' | 'PRESSURE'
  | 'NORMAL' | 'HIGH' | 'LOW' | 'WEIGHT' | 'KG' | 'BY' | 'NEXT' | 'VISIT' | 'IN' | 'AFTER' | 'GIVEN'
  | 'TOMORROW' | 'DAYAFTER' | 'TODAY' | 'DATE' | 'NAME' | 'FILLER' | 'UNIT_TAB' | 'UNIT_PACKET'
  | 'UNIT_INJ' | 'ITEM' | 'WEEKDAY' | 'A';

const L: Record<Tag, string[]> = {
  AGE: ['umra', 'umar', 'umr', 'umer', 'age', 'aayu', 'ayu', 'vayasu', 'vayathu', 'vayadhu', 'उम्र', 'उमर', 'आयु', 'उम्र:', 'வயது', 'வயசு', 'aged', 'वय', 'বয়স', 'বয়স', 'বয়েস', 'ఉంమర్', 'వయసు', 'వయస్సు', 'ವಯಸ್ಸು', 'ವಯಸು', 'ઉંમર', 'ઉમર', 'ઉંમ્મર'],
  YEARS: ['saal', 'sal', 'years', 'year', 'yrs', 'yr', 'varsh', 'baras', 'baras', 'साल', 'वर्ष', 'बरस', 'வருடம்', 'வருஷம்', 'varudam', 'old', 'वर्षे', 'वर्षांची', 'বছর', 'বছরের', 'సంవత్సరాలు', 'ఏళ్ళు', 'ఏళ్లు', 'ವರ್ಷ', 'ವರ್ಷದ', 'વર્ષ', 'વર્ષની'],
  MONTHS: ['mahine', 'mahina', 'mahino', 'mahinon', 'mahinay', 'month', 'months', 'maah', 'maas', 'महीने', 'महीना', 'महीनों', 'माह', 'मास', 'मंथ', 'மாதம்', 'மாசம்', 'மாதங்கள்', 'maadham', 'maasam', 'mahiney', 'महिने', 'महिन्यांची', 'महिन्यांनी', 'महिना', 'মাস', 'মাসের', 'নెల', 'నెలలు', 'నెలల', 'ತಿಂಗಳು', 'ತಿಂಗಳ', 'મહિના', 'મહિનાની', 'મહિને'],
  WEEKS: ['hafte', 'hafta', 'haftey', 'hafton', 'saptah', 'week', 'weeks', 'हफ्ते', 'हफ़्ते', 'हफ्ता', 'हफ़्ता', 'हफ्तों', 'सप्ताह', 'वीक', 'வாரம்', 'வாரத்தில்', 'வாரங்கள்', 'vaaram', 'varam', 'आठवडे', 'आठवड्यांनी', 'आठवड्याने', 'आठवडा', 'সপ্তাহ', 'সপ্তাহে', 'సప్తాహం', 'వారం', 'వారాలు', 'ವಾರ', 'ವಾರಗಳು', 'અઠવાડિયા', 'અઠવાડિયે', 'અઠવાડિયું'],
  DAYS: ['din', 'dino', 'dinon', 'day', 'days', 'दिन', 'दिनों', 'நாள்', 'நாளில்', 'நாட்கள்', 'naal', 'दिवस', 'दिवसांनी', 'দিন', 'দিনে', 'రోజులు', 'రోజు', 'ದಿನ', 'ದಿನಗಳು', 'દિવસ', 'દિવસે'],
  PREG: ['pregnant', 'pregnancy', 'garbhvati', 'garbhwati', 'garbhavati', 'garbh', 'garbhwatee', 'pregnent', 'गर्भवती', 'गर्भ', 'प्रेग्नेंट', 'प्रेगनेंट', 'प्रेग्नेंसी', 'प्रेगनेंसी', 'கர்ப்பம்', 'கர்ப்பிணி', 'karbam', 'karpam', 'karppini', 'anc', 'गरोदर', 'গর্ভবতী', 'প্রেগন্যান্ট', 'గర్భిణి', 'గర్భవతి', 'ప్రెగ్నెంట్', 'ಗರ್ಭಿಣಿ', 'ಪ್ರೆಗ್ನೆಂಟ್', 'ગર્ભવતી', 'સગર્ભા', 'પ્રેગ્નન્ટ'],
  CHILD: ['bachcha', 'bacha', 'baccha', 'bachche', 'bachchi', 'bachi', 'baby', 'child', 'infant', 'shishu', 'बच्चा', 'बच्ची', 'बच्चे', 'शिशु', 'बेबी', 'குழந்தை', 'kuzhandhai', 'kulandhai', 'बाळ', 'শিশু', 'বাচ্চা', 'బిడ్డ', 'పాప', 'బాబు', 'ಮಗು', 'બાળક'],
  BP: ['bp', 'b.p', 'b.p.', 'बीपी', 'बी.पी.', 'बी.पी', 'रक्तचाप', 'பிபி', 'raktchaap', 'বিপি', 'বি.পি.', 'బీపీ', 'బిపి', 'ಬಿಪಿ', 'બીપી'],
  BLOOD: ['blood', 'ब्लड'],
  PRESSURE: ['pressure', 'प्रेशर'],
  NORMAL: ['normal', 'theek', 'thik', 'teek', 'sahi', 'ok', 'okay', 'fine', 'नॉर्मल', 'नार्मल', 'ठीक', 'सही', 'சாதாரணம்', 'நார்மல்', 'சரி', 'নরমাল', 'স্বাভাবিক', 'నార్మల్', 'ಸಾಮಾನ್ಯ', 'ನಾರ್ಮಲ್', 'નોર્મલ', 'બરાબર'],
  HIGH: ['high', 'zyada', 'jyada', 'jada', 'badha', 'adhik', 'हाई', 'ज्यादा', 'ज़्यादा', 'बढ़ा', 'அதிகம்', 'বেশি', 'ఎక్కువ', 'ಜಾಸ್ತಿ', 'વધારે', 'जास्त'],
  LOW: ['low', 'kam', 'लो', 'कम', 'குறைவு', 'কম', 'తక్కువ', 'ಕಡಿಮೆ', 'ઓછું', 'कमी'],
  WEIGHT: ['wajan', 'vajan', 'vazan', 'wazan', 'weight', 'वजन', 'वज़न', 'वेट', 'எடை', 'edai', 'ওজন', 'బరువు', 'ತೂಕ', 'વજન'],
  KG: ['kilo', 'kg', 'kgs', 'kilogram', 'किलो', 'केजी', 'கிலோ', 'কেজি', 'কিলো', 'కిలో', 'కేజీ', 'ಕೆಜಿ', 'ಕಿಲೋ', 'કિલો'],
  BY: ['by', 'upar', 'bata', 'over', 'baata', 'बाई', 'बटा', 'ऊपर', '/'],
  NEXT: ['agla', 'agli', 'agle', 'next', 'phir', 'dobara', 'aagla', 'अगला', 'अगली', 'अगले', 'फिर', 'दोबारा', 'அடுத்த', 'adutha', 'पुढची', 'पुढील', 'पुढे', 'পরের', 'পরবর্তী', 'తదుపరి', 'తర్వాతి', 'ನೆಕ್ಸ್ಟ್', 'ಮುಂದಿನ', 'આવતી', 'આગામી', 'પછીની'],
  VISIT: ['visit', 'vizit', 'mulakat', 'milna', 'विजिट', 'विज़िट', 'मुलाकात', 'வருகை', 'விசிட்', 'checkup', 'भेट', 'ভিজিট', 'విజిట్', 'ಭೇಟಿ', 'ವಿಸಿಟ್', 'મુલાકાત', 'વિઝિટ'],
  IN: ['mein', 'me', 'main', 'mai', 'in', 'within', 'में', 'மே', 'मध्ये', 'মধ্যে', 'లో', 'ಒಳಗೆ', 'માં'],
  AFTER: ['baad', 'bad', 'after', 'later', 'बाद', 'பிறகு', 'கழித்து', 'kazhithu', 'नंतर', 'পরে', 'తర్వాత', 'తరువాత', 'ನಂತರ', 'ಆಮೇಲೆ', 'પછી'],
  GIVEN: ['diye', 'diya', 'di', 'de', 'diyе', 'given', 'gave', 'dena', 'दिए', 'दिया', 'दी', 'दिये', 'கொடுத்தேன்', 'குடுத்தேன்', 'கொடுத்தது', 'दिल्या', 'दिले', 'দিয়েছি', 'দিলাম', 'ఇచ్చాను', 'ఇచ్చాము', 'ಕೊಟ್ಟೆ', 'ಕೊಟ್ಟಿದ್ದೇನೆ', 'આપી', 'આપ્યા'],
  TOMORROW: ['kal', 'tomorrow', 'कल', 'நாளை', 'naalai', 'उद्या', 'আগামীকাল', 'రేపు', 'ನಾಳೆ', 'કાલે', 'આવતીકાલે'],
  DAYAFTER: ['parson', 'parso', 'parsoon', 'परसों', 'நாளை மறுநாள்'],
  TODAY: ['aaj', 'today', 'आज', 'இன்று'],
  DATE: ['tarikh', 'tareekh', 'date', 'तारीख', 'तारीख़', 'தேதி'],
  NAME: ['naam', 'name', 'नाम', 'பெயர்', 'peyar', 'নাম', 'పేరు', 'ಹೆಸರು', 'નામ'],
  FILLER: ['hai', 'he', 'is', 'ki', 'ka', 'ke', 'ko', 'aur', 'and', 'the', 'of', 'her', 'his', 'she', 'uska', 'uski', 'mera', 'meri', 'ji', 'है', 'की', 'का', 'के', 'को', 'और', 'जी', 'तो', 'to', 'hain', 'हैं', 'patient', 'beneficiary', 'लाभार्थी', 'ma', 'maa', 'mother', 'also', 'bhi', 'भी', 'आहे', 'ची', 'আছে', 'గారు', 'ಅವರು', 'છે', 'ની'],
  UNIT_TAB: ['tablet', 'tablets', 'tab', 'tabs', 'goli', 'goliyan', 'goliyaan', 'golian', 'capsule', 'capsules', 'गोली', 'गोलियां', 'गोलियाँ', 'टैबलेट', 'टेबलेट', 'टैबलेट्स', 'मात्रा', 'மாத்திரை', 'மாத்திரைகள்', 'maathirai', 'pills', 'pill', 'गोळ्या', 'गोळी', 'ট্যাবলেট', 'বড়ি', 'মাত্রা', 'మాత్రలు', 'టాబ్లెట్లు', 'ಮಾತ್ರೆ', 'ಮಾತ್ರೆಗಳು', 'ગોળી', 'ગોળીઓ', 'ટેબ્લેટ'],
  UNIT_PACKET: ['packet', 'packets', 'pack', 'pouch', 'sachet', 'sachets', 'पैकेट', 'पाउच', 'பாக்கெட்'],
  UNIT_INJ: ['injection', 'injections', 'tika', 'teeka', 'tikka', 'vaccine', 'इंजेक्शन', 'टीका', 'ஊசி', 'oosi'],
  ITEM: [],
  WEEKDAY: [],
  A: ['a', 'an', 'ek'],
};

export const ITEMS: { key: string; label: string; unit: string; words: string[] }[] = [
  { key: 'IFA', label: 'Iron (IFA) tablets', unit: 'tablets', words: ['iron', 'ifa', 'लोह', 'আয়রন', 'আয়রন', 'ఐరన్', 'ಐರನ್', 'આયર્ન', 'aayran', 'ayran', 'आयरन', 'आइरन', 'आईएफए', 'லோஹம்', 'இரும்பு', 'irumbu', 'आयरन्'] },
  { key: 'FOLIC', label: 'Folic acid tablets', unit: 'tablets', words: ['folic', 'folate', 'फोलिक', 'फॉलिक', 'ஃபோலிக்'] },
  { key: 'CALCIUM', label: 'Calcium tablets', unit: 'tablets', words: ['calcium', 'kalsium', 'ক্যালসিয়াম', 'కాల్షియం', 'ಕ್ಯಾಲ್ಸಿಯಂ', 'કેલ્શિયમ', 'कैल्शियम', 'कैल्सियम', 'கால்சியம்'] },
  { key: 'ORS', label: 'ORS packets', unit: 'packets', words: ['ors', 'ओआरएस', 'ओ.आर.एस.'] },
  { key: 'ZINC', label: 'Zinc tablets', unit: 'tablets', words: ['zinc', 'जिंक', 'ज़िंक', 'துத்தநாகம்'] },
  { key: 'TT', label: 'TT / Td injection', unit: 'dose', words: ['tt', 'td', 'टीटी', 'टिटनेस', 'tetanus'] },
  { key: 'ALB', label: 'Albendazole (deworming)', unit: 'tablets', words: ['albendazole', 'albendazol', 'deworming', 'कृमि', 'पेटकीड़े', 'अल्बेंडाजोल'] },
  { key: 'VITA', label: 'Vitamin A', unit: 'dose', words: ['vitamin', 'विटामिन', 'வைட்டமின்'] },
  { key: 'THR', label: 'Take-home ration', unit: 'packets', words: ['ration', 'poshahar', 'thr', 'पोषाहार', 'राशन', 'पंजीरी', 'சத்துமாவு'] },
];

export const WEEKDAYS: { day: number; words: string[] }[] = [
  { day: 1, words: ['somvar', 'somwar', 'monday', 'सोमवार', 'திங்கள்', 'thingal'] },
  { day: 2, words: ['mangalvar', 'mangalwar', 'tuesday', 'मंगलवार', 'செவ்வாய்'] },
  { day: 3, words: ['budhvar', 'budhwar', 'wednesday', 'बुधवार', 'புதன்'] },
  { day: 4, words: ['guruvar', 'guruwar', 'brihaspativar', 'thursday', 'गुरुवार', 'बृहस्पतिवार', 'வியாழன்'] },
  { day: 5, words: ['shukravar', 'shukrawar', 'friday', 'शुक्रवार', 'வெள்ளி'] },
  { day: 6, words: ['shanivar', 'shaniwar', 'saturday', 'शनिवार', 'சனி'] },
  { day: 0, words: ['ravivar', 'raviwar', 'itvaar', 'itwar', 'sunday', 'रविवार', 'इतवार', 'ஞாயிறு'] },
];

const TAG_MAP = new Map<string, Tag>();
for (const [tag, words] of Object.entries(L) as [Tag, string[]][]) {
  for (const w of words) if (!TAG_MAP.has(w)) TAG_MAP.set(w, tag);
}
const ITEM_MAP = new Map<string, string>();
for (const it of ITEMS) for (const w of it.words) ITEM_MAP.set(w, it.key);
const WEEKDAY_MAP = new Map<string, number>();
for (const wd of WEEKDAYS) for (const w of wd.words) WEEKDAY_MAP.set(w, wd.day);

export function tagOf(w: string): Tag | null {
  if (ITEM_MAP.has(w)) return 'ITEM';
  if (WEEKDAY_MAP.has(w)) return 'WEEKDAY';
  return TAG_MAP.get(w) ?? null;
}

// Telugu, Kannada, Tamil, Marathi and Bengali glue case endings onto words ("వారాల్లో" = in weeks).
// For non-Latin words not found directly, accept the longest lexicon stem the word starts with.
const STEMS: [string, Tag][] = [
  ['వార', 'WEEKS'], ['నెల', 'MONTHS'], ['రోజ', 'DAYS'], ['సంవత్సర', 'YEARS'], ['ವಾರ', 'WEEKS'], ['ತಿಂಗಳ', 'MONTHS'],
  ['ದಿನ', 'DAYS'], ['ವರ್ಷ', 'YEARS'], ['आठवड', 'WEEKS'], ['महिन', 'MONTHS'], ['दिवस', 'DAYS'],
  ['সপ্তাহ', 'WEEKS'], ['মাস', 'MONTHS'], ['দিন', 'DAYS'], ['અઠવાડિય', 'WEEKS'], ['મહિન', 'MONTHS'], ['દિવસ', 'DAYS'],
  ['గర్భ', 'PREG'], ['ಗರ್ಭ', 'PREG'], ['गरोदर', 'PREG'], ['বয়', 'AGE'], ['వయస', 'AGE'], ['ವಯಸ', 'AGE'],
];
export function stemTag(w: string): { tag: Tag; stem: string } | null {
  if (/^[\x00-\x7f]*$/.test(w)) return null;
  let best: { tag: Tag; stem: string } | null = null;
  for (const [stem, tag] of STEMS) if (w.startsWith(stem) && w.length > stem.length && (!best || stem.length > best.stem.length)) best = { tag, stem };
  return best;
}
export const itemKeyOf = (w: string) => ITEM_MAP.get(w) ?? null;
export const weekdayOf = (w: string) => WEEKDAY_MAP.get(w) ?? null;
export const itemByKey = (k: string) => ITEMS.find((i) => i.key === k)!;

// Tamil glues postpositions to words ("வாரத்தில்" = in the week). Strip a few common suffixes
// so the stem can be looked up.
export function tamilStem(w: string): string[] {
  const out = [w];
  for (const suf of ['த்தில்', 'த்தில', 'இல்', 'ில்', 'க்கு', 'ல்']) {
    if (w.length > suf.length + 1 && w.endsWith(suf)) out.push(w.slice(0, -suf.length));
  }
  return out;
}
