'use client';
import { LANGS } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export function LanguageSheet({ current, title, canClose, onPick, onClose }: {
  current: Lang; title: string; canClose: boolean; onPick: (l: Lang) => void; onClose: () => void;
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Language">
      <div className="sheet">
        <div className="sheethead">
          <h3>{title} · Language</h3>
          {canClose && <button className="x" onClick={onClose} aria-label="close">✕</button>}
        </div>
        <div className="langgrid">
          {LANGS.map((l) => (
            <button key={l.code} className={`langtile ${l.code === current ? 'on' : ''}`} onClick={() => onPick(l.code)} lang={l.code.slice(0, 2)}>
              <span className="big" aria-hidden>{l.script}</span>
              <span className="nat">{l.native}</span>
              <span className="eng">{l.english}</span>
            </button>
          ))}
        </div>
        <p className="fine">The microphone listens in the language you pick. Mixing in English words is fine.</p>
      </div>
    </div>
  );
}
