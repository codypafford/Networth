import { useState, useEffect } from 'react'
import { ChartTypes, TrackingTypes } from '../../constants'
import { generateProjections } from '../../utils/graphUtils'
import LineChartView from './Components/LineChartView'
import BarChartView from './Components/BarChartView'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithAuth } from '../../utils/apiUtils'
import './style.scss'

export default function ViewDashboardChart({ graphData }) {
  const {
    pageData: {
      dashboard: {
        chart: { trackingType, chartType },
        _id: id
      },
      data,
      summaryContent
    }
  } = graphData
  const { getAccessTokenSilently } = useAuth0()

  const [activeIndex, setActiveIndex] = useState(null)
  const [projections, setProjections] = useState([])

  useEffect(() => {
    async function loadProjections() {
      try {
        const res = await fetchWithAuth({
          path: `/api/dashboards/projections/${id}`,
          method: 'GET',
          getToken: getAccessTokenSilently
        })
        const data = await res.json()
        if (data?.projections) {
          setProjections(data.projections)
        }
      } catch (error) {
        console.error('Failed to load projections:', error)
      }
    }

    if (id) {
      loadProjections()
    }
  }, [id, getAccessTokenSilently])

  const projectedData = generateProjections(data, projections)

  const getIconForItem = (item) => {
    if (item.toLowerCase().includes('gain')) return '📈'
    if (item.toLowerCase().includes('loss')) return '📉'
    if (item.toLowerCase().includes('current')) return '💰'
    return 'ℹ️'
  }

  const summary = (
    <div className='view-dashboard__summary'>
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
  )

  return (
    <>
      <h3 className='view-dashboard__header'>
        {TrackingTypes[trackingType].friendlyText}
      </h3>
      {chartType === ChartTypes.line ? (
        <LineChartView
          id={id}
          data={projectedData}
          setActiveIndex={setActiveIndex}
        />
      ) : (
        <BarChartView id={id} data={data} setActiveIndex={setActiveIndex} />
      )}
      {summary}
    </>
  )
}
