export type Lang = 'hi-IN' | 'mr-IN' | 'bn-IN' | 'te-IN' | 'ta-IN' | 'kn-IN' | 'gu-IN' | 'en-IN';

/** One spoken word as it came out of the recogniser. */
export interface Word {
  text: string;
  /** True when the recogniser was unsure (alternatives disagreed or low result confidence). */
  low: boolean;
}

export type FieldKey = 'name' | 'age' | 'stage' | 'bp' | 'weight' | 'items' | 'nextVisit';

export interface Stage { kind: 'pregnancy' | 'child'; months: number | null }
export interface BP { sys?: number; dia?: number; status?: 'normal' | 'high' | 'low' }
export interface Item { key: string; name: string; qty: number | null; unit: string }
export interface NextVisit { iso: string; days: number; phrase: string; assumption?: string }

export interface FieldValueMap {
  name: string;
  age: number; // years, may be fractional for infants
  stage: Stage;
  bp: BP;
  weight: number; // kg
  items: Item[];
  nextVisit: NextVisit;
}

export type Source = 'speech' | 'respoken' | 'tapped';

export interface Field<K extends FieldKey = FieldKey> {
  value: FieldValueMap[K] | null;
  /** The exact words this value came from, so the card can show "heard: ...". */
  heard: string;
  /** Word indexes in the transcript this value came from. */
  words: number[];
  low: boolean;
  source: Source;
  confirmed: boolean;
  warning?: string;
}

export type Fields = { [K in FieldKey]: Field<K> };

export interface VisitRecord {
  id: string;
  savedAt: string; // ISO datetime
  lang: Lang;
  transcript: string;
  name: string;
  age: number | null;
  stage: Stage | null;
  bp: BP | null;
  weight: number | null;
  items: Item[];
  nextVisit: NextVisit | null;
}

export const REQUIRED: FieldKey[] = ['name', 'age', 'stage', 'nextVisit'];
export const ORDER: FieldKey[] = ['name', 'age', 'stage', 'bp', 'weight', 'items', 'nextVisit'];
