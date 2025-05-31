const { lineChartMock } = require('./SampleData/LineChartSample')
const { barChartMock } = require('./SampleData/BarChartSample')
const {
  horizontalBarChartMock
} = require('./SampleData/HorizontalBarChartSample')
const { parseISO, format } = require('date-fns')
const { getSummaryContent } = require('./utils/summaryHelpers')
const { getTrackingTypeGroupings } = require('./constants')

function getAggregatedDashboardData(dashboards, transactions, balances) {
  const arr = []

  dashboards.forEach((dashboard) => {
    const chart = dashboard.chart
    const chartType = chart.chartType
    const trackingType = chart.trackingType
    if (chartType === 'line') {
      // TODO: use constants for these  values (line, etc)
      const lineData = aggregatedBalanceLineGraphData(balances)
      const summaryContent = getSummaryContent(lineData, chartType) // TODO: calc summary instead of frontend
      arr.push({ data: lineData, dashboard: dashboard, summaryContent })
    }

    if (chartType === 'bar') {
      const filteredData = transactions.filter(
        (tx) =>
          getTrackingTypeGroupings[trackingType].includes(tx.category) &&
          tx.date
      )
      const barData = aggregatedCategoryBarChartData(filteredData)
      const summaryContent = getSummaryContent(filteredData, chartType) // TODO: calc summary instead of frontend
      arr.push({ data: barData, dashboard: dashboard, summaryContent })
    }

    // if (chartType === 'horizontal-bar') {
    //   const hBarData = aggregatedMoneyFlowGraphData(horizontalBarChartMock, trackingType)
    //   const summaryContent = getSummaryContent(hBarData, chartType) // TODO: calc summary instead of frontend
    //   arr.push({ data: hBarData, dashboard: dashboard, summaryContent })
    // }
  })

  // TODO: sanitize data before sending back to get rid of any sensitive information
  return arr
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
  getAggregatedDashboardData
}
