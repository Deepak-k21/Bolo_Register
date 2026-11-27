/** Tally marks, the way visits are counted on paper: four strokes and a cross-stroke. */
export function Tally({ n }: { n: number }) {
  const groups = Math.floor(Math.min(n, 20) / 5);
  const rest = Math.min(n, 20) % 5;
  const stroke = { stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const };
  const group = (key: number, count: number) => (
    <svg key={key} viewBox="0 0 30 22" width="30" height="22" aria-hidden>
      {Array.from({ length: Math.min(count, 4) }, (_, i) => <line key={i} x1={5 + i * 6} y1={3} x2={4 + i * 6} y2={19} {...stroke} />)}
      {count === 5 && <line x1={1} y1={16} x2={27} y2={6} {...stroke} />}
    </svg>
  );
  if (n === 0) return <span className="tally empty" aria-hidden>—</span>;
  return (
    <span className="tally" aria-hidden>
      {Array.from({ length: groups }, (_, i) => group(i, 5))}
      {rest > 0 && group(groups, rest)}
    </span>
  );
}
