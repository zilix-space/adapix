type DashboardWrapper = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export function DashboardWrapper({ children, sidebar }: DashboardWrapper) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] min-h-screen overflow-hidden">
      {sidebar}
      <main className="overflow-hidden">{children}</main>
    </div>
  )
}
