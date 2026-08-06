import { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioChart from '../dashboard/PortfolioChart'
import PerformanceSummary from '../performance/PerformanceSummary'
import { getTimechart } from '../services/portfolioService'
import { getPortfolioDataForUser } from '../data/portfolioData'
import { getAiInsights } from '../services/aiInsightService'

const RANGE_OPTIONS = ['1M', '1Y']
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
  if (range === '1M') {
    return date.toLocaleDateString('en-US', { day: 'numeric' })
  }

  return date.toLocaleDateString('en-US', { month: 'short' })
}

const Performance = () => {
  const { selectedUser } = useContext(UserContext)
  const [selectedRange, setSelectedRange] = useState('1Y')
  const [isUpdating, setIsUpdating] = useState(false)
  const [timechartData, setTimechartData] = useState([])

  useEffect(() => {
    if (!selectedUser?.id) return
    getTimechart(selectedUser.id)
      .then((data) => {
        const parsed = Array.isArray(data)
          ? data.map((p) => ({ date: new Date(p.date), value: Number(p.close) || 0 }))
              .sort((a, b) => a.date - b.date)
          : []
        setTimechartData(parsed)
      })
      .catch((err) => {
        console.error('Failed to load timechart', err)
        setTimechartData([])
      })
  }, [selectedUser?.id])

  const allocationData = getPortfolioDataForUser(selectedUser?.id).allocationData

  const filteredHistory = useMemo(() => {
    if (!timechartData.length) return []
    const today = new Date()

    if (selectedRange === '1M') {
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)
      return timechartData.filter((p) => p.date >= thirtyDaysAgo)
    }

    return timechartData
  }, [timechartData, selectedRange])

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


  const summary = useMemo(() => {
    const first = filteredHistory[0]
    const last = filteredHistory[filteredHistory.length - 1]

    if (!first || !last) {
      return { invested: 0, currentValue: 0, profitLoss: 0, profitLossPct: 0 }
    }

    const invested = first.value
    const currentValue = last.value
    const profitLoss = currentValue - invested
    const profitLossPct = invested === 0 ? 0 : (profitLoss / invested) * 100

    return { invested, currentValue, profitLoss, profitLossPct }
  }, [filteredHistory])

  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!selectedUser?.id) return
    let ignore = false
    setAiLoading(true)
    getAiInsights(selectedUser.id)
      .then((data) => { if (!ignore) setAiInsights(data) })
      .catch(() => { if (!ignore) setAiInsights(null) })
      .finally(() => { if (!ignore) setAiLoading(false) })
    return () => { ignore = true }
  }, [selectedUser?.id])

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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[3fr_2fr]">
      {/* Left: Performance Analytics title + range + chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Performance Analytics</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Track growth and returns by time range.</p>
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
        </div>
        <section
          className={[
            'transition-opacity duration-200',
            isUpdating ? 'opacity-60' : 'opacity-100',
          ].join(' ')}
        >
          {isUpdating ? (
            <div className="h-[340px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
          ) : (
            <PortfolioChart chartData={chartData} xAxisTicks={xAxisTicks} />
          )}
        </section>
      </div>

      {/* Right: AI Summary on top + Recommendations below */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 flex flex-col gap-4">
        {/* AI Summary at top of this box */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950">
          {aiLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-indigo-200" />
              <div className="h-3 w-full animate-pulse rounded bg-indigo-200" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-indigo-200" />
            </div>
          ) : aiInsights?.summary ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">AI Portfolio Summary</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">{aiInsights.summary}</p>
              {aiInsights.disclaimer && (
                <p className="mt-2 text-xs italic text-slate-400 dark:text-slate-500">{aiInsights.disclaimer}</p>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500">AI summary unavailable.</p>
          )}
        </div>

        {/* Recommendations below summary */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Recommendations</p>
          {aiLoading ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : aiInsights?.recommendations?.length > 0 ? (
            <div className="mt-4 space-y-3">
              {aiInsights.recommendations
                .sort((a, b) => a.priority - b.priority)
                .map((rec, i) => {
                  const action = String(rec.action ?? '').toUpperCase()
                  const isBuy = action === 'BUY'
                  const isSell = action === 'SELL'
                  const isHold = action === 'HOLD'
                  // mixed e.g. "BUY|SELL"
                  const isMixed = !isBuy && !isSell && !isHold

                  const cardClass = isBuy
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
                    : isSell
                    ? 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950'
                    : isHold
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'

                  const badgeClass = isBuy
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : isSell
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
                    : isHold
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'

                  const textClass = isBuy
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : isSell
                    ? 'text-rose-900 dark:text-rose-200'
                    : isHold
                    ? 'text-amber-900 dark:text-amber-200'
                    : 'text-blue-900 dark:text-blue-200'

                  return (
                    <div key={i} className={`rounded-xl border p-4 ${cardClass}`}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${badgeClass}`}>
                          {rec.action}
                        </span>
                        {rec.title && (
                          <span className={`text-sm font-semibold ${textClass}`}>{rec.title}</span>
                        )}
                      </div>
                      <p className={`mt-2 text-xs leading-relaxed ${textClass}`}>{rec.detail}</p>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Performance

