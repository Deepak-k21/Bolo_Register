// Number words for Hindi (romanised + Devanagari), English and Tamil (romanised + Tamil script).
// Hindi numbers 1-99 are atomic words, so we list them all. English/Tamil tens can combine
// with a following unit ("twenty four", "irupathu naalu").

const HINDI_ROMAN: Record<number, string[]> = {
  1: ['ek', 'ek'], 2: ['do', 'dau'], 3: ['teen', 'tin'], 4: ['char', 'chaar', 'chār'],
  5: ['paanch', 'panch', 'paanc'], 6: ['chhe', 'che', 'chah', 'chhah', 'chheh', 'chhai'],
  7: ['saat', 'sat'], 8: ['aath', 'ath', 'aat'], 9: ['nau', 'nao', 'nav'], 10: ['das', 'dus'],
  11: ['gyarah', 'gyara', 'gyaarah', 'gyaara'], 12: ['barah', 'bara', 'baarah', 'baara'],
  13: ['terah', 'tera', 'tehra'], 14: ['chaudah', 'chauda', 'chodah', 'choda'],
  15: ['pandrah', 'pandra', 'pundrah', 'pandhra'], 16: ['solah', 'sola'], 17: ['satrah', 'satra'],
  18: ['atharah', 'athara', 'attharah', 'atthara'], 19: ['unnis', 'unees', 'unnees'],
  20: ['bees', 'bis'], 21: ['ikkis', 'ikkees'], 22: ['bais', 'baees', 'baais'],
  23: ['teis', 'teyis', 'teees', 'tees23'], 24: ['chaubis', 'chaubees', 'chobis', 'chobees', 'chaubbis'],
  25: ['pachchis', 'pachis', 'pachees', 'pacchis', 'pachchees'],
  26: ['chhabbis', 'chabbis', 'chhabbees', 'chabbees'], 27: ['sattais', 'sattaees', 'sataees'],
  28: ['atthais', 'athais', 'atthaees', 'athaees'], 29: ['untis', 'untees', 'unatis'],
  30: ['tees', 'tis'], 31: ['ikattis', 'iktees', 'ikatees', 'ikatis'], 32: ['battis', 'battees'],
  33: ['taintis', 'tetis', 'taintees', 'tentees'], 34: ['chautis', 'chauntees', 'chontis', 'chauntis'],
  35: ['paintis', 'pentis', 'paintees', 'pentees'], 36: ['chhattis', 'chattis', 'chhattees', 'chattees'],
  37: ['saintis', 'sentis', 'saintees'], 38: ['artis', 'adtees', 'adtis', 'artees'],
  39: ['untalis', 'untaalis', 'untalees'], 40: ['chalis', 'chaalis', 'chalees', 'chaalees'],
  41: ['iktalis', 'iktalees'], 42: ['bayalis', 'bayalees', 'byalis'], 43: ['taitalis', 'tetalis'],
  44: ['chavalis', 'chauvalis', 'chaualis'], 45: ['paintalis', 'pentalis', 'paintalees'],
  46: ['chhiyalis', 'chiyalis'], 47: ['saintalis', 'sentalis'], 48: ['artalis', 'adtalis'],
  49: ['unchas', 'unchaas'], 50: ['pachas', 'pachaas'], 51: ['ikyavan', 'ikyaavan'], 52: ['bavan', 'baavan'],
  53: ['tirpan', 'tirepan'], 54: ['chauvan', 'chauwan'], 55: ['pachpan'], 56: ['chhappan', 'chappan'],
  57: ['sattavan', 'sataavan'], 58: ['atthavan', 'athavan'], 59: ['unsath', 'unsaath'],
  60: ['saath'], 61: ['iksath'], 62: ['baasath', 'basath'], 63: ['tirsath'], 64: ['chausath', 'chaunsath'],
  65: ['painsath', 'pensath'], 66: ['chhiyasath', 'chiyasath'], 67: ['sadsath', 'sarsath'],
  68: ['adsath', 'arsath'], 69: ['unhattar'], 70: ['sattar'], 71: ['ikhattar'], 72: ['bahattar'],
  73: ['tihattar'], 74: ['chauhattar'], 75: ['pachhattar', 'pachattar'], 76: ['chhihattar'],
  77: ['sathattar', 'satattar'], 78: ['athhattar', 'athattar'], 79: ['unasi', 'unaasi'],
  80: ['assi', 'asi'], 81: ['ikyasi'], 82: ['bayasi'], 83: ['tirasi'], 84: ['chaurasi'],
  85: ['pachasi', 'pachaasi'], 86: ['chhiyasi'], 87: ['sattasi'], 88: ['atthasi'], 89: ['navasi', 'nawasi'],
  90: ['nabbe', 'nabbey'], 91: ['ikyanve'], 92: ['baanve', 'banve'], 93: ['tiranve'], 94: ['chauranve'],
  95: ['pachanve'], 96: ['chhiyanve'], 97: ['sattanve'], 98: ['atthanve'], 99: ['ninyanve'],
};

