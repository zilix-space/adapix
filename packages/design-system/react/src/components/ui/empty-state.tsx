import React from 'react'

type EmptyStateProps = {
  children: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ children }) => {
  return (
    <div className="bg-black/10 flex flex-col items-center justify-center border border-dotted border-spacing-2 rounded-md-xl p-8 border-border">
      {children}
    </div>
  )
}

export const EmptyStateTitle: React.FC<EmptyStateProps> = ({ children }) => {
  return <h2 className="text-sm font-semibold">{children}</h2>
}

export const EmptyStateDescription: React.FC<EmptyStateProps> = ({
  children,
}) => {
  return <p className="text-sm text-gray-500">{children}</p>
}
