import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { mockTransactions } from './SampleData'
import { format, parseISO } from 'date-fns'
import './style.scss'

export default function MoneyFlowBarChart({ graphColor, inflowColor = '#4f46e5', outflowColor = '#F44336' }) {
  // TODO: if UI gets too boggy to create data that is required for the graphs, I can do it on the backend
    const flowData = mockTransactions.reduce((acc, tx) => {
    const month = format(parseISO(tx.date), 'MMM yyyy')
    const existing = acc.find(entry => entry.month === month)

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

  return (
    <ResponsiveContainer width='100%' height={400}>
      <BarChart layout='vertical' data={flowData} margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' />
        <YAxis dataKey='month' type='category' />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey='moneyIn' fill={graphColor ?? inflowColor} name='Money In' />
        <Bar dataKey='moneyOut' fill={outflowColor} name='Money Out' />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className='money-flow-tooltip'>
      <p className='money-flow-tooltip__label'><strong>{label}</strong></p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className='money-flow-tooltip__item'>
          {entry.name}: ${entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}
