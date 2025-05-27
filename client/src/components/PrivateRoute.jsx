import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;
  return isAuthenticated ? children : <Navigate to="/" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
}
