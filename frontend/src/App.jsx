import { useMemo, useState } from 'react'
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Library,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import KpiUsageExamples from './components/kpi/KpiUsageExamples'
import {
  KpiGaugeCard,
  KpiMiniDashboardCard,
  KpiSimpleCard,
  KpiSparklineCard,
} from './components/kpi'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Comparisons', icon: SlidersHorizontal },
  { label: 'Business Units', icon: Building2 },
  { label: 'Metrics Library', icon: Library },
  { label: 'Testing', icon: FlaskConical },
  { label: 'Reports', icon: Gauge },
  { label: 'Settings', icon: Settings },
]

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom']
const units = ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT']
const metrics = ['Quality Index', 'Timeliness', 'Compliance Rate', 'Innovation Score', 'Customer Satisfaction']

const heroTrend = [78, 81, 82, 84, 83, 87, 90]

const kpis = [
  { name: 'Overall Timeliness', value: 94.2, unit: '%', target: '96%', trendLabel: '+2.4%', trend: [82, 84, 86, 88, 89, 91, 94], color: '#14B8A6', definition: 'Measures how consistently tasks and QA cycles are completed within expected timeframes.' },
  { name: 'Quality Index', value: 90.8, unit: '%', target: '92%', trendLabel: '+1.9%', trend: [79, 80, 82, 84, 87, 89, 91], color: '#1E40AF', definition: 'Composite score of defect rates, review quality, and process adherence across units.' },
  { name: 'Customer Satisfaction', value: 4.7, unit: '/5', target: '4.8/5', trendLabel: '+3.2%', trend: [3.9, 4.1, 4.2, 4.3, 4.4, 4.5, 4.7], color: '#38BDF8', definition: 'Average customer satisfaction score gathered from post-service and QA feedback.' },
  { name: 'Cost Efficiency', value: 88.1, unit: '%', target: '90%', trendLabel: '+1.1%', trend: [80, 81, 83, 84, 85, 87, 88], color: '#A78BFA', definition: 'Indicates how efficiently each unit converts resources into validated outcomes.' },
  { name: 'Compliance Rate', value: 97.5, unit: '%', target: '98%', trendLabel: '+0.8%', trend: [92, 93, 94, 95, 96, 97, 97.5], color: '#22C55E', definition: 'Tracks adherence to required controls, standards, and audit documentation.' },
  { name: 'Innovation Score', value: 86.4, unit: '%', target: '88%', trendLabel: '+4.5%', trend: [72, 74, 78, 80, 82, 84, 86], color: '#14B8A6', definition: 'Represents improvement velocity and impact from newly adopted QA initiatives.' },
]

const unitCards = [
  {
    name: 'Education Consultation Services',
    initials: 'EC',
    kpis: [
      { label: 'Quality', value: 92, color: '#14B8A6' },
      { label: 'SLA', value: 95, color: '#1E40AF' },
      { label: 'CSAT', value: 89, color: '#38BDF8' },
      { label: 'Compliance', value: 97, color: '#22C55E' },
    ],
    trend: [74, 76, 79, 81, 84, 86, 88],
  },
  {
    name: 'No. 1 Malatang',
    initials: 'NM',
    kpis: [
      { label: 'Quality', value: 88, color: '#14B8A6' },
      { label: 'SLA', value: 90, color: '#1E40AF' },
      { label: 'CSAT', value: 87, color: '#38BDF8' },
      { label: 'Compliance', value: 93, color: '#22C55E' },
    ],
    trend: [70, 72, 74, 75, 77, 79, 80],
  },
  {
    name: 'Captura',
    initials: 'CA',
    kpis: [
      { label: 'Quality', value: 95, color: '#14B8A6' },
      { label: 'SLA', value: 97, color: '#1E40AF' },
      { label: 'CSAT', value: 92, color: '#38BDF8' },
      { label: 'Compliance', value: 98, color: '#22C55E' },
    ],
    trend: [78, 80, 83, 86, 88, 90, 93],
  },
  {
    name: 'Service Processing',
    initials: 'SP',
    kpis: [
      { label: 'Quality', value: 84, color: '#14B8A6' },
      { label: 'SLA', value: 86, color: '#1E40AF' },
      { label: 'CSAT', value: 82, color: '#38BDF8' },
      { label: 'Compliance', value: 90, color: '#22C55E' },
    ],
    trend: [66, 68, 70, 72, 72, 74, 75],
  },
  {
    name: 'IT',
    initials: 'IT',
    kpis: [
      { label: 'Quality', value: 91, color: '#14B8A6' },
      { label: 'SLA', value: 93, color: '#1E40AF' },
      { label: 'CSAT', value: 88, color: '#38BDF8' },
      { label: 'Compliance', value: 95, color: '#22C55E' },
    ],
    trend: [72, 74, 77, 79, 81, 84, 86],
  },
]

