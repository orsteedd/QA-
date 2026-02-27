function KpiTooltip({ definition }) {
  if (!definition) return null

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-56 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)] opacity-0 shadow-[var(--depth-2)] transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      {definition}
    </div>
  )
}

export default KpiTooltip
