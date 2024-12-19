'use client'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { useActionForm } from '@/services/actions/lib/client'
import { updateUserDataKyc } from './actions'
import { updateUserDataKycSchema } from './schema'
import { useApplication } from '@/hooks/use-application'
import {
  DappPage,
  DappPageFooter,
  DappPageHeader,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { maskCpf } from '@/helpers/masks/cpf'
import { maskDate } from '@/helpers/masks/date'
import { ArrowRightIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  const application = useApplication()

  const form = useActionForm({
    action: updateUserDataKyc,
    schema: updateUserDataKycSchema,
    reValidateMode: 'onChange',
    defaultValues: {
      name: application.session.user.settings.kyc.data.name,
      document: application.session.user.settings.kyc.data.document,
      birthDate: application.session.user.settings.kyc.data.birthdate,
    },
    onSubmitSuccess: ({ redirect }) => {
      window.location.href = redirect
    },
  })

  return (
    <Form className="h-full" {...form}>
      <DappPage className="flex flex-col justify-between">
        <DappPageHeader className="flex flex-col items-start justify-start space-y-4">
          <DappPageHeaderTitle className="text-xl">
            Precisamos de algumas informações para começar
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel htmlFor="name">Seu nome completo</FormLabel>
                <Input
                  type="text"
                  {...field}
                  placeholder="Charles Bronson"
                  required
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="document"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel htmlFor="document">Seu CPF</FormLabel>
                <Input
                  type="text"
                  {...field}
                  placeholder="000.000.000-00"
                  required
                  onChange={(e) => maskCpf(e, field.onChange)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="birthDate"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel htmlFor="birthDate">
                  Sua data de nascimento
                </FormLabel>
                <Input
                  type="text"
                  {...field}
                  placeholder="10/02/1990"
                  onChange={(e) => maskDate(e, field.onChange)}
                  required
                />
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
