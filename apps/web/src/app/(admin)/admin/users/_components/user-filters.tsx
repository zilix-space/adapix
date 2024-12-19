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
 * Interface for the UserFilters component props
 */
interface UserFiltersProps {
  defaultSearchParams: {
    search?: string
    role?: string
    status?: string
  }
}

/**
 * UserFilters component that handles search and filter parameters for the users page
 */
export function UserFilters({ defaultSearchParams }: UserFiltersProps) {
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
  const [role, setRole] = useState(getSearchParam('role'))
  const [status, setStatus] = useState(getSearchParam('status'))

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
    setRole(getSearchParam('role'))
    setStatus(getSearchParam('status'))
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
   * Handle role filter change
   */
  const handleRoleChange = (value: string) => {
    setRole(value)
    updateUrl({ role: value || null })
  }

  /**
   * Handle status filter change
   */
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateUrl({ status: value || null })
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        {role && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange('')}
            className="gap-2 rounded-full capitalize"
          >
            {role}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
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
      </div>

      <div className="flex items-center gap-4">
        <Select value={role || ''} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status || ''} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by KYC status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
