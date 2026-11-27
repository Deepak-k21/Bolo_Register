'use client';
import { useRef, useState } from 'react';
import { Listener } from '@/lib/speech';
import type { Lang, Word } from '@/lib/types';
import type { Dict } from '@/lib/i18n';

/** Live transcript. Low-confidence words are underlined; tapping any word re-speaks just that word. */
export function Transcript({ words, interim, lang, t, listening, onReplace }: {
  words: Word[]; interim: string; lang: Lang; t: Dict; listening: boolean;
  onReplace: (i: number, w: Word[]) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [status, setStatus] = useState<'listen' | 'fallback' | null>(null);
  const [draft, setDraft] = useState('');
  const l = useRef<Listener | null>(null);
  const anyLow = words.some((w) => w.low);

  const respeak = (i: number) => {
    if (listening) return;
    l.current?.abort();
    setActive(i); setStatus('listen'); setDraft(words[i].text.replace(/[,.।]/g, ''));
    const ln = new Listener({
      lang, mode: 'single',
      onEnd: (ws) => {
        const trail = words[i].text.match(/[,.।!?]+$/)?.[0] ?? '';
        const fixed = ws.map((w, j) => ({ text: w.text + (j === ws.length - 1 ? trail : ''), low: false }));
        onReplace(i, fixed);
        setActive(null); setStatus(null);
      },
      // Speech failed for this word: let her type it instead.
      onError: () => setStatus('fallback'),
    });
    l.current = ln;
    ln.start();
  };

  const applyDraft = () => {
    if (active === null) return;
    const trail = words[active].text.match(/[,.।!?]+$/)?.[0] ?? '';
    const ws = draft.trim().split(/\s+/).filter(Boolean).map((w, j, a) => ({ text: w + (j === a.length - 1 ? trail : ''), low: false }));
    if (ws.length) onReplace(active, ws);
    setActive(null); setStatus(null);
  };

  return (
    <section className="transcript" aria-live="polite">
      <p className="words">
        {words.map((w, i) => [
          i > 0 ? ' ' : null,
          <button
            key={i}
            className={`w ${w.low ? 'low' : ''} ${active === i ? 'act' : ''}`}
            onClick={() => respeak(i)}
            title={w.low ? t.uncertain : t.respeak}
          >
            {w.text}
          </button>,
        ])}
        {interim && <span className="interim"> {interim}</span>}
        {!words.length && !interim && listening && <span className="interim">…</span>}
      </p>
      {anyLow && !listening && active === null && <p className="lowhint">{t.uncertain}</p>}
      {active !== null && (
        <div className="wordfix">
          {status === 'listen' && (
            <p className="listeningword">{t.respeak}: <strong>“{words[active]?.text}”</strong> <button className="textlink" onClick={() => { l.current?.abort(); setStatus('fallback'); }}>{t.typeInstead}</button></p>
          )}
          {status === 'fallback' && (
            <div className="row">
              <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyDraft()} aria-label="correct word" />
              <button className="btn ink" onClick={applyDraft}>{t.done}</button>
              <button className="btn plain" onClick={() => { setActive(null); setStatus(null); }}>✕</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
