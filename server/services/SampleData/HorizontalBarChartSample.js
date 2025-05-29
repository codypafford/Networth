const mockTransactions = [
  { date: '2024-06-12', amount: 1500, type: 'inflow' }, // paycheck
  { date: '2024-06-14', amount: -250, type: 'outflow' }, // rent
  { date: '2024-06-18', amount: -60, type: 'outflow' }, // groceries
  { date: '2024-07-01', amount: 1600, type: 'inflow' },
  { date: '2024-07-02', amount: -300, type: 'outflow' },
  { date: '2024-07-15', amount: -100, type: 'outflow' },
  { date: '2024-08-01', amount: 1550, type: 'inflow' },
  { date: '2024-08-10', amount: -200, type: 'outflow' },
  { date: '2024-08-15', amount: -150, type: 'outflow' }
]

module.exports = {
    horizontalBarChartMock: mockTransactions
}