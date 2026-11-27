import type { FieldKey, Lang } from './types';

export interface LangInfo { code: Lang; native: string; english: string; script: string }

/** Languages offered in the picker. `code` is also the speech-recognition locale. */
export const LANGS: LangInfo[] = [
  { code: 'hi-IN', native: 'हिन्दी', english: 'Hindi', script: 'अ' },
  { code: 'mr-IN', native: 'मराठी', english: 'Marathi', script: 'म' },
  { code: 'bn-IN', native: 'বাংলা', english: 'Bengali', script: 'অ' },
  { code: 'te-IN', native: 'తెలుగు', english: 'Telugu', script: 'అ' },
  { code: 'ta-IN', native: 'தமிழ்', english: 'Tamil', script: 'அ' },
  { code: 'kn-IN', native: 'ಕನ್ನಡ', english: 'Kannada', script: 'ಅ' },
  { code: 'gu-IN', native: 'ગુજરાતી', english: 'Gujarati', script: 'અ' },
  { code: 'en-IN', native: 'English', english: 'English', script: 'A' },
];

export interface Dict {
  app: string; tagline: string; start: string; listening: string; tapToStop: string; speakNow: string;
  sample: string; typeInstead: string; parse: string; todayVisits: string; confirmSave: string;
  missing: string; heard: string; yes: string; no: string; isCorrect: string; respeak: string; pick: string;
  saved: string; reminderSet: string; upcoming: string; todayList: string; newVisit: string; uncertain: string;
  noSpeech: string; speechFail: string; notSupported: string; readBack: string; cancel: string; done: string;
  optional: string; language: string; overdue: string; today: string; recorded: string; checkThese: string;
  fields: Record<FieldKey, string>;
  w: { years: string; months: string; pregnant: string; child: string; normal: string; high: string; low: string; tomorrow: string; inDays: string; kg: string };
}

