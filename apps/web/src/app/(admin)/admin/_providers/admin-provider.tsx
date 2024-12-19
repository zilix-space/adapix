'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { AdminUser, Filter } from '../_types'

/**
 * Admin context interface
 */
interface AdminContextData {
  filters: Record<string, Filter[]>
  setModuleFilters: (module: string, filters: Filter[]) => void
  clearModuleFilters: (module: string) => void
  selectedItems: Record<string, string[]>
  setSelectedItems: (module: string, items: string[]) => void
  clearSelectedItems: (module: string) => void
}

const AdminContext = createContext<AdminContextData>({} as AdminContextData)

/**
 * Admin provider component
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Record<string, Filter[]>>({})
  const [selectedItems, setSelectedItemsState] = useState<
    Record<string, string[]>
  >({})

  const setModuleFilters = useCallback(
    (module: string, moduleFilters: Filter[]) => {
      setFilters((state) => ({
        ...state,
        [module]: moduleFilters,
      }))
    },
    [],
  )

  const clearModuleFilters = useCallback((module: string) => {
    setFilters((state) => {
      const newState = { ...state }
      delete newState[module]
      return newState
    })
  }, [])

  const setSelectedItems = useCallback((module: string, items: string[]) => {
    setSelectedItemsState((state) => ({
      ...state,
      [module]: items,
    }))
  }, [])

  const clearSelectedItems = useCallback((module: string) => {
    setSelectedItemsState((state) => {
      const newState = { ...state }
      delete newState[module]
      return newState
    })
  }, [])

  return (
    <AdminContext.Provider
      value={{
        filters,
        setModuleFilters,
        clearModuleFilters,
        selectedItems,
        setSelectedItems,
        clearSelectedItems,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

/**
 * Hook to use admin context
 */
export function useAdmin() {
  const context = useContext(AdminContext)

  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }

  return context
}
