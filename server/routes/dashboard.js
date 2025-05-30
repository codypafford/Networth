const express = require('express')
const router = express.Router()
const Dashboard = require('../models/Dashboards')
const Transaction = require('../models/Transactions')
const Balance = require('../models/Balances')
const { getAggregatedDashboardData } = require('../services/dashboards')
// const checkJwt = require('./auth/checkJwt');

// POST /dashboard - create new dashboard
router.post('/', async (req, res) => {
  try {
    console.log('testing.....')
    // TODO: I SHOULD BE DECODONG THE BEARER TOKEN SERVER SIDE TO DETERMINE THE USER

    const { name, chart } = req.body
    console.log('got the request')
    if (!name || !chart) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const dashboard = new Dashboard({ userId: req.auth.sub, name, chart })
    await dashboard.save()

    res.status(201).json(dashboard)
  } catch (error) {
    console.log('FAILEDDDD')
    console.error('Error creating dashboard:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    console.log('the user id: ', req.auth.sub)
    // TODO: I SHOULD BE DECODONG THE BEARER TOKEN SERVER SIDE TO DETERMINE THE USER
    const dashboards = await Dashboard.find({ userId: req.auth.sub }).lean()
    const transactions = await Transaction.find({userId: req.auth.sub});// go back only 1 year
    const balances = await Balance.find({userId: req.auth.sub}); // go back 1-2 years
    // await BOTH ^ at the same time here and then pass it to the below method
    const aggregatedDataForCharts = getAggregatedDashboardData(
      dashboards,
      transactions,
      balances
    )
    res.status(200).json({ dashboards: [...aggregatedDataForCharts]})
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await Dashboard.findByIdAndDelete(id)
    if (!result) {
      return res.status(404).json({ message: 'Dashboard not found' })
    }
    res.status(200).json({ message: 'Dashboard deleted successfully' })
  } catch (error) {
    console.error('Error deleting dashboard:', error)
    res.status(500).json({ message: 'Server error while deleting dashboard' })
  }
})

module.exports = router
