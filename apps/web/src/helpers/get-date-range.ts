import { endOfMonth, startOfMonth } from 'date-fns'

export const getDateRange = (dateRange: string | undefined) => {
  const defaultStartDate = startOfMonth(new Date())
  const defaultEndDate = endOfMonth(new Date())

  if (!dateRange) {
    return { startDate: defaultStartDate, endDate: defaultEndDate }
  }

  const [startDateString, endDateString] = dateRange.split(',')
  const startDate = startDateString
    ? new Date(startDateString)
    : defaultStartDate
  const endDate = endDateString ? new Date(endDateString) : defaultEndDate

  return { startDate, endDate }
}
