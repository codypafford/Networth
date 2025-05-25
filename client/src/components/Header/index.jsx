import { useAuth0 } from "@auth0/auth0-react";
import './style.scss';

export default function Header() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <header className="header">
      <h1 className="header__title" onClick={() => window.location.assign(window.location.origin)}>
        What is my Networth?
      </h1>
      <div className="header__actions">
        {isAuthenticated ? (
          <button 
            className="header__button header__button--logout"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </button>
        ) : (
          <button 
            className="header__button header__button--login"
            onClick={() => loginWithRedirect()}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
