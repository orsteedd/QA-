import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, FlaskConical, Play, Sparkles, XCircle } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const methodTabs = ['Automated Tests', 'Manual Audits', 'Customer Feedback', 'Compliance Checks']

const testResults = [
  { unit: 'Education Consultation Services', pass: 91, fail: 6, warning: 3 },
  { unit: 'No. 1 Malatang', pass: 86, fail: 9, warning: 5 },
  { unit: 'Captura', pass: 94, fail: 4, warning: 2 },
  { unit: 'Service Processing', pass: 82, fail: 12, warning: 6 },
  { unit: 'IT', pass: 89, fail: 7, warning: 4 },
]

const timelineItems = [
  {
    id: 'TST-2109',
    title: 'Nightly API regression suite',
    method: 'Automated Tests',
    unit: 'IT',
    date: 'Today, 09:12',
    status: 'Pass',
    impact: 'Timeliness +8%',
  },
  {
    id: 'TST-2108',
    title: 'Store operation compliance audit',
    method: 'Compliance Checks',
    unit: 'No. 1 Malatang',
    date: 'Today, 07:44',
    status: 'Warning',
    impact: 'Compliance +3%',
  },
  {
    id: 'TST-2106',
    title: 'Consultation quality checklist',
    method: 'Manual Audits',
    unit: 'Education Consultation Services',
    date: 'Yesterday, 16:20',
    status: 'Pass',
    impact: 'Quality Index +4%',
  },
  {
    id: 'TST-2104',
    title: 'Customer sentiment anomaly review',
    method: 'Customer Feedback',
    unit: 'Captura',
    date: 'Yesterday, 13:58',
    status: 'Fail',
    impact: 'CSAT -2%',
  },
]

const wizardSteps = ['Method', 'Scope', 'Configuration', 'Review']
const WIZARD_DRAFT_KEY = 'enz-group-qa-testing-wizard-draft'
const defaultWizardForm = {
  method: methodTabs[0],
  units: ['IT'],
  schedule: 'Run now',
  notes: '',
}

function statusClasses(status) {
  if (status === 'Pass') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  if (status === 'Fail') return 'bg-red-500/15 text-red-300 border-red-500/30'
  return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
}

function loadWizardDraft() {
  if (typeof window === 'undefined') {
    return { form: defaultWizardForm, step: 0 }
  }

  try {
    const raw = window.localStorage.getItem(WIZARD_DRAFT_KEY)
    if (!raw) return { form: defaultWizardForm, step: 0 }

    const parsed = JSON.parse(raw)
    return {
      form: {
        ...defaultWizardForm,
        ...(parsed?.form ?? {}),
      },
      step: Number.isInteger(parsed?.step) ? Math.min(Math.max(parsed.step, 0), wizardSteps.length - 1) : 0,
    }
  } catch {
    return { form: defaultWizardForm, step: 0 }
  }
}

