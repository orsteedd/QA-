function DrilldownModal({ open, title, subtitle, columns, rows, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close drill-down modal"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-2)]">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>

        <div className="max-h-[62vh] overflow-auto rounded-lg border border-[var(--border-subtle)]">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`row-${index}`} className="border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${index}-${cellIndex}`} className="px-3 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DrilldownModal
