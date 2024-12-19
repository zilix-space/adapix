import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@design-system/react/components/ui/card'
import Link from 'next/link'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { getLatestKYCSubmissionsAction } from '../actions'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate } from '../../_utils/format'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@design-system/react/components/ui/empty-state'
import { ShieldCheck } from 'lucide-react'

/**
 * LatestKYC component that displays recent KYC submissions
 */
export async function LatestKYC() {
  const { submissions } = await getLatestKYCSubmissionsAction()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest KYC Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <EmptyState>
            <ShieldCheck className="h-8 w-8 text-muted-foreground mb-2" />
            <EmptyStateTitle>No KYC submissions</EmptyStateTitle>
            <EmptyStateDescription>
              No pending KYC submissions to review.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Link
                key={submission.id}
                href={`/admin/users/${submission.id}`}
                className="flex items-center justify-between p-4 rounded-lg border bg-card transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={submission.image} />
                    <AvatarFallback>
                      {submission.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {submission.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusBadge
                    variant={submission.settings?.kyc?.status || 'pending'}
                    type="kyc"
                  />
                  <p className="text-xs text-muted-foreground">
                    {/* @ts-expect-error */}
                    {formatDate(submission.updatedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
