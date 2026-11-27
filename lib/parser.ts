// Deterministic field extractor: keyword lexicon + regex + number/date resolver.
// Works with zero network and zero keys. Handles romanised Hindi ("umra chaubees"),
// Devanagari ("उम्र चौबीस"), English, Tamil keywords and code-mixed speech.

import { asciiDigits, HUNDRED_WORDS, ordinalToNumber, wordToNumber } from './numbers.ts';
import { itemByKey, itemKeyOf, stemTag, tagOf, tamilStem, weekdayOf, type Tag } from './lexicon.ts';
import { addDays, addMonths, daysBetween, nextDayOfMonth, nextWeekday, toISO } from './dates.ts';
import type { Field, FieldKey, Fields, Item, Word } from './types.ts';

export interface Token {
  raw: string; // as spoken, punctuation stripped
  norm: string;
  tag: Tag | null;
  num: number | null;
  combinable: boolean;
  ord: number | null;
  pair: [number, number] | null; // "120/80"
  ws: number[]; // word indexes
  boundary: boolean; // a comma / full stop followed this token
  item: string | null;
  weekday: number | null;
  loc: boolean; // Tamil locative suffix ("vaarathil" = in a week) acts like "mein"
}

const PUNCT_END = /[,.;:!?।॥|]+$/;
const PUNCT_ANY = /^[\s,.;:!?।॥|"'“”‘’()\[\]]+|[\s,.;:!?।॥|"'“”‘’()\[\]]+$/g;

function mkToken(raw: string, norm: string, ws: number[]): Token {
  let num: number | null = null, combinable = false, pair: [number, number] | null = null;
  const pm = norm.match(/^(\d{2,3})\s*[\/\\-]\s*(\d{2,3})$/);
  if (pm) pair = [Number(pm[1]), Number(pm[2])];
  else if (/^\d+(\.\d+)?$/.test(norm)) num = Number(norm);
  else {
    const n = wordToNumber(norm);
    if (n) { num = n.value; combinable = n.combinable; }
  }
  let tag: Tag | null = null;
  let loc = false;
  if (num === null && !pair) {
    for (const s of tamilStem(norm)) { tag = tagOf(s); if (tag) { loc = s !== norm; norm = s; break; } }
    if (!tag) {
      const st = stemTag(norm);
      // A case ending on a time word ("వారాల్లో", "आठवड्यांनी") means "in / after".
      if (st) { tag = st.tag; loc = ['DAYS', 'WEEKS', 'MONTHS'].includes(st.tag); }
    }
  }
  return {
    raw, norm, tag, num, combinable, pair, ws, boundary: false,
    ord: num === null ? ordinalToNumber(norm) : null,
    item: tag === 'ITEM' ? itemKeyOf(norm) : null,
    weekday: tag === 'WEEKDAY' ? weekdayOf(norm) : null,
    loc: loc || /(த்தில்|ில்)$/.test(raw),
  };
}

export function tokenize(words: Word[]): Token[] {
  const out: Token[] = [];
  words.forEach((w, wi) => {
    const boundary = PUNCT_END.test(w.text);
    let text = asciiDigits(w.text).replace(PUNCT_ANY, '');
    if (!text) { if (boundary && out.length) out[out.length - 1].boundary = true; return; }
    const lower = text.toLowerCase();
    // "120/80" stays one token. "24yrs", "55kg", "30tablet" split into number + word.
    const parts: string[] = [];
    const glued = lower.match(/^(\d+(?:\.\d+)?)([a-z\u0900-\u0DFF]+)$/);
    if (glued && !/^\d+\/\d+$/.test(lower)) parts.push(glued[1], glued[2]);
    else parts.push(lower);
    parts.forEach((p) => out.push(mkToken(parts.length === 1 ? text : p, p, [wi])));
    if (boundary) out[out.length - 1].boundary = true;
  });
  // "blood pressure" -> BP
  for (let i = 0; i < out.length - 1; i++) {
    if (out[i].tag === 'BLOOD' && out[i + 1].tag === 'PRESSURE') {
      out[i] = { ...out[i], tag: 'BP', raw: out[i].raw + ' ' + out[i + 1].raw, ws: [...out[i].ws, ...out[i + 1].ws], boundary: out[i + 1].boundary };
      out.splice(i + 1, 1);
    }
  }
  return combineNumbers(out);
}

function isHundred(t: Token | undefined, prevIsNum: boolean): boolean {
  if (!t) return false;
  if (t.norm === 'so') return prevIsNum; // "do so" only after a number
  return HUNDRED_WORDS.has(t.norm);
}

function merge(a: Token, b: Token, num: number): Token {
  return { ...a, raw: a.raw + ' ' + b.raw, norm: a.norm + ' ' + b.norm, num, combinable: false, ws: [...a.ws, ...b.ws], boundary: b.boundary };
}

function combineNumbers(ts: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < ts.length; i++) {
    let t = ts[i];
    if (t.num === null && isHundred(t, false)) t = { ...t, num: 100, tag: null };
    if (t.num !== null && !t.boundary) {
      // tens + unit: "twenty four", "irupathu naalu"
      const n1 = ts[i + 1];
      if (t.combinable && n1 && n1.num !== null && n1.num >= 1 && n1.num <= 9 && !n1.combinable) { t = merge(t, n1, t.num! + n1.num); i++; }
      // x hundred [y]
      const n2 = ts[i + 1];
      if (!t.boundary && isHundred(n2, true) && t.num! < 10) {
        t = merge(t, n2, t.num! * 100); i++;
        let n3 = ts[i + 1];
        if (!t.boundary && n3 && n3.num !== null && n3.num < 100) {
          let add = n3.num; let m = n3;
          const n4 = ts[i + 2];
          if (n3.combinable && n4 && n4.num !== null && n4.num <= 9) { m = merge(n3, n4, n3.num + n4.num); add = m.num!; i++; }
          t = merge(t, m, t.num! + add); i++;
        }
      } else if (t.num === 100 && !t.boundary) {
        const n3 = ts[i + 1];
        if (n3 && n3.num !== null && n3.num < 100) { t = merge(t, n3, 100 + n3.num); i++; }
      }
    }
    out.push(t);
  }
  return out;
}

