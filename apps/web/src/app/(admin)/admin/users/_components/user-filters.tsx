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
 * UserFilters component that handles search and filter parameters
 */
export function UserFilters({
  defaultSearchParams,
}: {
  defaultSearchParams: { search?: string; role?: string; status?: string }
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
  const [role, setRole] = useState(getSearchParam('role'))
  const [kycStatus, setKycStatus] = useState(getSearchParam('status'))

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
    setRole(getSearchParam('role'))
    setKycStatus(getSearchParam('status'))
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
   * Handle role filter change
   */
  const handleRoleChange = (value: string) => {
    setRole(value)
    const queryString = createQueryString({ role: value })
    router.push(`${pathname}?${queryString}`)
  }

  /**
   * Handle KYC status filter change
   */
  const handleKycStatusChange = (value: string) => {
    setKycStatus(value)
    const queryString = createQueryString({ kycStatus: value })
    router.push(`${pathname}?${queryString}`)
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        {role && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleChange('')}
            className="gap-2 rounded-full "
          >
            {role}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
        {kycStatus && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleKycStatusChange('')}
            className="gap-2 rounded-full"
          >
            {kycStatus}
            <XIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={kycStatus} onValueChange={handleKycStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by KYC status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
