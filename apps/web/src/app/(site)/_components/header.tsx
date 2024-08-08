import Link from 'next/link'

import { Logo } from '@/app/_components/logo'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'

export function Header() {
  return (
    <header className="">
      <div className="container max-w-screen-xl flex items-center justify-between h-20">
        <div>
          <Link
            href="/"
            className="hover:opacity-60 flex items-center space-x-4"
          >
            <Logo className="h-10" />
          </Link>
        </div>

        <Button asChild>
          <Link
            href="/dapp"
            className="hover:opacity-60 flex items-center space-x-4"
          >
            Acessar a Dapp
            <ArrowRightIcon className="w-4 h-4 ml-4 opacity-40" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