// ---------------------------------------------------------------------------

const TIME_UNITS: Tag[] = ['DAYS', 'WEEKS', 'MONTHS', 'YEARS'];
const SKIPPABLE: (Tag | null)[] = ['FILLER'];

export function emptyField<K extends FieldKey>(): Field<K> {
  return { value: null, heard: '', words: [], low: false, source: 'speech', confirmed: false };
}
export function emptyFields(): Fields {
  return {
    name: emptyField<'name'>(), age: emptyField<'age'>(), stage: emptyField<'stage'>(), bp: emptyField<'bp'>(),
    weight: emptyField<'weight'>(), items: emptyField<'items'>(), nextVisit: emptyField<'nextVisit'>(),
  };
}

class Ctx {
  used = new Set<number>();
  t: Token[]; words: Word[]; today: Date;
  constructor(t: Token[], words: Word[], today: Date) { this.t = t; this.words = words; this.today = today; }
  free(i: number) { return i >= 0 && i < this.t.length && !this.used.has(i); }
  use(...is: number[]) { is.forEach((i) => this.used.add(i)); }
  /** Next index after i that is not a filler word, within `max` steps. */
  next(i: number, max = 3, skip: (Tag | null)[] = SKIPPABLE): number {
    for (let j = i + 1, steps = 0; j < this.t.length && steps < max; j++, steps++) {
      if (!skip.includes(this.t[j].tag)) return j;
    }
    return -1;
  }
  prev(i: number, max = 3, skip: (Tag | null)[] = SKIPPABLE): number {
    for (let j = i - 1, steps = 0; j >= 0 && steps < max; j--, steps++) {
      if (!skip.includes(this.t[j].tag)) return j;
    }
    return -1;
  }
  field<K extends FieldKey>(value: Fields[K]['value'], idx: number[], warning?: string): Field<K> {
    const ws = [...new Set(idx.flatMap((i) => this.t[i].ws))].sort((a, b) => a - b);
    return {
      value, words: ws, heard: idx.sort((a, b) => a - b).map((i) => this.t[i].raw).join(' '),
      low: ws.some((w) => this.words[w]?.low), source: 'speech', confirmed: false, warning,
    } as Field<K>;
  }
  isNum(i: number) { return i >= 0 && i < this.t.length && this.t[i].num !== null && this.free(i); }
  tagAt(i: number) { return i >= 0 && i < this.t.length ? this.t[i].tag : null; }
}

