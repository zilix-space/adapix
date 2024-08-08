import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

import { CheckCircledIcon } from '@radix-ui/react-icons'
import { getInitialsFromName } from '../../helpers/get-initials-from-name'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

type PersonaProps = {
  src?: string | null
  name?: string | null
  secondaryLabel?: string | null
  isVerified?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  avatarClassName?: string
  personClassName?: string
  href?: string
  imgUnoptimized?: boolean
}

export function Persona(props: PersonaProps): React.ReactElement {
  const Component = props.href ? Link : 'div'

  return (
    <Component
      href={props.href || '#'}
      className={clsx(
        'grid grid-cols-[auto_3fr] gap-2 items-center',
        props.href &&
          'hover:opacity-80 transition-all duration-300 cursor-pointer',
        props.className,
      )}
    >
      <Avatar>
        <AvatarFallback>
          {getInitialsFromName(props.name || 'User')}
        </AvatarFallback>
        <AvatarImage src={props.src || ''} />
      </Avatar>

      <div className={props.personClassName}>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="font-semibold text-sm line-clamp-1">{props.name}</div>
          {props.isVerified && (
            <CheckCircledIcon className="opacity-40 h-3 w-3" />
          )}
        </div>

        {props.size !== 'sm' && props.secondaryLabel && (
          <div className="opacity-60 text-sm line-clamp-1">
            <span>{props.secondaryLabel}</span>
          </div>
        )}
      </div>
    </Component>
  )
}
