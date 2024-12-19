'use client'

import { Button } from '@design-system/react/components/ui/button'
import { Mail, MessageCircle } from 'lucide-react'
import type { UserSettings } from '@app/modules/src/domain/entities/User'

/**
 * Props for the ContactButtons component
 */
interface ContactButtonsProps {
  email: string
  settings: UserSettings
}

/**
 * ContactButtons component that displays quick contact options
 */
export function ContactButtons({ email, settings }: ContactButtonsProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`
  }

  const handleTelegramClick = () => {
    if (settings?.contact?.telegram) {
      window.open(`https://t.me/${settings.contact.telegram}`, '_blank')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleEmailClick}>
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>
      {settings?.contact?.telegram && (
        <Button variant="outline" size="sm" onClick={handleTelegramClick}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Telegram
        </Button>
      )}
    </div>
  )
}