function extractStage(c: Ctx, f: Fields) {
  const { t } = c;
  const pregIdx = t.findIndex((x) => x.tag === 'PREG');
  const childIdx = t.findIndex((x) => x.tag === 'CHILD');
  const findDuration = (center: number, units: Tag[]) => {
    for (let d = 1; d <= 4; d++) {
      for (const i of [center - d, center + d]) {
        if (!c.free(i)) continue;
        const tok = t[i];
        if (tok.num !== null || tok.ord !== null) {
          const u = c.next(i, 2);
          if (u >= 0 && units.includes(t[u].tag!) && c.free(u)) return { n: tok.num ?? tok.ord!, i, u, unit: t[u].tag! };
        }
      }
    }
    return null;
  };
  if (pregIdx >= 0) {
    c.use(pregIdx);
    const d = findDuration(pregIdx, ['MONTHS', 'WEEKS']);
    if (d) {
      c.use(d.i, d.u);
      const months = d.unit === 'WEEKS' ? Math.round(d.n / 4.345) : d.n;
      const warn = months < 1 || months > 10 ? `Pregnancy of ${months} months looks wrong - please check` : d.unit === 'WEEKS' ? `Converted ${d.n} weeks to months` : undefined;
      f.stage = c.field<'stage'>({ kind: 'pregnancy', months }, [pregIdx, d.i, d.u], warn);
    } else {
      f.stage = c.field<'stage'>({ kind: 'pregnancy', months: null }, [pregIdx], 'Pregnant - but month not heard');
    }
    return;
  }
  if (childIdx >= 0) {
    c.use(childIdx);
    const d = findDuration(childIdx, ['MONTHS', 'YEARS']);
    if (d) {
      c.use(d.i, d.u);
      const months = d.unit === 'YEARS' ? d.n * 12 : d.n;
      f.stage = c.field<'stage'>({ kind: 'child', months }, [childIdx, d.i, d.u]);
      if (!f.age.value) f.age = c.field<'age'>(Math.round((months / 12) * 10) / 10, [d.i, d.u]);
    } else {
      f.stage = c.field<'stage'>({ kind: 'child', months: null }, [childIdx], 'Child - but age not heard');
    }
    return;
  }
  // No explicit word. "saat mahine" on its own in an ANC register most likely means pregnancy.
  for (let i = 0; i < t.length; i++) {
    if (!c.isNum(i) && t[i].ord === null) continue;
    if (!c.free(i)) continue;
    const u = c.next(i, 2);
    if (u < 0 || t[u].tag !== 'MONTHS') continue;
    const after = c.next(u, 2);
    const before = c.prev(i, 2);
    if (c.tagAt(after) === 'IN' || c.tagAt(after) === 'AFTER' || c.tagAt(before) === 'NEXT' || c.tagAt(before) === 'VISIT') continue;
    c.use(i, u);
    f.stage = c.field<'stage'>({ kind: 'pregnancy', months: t[i].num ?? t[i].ord }, [i, u], 'Assumed pregnancy (word "pregnant" not heard)');
    return;
  }
}

