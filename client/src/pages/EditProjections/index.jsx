import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchWithAuth } from '../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { formatMonthYear } from '../../utils/dateUtils'
import { useNavigate } from 'react-router-dom'
import './style.scss'

export default function EditProjections({ initialData = [], onChange }) {
  const [projections, setProjections] = useState(initialData)
  const [form, setForm] = useState({ asOfDate: '', amount: '' })
  const { id } = useParams()
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProjections() {
      try {
        const res = await fetchWithAuth({
          path: `/api/dashboards/${id}/projections/`,
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
  }, [id, getAccessTokenSilently, onChange])

  const disabledMonths = new Set(projections.map((p) => p.asOfDate))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'asOfDate' && disabledMonths.has(value)) {
      alert(
        'Projection for this month already exists. Delete it if you want to edit.'
      )
      return // block selection
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const addProjection = async (e) => {
    e.preventDefault()

    if (!form.asOfDate || !form.amount || Number(form.amount) <= 0) return

    const newProjection = {
      asOfDate: form.asOfDate,
      amount: Number(form.amount)
    }
    await fetchWithAuth({
      path: `/api/dashboards/add-projection/${id}`,
      method: 'PUT',
      body: { projection: newProjection },
      getToken: getAccessTokenSilently
    }).then(() => {
      const updated = [...projections, newProjection].sort(
        (a, b) => new Date(a.asOfDate) - new Date(b.asOfDate)
      )

      setProjections(updated)
      setForm({ asOfDate: '', amount: '' })

      if (onChange) onChange(updated)
    })
  }

  const removeProjection = async (projectionId) => {
    try {
      await fetchWithAuth({
        path: `/api/dashboards/${id}/projections/${projectionId}`,
        method: 'DELETE',
        getToken: getAccessTokenSilently
      })

      // Remove locally
      const updated = projections.filter((proj) => proj._id !== projectionId)
      setProjections(updated)
      if (onChange) onChange(updated)
    } catch (error) {
      console.error('Failed to delete projection:', error)
    }
  }

  return (
    <div className='edit-projections'>
      <button
        className='back-button'
        onClick={() => navigate(`/dashboard/view-dashboard/${id}`)} // go back one page
        aria-label='Go back'
      >
        ← Back
      </button>
      <form className='edit-projections__form' onSubmit={addProjection}>
        <div className='edit-projections__field-group'>
          <label className='edit-projections__label' htmlFor='asOfDate'>
            Start Date
          </label>
          <input
            className='edit-projections__input'
            type='month'
            id='asOfDate'
            name='asOfDate'
            value={form.asOfDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className='edit-projections__field-group'>
          <label className='edit-projections__label' htmlFor='amount'>
            Monthly Amount
          </label>
          <input
            className='edit-projections__input'
            type='number'
            id='amount'
            name='amount'
            value={form.amount}
            onChange={handleInputChange}
            min='1'
            step='0.01'
            placeholder='Enter amount'
            required
          />
        </div>

        <button className='edit-projections__btn' type='submit'>
          Add Projection
        </button>
      </form>

      <ul className='edit-projections__list'>
        {projections.length === 0 && (
          <li className='edit-projections__empty'>No projections yet.</li>
        )}

        {projections.map(({ _id, asOfDate, amount }) => (
          <li key={_id} className='edit-projections__item'>
            <span className='edit-projections__date'>
              {formatMonthYear(asOfDate)}
            </span>
            <span className='edit-projections__amount'>
              ${amount.toLocaleString()}
            </span>
            <button
              className='edit-projections__remove-btn'
              onClick={() => removeProjection(_id)}
              aria-label={`Remove projection for ${asOfDate}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
