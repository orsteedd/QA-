import KpiTooltip from './KpiTooltip'
import { buildMetricValue, normalizeTrend, withOpacity } from './kpi-utils'

function KpiGaugeCard({
  name,
  value,
  target,
  unit = '%',
  trend = '+0.0%',
  color = '#14B8A6',
  definition = '',
}) {
  const normalized = Math.min(100, Math.max(0, Number(value)))
  const trendMeta = normalizeTrend(trend)

  return (
    <article className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
      <KpiTooltip definition={definition} />
      <p className="text-xs text-[var(--text-muted)]">{name}</p>

      <div className="mt-4 grid place-items-center">
        <div
          className="relative h-24 w-48 overflow-hidden rounded-t-full"
          style={{
            background: `conic-gradient(from 180deg at 50% 100%, ${color} ${normalized * 1.8}deg, rgba(148,163,184,0.25) ${normalized * 1.8}deg 180deg)`,
          }}
        >
          <div className="absolute inset-x-5 bottom-0 h-16 rounded-t-full bg-[var(--bg-surface)]" />
          <div className="absolute inset-x-0 bottom-2 text-center text-xl font-semibold">{buildMetricValue({ value, unit })}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
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

export default KpiGaugeCard
