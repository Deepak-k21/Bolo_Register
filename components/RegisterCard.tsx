'use client';
import { display, needsReadBack, relDays } from '@/lib/format';
import { formatDate, toISO } from '@/lib/dates';
import { ORDER, REQUIRED, type FieldKey, type Fields, type Lang } from '@/lib/types';
import type { Dict } from '@/lib/i18n';

/** The register page: one ruled row per column of the paper register. Tap any row to fix it. */
export function RegisterCard({ fields, lang, t, serial, onOpen }: {
  fields: Fields; lang: Lang; t: Dict; serial: number; onOpen: (k: FieldKey) => void;
}) {
  const pending = ORDER.filter((k) => fields[k].value !== null && !fields[k].confirmed && (needsReadBack(k, fields) || fields[k].low || fields[k].warning)).length;
  return (
    <section className="ledger" aria-label={t.newVisit}>
      <div className="ledgerhead">
        <span className="serial">#{String(serial).padStart(3, '0')}</span>
        <span>{t.newVisit}</span>
        <span className="hdate">{formatDate(toISO(new Date()), lang)}</span>
      </div>
      {ORDER.map((k) => {
        const f = fields[k];
        const required = REQUIRED.includes(k);
        const empty = f.value === null;
        const state = empty ? (required ? 'missing' : 'empty') : f.confirmed ? 'ok' : f.low || f.warning ? 'check' : needsReadBack(k, fields) ? 'verify' : 'fine';
        return (
          <button key={k} className={`lrow ${state}`} onClick={() => onOpen(k)} aria-label={`${t.fields[k]}: ${display(k, fields, lang) || t.missing}`}>
            <span className="lcol">
              {t.fields[k]}
              {!required && <small>{t.optional}</small>}
            </span>
            <span className="lval">
              <span className={`ink ${f.low ? 'marker' : ''}`}>
                {empty ? (required ? <span className="blank">{t.missing}</span> : <span className="dash">—</span>) : display(k, fields, lang)}
              </span>
              {k === 'nextVisit' && fields.nextVisit.value && (
                <span className="note">{relDays(fields.nextVisit.value.days, lang)} · {t.heard} “{fields.nextVisit.value.phrase}”</span>
              )}
              {k !== 'nextVisit' && f.heard && !empty && f.source === 'speech' && <span className="note">{t.heard} “{f.heard}”</span>}
              {f.warning && <span className="warnline">{f.warning}</span>}
              {f.low && <span className="warnline">{t.uncertain}</span>}
            </span>
            <span className="lmark" aria-hidden>
              {state === 'ok' ? <span className="tick">✓</span> : state === 'missing' ? <span className="bang">!</span> : state === 'check' || state === 'verify' ? <span className="qmark">?</span> : <Pen />}
            </span>
          </button>
        );
      })}
      {pending > 0 && <div className="ledgerfoot">{pending} {t.checkThese}</div>}
    </section>
  );
}

function Pen() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden className="pen">
      <path d="M3 17l1-4 9-9 3 3-9 9-4 1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
