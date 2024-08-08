import React from 'react'

import { cn } from '@design-system/react/helpers/cn'

export function Logo(props: { className?: string }): React.ReactElement {
  return (
    <img src="/adapix.svg" alt="Logo" className={cn('h-16', props.className)} />
  )
}
