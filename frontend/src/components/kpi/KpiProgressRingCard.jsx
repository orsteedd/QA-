import KpiTooltip from './KpiTooltip'
import { buildMetricValue, normalizeTrend, withOpacity } from './kpi-utils'

function KpiProgressRingCard({
  name,
  value,
  target,
  unit = '%',
  trend = '+0.0%',
  color = '#14B8A6',
  definition = '',
}) {
  const ringValue = Math.min(100, Math.max(0, Number(value)))
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (ringValue / 100) * circumference
  const trendMeta = normalizeTrend(trend)

  return (
    <article className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
      <KpiTooltip definition={definition} />
      <p className="text-xs text-[var(--text-muted)]">{name}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 72 72" className="h-20 w-20">
            <circle cx="36" cy="36" r={radius} stroke="rgba(148,163,184,0.22)" strokeWidth="7" fill="none" />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke={color}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 36 36)"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-sm font-semibold">{Math.round(ringValue)}%</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold">{buildMetricValue({ value, unit })}</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Target: {target}</p>
          <span
            className="mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: withOpacity(color, 0.14), color: trendMeta.isPositive ? color : '#EF4444' }}
          >
            {trendMeta.label}
          </span>
        </div>
      </div>
    </article>
  )
}

export default KpiProgressRingCard
