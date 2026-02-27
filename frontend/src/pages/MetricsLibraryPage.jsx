import { useMemo, useState } from 'react'
import { GripVertical, Plus, Search, Sparkles, X } from 'lucide-react'
import {
  KpiGaugeCard,
  KpiProgressRingCard,
  KpiSimpleCard,
  KpiSparklineCard,
} from '../components/kpi'

const businessUnits = ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT']

const initialMetrics = [
  {
    id: 'quality-index',
    name: 'Quality Index',
    description: 'Composite quality score across issue prevention, resolution, and audit completion.',
    unit: '%',
    defaultTarget: '92%',
    active: true,
    color: '#14B8A6',
    trend: '+2.1%',
    value: 90.8,
    sparkline: [78, 81, 83, 85, 86, 89, 91],
    units: ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT'],
  },
  {
    id: 'resolution-sla',
    name: 'Resolution SLA',
    description: 'Percentage of issues resolved within target SLA windows.',
    unit: '%',
    defaultTarget: '95%',
    active: true,
    color: '#1E40AF',
    trend: '+1.3%',
    value: 93.6,
    sparkline: [86, 87, 88, 90, 91, 92, 94],
    units: ['No. 1 Malatang', 'Captura', 'Service Processing', 'IT'],
  },
  {
    id: 'csat-score',
    name: 'Customer Satisfaction',
    description: 'Satisfaction score normalized to percentage for cross-metric comparisons.',
    unit: '%',
    defaultTarget: '94%',
    active: true,
    color: '#38BDF8',
    trend: '+3.2%',
    value: 92,
    sparkline: [84, 85, 87, 89, 90, 91, 92],
    units: ['Education Consultation Services', 'No. 1 Malatang', 'Captura'],
  },
  {
    id: 'innovation-score',
    name: 'Innovation Score',
    description: 'Measures process improvement adoption and QA innovation outcomes.',
    unit: '%',
    defaultTarget: '88%',
    active: false,
    color: '#F59E0B',
    trend: '+4.4%',
    value: 86.4,
    sparkline: [70, 73, 76, 79, 81, 84, 86],
    units: ['IT', 'Captura'],
  },
]

const emptyForm = {
  name: '',
  description: '',
  unit: '%',
  defaultTarget: '',
  color: '#14B8A6',
  units: [],
}

