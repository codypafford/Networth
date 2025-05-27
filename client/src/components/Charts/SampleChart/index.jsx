import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useState } from 'react'
import PropTypes from 'prop-types'

const fakeAccountData = [
  {
    accountId: 'acc1',
    name: 'Checking',
    monthlyBalances: [
      { date: '2024-01-01', balance: 1200 },
      { date: '2024-02-01', balance: 1350 },
      { date: '2024-03-01', balance: 1280 },
      { date: '2024-04-01', balance: 1400 },
      { date: '2024-05-01', balance: 1500 },
      { date: '2024-06-01', balance: 1420 },
      { date: '2024-07-01', balance: 1600 },
      { date: '2024-08-01', balance: 1580 },
      { date: '2024-09-01', balance: 1650 },
      { date: '2024-10-01', balance: 1700 },
      { date: '2024-11-01', balance: 1625 },
      { date: '2024-12-01', balance: 1800 }
    ]
  },
  {
    accountId: 'acc2',
    name: 'Savings',
    monthlyBalances: [
      { date: '2024-01-01', balance: 3000 },
      { date: '2024-02-01', balance: 3050 },
      { date: '2024-03-01', balance: 3100 },
      { date: '2024-04-01', balance: 3200 },
      { date: '2024-05-01', balance: 3300 },
      { date: '2024-06-01', balance: 3350 },
      { date: '2024-07-01', balance: 3400 },
      { date: '2024-08-01', balance: 3450 },
      { date: '2024-09-01', balance: 3500 },
      { date: '2024-10-01', balance: 3600 },
      { date: '2024-11-01', balance: 3700 },
      { date: '2024-12-01', balance: 3800 }
    ]
  },
  {
    accountId: 'acc3',
    name: 'Investment',
    monthlyBalances: [
      { date: '2024-01-01', balance: 10000 },
      { date: '2024-02-01', balance: 10200 },
      { date: '2024-03-01', balance: 9800 },
      { date: '2024-04-01', balance: 10500 },
      { date: '2024-05-01', balance: 10800 },
      { date: '2024-06-01', balance: 11000 },
      { date: '2024-07-01', balance: 11500 },
      { date: '2024-08-01', balance: 11300 },
      { date: '2024-09-01', balance: 11700 },
      { date: '2024-10-01', balance: 12000 },
      { date: '2024-11-01', balance: 12500 },
      { date: '2024-12-01', balance: 13000 }
    ]
  },
  {
    accountId: 'acc4',
    name: '401k',
    monthlyBalances: [
      { date: '2024-01-01', balance: 15000 },
      { date: '2024-02-01', balance: 15200 },
      { date: '2024-03-01', balance: 15400 },
      { date: '2024-04-01', balance: 15800 },
      { date: '2024-05-01', balance: 16000 },
      { date: '2024-06-01', balance: 16500 },
      { date: '2024-07-01', balance: 17000 },
      { date: '2024-08-01', balance: 17250 },
      { date: '2024-09-01', balance: 17500 },
      { date: '2024-10-01', balance: 17800 },
      { date: '2024-11-01', balance: 18000 },
      { date: '2024-12-01', balance: 18500 }
    ]
  }
]

function aggregateMonthlyNetWorth(accounts) {
  const netWorthByMonth = {}

  accounts.forEach((account) => {
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

export default function LineGraph({ graphColor }) {
  const data = aggregateMonthlyNetWorth(fakeAccountData)
  const latestPoint = data[data.length - 1] ?? {}
  const [worth, setWorth] = useState(latestPoint.totalBalance ?? null)
  const [date, setDate] = useState(latestPoint.date ?? null)
  const handleMouseMove = (e) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const point = e.activePayload[0].payload
      setWorth(point.totalBalance)
      setDate(point.date)
    }
  }

  const handleMouseLeave = () => {
    console.log('handle leave')
    setWorth(latestPoint.totalBalance)
    setDate(latestPoint.date)
  }

  // TODO: move to style.scss
  return (
    <>
      {/* Net worth display above the chart */}
      {worth !== null && date !== null && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ${worth.toLocaleString()} on{' '}
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })}
        </div>
      )}

      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tickFormatter={(str) =>
              new Date(str).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })
            }
          />
          <YAxis
            domain={['auto', 'auto']}
          />
          {/* Tooltip hidden but active for interpolation */}
          <Tooltip content={() => null} />
          <Line
            type='monotone'
            dataKey='totalBalance'
            stroke={graphColor || '#8884d8'}
            strokeWidth={2}
            dot={false} // ← hides the data point dots
            // remove `dot` so you get hover between points
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

LineGraph.propTypes = {
  graphColor: PropTypes.string.isRequired
}