export const T: Record<Lang, Dict> = {
  'hi-IN': {
    app: 'बोलो रजिस्टर', tagline: 'बोलिए, रजिस्टर भर जाएगा', start: 'बोलिए', listening: 'सुन रहे हैं', tapToStop: 'रोकने के लिए दबाएँ',
    speakNow: 'एक साँस में बोलिए — नाम, उम्र, महीना, बीपी, क्या दिया, अगला विज़िट', sample: 'उदाहरण', typeInstead: 'लिखकर भरें',
    parse: 'भरें', todayVisits: 'आज के विज़िट', confirmSave: 'पक्का करें, दर्ज करें', missing: 'खाली है — दबाकर बोलें',
    heard: 'सुना', yes: 'हाँ, सही', no: 'नहीं, दोबारा', isCorrect: 'सही है?', respeak: 'दोबारा बोलें', pick: 'या चुन लें',
    saved: 'दर्ज हो गया', reminderSet: 'अगले विज़िट की याद', upcoming: 'आने वाले विज़िट', todayList: 'आज दर्ज',
    newVisit: 'नया विज़िट', uncertain: 'ये शब्द साफ़ नहीं सुने — शब्द दबाकर दोबारा बोलें', noSpeech: 'कुछ सुनाई नहीं दिया',
    speechFail: 'आवाज़ समझ नहीं आई — नीचे से चुन लें', notSupported: 'इस ब्राउज़र में माइक नहीं चलता — Chrome खोलें या लिखकर भरें',
    readBack: 'पढ़कर सुनाएँ', cancel: 'छोड़ें', done: 'ठीक', optional: 'ज़रूरी नहीं', language: 'भाषा', overdue: 'छूट गया',
    today: 'आज', recorded: 'दर्ज', checkThese: 'जाँच बाकी',
    fields: { name: 'नाम', age: 'उम्र', stage: 'अवस्था', bp: 'बीपी', weight: 'वज़न', items: 'दिया गया', nextVisit: 'अगला विज़िट' },
    w: { years: 'साल', months: 'महीने', pregnant: 'गर्भवती', child: 'बच्चा', normal: 'नॉर्मल', high: 'ज़्यादा', low: 'कम', tomorrow: 'कल', inDays: '{n} दिन बाद', kg: 'किलो' },
  },
  'mr-IN': {
    app: 'बोलो रजिस्टर', tagline: 'बोला, रजिस्टर भरेल', start: 'बोला', listening: 'ऐकत आहे', tapToStop: 'थांबवण्यासाठी दाबा',
    speakNow: 'एका वाक्यात बोला — नाव, वय, महिना, बीपी, काय दिले, पुढची भेट', sample: 'उदाहरण', typeInstead: 'लिहून भरा',
    parse: 'भरा', todayVisits: 'आजच्या भेटी', confirmSave: 'खात्री करा, नोंदवा', missing: 'रिकामे — दाबून बोला',
    heard: 'ऐकले', yes: 'हो, बरोबर', no: 'नाही, पुन्हा', isCorrect: 'बरोबर आहे?', respeak: 'पुन्हा बोला', pick: 'किंवा निवडा',
    saved: 'नोंद झाली', reminderSet: 'पुढच्या भेटीची आठवण', upcoming: 'येणाऱ्या भेटी', todayList: 'आज नोंदवलेले',
    newVisit: 'नवी भेट', uncertain: 'हे शब्द नीट ऐकू आले नाहीत — शब्द दाबून पुन्हा बोला', noSpeech: 'काहीच ऐकू आले नाही',
    speechFail: 'आवाज समजला नाही — खालून निवडा', notSupported: 'या ब्राउझरमध्ये माइक चालत नाही — Chrome वापरा',
    readBack: 'वाचून दाखवा', cancel: 'सोडा', done: 'ठीक', optional: 'गरजेचे नाही', language: 'भाषा', overdue: 'राहिले',
    today: 'आज', recorded: 'नोंद', checkThese: 'तपासणे बाकी',
    fields: { name: 'नाव', age: 'वय', stage: 'अवस्था', bp: 'बीपी', weight: 'वजन', items: 'दिले', nextVisit: 'पुढची भेट' },
    w: { years: 'वर्षे', months: 'महिने', pregnant: 'गरोदर', child: 'बाळ', normal: 'नॉर्मल', high: 'जास्त', low: 'कमी', tomorrow: 'उद्या', inDays: '{n} दिवसांनी', kg: 'किलो' },
  },
  'bn-IN': {
    app: 'বোলো রেজিস্টার', tagline: 'বলুন, রেজিস্টার ভরে যাবে', start: 'বলুন', listening: 'শুনছি', tapToStop: 'থামাতে চাপুন',
    speakNow: 'এক বাক্যে বলুন — নাম, বয়স, মাস, বিপি, কী দিলেন, পরের ভিজিট', sample: 'উদাহরণ', typeInstead: 'লিখে ভরুন',
    parse: 'ভরুন', todayVisits: 'আজকের ভিজিট', confirmSave: 'নিশ্চিত করে লিখুন', missing: 'খালি — চেপে বলুন',
    heard: 'শুনেছি', yes: 'হ্যাঁ, ঠিক', no: 'না, আবার', isCorrect: 'ঠিক আছে?', respeak: 'আবার বলুন', pick: 'অথবা বেছে নিন',
    saved: 'লেখা হয়েছে', reminderSet: 'পরের ভিজিটের রিমাইন্ডার', upcoming: 'আসন্ন ভিজিট', todayList: 'আজ লেখা',
    newVisit: 'নতুন ভিজিট', uncertain: 'এই শব্দগুলো স্পষ্ট শুনিনি — শব্দে চেপে আবার বলুন', noSpeech: 'কিছু শোনা যায়নি',
    speechFail: 'কথা বোঝা যায়নি — নিচ থেকে বেছে নিন', notSupported: 'এই ব্রাউজারে মাইক চলে না — Chrome ব্যবহার করুন',
    readBack: 'পড়ে শোনান', cancel: 'বাদ দিন', done: 'ঠিক আছে', optional: 'জরুরি নয়', language: 'ভাষা', overdue: 'বাকি',
    today: 'আজ', recorded: 'লেখা', checkThese: 'যাচাই বাকি',
    fields: { name: 'নাম', age: 'বয়স', stage: 'অবস্থা', bp: 'বিপি', weight: 'ওজন', items: 'দেওয়া', nextVisit: 'পরের ভিজিট' },
    w: { years: 'বছর', months: 'মাস', pregnant: 'গর্ভবতী', child: 'শিশু', normal: 'স্বাভাবিক', high: 'বেশি', low: 'কম', tomorrow: 'আগামীকাল', inDays: '{n} দিন পরে', kg: 'কেজি' },
  },
  'te-IN': {
    app: 'బోలో రిజిస్టర్', tagline: 'మాట్లాడండి, రిజిస్టర్ నిండుతుంది', start: 'మాట్లాడండి', listening: 'వింటున్నాం', tapToStop: 'ఆపడానికి నొక్కండి',
    speakNow: 'ఒకే వాక్యంలో చెప్పండి — పేరు, వయసు, నెల, బీపీ, ఇచ్చినవి, తదుపరి విజిట్', sample: 'ఉదాహరణ', typeInstead: 'టైప్ చేయండి',
    parse: 'నింపండి', todayVisits: 'ఈరోజు విజిట్లు', confirmSave: 'నిర్ధారించి నమోదు చేయండి', missing: 'ఖాళీ — నొక్కి చెప్పండి',
    heard: 'విన్నది', yes: 'అవును, సరి', no: 'కాదు, మళ్ళీ', isCorrect: 'సరైనదేనా?', respeak: 'మళ్ళీ చెప్పండి', pick: 'లేదా ఎంచుకోండి',
    saved: 'నమోదైంది', reminderSet: 'తదుపరి విజిట్ రిమైండర్', upcoming: 'రాబోయే విజిట్లు', todayList: 'ఈరోజు నమోదు',
    newVisit: 'కొత్త విజిట్', uncertain: 'ఈ పదాలు స్పష్టంగా వినబడలేదు — పదాన్ని నొక్కి మళ్ళీ చెప్పండి', noSpeech: 'ఏమీ వినబడలేదు',
    speechFail: 'మాట అర్థం కాలేదు — కింద ఎంచుకోండి', notSupported: 'ఈ బ్రౌజర్‌లో మైక్ పనిచేయదు — Chrome వాడండి',
    readBack: 'చదివి వినిపించు', cancel: 'వదిలేయండి', done: 'సరే', optional: 'తప్పనిసరి కాదు', language: 'భాష', overdue: 'మిగిలింది',
    today: 'ఈరోజు', recorded: 'నమోదు', checkThese: 'తనిఖీ మిగిలింది',
    fields: { name: 'పేరు', age: 'వయసు', stage: 'దశ', bp: 'బీపీ', weight: 'బరువు', items: 'ఇచ్చినవి', nextVisit: 'తదుపరి విజిట్' },
    w: { years: 'సంవత్సరాలు', months: 'నెలలు', pregnant: 'గర్భిణి', child: 'బిడ్డ', normal: 'నార్మల్', high: 'ఎక్కువ', low: 'తక్కువ', tomorrow: 'రేపు', inDays: '{n} రోజుల్లో', kg: 'కిలో' },
  },
  'ta-IN': {
    app: 'போலோ பதிவேடு', tagline: 'பேசுங்கள், பதிவேடு நிரம்பும்', start: 'பேசுங்கள்', listening: 'கேட்கிறது', tapToStop: 'நிறுத்த அழுத்தவும்',
    speakNow: 'ஒரே வாக்கியத்தில் — பெயர், வயது, மாதம், பிபி, கொடுத்தவை, அடுத்த வருகை', sample: 'மாதிரி', typeInstead: 'தட்டச்சு செய்',
    parse: 'நிரப்பு', todayVisits: 'இன்றைய வருகைகள்', confirmSave: 'உறுதிசெய்து பதிவு செய்', missing: 'காலி — அழுத்திப் பேசவும்',
    heard: 'கேட்டது', yes: 'ஆம், சரி', no: 'இல்லை, மீண்டும்', isCorrect: 'சரியா?', respeak: 'மீண்டும் பேசு', pick: 'அல்லது தேர்வு செய்',
    saved: 'பதிவானது', reminderSet: 'அடுத்த வருகை நினைவூட்டல்', upcoming: 'வரவிருக்கும் வருகைகள்', todayList: 'இன்று பதிவு',
    newVisit: 'புதிய வருகை', uncertain: 'இந்தச் சொற்கள் தெளிவாக கேட்கவில்லை — சொல்லை அழுத்தி மீண்டும் பேசவும்', noSpeech: 'எதுவும் கேட்கவில்லை',
    speechFail: 'குரல் புரியவில்லை — கீழே தேர்வு செய்யவும்', notSupported: 'இந்த உலாவியில் மைக் இயங்காது — Chrome பயன்படுத்தவும்',
    readBack: 'படித்துக் காட்டு', cancel: 'விடு', done: 'சரி', optional: 'கட்டாயமில்லை', language: 'மொழி', overdue: 'தவறியது',
    today: 'இன்று', recorded: 'பதிவு', checkThese: 'சரிபார்க்க வேண்டியவை',
    fields: { name: 'பெயர்', age: 'வயது', stage: 'நிலை', bp: 'பிபி', weight: 'எடை', items: 'கொடுத்தவை', nextVisit: 'அடுத்த வருகை' },
    w: { years: 'வயது', months: 'மாதம்', pregnant: 'கர்ப்பம்', child: 'குழந்தை', normal: 'சாதாரணம்', high: 'அதிகம்', low: 'குறைவு', tomorrow: 'நாளை', inDays: '{n} நாட்களில்', kg: 'கிலோ' },
  },
  'kn-IN': {
    app: 'ಬೋಲೋ ರಿಜಿಸ್ಟರ್', tagline: 'ಮಾತನಾಡಿ, ರಿಜಿಸ್ಟರ್ ತುಂಬುತ್ತದೆ', start: 'ಮಾತನಾಡಿ', listening: 'ಕೇಳುತ್ತಿದೆ', tapToStop: 'ನಿಲ್ಲಿಸಲು ಒತ್ತಿ',
    speakNow: 'ಒಂದೇ ವಾಕ್ಯದಲ್ಲಿ ಹೇಳಿ — ಹೆಸರು, ವಯಸ್ಸು, ತಿಂಗಳು, ಬಿಪಿ, ಕೊಟ್ಟದ್ದು, ಮುಂದಿನ ಭೇಟಿ', sample: 'ಉದಾಹರಣೆ', typeInstead: 'ಟೈಪ್ ಮಾಡಿ',
    parse: 'ತುಂಬಿಸಿ', todayVisits: 'ಇಂದಿನ ಭೇಟಿಗಳು', confirmSave: 'ಖಚಿತಪಡಿಸಿ ದಾಖಲಿಸಿ', missing: 'ಖಾಲಿ — ಒತ್ತಿ ಹೇಳಿ',
    heard: 'ಕೇಳಿದ್ದು', yes: 'ಹೌದು, ಸರಿ', no: 'ಇಲ್ಲ, ಮತ್ತೆ', isCorrect: 'ಸರಿಯೇ?', respeak: 'ಮತ್ತೆ ಹೇಳಿ', pick: 'ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ',
    saved: 'ದಾಖಲಾಯಿತು', reminderSet: 'ಮುಂದಿನ ಭೇಟಿಯ ಜ್ಞಾಪನೆ', upcoming: 'ಮುಂಬರುವ ಭೇಟಿಗಳು', todayList: 'ಇಂದು ದಾಖಲು',
    newVisit: 'ಹೊಸ ಭೇಟಿ', uncertain: 'ಈ ಪದಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ — ಪದ ಒತ್ತಿ ಮತ್ತೆ ಹೇಳಿ', noSpeech: 'ಏನೂ ಕೇಳಿಸಲಿಲ್ಲ',
    speechFail: 'ಧ್ವನಿ ಅರ್ಥವಾಗಲಿಲ್ಲ — ಕೆಳಗೆ ಆಯ್ಕೆಮಾಡಿ', notSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ — Chrome ಬಳಸಿ',
    readBack: 'ಓದಿ ಹೇಳಿ', cancel: 'ಬಿಡಿ', done: 'ಸರಿ', optional: 'ಕಡ್ಡಾಯವಲ್ಲ', language: 'ಭಾಷೆ', overdue: 'ಬಾಕಿ',
    today: 'ಇಂದು', recorded: 'ದಾಖಲು', checkThese: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    fields: { name: 'ಹೆಸರು', age: 'ವಯಸ್ಸು', stage: 'ಹಂತ', bp: 'ಬಿಪಿ', weight: 'ತೂಕ', items: 'ಕೊಟ್ಟದ್ದು', nextVisit: 'ಮುಂದಿನ ಭೇಟಿ' },
    w: { years: 'ವರ್ಷ', months: 'ತಿಂಗಳು', pregnant: 'ಗರ್ಭಿಣಿ', child: 'ಮಗು', normal: 'ಸಾಮಾನ್ಯ', high: 'ಹೆಚ್ಚು', low: 'ಕಡಿಮೆ', tomorrow: 'ನಾಳೆ', inDays: '{n} ದಿನಗಳಲ್ಲಿ', kg: 'ಕೆಜಿ' },
  },
  'gu-IN': {
    app: 'બોલો રજિસ્ટર', tagline: 'બોલો, રજિસ્ટર ભરાઈ જશે', start: 'બોલો', listening: 'સાંભળી રહ્યા છીએ', tapToStop: 'રોકવા દબાવો',
    speakNow: 'એક વાક્યમાં બોલો — નામ, ઉંમર, મહિનો, બીપી, શું આપ્યું, આવતી મુલાકાત', sample: 'ઉદાહરણ', typeInstead: 'લખીને ભરો',
    parse: 'ભરો', todayVisits: 'આજની મુલાકાતો', confirmSave: 'ખાતરી કરી નોંધો', missing: 'ખાલી — દબાવીને બોલો',
    heard: 'સાંભળ્યું', yes: 'હા, સાચું', no: 'ના, ફરીથી', isCorrect: 'સાચું છે?', respeak: 'ફરી બોલો', pick: 'અથવા પસંદ કરો',
    saved: 'નોંધાઈ ગયું', reminderSet: 'આવતી મુલાકાતની યાદ', upcoming: 'આવનારી મુલાકાતો', todayList: 'આજે નોંધ્યું',
    newVisit: 'નવી મુલાકાત', uncertain: 'આ શબ્દો સ્પષ્ટ સંભળાયા નહીં — શબ્દ દબાવી ફરી બોલો', noSpeech: 'કંઈ સંભળાયું નહીં',
    speechFail: 'અવાજ સમજાયો નહીં — નીચેથી પસંદ કરો', notSupported: 'આ બ્રાઉઝરમાં માઇક ચાલતું નથી — Chrome વાપરો',
    readBack: 'વાંચીને સંભળાવો', cancel: 'છોડો', done: 'બરાબર', optional: 'જરૂરી નથી', language: 'ભાષા', overdue: 'બાકી',
    today: 'આજે', recorded: 'નોંધ', checkThese: 'ચકાસણી બાકી',
    fields: { name: 'નામ', age: 'ઉંમર', stage: 'સ્થિતિ', bp: 'બીપી', weight: 'વજન', items: 'આપ્યું', nextVisit: 'આવતી મુલાકાત' },
    w: { years: 'વર્ષ', months: 'મહિના', pregnant: 'ગર્ભવતી', child: 'બાળક', normal: 'નોર્મલ', high: 'વધારે', low: 'ઓછું', tomorrow: 'કાલે', inDays: '{n} દિવસ પછી', kg: 'કિલો' },
  },
  'en-IN': {
    app: 'Bolo Register', tagline: 'Speak once, the register fills itself', start: 'Speak', listening: 'Listening', tapToStop: 'Tap to stop',
    speakNow: 'Say it in one breath — name, age, month, BP, what you gave, next visit', sample: 'Example', typeInstead: 'Type instead',
    parse: 'Fill', todayVisits: "Today's visits", confirmSave: 'Confirm & record', missing: 'Empty — tap and speak',
    heard: 'Heard', yes: 'Yes, correct', no: 'No, again', isCorrect: 'Is this right?', respeak: 'Say again', pick: 'or pick',
    saved: 'Recorded', reminderSet: 'Next-visit reminder', upcoming: 'Coming up', todayList: 'Recorded today',
    newVisit: 'New visit', uncertain: 'Did not catch these clearly — tap a word and say it again', noSpeech: 'Did not hear anything',
    speechFail: 'Could not catch that — pick below', notSupported: 'Mic does not work in this browser — use Chrome, or type',
    readBack: 'Read aloud', cancel: 'Discard', done: 'OK', optional: 'optional', language: 'Language', overdue: 'overdue',
    today: 'Today', recorded: 'Recorded', checkThese: 'to check',
    fields: { name: 'Name', age: 'Age', stage: 'Stage', bp: 'BP', weight: 'Weight', items: 'Given', nextVisit: 'Next visit' },
    w: { years: 'yrs', months: 'months', pregnant: 'Pregnant', child: 'Child', normal: 'Normal', high: 'High', low: 'Low', tomorrow: 'tomorrow', inDays: 'in {n} days', kg: 'kg' },
  },
};

