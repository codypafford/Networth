const ChartTypes = {
  line: 'line',
  bar: 'bar',
  horizontalBar: 'horizontal-bar'
}

const TrackingTypes = {
  // *value must be the same exact value as key*
  savings: {
    value: 'savings',
    friendlyText: 'Savings',
    chartTypes: [ChartTypes.line] // future-proofing
  },
//   TODO: this is a perfect canddidate for JOINT tracking (me and kayla)
  moneyInOut: {
    value: 'moneyInOut',
    friendlyText: 'Money In / Money Out',
    chartTypes: [ChartTypes.horizontalBar] // TODO: explore other kinds of charts?
  },
  //   TODO: this is a perfect canddidate for JOINT tracking (me and kayla)
  dining: {
    value: 'dining',
    friendlyText: 'Eating out',
    chartTypes: [ChartTypes.bar]
  },
  shopping: {
    value: 'shopping',
    friendlyText: 'Shopping',
    chartTypes: [ChartTypes.bar]
  }
}

module.exports = {
    ChartTypes,
    TrackingTypes
}
