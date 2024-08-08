import React, { useEffect, useState } from 'react'

interface DateTimeInputProps {
  onChange?: (value: string) => void
  defaultValue?: string
  value?: string
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  onChange,
  defaultValue,
  value,
}) => {
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  useEffect(() => {
    const initialValue = value || defaultValue
    if (initialValue) {
      const [date, time] = initialValue.split(' ')
      setDateValue(date)
      setTimeValue(time)
    } else {
      const now = new Date()
      const dateNow = now.toISOString().split('T')[0]
      const timeNow = now.toTimeString().split(' ')[0].substring(0, 5)
      setDateValue(dateNow)
      setTimeValue(timeNow)
    }
  }, [value, defaultValue])

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.type === 'date' ? event.target.value : dateValue
    const newTime =
      event.target.type === 'time' ? event.target.value : timeValue

    if (event.target.type === 'date') {
      setDateValue(newValue)
    } else {
      setTimeValue(newTime)
    }

    onChange && onChange(`${newValue} ${newTime}`)
  }

  return (
    <div className="flex items-center space-x-4 mt-2">
      <input
        className="border-none text-foreground/80 focus:text-foreground h-auto px-0 bg-transparent"
        value={dateValue}
        id="publish-date"
        type="date"
        onChange={handleDateTimeChange}
      />
      <input
        className="border-none text-foreground/80 focus:text-foreground h-auto px-0 bg-transparent"
        value={timeValue}
        id="publish-time"
        type="time"
        onChange={handleDateTimeChange}
      />
      <span className="text-sm font-medium text-foreground/40">UTC</span>
    </div>
  )
}
