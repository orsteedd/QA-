function MetricSelector({ options, selected, onToggle }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-[var(--depth-1)]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Dynamic Metric Selector</p>
      <div className="flex flex-wrap gap-2">
        {options.map((metric) => {
          const isActive = selected.includes(metric.id)
          return (
            <button
              key={metric.id}
              type="button"
              onClick={() => onToggle(metric.id)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                isActive
                  ? 'border-transparent text-white shadow-[var(--depth-1)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent-teal)]/60 hover:text-[var(--text-primary)]',
              ].join(' ')}
              style={isActive ? { backgroundColor: metric.color } : undefined}
            >
              {metric.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MetricSelector