function extractAge(c: Ctx, f: Fields) {
  const { t } = c;
  for (let i = 0; i < t.length; i++) {
    if (t[i].tag !== 'AGE' || !c.free(i)) continue;
    const j = c.next(i, 3, ['FILLER', 'YEARS']);
    if (c.isNum(j)) {
      const u = c.next(j, 2);
      const idx = [i, j];
      let years = t[j].num!;
      if (u >= 0 && c.free(u) && (t[u].tag === 'YEARS' || t[u].tag === 'MONTHS')) {
        idx.push(u);
        if (t[u].tag === 'MONTHS') years = Math.round((years / 12) * 10) / 10;
      }
      c.use(...idx);
      f.age = c.field<'age'>(years, idx, ageWarning(years));
      return;
    }
  }
  // "24 saal ki", "24 years old"
  for (let i = 0; i < t.length; i++) {
    if (!c.isNum(i)) continue;
    const u = c.next(i, 2);
    if (u < 0 || t[u].tag !== 'YEARS' || !c.free(u)) continue;
    const after = c.next(u, 2);
    if (c.tagAt(after) === 'IN' || c.tagAt(after) === 'AFTER') continue;
    c.use(i, u);
    f.age = c.field<'age'>(t[i].num!, [i, u], ageWarning(t[i].num!));
    return;
  }
}
const ageWarning = (y: number) => (y > 110 ? 'Age over 110 - please check' : undefined);

function extractBP(c: Ctx, f: Fields) {
  const { t } = c;
  const b = t.findIndex((x, i) => x.tag === 'BP' && c.free(i));
  if (b < 0) {
    // bare "120/80" anywhere is a BP reading
    const p = t.findIndex((x, i) => x.pair && c.free(i));
    if (p >= 0) { c.use(p); f.bp = c.field<'bp'>({ sys: t[p].pair![0], dia: t[p].pair![1] }, [p], bpWarning(t[p].pair![0], t[p].pair![1])); }
    return;
  }
  c.use(b);
  const j = c.next(b, 3);
  const j0 = j;
  if (j >= 0 && t[j].pair) {
    c.use(j);
    f.bp = c.field<'bp'>({ sys: t[j].pair![0], dia: t[j].pair![1] }, [b, j], bpWarning(...t[j].pair!));
    return;
  }
  if (c.isNum(j)) {
    let k = c.next(j, 2);
    const idx = [b, j];
    if (k >= 0 && t[k].tag === 'BY') { idx.push(k); k = c.next(k, 2); }
    if (c.isNum(k)) {
      idx.push(k);
      c.use(...idx);
      f.bp = c.field<'bp'>({ sys: t[j].num!, dia: t[k].num! }, idx, bpWarning(t[j].num!, t[k].num!));
    } else {
      c.use(j);
      f.bp = c.field<'bp'>({ sys: t[j].num! }, [b, j], 'Only one BP number heard - say both, e.g. "120 by 80"');
    }
    return;
  }
  if (j0 >= 0 && ['NORMAL', 'HIGH', 'LOW'].includes(t[j0].tag!)) {
    c.use(j0);
    const status = t[j0].tag === 'NORMAL' ? 'normal' : t[j0].tag === 'HIGH' ? 'high' : 'low';
    f.bp = c.field<'bp'>({ status }, [b, j0], status !== 'normal' ? 'BP reported ' + status + ' - add the reading if you have it' : undefined);
    return;
  }
  f.bp = { ...c.field<'bp'>(null, [b]), warning: 'BP mentioned but value not heard' };
}
function bpWarning(s: number, d: number) {
  if (s < 70 || s > 250 || d < 40 || d > 150 || d >= s) return `BP ${s}/${d} looks unusual - please check`;
  if (s >= 140 || d >= 90) return 'High BP - refer as per protocol';
  return undefined;
}

function extractWeight(c: Ctx, f: Fields) {
  const { t } = c;
  for (let i = 0; i < t.length; i++) {
    if (t[i].tag === 'WEIGHT' && c.free(i)) {
      const j = c.next(i, 3);
      if (c.isNum(j)) {
        const idx = [i, j];
        const k = c.next(j, 1);
        if (k >= 0 && t[k].tag === 'KG') idx.push(k);
        c.use(...idx);
        f.weight = c.field<'weight'>(t[j].num!, idx, weightWarning(t[j].num!));
        return;
      }
    }
  }
  for (let i = 0; i < t.length; i++) {
    const k = c.next(i, 1);
    if (c.isNum(i) && k >= 0 && t[k].tag === 'KG' && c.free(k)) {
      c.use(i, k);
      f.weight = c.field<'weight'>(t[i].num!, [i, k], weightWarning(t[i].num!));
      return;
    }
  }
}
const weightWarning = (kg: number) => (kg < 1 || kg > 150 ? `Weight ${kg} kg looks unusual - please check` : undefined);

