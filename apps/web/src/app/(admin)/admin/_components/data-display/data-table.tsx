'use client'

import { DataTable as DesignSystemDataTable } from '@design-system/react/components/ui/data-table'
import { cn } from '@design-system/react/helpers/cn'
import { ColumnDef } from '@tanstack/react-table'

/**
 * Data table props interface
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField?: string
  className?: string
  isFooterSticky?: boolean
}

/**
 * Data table component
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchField,
  className,
  isFooterSticky = false,
}: DataTableProps<TData, TValue>) {
  return (
    <DesignSystemDataTable
      className={cn(['w-full', className])}
      columns={columns}
      data={data}
      searchField={searchField}
      isFooterSticky={isFooterSticky}
    />
  )
}
