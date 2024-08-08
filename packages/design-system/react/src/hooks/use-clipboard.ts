'use client'

import { useCallback, useState } from 'react'

export const useClipboard = (defaultVal: string) => {
  const [value, setValue] = useState(defaultVal)
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [value])

  return { isCopied, onCopy, setValue, value }
}
