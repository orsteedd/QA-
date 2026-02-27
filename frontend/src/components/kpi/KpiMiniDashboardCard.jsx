import { Line, LineChart, ResponsiveContainer } from 'recharts'
import KpiTooltip from './KpiTooltip'
import { buildMetricValue, normalizeTrend, withOpacity } from './kpi-utils'

function TinyRing({ value, color }) {
  const ringValue = Math.min(100, Math.max(0, Number(value)))
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (ringValue / 100) * circumference

  return (
    <div className="relative h-11 w-11">
      <svg viewBox="0 0 44 44" className="h-11 w-11">
        <circle cx="22" cy="22" r={radius} stroke="rgba(148,163,184,0.2)" strokeWidth="5" fill="none" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold">{Math.round(ringValue)}</span>
    </div>
  )
}

function KpiMiniDashboardCard({
  name,
  value,
  target,
  unit = '',
  trend = '+0.0%',
  color = '#14B8A6',
  definition = '',
  metrics = [],
  sparkline = [],
}) {
  const trendMeta = normalizeTrend(trend)
  const lineData = sparkline.map((point, index) => ({ index, value: point }))

  return (
    <article className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
      <KpiTooltip definition={definition} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {buildMetricValue({ value, unit })} • Target {target}
          </p>
        </div>
        <span
          className="rounded-full px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: withOpacity(color, 0.16), color: trendMeta.isPositive ? color : '#EF4444' }}
        >
          {trendMeta.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 text-center">
            <TinyRing value={metric.value} color={metric.color || color} />
            <p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{metric.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 h-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default KpiMiniDashboardCard
