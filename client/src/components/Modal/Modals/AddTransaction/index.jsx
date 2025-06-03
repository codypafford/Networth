import { TrackingTypes } from '../../../../constants'
import { useState } from 'react'
import { getLocalDateString } from '../../../../utils/dateUtils'
import './style.scss'

export default function AddTransaction({ onSubmit }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: getLocalDateString(), // "YYYY-MM-DD"
    name: ''
  })
  const [status, setStatus] = useState({ message: '', isError: false })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status.message) setStatus({ message: '', isError: false }) // reset status on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!onSubmit) return

    try {
      await onSubmit(formData)
      setStatus({ message: 'Transaction added successfully!', isError: false })
      setFormData({ category: '', amount: '', date: '', name: '' })
    } catch (error) {
      setStatus({
        message: 'Failed to add transaction. Please try again.',
        isError: true
      })
    }
  }

  return (
    <form className='transaction-form' onSubmit={handleSubmit}>
      <div className='transaction-form__group'>
        <label className='transaction-form__label' htmlFor='category'>
          Category
        </label>
        <select
          id='category'
          name='category'
          className='transaction-form__select'
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value=''>Select</option>
          {Object.values(TrackingTypes)
            .filter((x) => !x.excludeFromForms)
            .map(({ value, friendlyText }) => (
              <option key={value} value={value}>
                {friendlyText}
              </option>
            ))}
        </select>
      </div>

      <div className='transaction-form__group'>
        <label className='transaction-form__label' htmlFor='amount'>
          Amount
        </label>
        <input
          id='amount'
          type='number'
          name='amount'
          className='transaction-form__input'
          value={formData.amount}
          onChange={handleChange}
          required
          step='0.01'
        />
      </div>

      <div className='transaction-form__group'>
        <label className='transaction-form__label' htmlFor='date'>
          Date
        </label>
        <input
          id='date'
          type='date'
          name='date'
          className='transaction-form__input'
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className='transaction-form__group'>
        <label className='transaction-form__label' htmlFor='name'>
          Name
        </label>
        <input
          id='name'
          type='text'
          name='name'
          className='transaction-form__input'
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Transaction name'
          autocomplete="off"
        />
      </div>

      <button className='transaction-form__button' type='submit'>
        Add Transaction
      </button>

      {status.message && (
        <div
          className={
            status.isError
              ? 'transaction-form__message transaction-form__message--error'
              : 'transaction-form__message transaction-form__message--success'
          }
        >
          {status.message}
        </div>
      )}
    </form>
  )
}
