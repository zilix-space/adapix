'use client'

import {
  Form,
  FormField,
  FormItem,
} from '@design-system/react/components/ui/form'
import { useActionForm } from '@/services/actions/lib/client'
import { FileInput } from '@design-system/react/components/ui/file-input'
import { updateUserDocumentWithSelfieKyc } from './actions'
import { updateUserDocumentWithSelfieKycSchema } from './schema'
import { useApplication } from '@/hooks/use-application'
import {
  DappPage,
  DappPageFooter,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default function Page() {
  const application = useApplication()

  const form = useActionForm({
    action: updateUserDocumentWithSelfieKyc,
    schema: updateUserDocumentWithSelfieKycSchema,
    defaultValues: {
      selfie: application.session.user.settings.kyc.data.attachments.selfie,
    },

    onSubmitSuccess: ({ redirect }) => {
      window.location.href = redirect
    },
  })

  return (
    <Form {...form} className="h-full">
      <DappPage className="flex flex-col justify-between">
        <DappPageHeader className="flex flex-col items-start justify-start space-y-4">
          <DappPageHeaderBackButton
            className="relative"
            href="/dapp/kyc/validate-user-document"
          />
          <DappPageHeaderTitle className="text-xl">
            Quase lá, precisamos de uma foto sua com o documento
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            name="selfie"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FileInput
                  icon="/assets/icons/ada-icons/selfie-icon.svg"
                  label="Carregar selfie com documento"
                  {...field}
                />
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
