export default function ExchangeChart({ points, from, to, loading, error }) {
  if (loading) return <p className="text-sm text-slate-500">Loading 30-day trend…</p>;
  if (error) return <p className="text-sm text-amber-700">{error}</p>;
  if (!points.length) return <p className="text-sm text-slate-500">Historical comparison is unavailable for identical currencies.</p>;
  const values = points.map((point) => point.value); const low = Math.min(...values); const high = Math.max(...values); const range = high - low || 1;
  const path = values.map((value, index) => { const x = (index / Math.max(values.length - 1, 1)) * 100; const y = 92 - ((value - low) / range) * 78; return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`; }).join(" ");
  return <section className="mt-7 border-t border-slate-200 pt-5" aria-label="Historical exchange-rate chart"><div className="mb-3 flex items-baseline justify-between"><h2 className="font-semibold text-slate-800">30-day trend</h2><span className="text-xs text-slate-500">1 {from} in {to}</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-28 w-full overflow-visible" role="img" aria-label={`Thirty day rate from ${from} to ${to}`}><path d="M0,92 H100" stroke="#cbd5e1" strokeWidth="1" vectorEffect="non-scaling-stroke" /><path d={path} fill="none" stroke="#2563eb" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /></svg><div className="flex justify-between text-xs text-slate-500"><span>Low {low.toFixed(4)}</span><span>High {high.toFixed(4)}</span></div></section>;
}
