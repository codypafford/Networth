const ChartTypes = {
  line: 'line',
  bar: 'bar',
  horizontalBar: 'horizontal-bar' // dont use yet
}

const TrackingTypes = {
  savings: {
    value: 'savings',
    friendlyText: 'Savings',
    chartTypes: [ChartTypes.line]
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
  groceries: {
    value: 'groceries',
    friendlyText: 'Groceries',
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
  groceries: [TrackingTypes.groceries.value],
  jointDining: [TrackingTypes.jointDining.value],
  allDining: [TrackingTypes.dining.value, TrackingTypes.jointDining.value],
  shopping: [TrackingTypes.shopping.value]
}

module.exports = {
  ChartTypes,
  TrackingTypes,
  getTrackingTypeGroupings
}
