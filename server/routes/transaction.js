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
      date,
      name
    })

    await newTransaction.save()
    res
      .status(201)
      .json({ message: 'Transaction created', transaction: newTransaction })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const transactions = await Transaction.find({ userId: req.auth.sub })
      .sort({ _id: -1 }) // or { _id: -1 } if you're not using timestamps
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean()

    const total = await Transaction.countDocuments({ userId: req.auth.sub })

    res.status(200).json({
      data: transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE a transaction by ID
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.sub
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.status(200).json({ message: 'Transaction deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT to update a transaction by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.sub },
      req.body,
      { new: true } // return the updated doc
    )

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.status(200).json(updatedTransaction)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router
