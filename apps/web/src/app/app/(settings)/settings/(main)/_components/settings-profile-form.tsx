'use client'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { useActionForm } from '@/services/actions/lib/client'
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
  FormSection,
} from '@design-system/react/components/ui/form'
import { Input } from '@design-system/react/components/ui/input'
import { toast } from '@design-system/react/components/ui/use-toast'
import { updateUserProfileAction } from '../actions'
import { updateProfileActionSchema } from '../schemas'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'

export function SettingsProfileForm() {
  const { session } = useApplication()
  const { dict } = useDictionary()

  const form = useActionForm({
    schema: updateProfileActionSchema,
    action: updateUserProfileAction,
    defaultValues: {
      image: session.user.image,
      name: session.user.name,
      email: session.user.email,
    },
    onSubmitSuccess: () => {
      toast({
        title: dict.dashboard.settings.main.form.toasts.success.title,
        description:
          dict.dashboard.settings.main.form.toasts.success.description,
      })
    },
  })

  return (
    <Form {...form}>
      <FormSection>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarImageUpload
                  placeholder={
                    dict.dashboard.settings.main.form.fields.avatar.placeholder
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.main.form.fields.name.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.main.form.fields.name.placeholder
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dict.dashboard.settings.main.form.fields.email.label}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict.dashboard.settings.main.form.fields.email.placeholder
                  }
                  {...field}
                  disabled
                />
              </FormControl>
              <FormDescription>
                {dict.dashboard.settings.main.form.fields.email.helpText}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <Button
        type="submit"
        className="md:w-fit w-full !mt-12"
        disabled={!form.formState.isDirty}
      >
        <ButtonIcon
          className="w-4 h-4 mr-3"
          isLoading={form.actionState.isSubmitting}
        />
        {dict.dashboard.settings.main.form.submit.label}
      </Button>
    </Form>
  )
}
