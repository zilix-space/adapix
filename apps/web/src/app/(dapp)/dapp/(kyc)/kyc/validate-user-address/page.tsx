'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { useActionForm } from '@/services/actions/lib/client'
import { updateUserAddressKycSchema } from './schema'
import {
  DappPage,
  DappPageFooter,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { updateUserAddressKyc } from './actions'
import { useApplication } from '@/app/app/_hooks/application.hook'
import { useCep } from '@/hooks/use-cep'
import { maskZipCode } from '@/helpers/masks/zip-code'
import { useEffect } from 'react'
import { ArrowRightIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  const application = useApplication()
  const zipCode = useCep()

  const form = useActionForm({
    action: updateUserAddressKyc,
    schema: updateUserAddressKycSchema,
    reValidateMode: 'onChange',
    defaultValues: {
      state: application.session.user.settings.kyc.data.address.state,
      city: application.session.user.settings.kyc.data.address.city,
      neighborhood:
        application.session.user.settings.kyc.data.address.neighborhood,
      complement: application.session.user.settings.kyc.data.address.complement,
      zipCode: application.session.user.settings.kyc.data.address.zipCode,
      street: application.session.user.settings.kyc.data.address.street,
      number: application.session.user.settings.kyc.data.address.number,
    },
    onSubmitSuccess: ({ redirect }) => {
      window.location.href = redirect
    },
  })

  useEffect(() => {
    if (!zipCode.address && !zipCode.loading) return
    form.setValue('state', zipCode.address.state)
    form.setValue('city', zipCode.address.city)
    form.setValue('neighborhood', zipCode.address.neighborhood)
    form.setValue('street', zipCode.address.street)
    form.setValue('complement', '')
    form.setValue('number', '')
  }, [zipCode.address])

  return (
    <Form className="h-full" {...form}>
      <DappPage className="flex flex-col justify-between">
        <DappPageHeader className="flex flex-col items-start justify-start space-y-4">
          <DappPageHeaderBackButton className="relative" href="/dapp/kyc" />
          <DappPageHeaderTitle className="text-xl">
            Agora, precisamos saber seu endereço
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: 12345-678"
                    value={field.value}
                    onChange={(e) =>
                      maskZipCode(e, (value) => {
                        field.onChange(value)
                        if (value.length !== 9) return
                        zipCode.retrieve(value)
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-[3fr_1fr] gap-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem variant="unstyled">
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      placeholder="Ex: Rua das Flechas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem variant="unstyled">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Apto 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Olímpia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-[3fr_1fr] gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem variant="unstyled">
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem variant="unstyled">
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
