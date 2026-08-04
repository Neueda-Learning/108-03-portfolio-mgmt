import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const options = [
  { key: 'light', label: 'Light', icon: FiSun },
  { key: 'dark', label: 'Dark', icon: FiMoon },
]

function ThemeSelector({ className = '' }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={className}>
      <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:w-auto">
        {options.map((option) => {
          const selected = theme === option.key
          const Icon = option.icon

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTheme(option.key)}
              aria-pressed={selected}
              className={[
                'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:min-w-[128px]',
                'flex items-center justify-center gap-2',
                selected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-transparent text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              <Icon className="text-base" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeSelector
