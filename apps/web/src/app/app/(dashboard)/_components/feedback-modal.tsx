'use client'

import { useActionForm } from '@/services/actions/lib/client'
import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@design-system/react/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { Textarea } from '@design-system/react/components/ui/textarea'
import { toast } from '@design-system/react/components/ui/use-toast'
import { MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { sendFeedbackActionSchema } from '../schemas'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { sendFeedbackAction } from '../actions'

type FeedbackModalProps = {
  children: React.ReactNode
}

export function FeedbackModal({ children }: FeedbackModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { dict } = useDictionary()

  const form = useActionForm({
    action: sendFeedbackAction,
    schema: sendFeedbackActionSchema,
    onSubmitSuccess: () => {
      toast({
        title: dict.dashboard.feedback.form.toast.title,
        description: dict.dashboard.feedback.form.toast.description,
      })

      ref.current.click()
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] p-0 space-y-0">
        <Form {...form}>
          <DialogHeader className="p-8 pb-0">
            <DialogTitle>{dict.dashboard.feedback.form.title}</DialogTitle>
            <DialogDescription>
              {dict.dashboard.feedback.form.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="!rounded-lg">
                  <FormControl>
                    <Textarea
                      className="min-h-[8rem]"
                      placeholder={
                        dict.dashboard.feedback.form.fields.textarea.placeholder
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="border-t border-border p-8 pt-0">
            <Button type="submit">
              <ButtonIcon
                className="w-4 h-4 mr-3"
                icon={MessageCircle}
                isLoading={form.actionState.isSubmitting}
              />
              {dict.dashboard.feedback.form.fields.submit.label}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
