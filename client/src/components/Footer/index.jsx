import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaMoneyBillWave,
  FaPlusCircle,
  FaPlusSquare,
  FaInfoCircle
} from 'react-icons/fa'
import { addTransactionModal, addBalanceModal } from '../../utils/modalUtils'
import { useAuth0 } from '@auth0/auth0-react'
import './style.scss'

export default function Footer() {
const { getAccessTokenSilently } = useAuth0()
  return (
    <footer className="app-footer">
      <NavLink to="/dashboard" className="app-footer__button" title="Home">
        <FaHome size={24} />
      </NavLink>

      <div className="app-footer__button" title="Add Balance" onClick={() => addBalanceModal(getAccessTokenSilently)}>
        <FaMoneyBillWave size={24} />
      </div>

      <div className="app-footer__button" title="Add Transaction" onClick={() => addTransactionModal(getAccessTokenSilently)}>
        <FaPlusCircle size={24} />
      </div>

      <NavLink to="/create-dashboard" className="app-footer__button" title="Create Dashboard">
        <FaPlusSquare size={24} />
      </NavLink>

      <NavLink to="/about-us" className="app-footer__button" title="About">
        <FaInfoCircle size={24} />
      </NavLink>
    </footer>
  )
}
