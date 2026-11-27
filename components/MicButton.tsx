'use client';
export function MicButton({ listening, label, sub, onStart, onStop, size = 'big' }: {
  listening: boolean; label: string; sub?: string; onStart: () => void; onStop: () => void; size?: 'big' | 'small';
}) {
  return (
    <button className={`mic mic-${size} ${listening ? 'live' : ''}`} onClick={listening ? onStop : onStart} aria-pressed={listening} aria-label={label}>
      <svg className="ring" viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
      </svg>
      <span className="disc">
        {listening ? (
          <span className="bars" aria-hidden><i /><i /><i /><i /><i /></span>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden className="micicon">
            <rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="currentColor" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        {size === 'big' && <span className="label">{label}</span>}
        {size === 'big' && sub && <span className="sublabel">{sub}</span>}
      </span>
    </button>
  );
}
