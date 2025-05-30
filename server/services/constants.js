const ChartTypes = {
  line: 'line',
  bar: 'bar',
  horizontalBar: 'horizontal-bar'
}

const TrackingTypes = {
  savings: {
    value: 'savings',
    friendlyText: 'Savings',
    chartTypes: [ChartTypes.line] // future-proofing
  },
  //   TODO: remove this one
  moneyInOut: {
    value: 'moneyInOut',
    friendlyText: 'Money In / Money Out',
    chartTypes: [ChartTypes.horizontalBar] // TODO: explore other kinds of charts?
  },
  dining: {
    value: 'dining',
    friendlyText: 'Dining Alone',
    chartTypes: [ChartTypes.bar]
  },
  jointDining: {
    value: 'jointDining',
    friendlyText: 'Dining Together',
    chartTypes: [ChartTypes.bar]
  },
  allDining: {
    value: 'all-dining',
    friendlyText: 'All Dining',
    chartTypes: [ChartTypes.bar]
  },
  shopping: {
    value: 'shopping',
    friendlyText: 'Shopping',
    chartTypes: [ChartTypes.bar]
  }
}

const getTrackingTypeGroupings = {
  savings: [TrackingTypes.savings.value],
  dining: [TrackingTypes.dining.value],
  jointDining: [TrackingTypes.jointDining.value],
  allDining: [TrackingTypes.dining.value, TrackingTypes.jointDining.value],
  shopping: [TrackingTypes.shopping.value],
}

module.exports = {
  ChartTypes,
  TrackingTypes,
  getTrackingTypeGroupings
}
