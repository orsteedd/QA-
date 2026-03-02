import { useMemo, useState } from 'react'
import { Download, FileBarChart2 } from 'lucide-react'

const reports = [
  { id: 'RPT-4021', name: 'Weekly QA Summary', type: 'Analytics', date: '2026-03-01', status: 'Ready' },
  { id: 'RPT-4020', name: 'Unit Comparison Matrix', type: 'Comparisons', date: '2026-02-28', status: 'Ready' },
  { id: 'RPT-4019', name: 'Metrics Change Log', type: 'Metrics', date: '2026-02-27', status: 'Processing' },
  { id: 'RPT-4018', name: 'Testing Outcome Review', type: 'Testing', date: '2026-02-26', status: 'Ready' },
]

function ReportsPage() {
  const [filter, setFilter] = useState('All')

  const rows = useMemo(() => {
    if (filter === 'All') return reports
    return reports.filter((item) => item.status === filter)
  }, [filter])

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Reports</p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Report Center</h2>
          </div>
          <select className="control-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All</option>
            <option>Ready</option>
            <option>Processing</option>
          </select>
        </div>
      </section>

      <section className="overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--depth-1)]">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
            <tr>
              <th className="px-3 py-2">Report ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Generated Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{row.name}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2">
                  <span className={[
                    'rounded-full px-2 py-1 text-xs',
                    row.status === 'Ready' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300',
                  ].join(' ')}>
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    disabled={row.status !== 'Ready'}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-[var(--text-secondary)] disabled:opacity-50"
                  >
                    <Download size={12} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <p className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]"><FileBarChart2 size={14} className="text-[var(--accent-teal)]" /> Reports are currently generated from mock frontend data.</p>
      </section>
    </div>
  )
}

export default ReportsPage
