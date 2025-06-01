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

  useEffect(() => {
    let data
    async function getData() {
      const res = await fetchWithAuth({
        path: `/api/dashboards/${id}`,
        method: 'GET',
        getToken: getAccessTokenSilently
      })
      data = await res.json()
      setData(data)
    }
    getData()
  }, [])

  const graphData = {
    pageData: data
  }
  return (
    data && Object.keys(data).length != 0 && <ViewDashboardChart graphData={graphData} />
  )
}
