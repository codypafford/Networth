const mongoose = require('mongoose');
const { Schema } = mongoose;

const BalanceSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  asOfDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BalanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Balance', BalanceSchema);