const HINDI_DEVA: Record<number, string[]> = {
  1: ['एक'], 2: ['दो'], 3: ['तीन'], 4: ['चार'], 5: ['पांच', 'पाँच'], 6: ['छह', 'छः', 'छे', 'छै'],
  7: ['सात'], 8: ['आठ'], 9: ['नौ'], 10: ['दस'], 11: ['ग्यारह'], 12: ['बारह'], 13: ['तेरह'],
  14: ['चौदह'], 15: ['पंद्रह', 'पन्द्रह'], 16: ['सोलह'], 17: ['सत्रह'], 18: ['अठारह'],
  19: ['उन्नीस'], 20: ['बीस'], 21: ['इक्कीस'], 22: ['बाईस'], 23: ['तेईस'], 24: ['चौबीस'],
  25: ['पच्चीस'], 26: ['छब्बीस'], 27: ['सत्ताईस'], 28: ['अट्ठाईस', 'अठ्ठाईस'], 29: ['उनतीस'],
  30: ['तीस'], 31: ['इकतीस'], 32: ['बत्तीस'], 33: ['तैंतीस'], 34: ['चौंतीस'], 35: ['पैंतीस'],
  36: ['छत्तीस'], 37: ['सैंतीस'], 38: ['अड़तीस', 'अडतीस'], 39: ['उनतालीस'], 40: ['चालीस'],
  41: ['इकतालीस'], 42: ['बयालीस'], 43: ['तैंतालीस'], 44: ['चवालीस', 'चौवालीस'], 45: ['पैंतालीस'],
  46: ['छियालीस'], 47: ['सैंतालीस'], 48: ['अड़तालीस', 'अडतालीस'], 49: ['उनचास'], 50: ['पचास'],
  51: ['इक्यावन'], 52: ['बावन'], 53: ['तिरपन'], 54: ['चौवन'], 55: ['पचपन'], 56: ['छप्पन'],
  57: ['सत्तावन'], 58: ['अट्ठावन'], 59: ['उनसठ'], 60: ['साठ'], 61: ['इकसठ'], 62: ['बासठ'],
  63: ['तिरसठ'], 64: ['चौंसठ'], 65: ['पैंसठ'], 66: ['छियासठ'], 67: ['सड़सठ'], 68: ['अड़सठ'],
  69: ['उनहत्तर'], 70: ['सत्तर'], 71: ['इकहत्तर'], 72: ['बहत्तर'], 73: ['तिहत्तर'], 74: ['चौहत्तर'],
  75: ['पचहत्तर'], 76: ['छिहत्तर'], 77: ['सतहत्तर'], 78: ['अठहत्तर'], 79: ['उन्यासी', 'उनासी'],
  80: ['अस्सी'], 81: ['इक्यासी'], 82: ['बयासी'], 83: ['तिरासी'], 84: ['चौरासी'], 85: ['पचासी'],
  86: ['छियासी'], 87: ['सत्तासी'], 88: ['अट्ठासी'], 89: ['नवासी'], 90: ['नब्बे'], 91: ['इक्यानवे'],
  92: ['बानवे'], 93: ['तिरानवे'], 94: ['चौरानवे'], 95: ['पचानवे'], 96: ['छियानवे'], 97: ['सत्तानवे'],
  98: ['अट्ठानवे'], 99: ['निन्यानवे'],
};

