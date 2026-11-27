import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseText, parseSingleField, parseWords, toWords } from '../lib/parser.ts';

const TODAY = new Date(2026, 10, 27); // Fri 27 Nov 2026

test('spec sentence (romanised Hindi)', () => {
  const f = parseText('Lakshmi, umra chaubees, saat mahine pregnant, BP normal, tees iron tablet diye, agla visit do hafte mein.', TODAY);
  assert.equal(f.name.value, 'Lakshmi');
  assert.equal(f.age.value, 24);
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 7 });
  assert.deepEqual(f.bp.value, { status: 'normal' });
  assert.equal(f.items.value?.length, 1);
  assert.equal(f.items.value?.[0].key, 'IFA');
  assert.equal(f.items.value?.[0].qty, 30);
  assert.equal(f.nextVisit.value?.iso, '2026-12-11');
  assert.equal(f.nextVisit.value?.days, 14);
});

test('Devanagari output from hi-IN recogniser, no commas', () => {
  const f = parseText('लक्ष्मी उम्र 24 सात महीने प्रेग्नेंट बीपी नॉर्मल 30 आयरन टैबलेट दिए अगला विजिट दो हफ्ते में', TODAY);
  assert.equal(f.name.value, 'लक्ष्मी');
  assert.equal(f.age.value, 24);
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 7 });
  assert.deepEqual(f.bp.value, { status: 'normal' });
  assert.equal(f.items.value?.[0].qty, 30);
  assert.equal(f.nextVisit.value?.iso, '2026-12-11');
});

test('Devanagari number words', () => {
  const f = parseText('सुनीता उम्र चौबीस साल, पांच महीने की गर्भवती, बीपी एक सौ बीस बटा अस्सी, वजन बावन किलो', TODAY);
  assert.equal(f.name.value, 'सुनीता');
  assert.equal(f.age.value, 24);
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 5 });
  assert.deepEqual(f.bp.value, { sys: 120, dia: 80 });
  assert.equal(f.weight.value, 52);
});

test('English with numeric BP and calcium', () => {
  const f = parseText('Name is Meena Kumari, age 28, six months pregnant, BP 130/85, weight 61 kg, gave 60 calcium tablets and 30 IFA tablets, next visit in one month', TODAY);
  assert.equal(f.name.value, 'Meena Kumari');
  assert.equal(f.age.value, 28);
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 6 });
  assert.deepEqual(f.bp.value, { sys: 130, dia: 85 });
  assert.equal(f.weight.value, 61);
  const items = f.items.value!;
  assert.deepEqual(items.map((i) => [i.key, i.qty]), [['CALCIUM', 60], ['IFA', 30]]);
  assert.equal(f.nextVisit.value?.iso, '2026-12-27');
});

test('English compound numbers: "one hundred twenty by eighty", "twenty four"', () => {
  const f = parseText('Priya age twenty four BP one hundred twenty by eighty, seven months pregnant next visit after ten days', TODAY);
  assert.equal(f.age.value, 24);
  assert.deepEqual(f.bp.value, { sys: 120, dia: 80 });
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 7 });
  assert.equal(f.nextVisit.value?.days, 10);
});

test('child visit: age from stage, ORS', () => {
  const f = parseText('Ravi, chhe mahine ka bachcha, wajan saat kilo, do ORS packet diye, agle hafte phir aana', TODAY);
  assert.equal(f.name.value, 'Ravi');
  assert.deepEqual(f.stage.value, { kind: 'child', months: 6 });
  assert.equal(f.age.value, 0.5);
  assert.equal(f.weight.value, 7);
  assert.equal(f.items.value?.[0].key, 'ORS');
  assert.equal(f.items.value?.[0].qty, 2);
  assert.equal(f.nextVisit.value?.days, 7);
});

test('unknown name stays raw', () => {
  const f = parseText('Xyzzaya Bhoomika umra 19 saal teen mahine pregnant agla visit kal', TODAY);
  assert.equal(f.name.value, 'Xyzzaya Bhoomika');
  assert.equal(f.age.value, 19);
  assert.equal(f.nextVisit.value?.days, 1);
  assert.match(f.nextVisit.warning ?? '', /kal/);
});