function extractItems(c: Ctx, f: Fields) {
  const { t } = c;
  const items: Item[] = [];
  const idxAll: number[] = [];
  const unitTags: Tag[] = ['UNIT_TAB', 'UNIT_PACKET', 'UNIT_INJ'];
  const qtyOk = (i: number) => {
    if (!c.isNum(i)) return false;
    const n = c.next(i, 1);
    return !(n >= 0 && (TIME_UNITS.includes(t[n].tag!) || t[n].tag === 'KG'));
  };
  for (let i = 0; i < t.length; i++) {
    if (t[i].tag !== 'ITEM' || !c.free(i)) continue;
    let key = t[i].item!;
    const idx = [i];
    // "iron folic acid" -> IFA
    const n1 = i + 1;
    if (key === 'IFA' && t[n1]?.item === 'FOLIC') { idx.push(n1); }
    if (key === 'FOLIC' && t[i - 1]?.item === 'IFA') continue;
    const last = idx[idx.length - 1];
    if (t[last + 1] && /^(acid|एसिड|ऐसिड)$/.test(t[last + 1].norm)) idx.push(last + 1);
    c.use(...idx);
    // quantity: look behind first ("tees iron"), then ahead ("iron tablet tees")
    let q = -1;
    for (const j of [i - 1, i - 2, i - 3]) {
      if (j < 0) break;
      if (qtyOk(j)) { q = j; break; }
      if (!(unitTags.includes(t[j].tag!) || t[j].tag === 'FILLER')) break;
    }
    if (q < 0) {
      for (let j = idx[idx.length - 1] + 1, s = 0; j < t.length && s < 3; j++, s++) {
        if (qtyOk(j)) { q = j; break; }
        if (!(unitTags.includes(t[j].tag!) || t[j].tag === 'FILLER' || t[j].tag === 'ITEM')) break;
      }
    }
    // unit word next to the item
    let unit = itemByKey(key).unit;
    for (const j of [idx[idx.length - 1] + 1, idx[idx.length - 1] + 2, i - 1]) {
      if (j >= 0 && j < t.length && unitTags.includes(t[j].tag!) && c.free(j)) {
        idx.push(j); c.use(j);
        unit = t[j].tag === 'UNIT_TAB' ? 'tablets' : t[j].tag === 'UNIT_PACKET' ? 'packets' : 'dose';
        break;
      }
    }
    if (q >= 0) { idx.push(q); c.use(q); }
    items.push({ key, name: itemByKey(key).label, qty: q >= 0 ? t[q].num : null, unit });
    idxAll.push(...idx);
  }
  // "30 goli di" with no medicine name
  for (let i = 0; i < t.length; i++) {
    if (t[i].tag !== 'UNIT_TAB' || !c.free(i)) continue;
    const p = c.prev(i, 1);
    if (qtyOk(p)) {
      c.use(i, p);
      items.push({ key: 'TAB', name: 'Tablets (medicine not named)', qty: t[p].num, unit: 'tablets' });
      idxAll.push(i, p);
    }
  }
  if (items.length) {
    const warn = items.some((x) => x.key === 'TAB') ? 'Medicine name not heard - tap to fix' : items.some((x) => x.qty === null && x.unit !== 'dose') ? 'Quantity not heard for some items' : undefined;
    f.items = c.field<'items'>(items, idxAll, warn);
  }
}

