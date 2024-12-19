import { Card, CardHeader } from '@design-system/react/components/ui/card'
import { PercentIcon } from 'lucide-react'

export function WalletAlert() {
  return (
    <section>
      <main className="space-y-8">
        <Card className="bg-background">
          <CardHeader className="flex flex-row justify-between p-4">
            <div className="flex items-center space-x-4">
              <PercentIcon className="w-4 h-4" />
              <strong className="text-sm">Taxa reduzida</strong>
            </div>

            <div className="space-x-2 text-sm">
              <span className="text-muted-foreground line-through">8,00%</span>
              <span>6,50%</span>
            </div>
          </CardHeader>
        </Card>
      </main>
    </section>
  )
}
