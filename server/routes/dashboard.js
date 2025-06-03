const express = require('express')
const router = express.Router()
const Dashboard = require('../models/Dashboards')
const Transaction = require('../models/Transactions')
const Balance = require('../models/Balances')
const { getAggregatedDashboardData, getSingleChartSummary } = require('../services/dashboards')
const { ChartTypes } = require('../services/constants')
// const checkJwt = require('./auth/checkJwt');

// POST /dashboard - create new dashboard
router.post('/', async (req, res) => {
  try {
    // TODO: I SHOULD BE DECODONG THE BEARER TOKEN SERVER SIDE TO DETERMINE THE USER

    const { name = '', chart } = req.body
    if (!chart) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const dashboard = new Dashboard({ userId: req.auth.sub, name, chart })
    await dashboard.save()

    res.status(201).json(dashboard)
  } catch (error) {
    console.error('Error creating dashboard:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET dashboards
router.get('/', async (req, res) => {
  try {
    // TODO: I SHOULD BE DECODONG THE BEARER TOKEN SERVER SIDE TO DETERMINE THE USER
    const dashboards = await Dashboard.find({ userId: req.auth.sub }).lean()
    const transactions = await Transaction.find({ userId: req.auth.sub }).lean() // go back only 1 year
    const balances = await Balance.find({ userId: req.auth.sub }) // go back 1-2 years
    // await BOTH ^ at the same time here and then pass it to the below method
    const aggregatedDataForCharts = getAggregatedDashboardData(
      dashboards,
      transactions,
      balances
    )

    res.status(200).json({ dashboards: [...aggregatedDataForCharts] })
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

router.put('/update-title', async (req, res) => {
  try {
    const { newTitle = '', dashboardId } = req.body

    if (!dashboardId) {
      return res.status(400).json({ error: 'Missing newTitle or dashboardId' })
    }

    const updated = await Dashboard.findOneAndUpdate(
      { _id: dashboardId, userId: req.auth.sub },
      { name: newTitle },
      { new: true }
    )

    if (!updated) {
      return res
        .status(404)
        .json({ error: 'Dashboard not found or not owned by user' })
    }

    res.status(200).json(updated)
  } catch (error) {
    console.error('Error updating dashboard title:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const dashboard = await Dashboard.findOne({
      _id: id,
      userId: req.auth.sub
    }).lean()
    if (!dashboard) {
      return res.status(404).json({ error: 'No dashboard found' })
    }

    // TODO: this should be edited to make sure that it always matches the data returnede from the other query like same date range
    let data = {}
    if (dashboard.chart.chartType === ChartTypes.line) {
      data = await Balance.find({ userId: req.auth.sub }).lean()
    } else {
      data = await Transaction.find({ userId: req.auth.sub }).lean()
    }
    // TODO: await BOTH ^ at the same time here and then pass it to the below method
    const aggregatedDataForChart = getSingleChartSummary(dashboard, data) // TODO: must be cleaned and renamed here

    res.status(200).json({ ...aggregatedDataForChart })
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/add-projection/:id', async (req, res) => {
  const { id } = req.params;
  const { projection } = req.body; // Expect a single projection object
  if (
    !projection ||
    typeof projection !== 'object' ||
    !projection.asOfDate ||
    typeof projection.amount !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid projection data' });
  }

  try {
    // Use $push to add the projection to the array; $setOnInsert to create array if doesn't exist
    const updatedDashboard = await Dashboard.findByIdAndUpdate(
      id,
      { $push: { projections: projection } },
      { new: true, upsert: false } // new: return updated doc; upsert false to not create new doc
    );

    if (!updatedDashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.status(200).json({ message: 'Projection added successfully', dashboard: updatedDashboard });
  } catch (error) {
    console.error('Error adding projection:', error);
    res.status(500).json({ message: 'Server error while adding projection' });
  }
});

router.get('/projections/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dashboard = await Dashboard.findById(id).select('projections');

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.status(200).json({ projections: dashboard.projections || [] });
  } catch (error) {
    console.error('Error fetching projections:', error);
    res.status(500).json({ message: 'Server error while fetching projections' });
  }
});

// DELETE /api/dashboards/:dashboardId/projections/:projectionId
router.delete('/:dashboardId/projections/:projectionId', async (req, res) => {
  const { dashboardId, projectionId } = req.params;

  try {
    const dashboard = await Dashboard.findById(dashboardId);
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    // Ensure projections array exists
    dashboard.projections = dashboard.projections || [];

    // Remove the projection with matching id
    const originalLength = dashboard.projections.length;
    dashboard.projections = dashboard.projections.filter(
      (proj) => proj.id !== projectionId
    );

    if (dashboard.projections.length === originalLength) {
      return res.status(404).json({ message: 'Projection not found' });
    }

    await dashboard.save();

    res.status(200).json({ message: 'Projection deleted successfully', projections: dashboard.projections });
  } catch (error) {
    console.error('Error deleting projection:', error);
    res.status(500).json({ message: 'Server error while deleting projection' });
  }
});


module.exports = router
