'use client';
import { fmtAge, fmtBP, fmtItems, fmtStage, relDays } from '@/lib/format';
import { daysBetween, fromISO } from '@/lib/dates';
import { deleteRecord, icsFor, isToday } from '@/lib/store';
import type { Lang, VisitRecord } from '@/lib/types';
import type { Dict } from '@/lib/i18n';

export function RecordsPanel({ records, lang, t, onChange }: { records: VisitRecord[]; lang: Lang; t: Dict; onChange: () => void }) {
  if (!records.length) return null;
  const today = records.filter((r) => isToday(r.savedAt));
  const upcoming = records.filter((r) => r.nextVisit).sort((a, b) => a.nextVisit!.iso.localeCompare(b.nextVisit!.iso));

  const download = (r: VisitRecord) => {
    const blob = new Blob([icsFor(r)], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `visit-${r.name.replace(/\s+/g, '-')}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <>
      {upcoming.length > 0 && (
        <section className="section">
          <h2>{t.upcoming}</h2>
          <ul className="reminders">
            {upcoming.slice(0, 8).map((r) => {
              const d = fromISO(r.nextVisit!.iso);
              const days = daysBetween(new Date(), d);
              return (
                <li key={r.id} className={days <= 0 ? 'due' : ''}>
                  <span className="datebox" aria-hidden>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString(lang, { month: 'short' })}</small>
                  </span>
                  <span className="who">
                    <strong>{r.name}</strong>
                    <small>{days < 0 ? t.overdue : days === 0 ? t.today : relDays(days, lang)} · {d.toLocaleDateString(lang, { weekday: 'long' })}</small>
                  </span>
                  <button className="calbtn" onClick={() => download(r)} title="Add to phone calendar" aria-label="Add to calendar">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {today.length > 0 && (
        <section className="section">
          <h2>{t.todayList}</h2>
          <ol className="entries">
            {today.map((r, i) => (
              <li key={r.id}>
                <span className="sn">{today.length - i}.</span>
                <span className="who">
                  <strong>{r.name}</strong>
                  <small>{[fmtAge(r.age, lang), fmtStage(r.stage, lang), r.bp ? 'BP ' + fmtBP(r.bp, lang) : '', r.weight ? r.weight + ' kg' : '', fmtItems(r.items)].filter(Boolean).join(' · ')}</small>
                </span>
                <button className="strike" onClick={() => { deleteRecord(r.id); onChange(); }} aria-label="delete">✕</button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
