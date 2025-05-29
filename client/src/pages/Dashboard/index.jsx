import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LineChart from '../../components/Charts/LineChart'
import CategoryBarChart from '../../components/Charts/CategoryBarChart'
import HorizontalBarChart from '../../components/Charts/HorizontalBarChart'
import ChartContainer from '../../components/Charts/ChartContainer'
import { ChartTypes } from '../../constants'
import { fetchWithAuth } from '../../utils/apiUtils'
import './style.scss'

export default function Dashboard() {
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  const [dashboards, setDashboards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchDashboards = async () => {
      setLoading(true)
      setError(null)

      try {
        const calculatedDataRes = await fetchWithAuth({
          path: '/api/dashboards/',
          method: 'GET',
          getToken: getAccessTokenSilently
        })

        const data = await calculatedDataRes.json()
        console.log('the data we got back: ', data)
        setDashboards(data.dashboards)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Only re-run when user becomes available

  // TODO: i am passing in too many things indiviually but really i should just pass in dashboard below and same with the CharContainer props
  function renderChart({dashboard, data, summaryContent}) {
    const chart = dashboard.chart
    if (chart.chartType === ChartTypes.line) {
      return (
        <ChartContainer
          dashboard={dashboard}
          data={data}
          summaryContent={summaryContent}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) =>
              prev.filter((d) => d.dashboard._id !== deletedId)
            )
          }}
          chartType={chart.chartType}
        >
          <LineChart key={chart.id} />
        </ChartContainer>
      )
    } else if (chart.chartType === ChartTypes.bar) {
      return (
        <ChartContainer
          dashboard={dashboard}
          data={data}
          summaryContent={summaryContent}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) =>
              prev.filter((d) => d.dashboard._id !== deletedId)
            )
          }}
          chartType={chart.chartType}
        >
          <CategoryBarChart key={chart.id} />
        </ChartContainer>
      )
    } else if (chart.chartType === ChartTypes.horizontalBar) {
      return (
        <ChartContainer
          dashboard={dashboard}
          data={data}
          summaryContent={summaryContent}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) =>
              prev.filter((d) => d.dashboard._id !== deletedId)
            )
          }}
          chartType={chart.chartType}
        >
          <HorizontalBarChart key={chart.id} />
        </ChartContainer>
      )
    }
    return null
  }

  return (
    <main className='dashboard'>
      <h2>Welcome, {user?.name}!</h2>

      <button
        className='create-dashboard-btn'
        onClick={() => navigate('/create-dashboard')}
      >
        Create New Dashboard
      </button>

      {loading && <p>Loading dashboards...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dashboards.length === 0 && !loading && (
        <p>No dashboards found. Create one!</p>
      )}

      <div className='dashboard-list'>
        {dashboards.map((x) => (
          <div key={x.dashboard._id} className='dashboard-item'>
            <div className='chart-container'>
              {renderChart(x)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
