import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { cn } from '../../helpers/cn'
import { isEqual } from 'date-fns'

export interface HeatmapValue {
  date: Date // ISO string "YYYY-MM-DD"
  count: number
}

export interface HeatmapProps {
  data: HeatmapValue[]
}

export function Heatmap({ data }: HeatmapProps) {
  const today = new Date()

  const sixMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    today.getDate(),
  )

  const months = []
  // eslint-disable-next-line no-unmodified-loop-condition
  for (let m = sixMonthsAgo; m <= today; m.setMonth(m.getMonth() + 1)) {
    months.push(new Date(m))
  }

  const getColorClass = (date: Date) => {
    const found = data.find((d) => isEqual(d.date, date))
    if (!found) return 'rgb(255, 255, 255, 0.1)'

    const count = found.count
    if (count === 0) return 'rgba(255, 235, 230, 0.1)'
    if (count <= 1) return 'rgba(255, 204, 188, 0.2)'
    if (count <= 2) return 'rgba(255, 173, 145, 0.4)'
    if (count <= 3) return 'rgba(255, 142, 103, 0.6)'
    if (count <= 4) return 'rgba(255, 111, 61, 0.8)'
    return 'rgba(255, 80, 20, 1)'
  }

  const formatYmd = (date: Date) => date.toISOString().split('T')[0]

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-1">
        {months.map((month) => {
          return Array.from(
            {
              length: new Date(
                month.getFullYear(),
                month.getMonth() + 1,
                0,
              ).getDate(),
            },
            (_, i) => {
              const dayDate = new Date(
                month.getFullYear(),
                month.getMonth(),
                i + 1,
              )

              const dayKey = formatYmd(dayDate)
              const date = data.find((d) => isEqual(d.date, dayDate))

              return (
                <TooltipProvider key={dayKey}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn([`w-4 h-4 rounded-md`])}
                        style={{
                          background: getColorClass(dayDate),
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Activity in {dayKey}: {date?.count ?? 0}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            },
          )
        })}
      </div>
    </div>
  )
}
