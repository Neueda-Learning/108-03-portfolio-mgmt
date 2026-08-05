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

const buildYearSeries = (monthlySeries) => {
  if (!monthlySeries.length) {
    return []
  }

  const first = monthlySeries[0]
  const latest = monthlySeries[monthlySeries.length - 1]
  const year = latest.date.getFullYear()

  const valueDeltas = []
  const investedDeltas = []
  for (let index = 1; index < monthlySeries.length; index += 1) {
    valueDeltas.push(monthlySeries[index].value - monthlySeries[index - 1].value)
    investedDeltas.push(monthlySeries[index].invested - monthlySeries[index - 1].invested)
  }

  const avgValueDelta = valueDeltas.length
    ? valueDeltas.reduce((total, current) => total + current, 0) / valueDeltas.length
    : 0
  const avgInvestedDelta = investedDeltas.length
    ? investedDeltas.reduce((total, current) => total + current, 0) / investedDeltas.length
    : 0

  const seriesByMonth = new Map(monthlySeries.map((point) => [point.date.getMonth(), point]))
  const yearSeries = []

  for (let month = 0; month < 12; month += 1) {
    const existing = seriesByMonth.get(month)
    if (existing) {
      yearSeries.push(existing)
      continue
    }

    const prevPoint = yearSeries[yearSeries.length - 1] || first
    const projected = {
      date: new Date(year, month, 1),
      value: round(prevPoint.value + avgValueDelta),
      invested: round(prevPoint.invested + avgInvestedDelta),
      allocation: latest.allocation,
    }

    yearSeries.push(projected)
  }

  return yearSeries
}

const buildWeeklySeries = (monthlySeries) => {
  if (!monthlySeries.length) {
    return []
  }

  const latest = monthlySeries[monthlySeries.length - 1]
  const previous = monthlySeries[Math.max(monthlySeries.length - 2, 0)] || latest
  const valueSlope = (latest.value - previous.value) / 30
  const investedSlope = (latest.invested - previous.invested) / 30

  // Find Monday of the current week
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon ... 6=Sat
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = addDays(today, -daysToMonday)

  // Project value back to Monday
  const mondayValue = latest.value - valueSlope * daysToMonday
  const mondayInvested = latest.invested - investedSlope * daysToMonday

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index)
    const wave = Math.sin(index / 2.2) * Math.max(8, Math.abs(valueSlope) * 0.8)

    return {
      date,
      value: round(mondayValue + valueSlope * index + wave),
      invested: round(mondayInvested + investedSlope * index),
      allocation: latest.allocation,
    }
  })
}

const buildMonthSeries = (monthlySeries) => {
  if (!monthlySeries.length) {
    return []
  }

  const latest = monthlySeries[monthlySeries.length - 1]
  const previous = monthlySeries[Math.max(monthlySeries.length - 2, 0)] || latest
  const valueSlope = (latest.value - previous.value) / 30
  const investedSlope = (latest.invested - previous.invested) / 30

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysFromFirst = today.getDate() - 1

  // Project value back to the 1st of the month
  const firstValue = latest.value - valueSlope * daysFromFirst
  const firstInvested = latest.invested - investedSlope * daysFromFirst

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = addDays(firstOfMonth, index)
    const wave = Math.sin(index / 2.2) * Math.max(8, Math.abs(valueSlope) * 0.8)

    return {
      date,
      value: round(firstValue + valueSlope * index + wave),
      invested: round(firstInvested + investedSlope * index),
      allocation: latest.allocation,
    }
  })
}

const formatLabel = (date, range) => {
  if (range === '1W') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  if (range === '1M') {
    return date.toLocaleDateString('en-US', { day: 'numeric' })
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
      return buildWeeklySeries(monthlySeries)
    }

    if (selectedRange === '1M') {
      return buildMonthSeries(monthlySeries)
    }

    return buildYearSeries(monthlySeries)
  }, [monthlySeries, selectedRange])

  const xAxisTicks = useMemo(() => {
    if (selectedRange !== '1M') {
      return undefined
    }

    const tickDays = new Set([1, 5, 10, 15, 20, 25])
    const ticks = filteredHistory
      .filter((point, index) => {
        const day = point.date.getDate()
        const monthLastDay = new Date(point.date.getFullYear(), point.date.getMonth() + 1, 0).getDate()
        const isLastPoint = index === filteredHistory.length - 1
        return tickDays.has(day) || day === monthLastDay || isLastPoint
      })
      .map((point) => formatLabel(point.date, '1M'))

    return [...new Set(ticks)]
  }, [filteredHistory, selectedRange])

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
          <PortfolioChart chartData={chartData} xAxisTicks={xAxisTicks} />
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