function extractNextVisit(c: Ctx, f: Fields) {
  const { t, today } = c;
  const tryAt = (start: number, end: number, implicitOne: boolean): { days: number; iso: string; idx: number[]; assumption?: string } | null => {
    for (let j = start; j <= end && j < t.length; j++) {
      if (!c.free(j)) continue;
      const tok = t[j];
      if (tok.tag === 'TOMORROW') return { days: 1, iso: toISO(addDays(today, 1)), idx: [j], assumption: tok.norm === 'kal' || tok.norm === 'कल' ? '"kal" taken as tomorrow' : undefined };
      if (tok.tag === 'DAYAFTER') return { days: 2, iso: toISO(addDays(today, 2)), idx: [j] };
      if (tok.tag === 'WEEKDAY') { const d = nextWeekday(today, tok.weekday!); return { days: daysBetween(today, d), iso: toISO(d), idx: [j] }; }
      if (tok.num !== null) {
        const u = c.next(j, 2);
        if (u >= 0 && c.free(u)) {
          const ut = t[u].tag;
          if (ut === 'DATE' && tok.num >= 1 && tok.num <= 31) { const d = nextDayOfMonth(today, tok.num); return { days: daysBetween(today, d), iso: toISO(d), idx: [j, u] }; }
          if (ut === 'DAYS' || ut === 'WEEKS' || ut === 'MONTHS') {
            const d = resolve(today, tok.num, ut);
            const idx = [j, u];
            const a = c.next(u, 1);
            if (a >= 0 && (t[a].tag === 'IN' || t[a].tag === 'AFTER')) idx.push(a);
            return { days: daysBetween(today, d), iso: toISO(d), idx };
          }
        }
      }
      // "agle hafte", "next month", "a week"
      if (implicitOne && (tok.tag === 'WEEKS' || tok.tag === 'MONTHS' || tok.tag === 'DAYS')) {
        const d = resolve(today, 1, tok.tag);
        return { days: daysBetween(today, d), iso: toISO(d), idx: [j] };
      }
    }
    return null;
  };
  let hit: ReturnType<typeof tryAt> = null;
  let anchor: number[] = [];
  for (let i = 0; i < t.length && !hit; i++) {
    if (t[i].tag !== 'NEXT' || !c.free(i)) continue;
    hit = tryAt(i + 1, i + 6, true);
    if (hit) {
      anchor = [i];
      const v = c.next(i, 1);
      if (v >= 0 && t[v].tag === 'VISIT') anchor.push(v);
    }
  }
  if (!hit) {
    // "do hafte mein", "tomorrow", "in 10 days" without "next visit"
    for (let i = 0; i < t.length && !hit; i++) {
      if (!c.free(i)) continue;
      const tg = t[i].tag;
      if (tg === 'TOMORROW' || tg === 'DAYAFTER' || tg === 'WEEKDAY') hit = tryAt(i, i, false);
      else if (t[i].num !== null || t[i].tag === 'A') {
        const u = c.next(i, 2), a = u >= 0 ? c.next(u, 1) : -1;
        const before = c.prev(i, 1);
        const isIn = (u >= 0 && t[u].loc) || (a >= 0 && (t[a].tag === 'IN' || t[a].tag === 'AFTER')) || c.tagAt(before) === 'IN' || c.tagAt(before) === 'AFTER';
        if (u >= 0 && ['DAYS', 'WEEKS', 'MONTHS'].includes(t[u].tag!) && isIn) {
          if (t[i].num === null) { const d = resolve(today, 1, t[u].tag!); hit = { days: daysBetween(today, d), iso: toISO(d), idx: [i, u, a].filter((x) => x >= 0) }; }
          else hit = tryAt(i, i, false);
          if (hit && c.tagAt(before) === 'IN') hit.idx.push(before);
        }
      }
    }
  }
  if (!hit) return;
  const idx = [...anchor, ...hit.idx];
  c.use(...idx);
  const phrase = idx.sort((a, b) => a - b).map((i) => t[i].raw).join(' ');
  const warn = hit.days > 120 ? 'Next visit more than 4 months away - please check' : hit.days <= 0 ? 'Next visit date is not in the future' : hit.assumption;
  f.nextVisit = c.field<'nextVisit'>({ iso: hit.iso, days: hit.days, phrase, assumption: hit.assumption }, idx, warn);
}

