'use client';
import { fromISO, toISO } from './dates';
import type { Fields, Lang, VisitRecord } from './types';

const KEY = 'bolo.v1.records';
const SETTINGS = 'bolo.v1.settings';

export function loadRecords(): VisitRecord[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function saveRecords(r: VisitRecord[]) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* storage full or blocked */ }
}

export function addRecord(f: Fields, lang: Lang, transcript: string): VisitRecord {
  const rec: VisitRecord = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
    savedAt: new Date().toISOString(), lang, transcript,
    name: f.name.value ?? '', age: f.age.value, stage: f.stage.value, bp: f.bp.value,
    weight: f.weight.value, items: f.items.value ?? [], nextVisit: f.nextVisit.value,
  };
  saveRecords([rec, ...loadRecords()]);
  return rec;
}
export function deleteRecord(id: string) {
  saveRecords(loadRecords().filter((r) => r.id !== id));
}
export function clearAll() { saveRecords([]); }

export const isToday = (iso: string) => toISO(new Date(iso)) === toISO(new Date());

export interface Settings { lang: Lang; chosen: boolean }
export function loadSettings(): Settings {
  const d: Settings = { lang: 'hi-IN', chosen: false };
  try { return { ...d, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; } catch { return d; }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem(SETTINGS, JSON.stringify(s)); } catch { /* ignore */ }
}

/** A calendar file for the next-visit reminder, so it also lands in the phone's calendar. */
export function icsFor(rec: VisitRecord): string {
  const d = rec.nextVisit!.iso.replace(/-/g, '');
  const next = fromISO(rec.nextVisit!.iso); next.setDate(next.getDate() + 1);
  const d2 = toISO(next).replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bolo Register//EN', 'BEGIN:VEVENT',
    `UID:${rec.id}@bolo-register`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
    `SUMMARY:Home visit: ${rec.name}`, `DESCRIPTION:${rec.transcript.replace(/[\n,;]/g, ' ')}`,
    'BEGIN:VALARM', 'TRIGGER:PT8H', 'ACTION:DISPLAY', `DESCRIPTION:Visit ${rec.name} today`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
