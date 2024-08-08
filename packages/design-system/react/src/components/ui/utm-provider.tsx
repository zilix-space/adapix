'use client'

import { useEffect } from "react"
import { useUTM } from "../../hooks/use-utm"

export const UTMProvider = () => {
  const { values } = useUTM()

  useEffect(() => {
    console.log(values)
  }, [values])

  return <></>
}