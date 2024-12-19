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
import { getLatestUsersAction } from '../actions'
import { StatusBadge } from '../../_components/data-display/status-badge'
import { formatDate } from '../../_utils/format'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@design-system/react/components/ui/empty-state'
import { Users } from 'lucide-react'

/**
 * LatestUsers component that displays recently registered users
 */
export async function LatestUsers() {
  const { users } = await getLatestUsersAction()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <EmptyState>
            <Users className="h-8 w-8 text-muted-foreground mb-2" />
            <EmptyStateTitle>No users found</EmptyStateTitle>
            <EmptyStateDescription>
              No users have registered yet.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between p-4 rounded-lg border bg-card transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={user.role} />
                    <StatusBadge
                      variant={user.settings?.kyc?.status || 'pending'}
                      type="kyc"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDate(user.createdAt)}
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
