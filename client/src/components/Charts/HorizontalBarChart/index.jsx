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

export default function MoneyFlowBarChart({
  graphColor,
  data: graphData,
  sample,
  inflowColor = '#4f46e5',
  outflowColor = '#F44336'
}) {
  let flowData = graphData
  if (sample) {
    flowData = mockTransactions
  }
  return (
    <ResponsiveContainer width='100%' height={400}>
      <BarChart layout='vertical' data={flowData} margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' />
        <YAxis dataKey='month' type='category' />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey='moneyIn'
          fill={graphColor ?? inflowColor}
          name='Money In'
        />
        <Bar dataKey='moneyOut' fill={outflowColor} name='Money Out' />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className='money-flow-tooltip'>
      <p className='money-flow-tooltip__label'>
        <strong>{label}</strong>
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className='money-flow-tooltip__item'>
          {entry.name}: ${entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}
