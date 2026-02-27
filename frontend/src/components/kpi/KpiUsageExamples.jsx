import {
  KpiMiniDashboardCard,
  KpiProgressRingCard,
  KpiSparklineCard,
} from './index'

function KpiUsageExamples() {
  return (
    <section className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Reusable KPI Components</h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">Drop-in examples for shadcn/ui-style pages</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <KpiProgressRingCard
          name="Compliance Rate"
          value={97.5}
          target="98%"
          unit="%"
          trend="+0.8%"
          color="#22C55E"
          definition="Percentage of audits and controls completed according to policy and deadlines."
        />

        <KpiSparklineCard
          name="Issue Velocity"
          value={42}
          target="45"
          unit=""
          trend="+6.3%"
          color="#14B8A6"
          definition="Rate at which QA issues are discovered and resolved over the selected time window."
          sparkline={[28, 30, 32, 33, 36, 39, 42]}
        />

        <KpiMiniDashboardCard
          name="Captura - Unit Health"
          value={93}
          target="95%"
          unit="%"
          trend="+4.6%"
          color="#1E40AF"
          definition="Combined health index using quality, SLA adherence, customer score, and compliance metrics."
          sparkline={[76, 79, 82, 85, 88, 90, 93]}
          metrics={[
            { name: 'Quality', value: 95, color: '#14B8A6' },
            { name: 'SLA', value: 97, color: '#1E40AF' },
            { name: 'CSAT', value: 92, color: '#38BDF8' },
            { name: 'Comp.', value: 98, color: '#22C55E' },
          ]}
        />
      </div>
    </section>
  )
}

export default KpiUsageExamples
