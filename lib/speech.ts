'use client';
// Thin wrapper over the browser Web Speech API (webkitSpeechRecognition).
// No API key. Chrome/Edge/Safari send audio to the browser vendor's speech service,
// so this needs internet. See README for the on-device production path.

import type { Lang, Word } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SR = any;

export function speechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export interface ListenOptions {
  lang: Lang;
  /** Whole-sentence mode keeps listening until a pause; single mode returns after one phrase. */
  mode: 'sentence' | 'single';
  pauseMs?: number;
  onInterim?: (text: string) => void;
  onFinalWords?: (words: Word[]) => void;
  onEnd?: (allWords: Word[]) => void;
  onError?: (code: string) => void;
}

const LOW_CONFIDENCE = 0.6;

/** Turn one recognition result into words, marking words the recogniser was unsure about. */
export function wordsFromResult(result: SR): Word[] {
  const best = String(result[0]?.transcript ?? '').trim();
  const conf: number = result[0]?.confidence ?? 0;
  const words = best.split(/\s+/).filter(Boolean);
  const alts: string[][] = [];
  for (let i = 1; i < result.length; i++) {
    alts.push(String(result[i].transcript).toLowerCase().trim().split(/\s+/));
  }
  return words.map((w) => {
    const lw = w.toLowerCase().replace(/[,.।!?]/g, '');
    // A word is uncertain if any alternative hypothesis dropped or changed it...
    const disputed = alts.some((a) => !a.some((x) => x.replace(/[,.।!?]/g, '') === lw));
    // ...or, when there are no alternatives, if the whole phrase had low confidence.
    const lowPhrase = alts.length === 0 && conf > 0 && conf < LOW_CONFIDENCE;
    return { text: w, low: disputed || lowPhrase };
  });
}

export class Listener {
  private rec: SR | null = null;
  private words: Word[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private hardStop: ReturnType<typeof setTimeout> | null = null;
  private ended = false;
  private errored = false;

  constructor(private opts: ListenOptions) {}

  start() {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) { this.opts.onError?.('not-supported'); return; }
    const rec: SR = new Ctor();
    this.rec = rec;
    rec.lang = this.opts.lang;
    rec.continuous = this.opts.mode === 'sentence';
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    const pause = this.opts.pauseMs ?? (this.opts.mode === 'sentence' ? 1800 : 1200);

    rec.onresult = (e: SR) => {
      let interim = '';
      const finals: Word[] = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals.push(...wordsFromResult(r));
        else interim += r[0].transcript;
      }
      if (finals.length) { this.words.push(...finals); this.opts.onFinalWords?.(this.words.slice()); }
      this.opts.onInterim?.(interim);
      this.armPauseTimer(pause);
    };
    rec.onerror = (e: SR) => {
      // 'no-speech', 'audio-capture', 'not-allowed', 'network', 'aborted', 'language-not-supported'
      if (e.error === 'aborted') return;
      this.errored = true;
      this.opts.onError?.(e.error || 'unknown');
    };
    rec.onend = () => this.finish();
    try { rec.start(); } catch { this.opts.onError?.('start-failed'); return; }
    this.armPauseTimer(8000); // nothing said at all
    this.hardStop = setTimeout(() => this.stop(), 30000);
  }

  private armPauseTimer(ms: number) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.stop(), ms);
  }

  stop() {
    try { this.rec?.stop(); } catch { /* already stopped */ }
    // Some browsers never fire onend after stop(); make sure we finish.
    setTimeout(() => this.finish(), 1200);
  }

  abort() {
    this.ended = true;
    this.clear();
    try { this.rec?.abort(); } catch { /* noop */ }
  }

  private clear() {
    if (this.timer) clearTimeout(this.timer);
    if (this.hardStop) clearTimeout(this.hardStop);
  }

  private finish() {
    if (this.ended) return;
    this.ended = true;
    this.clear();
    this.opts.onInterim?.('');
    if (!this.words.length && !this.errored) this.opts.onError?.('no-speech');
    else if (this.words.length) this.opts.onEnd?.(this.words.slice());
  }
}

// ---------------------------------------------------------------------------
// Read-back with speechSynthesis (on-device voices where available).

export function speak(text: string, lang: Lang): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === lang) ||
      window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (voice) u.voice = voice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch { /* read-back is best effort; the screen shows the same text */ }
}
