import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Filter } from 'lucide-react'

const units = ['Education Consultation Services', 'No. 1 Malatang', 'Captura', 'Service Processing', 'IT']
const metrics = ['Quality Index', 'Timeliness', 'Compliance Rate', 'Innovation Score', 'Customer Satisfaction']

const metricValues = {
  'Quality Index': {
    'Education Consultation Services': 92,
    'No. 1 Malatang': 88,
    Captura: 95,
    'Service Processing': 84,
    IT: 91,
  },
  Timeliness: {
    'Education Consultation Services': 93,
    'No. 1 Malatang': 89,
    Captura: 96,
    'Service Processing': 85,
    IT: 92,
  },
  'Compliance Rate': {
    'Education Consultation Services': 97,
    'No. 1 Malatang': 93,
    Captura: 98,
    'Service Processing': 90,
    IT: 95,
  },
  'Innovation Score': {
    'Education Consultation Services': 86,
    'No. 1 Malatang': 82,
    Captura: 91,
    'Service Processing': 79,
    IT: 88,
  },
  'Customer Satisfaction': {
    'Education Consultation Services': 94,
    'No. 1 Malatang': 90,
    Captura: 95,
    'Service Processing': 87,
    IT: 92,
  },
}

function ComparisonsPage({ selectedUnits = [], metric, dateRange = 'Last 30 days', compactTables = false }) {
  const availableUnits = selectedUnits.length > 0 ? selectedUnits : units
  const [leftUnit, setLeftUnit] = useState(availableUnits[0])
  const [rightUnit, setRightUnit] = useState(availableUnits[1] ?? availableUnits[0])
  const [selectedMetrics, setSelectedMetrics] = useState(() => (metric && metrics.includes(metric) ? [metric, ...metrics.filter((item) => item !== metric)].slice(0, 3) : metrics.slice(0, 3)))

  useEffect(() => {
    setLeftUnit((prev) => (availableUnits.includes(prev) ? prev : availableUnits[0]))
    setRightUnit((prev) => {
      if (availableUnits.includes(prev)) return prev
      return availableUnits[1] ?? availableUnits[0]
    })
  }, [availableUnits])

  useEffect(() => {
    if (!metric || !metrics.includes(metric)) return
    setSelectedMetrics((prev) => {
      const next = [metric, ...prev.filter((item) => item !== metric)]
      return next.slice(0, 3)
    })
  }, [metric])

  const toggleMetric = (metric) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev
        return prev.filter((item) => item !== metric)
      }
      return [...prev, metric]
    })
  }

  const comparisonRows = useMemo(() => {
    return selectedMetrics.map((metric) => {
      const left = metricValues[metric][leftUnit]
      const right = metricValues[metric][rightUnit]
      const diff = Number((left - right).toFixed(1))
      return {
        metric,
        left,
        right,
        diff,
      }
    })
  }, [leftUnit, rightUnit, selectedMetrics])

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Comparisons</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Cross-Unit Comparison</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Compare two business units on selected active metrics ({dateRange}).</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-xs text-[var(--text-muted)]">
            Left Unit
            <select value={leftUnit} onChange={(event) => setLeftUnit(event.target.value)} className="control-select w-full">
              {availableUnits.map((unit) => (
                <option key={unit}>{unit}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-xs text-[var(--text-muted)]">
            Right Unit
            <select value={rightUnit} onChange={(event) => setRightUnit(event.target.value)} className="control-select w-full">
              {availableUnits.map((unit) => (
                <option key={unit}>{unit}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {metrics.map((metric) => {
            const selected = selectedMetrics.includes(metric)
            return (
              <button
                key={metric}
                type="button"
                onClick={() => toggleMetric(metric)}
                className={[
                  'rounded-full px-3 py-1.5 text-xs transition',
                  selected
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {metric}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Comparison Table</h3>
          <Filter size={14} className="text-[var(--accent-teal)]" />
        </div>
        <div className="overflow-auto rounded-lg border border-[var(--border-subtle)]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>Metric</th>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{leftUnit}</th>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{rightUnit}</th>
                <th className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>Delta</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <td className={compactTables ? 'px-3 py-1.5 font-medium text-[var(--text-primary)]' : 'px-3 py-2 font-medium text-[var(--text-primary)]'}>{row.metric}</td>
                  <td className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{row.left}%</td>
                  <td className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>{row.right}%</td>
                  <td className={compactTables ? 'px-3 py-1.5' : 'px-3 py-2'}>
                    <span className={[
                      'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                      row.diff >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300',
                    ].join(' ')}>
                      {row.diff >= 0 ? '+' : ''}{row.diff}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <p className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-teal)]/15 px-2 py-1 text-xs text-[var(--accent-teal)]">
          <ArrowUpRight size={12} /> Quick Insight: Best overall performer today is Captura.
        </p>
      </section>
    </div>
  )
}

export default ComparisonsPage
