const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboards');
// const checkJwt = require('./auth/checkJwt');

// POST /dashboard - create new dashboard
router.post('/', async (req, res) => {
  try {
    console.log('testing.....')
    const { userId, name, charts } = req.body;
    console.log('got the request')
    if (!userId || !name || !charts) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const dashboard = new Dashboard({ userId, name, charts });
    await dashboard.save();

    res.status(201).json(dashboard);
  } catch (error) {
    console.log("FAILEDDDD")
    console.error('Error creating dashboard:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId query parameter" });
    }

    const dashboards = await Dashboard.find({ userId }).lean();

    res.json(dashboards);
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
