'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate } from '../../_utils/format'
import type { User } from '../../_types'
import { Button } from '@design-system/react/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

/**
 * Columns configuration for the users table
 */
export const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <StatusBadge variant={row.original.role} />,
  },
  {
    accessorKey: 'settings.kyc.status',
    header: 'KYC Status',
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.settings?.kyc?.status || 'pending'}
        type="kyc"
      />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