const ENGLISH: Record<number, string[]> = {
  1: ['one'], 2: ['two'], 3: ['three'], 4: ['four'], 5: ['five'], 6: ['six'], 7: ['seven'],
  8: ['eight'], 9: ['nine'], 10: ['ten'], 11: ['eleven'], 12: ['twelve'], 13: ['thirteen'],
  14: ['fourteen'], 15: ['fifteen'], 16: ['sixteen'], 17: ['seventeen'], 18: ['eighteen'],
  19: ['nineteen'], 20: ['twenty'], 30: ['thirty'], 40: ['forty', 'fourty'], 50: ['fifty'],
  60: ['sixty'], 70: ['seventy'], 80: ['eighty'], 90: ['ninety'],
};

const TAMIL: Record<number, string[]> = {
  1: ['onnu', 'ondru', 'oru', 'ஒன்று', 'ஒரு', 'ஒண்ணு'], 2: ['rendu', 'irandu', 'இரண்டு', 'ரெண்டு'],
  3: ['moonu', 'moondru', 'மூன்று', 'மூணு'], 4: ['naalu', 'naangu', 'நான்கு', 'நாலு'],
  5: ['anju', 'ainthu', 'aindhu', 'ஐந்து', 'அஞ்சு'], 6: ['aaru', 'ஆறு'], 7: ['ezhu', 'elu', 'ஏழு'],
  8: ['ettu', 'எட்டு'], 9: ['onbadhu', 'ombodhu', 'ஒன்பது'], 10: ['pathu', 'paththu', 'பத்து'],
  20: ['iruvathu', 'irupathu', 'இருபது', 'இருபத்தி', 'இருபத்து'],
  30: ['muppathu', 'முப்பது', 'முப்பத்தி', 'முப்பத்து'],
  40: ['naarpathu', 'நாற்பது', 'நாற்பத்தி', 'நாற்பத்து'],
  50: ['aimbathu', 'ஐம்பது', 'ஐம்பத்தி', 'ஐம்பத்து'],
};

