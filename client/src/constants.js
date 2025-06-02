export const ChartTypes = {
  line: 'line',
  bar: 'bar',
  horizontalBar: 'horizontal-bar'
}

export const TrackingTypes = {
  // ****value must be the same exact value as key****
  savings: {
    value: 'savings',
    friendlyText: 'Savings',
    chartTypes: [ChartTypes.line],
    excludeFromForms: true
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
    value: 'allDining',
    friendlyText: 'All Dining',
    chartTypes: [ChartTypes.bar],
    excludeFromForms: true
  },
  shopping: {
    value: 'shopping',
    friendlyText: 'Shopping',
    chartTypes: [ChartTypes.bar]
  }
}

export const BalanceTypes = {
  savings: {
    value: 'savings',
    friendlyText: 'Savings',
    chartTypes: [ChartTypes.line]
  }
}
