const express = require('express')
const router = express.Router()
const Balance = require('../models/Balances')

// POST /balance - create new balance
router.post('/', async (req, res) => {
  try {
    const { amount, asOfDate } = req.body

    // Basic validation
    if (!amount || !asOfDate) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newBalance = new Balance({
      userId: req.auth.sub,
      amount,
      asOfDate
    })

    await newBalance.save()
    res.status(201).json({ message: 'Balance created', balance: newBalance })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router
