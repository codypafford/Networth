// components/PasswordGate.jsx
import { useState, useEffect } from 'react'
import './style.scss'

const PASSWORD_KEY = 'app_gate_passed'

export default function SimplePasswordGate({ children }) {
  const [input, setInput] = useState('')
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const hasAccess = localStorage.getItem(PASSWORD_KEY)
    if (hasAccess === 'true') setPassed(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === import.meta.env.VITE_PASSWORD_GATE) {
      localStorage.setItem(PASSWORD_KEY, 'true')
      setPassed(true)
    } else {
      alert('Incorrect password')
    }
  }

  if (passed) return children

  return (
    <div className='password-gate'>
      <form className='password-gate__form' onSubmit={handleSubmit}>
        <input
          type='password'
          className='password-gate__input'
          placeholder='Enter password'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type='submit' className='password-gate__button'>
          Enter
        </button>
      </form>
    </div>
  )
}
