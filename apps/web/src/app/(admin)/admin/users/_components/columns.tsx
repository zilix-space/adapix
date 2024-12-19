'use client'

import Link from 'next/link'

import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate } from '../../_utils/format'
import type { User } from '../../_types'
import { Button } from '@design-system/react/components/ui/button'
import {
  ArrowRight,
  EyeIcon,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  UserIcon,
} from 'lucide-react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@design-system/react/components/ui/avatar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@design-system/react/components/ui/popover'

/**
 * Columns configuration for the users table
 */
export const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original

      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.image} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <p className="font-medium text-xs">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="divide-y divide-border/30 space-y-2 px-4">
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground/70" />
                    Role
                  </span>
                  <span className="font-medium">
                    <StatusBadge variant={user.role} type="role" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground/70" />
                    KYC Status
                  </span>
                  <span className="font-medium">
                    <StatusBadge
                      variant={user.settings?.kyc.status}
                      type="kyc"
                    />
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground/70" />
                    Phone
                  </span>
                  <span className="font-medium">
                    {user.settings?.contact.phone || 'Not provided'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground/70" />
                    Telegram
                  </span>
                  <span className="font-medium">
                    {user.settings?.contact.telegram || 'Not provided'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground/70" />
                    Document
                  </span>
                  <span className="font-medium">
                    {user.settings?.kyc.data.document || 'Not provided'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/70" />
                    Location
                  </span>
                  <span className="font-medium">
                    {user.settings?.kyc.data.address.city || 'Not provided'}
                  </span>
                </div>
              </div>

              <footer className="p-4 border-t">
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href={`/admin/users/${user.id}`}>
                    View User Details <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </footer>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
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
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    },
  },
]
