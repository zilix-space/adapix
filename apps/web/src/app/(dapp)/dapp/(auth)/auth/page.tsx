import {
  WidgetStepper,
  WidgetStepperHeader,
  WidgetStepperHeaderTitle,
  WidgetStepperBody,
} from '@design-system/react/components/ui/widget-stepper'
import { AuthForm } from './_components/auth-form'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default function Page() {
  return (
    <WidgetStepper>
      <WidgetStepperHeader
        className="grid grid-cols-[auto_1fr_auto]"
        hasBackButton
      >
        <WidgetStepperHeaderTitle>Qual seu e-mail?</WidgetStepperHeaderTitle>
      </WidgetStepperHeader>
      <WidgetStepperBody>
        <AuthForm />
      </WidgetStepperBody>
    </WidgetStepper>
  )
}
