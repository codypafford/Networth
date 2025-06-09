const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChartSchema = new Schema({
  filters: { type: Schema.Types.Mixed },           // flexible object for filters
  trackingType: { type: String, enum: ['savings', 'dining', 'jointDining', 'allDining', 'shopping', 'moneyInOut', 'groceries'], required: true },
  chartType: { type: String, enum: ['line', 'bar', 'pie', 'horizontal-bar'], required: true },
  options: { type: Schema.Types.Mixed },              // extra options
});

const ProjectionSchema = new Schema({
  asOfDate: { type: String, required: true },
  amount: { type: Number, required: true }
});

const DashboardSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' }, // ref is used for population (linking to User collection)
  name: { type: String, required: false },
  chart: ChartSchema,
  projections: [ProjectionSchema],  // Add projections here
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dashboard', DashboardSchema);
