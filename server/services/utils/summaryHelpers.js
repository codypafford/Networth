const { ChartTypes, TrackingTypes } = require('../constants')
const {
  parse,
  format,
  isSameMonth,
  isSameYear,
  subMonths,
  differenceInMonths
} = require('date-fns')
const { formatInTimeZone } = require('date-fns-tz')
const { isoDateStringFormatter } = require('./dateUtils')

const getLineGraphSummary = (data, additionalSummary) => {
  if (!data || data.length === 0) {
    return {
      header: 'Summary',
      items: ['No data available.']
    }
  }

  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

  const currentValue = sorted[sorted.length - 1].totalBalance

  const latest = sorted[sorted.length - 1]
  const previousMonth = sorted[sorted.length - 2]

  const changeSinceLastMonth = previousMonth
    ? (
        ((latest.totalBalance - previousMonth.totalBalance) /
          previousMonth.totalBalance) *
        100
      ).toFixed(2)
    : null

  const aYearAgo = sorted.find(
    (entry) =>
      differenceInMonths(new Date(latest.date), new Date(entry.date)) >= 12
  )

  const changeSinceLastYear = aYearAgo
    ? (
        ((latest.totalBalance - aYearAgo.totalBalance) /
          aYearAgo.totalBalance) *
        100
      ).toFixed(2)
    : null

  let biggestGain = { delta: -Infinity, date: null }
  let biggestLoss = { delta: Infinity, date: null }

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].totalBalance
    const curr = sorted[i].totalBalance
    const change = ((curr - prev) / prev) * 100
    console.log('comparing: ', sorted[i - 1])
    console.log('with ', sorted[i])
    if (change > biggestGain.delta) {
      biggestGain = {
        delta: change,
        date: sorted[i].date,
        amount: sorted[i].totalBalance - sorted[i-1].totalBalance
      }
    }
    if (change < biggestLoss.delta) {
      biggestLoss = {
        delta: change,
        date: sorted[i].date,
        amount: sorted[i-1].totalBalance - sorted[i].totalBalance
      }
    }
  }

  return {
    header: 'Summary',
    items: [
      `Current: $${Number(currentValue).toLocaleString()}`,
      changeSinceLastMonth !== null
        ? `Change Since Last Month: ${changeSinceLastMonth}%`
        : null,
      changeSinceLastYear !== null
        ? `Change Since Last Year: ${changeSinceLastYear}%`
        : null,
      biggestGain.date
        ? `Biggest Gain: ${biggestGain.delta.toFixed(2)}% in ${format(
            biggestGain.date,
            'MMMM'
          )} - $${biggestGain.amount}`
        : null,
      biggestLoss.date
        ? `Biggest Loss: ${biggestLoss.delta.toFixed(2)}% in ${format(
            biggestLoss.date,
            'MMMM'
          )} - $${biggestLoss.amount}`
        : null
    ].filter(Boolean)
  }
}

function getTopSpendingDay(transactions) {
  const dayTotals = {}

  for (const tx of transactions) {
    const day = isoDateStringFormatter(tx.date, 'EEEE') // e.g., 'Monday'

    if (!dayTotals[day]) dayTotals[day] = 0
    dayTotals[day] += tx.amount
  }

  // Find the day with the max total
  return Object.entries(dayTotals).reduce((topDay, currDay) =>
    currDay[1] > topDay[1] ? currDay : topDay
  )[0] // return just the day name
}

const getBarGraphSummary = (data, additionalSummary) => {
  if (!data || data.length === 0) {
    return {
      header: 'Summary',
      items: ['No data available.']
    }
  }
  const now = new Date()
  const parsed = data

  const sorted = parsed.sort((a, b) => new Date(a.date) - new Date(b.date))
  const topSpendingDay = getTopSpendingDay(sorted)

  const thisMonth = parsed.filter((d) =>
    isSameMonth(isoDateStringFormatter(d.date), now)
  )
  const lastMonth = parsed.filter((d) =>
    isSameMonth(isoDateStringFormatter(d.date), subMonths(now, 1))
  )
  const thisYear = parsed.filter((d) =>
    isSameYear(isoDateStringFormatter(d.date), now)
  )

  const lastMonthSumTilNow = lastMonth
    .filter((x) => {
      const day = parseInt(isoDateStringFormatter(x.date, 'dd'))
      return day <= parseInt(isoDateStringFormatter(new Date(), 'dd'))
    })
    .reduce((sum, curr) => {
      return sum + curr.amount
    }, 0)

  const largestThisMonth = thisMonth.reduce(
    (max, curr) => (curr.amount > (max?.amount ?? 0) ? curr : max),
    null
  )
  const largestLastMonth = lastMonth.reduce(
    (max, curr) => (curr.amount > (max?.amount ?? 0) ? curr : max),
    null
  )

  const freqMap = {}
  thisYear.forEach((d) => {
    freqMap[d.name] = (freqMap[d.name] || 0) + 1
  })
  const mostFrequentName = Object.keys(freqMap).reduce(
    (a, b) => (freqMap[a] > freqMap[b] ? a : b),
    null
  )
  const totalAtMostFrequent = thisYear
    .filter((d) => d.name === mostFrequentName)
    .reduce((sum, d) => sum + d.amount, 0)

  const summary = {
    header: 'Summary',
    items: [
      largestThisMonth
        ? `Largest Expense This Month: $${largestThisMonth.amount} – ${largestThisMonth.name}`
        : null,
      largestLastMonth
        ? `Largest Expense Last Month: $${largestLastMonth.amount} – ${largestLastMonth.name}`
        : null,
      mostFrequentName
        ? `Most Frequented This Year: ${mostFrequentName} - ${freqMap[mostFrequentName]} times`
        : null,
      mostFrequentName
        ? `Total Spent at ${mostFrequentName} this year: $${totalAtMostFrequent.toFixed(
            2
          )}`
        : null,
      lastMonthSumTilNow > 0
        ? `Last month you already spent $${Number(lastMonthSumTilNow).toLocaleString()} by now`
        : null
    ].filter(Boolean)
  }
  if (additionalSummary) {
    summary.items.push(
      `Date Range: ${format(sorted[0].date, 'MM/dd/yyyy')} - ${format(
        sorted[sorted.length - 1].date,
        'MM/dd/yyyy'
      )}`,
      `Number of transactions: ${sorted.length}`,
      `You tend to spend the most in this category on ${topSpendingDay}`
    )
  }

  return summary
}
const getSummaryContent = (data, chartType, additionalSummary = false) => {
  switch (chartType) {
    case ChartTypes.line:
      return getLineGraphSummary(data, additionalSummary)
    case ChartTypes.bar:
      return getBarGraphSummary(data, additionalSummary)
    default:
      return null
  }
}

module.exports = {
  getSummaryContent
}
