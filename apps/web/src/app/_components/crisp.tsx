'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

const CrispChat = (): React.ReactElement => {
  useEffect(() => {
    const isInIframe = window.self !== window.top
    if (isInIframe) return
    Crisp.configure('e1130098-d25c-4e82-956d-fc93f38cf787')
  })

  return null
}

export default CrispChat