function resolve(today: Date, n: number, unit: Tag): Date {
  if (unit === 'DAYS') return addDays(today, Math.round(n));
  if (unit === 'WEEKS') return addDays(today, Math.round(n * 7));
  if (Number.isInteger(n)) return addMonths(today, n);
  return addDays(today, Math.round(n * 30));
}

function extractName(c: Ctx, f: Fields) {
  const { t } = c;
  const plain = (i: number) => c.free(i) && t[i].tag === null && t[i].num === null && !t[i].pair && t[i].ord === null;
  const collect = (start: number) => {
    const idx: number[] = [];
    for (let i = start; i < t.length && idx.length < 3; i++) {
      if (t[i].tag === 'FILLER' && idx.length === 0) continue;
      if (!plain(i)) break;
      idx.push(i);
      if (t[i].boundary) break;
    }
    return idx;
  };
  let idx: number[] = [];
  const n = t.findIndex((x) => x.tag === 'NAME');
  if (n >= 0) idx = collect(n + 1);
  if (!idx.length) {
    let s = 0;
    while (s < t.length && ['FILLER', 'TODAY', 'VISIT', 'NAME'].includes(t[s].tag as string)) s++;
    idx = collect(s);
  }
  if (!idx.length) return;
  c.use(...idx);
  if (n >= 0) c.use(n);
  // Keep the name exactly as transcribed - never snap to a dictionary word.
  const name = idx.map((i) => capitalise(t[i].raw)).join(' ');
  f.name = c.field<'name'>(name, idx);
}
const capitalise = (s: string) => (/^[a-z]/.test(s) ? s[0].toUpperCase() + s.slice(1) : s);

// ---------------------------------------------------------------------------

export function parseWords(words: Word[], today = new Date()): Fields {
  const t = tokenize(words);
  const c = new Ctx(t, words, today);
  const f = emptyFields();
  // Order matters: specific patterns consume their numbers first.
  extractBP(c, f);
  extractWeight(c, f);
  extractStage(c, f);
  extractAge(c, f);
  extractNextVisit(c, f);
  extractItems(c, f);
  extractName(c, f);
  return f;
}

export function toWords(text: string): Word[] {
  return text.split(/\s+/).filter(Boolean).map((w) => ({ text: w, low: false }));
}

export function parseText(text: string, today = new Date()): Fields {
  return parseWords(toWords(text), today);
}

/** Parse a re-spoken value for a single field ("chaubees", "120 by 80", "do hafte"). */
export function parseSingleField<K extends FieldKey>(key: K, words: Word[], today = new Date(), stageKind?: 'pregnancy' | 'child'): Field<K> {
  const prefix: Record<FieldKey, string> = { name: '', age: 'umra', stage: '', bp: 'bp', weight: 'wajan', items: '', nextVisit: 'agla' };
  let ws = [...words];
  if (key === 'name') {
    const text = words.map((w) => w.text.replace(PUNCT_ANY, '')).filter((w) => !/^(naam|name|hai|is|नाम|है|mera|my)$/i.test(w)).join(' ');
    return { value: text ? text.split(' ').map(capitalise).join(' ') : null, heard: text, words: [], low: false, source: 'respoken', confirmed: false } as Field<K>;
  }
  if (prefix[key]) ws = [{ text: prefix[key], low: false }, ...ws];
  if (key === 'stage') {
    const tk = tokenize(words);
    if (!tk.some((x) => x.tag === 'PREG' || x.tag === 'CHILD')) ws = [...ws, { text: stageKind === 'child' ? 'bachcha' : 'pregnant', low: false }];
  }
  let f = parseWords(ws, today)[key] as Field<K>;
  // A bare number for age with no keyword match (e.g. "24 saal") is still the age.
  if (key === 'age' && f.value === null) {
    const n = tokenize(words).find((x) => x.num !== null);
    if (n) f = { ...f, value: n.num as Fields[K]['value'], heard: n.raw };
  }
  if (key === 'weight' && f.value === null) {
    const n = tokenize(words).find((x) => x.num !== null);
    if (n) f = { ...f, value: n.num as Fields[K]['value'], heard: n.raw };
  }
  return { ...f, words: [], source: 'respoken', low: false };
}
