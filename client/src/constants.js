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
