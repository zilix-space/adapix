'use client'

import {
  Form,
  FormField,
  FormItem,
} from '@design-system/react/components/ui/form'
import { FileInput } from '@design-system/react/components/ui/file-input'
import { useActionForm } from '@/services/actions/lib/client'
import { updateUserDocumentKyc } from './actions'
import { updateUserDocumentKycSchema } from './schema'
import { useApplication } from '@/app/app/_hooks/application.hook'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
  DappPage,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderTitle,
  DappPageMain,
  DappPageFooter,
} from '../../../_components/dapp-page'
import { ArrowRightIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  const application = useApplication()

  const form = useActionForm({
    action: updateUserDocumentKyc,
    schema: updateUserDocumentKycSchema,
    defaultValues: {
      documentFront:
        application.session.user.settings.kyc.data.attachments.documentFront,
      documentBack:
        application.session.user.settings.kyc.data.attachments.documentBack,
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
            href="/dapp/kyc/validate-user-pix"
          />
          <DappPageHeaderTitle className="text-xl">
            Precisamos de fotos do seu documento para verificar sua identidade
          </DappPageHeaderTitle>
        </DappPageHeader>
        <DappPageMain className="space-y-4 flex-1">
          <FormField
            control={form.control}
            name="documentFront"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FileInput
                  icon="/assets/icons/ada-icons/cnh-rg-front-icon.svg"
                  label="Carregar frente da CNH/RG"
                  {...field}
                />
              </FormItem>
            )}
          />
          <FormField
            name="documentBack"
            render={({ field }) => (
              <FormItem variant="unstyled">
                <FileInput
                  icon="/assets/icons/ada-icons/cnh-rg-back-icon.svg"
                  label="Carregar verso da CNH/RG"
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
