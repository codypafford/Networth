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
import { mockTransactions } from './SampleData.js'
import PropTypes from 'prop-types'

// TODO: add mocked data back for the sample data
// function aggregateMonthlyNetWorth(accounts) {
//   const netWorthByMonth = {}

//   accounts.forEach((account) => {
//     account.monthlyBalances.forEach(({ date, balance }) => {
//       if (!netWorthByMonth[date]) {
//         netWorthByMonth[date] = 0
//       }
//       netWorthByMonth[date] += balance
//     })
//   })

//   return Object.entries(netWorthByMonth)
//     .map(([date, totalBalance]) => ({ date, totalBalance }))
//     .sort((a, b) => new Date(a.date) - new Date(b.date))
// }

// TODO: make all fucntion names same name as file
export default function LineGraph({ graphColor, data: graphData, sample }) {
  // console.log('my data', data)
  let data = graphData
  if (sample) {
    data = mockTransactions
  }
  console.log('the data data', data)
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
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

LineGraph.propTypes = {
  graphColor: PropTypes.string.isRequired
}
