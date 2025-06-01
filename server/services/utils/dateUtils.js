const { formatInTimeZone } = require('date-fns-tz')

function isoDateStringFormatter(
  date,
  format = 'yyyy-MM-dd',
  timezone = 'UTC'
) {
  return formatInTimeZone(new Date(date), timezone, format)
}

module.exports = {
  isoDateStringFormatter
}
