import { useState } from 'react'

interface Address {
  state: string
  city: string
  neighborhood: string
  street: string
}

export function useCep() {
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const retrieve = async (cep: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)

      if (!response.ok) {
        throw new Error('Failed to fetch address')
      }

      const data = await response.json()
      setAddress({
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { address, loading, error, retrieve }
}
