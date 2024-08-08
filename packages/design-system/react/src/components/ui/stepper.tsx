import { ArrowRight, Loader2Icon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { Button } from './button'

export const Stepper = (props: PropsWithChildren) => {
  return (
    <section className="flex flex-col h-full space-y-8">
      {props.children}
    </section>
  )
}

export const StepperHeader = (props: PropsWithChildren) => {
  return (
    <header className="animate-fade-up animate-delay-300 animate-once animate-ease-in-out">
      {props.children}
    </header>
  )
}

export const StepperHeaderStepCounter = (props: PropsWithChildren) => {
  return (
    <small className="font-bold uppercase opacity-40">{props.children}</small>
  )
}

export const StepperHeaderTitle = (props: PropsWithChildren) => {
  return <h1 className="font-bold">{props.children}</h1>
}

export const StepperHeaderDescription = (props: PropsWithChildren) => {
  return <p className="opacity-60">{props.children}</p>
}

export const StepperBody = (props: PropsWithChildren) => {
  return (
    <main className="space-y-4 animate-fade-up animate-delay-500 animate-once animate-ease-in-out">
      {props.children}
    </main>
  )
}

export const StepperFooter = (
  props: PropsWithChildren<{
    className?: string
  }>,
) => {
  return (
    <footer className="flex items-center space-x-2 animate-fade-up animate-delay-700 animate-once animate-ease-in-out">
      {props.children}
    </footer>
  )
}

export const StepperSubmitButton = (
  props: PropsWithChildren<{ isLoading: boolean; isDisabled?: boolean }>,
) => {
  return (
    <Button type="submit" disabled={props.isLoading || props.isDisabled}>
      {props.children}

      {!props.isLoading && <ArrowRight className="w-3 h-3 ml-2" />}
      {props.isLoading && <Loader2Icon className="w-3 h-3 ml-2 animate-spin" />}
    </Button>
  )
}
