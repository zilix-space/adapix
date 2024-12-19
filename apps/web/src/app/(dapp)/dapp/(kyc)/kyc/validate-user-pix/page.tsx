'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { useActionForm } from '@/services/actions/lib/client'
import { updateUserPixKycSchema } from './schema'
import {
  DappPage,
  DappPageFooter,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { updateUserPixKyc } from './actions'
import { useApplication } from '@/hooks/use-application'
import { Input } from '@design-system/react/components/ui/input'
import { ArrowRightIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  const application = useApplication()

  const form = useActionForm({
    action: updateUserPixKyc,
    schema: updateUserPixKycSchema,
    reValidateMode: 'onChange',
    defaultValues: {
      pix: application.session.user.settings.payment.pix,
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
            href="/dapp/kyc/validate-user-phone"
          />
          <DappPageHeaderTitle className="text-xl">
            Aproveite para adicionar sua Chave PIX para receber pagamentos
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="pix"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel>Chave PIX</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: email@email.com, 12345678909, +5511999999999"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  A conta bancária associada a esta chave deve ter o mesmo
                  titular e CPF da conta do seu usuário.
                </FormDescription>
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
