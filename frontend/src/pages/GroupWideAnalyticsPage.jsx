import { useMemo, useState } from 'react'
import { BarChart3, Target, TrendingUp } from 'lucide-react'
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

const unitNames = ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT']

const metricOptions = [
  { id: 'quality', label: 'Quality Index', color: '#14B8A6', unit: '%' },
  { id: 'sla', label: 'Resolution SLA', color: '#1E40AF', unit: '%' },
  { id: 'compliance', label: 'Compliance Rate', color: '#22C55E', unit: '%' },
  { id: 'innovation', label: 'Innovation Score', color: '#F59E0B', unit: '%' },
]

const groupSeries = [
  { date: 'Mon', ecs: 84, malatang: 82, captura: 88, service: 79, it: 83 },
  { date: 'Tue', ecs: 85, malatang: 83, captura: 89, service: 80, it: 84 },
  { date: 'Wed', ecs: 87, malatang: 84, captura: 90, service: 81, it: 86 },
  { date: 'Thu', ecs: 88, malatang: 86, captura: 92, service: 83, it: 87 },
  { date: 'Fri', ecs: 90, malatang: 87, captura: 93, service: 84, it: 88 },
  { date: 'Sat', ecs: 91, malatang: 88, captura: 94, service: 85, it: 89 },
  { date: 'Sun', ecs: 92, malatang: 89, captura: 95, service: 86, it: 91 },
]

const unitLineConfig = [
  { id: 'ecs', label: 'Education', fullName: 'Education Consultation Services', color: '#14B8A6' },
  { id: 'malatang', label: 'Malatang', fullName: 'No. 1 Malatang', color: '#1E40AF' },
  { id: 'captura', label: 'Captura', fullName: 'Captura', color: '#38BDF8' },
  { id: 'service', label: 'Service Proc.', fullName: 'Service Processing', color: '#A78BFA' },
  { id: 'it', label: 'IT', fullName: 'IT', color: '#22C55E' },
]

const latestScores = {
  quality: [92, 89, 95, 86, 91],
  sla: [95, 90, 97, 88, 93],
  compliance: [97, 93, 98, 90, 95],
  innovation: [88, 82, 91, 79, 86],
}

function GroupWideAnalyticsPage({ selectedUnits = [], dateRange = 'Last 30 days', compactTables = false }) {
  const [selectedMetrics, setSelectedMetrics] = useState(['quality', 'sla'])
  const [drillPoint, setDrillPoint] = useState(null)

  const activeUnitConfig = useMemo(() => {
    if (selectedUnits.length === 0) return unitLineConfig
    return unitLineConfig.filter((unit) => selectedUnits.includes(unit.fullName))
  }, [selectedUnits])

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
    const last = groupSeries[groupSeries.length - 1]
    const first = groupSeries[0]
    const averages = unitLineConfig.map((unit) => {
      const diff = last[unit.id] - first[unit.id]
      return {
        unit: unit.label,
        diff,
        final: last[unit.id],
      }
    })

    const top = [...averages].sort((a, b) => b.final - a.final)[0]
    const lagging = [...averages].sort((a, b) => a.final - b.final)[0]
    const momentum = [...averages].sort((a, b) => b.diff - a.diff)[0]

    return [
      { title: 'Top Performing Unit', value: `${top.unit} (${top.final}%)`, subtitle: 'Highest latest quality score', icon: Target },
      { title: 'Lagging Unit', value: `${lagging.unit} (${lagging.final}%)`, subtitle: 'Needs intervention', icon: BarChart3 },
      { title: 'Best Momentum', value: `${momentum.unit} (+${momentum.diff})`, subtitle: 'Strongest 7-day rise', icon: TrendingUp },
    ]
  }, [])

  const modalRows = drillPoint
    ? activeUnitConfig.map((unit) => [unit.label, `${drillPoint[unit.id]}%`])
    : []

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Group-Wide Analytics</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">ENZ Group – Cross Unit Performance</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Comparative trends and metric health for {selectedUnits.length > 0 ? `${selectedUnits.length} selected units` : 'all 5 business units'} ({dateRange}).</p>
      </section>

      <MetricSelector options={metricOptions} selected={selectedMetrics} onToggle={toggleMetric} />

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Multi-Line Unit Trend</h3>
          <p className="text-xs text-[var(--text-secondary)]">Click any point for raw snapshot</p>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={groupSeries}
              onClick={(state) => {
                const payload = state?.activePayload?.[0]?.payload
                if (payload) setDrillPoint(payload)
              }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[70, 100]} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                }}
              />
              {activeUnitConfig.map((unit) => (
                <Line
                  key={unit.id}
                  type="monotone"
                  dataKey={unit.id}
                  name={unit.label}
                  stroke={unit.color}
                  strokeWidth={2.4}
                  dot={{ r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {trendCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.title} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
              <p className="text-xs text-[var(--text-muted)]">{card.title}</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{card.value}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{card.subtitle}</p>
              <Icon size={14} className="mt-2 text-[var(--accent-teal)]" />
            </article>
          )
        })}
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Heatmap Comparison Table</h3>
        </div>
        <div className="overflow-auto rounded-lg border border-[var(--border-subtle)]">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>Business Unit</th>
                {selectedMetrics.map((metricId) => {
                  const metric = metricOptions.find((item) => item.id === metricId)
                  return <th key={metricId} className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{metric?.label}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {unitNames.filter((unitName) => selectedUnits.length === 0 || selectedUnits.includes(unitName)).map((unitName, index) => (
                <tr key={unitName} className="border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <td className={compactTables ? 'px-3 py-1.5 font-medium text-[var(--text-primary)]' : 'px-3 py-2 font-medium text-[var(--text-primary)]'}>{unitName}</td>
                  {selectedMetrics.map((metricId) => {
                    const metric = metricOptions.find((item) => item.id === metricId)
                    const value = latestScores[metricId][unitNames.indexOf(unitName)]
                    const alpha = 0.14 + (value / 100) * 0.44
                    return (
                      <td key={`${unitName}-${metricId}`} className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>
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
        title="Group Snapshot Drill-down"
        subtitle={drillPoint ? `All Units • ${drillPoint.date}` : ''}
        columns={['Business Unit', 'Score']}
        rows={modalRows}
        onClose={() => setDrillPoint(null)}
      />
    </div>
  )
}

export default GroupWideAnalyticsPage
