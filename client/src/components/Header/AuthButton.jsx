import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButton({ className = "" }) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <button
      className={`header__button header__button--logout ${className}`}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Logout
    </button>
  ) : (
    <button
      className={`header__button header__button--login ${className}`}
      onClick={() => loginWithRedirect()}
    >
      Login
    </button>
  );
}