const comparisonData = [
  {
    metric: 'Quality',
    ecs: 92,
    malatang: 88,
    captura: 95,
    service: 84,
    it: 91,
  },
  {
    metric: 'SLA',
    ecs: 95,
    malatang: 90,
    captura: 97,
    service: 86,
    it: 93,
  },
  {
    metric: 'CSAT',
    ecs: 89,
    malatang: 87,
    captura: 92,
    service: 82,
    it: 88,
  },
  {
    metric: 'Compliance',
    ecs: 97,
    malatang: 93,
    captura: 98,
    service: 90,
    it: 95,
  },
]

const alerts = [
  { id: 'QAI-901', unit: 'Service Processing', issue: 'SLA breach cluster detected', time: '6m ago', severity: 'high' },
  { id: 'QAI-897', unit: 'No. 1 Malatang', issue: 'QA variance above threshold', time: '18m ago', severity: 'medium' },
  { id: 'QAI-892', unit: 'IT', issue: 'Compliance evidence incomplete', time: '41m ago', severity: 'medium' },
  { id: 'QAI-889', unit: 'Education Consultation Services', issue: 'Escalation turnaround delay', time: '1h ago', severity: 'low' },
]

const unitSeries = [
  { key: 'ecs', color: '#14B8A6', label: 'ECS' },
  { key: 'malatang', color: '#1E40AF', label: 'Malatang' },
  { key: 'captura', color: '#38BDF8', label: 'Captura' },
  { key: 'service', color: '#A78BFA', label: 'Service Proc.' },
  { key: 'it', color: '#22C55E', label: 'IT' },
]

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [selectedUnits, setSelectedUnits] = useState([units[0], units[2], units[4]])
  const [metric, setMetric] = useState('Quality Index')
  const [unitMenuOpen, setUnitMenuOpen] = useState(false)

  const selectedUnitLabel = useMemo(() => {
    if (selectedUnits.length === 0) return 'All units'
    if (selectedUnits.length === units.length) return 'All units'
    if (selectedUnits.length === 1) return selectedUnits[0]
    return `${selectedUnits.length} units`
  }, [selectedUnits])

  const toggleUnit = (unit) => {
    setSelectedUnits((prev) => (prev.includes(unit) ? prev.filter((item) => item !== unit) : [...prev, unit]))
  }

  return (
    <div className="dark min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <aside
          className={[
            'hidden md:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-[width] duration-300 ease-out',
            collapsed ? 'w-[84px]' : 'w-[272px]',
          ].join(' ')}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E40AF] ring-1 ring-white/10" />
              {!collapsed && (
                <p className="whitespace-nowrap text-sm font-semibold tracking-wide">
                  ENZ <span className="text-[var(--accent-teal)]">QA</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  className={[
                    'group flex h-11 w-full items-center rounded-xl border px-3 text-sm transition-all',
                    item.active
                      ? 'border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/15 text-[var(--text-primary)] shadow-[var(--depth-1)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                    collapsed ? 'justify-center' : 'justify-start gap-3',
                  ].join(' ')}
                >
                  <Icon size={18} className={item.active ? 'text-[var(--accent-teal)]' : ''} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          <div className="p-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-muted)]">
              {!collapsed ? 'Metrics are dynamic and can change over time.' : <Sparkles size={16} />}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-surface)]/75">
            <div className="flex h-16 items-center gap-3 px-4 md:px-6">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] md:hidden"
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>

              <div className="hidden min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 md:flex md:max-w-sm">
                <Search size={16} className="text-[var(--text-muted)]" />
                <input
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  placeholder="Search metrics, reports, units..."
                />
              </div>

              <div className="ml-auto flex items-center gap-2 md:gap-3">
                <select className="control-select" value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>

                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setUnitMenuOpen((prev) => !prev)}
                    className="control-button"
                  >
                    <span className="max-w-[130px] truncate">{selectedUnitLabel}</span>
                    <ChevronDown size={14} />
                  </button>
                  {unitMenuOpen && (
                    <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-[var(--depth-2)]">
                      {units.map((unit) => (
                        <label
                          key={unit}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUnits.includes(unit)}
                            onChange={() => toggleUnit(unit)}
                            className="h-4 w-4 rounded border-[var(--border-subtle)] accent-[var(--accent-teal)]"
                          />
                          <span className="truncate">{unit}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <select className="control-select hidden lg:block" value={metric} onChange={(event) => setMetric(event.target.value)}>
                  {metrics.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <button type="button" className="icon-button" aria-label="Notifications">
                  <Bell size={17} />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
                </button>

                <button type="button" className="h-9 w-9 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#14B8A6] text-xs font-semibold text-white shadow-[var(--depth-1)]">
                  EN
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--border-subtle)] px-4 py-2 md:hidden">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2">
                <Search size={16} className="text-[var(--text-muted)]" />
                <input
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  placeholder="Search..."
                />
              </div>
              <select className="control-select !w-40" value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                {dateRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </header>

          <main className="flex-1 p-4 pb-24 md:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-4">
                <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
                  <div className="grid gap-4 md:grid-cols-[1fr_360px] md:items-end">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Performance overview</p>
                      <h1 className="mt-1 text-2xl font-semibold md:text-3xl">ENZ Group Performance</h1>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">Unified quality and operational performance across all business units.</p>
                    </div>
                    <KpiSparklineCard
                      name="Overall Group Score"
                      value={90.8}
                      target="92%"
                      unit="%"
                      trend="+2.3%"
                      color="#14B8A6"
                      definition="Aggregated performance index across all business units based on active quality metrics."
                      sparkline={heroTrend}
                    />
                  </div>
                </section>

                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">KPI Overview</h2>
                    <p className="text-xs text-[var(--text-muted)]">Live metric snapshots</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {kpis.map((item, index) => {
                      if (index % 3 === 0) {
                        return (
                          <KpiSparklineCard
                            key={item.name}
                            name={item.name}
                            value={item.value}
                            target={item.target}
                            unit={item.unit}
                            trend={item.trendLabel}
                            color={item.color}
                            definition={item.definition}
                            sparkline={item.trend}
                          />
                        )
                      }

                      if (index % 3 === 1) {
                        return (
                          <KpiSimpleCard
                            key={item.name}
                            name={item.name}
                            value={item.value}
                            target={item.target}
                            unit={item.unit}
                            trend={item.trendLabel}
                            color={item.color}
                            definition={item.definition}
                          />
                        )
                      }

                      return (
                        <KpiGaugeCard
                          key={item.name}
                          name={item.name}
                          value={item.value}
                          target={item.target}
                          unit={item.unit}
                          trend={item.trendLabel}
                          color={item.color}
                          definition={item.definition}
                        />
                      )
                    })}
                  </div>
                </section>

                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Business Units</h2>
                    <p className="text-xs text-[var(--text-muted)]">7-day momentum with core KPI rings</p>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {unitCards.map((unit) => (
                      <KpiMiniDashboardCard
                        key={unit.name}
                        name={unit.name}
                        value={unit.kpis[0].value}
                        target="95%"
                        unit="%"
                        trend={`+${(unit.trend[unit.trend.length - 1] - unit.trend[0]).toFixed(1)}%`}
                        color="#1E40AF"
                        definition={`${unit.name} combined health view for Quality, SLA, CSAT, and Compliance over the last 7 days.`}
                        metrics={unit.kpis.map((kpi) => ({ name: kpi.label, value: kpi.value, color: kpi.color }))}
                        sparkline={unit.trend}
                      />
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Group Comparison</h2>
                    <p className="text-xs text-[var(--text-muted)]">Current active metric set</p>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} barGap={6} barCategoryGap={18}>
                        <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="metric" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[60, 100]} />
                        <Tooltip
                          contentStyle={{
                            background: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                          }}
                        />
                        {unitSeries.map((series) => (
                          <Bar key={series.key} dataKey={series.key} name={series.label} radius={[4, 4, 0, 0]}>
                            {comparisonData.map((entry, index) => (
                              <Cell key={`${entry.metric}-${series.key}-${index}`} fill={series.color} />
                            ))}
                          </Bar>
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <KpiUsageExamples />
              </div>

              <aside className="hidden xl:block">
                <div className="sticky top-24 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Quick Alerts</h2>
                    <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs text-red-300">{alerts.length}</span>
                  </div>
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <button
                        key={alert.id}
                        type="button"
                        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-left transition hover:border-[var(--accent-teal)]/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-[var(--text-primary)]">{alert.id}</p>
                          <span
                            className={[
                              'rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide',
                              alert.severity === 'high'
                                ? 'bg-red-500/15 text-red-300'
                                : alert.severity === 'medium'
                                  ? 'bg-amber-500/15 text-amber-300'
                                  : 'bg-sky-500/15 text-sky-300',
                            ].join(' ')}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">{alert.issue}</p>
                        <p className="mt-1 text-[11px] text-[var(--text-muted)]">{alert.unit} • {alert.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[84%] max-w-xs animate-[slideIn_.22s_ease-out] border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-wide">ENZ <span className="text-[var(--accent-teal)]">QA</span></p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)]"
                aria-label="Close navigation panel"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={[
                      'flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-sm transition-all',
                      item.active
                        ? 'border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/15 text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    <Icon size={18} className={item.active ? 'text-[var(--accent-teal)]' : ''} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-3 py-2 backdrop-blur md:bottom-0 md:left-[272px] md:right-0 md:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-end gap-2">
          <button type="button" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent-teal)]/60 hover:text-[var(--text-primary)]">
            Customize Metrics
          </button>
          <button type="button" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent-teal)]/60 hover:text-[var(--text-primary)]">
            Export Report
          </button>
          <button type="button" className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]">
            Start New Test
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                className={[
                  'flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] transition',
                  item.active
                    ? 'bg-[var(--brand-primary)]/15 text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <Icon size={16} className={item.active ? 'text-[var(--accent-teal)]' : ''} />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
