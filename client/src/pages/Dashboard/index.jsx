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

    async function fetchDashboards() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetchWithAuth({
          path: '/api/dashboards',
          params: { userId: user.sub },
          getToken: getAccessTokenSilently
        })

        const data = await res.json()
        setDashboards(data)

        // TODO: this is where I will get all balance data and transaction data that is required from my mongo DB
        // do it all in one fetch, go back 1-2 years for line graph balances, and 6 months for bar graph categories,
        // then pass the raw data to the ChartContainer for it to determine the summary details
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboards()
  }, [user, getAccessTokenSilently])

  // TODO: i am passing in too many things indiviually but really i should just pass in dashboard below and same with the CharContainer props
  function renderChart(dashboard) {
    const chart = dashboard.chart
    if (chart.chartType === ChartTypes.line) {
      return (
        <ChartContainer
          dashboard={dashboard}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) => prev.filter((d) => d._id !== deletedId))
          }}
          chartType={chart.chartType}
          // TODO: in what way can couples have their money aggregated together? is this allowed?
          //   TODO: the summary content values should be calcu;ated in the chartContainer
          // AND data like 'Month with biggest gain' should be cacluated using the filtered results so we only calc what is in view
        >
          <LineChart key={chart.id} />
        </ChartContainer>
      )
    } else if (chart.chartType === ChartTypes.bar) {
      return (
        <ChartContainer
          dashboard={dashboard}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) => prev.filter((d) => d._id !== deletedId))
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
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) => prev.filter((d) => d._id !== deletedId))
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
        {dashboards.map((dashboard) => (
          <div key={dashboard._id} className='dashboard-item'>
            <div className='chart-container'>{renderChart(dashboard)}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
