'use client'

import {
  CollapsableForm,
  CollapsableFormContent,
  CollapsableFormDescription,
  CollapsableFormFooter,
  CollapsableFormHeader,
  CollapsableFormMain,
  CollapsableFormTitle,
  CollapsableFormTrigger,
  CollapsableFormTriggerLabel,
  CollapsableFormTriggerValue,
} from '@/app/(dapp)/dapp/_components/dapp-collapsed-form-trigger'
import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/lib/client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@design-system/react/components/ui/avatar'
import { AvatarImageUpload } from '@design-system/react/components/ui/avatar-upload-input'
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
import { PhoneInput } from '@design-system/react/components/ui/phone-input'
import { toast } from '@design-system/react/components/ui/use-toast'
import { getInitialsFromName } from '@design-system/react/helpers/get-initials-from-name'
import { updateProfileActionSchema } from '../schemas'
import { updateUserProfileAction } from '../actions'
import Link from 'next/link'
import { APP_CONFIGS } from '@/boilerplate.config'

export function UserProfileForm() {
  const { session } = useApplication()

  const form = useActionForm({
    schema: updateProfileActionSchema,
    action: updateUserProfileAction,
    defaultValues: {
      image: session.user.image,
      name: session.user.name,
      email: session.user.email,
      address: session.user.settings.kyc.data.address,
    },
    onSubmitSuccess: () => {
      toast({
        title: 'Seus dados foram atualizados com sucesso.',
      })
    },
  })

  return (
    <div className="space-y-4">
      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>Nome</CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue>
            {session.user.name}
          </CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Nome</CollapsableFormTitle>
              <CollapsableFormDescription>
                Altere o nome do seu perfil.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormControl>
                      <Input readOnly placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="button" asChild>
                <Link href={APP_CONFIGS.app.links.support} target="_blank">
                  Alterar com o suporte
                </Link>
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>

      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>Email</CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue>
            {session.user.email}
          </CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Email</CollapsableFormTitle>
              <CollapsableFormDescription>
                Altere o email do seu perfil.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormControl>
                      <Input readOnly placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="button" asChild>
                <Link href={APP_CONFIGS.app.links.support} target="_blank">
                  Alterar com o suporte
                </Link>
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>

      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>Telefone</CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue>
            {session.user.settings.contact.phone}
          </CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Telefone</CollapsableFormTitle>
              <CollapsableFormDescription>
                Altere o telefone do seu perfil.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormControl>
                      <PhoneInput readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="button" asChild>
                <Link href={APP_CONFIGS.app.links.support} target="_blank">
                  Alterar com o suporte
                </Link>
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>

      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>
            Alterar foto de perfil
          </CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue>
            <Avatar className="w-6 h-6">
              <AvatarImage src={session.user.image} />
              <AvatarFallback className="text-xs">
                {getInitialsFromName(session.user.name)}
              </AvatarFallback>
            </Avatar>
          </CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Foto de perfil</CollapsableFormTitle>
              <CollapsableFormDescription>
                Altere a foto de perfil do seu perfil.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => <AvatarImageUpload {...field} />}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="submit">
                <ButtonIcon
                  className="w-4 h-4 mr-3"
                  isLoading={form.actionState.isSubmitting}
                />
                Salvar alterações
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>

      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>Endereço</CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue></CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Endereço</CollapsableFormTitle>
              <CollapsableFormDescription>
                Altere o endereço da sua conta.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Ex: 12345-678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-[3fr_1fr] gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
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
                  name="address.number"
                  render={({ field }) => (
                    <FormItem variant="unstyled">
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Ex: 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address.neighborhood"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Ex: Olímpia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="button" asChild>
                <Link href={APP_CONFIGS.app.links.support} target="_blank">
                  Alterar com o suporte
                </Link>
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>

      <CollapsableForm>
        <CollapsableFormTrigger>
          <CollapsableFormTriggerLabel>Telegram</CollapsableFormTriggerLabel>
          <CollapsableFormTriggerValue>
            {session.user.settings.contact.telegram}
          </CollapsableFormTriggerValue>
        </CollapsableFormTrigger>
        <CollapsableFormContent>
          <Form {...form}>
            <CollapsableFormHeader>
              <CollapsableFormTitle>Telegram</CollapsableFormTitle>
              <CollapsableFormDescription>
                Adicione o seu telegram para receber notificações e efetuar
                transações.
              </CollapsableFormDescription>
            </CollapsableFormHeader>
            <CollapsableFormMain>
              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem variant="unstyled">
                    <FormControl>
                      <Input placeholder="ex: 507900429" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Para pegar o seu chat ID, basta enviar uma mensagem para o
                      bot do telegram.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CollapsableFormMain>
            <CollapsableFormFooter>
              <Button type="submit">
                <ButtonIcon
                  className="w-4 h-4 mr-3"
                  isLoading={form.actionState.isSubmitting}
                />
                Salvar alterações
              </Button>
            </CollapsableFormFooter>
          </Form>
        </CollapsableFormContent>
      </CollapsableForm>
    </div>
  )
}
