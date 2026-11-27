import { englishWord, hindiRoman, hindiWord, soundAlikes } from './numbers';
import { formatDate, formatDateLong } from './dates';
import type { BP, FieldKey, Fields, Item, Lang, NextVisit, Stage } from './types';

import { T } from './i18n';

const W = (lang: Lang) => T[lang].w;

export function fmtAge(v: number | null | undefined, lang: Lang): string {
  if (v === null || v === undefined) return '';
  if (v < 1) return `${Math.round(v * 12)} ${W(lang).months}`;
  return `${v} ${W(lang).years}`;
}
export function fmtStage(s: Stage | null | undefined, lang: Lang): string {
  if (!s) return '';
  const m = s.months ?? '?';
  return `${s.kind === 'pregnancy' ? W(lang).pregnant : W(lang).child} · ${m} ${W(lang).months}`;
}
export function fmtBP(b: BP | null | undefined, lang: Lang): string {
  if (!b) return '';
  if (b.sys && b.dia) return `${b.sys}/${b.dia}`;
  if (b.sys) return `${b.sys}/?`;
  return b.status ? W(lang)[b.status] : '';
}
export const fmtWeight = (w: number | null | undefined) => (w ? `${w} kg` : '');
export function fmtItems(items: Item[] | null | undefined): string {
  if (!items?.length) return '';
  return items.map((i) => (i.qty !== null ? `${i.qty} × ${i.name}` : i.name)).join(', ');
}
export function fmtNext(n: NextVisit | null | undefined, lang: Lang): string {
  if (!n) return '';
  return formatDate(n.iso, lang);
}
export function relDays(days: number, lang: Lang): string {
  return days === 1 ? W(lang).tomorrow : W(lang).inDays.replace('{n}', String(days));
}

export function display(key: FieldKey, f: Fields, lang: Lang): string {
  switch (key) {
    case 'name': return f.name.value ?? '';
    case 'age': return fmtAge(f.age.value, lang);
    case 'stage': return fmtStage(f.stage.value, lang);
    case 'bp': return fmtBP(f.bp.value, lang);
    case 'weight': return fmtWeight(f.weight.value);
    case 'items': return fmtItems(f.items.value);
    case 'nextVisit': return fmtNext(f.nextVisit.value, lang);
  }
}

/** Fields that must be read back before saving: anything numeric, plus resolved dates. */
export function needsReadBack(key: FieldKey, f: Fields): boolean {
  const v = f[key].value as unknown;
  if (v === null || v === undefined) return false;
  switch (key) {
    case 'age': case 'weight': case 'nextVisit': return true;
    case 'stage': return f.stage.value?.months != null;
    case 'bp': return !!f.bp.value?.sys;
    case 'items': return !!f.items.value?.some((i) => i.qty !== null);
    default: return false;
  }
}

export interface ReadBack { big: string; words: string; twins: string; say: string }

function numWords(n: number, lang: Lang): string {
  if (lang === 'hi-IN') return `${hindiWord(n)} · ${hindiRoman(n)}`;
  return englishWord(n);
}
function twinText(n: number, lang: Lang): string {
  const tw = soundAlikes(n);
  if (!tw.length) return '';
  const w = tw.map((x) => `${x} (${lang === 'hi-IN' ? hindiRoman(x) : englishWord(x)})`).join(', ');
  return lang === 'hi-IN' || lang === 'mr-IN' ? `${n} — ${w} नहीं` : `${n} — not ${w}`;
}

export function readBack(key: FieldKey, f: Fields, lang: Lang, label: string): ReadBack {
  const q = T[lang].isCorrect;
  switch (key) {
    case 'age': {
      const n = f.age.value!;
      return { big: fmtAge(n, lang), words: numWords(n, lang), twins: twinText(n, lang), say: `${label}: ${fmtAge(n, lang)}. ${q}` };
    }
    case 'weight': {
      const n = f.weight.value!;
      return { big: `${n} kg`, words: numWords(n, lang), twins: twinText(n, lang), say: `${label}: ${n} ${W(lang).kg}. ${q}` };
    }
    case 'stage': {
      const n = f.stage.value!.months!;
      return { big: fmtStage(f.stage.value, lang), words: numWords(n, lang), twins: twinText(n, lang), say: `${fmtStage(f.stage.value, lang).replace('·', ',')}. ${q}` };
    }
    case 'bp': {
      const b = f.bp.value!;
      const words = b.dia ? `${numWords(b.sys!, lang)} / ${numWords(b.dia, lang)}` : numWords(b.sys!, lang);
      const sayNum = b.dia ? (lang === 'hi-IN' ? `${b.sys} बटा ${b.dia}` : lang === 'en-IN' ? `${b.sys} by ${b.dia}` : `${b.sys} / ${b.dia}`) : `${b.sys}`;
      return { big: fmtBP(b, lang), words, twins: [twinText(b.sys!, lang), b.dia ? twinText(b.dia, lang) : ''].filter(Boolean).join(' · '), say: `BP ${sayNum}. ${q}` };
    }
    case 'items': {
      const items = f.items.value!.filter((i) => i.qty !== null);
      return {
        big: items.map((i) => `${i.qty} × ${i.name}`).join('\n'),
        words: items.map((i) => numWords(i.qty!, lang)).join(' · '),
        twins: items.map((i) => twinText(i.qty!, lang)).filter(Boolean).join(' · '),
        say: `${items.map((i) => `${i.qty} ${i.name}`).join(', ')}. ${q}`,
      };
    }
    case 'nextVisit': {
      const n = f.nextVisit.value!;
      return {
        big: formatDate(n.iso, lang), words: `${relDays(n.days, lang)} · “${n.phrase}”`, twins: n.assumption ?? '',
        say: `${label}: ${formatDateLong(n.iso, lang)}, ${relDays(n.days, lang)}. ${q}`,
      };
    }
    default:
      return { big: display(key, f, lang), words: '', twins: '', say: `${label}: ${display(key, f, lang)}. ${q}` };
  }
}
