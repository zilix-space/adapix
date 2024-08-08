import { useState, useEffect, Dispatch, SetStateAction } from "react"

function getStoredValue<T>(key: string, initialState: T): T {
  const storedValue = localStorage.getItem(key)
  return storedValue ? JSON.parse(storedValue) : initialState
}

export function useLocalStorageState<T>(key: string, initialState: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => getStoredValue(key, initialState))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}