test('missing fields stay null', () => {
  const f = parseText('Lakshmi BP normal', TODAY);
  assert.equal(f.age.value, null);
  assert.equal(f.stage.value, null);
  assert.equal(f.nextVisit.value, null);
});

test('weekday and tarikh', () => {
  assert.equal(parseText('Rani agla visit somvar', TODAY).nextVisit.value?.iso, '2026-11-30');
  assert.equal(parseText('Rani agla visit 15 tarikh', TODAY).nextVisit.value?.iso, '2026-12-15');
  assert.equal(parseText('Rani agla visit dedh mahine baad', TODAY).nextVisit.value?.days, 45);
});

test('low-confidence word marks field', () => {
  const words = toWords('Lakshmi umra tees saal');
  words[2].low = true;
  const f = parseWords(words, TODAY);
  assert.equal(f.age.low, true);
  assert.equal(f.name.low, false);
});

test('single field re-speak', () => {
  assert.equal(parseSingleField('age', toWords('tees'), TODAY).value, 30);
  assert.equal(parseSingleField('age', toWords('terah saal'), TODAY).value, 13);
  assert.deepEqual(parseSingleField('bp', toWords('110 by 70'), TODAY).value, { sys: 110, dia: 70 });
  assert.equal(parseSingleField('nextVisit', toWords('do hafte'), TODAY).value?.days, 14);
  assert.deepEqual(parseSingleField('stage', toWords('aath mahine'), TODAY).value, { kind: 'pregnancy', months: 8 });
  assert.equal(parseSingleField('name', toWords('naam Kavitha hai'), TODAY).value, 'Kavitha');
  assert.equal(parseSingleField('weight', toWords('55 kilo'), TODAY).value, 55);
});

test('Tamil script keywords with digits', () => {
  const f = parseText('கவிதா வயது 26 ஏழு மாதம் கர்ப்பம் பிபி நார்மல் இரண்டு வாரத்தில்', TODAY);
  assert.equal(f.name.value, 'கவிதா');
  assert.equal(f.age.value, 26);
  assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: 7 });
  assert.deepEqual(f.bp.value, { status: 'normal' });
  assert.equal(f.nextVisit.value?.days, 14);
});

test('every built-in sample sentence parses fully', async () => {
  const { SAMPLES } = await import('../lib/i18n.ts');
  const expected: Record<string, { name: string; age: number; months: number; days: number; qty: number }> = {
    'mr-IN': { name: 'सविता', age: 25, months: 6, days: 14, qty: 30 },
    'bn-IN': { name: 'রুমা', age: 23, months: 5, days: 14, qty: 30 },
    'te-IN': { name: 'లక్ష్మి', age: 24, months: 7, days: 14, qty: 30 },
    'kn-IN': { name: 'ಶಾಂತಾ', age: 27, months: 8, days: 14, qty: 30 },
    'gu-IN': { name: 'ગીતા', age: 21, months: 4, days: 14, qty: 30 },
  };
  for (const [lang, e] of Object.entries(expected)) {
    const f = parseText(SAMPLES[lang as keyof typeof SAMPLES][0], TODAY);
    assert.equal(f.name.value, e.name, lang + ' name');
    assert.equal(f.age.value, e.age, lang + ' age');
    assert.deepEqual(f.stage.value, { kind: 'pregnancy', months: e.months }, lang + ' stage');
    assert.deepEqual(f.bp.value, { status: 'normal' }, lang + ' bp');
    assert.equal(f.items.value?.[0]?.qty, e.qty, lang + ' qty');
    assert.equal(f.items.value?.[0]?.key, 'IFA', lang + ' item');
    assert.equal(f.nextVisit.value?.days, e.days, lang + ' next');
  }
  for (const s of [...SAMPLES['hi-IN'], ...SAMPLES['ta-IN'], ...SAMPLES['en-IN']]) {
    const f = parseText(s, TODAY);
    for (const k of ['name', 'age', 'stage', 'nextVisit'] as const) assert.notEqual(f[k].value, null, `${k} in "${s}"`);
  }
});
