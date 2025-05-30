const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')

// POST /transaction - create new transaction
router.post('/', async (req, res) => {
  try {
    const { category, amount, date, name } = req.body

    // Basic validation
    if (!category || !amount || !date || !name) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newTransaction = new Transaction({
      userId: req.auth.sub,
      category,
      amount,
      date: new Date(date),
      name,
    })

    await newTransaction.save()
    res.status(201).json({ message: 'Transaction created', transaction: newTransaction })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router
