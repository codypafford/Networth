import { useState, useRef, useEffect } from 'react'
import AuthButton from './AuthButton'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { addTransactionModal, addBalanceModal } from '../../utils/modalUtils'

export default function HamburgerMenu() {
  const { getAccessTokenSilently } = useAuth0()
  const [open, setOpen] = useState(false)
  const menuRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='hamburger-menu' ref={menuRef}>
      <button
        className='hamburger-menu__button'
        onClick={() => setOpen((prev) => !prev)}
        aria-label='Toggle menu'
      >
        &#9776;
      </button>
      {open && (
        <ul className='hamburger-menu__dropdown'>
          <li>
            <AuthButton />
          </li>
          <li onClick={() => addTransactionModal(getAccessTokenSilently)}>
            Add Transaction
          </li>
          <li onClick={() => addBalanceModal(getAccessTokenSilently)}>
            Add Balance
          </li>
          <li>Edit Transactions</li>
          <li>Edit Balances</li>
          <li onClick={() => navigate('/about-us')}>About Us</li>
        </ul>
      )}
    </div>
  )
}
