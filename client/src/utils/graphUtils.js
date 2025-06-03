import { format, parseISO, addMonths, isAfter, isSameMonth } from 'date-fns'

export function generateProjections(data, projections) {
  if (!data?.length || !projections?.length) return data

  const sorted = [...projections].sort(
    (a, b) => new Date(b.asOfDate) - new Date(a.asOfDate)
  )

  const lastDate = new Date(data[data.length - 1].date)
  const projectionMap = new Map()

  let currentAmount = data[0].totalBalance

  sorted.forEach((projection, index) => {
    const { asOfDate, amount } = projection
    const startDate = parseISO(asOfDate)

    const nextProjection = sorted[index + 1]
    const endDate = nextProjection
      ? addMonths(parseISO(nextProjection.asOfDate), -1) // one month before next projection
      : lastDate

    let currentDate = startDate
    let monthIndex = 0

    while (!isAfter(currentDate, endDate)) {
      const key = format(currentDate, 'yyyy-MM')

      const projected = currentAmount + amount * monthIndex
      if (!projectionMap.has(key)) {
        projectionMap.set(key, projected)
      }

      currentDate = addMonths(currentDate, 1)
      monthIndex++
    }

    // Update currentAmount for next projection
    currentAmount += amount * monthIndex
  })

  return data.map((d) => {
    const key = format(new Date(d.date), 'yyyy-MM')
    return {
      ...d,
      projectedValue: projectionMap.get(key) ?? null
    }
  })
}
