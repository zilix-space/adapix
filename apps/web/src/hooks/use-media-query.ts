import { useEffect, useState } from "react"

export const useMediaQuery = (query: string) => {
  const mediaQuery = window.matchMedia(query)

  const [matches, setMatches] = useState(mediaQuery.matches)

  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mediaQuery])

  return matches
}