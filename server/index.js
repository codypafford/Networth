const express = require('express');
const cors = require('cors');
const checkJwt = require('./auth/checkJwt');
const dashboardRoutes = require('./routes/dashboard');
const transactionRoutes = require('./routes/transaction')
const balanceRoutes = require('./routes/balance')
const app = express();
const port = process.env.PORT || 3000;

const dotenv = require('dotenv');

// Load base .env first / .env is used as a base
dotenv.config();

const env = process.env.NODE_ENV || 'development';  // default to development

dotenv.config({
  path: `.env.${env}`
});



// Enable CORS for your frontend origin
const allowedOrigins = ['http://localhost:5173', 'https://networth-frontend-8gem.onrender.com'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json()); // for parsing application/json
app.use('/api/dashboards', checkJwt, dashboardRoutes);
app.use('/api/transactions', checkJwt, transactionRoutes);
app.use('/api/balances', checkJwt, balanceRoutes);

// MONGO

const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

//

// Example routes
app.get('/api/public', (req, res) => {
  res.send('Public endpoint, no auth required');
});

app.get('/api/protected', checkJwt, (req, res) => {
    console.log('Request object:', req);
res.send(`Hello ${JSON.stringify(req.user)}, you accessed a protected endpoint!`);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

