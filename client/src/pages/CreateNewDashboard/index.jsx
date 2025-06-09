import { useState } from 'react'
import LineChart from '../../components/Charts/LineChart'
import HorizontalBarChart from '../../components/Charts/HorizontalBarChart'
import { useNavigate } from 'react-router-dom'
import CategoryBarChart from '../../components/Charts/CategoryBarChart'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { ChartTypes, TrackingTypes } from '../../constants'
import './style.scss'

export default function CreateDashboard() {
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate() // get navigate

  const [selectedOption, setSelectedOption] = useState('savings')
  const [dashboardName, setDashboardName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setSelectedOption(e.target.value)
  }

  const getChartData = () => {
    return {
      trackingType: selectedOption,
      chartType: TrackingTypes[selectedOption].chartTypes[0], // TODO: eventually maybe I will support more for each type
      filters: {} // TODO: can hold date filter, account exclude filters, etc
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    setLoading(true)

    const dashboardData = {
      userId: user.sub,
      name: dashboardName,
      chart: getChartData()
    }

    try {
      const res = await fetchWithAuth({
        path: '/api/dashboards',
        method: 'POST',
        body: dashboardData,
        getToken: getAccessTokenSilently
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save dashboard')
      }

      setSuccess('Dashboard saved successfully!')
      setDashboardName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='create-dashboard'>
      <button
        className='back-button'
        onClick={() => navigate(-1)} // go back one page
        aria-label='Go back'
      >
        ← Back
      </button>
      <h2>Create a New Dashboard</h2>

      <form onSubmit={handleSave}>
        <div className='form-group'>
          <label htmlFor='dashboard-name'>Dashboard Name (Optional)</label>
          <input
            id='dashboard-name'
            type='text'
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder='Enter dashboard name'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='tracking-type'>What do you want to track?</label>
          <select
            id='tracking-type'
            value={selectedOption}
            onChange={handleChange}
          >
            <option value={TrackingTypes.savings.value}>
              {TrackingTypes.savings.friendlyText}
            </option>
            <option value={TrackingTypes.dining.value}>
              {TrackingTypes.dining.friendlyText}
            </option>
            <option value={TrackingTypes.jointDining.value}>
              {TrackingTypes.jointDining.friendlyText}
            </option>
            <option value={TrackingTypes.allDining.value}>
              {TrackingTypes.allDining.friendlyText}
            </option>
            <option value={TrackingTypes.groceries.value}>
              {TrackingTypes.groceries.friendlyText}
            </option>
            <option value={TrackingTypes.shopping.value}>
              {TrackingTypes.shopping.friendlyText}
            </option>
          </select>
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Saving...' : 'Save Dashboard'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>

      <div className='chart-preview'>
        {/* {TrackingTypes[selectedOption]?.chartTypes.includes(
          ChartTypes.horizontalBar
        ) && <HorizontalBarChart sample/>} */}
        {TrackingTypes[selectedOption]?.chartTypes.includes(
          ChartTypes.line
        ) && <LineChart sample />}
        {TrackingTypes[selectedOption]?.chartTypes.includes(ChartTypes.bar) && (
          <CategoryBarChart sample />
        )}
      </div>
    </main>
  )
}
