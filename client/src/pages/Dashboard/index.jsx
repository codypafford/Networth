import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SampleChart from '../../components/Charts/SampleChart'
import CategoryBarChart from '../../components/Charts/CategoryBarChart'
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
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboards()
  }, [user, getAccessTokenSilently])

  // TODO: I will need to store in mongo what the chart tracks so I know how to consruct the graph
  function renderChart(chart, dashboard) {
    if (chart.chartType === ChartTypes.line) {
      return (
        <ChartContainer
          title={dashboard.name}
          id={dashboard._id}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) => prev.filter((d) => d._id !== deletedId))
          }}
          summaryContent={
            <div>
              <h4 style={{ marginTop: 0 }}>Summary</h4>
              <p>Total: $15,200</p>
              <p>Change since last Month: +8.5%</p>
              <p>Change since last Year: -1.5%</p>
              <p>Largest Expense Last Month: $1800 : Pennymac Morgage Inc</p>
            </div>
          }
        >
          <SampleChart key={chart.id} />
        </ChartContainer>
      )
    } else if (chart.chartType === ChartTypes.bar) {
      return (
        <ChartContainer
          title={dashboard.name}
          id={dashboard._id}
          onDeleteComplete={(deletedId) => {
            setDashboards((prev) => prev.filter((d) => d._id !== deletedId))
          }}
          summaryContent={
            <div>
              <h4 style={{ marginTop: 0 }}>Summary</h4>
            <p>Largest Expense This Month: $250 : Restaurant Orsay</p>
              <p>Largest Expense Last Month: $100 : Craft Crab</p>
                            <p>Most frequented this year: Moe's</p>
                            <p>Total spent at Moes: $564.19</p>

            </div>
          }
        >
          <CategoryBarChart key={chart.id} />
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
            <div className='chart-container'>
              {dashboard.charts.map((chart) => renderChart(chart, dashboard))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
