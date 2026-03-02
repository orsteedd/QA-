import { useMemo, useState } from 'react'
import { Building2, Search } from 'lucide-react'

const units = [
  { name: 'Education Consultation Services', lead: 'M. Santos', status: 'Healthy', qaScore: 92, openIssues: 7 },
  { name: 'No. 1 Malatang', lead: 'J. Reyes', status: 'Watch', qaScore: 88, openIssues: 12 },
  { name: 'Captura', lead: 'A. Lim', status: 'Healthy', qaScore: 95, openIssues: 5 },
  { name: 'Service Processing', lead: 'R. Cruz', status: 'Critical', qaScore: 84, openIssues: 16 },
  { name: 'IT', lead: 'D. Lopez', status: 'Healthy', qaScore: 91, openIssues: 8 },
]

function BusinessUnitsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(() => {
    return units.filter((unit) => {
      const matchesQuery = unit.name.toLowerCase().includes(query.toLowerCase()) || unit.lead.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || unit.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Business Units</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Unit Directory & Health</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2">
            <Search size={15} className="text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Search by unit or lead..."
            />
          </div>
          <select className="control-select w-full" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>Healthy</option>
            <option>Watch</option>
            <option>Critical</option>
          </select>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((unit) => (
          <article key={unit.name} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{unit.name}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Lead: {unit.lead}</p>
              </div>
              <Building2 size={16} className="text-[var(--accent-teal)]" />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">QA Score</span>
              <span className="font-semibold text-[var(--text-primary)]">{unit.qaScore}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[var(--bg-elevated)]">
              <div className="h-2 rounded-full bg-[var(--brand-primary)]" style={{ width: `${unit.qaScore}%` }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Open Issues</span>
              <span className="font-semibold text-[var(--text-primary)]">{unit.openIssues}</span>
            </div>

            <span className={[
              'mt-3 inline-flex rounded-full px-2 py-1 text-xs',
              unit.status === 'Healthy'
                ? 'bg-emerald-500/15 text-emerald-300'
                : unit.status === 'Watch'
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'bg-red-500/15 text-red-300',
            ].join(' ')}>
              {unit.status}
            </span>
          </article>
        ))}
      </section>
    </div>
  )
}

export default BusinessUnitsPage
