// Date helpers. All dates are local calendar dates as YYYY-MM-DD.

export function toISO(d: Date): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function addDays(d: Date, n: number): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
}
export function addMonths(d: Date, n: number): Date {
  const r = startOfDay(d);
  const day = r.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  const last = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  r.setDate(Math.min(day, last));
  return r;
}
export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}
/** Next date (strictly after today) that falls on weekday `wd` (0 = Sunday). */
export function nextWeekday(today: Date, wd: number): Date {
  const diff = ((wd - today.getDay() + 7) % 7) || 7;
  return addDays(today, diff);
}
/** Next date on or after tomorrow with day-of-month `dom`. */
export function nextDayOfMonth(today: Date, dom: number): Date {
  let d = new Date(today.getFullYear(), today.getMonth(), dom);
  if (d <= startOfDay(today)) d = new Date(today.getFullYear(), today.getMonth() + 1, dom);
  return d;
}


export function formatDate(iso: string, lang: string): string {
  return fromISO(iso).toLocaleDateString(lang || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatDateLong(iso: string, lang: string): string {
  return fromISO(iso).toLocaleDateString(lang || 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}
