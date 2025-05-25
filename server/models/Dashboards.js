const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChartSchema = new Schema({
  id: { type: String, required: true },
  filters: { type: Schema.Types.Mixed },           // flexible object for filters
  type: { type: String, enum: ['networth', 'category'], required: true },
  chartType: { type: String, enum: ['line', 'bar', 'pie'], required: true },
  options: { type: Schema.Types.Mixed },              // extra options
});

const DashboardSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  charts: [ChartSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dashboard', DashboardSchema);
