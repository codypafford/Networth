import { NavLink } from 'react-router-dom'
import './style.scss'

export default function Footer() {
  return (
    <footer className="app-footer">
      <NavLink to="/dashboard" className="app-footer__button">Home</NavLink>
      <NavLink to="/create-dashboard" className="app-footer__button">Create</NavLink>
      <NavLink to="/about-us" className="app-footer__button">About</NavLink>
      <NavLink to="/profile" className="app-footer__button">Profile</NavLink>
    </footer>
  )
}
