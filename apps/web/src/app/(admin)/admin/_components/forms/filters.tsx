'use client'

import { Filter } from '../../_types'
import { useAdmin } from '../../_providers/admin-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@design-system/react/components/ui/select'
import { Input } from '@design-system/react/components/ui/input'

/**
 * Filter option interface
 */
interface FilterOption {
  field: string
  label: string
  type: 'select' | 'text'
  options?: {
    value: string
    label: string
  }[]
}

/**
 * Filter props interface
 */
interface FiltersProps {
  module: string
  options: FilterOption[]
}

/**
 * Filters component
 */
export function Filters({ module, options }: FiltersProps) {
  const { filters, setModuleFilters } = useAdmin()
  const moduleFilters = filters[module] || []

  /**
   * Handle filter change
   */
  const handleFilterChange = (field: string, value: string) => {
    const newFilters = moduleFilters.filter((f) => f.field !== field)

    if (value) {
      newFilters.push({
        field,
        value,
        operator: 'eq',
      })
    }

    setModuleFilters(module, newFilters)
  }

  /**
   * Get filter value
   */
  const getFilterValue = (field: string) => {
    const filter = moduleFilters.find((f) => f.field === field)
    const value = filter?.value || ''

    return value as string
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <div key={option.field} className="w-[200px]">
          {option.type === 'select' ? (
            <Select
              value={getFilterValue(option.field)}
              onValueChange={(value) => handleFilterChange(option.field, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={option.label} />
              </SelectTrigger>
              <SelectContent>
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder={option.label}
              value={getFilterValue(option.field)}
              onChange={(e) => handleFilterChange(option.field, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