function TestingPage() {
  const initialDraft = loadWizardDraft()
  const [activeMethod, setActiveMethod] = useState(methodTabs[0])
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(initialDraft.step)
  const [form, setForm] = useState(initialDraft.form)

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      WIZARD_DRAFT_KEY,
      JSON.stringify({
        form,
        step: wizardStep,
      }),
    )
  }, [form, wizardStep])

  const filteredTimeline = useMemo(() => {
    return timelineItems.filter((item) => item.method === activeMethod)
  }, [activeMethod])

  const openWizard = () => setIsWizardOpen(true)

  const closeWizard = () => setIsWizardOpen(false)

  const handleStartTest = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(WIZARD_DRAFT_KEY)
    }

    setForm(defaultWizardForm)
    setWizardStep(0)
    setIsWizardOpen(false)
  }

  const toggleUnit = (unit) => {
    setForm((prev) => {
      const exists = prev.units.includes(unit)
      return {
        ...prev,
        units: exists ? prev.units.filter((item) => item !== unit) : [...prev.units, unit],
      }
    })
  }

  const nextStep = () => setWizardStep((prev) => Math.min(prev + 1, wizardSteps.length - 1))
  const previousStep = () => setWizardStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">QA Operations</p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Testing</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Run quality programs and monitor outcomes across all business units.</p>
          </div>
          <button
            type="button"
            onClick={openWizard}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <Play size={14} /> Run New Test
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {methodTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveMethod(tab)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                activeMethod === tab
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Test Results Dashboard</h3>
              <span className="rounded-full bg-[var(--accent-teal)]/15 px-2 py-1 text-xs text-[var(--accent-teal)]">{activeMethod}</span>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testResults} barCategoryGap={18}>
                  <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="unit" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} interval={0} angle={-14} textAnchor="end" height={70} />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="pass" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="warning" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="fail" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">Pass: Stable across most units</div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">Warnings: Concentrated in Service Processing</div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">Failures: Highest in No. 1 Malatang</div>
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Recent Test Timeline</h3>
              <CalendarClock size={14} className="text-[var(--accent-teal)]" />
            </div>

            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="relative rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{item.id} • {item.date}</p>
                      <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.unit}</p>
                    </div>
                    <span className={['rounded-full border px-2 py-1 text-[11px] font-medium', statusClasses(item.status)].join(' ')}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--accent-teal)]">Impact: {item.impact}</p>
                </div>
              ))}

              {filteredTimeline.length === 0 && (
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-muted)]">
                  No recent timeline records for this method.
                </div>
              )}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--accent-teal)]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">KPI Impact Visualization</h3>
            </div>
            <div className="rounded-lg border border-[var(--accent-teal)]/30 bg-[var(--accent-teal)]/10 p-3">
              <p className="text-xs text-[var(--text-secondary)]">Most recent completed test</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">This test improved Timeliness by +8%</p>
            </div>
            <div className="mt-3 grid gap-2">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                <p className="text-xs text-[var(--text-muted)]">Quality Index</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-emerald-300"><CheckCircle2 size={14} /> +4%</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                <p className="text-xs text-[var(--text-muted)]">Compliance Rate</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-amber-300"><FlaskConical size={14} /> +1%</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
                <p className="text-xs text-[var(--text-muted)]">Issue Escape Rate</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-red-300"><XCircle size={14} /> -2%</p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Status Legend</h3>
            <div className="mt-3 space-y-2 text-xs">
              <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-emerald-300">Pass</p>
              <p className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-1 text-amber-300">Warning</p>
              <p className="inline-flex rounded-full border border-red-500/30 bg-red-500/15 px-2 py-1 text-red-300">Fail</p>
            </div>
          </article>
        </aside>
      </section>

      {isWizardOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close test wizard" onClick={closeWizard} />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-2)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Run New Test</h3>
                <p className="text-sm text-[var(--text-secondary)]">Step {wizardStep + 1} of {wizardSteps.length}: {wizardSteps[wizardStep]}</p>
              </div>
              <button type="button" onClick={closeWizard} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-[var(--text-secondary)]">
                Close
              </button>
            </div>

            <div className="mb-3 flex gap-1.5">
              {wizardSteps.map((step, index) => (
                <div
                  key={step}
                  className={[
                    'h-1.5 flex-1 rounded-full',
                    index <= wizardStep ? 'bg-[var(--accent-teal)]' : 'bg-[var(--bg-elevated)]',
                  ].join(' ')}
                />
              ))}
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
              {wizardStep === 0 && (
                <div>
                  <p className="mb-2 text-xs text-[var(--text-muted)]">Testing Method</p>
                  <div className="flex flex-wrap gap-2">
                    {methodTabs.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, method }))}
                        className={[
                          'rounded-full px-3 py-1.5 text-xs transition',
                          form.method === method
                            ? 'bg-[var(--brand-primary)] text-white'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]',
                        ].join(' ')}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 1 && (
                <div>
                  <p className="mb-2 text-xs text-[var(--text-muted)]">Select Business Units</p>
                  <div className="flex flex-wrap gap-2">
                    {testResults.map((item) => {
                      const selected = form.units.includes(item.unit)
                      return (
                        <button
                          key={item.unit}
                          type="button"
                          onClick={() => toggleUnit(item.unit)}
                          className={[
                            'rounded-full border px-3 py-1.5 text-xs transition',
                            selected
                              ? 'border-transparent bg-[var(--brand-primary)] text-white'
                              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]',
                          ].join(' ')}
                        >
                          {item.unit}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-[var(--text-muted)]">
                    Schedule
                    <select
                      value={form.schedule}
                      onChange={(event) => setForm((prev) => ({ ...prev, schedule: event.target.value }))}
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                    >
                      <option>Run now</option>
                      <option>Tonight 10:00 PM</option>
                      <option>Tomorrow 08:00 AM</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-[var(--text-muted)] sm:col-span-2">
                    Notes
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                      placeholder="Optional execution notes..."
                    />
                  </label>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <p><span className="text-[var(--text-muted)]">Method:</span> {form.method}</p>
                  <p><span className="text-[var(--text-muted)]">Units:</span> {form.units.length ? form.units.join(', ') : 'None selected'}</p>
                  <p><span className="text-[var(--text-muted)]">Schedule:</span> {form.schedule}</p>
                  <p><span className="text-[var(--text-muted)]">Notes:</span> {form.notes || 'No notes'}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={wizardStep === 0}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)] disabled:opacity-50"
              >
                Back
              </button>

              {wizardStep < wizardSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartTest}
                  className="rounded-lg bg-[var(--accent-teal)] px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  Start Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestingPage
