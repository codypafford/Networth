import { useState } from 'react'
import { ChartTypes, TrackingTypes } from '../../constants'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { formatUTCDateOnly } from '../../utils/dateUtils'

export default function ViewDashboardChart({ graphData }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const getIconForItem = (item) => {
    if (item.toLowerCase().includes('gain')) return '📈'
    if (item.toLowerCase().includes('loss')) return '📉'
    if (item.toLowerCase().includes('current')) return '💰'
    return 'ℹ️'
  }
  const {
    pageData: {
      dashboard: {
        chart: { trackingType, chartType }
      },
      data,
      summaryContent
    }
  } = graphData

  if (chartType === ChartTypes.line) {
    const chartData = data?.map((x) => ({
      ...x,
      date: x.date.substring(0, 10)
    }))
    return (
      <>
        <h3 className='view-dashboard__header'>{TrackingTypes[trackingType].friendlyText}</h3>
        <div className='view-dashboard'>
          <div
            className='view-dashboard__chart-container'
            style={{ touchAction: 'none', height: 300 }}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={chartData}
                onMouseLeave={() => setActiveIndex(null)}
              >
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
                  dot={{
                    r: 4,
                    stroke: '#8884d8',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                  activeDot={{
                    r: 6,
                    stroke: '#555',
                    strokeWidth: 3,
                    fill: '#8884d8'
                  }}
                  animationDuration={1200}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className='view-dashboard__summary'
            style={{ marginTop: '1rem' }}
          >
            <h4>{summaryContent.header}</h4>
            {summaryContent.items.map((item, idx) => (
              <p
                key={idx}
                className='summary__item'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.4rem'
                }}
              >
                <span style={{ marginRight: 8 }}>{getIconForItem(item)}</span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </>
    )
  }
  if (chartType === ChartTypes.bar) {
    return (
      <>
        <h3>{TrackingTypes[trackingType].friendlyText}</h3>
        <div className='view-dashboard'>
          <div className='view-dashboard__chart-container'>
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
        </div>
        <div className='view-dashboard__summary'>
          <h4>{summaryContent.header}</h4>
          {summaryContent.items.map((item, index) => (
            <p key={index} className='summary__item'>
              <span className='summary__icon' style={{ marginRight: 8 }}>
                {getIconForItem(item)}
              </span>
              {item}
            </p>
          ))}
        </div>
      </>
    )
  }
}

const CustomBarChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='category-tooltip'>
        <p className='category-tooltip__text'>{`${label}: $${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='category-tooltip'>
        <p className='category-tooltip__text'>
          {`${formatUTCDateOnly(label)}: $${payload[0].value.toFixed(2)}`}
        </p>
      </div>
    )
  }
  return null
}
