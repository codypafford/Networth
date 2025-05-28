const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChartSchema = new Schema({
  filters: { type: Schema.Types.Mixed },           // flexible object for filters
  trackingType: { type: String, enum: ['savings', 'dining', 'shopping', 'moneyInOut'], required: true },
  chartType: { type: String, enum: ['line', 'bar', 'pie', 'horizontal-bar'], required: true },
  options: { type: Schema.Types.Mixed },              // extra options
});

const DashboardSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' }, // TODO: what is ref here for
  name: { type: String, required: true },
  chart: ChartSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dashboard', DashboardSchema);
