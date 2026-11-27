'use client';
import { useEffect, useRef, useState } from 'react';
import { parseSingleField } from '@/lib/parser';
import { Listener, speak, speechSupported } from '@/lib/speech';
import { display, needsReadBack, readBack, relDays } from '@/lib/format';
import { ITEMS } from '@/lib/lexicon';
import { addDays, addMonths, daysBetween, formatDate, fromISO, toISO } from '@/lib/dates';
import type { Field, FieldKey, Fields, Item, Lang } from '@/lib/types';
import type { Dict } from '@/lib/i18n';
import { MicButton } from './MicButton';

type Mode = 'listen' | 'review' | 'pick';

const tapped = <K extends FieldKey>(value: Fields[K]['value']): Field<K> =>
  ({ value, heard: '', words: [], low: false, source: 'tapped', confirmed: true }) as Field<K>;

/** Re-speak one field. Numeric answers are read back. If speech fails, tap-to-select takes over. */
export function FieldSheet({ k, fields, lang, t, onClose, onSave }: {
  k: FieldKey; fields: Fields; lang: Lang; t: Dict;
  onClose: () => void; onSave: (f: Field) => void;
}) {
  const [mode, setMode] = useState<Mode>(speechSupported() ? 'listen' : 'pick');
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [candidate, setCandidate] = useState<Field | null>(null);
  const [msg, setMsg] = useState<string>(speechSupported() ? '' : t.notSupported);
  const l = useRef<Listener | null>(null);

  const listen = () => {
    l.current?.abort();
    setMsg(''); setCandidate(null); setMode('listen'); setListening(true);
    const ln = new Listener({
      lang, mode: 'single',
      onInterim: setInterim,
      onEnd: (ws) => {
        setListening(false);
        const f = parseSingleField(k, ws, new Date(), fields.stage.value?.kind);
        const heard = ws.map((w) => w.text).join(' ');
        if (f.value === null) {
          setMsg(`${t.heard}: “${heard}” — ${t.speechFail}`);
          setMode('pick');
          return;
        }
        setCandidate({ ...f, heard });
        setMode('review');
      },
      onError: (code) => {
        setListening(false);
        setMsg(code === 'no-speech' ? `${t.noSpeech} — ${t.pick}` : `${t.speechFail}`);
        setMode('pick');
      },
    });
    l.current = ln;
    ln.start();
  };

  useEffect(() => {
    if (mode === 'listen') listen();
    return () => l.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withCandidate = candidate ? ({ ...fields, [k]: candidate } as Fields) : fields;
  const numeric = candidate ? needsReadBack(k, withCandidate) : false;
  const rb = candidate && numeric ? readBack(k, withCandidate, lang, t.fields[k]) : null;

  useEffect(() => {
    if (rb) speak(rb.say, lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate]);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t.fields[k]}>
      <div className="sheet">
        <div className="sheethead">
          <h3>{t.fields[k]}</h3>
          <button className="x" onClick={() => { l.current?.abort(); onClose(); }} aria-label={t.cancel}>✕</button>
        </div>
        {fields[k].value !== null && mode !== 'review' && (
          <p className="muted">{display(k, fields, lang)}</p>
        )}

        {mode === 'listen' && (
          <div className="center">
            <MicButton listening={listening} label={listening ? t.listening : t.respeak} onStart={listen} onStop={() => l.current?.stop()} />
            <p className="interim big">{interim || (listening ? '…' : '')}</p>
            <button className="textlink" onClick={() => { l.current?.abort(); setListening(false); setMode('pick'); }}>{t.pick}</button>
          </div>
        )}

        {mode === 'review' && candidate && (
          <div className="center">
            <p className="muted">{t.heard}: “{candidate.heard}”</p>
            {rb ? (
              <>
                <p className="huge" style={{ whiteSpace: 'pre-line' }}>{rb.big}</p>
                <p className="numwords">{rb.words}</p>
                {rb.twins && <p className="twins">{rb.twins}</p>}
                <p className="q">{t.isCorrect}</p>
                <div className="row">
                  <button className="btn ink big" onClick={() => onSave({ ...candidate, confirmed: true })}>{t.yes}</button>
                  <button className="btn plain big" onClick={listen}>{t.no}</button>
                </div>
                <button className="textlink" onClick={() => speak(rb.say, lang)}>{t.readBack}</button>
              </>
            ) : (
              <>
                <p className="huge">{display(k, withCandidate, lang)}</p>
                <div className="row">
                  <button className="btn ink big" onClick={() => onSave({ ...candidate, confirmed: true })}>{t.done}</button>
                  <button className="btn plain big" onClick={listen}>{t.respeak}</button>
                </div>
              </>
            )}
            <button className="textlink" onClick={() => setMode('pick')}>{t.pick}</button>
          </div>
        )}

        {mode === 'pick' && (
          <>
            {msg && <p className="fwarn">{msg}</p>}
            <Picker k={k} fields={fields} lang={lang} t={t} onPick={onSave} />
            {speechSupported() && (
              <div className="center"><button className="btn plain" onClick={listen}>{t.respeak}</button></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Picker({ k, fields, lang, t, onPick }: { k: FieldKey; fields: Fields; lang: Lang; t: Dict; onPick: (f: Field) => void }) {
  const [text, setText] = useState(fields.name.value ?? '');
  const [num, setNum] = useState<string>(String((k === 'age' ? fields.age.value : k === 'weight' ? fields.weight.value : '') ?? ''));
  const [kind, setKind] = useState<'pregnancy' | 'child'>(fields.stage.value?.kind ?? 'pregnancy');
  const [sys, setSys] = useState(String(fields.bp.value?.sys ?? ''));
  const [dia, setDia] = useState(String(fields.bp.value?.dia ?? ''));
  const [items, setItems] = useState<Item[]>(fields.items.value ?? []);
  const [date, setDate] = useState(fields.nextVisit.value?.iso ?? '');

  const today = new Date();
  const visit = (d: Date, phrase: string) => onPick(tapped<'nextVisit'>({ iso: toISO(d), days: daysBetween(today, d), phrase }));

  switch (k) {
    case 'name':
      return (
        <div className="pick">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.fields.name} autoFocus />
          <button className="btn ink big" disabled={!text.trim()} onClick={() => onPick(tapped<'name'>(text.trim()))}>{t.done}</button>
        </div>
      );
    case 'age':
    case 'weight': {
      const quick = k === 'age' ? [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 35, 40] : [40, 45, 50, 55, 60, 65, 70];
      return (
        <div className="pick">
          <div className="grid">
            {quick.map((n) => (
              <button key={n} className="num" onClick={() => onPick(k === 'age' ? tapped<'age'>(n) : tapped<'weight'>(n))}>{n}</button>
            ))}
          </div>
          <div className="row">
            <button className="num" onClick={() => setNum(String(Math.max(0, Number(num || 0) - 1)))}>−</button>
            <input inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value.replace(/[^\d.]/g, ''))} aria-label={t.fields[k]} />
            <button className="num" onClick={() => setNum(String(Number(num || 0) + 1))}>+</button>
            <button className="btn ink" disabled={!num} onClick={() => onPick(k === 'age' ? tapped<'age'>(Number(num)) : tapped<'weight'>(Number(num)))}>✓</button>
          </div>
        </div>
      );
    }
    case 'stage': {
      const months = kind === 'pregnancy' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 6, 9, 12, 18, 24, 36, 48, 60];
      return (
        <div className="pick">
          <div className="row">
            <button className={kind === 'pregnancy' ? 'chip on' : 'chip'} onClick={() => setKind('pregnancy')}>{t.w.pregnant}</button>
            <button className={kind === 'child' ? 'chip on' : 'chip'} onClick={() => setKind('child')}>{t.w.child}</button>
          </div>
          <p className="muted small">{t.w.months}</p>
          <div className="grid">
            {months.map((m) => (
              <button key={m} className="num" onClick={() => onPick(tapped<'stage'>({ kind, months: m }))}>{m}</button>
            ))}
          </div>
        </div>
      );
    }
    case 'bp':
      return (
        <div className="pick">
          <div className="row wrap">
            {(['normal', 'high', 'low'] as const).map((s) => (
              <button key={s} className="chip" onClick={() => onPick(tapped<'bp'>({ status: s }))}>{t.w[s]}</button>
            ))}
          </div>
          <div className="grid">
            {[[100, 70], [110, 70], [110, 80], [120, 80], [130, 80], [130, 90], [140, 90], [150, 100]].map(([a, b]) => (
              <button key={`${a}/${b}`} className="num" onClick={() => onPick(tapped<'bp'>({ sys: a, dia: b }))}>{a}/{b}</button>
            ))}
          </div>
          <div className="row">
            <input inputMode="numeric" value={sys} onChange={(e) => setSys(e.target.value.replace(/\D/g, ''))} placeholder="120" aria-label="systolic" />
            <span className="slash">/</span>
            <input inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value.replace(/\D/g, ''))} placeholder="80" aria-label="diastolic" />
            <button className="btn ink" disabled={!sys || !dia} onClick={() => onPick(tapped<'bp'>({ sys: Number(sys), dia: Number(dia) }))}>✓</button>
          </div>
        </div>
      );
    case 'items':
      return (
        <div className="pick">
          {items.map((it, i) => (
            <div key={i} className="itemrow">
              <span>{it.name}</span>
              <div className="row wrap">
                {[1, 2, 10, 30, 60, 90].map((q) => (
                  <button key={q} className={it.qty === q ? 'num on' : 'num'} onClick={() => setItems(items.map((x, j) => (j === i ? { ...x, qty: q } : x)))}>{q}</button>
                ))}
                <input inputMode="numeric" className="qty" value={it.qty ?? ''} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, qty: e.target.value ? Number(e.target.value.replace(/\D/g, '')) : null } : x)))} aria-label="quantity" />
                <button className="x" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="remove">✕</button>
              </div>
            </div>
          ))}
          <div className="row wrap">
            {ITEMS.filter((x) => !items.some((i) => i.key === x.key)).map((x) => (
              <button key={x.key} className="chip" onClick={() => setItems([...items, { key: x.key, name: x.label, qty: null, unit: x.unit }])}>+ {x.label}</button>
            ))}
          </div>
          <button className="btn ink big" onClick={() => onPick(tapped<'items'>(items.length ? items : null))}>{t.done}</button>
        </div>
      );
    case 'nextVisit': {
      const opts: [string, Date][] = [
        [relDays(1, lang), addDays(today, 1)], ['3', addDays(today, 3)], ['1 wk', addDays(today, 7)],
        ['2 wk', addDays(today, 14)], ['1 mo', addMonths(today, 1)],
      ];
      return (
        <div className="pick">
          <div className="grid">
            {opts.map(([label, d]) => (
              <button key={label} className="num date" onClick={() => visit(d, label)}>
                <strong>{label === '3' ? relDays(3, lang) : label}</strong>
                <small>{formatDate(toISO(d), lang)}</small>
              </button>
            ))}
          </div>
          <div className="row">
            <input type="date" value={date} min={toISO(addDays(today, 1))} onChange={(e) => setDate(e.target.value)} aria-label={t.fields.nextVisit} />
            <button className="btn ink" disabled={!date} onClick={() => visit(fromISO(date), date)}>✓</button>
          </div>
        </div>
      );
    }
  }
}
