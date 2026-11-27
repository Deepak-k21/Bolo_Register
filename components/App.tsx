'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { emptyFields, parseWords, toWords } from '@/lib/parser';
import { Listener, speechSupported } from '@/lib/speech';
import { LANGS, SAMPLES, T } from '@/lib/i18n';
import { needsReadBack, relDays } from '@/lib/format';
import { formatDate, toISO } from '@/lib/dates';
import { addRecord, isToday, loadRecords, loadSettings, saveSettings, type Settings } from '@/lib/store';
import { ORDER, REQUIRED, type FieldKey, type Fields, type Lang, type VisitRecord, type Word } from '@/lib/types';
import { MicButton } from './MicButton';
import { Transcript } from './Transcript';
import { RegisterCard } from './RegisterCard';
import { FieldSheet } from './FieldSheet';
import { ReadBackModal } from './ReadBackModal';
import { RecordsPanel } from './RecordsPanel';
import { LanguageSheet } from './LanguageSheet';
import { Tally } from './Tally';

type Phase = 'idle' | 'listening' | 'card';

export default function App() {
  const [settings, setSettings] = useState<Settings>({ lang: 'hi-IN', chosen: true });
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [words, setWords] = useState<Word[]>([]);
  const [interim, setInterim] = useState('');
  const [fields, setFields] = useState<Fields>(emptyFields());
  const [sheet, setSheet] = useState<FieldKey | null>(null);
  const [readQueue, setReadQueue] = useState<FieldKey[]>([]);
  const [readTotal, setReadTotal] = useState(0);
  const [toast, setToast] = useState<{ text: string; kind: 'ok' | 'warn' | 'err' } | null>(null);
  const [showType, setShowType] = useState(false);
  const [typed, setTyped] = useState('');
  const [showLang, setShowLang] = useState(false);
  const [supported, setSupported] = useState(true);
  const [saved, setSaved] = useState<VisitRecord | null>(null);
  const listener = useRef<Listener | null>(null);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    if (!s.chosen) setShowLang(true); // first run: pick a language
    setRecords(loadRecords());
    setSupported(speechSupported());
  }, []);

  const lang = settings.lang;
  const t = T[lang];
  const info = LANGS.find((l) => l.code === lang)!;
  const todayCount = useMemo(() => records.filter((r) => isToday(r.savedAt)).length, [records]);

  useEffect(() => { document.documentElement.lang = lang.slice(0, 2); }, [lang]);

  const flash = useCallback((text: string, kind: 'ok' | 'warn' | 'err' = 'ok') => {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const chooseLang = (l: Lang) => {
    const s = { lang: l, chosen: true };
    setSettings(s); saveSettings(s); setShowLang(false);
  };

  /** Re-parse the whole transcript, keeping anything the worker fixed by hand. */
  const reparse = useCallback((ws: Word[], keep: Fields | null) => {
    const parsed = parseWords(ws);
    if (keep) {
      for (const k of ORDER) {
        if (keep[k].source === 'respoken' || keep[k].source === 'tapped') (parsed as Record<FieldKey, unknown>)[k] = keep[k];
      }
    }
    setFields(parsed);
    return parsed;
  }, []);

  const finishTranscript = useCallback((ws: Word[]) => {
    setWords(ws);
    reparse(ws, null);
    setPhase('card');
  }, [reparse]);

  const startVisit = () => {
    setSaved(null);
    if (!supported) { setShowType(true); flash(t.notSupported, 'warn'); return; }
    listener.current?.abort();
    setWords([]); setInterim(''); setFields(emptyFields());
    setPhase('listening');
    const l = new Listener({
      lang, mode: 'sentence',
      onInterim: setInterim,
      onFinalWords: (ws) => { setWords(ws); reparse(ws, null); },
      onEnd: finishTranscript,
      onError: (code) => {
        setPhase((p) => (p === 'listening' ? 'idle' : p));
        if (code === 'no-speech') flash(t.noSpeech, 'warn');
        else if (code === 'not-allowed') flash('Microphone blocked — allow it from the address bar', 'err');
        else if (code === 'network') flash(`${t.speechFail} (internet)`, 'err');
        else flash(`${t.speechFail} (${code})`, 'err');
        if (code !== 'no-speech') setShowType(true);
      },
    });
    listener.current = l;
    l.start();
  };

  const useTyped = (text: string) => {
    if (!text.trim()) return;
    setSaved(null); setShowType(false);
    finishTranscript(toWords(text));
  };

  /** Worker tapped one transcript word and re-spoke it. */
  const replaceWord = (i: number, replacement: Word[]) => {
    const ws = [...words.slice(0, i), ...replacement, ...words.slice(i + 1)];
    setWords(ws);
    reparse(ws, fields);
  };

  const setField = <K extends FieldKey>(k: K, f: Fields[K]) => setFields((cur) => ({ ...cur, [k]: f }));

  const missing = REQUIRED.filter((k) => fields[k].value === null);
  const toConfirm = ORDER.filter((k) => needsReadBack(k, fields) && !fields[k].confirmed);

  const doSave = (f: Fields) => {
    const rec = addRecord(f, lang, words.map((w) => w.text).join(' '));
    setRecords(loadRecords());
    setSaved(rec);
    setPhase('idle');
    setWords([]); setFields(emptyFields());
  };

  const onConfirm = () => {
    if (missing.length) { setSheet(missing[0]); return; }
    if (toConfirm.length) { setReadQueue(toConfirm); setReadTotal(toConfirm.length); return; }
    doSave(fields);
  };

  const readNext = (key: FieldKey, replaced?: Fields[FieldKey]) => {
    const next = { ...fields, [key]: { ...(replaced ?? fields[key]), confirmed: true } } as Fields;
    setFields(next);
    const rest = readQueue.filter((k) => k !== key);
    setReadQueue(rest);
    if (!rest.length) {
      const ok = !REQUIRED.some((k) => next[k].value === null) && !ORDER.some((k) => needsReadBack(k, next) && !next[k].confirmed);
      if (ok) doSave(next);
    }
  };

  const serial = records.length + 1;

  return (
    <main className="shell">
      <header className="masthead">
        <div className="title">
          <h1>{t.app}</h1>
          <p>{t.tagline}</p>
        </div>
        <button className="langbtn" onClick={() => setShowLang(true)} aria-label={`${t.language}: ${info.native}`}>
          <span className="glyph" aria-hidden>{info.script}</span>
          <span className="lname">{info.native}</span>
          <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden><path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </header>

      <div className="daystrip">
        <span>{formatDate(toISO(new Date()), lang)}</span>
        <span className="tallywrap" aria-label={`${t.todayVisits}: ${todayCount}`}>
          {t.todayVisits}
          <Tally n={todayCount} />
          <b>{todayCount}</b>
        </span>
      </div>

      {phase !== 'card' && (
        <section className="hero">
          <MicButton listening={phase === 'listening'} label={phase === 'listening' ? t.listening : t.start}
            sub={phase === 'listening' ? t.tapToStop : ''} onStart={startVisit} onStop={() => listener.current?.stop()} />
          <p className="prompt">{supported ? t.speakNow : t.notSupported}</p>
        </section>
      )}

      {(phase === 'listening' || phase === 'card') && (
        <Transcript words={words} interim={interim} lang={lang} t={t} listening={phase === 'listening'} onReplace={replaceWord} />
      )}

      {phase === 'card' && (
        <>
          <RegisterCard fields={fields} lang={lang} t={t} serial={serial} onOpen={setSheet} />
          <div className="actions">
            {missing.length > 0 && <p className="need">{t.missing}: {missing.map((k) => t.fields[k]).join(', ')}</p>}
            <button className="btn ink big" onClick={onConfirm}>
              {t.confirmSave}
              {toConfirm.length > 0 && !missing.length && <span className="sub">{t.readBack}: {toConfirm.map((k) => t.fields[k]).join(' · ')}</span>}
            </button>
            <button className="btn plain" onClick={() => { setPhase('idle'); setWords([]); setFields(emptyFields()); }}>{t.cancel}</button>
          </div>
        </>
      )}

      {saved && phase === 'idle' && (
        <section className="slip" role="status">
          <span className="stamp">{t.recorded}</span>
          <div>
            <strong>{saved.name}</strong>
            {saved.nextVisit && <p>{t.reminderSet}: <b>{formatDate(saved.nextVisit.iso, lang)}</b> · {relDays(saved.nextVisit.days, lang)}</p>}
          </div>
        </section>
      )}

      {phase === 'idle' && (
        <section className="typebox">
          <button className="textlink" onClick={() => setShowType((s) => !s)}>{t.typeInstead}</button>
          {showType && (
            <div className="typepanel">
              <textarea value={typed} onChange={(e) => setTyped(e.target.value)} rows={3} placeholder={SAMPLES[lang][0]} />
              <div className="row wrap">
                <button className="btn ink" onClick={() => useTyped(typed)} disabled={!typed.trim()}>{t.parse}</button>
                {SAMPLES[lang].map((s, i) => (
                  <button key={i} className="btn plain small" onClick={() => { setTyped(s); useTyped(s); }}>{t.sample} {SAMPLES[lang].length > 1 ? i + 1 : ''}</button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {phase === 'idle' && <RecordsPanel records={records} lang={lang} t={t} onChange={() => setRecords(loadRecords())} />}

      {sheet && (
        <FieldSheet
          k={sheet} fields={fields} lang={lang} t={t}
          onClose={() => setSheet(null)}
          onSave={(f) => {
            setSheet(null);
            if (readQueue.includes(sheet) && f.confirmed) readNext(sheet, f as Fields[FieldKey]);
            else setField(sheet, f as Fields[typeof sheet]);
          }}
        />
      )}

      {readQueue.length > 0 && !sheet && (
        <ReadBackModal
          k={readQueue[0]} fields={fields} lang={lang} t={t} step={readTotal - readQueue.length + 1} total={readTotal}
          onYes={() => readNext(readQueue[0])} onNo={() => setSheet(readQueue[0])} onCancel={() => setReadQueue([])}
        />
      )}

      {showLang && <LanguageSheet current={lang} title={t.language} canClose={settings.chosen} onPick={chooseLang} onClose={() => setShowLang(false)} />}

      {toast && <div className={`toast ${toast.kind}`} role="status">{toast.text}</div>}
    </main>
  );
}
