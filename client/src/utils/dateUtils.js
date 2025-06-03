import { format, parse } from 'date-fns'

// Converts a full date string in ISO format to just the date part since we want to ignore timezones
export const formatUTCDateOnly = (isoString) => {
  const datePart = isoString.substring(0, 10) // 'YYYY-MM-DD'
  const parsedDate = parse(datePart, 'yyyy-MM-dd', new Date())
  return format(parsedDate, 'MMM dd, yyyy')
}

export const getLocalDateString = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, 10)
  return localISOTime
}

export const formatDateStringToFormat = (dateString, formatType = 'yyyy-MM-dd') => {
  const datePart = dateString.substring(0, 10) // 'YYYY-MM-DD'
  const parsedDate = parse(datePart, 'yyyy-MM-dd', new Date())
  return format(parsedDate, formatType)
}


export function formatMonthYear(date) {
  if (!date || !date.includes('-')) return date
  const [year, month] = date.split('-')
  return `${month}-${year}`
}
