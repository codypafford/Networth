import { useState } from 'react'
import SampleChart from '../../components/Charts/SampleChart'
import { useNavigate } from 'react-router-dom' // import navigate
import CategoryBarChart from '../../components/Charts/CategoryBarChart'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import './style.scss'

export default function CreateDashboard() {
  const { user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate() // get navigate

  const [selectedOption, setSelectedOption] = useState('networth')
  const [dashboardName, setDashboardName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setSelectedOption(e.target.value)
  }

  const getChartData = () => {
    const isNetWorth = selectedOption === 'networth'
    return {
      id: 'chart1',
      type: selectedOption === 'networth' ? selectedOption : 'category',
      chartType: isNetWorth ? 'line' : 'bar',
      filters: isNetWorth ? {} : { category: selectedOption }
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!dashboardName.trim()) {
      setError('Please enter a dashboard name.')
      return
    }

    setLoading(true)

    const dashboardData = {
      userId: user.sub,
      name: dashboardName,
      charts: [getChartData()]
    }

    try {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE // TODO: make a helper function that I can call that always has  this adudenicen when i want to get a token

      const token = await getAccessTokenSilently({
        audience: audience
      })

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
        className="back-button"
        onClick={() => navigate(-1)} // go back one page
        aria-label='Go back'
      >
        ← Back
      </button>
      <h2>Create a New Dashboard</h2>

      <form onSubmit={handleSave}>
        <div className='form-group'>
          <label htmlFor='dashboard-name'>Dashboard Name</label>
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
            <option value='networth'>Track Net Worth</option>
            <option value='dining'>Track Dining / Restaurants</option>
            {/* Add more tracking options here */}
          </select>
        </div>

        <button type='submit' disabled={loading}>
          {loading ? 'Saving...' : 'Save Dashboard'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>

      <div className='chart-preview' style={{ marginTop: '2rem' }}>
        {selectedOption === 'networth' && <SampleChart />}
        {selectedOption === 'dining' && <CategoryBarChart />}
      </div>
    </main>
  )
}
