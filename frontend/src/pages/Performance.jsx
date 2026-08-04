import { useContext, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioChart from '../dashboard/PortfolioChart'
import PerformanceSummary from '../performance/PerformanceSummary'
import { getPortfolioDataForUser } from '../data/portfolioData'

const RANGE_OPTIONS = ['1W', '1M', '1Y']
const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const round = (value) => Math.round(Number(value) || 0)

const toMonthlySeries = (points) => {
  const year = new Date().getFullYear()

  return points
    .map((point, index) => {
      const monthKey = String(point.data || '').slice(0, 3)
      const month = MONTH_INDEX[monthKey]
      const date = Number.isInteger(month) ? new Date(year, month, 1) : new Date(year, index, 1)

      return {
        date,
        value: Number(point.value) || 0,
        invested: Number(point.invested ?? point.value) || 0,
        allocation: point.allocation,
      }
    })
    .sort((a, b) => a.date - b.date)
}

const buildDailySeries = (monthlySeries, days) => {
  if (!monthlySeries.length) {
    return []
  }

  const latest = monthlySeries[monthlySeries.length - 1]
  const previous = monthlySeries[Math.max(monthlySeries.length - 2, 0)] || latest
  const latestDate = new Date()
  const valueSlope = (latest.value - previous.value) / 30
  const investedSlope = (latest.invested - previous.invested) / 30

  return Array.from({ length: days }, (_, index) => {
    const offset = days - 1 - index
    const date = addDays(latestDate, -offset)
    const wave = Math.sin(index / 2.2) * Math.max(8, Math.abs(valueSlope) * 0.8)
    const value = latest.value - valueSlope * offset + wave
    const invested = latest.invested - investedSlope * offset

    return {
      date,
      value: round(value),
      invested: round(invested),
      allocation: latest.allocation,
    }
  })
}

const formatLabel = (date, range) => {
  if (range === '1W') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  if (range === '1M') {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
  }

  return date.toLocaleDateString('en-US', { month: 'short' })
}

const Performance = () => {
  const { selectedUser } = useContext(UserContext)
  const [selectedRange, setSelectedRange] = useState('1Y')
  const [isUpdating, setIsUpdating] = useState(false)

  const userPortfolio = useMemo(() => {
    return getPortfolioDataForUser(selectedUser?.id)
  }, [selectedUser?.id])

  const monthlySeries = useMemo(() => {
    return toMonthlySeries(userPortfolio.performanceData)
  }, [userPortfolio.performanceData])

  const fallbackAllocationData = userPortfolio.allocationData

  const filteredHistory = useMemo(() => {
    if (selectedRange === '1W') {
      return buildDailySeries(monthlySeries, 7)
    }

    if (selectedRange === '1M') {
      return buildDailySeries(monthlySeries, 30)
    }

    return monthlySeries.slice(-12)
  }, [monthlySeries, selectedRange])

  const chartData = useMemo(() => {
    return filteredHistory.map((point) => ({
      date: formatLabel(point.date, selectedRange),
      value: point.value,
    }))
  }, [filteredHistory, selectedRange])

  const allocationData = useMemo(() => {
    const latest = filteredHistory[filteredHistory.length - 1]
    if (latest?.allocation) {
      return Object.entries(latest.allocation).map(([name, value]) => ({
        name,
        value,
      }))
    }

    // Fallback keeps dashboard allocation when range data has no allocation snapshot.
    return fallbackAllocationData
  }, [fallbackAllocationData, filteredHistory])

  const summary = useMemo(() => {
    const first = filteredHistory[0]
    const last = filteredHistory[filteredHistory.length - 1]

    if (!first || !last) {
      return {
        invested: 0,
        currentValue: 0,
        profitLoss: 0,
        profitLossPct: 0,
      }
    }

    const invested = first.invested ?? first.value
    const currentValue = last.currentValue ?? last.value
    const profitLoss = currentValue - invested
    const profitLossPct = invested === 0 ? 0 : (profitLoss / invested) * 100

    return {
      invested,
      currentValue,
      profitLoss,
      profitLossPct,
    }
  }, [filteredHistory])

  const handleRangeChange = (range) => {
    if (range === selectedRange) {
      return
    }

    setIsUpdating(true)
    setSelectedRange(range)

    setTimeout(() => {
      setIsUpdating(false)
    }, 220)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance Analytics</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track growth, allocation and returns by time range.</p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          {RANGE_OPTIONS.map((range) => {
            const selected = selectedRange === range

            return (
              <button
                key={range}
                type="button"
                onClick={() => handleRangeChange(range)}
                className={[
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm',
                  selected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700',
                ].join(' ')}
              >
                {range}
              </button>
            )
          })}
        </div>
      </section>

      <PerformanceSummary
        invested={summary.invested}
        currentValue={summary.currentValue}
        profitLoss={summary.profitLoss}
        profitLossPct={summary.profitLossPct}
        isUpdating={isUpdating}
      />

      <section
        className={[
          'grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]',
          'transition-opacity duration-200',
          isUpdating ? 'opacity-60' : 'opacity-100',
        ].join(' ')}
      >
        {isUpdating ? (
          <div className="h-[340px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
        ) : (
          <PortfolioChart chartData={chartData} />
        )}

        {isUpdating ? (
          <div className="h-[340px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
        ) : (
          <AssetAllocationChart data={allocationData} />
        )}
      </section>
    </div>
  )
}

export default Performance

