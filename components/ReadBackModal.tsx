'use client';
import { useEffect } from 'react';
import { readBack } from '@/lib/format';
import { speak } from '@/lib/speech';
import type { FieldKey, Fields, Lang } from '@/lib/types';
import type { Dict } from '@/lib/i18n';

/** Before saving, every number and every resolved date is read aloud and shown big for a yes/no. */
export function ReadBackModal({ k, fields, lang, t, step, total, onYes, onNo, onCancel }: {
  k: FieldKey; fields: Fields; lang: Lang; t: Dict; step: number; total: number;
  onYes: () => void; onNo: () => void; onCancel: () => void;
}) {
  const rb = readBack(k, fields, lang, t.fields[k]);
  useEffect(() => { speak(rb.say, lang); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [k]);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t.readBack}>
      <div className="sheet readback">
        <div className="sheethead">
          <span className="steps" aria-label={`${step}/${total}`}>
            {Array.from({ length: total }, (_, i) => <i key={i} className={i < step - 1 ? 'done' : i === step - 1 ? 'now' : ''} />)}
          </span>
          <button className="x" onClick={onCancel} aria-label={t.cancel}>✕</button>
        </div>
        <p className="rblabel">{t.fields[k]}</p>
        <p className="huge" style={{ whiteSpace: 'pre-line' }}>{rb.big}</p>
        {rb.words && <p className="numwords">{rb.words}</p>}
        {rb.twins && <p className="twins">{rb.twins}</p>}
        <button className="textlink speakagain" onClick={() => speak(rb.say, lang)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor" /></svg>
          {t.readBack}
        </button>
        <p className="q">{t.isCorrect}</p>
        <div className="row">
          <button className="btn ink big" onClick={onYes} autoFocus>{t.yes}</button>
          <button className="btn plain big" onClick={onNo}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}
