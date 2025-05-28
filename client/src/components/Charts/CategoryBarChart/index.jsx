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
import './style.scss'

export default function CategoryBarChart({ graphColor, dateRange }) {
  const diningData = mockTransactions
    .filter((tx) =>
      tx.category?.some((cat) =>
        ['Food and Drink', 'Restaurants', 'Fast Food', 'Coffee Shop'].includes(cat)
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

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={diningData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='amount' fill={graphColor ?? '#8884d8'} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className='category-tooltip'>
      <p className='category-tooltip__text'>
        <strong>Total Spent:</strong> ${payload[0].value.toFixed(2)}
      </p>
    </div>
  )
}
