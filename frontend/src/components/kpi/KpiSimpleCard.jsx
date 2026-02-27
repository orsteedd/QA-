import KpiTooltip from './KpiTooltip'
import { buildMetricValue, normalizeTrend, withOpacity } from './kpi-utils'

function KpiSimpleCard({
  name,
  value,
  target,
  unit = '',
  trend = '+0.0%',
  color = '#14B8A6',
  definition = '',
}) {
  const trendMeta = normalizeTrend(trend)

  return (
    <article className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)] transition hover:border-[var(--accent-teal)]/50">
      <KpiTooltip definition={definition} />
      <p className="text-xs text-[var(--text-muted)]">{name}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">{buildMetricValue({ value, unit })}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-[var(--text-secondary)]">Target: {target}</p>
        <span
          className="rounded-full px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: withOpacity(color, 0.16), color: trendMeta.isPositive ? color : '#EF4444' }}
        >
          {trendMeta.label}
        </span>
      </div>
    </article>
  )
}

export default KpiSimpleCard