// Marathi, Bengali, Gujarati number words are atomic like Hindi; common ones listed.
const MARATHI: Record<number, string[]> = {
  1: ['एक'], 2: ['दोन'], 3: ['तीन'], 4: ['चार'], 5: ['पाच'], 6: ['सहा'], 7: ['सात'], 8: ['आठ'], 9: ['नऊ'], 10: ['दहा'],
  11: ['अकरा'], 12: ['बारा'], 13: ['तेरा'], 14: ['चौदा'], 15: ['पंधरा'], 16: ['सोळा'], 17: ['सतरा'], 18: ['अठरा'],
  19: ['एकोणीस'], 20: ['वीस'], 21: ['एकवीस'], 22: ['बावीस'], 23: ['तेवीस'], 24: ['चोवीस'], 25: ['पंचवीस'],
  26: ['सव्वीस'], 27: ['सत्तावीस'], 28: ['अठ्ठावीस'], 29: ['एकोणतीस'], 30: ['तीस'], 35: ['पस्तीस'], 40: ['चाळीस'],
  45: ['पंचेचाळीस'], 50: ['पन्नास'], 60: ['साठ'], 70: ['सत्तर'], 80: ['ऐंशी'], 90: ['नव्वद'], 100: ['शंभर'],
};
const BENGALI: Record<number, string[]> = {
  1: ['এক'], 2: ['দুই', 'দু'], 3: ['তিন'], 4: ['চার'], 5: ['পাঁচ'], 6: ['ছয়', 'ছয়'], 7: ['সাত'], 8: ['আট'], 9: ['নয়', 'নয়'],
  10: ['দশ'], 11: ['এগারো'], 12: ['বারো'], 13: ['তেরো'], 14: ['চোদ্দ'], 15: ['পনেরো'], 16: ['ষোলো'], 17: ['সতেরো'],
  18: ['আঠারো'], 19: ['উনিশ'], 20: ['কুড়ি', 'বিশ', 'কুড়ি'], 21: ['একুশ'], 22: ['বাইশ'], 23: ['তেইশ'], 24: ['চব্বিশ'],
  25: ['পঁচিশ'], 26: ['ছাব্বিশ'], 27: ['সাতাশ'], 28: ['আঠাশ'], 29: ['উনত্রিশ'], 30: ['তিরিশ', 'ত্রিশ'], 35: ['পঁয়ত্রিশ'],
  40: ['চল্লিশ'], 50: ['পঞ্চাশ'], 60: ['ষাট'], 70: ['সত্তর'], 80: ['আশি'], 90: ['নব্বই'], 100: ['একশো', 'শো'],
};
const GUJARATI: Record<number, string[]> = {
  1: ['એક'], 2: ['બે'], 3: ['ત્રણ'], 4: ['ચાર'], 5: ['પાંચ'], 6: ['છ'], 7: ['સાત'], 8: ['આઠ'], 9: ['નવ'], 10: ['દસ'],
  11: ['અગિયાર'], 12: ['બાર'], 13: ['તેર'], 14: ['ચૌદ'], 15: ['પંદર'], 16: ['સોળ'], 17: ['સત્તર'], 18: ['અઢાર'],
  19: ['ઓગણીસ'], 20: ['વીસ'], 21: ['એકવીસ'], 22: ['બાવીસ'], 23: ['ત્રેવીસ'], 24: ['ચોવીસ'], 25: ['પચીસ'],
  26: ['છવ્વીસ'], 27: ['સત્તાવીસ'], 28: ['અઠ્ઠાવીસ'], 29: ['ઓગણત્રીસ'], 30: ['ત્રીસ'], 35: ['પાંત્રીસ'], 40: ['ચાળીસ'],
  50: ['પચાસ'], 60: ['સાઠ'], 70: ['સિત્તેર'], 80: ['એંશી'], 90: ['નેવું'], 100: ['સો'],
};
// Telugu and Kannada tens combine with a following unit, like Tamil.
const TELUGU: Record<number, string[]> = {
  1: ['ఒకటి', 'ఒక'], 2: ['రెండు'], 3: ['మూడు'], 4: ['నాలుగు'], 5: ['ఐదు'], 6: ['ఆరు'], 7: ['ఏడు'], 8: ['ఎనిమిది'],
  9: ['తొమ్మిది'], 10: ['పది'], 20: ['ఇరవై'], 30: ['ముప్పై'], 40: ['నలభై'], 50: ['యాభై'], 60: ['అరవై'], 70: ['డెబ్బై'],
  80: ['ఎనభై'], 90: ['తొంభై'],
};
const KANNADA: Record<number, string[]> = {
  1: ['ಒಂದು'], 2: ['ಎರಡು'], 3: ['ಮೂರು'], 4: ['ನಾಲ್ಕು'], 5: ['ಐದು'], 6: ['ಆರು'], 7: ['ಏಳು'], 8: ['ಎಂಟು'], 9: ['ಒಂಬತ್ತು'],
  10: ['ಹತ್ತು'], 20: ['ಇಪ್ಪತ್ತು'], 30: ['ಮೂವತ್ತು'], 40: ['ನಲವತ್ತು'], 50: ['ಐವತ್ತು'], 60: ['ಅರವತ್ತು'], 70: ['ಎಪ್ಪತ್ತು'],
  80: ['ಎಂಬತ್ತು'], 90: ['ತೊಂಬತ್ತು'],
};

// Hindi ordinals for "satvan mahina" (7th month).
const ORDINALS: Record<string, number> = {
  pehla: 1, pahla: 1, doosra: 2, dusra: 2, teesra: 3, tisra: 3, chautha: 4, paanchva: 5, panchva: 5,
  paanchvan: 5, chhatha: 6, chhata: 6, saatva: 7, satva: 7, saatvan: 7, satvan: 7, saatvaan: 7,
  aathva: 8, aathvan: 8, athvan: 8, nauva: 9, nauvan: 9, nauvaan: 9,
  'पहला': 1, 'दूसरा': 2, 'तीसरा': 3, 'चौथा': 4, 'पांचवां': 5, 'पाँचवाँ': 5, 'छठा': 6,
  'सातवां': 7, 'सातवाँ': 7, 'सातवें': 7, 'आठवां': 8, 'आठवाँ': 8, 'आठवें': 8, 'नौवां': 9, 'नौवाँ': 9,
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9,
};

const FRACTIONS: Record<string, number> = {
  dedh: 1.5, derh: 1.5, 'डेढ़': 1.5, 'डेढ': 1.5, dhai: 2.5, dhaai: 2.5, 'ढाई': 2.5, half: 0.5, aadha: 0.5, 'आधा': 0.5,
};

