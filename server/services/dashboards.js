const { lineChartMock } = require('./SampleData/LineChartSample')
const { barChartMock } = require('./SampleData/BarChartSample')
const {
  horizontalBarChartMock
} = require('./SampleData/HorizontalBarChartSample')
const { parseISO, format } = require('date-fns')
const { getSummaryContent } = require('./utils/summaryHelpers')
const { getTrackingTypeGroupings, ChartTypes } = require('./constants')

// TODO: optimize this. I need to make as many reusable functions as I can out of this especially filteres and such
function getAggregatedDashboardData(dashboards, transactions, balances) {
  const arr = []
  dashboards.forEach((dashboard) => {
    const chart = dashboard.chart
    const chartType = chart.chartType
    const trackingType = chart.trackingType
    let data
    let summaryContent

    if (chartType === ChartTypes.line) {
      data = aggregatedBalanceLineGraphData(balances)
      summaryContent = getSummaryContent(data, chartType)
    }

    if (chartType === ChartTypes.bar) {
      const filteredData = filterCategoryBartChartData(
        transactions,
        trackingType
      )
      data = aggregatedCategoryBarChartData(filteredData)
      summaryContent = getSummaryContent(filteredData, chartType)
    }
    if (data && summaryContent) {
      arr.push({ data, dashboard, summaryContent })
    }
  })
  // TODO: sanitize data before sending back to get rid of any sensitive information
  return arr
}

function filterCategoryBartChartData(transactions, trackingType) {
  return transactions.filter(
    (tx) =>
      getTrackingTypeGroupings[trackingType].includes(tx.category) && tx.date
  )
}

function getSingleChartSummary(dashboard, fetchedData) {
  // TODO: destructure this
  const chartType = dashboard.chart.chartType
  const trackingType = dashboard.chart.trackingType
  let summaryContent
  let data
  if (chartType === ChartTypes.line) {
    data = aggregatedBalanceLineGraphData(fetchedData)
    summaryContent = getSummaryContent(data, chartType, true)
  }

  if (chartType === ChartTypes.bar) {
    const filteredData = filterCategoryBartChartData(fetchedData, trackingType,)
    data = aggregatedCategoryBarChartData(filteredData)
    summaryContent = getSummaryContent(filteredData, chartType, true)
  }
  return { data, dashboard, summaryContent }
}

function aggregatedCategoryBarChartData(transactions) {
  return transactions
    .reduce((acc, tx) => {
      const date = typeof tx.date === 'string' ? parseISO(tx.date) : tx.date
      const monthKey = format(date, 'yyyy-MM') // For sorting
      const monthLabel = format(date, 'MMM') // For display

      const existing = acc.find((entry) => entry.key === monthKey)
      if (existing) {
        existing.amount = parseFloat((existing.amount + tx.amount).toFixed(2))
      } else {
        acc.push({
          key: monthKey,
          month: monthLabel,
          amount: tx.amount,
          category: tx.category
        })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(`${a.key}-01`) - new Date(`${b.key}-01`))
}

// This gets data for the line graph for our LineChart to use
function aggregatedBalanceLineGraphData(balances) {
  return balances
    .map(({ asOfDate, amount }) => ({
      date: asOfDate,
      totalBalance: amount
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// function aggregatedMoneyFlowGraphData(transactions) {
//   return transactions.reduce((acc, tx) => {
//     const month = format(parseISO(tx.date), 'MMM yyyy')
//     const existing = acc.find((entry) => entry.month === month)

//     const isInflow = tx.type === 'inflow'
//     const key = isInflow ? 'moneyIn' : 'moneyOut'
//     const amount = Math.abs(tx.amount)

//     if (existing) {
//       existing[key] = (existing[key] || 0) + amount
//     } else {
//       acc.push({
//         month,
//         [key]: amount,
//         [isInflow ? 'moneyOut' : 'moneyIn']: 0
//       })
//     }

//     return acc
//   }, [])
// }

module.exports = {
  getAggregatedDashboardData,
  getSingleChartSummary
}
