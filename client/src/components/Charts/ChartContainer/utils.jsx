import { ChartTypes } from '../../../constants'

const getLineGraphSummary = () => (
  <div>
    <h4>Summary</h4>
    <p>Total: $15,200</p>
    <p>Change Since Last Month: +8.5%</p>
    <p>Change Since Last Year: -1.5%</p>
    <p>Biggest Gain: +3% in June</p>
    <p>Biggest Loss: -0.12% in May</p>
  </div>
)

const getBarGraphSummary = () => (
  <div>
    <h4>Summary</h4>
    <p>Largest Expense This Month: $250 – Restaurant Orsay</p>
    <p>Largest Expense Last Month: $100 – Craft Crab</p>
    <p>Most Frequented This Year: Moe's</p>
    <p>Total Spent at Moe's: $564.19</p>
  </div>
)

const getHorizontalBarGraphSummary = () => (
  <div>
    <h4>Summary</h4>
    <p>Net Income This Month: $1,250</p>
    <p>Total Income This Month: $3,200</p>
    <p>Total Expenses This Month: $1,950</p>
    <p>Highest Spending Category: Restaurants ($640)</p>
    <p>Biggest Expense: $420 – Rent Payment</p>
    <p>Average Monthly Savings: $830</p>
  </div>
)

export const getSummaryContent = (chartType) => {
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


