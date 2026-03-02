import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
const BusinessUnitDeepDivePage = lazy(() => import('./pages/BusinessUnitDeepDivePage'))
const GroupWideAnalyticsPage = lazy(() => import('./pages/GroupWideAnalyticsPage'))
const MetricsLibraryPage = lazy(() => import('./pages/MetricsLibraryPage'))
const TestingPage = lazy(() => import('./pages/TestingPage'))
const ComparisonsPage = lazy(() => import('./pages/ComparisonsPage'))
const BusinessUnitsPage = lazy(() => import('./pages/BusinessUnitsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/analytics/unit' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics/group' },
  { label: 'Comparisons', icon: SlidersHorizontal, to: '/comparisons' },
  { label: 'Business Units', icon: Building2, to: '/business-units' },
  { label: 'Metrics Library', icon: Library, to: '/metrics-library' },
  { label: 'Testing', icon: FlaskConical, to: '/testing' },
  { label: 'Reports', icon: Gauge, to: '/reports' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom']
const units = ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT']
const topMetrics = ['Quality Index', 'Timeliness', 'Compliance Rate', 'Innovation Score', 'Customer Satisfaction']
const SETTINGS_STORAGE_KEY = 'enz-group-qa-ui-settings'
const defaultUiSettings = {
  emailAlerts: true,
  pushAlerts: false,
  compactTables: false,
  autoRefresh: true,
  refreshInterval: '30s',
}

function App() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [selectedUnits, setSelectedUnits] = useState([units[0], units[2], units[4]])
  const [metric, setMetric] = useState('Quality Index')
  const [unitMenuOpen, setUnitMenuOpen] = useState(false)
  const [uiSettings, setUiSettings] = useState(defaultUiSettings)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (!raw) return
      setUiSettings({ ...defaultUiSettings, ...JSON.parse(raw) })
    } catch {
      setUiSettings(defaultUiSettings)
    }
  }, [])

  const saveUiSettings = (nextSettings) => {
    setUiSettings(nextSettings)
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
  }

  const isNavItemActive = (item) => {
    if (item.label === 'Dashboard') return location.pathname === '/analytics/unit' || location.pathname === '/'
    if (item.label === 'Analytics') return location.pathname === '/analytics/group'
    if (item.label === 'Comparisons') return location.pathname.startsWith('/comparisons')
    if (item.label === 'Business Units') return location.pathname.startsWith('/business-units')
    if (item.label === 'Metrics Library') return location.pathname.startsWith('/metrics-library')
    if (item.label === 'Testing') return location.pathname.startsWith('/testing')
    if (item.label === 'Reports') return location.pathname.startsWith('/reports')
    if (item.label === 'Settings') return location.pathname.startsWith('/settings')
    return false
  }

  const isDeepDiveRoute = location.pathname === '/analytics/unit'
  const isGroupRoute = location.pathname === '/analytics/group'

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
              const isActive = isNavItemActive(item)
              const ItemTag = item.to ? Link : 'button'
              return (
                <ItemTag
                  key={item.label}
                  to={item.to}
                  type={item.to ? undefined : 'button'}
                  className={[
                    'group flex h-11 w-full items-center rounded-xl border px-3 text-sm transition-all',
                    isActive
                      ? 'border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/15 text-[var(--text-primary)] shadow-[var(--depth-1)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                    collapsed ? 'justify-center' : 'justify-start gap-3',
                  ].join(' ')}
                >
                  <Icon size={18} className={isActive ? 'text-[var(--accent-teal)]' : ''} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </ItemTag>
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
                  {topMetrics.map((item) => (
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
            {location.pathname.startsWith('/analytics') && (
              <section className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-[var(--depth-1)]">
                <Link
                  to="/analytics/unit"
                  className={[
                    'rounded-lg px-3 py-2 text-xs font-medium transition',
                    isDeepDiveRoute
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  Single Unit Deep Dive
                </Link>
                <Link
                  to="/analytics/group"
                  className={[
                    'rounded-lg px-3 py-2 text-xs font-medium transition',
                    isGroupRoute
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  Group-Wide Analytics
                </Link>
              </section>
            )}

            <Suspense
              fallback={(
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-sm text-[var(--text-secondary)] shadow-[var(--depth-1)]">
                  Loading page...
                </div>
              )}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/analytics/unit" replace />} />
                <Route
                  path="/analytics/unit"
                  element={<BusinessUnitDeepDivePage selectedUnits={selectedUnits} metric={metric} dateRange={dateRange} compactTables={uiSettings.compactTables} />}
                />
                <Route
                  path="/analytics/group"
                  element={<GroupWideAnalyticsPage selectedUnits={selectedUnits} metric={metric} dateRange={dateRange} compactTables={uiSettings.compactTables} />}
                />
                <Route
                  path="/comparisons"
                  element={<ComparisonsPage selectedUnits={selectedUnits} metric={metric} dateRange={dateRange} compactTables={uiSettings.compactTables} />}
                />
                <Route
                  path="/business-units"
                  element={<BusinessUnitsPage selectedUnits={selectedUnits} compactTables={uiSettings.compactTables} />}
                />
                <Route path="/metrics-library" element={<MetricsLibraryPage />} />
                <Route path="/testing" element={<TestingPage />} />
                <Route
                  path="/reports"
                  element={<ReportsPage dateRange={dateRange} compactTables={uiSettings.compactTables} autoRefresh={uiSettings.autoRefresh} refreshInterval={uiSettings.refreshInterval} />}
                />
                <Route
                  path="/settings"
                  element={<SettingsPage settings={uiSettings} onChange={setUiSettings} onSave={saveUiSettings} />}
                />
                <Route path="*" element={<Navigate to="/analytics/unit" replace />} />
              </Routes>
            </Suspense>
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
                const isActive = isNavItemActive(item)
                const ItemTag = item.to ? Link : 'button'
                return (
                  <ItemTag
                    key={item.label}
                    to={item.to}
                    type={item.to ? undefined : 'button'}
                    className={[
                      'flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-sm transition-all',
                      isActive
                        ? 'border-[var(--brand-primary)]/60 bg-[var(--brand-primary)]/15 text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    <Icon size={18} className={isActive ? 'text-[var(--accent-teal)]' : ''} />
                    {item.label}
                  </ItemTag>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = isNavItemActive(item)
            const ItemTag = item.to ? Link : 'button'
            return (
              <ItemTag
                key={item.label}
                to={item.to}
                type={item.to ? undefined : 'button'}
                className={[
                  'flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] transition',
                  isActive
                    ? 'bg-[var(--brand-primary)]/15 text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <Icon size={16} className={isActive ? 'text-[var(--accent-teal)]' : ''} />
                <span className="truncate">{item.label}</span>
              </ItemTag>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
