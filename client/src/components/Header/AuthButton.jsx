import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'

export default function AuthButton({ className = '' }) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  return isAuthenticated ? (
    <button
      className={`header__button header__button--logout ${className}`}
      onClick={() => {
        console.log('Logout returnTo:', window.location.origin)
        logout({ returnTo: window.location.origin })
      }}
    >
      Logout
    </button>
  ) : (
    <button
      className={`header__button header__button--login ${className}`}
      onClick={() =>
        loginWithRedirect({
          prompt: 'login',
          max_age: 0
        })
      }
    >
      Login
    </button>
  )
}

AuthButton.propTypes = {
  className: PropTypes.string
}
