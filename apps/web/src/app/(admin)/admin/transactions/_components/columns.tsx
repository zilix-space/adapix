'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowDownLeft,
  ArrowUpRight,
  MapPin,
  Shield,
  MoreHorizontal,
  UserIcon,
  MessageCircle,
  Phone,
  ArrowRight,
  EyeIcon,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { Button } from '@design-system/react/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@design-system/react/components/ui/dropdown-menu'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate, formatCurrency } from '../../_utils/format'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@design-system/react/components/ui/popover'
import Link from 'next/link'
import { TransactionSheet } from './transaction-sheet'
import { User } from '../../_types'

/**
 * Transaction type definition
 */
export type Transaction = {
  id: string
  type: 'DEPOSIT' | 'WITHDRAW'
  status:
    | 'PENDING_DEPOSIT'
    | 'PENDING_EXCHANGE'
    | 'PENDING_PAYMENT'
    | 'COMPLETED'
    | 'EXPIRED'
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeId: string
  exchangeAddress: string
  paymentId: string
  paymentAddress: string
  addressToReceive: string
  completedAt?: Date | string
  expiresAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  user: User
}

/**
 * Transaction table columns configuration
 */
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string

      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-muted">
            {type === 'DEPOSIT' ? (
              <ArrowDownLeft className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-red-500" />
            )}
          </div>
          <span className="font-medium">{type}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.getValue('user') as Transaction['user']

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
                <p className="text-sm text-muted-foreground">
                  •••••@{user.email.split('@')[1]}
                </p>
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
    accessorKey: 'fromAmount',
    header: 'From Amount',
    cell: ({ row }) => {
      const amount = row.getValue('fromAmount') as number
      const currency = row.original.fromCurrency

      return (
        <div className="font-medium">{formatCurrency(amount, currency)}</div>
      )
    },
  },
  {
    accessorKey: 'toAmount',
    header: 'To Amount',
    cell: ({ row }) => {
      const amount = row.getValue('toAmount') as number
      const currency = row.original.toCurrency

      return (
        <div className="font-medium">{formatCurrency(amount, currency)}</div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      return (
        <StatusBadge variant={status.toLowerCase() as any} type="transaction" />
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date

      return (
        <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center space-x-4">
          <TransactionSheet
            transaction={transaction as any}
            user={transaction.user}
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">View details</span>
              <EyeIcon className="h-4 w-4" />
            </Button>
          </TransactionSheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.exchangeId)
                }
              >
                Copy exchange ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.paymentId)
                }
              >
                Copy payment ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
