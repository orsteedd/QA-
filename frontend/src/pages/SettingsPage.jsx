import { useEffect, useState } from 'react'
import { Save, ShieldCheck } from 'lucide-react'

const SETTINGS_STORAGE_KEY = 'enz-group-qa-ui-settings'

const defaultSettings = {
  emailAlerts: true,
  pushAlerts: false,
  compactTables: false,
  autoRefresh: true,
  refreshInterval: '30s',
}

function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (!raw) return
      setSettings({ ...defaultSettings, ...JSON.parse(raw) })
    } catch {
      setSettings(defaultSettings)
    }
  }, [])

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--depth-1)]">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Settings</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">Workspace Preferences</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Configure frontend behavior and notification preferences.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Notifications</h3>

          <button type="button" onClick={() => toggle('emailAlerts')} className="setting-row">
            <span>Email Alerts</span>
            <span className={settings.emailAlerts ? 'setting-on' : 'setting-off'}>{settings.emailAlerts ? 'On' : 'Off'}</span>
          </button>

          <button type="button" onClick={() => toggle('pushAlerts')} className="setting-row">
            <span>Push Alerts</span>
            <span className={settings.pushAlerts ? 'setting-on' : 'setting-off'}>{settings.pushAlerts ? 'On' : 'Off'}</span>
          </button>
        </article>

        <article className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Display & Refresh</h3>

          <button type="button" onClick={() => toggle('compactTables')} className="setting-row">
            <span>Compact Tables</span>
            <span className={settings.compactTables ? 'setting-on' : 'setting-off'}>{settings.compactTables ? 'On' : 'Off'}</span>
          </button>

          <button type="button" onClick={() => toggle('autoRefresh')} className="setting-row">
            <span>Auto Refresh</span>
            <span className={settings.autoRefresh ? 'setting-on' : 'setting-off'}>{settings.autoRefresh ? 'On' : 'Off'}</span>
          </button>

          <label className="space-y-1 text-xs text-[var(--text-muted)]">
            Refresh Interval
            <select
              value={settings.refreshInterval}
              onChange={(event) => setSettings((prev) => ({ ...prev, refreshInterval: event.target.value }))}
              className="control-select w-full"
            >
              <option value="15s">15s</option>
              <option value="30s">30s</option>
              <option value="60s">60s</option>
            </select>
          </label>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--depth-1)]">
        <p className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]"><ShieldCheck size={14} className="text-[var(--accent-teal)]" /> Settings are saved in local storage for this browser.</p>
        <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white">
          <Save size={12} /> Save Preferences
        </button>
      </section>

      {saved && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          Preferences saved successfully.
        </p>
      )}
    </div>
  )
}

export default SettingsPage
