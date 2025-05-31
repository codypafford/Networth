import { useParams } from 'react-router-dom'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
// TODO: move this method to common constants for everyones use
import { getSummaryHtml } from '../../components/Charts/ChartContainer/utils'
import './style.scss'
import { TrackingTypes } from '../../constants'

export default function ViewDashboard() {
  const { getAccessTokenSilently } = useAuth0()
  const { id } = useParams()
  const [data, setData] = useState({})
  const [graphColor, setGraphColor] = useState('#8884d8')

  useEffect(() => {
    let data
    async function getData() {
      const res = await fetchWithAuth({
        path: `/api/dashboards/${id}`,
        method: 'GET',
        getToken: getAccessTokenSilently
      })
      data = await res.json()
      console.log('set this data', data)
      setData(data)
    }
    console.log('mounting')
    getData()
  }, [])
  console.log(data)
  const chartData = data?.data?.map((x) => ({
    ...x,
    date: x.date.substring(0, 10)
  }))
  // TODO: this one is line graph only
  return (
    chartData && (
      <>
        <h3>{TrackingTypes[data.dashboard.chart.trackingType].friendlyText}</h3>
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
                  stroke={graphColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='view-dashboard__summary'>
            {getSummaryHtml(data.summaryContent)}
          </div>
        </div>
      </>
    )
  )
}
