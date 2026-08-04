import React from 'react'
import ThemeSelector from '../settings/ThemeSelector'

const Settings = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          Appearance
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Theme</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Choose how WealthMate looks. Your preference is saved automatically.
        </p>
      </header>

      <div className="mt-5">
        <ThemeSelector />
      </div>
    </section>
  )
}

export default Settings
