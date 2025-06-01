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
import './style.scss'

export default function CategoryBarChart({
  graphColor,
  data: graphData,
  sample
}) {
  let data = graphData
  if (sample) {
    data = mockTransactions
  }

  return (
    <div className='chart-wrapper'>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Bar dataKey='amount' fill={graphColor ?? '#8884d8'} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
