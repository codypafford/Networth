import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import '../style.scss'

export default function BarChartView({ data, setActiveIndex }) {
  const navigate = useNavigate()
  return (
    <div className='view-dashboard__chart-container'>
      <button
        className='back-button'
        onClick={() => navigate('/dashboard')}
        aria-label='Go back'
      >
        ← Back
      </button>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data} onMouseLeave={() => setActiveIndex(null)}>
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip content={<CustomBarChartTooltip />} />
          <Bar
            dataKey='amount'
            fill='url(#colorUv)'
            radius={[10, 10, 0, 0]}
            animationDuration={1000}
            animationEasing='ease-in-out'
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            cursor='pointer'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomBarChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='view-dashboard__category-tooltip'>
        <p className='view-dashboard____category-tooltip__text'>{`${label}: $${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}