export const SAMPLES: Record<Lang, string[]> = {
  'hi-IN': [
    'Lakshmi, umra chaubees, saat mahine pregnant, BP normal, tees iron tablet diye, agla visit do hafte mein.',
    'सुनीता, उम्र 22 साल, पांच महीने की गर्भवती, बीपी 110 बटा 70, वजन 48 किलो, 60 कैल्शियम की गोली दी, अगला विज़िट एक महीने बाद',
    'Ravi, chhe mahine ka bachcha, wajan saat kilo, do ORS packet diye, agle hafte phir aana',
  ],
  'mr-IN': ['सविता, वय पंचवीस वर्षे, सहा महिने गरोदर, बीपी नॉर्मल, तीस आयरन गोळ्या दिल्या, पुढची भेट दोन आठवड्यांनी'],
  'bn-IN': ['রুমা, বয়স ২৩ বছর, পাঁচ মাস গর্ভবতী, বিপি নরমাল, ৩০ আয়রন ট্যাবলেট দিয়েছি, পরের ভিজিট দুই সপ্তাহ পরে'],
  'te-IN': ['లక్ష్మి, వయసు 24, ఏడు నెలల గర్భిణి, బీపీ నార్మల్, 30 ఐరన్ మాత్రలు ఇచ్చాను, తదుపరి విజిట్ రెండు వారాల్లో'],
  'ta-IN': ['கவிதா, வயது 26, ஏழு மாதம் கர்ப்பம், பிபி நார்மல், 30 இரும்பு மாத்திரை கொடுத்தேன், இரண்டு வாரத்தில்'],
  'kn-IN': ['ಶಾಂತಾ, ವಯಸ್ಸು 27, ಎಂಟು ತಿಂಗಳು ಗರ್ಭಿಣಿ, ಬಿಪಿ ನಾರ್ಮಲ್, 30 ಐರನ್ ಮಾತ್ರೆ ಕೊಟ್ಟೆ, ಮುಂದಿನ ಭೇಟಿ ಎರಡು ವಾರ ನಂತರ'],
  'gu-IN': ['ગીતા, ઉંમર 21 વર્ષ, ચાર મહિના ગર્ભવતી, બીપી નોર્મલ, 30 આયર્ન ગોળી આપી, આવતી મુલાકાત બે અઠવાડિયા પછી'],
  'en-IN': ['Meena, age 28, six months pregnant, BP 130 by 85, weight 61 kg, gave 30 IFA tablets, next visit in ten days'],
};
