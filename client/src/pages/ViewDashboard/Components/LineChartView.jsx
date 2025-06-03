import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { formatUTCDateOnly } from '../../../utils/dateUtils'
import '../style.scss'

export default function LineChartView({ data, setActiveIndex, id }) {
  const navigate = useNavigate()
  return (
    <div
      className='view-dashboard__chart-container'
      style={{ touchAction: 'none', height: 300 }}
    >
      <button
        className='back-button'
        onClick={() => navigate('/dashboard')} // go back one page
        aria-label='Go back'
      >
        ← Back
      </button>
      <div className='view-dashboard__actions-container'>
        <button
          className='view-dashboard__action-btn'
          onClick={() => navigate(`/dashboard/edit-projections/${id}`)}
        >
          Edit Projections
        </button>
      </div>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data} onMouseLeave={() => setActiveIndex(null)}>
          <defs>
            <linearGradient id='lineGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tickFormatter={(str) =>
              new Date(str).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })
            }
            stroke='#666'
            tick={{ fontSize: 12, fontWeight: '600' }}
          />
          <YAxis
            domain={['auto', 'auto']}
            stroke='#666'
            tick={{ fontSize: 12, fontWeight: '600' }}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <Line
            type='monotone'
            dataKey='totalBalance'
            stroke='url(#lineGradient)'
            strokeWidth={3.5}
            dot={{ r: 4, stroke: '#8884d8', strokeWidth: 2, fill: 'white' }}
            activeDot={{
              r: 6,
              stroke: '#555',
              strokeWidth: 3,
              fill: '#8884d8'
            }}
            animationDuration={1200}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          />
          <Line
            type='monotone'
            dataKey='projectedValue'
            stroke='#ff9900'
            strokeDasharray='5 5'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='view-dashboard__line-tooltip'>
        <p className='view-dashboard__line-tooltip__text'>
          {`${formatUTCDateOnly(label)}: $${Number(
            payload[0].value
          ).toLocaleString()}`}
        </p>
        {payload[1]?.value && (
          <p className='view-dashboard__line-tooltip__text'>
            Projected Value: ${Number(payload[1].value).toLocaleString()}
          </p>
        )}
      </div>
    )
  }
  return null
}