function MetricsLibraryPage() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [search, setSearch] = useState('')
  const [previewId, setPreviewId] = useState(initialMetrics[0].id)
  const [previewVariant, setPreviewVariant] = useState('sparkline')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [dragId, setDragId] = useState(null)

  const filteredMetrics = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return metrics

    return metrics.filter((item) => {
      return (
        item.name.toLowerCase().includes(query)
        || item.description.toLowerCase().includes(query)
        || item.unit.toLowerCase().includes(query)
      )
    })
  }, [metrics, search])

  const previewMetric = useMemo(() => {
    return metrics.find((item) => item.id === previewId) ?? metrics[0]
  }, [metrics, previewId])

  const updateMetric = (id, updater) => {
    setMetrics((prev) => prev.map((metric) => (metric.id === id ? updater(metric) : metric)))
  }

  const handleDragStart = (id) => setDragId(id)
  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return

    setMetrics((prev) => {
      const dragged = prev.find((item) => item.id === dragId)
      if (!dragged) return prev
      const without = prev.filter((item) => item.id !== dragId)
      const index = without.findIndex((item) => item.id === targetId)
      without.splice(index, 0, dragged)
      return without
    })

    setDragId(null)
  }

  const resetModal = () => {
    setForm(emptyForm)
    setIsModalOpen(false)
  }

  const submitNewMetric = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.defaultTarget.trim()) return

    const nextMetric = {
      id: form.name.trim().toLowerCase().replace(/\s+/g, '-'),
      name: form.name.trim(),
      description: form.description.trim() || 'Custom metric added by admin.',
      unit: form.unit.trim() || '%',
      defaultTarget: form.defaultTarget.trim(),
      active: true,
      color: form.color,
      trend: '+0.0%',
      value: 0,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      units: form.units,
    }

    setMetrics((prev) => [nextMetric, ...prev])
    setPreviewId(nextMetric.id)
    resetModal()
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Admin Controls</p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Metrics Library</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Add, remove, reorder, and scope metrics by business unit.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <Plus size={14} /> Add New Metric
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Search metric name, description, or unit..."
            />
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--depth-1)]">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Default Target</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Business Units</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((metric) => (
                <tr
                  key={metric.id}
                  draggable
                  onDragStart={() => handleDragStart(metric.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(metric.id)}
                  onClick={() => setPreviewId(metric.id)}
                  className={[
                    'cursor-pointer border-t border-[var(--border-subtle)] text-[var(--text-secondary)] transition',
                    previewId === metric.id ? 'bg-[var(--bg-elevated)]/80' : 'hover:bg-[var(--bg-elevated)]/50',
                  ].join(' ')}
                >
                  <td className="px-3 py-2">
                    <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs">
                      <GripVertical size={13} />
                      Drag
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-[var(--text-primary)]">{metric.name}</div>
                  </td>
                  <td className="max-w-[320px] px-3 py-2 text-xs leading-relaxed">{metric.description}</td>
                  <td className="px-3 py-2 text-xs">{metric.unit}</td>
                  <td className="px-3 py-2 text-xs">{metric.defaultTarget}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        updateMetric(metric.id, (current) => ({ ...current, active: !current.active }))
                      }}
                      className={[
                        'relative h-6 w-11 rounded-full border transition',
                        metric.active
                          ? 'border-transparent bg-[var(--accent-teal)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition',
                          metric.active ? 'left-6' : 'left-0.5',
                        ].join(' ')}
                      />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      {businessUnits.map((unit) => {
                        const selected = metric.units.includes(unit)
                        return (
                          <button
                            key={`${metric.id}-${unit}`}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              updateMetric(metric.id, (current) => {
                                const hasUnit = current.units.includes(unit)
                                return {
                                  ...current,
                                  units: hasUnit
                                    ? current.units.filter((item) => item !== unit)
                                    : [...current.units, unit],
                                }
                              })
                            }}
                            className={[
                              'rounded-full border px-2 py-1 text-[10px] transition',
                              selected
                                ? 'border-transparent bg-[var(--brand-primary)]/20 text-[var(--text-primary)]'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]',
                            ].join(' ')}
                          >
                            {unit}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="space-y-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)] xl:sticky xl:top-24">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Preview Panel</h3>
            <Sparkles size={14} className="text-[var(--accent-teal)]" />
          </div>

          {previewMetric && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {['simple', 'ring', 'sparkline', 'gauge'].map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setPreviewVariant(variant)}
                    className={[
                      'rounded-full px-2.5 py-1 text-[11px] transition',
                      previewVariant === variant
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    {variant}
                  </button>
                ))}
              </div>

              {previewVariant === 'simple' && (
                <KpiSimpleCard
                  name={previewMetric.name}
                  value={previewMetric.value}
                  target={previewMetric.defaultTarget}
                  unit={previewMetric.unit}
                  trend={previewMetric.trend}
                  color={previewMetric.color}
                  definition={previewMetric.description}
                />
              )}

              {previewVariant === 'ring' && (
                <KpiProgressRingCard
                  name={previewMetric.name}
                  value={previewMetric.value}
                  target={previewMetric.defaultTarget}
                  unit={previewMetric.unit}
                  trend={previewMetric.trend}
                  color={previewMetric.color}
                  definition={previewMetric.description}
                />
              )}

              {previewVariant === 'sparkline' && (
                <KpiSparklineCard
                  name={previewMetric.name}
                  value={previewMetric.value}
                  target={previewMetric.defaultTarget}
                  unit={previewMetric.unit}
                  trend={previewMetric.trend}
                  color={previewMetric.color}
                  definition={previewMetric.description}
                  sparkline={previewMetric.sparkline}
                />
              )}

              {previewVariant === 'gauge' && (
                <KpiGaugeCard
                  name={previewMetric.name}
                  value={previewMetric.value}
                  target={previewMetric.defaultTarget}
                  unit={previewMetric.unit}
                  trend={previewMetric.trend}
                  color={previewMetric.color}
                  definition={previewMetric.description}
                />
              )}

              <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)]">
                Applies to: {previewMetric.units.length ? previewMetric.units.join(', ') : 'No units selected'}
              </div>
            </>
          )}
        </div>
      </aside>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close add metric modal"
            onClick={resetModal}
          />
          <form
            onSubmit={submitNewMetric}
            className="relative z-10 w-full max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-2)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Add New Metric</h3>
                <p className="text-sm text-[var(--text-secondary)]">Create a dynamic metric and assign applicable business units.</p>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-[var(--text-muted)]">
                Metric Name
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="space-y-1 text-xs text-[var(--text-muted)]">
                Unit
                <input
                  value={form.unit}
                  onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="space-y-1 text-xs text-[var(--text-muted)] sm:col-span-2">
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="space-y-1 text-xs text-[var(--text-muted)]">
                Default Target
                <input
                  required
                  value={form.defaultTarget}
                  onChange={(event) => setForm((prev) => ({ ...prev, defaultTarget: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="space-y-1 text-xs text-[var(--text-muted)]">
                Color
                <input
                  type="color"
                  value={form.color}
                  onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                  className="h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2"
                />
              </label>
            </div>

            <div className="mt-3">
              <p className="mb-2 text-xs text-[var(--text-muted)]">Applies To Business Units</p>
              <div className="flex flex-wrap gap-1.5">
                {businessUnits.map((unit) => {
                  const selected = form.units.includes(unit)
                  return (
                    <button
                      key={`form-${unit}`}
                      type="button"
                      onClick={() => {
                        setForm((prev) => {
                          const has = prev.units.includes(unit)
                          return {
                            ...prev,
                            units: has ? prev.units.filter((item) => item !== unit) : [...prev.units, unit],
                          }
                        })
                      }}
                      className={[
                        'rounded-full border px-3 py-1 text-xs transition',
                        selected
                          ? 'border-transparent bg-[var(--brand-primary)] text-white'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]',
                      ].join(' ')}
                    >
                      {unit}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetModal}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white"
              >
                Save Metric
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MetricsLibraryPage
