const { lineChartMock } = require('./SampleData/LineChartSample')
const { barChartMock } = require('./SampleData/BarChartSample')
const {
  horizontalBarChartMock
} = require('./SampleData/HorizontalBarChartSample')
const { parseISO, format } = require('date-fns')
const { getSummaryContent } = require('./utils/summaryHelpers')

function getAggregatedDashboardData(dashboards, transactions, balances) {
  const arr = []

  dashboards.forEach((dashboard) => {
    const chart = dashboard.chart
    const chartType = chart.chartType

    if (chartType === 'line') {
      // TODO: Replace lineChartMock with real data if needed
      const lineData = aggregatedBalanceLineGraphData(lineChartMock)
      const summaryContent = getSummaryContent(lineData, chartType) // TODO: calc summary instead of frontend
      // Prevent duplicates by checking if already pushed (optional)
      // if (!arr.some((item) => item.lineGraphFormat)) {
      arr.push({ data: lineData, dashboard: dashboard, summaryContent })
      // }
    }

    if (chartType === 'bar') {
      const barData = aggregatedCategoryBarChartData(barChartMock)
      const summaryContent = getSummaryContent(barData, chartType) // TODO: calc summary instead of frontend
      // if (!arr.some((item) => item.barGraphFormat)) {
      arr.push({ data: barData, dashboard: dashboard, summaryContent })
      // }
    }

    if (chartType === 'horizontal-bar') {
      const hBarData = aggregatedMoneyFlowGraphData(horizontalBarChartMock)
      const summaryContent = getSummaryContent(hBarData, chartType) // TODO: calc summary instead of frontend
      // if (!arr.some((item) => item.horizontalBarGraphFormat)) {
      arr.push({ data: hBarData, dashboard: dashboard, summaryContent })
      // }
    }
  })

  // TODO: sanitize data before sending back to get rid of any sensitive information
  return arr
}

function aggregatedMoneyFlowGraphData(transactions) {
  return transactions.reduce((acc, tx) => {
    const month = format(parseISO(tx.date), 'MMM yyyy')
    const existing = acc.find((entry) => entry.month === month)

    const isInflow = tx.type === 'inflow'
    const key = isInflow ? 'moneyIn' : 'moneyOut'
    const amount = Math.abs(tx.amount)

    if (existing) {
      existing[key] = (existing[key] || 0) + amount
    } else {
      acc.push({
        month,
        [key]: amount,
        [isInflow ? 'moneyOut' : 'moneyIn']: 0
      })
    }

    return acc
  }, [])
}

function aggregatedCategoryBarChartData(transactions) {
  // TODO: faking the filtering
  return transactions
    .filter((tx) =>
      tx.category?.some((cat) =>
        ['Food and Drink', 'Restaurants', 'Fast Food', 'Coffee Shop'].includes(
          cat
        )
      )
    )
    .reduce((acc, tx) => {
      const month = format(parseISO(tx.date), 'MMM')
      const existing = acc.find((entry) => entry.month === month)
      if (existing) {
        existing.amount = parseFloat((existing.amount + tx.amount).toFixed(2))
      } else {
        acc.push({ month, amount: tx.amount })
      }
      return acc
    }, [])
}

// This gets data for the line graph for our LineChart to use
function aggregatedBalanceLineGraphData(balances) {
  const netWorthByMonth = {}

  balances.forEach((account) => {
    account.monthlyBalances.forEach(({ date, balance }) => {
      if (!netWorthByMonth[date]) {
        netWorthByMonth[date] = 0
      }
      netWorthByMonth[date] += balance
    })
  })

  return Object.entries(netWorthByMonth)
    .map(([date, totalBalance]) => ({ date, totalBalance }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

module.exports = {
  getAggregatedDashboardData
}
