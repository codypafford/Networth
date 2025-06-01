import { useParams } from 'react-router-dom'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState, useRef } from 'react'
// TODO: move this method to common constants for everyones use
import './style.scss'
import ViewDashboardChart from './ViewDashboardChart'

export default function ViewDashboard() {
  const { getAccessTokenSilently } = useAuth0()
  const { id } = useParams()
  const [data, setData] = useState({})
  const [graphColor, setGraphColor] = useState('#8884d8')
  const chartRef = useRef(null)

  useEffect(() => {
    const chartEl = chartRef.current
    if (!chartEl) return

    let startX = 0
    let startY = 0

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaX = Math.abs(e.touches[0].clientX - startX)
        const deltaY = Math.abs(e.touches[0].clientY - startY)

        if (deltaY > deltaX) {
          // Prevent vertical scrolling
          e.preventDefault()
          e.stopPropagation()
        }
        // Otherwise allow horizontal scroll
      }
    }

    chartEl.addEventListener('touchstart', handleTouchStart, { passive: true })
    chartEl.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      chartEl.removeEventListener('touchstart', handleTouchStart)
      chartEl.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

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
  const graphData = {
    pageData: data
  }
  console.log('the page data', data)
  return (
    data && Object.keys(data).length != 0 && <ViewDashboardChart ref={chartRef} graphData={graphData} />
  )
}
