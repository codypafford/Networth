import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import PropTypes from 'prop-types';

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
      // scope: "read:current_user update:current_user_metadata"
  }}
      onRedirectCallback={() => navigate('/')}
    >
      {children}
    </Auth0Provider>
  );
};

Auth0ProviderWithNavigate.propTypes = {
  children: PropTypes.node.isRequired
}

export default Auth0ProviderWithNavigate;
