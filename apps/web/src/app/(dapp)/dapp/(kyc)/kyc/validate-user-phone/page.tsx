'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { useActionForm } from '@/services/actions/lib/client'
import { updateUserPhoneKycSchema } from './schema'
import {
  DappPage,
  DappPageFooter,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { updateUserPhoneKyc } from './actions'
import { useApplication } from '@/hooks/use-application'
import { PhoneInput } from '@design-system/react/components/ui/phone-input'
import { ArrowRightIcon } from 'lucide-react'

export default function Page() {
  const application = useApplication()

  const form = useActionForm({
    action: updateUserPhoneKyc,
    schema: updateUserPhoneKycSchema,
    reValidateMode: 'onChange',
    defaultValues: {
      phone: application.session.user.settings.contact.phone,
    },
    onSubmitSuccess: ({ redirect }) => {
      window.location.href = redirect
    },
  })

  return (
    <Form className="h-full" {...form}>
      <DappPage className="flex flex-col justify-between">
        <DappPageHeader className="flex flex-col items-start justify-start space-y-4">
          <DappPageHeaderBackButton
            className="relative"
            href="/dapp/kyc/validate-user-address"
          />
          <DappPageHeaderTitle className="text-xl">
            Agora, precisamos saber seu telefone
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PhoneInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DappPageMain>
        <DappPageFooter className="mt-auto">
          <Button
            className="w-full h-12"
            disabled={!form.formState.isValid || form.actionState.isSubmitting}
          >
            Continuar
            <ButtonIcon
              isLoading={form.actionState.isSubmitting}
              icon={ArrowRightIcon}
              className="w-4 h-4 ml-auto"
            />
          </Button>
        </DappPageFooter>
      </DappPage>
    </Form>
  )
}
