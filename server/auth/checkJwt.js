const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const dotenv = require('dotenv');

// Load base .env first / .env is used as a base
dotenv.config();

const env = process.env.NODE_ENV || 'development';  // default to development

dotenv.config({
  path: `.env.${env}`
});

const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
};

// TODO: I think this just checks that the jwt is valid, is this enough or do I need another middleware to check more?
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

module.exports = checkJwt;
