'use client'

import { useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@design-system/react/components/ui/sheet'
import { formatDate, formatCurrency } from '../../_utils/format'
import { Transaction } from './columns'
import {
  Clock,
  RefreshCw,
  Timer,
  CheckCircle,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRight,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  UserIcon,
} from 'lucide-react'
import { Button } from '@design-system/react/components/ui/button'
import Link from 'next/link'
import { StatusBadge } from '../../_components/data-display/status-badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import type { User } from '../../_types'

/**
 * TransactionSheet component props
 */
interface TransactionSheetProps {
  transaction: Transaction
  user?: User
  children: React.ReactNode
}

/**
 * TransactionSheet component that displays transaction details in a sheet
 */
export function TransactionSheet({
  transaction,
  user,
  children,
}: TransactionSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const statusVariants = {
    PENDING_DEPOSIT: {
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      text: 'Pending Deposit',
    },
    PENDING_EXCHANGE: {
      icon: <RefreshCw className="h-4 w-4 text-blue-500" />,
      text: 'Pending Exchange',
    },
    PENDING_PAYMENT: {
      icon: <Timer className="h-4 w-4 text-orange-500" />,
      text: 'Pending Payment',
    },
    COMPLETED: {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: 'Completed',
    },
    EXPIRED: {
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      text: 'Expired',
    },
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-xl overflow-y-auto h-full">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* User Info */}
          {user && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Information
              </h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={transaction.user.image} />
                    <AvatarFallback>
                      {transaction.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="font-medium text-xs">
                      {transaction.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.user.email}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-border/30 space-y-2">
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground/70" />
                      Role
                    </span>
                    <span className="font-medium">
                      <StatusBadge
                        variant={transaction.user.role}
                        type="role"
                      />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground/70" />
                      KYC Status
                    </span>
                    <span className="font-medium">
                      <StatusBadge
                        variant={transaction.user.settings?.kyc.status}
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
                      {transaction.user.settings?.contact.phone ||
                        'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground/70" />
                      Telegram
                    </span>
                    <span className="font-medium">
                      {transaction.user.settings?.contact.telegram ||
                        'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground/70" />
                      Document
                    </span>
                    <span className="font-medium">
                      {transaction.user.settings?.kyc.data.document ||
                        'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground/70" />
                      Location
                    </span>
                    <span className="font-medium">
                      {transaction.user.settings?.kyc.data.address.city ||
                        'Not provided'}
                    </span>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href={`/admin/users/${transaction.user.id}`}>
                    View User Details <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Transaction Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Transaction Information
            </h3>
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Type</p>
                  <div className="flex items-center gap-1">
                    {transaction.type === 'DEPOSIT' ? (
                      <ArrowDownCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {transaction.type}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center gap-1 mt-1">
                  {statusVariants[transaction.status].icon}
                  <span className="text-sm text-muted-foreground">
                    {statusVariants[transaction.status].text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Amount Details
            </h3>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(
                      transaction.fromAmount,
                      transaction.fromCurrency,
                    )}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(
                      transaction.toAmount,
                      transaction.toCurrency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Details */}
          <div className="space-y-2">
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Exchange Details
              </h3>
            </header>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div>
                <p className="text-sm font-medium">Exchange ID</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.exchangeId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Exchange Address</p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground truncate">
                    {transaction.exchangeAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Payment Details
            </h3>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div>
                <p className="text-sm font-medium">Payment ID</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.paymentId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground truncate">
                    {transaction.paymentAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Receiving Address */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Receiving Address
            </h3>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground truncate">
                  {transaction.addressToReceive}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Timeline
            </h3>
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              {transaction.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.completedAt)}
                    </p>
                  </div>
                </div>
              )}

              {transaction.expiresAt && (
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Expires</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.expiresAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
