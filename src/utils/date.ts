export const getMonthDays = (year: number, month: number): Date[] => {
  const days: Date[] = []
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= lastDayOfMonth; day++) {
    days.push(new Date(year, month, day))
  }

  return days
}

export const getCurrentWeekDays = (days: Date[], startDate: Date): Date[] => {
  const startDayIndex = days.findIndex((day) => day.toDateString() === startDate.toDateString())

  return startDayIndex !== -1 ? days.slice(startDayIndex, startDayIndex + 7) : []
}

export const getMondayOfCurrentWeek = (date: Date): Date => {
  const dayOfWeek = new Date(date).getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  return new Date(new Date(date).setDate(date.getDate() + diff))
}

export const getDayText = (day: string) => {
  if (!day) return ''

  const today = new Date()
  const customDate = new Date(today.getFullYear(), today.getMonth(), Number(day) + 1)
  const formattedCustomDate = customDate.toISOString().split('T')[0]

  return new Date(formattedCustomDate).toLocaleDateString('en-US', { weekday: 'short' })
}

export const getDay = (day: string) => {
  if (!day) return ''
  return new Date(day).getDate()
}

export const getCurrentDay = () => {
  return new Date().getDate().toString()
}
