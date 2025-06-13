import { useEffect, useRef, useState } from 'react'
import { TrackingTypes } from '../../../../constants'
import { getLocalDateString } from '../../../../utils/dateUtils'
import { fetchWithAuth } from '../../../../utils/apiUtils'
import { useAuth0 } from '@auth0/auth0-react'
import './style.scss'

export default function AddTransaction({ onSubmit }) {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: getLocalDateString(), // "YYYY-MM-DD"
    name: ''
  })
  const [status, setStatus] = useState({ message: '', isError: false })
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionSelected, setSuggestionSelected] = useState(false)

  function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay)
      return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
  }

  const debouncedName = useDebounce(formData.name)

  useEffect(() => {
    if (!debouncedName || suggestionSelected) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true)

        const res = await fetchWithAuth({
          path: `/api/transactions?name=${debouncedName}&limit=3`,
          method: 'GET',
          getToken: getAccessTokenSilently
        })

        const { data } = await res.json()
        const uniqueNames = [...new Set(data.map((item) => item.name))]

        setSuggestions(uniqueNames)
      } catch (error) {
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedName])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSuggestionSelected(false)
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
          inputMode='numeric'
          pattern='[0-9]*'
          required
          autoComplete='off'
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
          autoComplete='off'
          required
        />
      </div>

      <div className='transaction-form__group transaction-form__group--typeahead'>
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
          autoComplete='off'
        />
        {suggestions.length > 0 && (
          <ul className='transaction-form__suggestions'>
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => {
                  setSuggestionSelected(true)
                  setFormData((prev) => ({ ...prev, name: suggestion }))
                  setSuggestions([])
                }}
                className='transaction-form__suggestion'
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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
