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

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const balances = await Balance.find({ userId: req.auth.sub })
      .sort({ _id: -1 }) // or { _id: -1 } if you're not using timestamps
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean()

    const total = await Balance.countDocuments({ userId: req.auth.sub })

    res.status(200).json({
      data: balances,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE a balance by ID
router.delete('/:id', async (req, res) => {
  try {
    const balance = await Balance.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.sub
    })

    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' })
    }

    res.status(200).json({ message: 'Balance deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT to update a balance by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBalance = await Balance.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.sub },
      req.body,
      { new: true }
    )

    if (!updatedBalance) {
      return res.status(404).json({ message: 'Balance not found' })
    }

    res.status(200).json(updatedBalance)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