export const HUNDRED_WORDS = new Set(['sau', 'so', 'hundred', 'सौ', 'நூறு', 'nooru', 'शंभर', 'শো', 'સો', 'వంద', 'ನೂರು']);

type NumEntry = { value: number; combinable: boolean };
const WORD_TO_NUM = new Map<string, NumEntry>();

function add(table: Record<number, string[]>, combinable: boolean) {
  for (const [n, words] of Object.entries(table)) {
    for (const w of words) {
      const v = Number(n);
      // English/Tamil tens (20,30..) combine with a following unit word.
      if (!WORD_TO_NUM.has(w)) WORD_TO_NUM.set(w, { value: v, combinable: combinable && v % 10 === 0 && v >= 20 });
    }
  }
}
add(HINDI_ROMAN, false);
add(HINDI_DEVA, false);
add(ENGLISH, true);
add(TAMIL, true);
add(MARATHI, false);
add(BENGALI, false);
add(GUJARATI, false);
add(TELUGU, true);
add(KANNADA, true);
// "tees23" is a placeholder to avoid a duplicate key; remove it.
WORD_TO_NUM.delete('tees23');
// "so" is too common in English to be "sau"; only accept it after a number (handled in tokenizer).

export function wordToNumber(w: string): NumEntry | null {
  if (FRACTIONS[w] !== undefined) return { value: FRACTIONS[w], combinable: false };
  return WORD_TO_NUM.get(w) ?? null;
}

export function ordinalToNumber(w: string): number | null {
  return ORDINALS[w] ?? null;
}

// Zero code points of Indic digit blocks: Devanagari, Bengali, Gujarati, Tamil, Telugu, Kannada.
const DIGIT_ZEROS = [0x0966, 0x09e6, 0x0ae6, 0x0be6, 0x0c66, 0x0ce6];
export function asciiDigits(s: string): string {
  return s.replace(/[०-९০-৯૦-૯௦-௯౦-౯೦-೯]/g, (c) => {
    const cp = c.codePointAt(0)!;
    const z = DIGIT_ZEROS.find((z) => cp >= z && cp <= z + 9)!;
    return String(cp - z);
  });
}

// Canonical spoken forms used for read-back.
export function hindiWord(n: number): string {
  if (n === 1.5) return 'डेढ़';
  if (n === 2.5) return 'ढाई';
  if (!Number.isInteger(n)) return String(n);
  if (n === 0) return 'शून्य';
  if (n === 100) return 'सौ';
  if (n > 100 && n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return `${h === 1 ? 'एक' : HINDI_DEVA[h][0]} सौ${r ? ' ' + HINDI_DEVA[r][0] : ''}`;
  }
  return HINDI_DEVA[n]?.[0] ?? String(n);
}
export function hindiRoman(n: number): string {
  if (!Number.isInteger(n) || n <= 0) return String(n);
  if (n === 100) return 'sau';
  if (n > 100 && n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return `${HINDI_ROMAN[h][0]} sau${r ? ' ' + HINDI_ROMAN[r][0] : ''}`;
  }
  return HINDI_ROMAN[n]?.[0] ?? String(n);
}
const EN_UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
export function englishWord(n: number): string {
  if (!Number.isInteger(n)) return n === 1.5 ? 'one and a half' : n === 2.5 ? 'two and a half' : String(n);
  if (n < 20) return EN_UNITS[n];
  if (n < 100) return EN_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + EN_UNITS[n % 10] : '');
  if (n < 1000) {
    const r = n % 100;
    return `${EN_UNITS[Math.floor(n / 100)]} hundred${r ? ' ' + englishWord(r) : ''}`;
  }
  return String(n);
}

// Numbers that are commonly misheard for each other. Shown during read-back so the
// worker consciously rejects the twin ("30 tees — not 13 terah").
export function soundAlikes(n: number): number[] {
  const out = new Set<number>();
  if (n >= 13 && n <= 19) out.add((n - 10) * 10); // thirteen <-> thirty
  if (n >= 30 && n <= 90 && n % 10 === 0) out.add(n / 10 + 10);
  const pairs: [number, number][] = [[3, 30], [20, 22], [7, 60], [2, 12], [6, 16], [50, 15], [40, 14], [8, 18]];
  for (const [a, b] of pairs) { if (n === a) out.add(b); if (n === b) out.add(a); }
  out.delete(n);
  return [...out];
}
