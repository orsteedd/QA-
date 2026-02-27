import { Line, LineChart, ResponsiveContainer } from 'recharts'
import KpiTooltip from './KpiTooltip'
import { buildMetricValue, normalizeTrend, withOpacity } from './kpi-utils'

function KpiSparklineCard({
  name,
  value,
  target,
  unit = '',
  trend = '+0.0%',
  color = '#14B8A6',
  definition = '',
  sparkline = [],
}) {
  const trendMeta = normalizeTrend(trend)
  const lineData = sparkline.map((point, index) => ({ index, value: point }))

  return (
    <article className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
      <KpiTooltip definition={definition} />
      <p className="text-xs text-[var(--text-muted)]">{name}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold">{buildMetricValue({ value, unit })}</p>
        <span
          className="rounded-full px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: withOpacity(color, 0.16), color: trendMeta.isPositive ? color : '#EF4444' }}
        >
          {trendMeta.label}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">Target: {target}</p>
      <div className="mt-2 h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default KpiSparklineCard
