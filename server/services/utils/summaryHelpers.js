
const { ChartTypes, TrackingTypes } = require('../constants')
const getLineGraphSummary = () => ({
  header: "Summary",
  items: [
    "Total: $15,200",
    "Change Since Last Month: +8.5%",
    "Change Since Last Year: -1.5%",
    "Biggest Gain: +3% in June",
    "Biggest Loss: -0.12% in May"
  ]
});

const getBarGraphSummary = () => ({
  header: "Summary",
  items: [
    "Largest Expense This Month: $250 – Restaurant Orsay",
    "Largest Expense Last Month: $100 – Craft Crab",
    "Most Frequented This Year: Moe's",
    "Total Spent at Moe's: $564.19"
  ]
});

const getHorizontalBarGraphSummary = () => ({
  header: "Summary",
  items: [
    "Net Income This Month: $1,250",
    "Total Income This Month: $3,200",
    "Total Expenses This Month: $1,950",
    "Highest Spending Category: Restaurants ($640)",
    "Biggest Expense: $420 – Rent Payment",
    "Average Monthly Savings: $830"
  ]
});

const getSummaryContent = (data, chartType) => {
  switch (chartType) {
    case ChartTypes.line:
      return getLineGraphSummary()
    case ChartTypes.bar:
      return getBarGraphSummary()
    case ChartTypes.horizontalBar:
      return getHorizontalBarGraphSummary()
    default:
      return null
  }
}

module.exports = {
  getSummaryContent
}
