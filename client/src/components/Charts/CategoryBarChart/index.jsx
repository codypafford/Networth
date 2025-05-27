import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { mockTransactions } from './SampleData'
import { format, parseISO } from 'date-fns'

export default function CategoryBarChart({ graphColor, dateRange }) {
  // I should only go back 1 year initally and then use next_cursor to slowly get more and more data. maybe only get new data on Mondays to limit that as well
  // TODO: to limit how much data I need everytime I request I must use Plaids /transactions/sync endpoint and store all transactions in my DB
  // TODO: the data must be encrypted legally and I have to have a user agreement that tells exactly what I am doing with data
  const diningData = mockTransactions
    .filter((tx) =>
      tx.category?.some((cat) =>
        ['Food and Drink', 'Restaurants', 'Fast Food', 'Coffee Shop'].includes(
          cat
        )
      )
    )
    .reduce((acc, tx) => {
      const month = format(parseISO(tx.date), 'MMM') // e.g., 'Jan', 'Feb'
      const existing = acc.find((entry) => entry.month === month)
      if (existing) {
        existing.amount = parseFloat((existing.amount + tx.amount).toFixed(2))
      } else {
        acc.push({ month, amount: tx.amount })
      }
      return acc
    }, []);

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={diningData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='amount' fill={graphColor ? graphColor : '#8884d8'} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 0 5px rgba(0,0,0,0.2)'
      }}
    >
      <p>
        <strong>Total Spent:</strong> ${payload[0].value}
      </p>
    </div>
  )
}
