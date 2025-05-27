const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboards');
// const checkJwt = require('./auth/checkJwt');

// POST /dashboard - create new dashboard
router.post('/', async (req, res) => {
  try {
    console.log('testing.....')
    const { userId, name, chart } = req.body;
    console.log('got the request')
    if (!userId || !name || !chart) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const dashboard = new Dashboard({ userId, name, chart });
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

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Dashboard.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }
    res.status(200).json({ message: 'Dashboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ message: 'Server error while deleting dashboard' });
  }
});

module.exports = router;
