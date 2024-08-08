'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/lib/client'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { toast } from '@design-system/react/components/ui/use-toast'
import { updatePixActionSchema } from '../schemas'
import { updatePixAction } from '../actions'

export function UpdatePixForm() {
  const { session } = useApplication()

  const form = useActionForm({
    schema: updatePixActionSchema,
    action: updatePixAction,
    defaultValues: {
      payment: {
        pix: session.user.settings.payment.pix,
      },
    },
    onSubmitSuccess: () => {
      toast({
        title: 'Seus dados foram atualizados com sucesso.',
      })
    },
  })

  return (
    <Form className="h-full grid grid-rows-[1fr_auto]" {...form}>
      <main>
        <FormField
          control={form.control}
          name="payment.pix"
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
                A conta bancária associada a esta chave deve ter o mesmo titular
                e CPF da conta do seu usuário.
              </FormDescription>
            </FormItem>
          )}
        />
      </main>
      <footer className="mt-auto w-full fixed bottom-6">
        <Button type="submit" className="w-[89%]">
          <ButtonIcon
            className="w-4 h-4 mr-3"
            isLoading={form.actionState.isSubmitting}
          />
          Salvar alteraçes
        </Button>
      </footer>
    </Form>
  )
}
