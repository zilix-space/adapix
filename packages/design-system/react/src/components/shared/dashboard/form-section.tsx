import { cn } from '../../../helpers/cn'

export type FormSectionProps = {
  className?: string
  children: React.ReactNode
}

export const FormSection: React.FC<FormSectionProps> = ({
  className,
  children,
}) => {
  return <section className={cn(className)}>{children}</section>
}

export type FormSectionHeaderProps = {
  className?: string
  children: React.ReactNode
}

export const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({
  className,
  children,
}) => {
  return <header className={cn(className, 'mb-8')}>{children}</header>
}

export type FormSectionTitleProps = {
  className?: string
  children: React.ReactNode
}

export const FormSectionTitle: React.FC<FormSectionTitleProps> = ({
  className,
  children,
}) => {
  return <h2 className={cn(className, 'font-bold')}>{children}</h2>
}

export type FormSectionDescriptionProps = {
  className?: string
  children: React.ReactNode
}

export const FormSectionDescription: React.FC<FormSectionDescriptionProps> = ({
  className,
  children,
}) => {
  return (
    <p className={cn(className, 'text-muted-foreground mb-4')}>{children}</p>
  )
}

export type FormSectionMainProps = {
  className?: string
  children: React.ReactNode
}

export const FormSectionMain: React.FC<FormSectionMainProps> = ({
  className,
  children,
}) => {
  return <main className={cn(className, 'space-y-4 mb-8')}>{children}</main>
}

export type FormSectionFooterProps = {
  className?: string
  children: React.ReactNode
}

export const FormSectionFooter: React.FC<FormSectionFooterProps> = ({
  className,
  children,
}) => {
  return <footer className={cn(className)}>{children}</footer>
}
