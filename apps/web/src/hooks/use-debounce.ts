'use client'

import { useState, useEffect } from 'react'

/**
 * Hook personalizado para debounce de valores
 * Útil para reduzir chamadas à API durante digitação
 * 
 * @param value O valor que deve ser debounced
 * @param delay Atraso em milissegundos (padrão: 500ms)
 * @returns O valor após o período de debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}