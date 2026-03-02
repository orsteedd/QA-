import { useMemo, useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import MetricSelector from '../components/analytics/MetricSelector'
import DrilldownModal from '../components/analytics/DrilldownModal'

const metricOptions = [
  { id: 'quality', label: 'Quality Index', color: '#14B8A6', unit: '%' },
  { id: 'sla', label: 'Resolution SLA', color: '#1E40AF', unit: '%' },
  { id: 'csat', label: 'Customer Satisfaction', color: '#38BDF8', unit: '%' },
  { id: 'compliance', label: 'Compliance Rate', color: '#22C55E', unit: '%' },
  { id: 'efficiency', label: 'Cost Efficiency', color: '#A78BFA', unit: '%' },
  { id: 'innovation', label: 'Innovation Score', color: '#F59E0B', unit: '%' },
]

const seriesData = [
  { date: 'Mon', quality: 84, sla: 88, csat: 86, compliance: 92, efficiency: 78, innovation: 76 },
  { date: 'Tue', quality: 85, sla: 89, csat: 87, compliance: 93, efficiency: 79, innovation: 77 },
  { date: 'Wed', quality: 87, sla: 90, csat: 89, compliance: 94, efficiency: 80, innovation: 79 },
  { date: 'Thu', quality: 89, sla: 92, csat: 90, compliance: 95, efficiency: 82, innovation: 81 },
  { date: 'Fri', quality: 90, sla: 93, csat: 91, compliance: 96, efficiency: 84, innovation: 84 },
  { date: 'Sat', quality: 91, sla: 94, csat: 92, compliance: 96, efficiency: 85, innovation: 85 },
  { date: 'Sun', quality: 92, sla: 95, csat: 94, compliance: 97, efficiency: 87, innovation: 86 },
]

function metricUnit(metricId) {
  return metricOptions.find((item) => item.id === metricId)?.unit ?? ''
}

function BusinessUnitDeepDivePage({ selectedUnits = [], dateRange = 'Last 30 days', compactTables = false }) {
  const [selectedMetrics, setSelectedMetrics] = useState(['quality', 'sla', 'csat'])
  const [drillPoint, setDrillPoint] = useState(null)
  const focusUnit = selectedUnits[0] ?? 'No. 1 Malatang'

  const toggleMetric = (metricId) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricId)) {
        if (prev.length === 1) return prev
        return prev.filter((item) => item !== metricId)
      }
      return [...prev, metricId]
    })
  }

  const trendCards = useMemo(() => {
    return selectedMetrics.slice(0, 3).map((metricId) => {
      const metric = metricOptions.find((item) => item.id === metricId)
      const start = seriesData[0][metricId]
      const end = seriesData[seriesData.length - 1][metricId]
      const diff = Number((end - start).toFixed(2))
      const percent = Number(((diff / (start || 1)) * 100).toFixed(1))

      return {
        id: metricId,
        name: metric?.label ?? metricId,
        color: metric?.color ?? '#14B8A6',
        diff,
        percent,
        finalValue: end,
        unit: metric?.unit ?? '',
      }
    })
  }, [selectedMetrics])

  const heatmapRows = seriesData
  const heatmapMax = 100

  const modalRows = drillPoint
    ? selectedMetrics.map((metricId) => {
      const label = metricOptions.find((item) => item.id === metricId)?.label ?? metricId
      const value = drillPoint[metricId]
      return [label, `${value}${metricUnit(metricId)}`]
    })
    : []

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Business Unit Deep Dive</p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">{focusUnit} – Analytics</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Performance and quality behavior with metric-level trend breakdown ({dateRange}).</p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            Click a chart point to drill into raw data
          </div>
        </div>
      </section>

      <MetricSelector options={metricOptions} selected={selectedMetrics} onToggle={toggleMetric} />

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Time Series Analysis</h3>
        </div>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={seriesData}
              onClick={(state) => {
                const payload = state?.activePayload?.[0]?.payload
                if (payload) setDrillPoint(payload)
              }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                }}
              />
              {selectedMetrics.map((metricId) => {
                const metric = metricOptions.find((item) => item.id === metricId)
                return (
                  <Line
                    key={metricId}
                    type="monotone"
                    dataKey={metricId}
                    name={metric?.label}
                    stroke={metric?.color}
                    strokeWidth={2.6}
                    dot={{ r: 3.5, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                )
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {trendCards.map((trend) => (
          <article key={trend.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <p className="text-xs text-[var(--text-muted)]">{trend.name}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{trend.finalValue}{trend.unit}</p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs" style={{ backgroundColor: `${trend.color}22`, color: trend.color }}>
              <TrendingUp size={12} /> {trend.percent > 0 ? '+' : ''}{trend.percent}%
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">7-day movement: {trend.diff > 0 ? '+' : ''}{trend.diff}{trend.unit}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Heatmap Comparison Table</h3>
          <ArrowUpRight size={16} className="text-[var(--accent-teal)]" />
        </div>
        <div className="overflow-auto rounded-lg border border-[var(--border-subtle)]">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>Day</th>
                {selectedMetrics.map((metricId) => {
                  const metric = metricOptions.find((item) => item.id === metricId)
                  return <th key={metricId} className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{metric?.label}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((row) => (
                <tr key={row.date} className="border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <td className={compactTables ? 'px-3 py-1.5 font-medium text-[var(--text-primary)]' : 'px-3 py-2 font-medium text-[var(--text-primary)]'}>{row.date}</td>
                  {selectedMetrics.map((metricId) => {
                    const metric = metricOptions.find((item) => item.id === metricId)
                    const value = row[metricId]
                    const normalized = Math.min(1, Number(value) / heatmapMax)
                    const alpha = 0.14 + normalized * 0.42
                    return (
                      <td key={`${row.date}-${metricId}`} className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>
                        <div
                          className="rounded-md px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${metric?.color ?? '#14B8A6'}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
                            color: '#E2E8F0',
                          }}
                        >
                          {value}{metric?.unit}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DrilldownModal
        open={Boolean(drillPoint)}
        title="Raw Data Drill-down"
        subtitle={drillPoint ? `${focusUnit} • ${drillPoint.date}` : ''}
        columns={['Metric', 'Value']}
        rows={modalRows}
        onClose={() => setDrillPoint(null)}
      />
    </div>
  )
}

export default BusinessUnitDeepDivePage
