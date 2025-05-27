export const ChartTypes = {
    line: 'line',
    bar: 'bar'
}

export const TrackingTypes = {
    // value must be the same exact value as key
    savings: {
        value: 'savings',
        friendlyText: 'Savings',
        // TODO: =add something here to tell it possible chart types like 'line' or 'bar' but for now just line
    },
    dining: {
        value: 'dining',
        friendlyText: 'Eating out'
    },
    shopping: {
        value: 'shopping',
        friendlyText: 'Shopping'
    }
}