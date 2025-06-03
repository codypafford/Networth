import { useState } from 'react'
import { getLocalDateString } from '../../../../utils/dateUtils'
import './style.scss'

export default function AddBalance({ onSubmit }) {
  const [formData, setFormData] = useState({
    amount: '',
    asOfDate: getLocalDateString() // "YYYY-MM-DD"
  })

  const [status, setStatus] = useState({ message: '', isError: false })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status.message) setStatus({ message: '', isError: false }) // clear message on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!onSubmit) return

    try {
      await onSubmit(formData)
      setStatus({ message: 'Balance added successfully!', isError: false })
      setFormData({ amount: '', asOfDate: '' })
    } catch (err) {
      setStatus({
        message: 'Failed to add balance. Please try again.',
        isError: true
      })
    }
  }

  return (
    <form className='add-balance' onSubmit={handleSubmit}>
      <div className='add-balance__field'>
        <label className='add-balance__label' htmlFor='amount'>
          Amount
        </label>
        <input
          id='amount'
          className='add-balance__input'
          type='number'
          name='amount'
          value={formData.amount}
          onChange={handleChange}
          required
          autoComplete="off"
          step='0.01'
        />
      </div>

      <div className='add-balance__field'>
        <label className='add-balance__label' htmlFor='asOfDate'>
          As of Date
        </label>
        <input
          id='asOfDate'
          className='add-balance__input'
          type='date'
          name='asOfDate'
          value={formData.asOfDate}
          onChange={handleChange}
          autoComplete="off"
          required
        />
      </div>

      <button className='add-balance__submit' type='submit'>
        Add Balance
      </button>

      {status.message && (
        <div
          className={`add-balance__message add-balance__message--${
            status.isError ? 'error' : 'success'
          }`}
        >
          {status.message}
        </div>
      )}
    </form>
  )
}
