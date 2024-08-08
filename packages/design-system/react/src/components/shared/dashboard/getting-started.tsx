import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ProgressProps } from '@radix-ui/react-progress'
import React, { PropsWithChildren } from 'react'
import { cn } from '../../../helpers/cn'
import { Button } from '../../ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../ui/card'
import { Progress } from '../../ui/progress'

const GettingStartedCard: React.FC<PropsWithChildren> = ({ children }) => {
  return <Card>{children}</Card>
}

const GettingStartedCardHeader: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <CardHeader className="grid grid-cols-[3fr_1fr] gap-4 items-center">
      {children}
    </CardHeader>
  )
}

const GettingStartedCardTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return <CardTitle className="text-sm">{children}</CardTitle>
}

const GettingStartedProgressBar: React.FC<ProgressProps> = ({
  className,
  ...rest
}) => {
  return <Progress className={cn('h-2', className)} {...rest} />
}

const GettingStartedMain: React.FC<PropsWithChildren> = ({ children }) => {
  return <CardContent>{children}</CardContent>
}

const GettingStartedStep: React.FC<
  PropsWithChildren<{
    finished?: boolean
  }>
> = ({ children, finished }) => {
  return (
    <button
      className={cn([
        'p-4 hover:bg-black/5 border border-border flex items-center justify-between w-full transition-all first:rounded-md-t-lg last:rounded-md-b-lg last:border-b border-b-0',
        finished && '!opacity-60 pointer-events-none',
      ])}
    >
      {children}
    </button>
  )
}

const GettingStartedStepIcon: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="flex items-center justify-center h-8 w-8 border border-border rounded-md mr-4">
      {children}
    </span>
  )
}

const GettingStartedStepContent: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <div className="flex-1 flex flex-col items-start">{children}</div>
}

const GettingStartedStepTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return <strong className="text-sm">{children}</strong>
}

const GettingStartedStepDescription: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <small className="text-sm opacity-60">{children}</small>
}

const GettingStartedStepArrow: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 opacity-60">
      <ChevronRightIcon className="w-4 h-4" />
    </div>
  )
}

const GettingStartedFooter: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CardFooter className="flex items-center justify-between bg-black/5 border-t border-border px-6 pt-2 pb-2">
      {children}
    </CardFooter>
  )
}

const GettingStartedFooterMessage: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <span className="opacity-60 text-sm">{children}</span>
}

const GettingStartedFooterButton: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <Button variant="ghost">{children}</Button>
}

export {
    GettingStartedCard,
    GettingStartedCardHeader,
    GettingStartedCardTitle,
    GettingStartedFooter,
    GettingStartedFooterButton,
    GettingStartedFooterMessage,
    GettingStartedMain,
    GettingStartedProgressBar,
    GettingStartedStep,
    GettingStartedStepArrow,
    GettingStartedStepContent,
    GettingStartedStepDescription,
    GettingStartedStepIcon,
    GettingStartedStepTitle
}

