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
import { getSummaryHtml } from '../../components/Charts/ChartContainer/utils'
export default function ViewDashboardChart({ graphData }) {
  const {
    pageData: {
      dashboard: {
        chart: { trackingType, chartType }
      },
      data,
      summaryContent
    }
  } = graphData
  console.log('pass this: ', graphData)
  if (chartType === ChartTypes.line) {
    const chartData = data?.map((x) => ({
      ...x,
      date: x.date.substring(0, 10)
    }))
    return (
      <>
        <h3>{TrackingTypes[trackingType].friendlyText}</h3>
        <div className='view-dashboard'>
          <div className='view-dashboard__chart-container'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
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
                <YAxis domain={['auto', 'auto']} />
                <Tooltip content={() => null} />
                <Line
                  type='monotone'
                  dataKey='totalBalance'
                  stroke={'#8884d8'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='view-dashboard__summary'>
            {getSummaryHtml(summaryContent)}
          </div>
        </div>
      </>
    )
  }
  if (chartType === ChartTypes.bar) {
    return (
      <>
        <div className='view-dashboard'>
          <div className='view-dashboard__chart-container'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip content={<CustomBarChartTooltip />} />
                <Bar dataKey='amount' fill={'#8884d8'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='view-dashboard__summary'>
          {getSummaryHtml(summaryContent)}
        </div>
      </>
    )
  }
}

function CustomBarChartTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className='category-tooltip'>
      <p className='category-tooltip__text'>
        <strong>Total Spent:</strong> ${payload[0].value.toFixed(2)}
      </p>
    </div>
  )
}
