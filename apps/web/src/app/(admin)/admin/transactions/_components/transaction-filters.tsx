'use client'

import { Button } from '@design-system/react/components/ui/button'
import { Input } from '@design-system/react/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@design-system/react/components/ui/select'
import { XIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

/**
 * Interface for the TransactionFilters component props
 */
interface TransactionFiltersProps {
  defaultSearchParams: {
    search?: string
    status?: string
    type?: string
  }
}

/**
 * TransactionFilters component that handles search and filter parameters for the transactions page
 */
export function TransactionFilters({
  defaultSearchParams,
}: TransactionFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /**
   * Get search parameter value from URL or default params
   */
  function getSearchParam(key: string) {
    return (
      searchParams.get(key) ||
      defaultSearchParams[key as keyof typeof defaultSearchParams]
    )
  }

  const [search, setSearch] = useState(getSearchParam('search'))
  const [status, setStatus] = useState(getSearchParam('status'))
  const [type, setType] = useState(getSearchParam('type'))

  /**
   * Creates new URLSearchParams with current filters
   */
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value)
        } else {
          newSearchParams.delete(key)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  /**
   * Update URL with new search parameters
   */
  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const queryString = createQueryString(params)
      router.push(`${pathname}?${queryString}`, { scroll: false })
    },
    [createQueryString, pathname, router],
  )

  /**
   * Get default search params on mount and when they change
   */
  useEffect(() => {
    setSearch(getSearchParam('search'))
    setStatus(getSearchParam('status'))
    setType(getSearchParam('type'))
  }, [defaultSearchParams])

  /**
   * Debounced function to update URL with search parameter
   */
  const debouncedSearchUpdate = useDebouncedCallback((value: string) => {
    updateUrl({ search: value || null })
  }, 500)

  /**
   * Handle search input change
   */
  const handleSearchChange = (value: string) => {
    setSearch(value)
    debouncedSearchUpdate(value)
  }

  /**
   * Handle status filter change
   */
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateUrl({ status: value || null })
  }

  /**
   * Handle type filter change
   */
  const handleTypeChange = (value: string) => {
    setType(value)
    updateUrl({ type: value || null })
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search transactions..."
          value={search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        {status && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('')}
            className="gap-2 rounded-full capitalize"
          >
            {status}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
        {type && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTypeChange('')}
            className="gap-2 rounded-full capitalize"
          >
            {type}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select value={status || ''} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING_DEPOSIT">Pending Deposit</SelectItem>
            <SelectItem value="PENDING_EXCHANGE">Pending Exchange</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type || ''} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEPOSIT">Deposit</SelectItem>
            <SelectItem value="WITHDRAW">Withdraw</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
