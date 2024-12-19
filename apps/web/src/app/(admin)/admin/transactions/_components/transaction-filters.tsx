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
 * TransactionFilters component that handles search and filter parameters
 */
export function TransactionFilters({
  defaultSearchParams,
}: {
  defaultSearchParams: { search?: string; status?: string; type?: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
    (params: Record<string, string>) => {
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
   * Get default search params
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
    const queryString = createQueryString({ search: value })
    router.push(`${pathname}?${queryString}`)
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
    const queryString = createQueryString({ status: value })
    router.push(`${pathname}?${queryString}`)
  }

  /**
   * Handle type filter change
   */
  const handleTypeChange = (value: string) => {
    setType(value)
    const queryString = createQueryString({ type: value })
    router.push(`${pathname}?${queryString}`)
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        {status && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('')}
            className="gap-2 rounded-full"
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
            className="gap-2 rounded-full"
          >
            {type}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={handleStatusChange}>
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

        <Select value={type} onValueChange={handleTypeChange}>
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
