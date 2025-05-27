import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import PropTypes from 'prop-types'

const fakeAccountData = [
  {
    accountId: 'acc1',
    name: 'Checking',
    monthlyBalances: [
      { date: '2024-01-01', balance: 1200 },
      { date: '2024-02-01', balance: 1400 },
      { date: '2024-03-01', balance: 1300 },
      { date: '2024-04-01', balance: 1500 }
    ]
  },
  {
    accountId: 'acc2',
    name: 'Investment',
    monthlyBalances: [
      { date: '2024-01-01', balance: 5000 },
      { date: '2024-02-01', balance: 5200 },
      { date: '2024-03-01', balance: 5500 },
      { date: '2024-04-01', balance: 5600 }
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

export default function LineGraph({ graphColor, dateRange }) {
  const data = aggregateMonthlyNetWorth(fakeAccountData)

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
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
        <YAxis />
        <Tooltip content={<CustomTooltip test="testing"/>} />
        <Line
          type='monotone'
          dataKey='totalBalance'
          stroke={graphColor ? graphColor : '#8884d8'}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// TODO: put this in a new file and size the tooltip based on window size. its perfect for mobile but should be a tad bit bigger for computers
// TODO: I added a test prop and it works
function CustomTooltip({ active, payload, label, test }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  // Format date nicely
  const formattedDate = new Date(label).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
<div
  style={{
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '4px 6px',
    borderRadius: '4px',
    boxShadow: '0 0 3px rgba(0,0,0,0.1)',
    fontSize: '12px',
    lineHeight: '1.2',
    maxWidth: '150px',
    whiteSpace: 'nowrap',
  }}
>
  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{formattedDate}</p>
  <div style={{ marginBottom: '4px' }}>{test}</div>
  <p style={{ margin: 0 }}>
    <strong>Total Balance:</strong> {payload[0].value}
  </p>
</div>
  )
}

LineGraph.propTypes = {
  graphColor: PropTypes.string.isRequired
}
