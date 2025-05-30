const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' },  // assuming you want to associate transactions with a user
  amount: { type: Number, required: true },
  category: { type: String, required: true },             // e.g., dining, shopping, savings, etc.
  date: { type: Date, required: true },
  name: { type: String, required: true },                 // transaction name or description
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
