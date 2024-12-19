import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@design-system/react/components/ui/form'
import { useActionForm } from '@/services/actions/lib/client'
import { SheetFooter } from '@design-system/react/components/ui/sheet'
import { toast } from '@design-system/react/components/ui/use-toast'
import { cn } from '@design-system/react/helpers/cn'
import { CheckCircle, XCircle } from 'lucide-react'
import { sendKYCUpdateAction } from '../../actions'
import { kycUpdateSchema } from '../../schemas'
import { Button } from '@design-system/react/components/ui/button'
import {
  KYCRejectionReason,
  KYCStatus,
} from '@app/modules/src/domain/entities/User'
import type { User } from '../../../_types'

/**
 * Interface for KYC Update Form Props
 */
interface KYCUpdateFormProps {
  user: User
}

type StatusVariant = {
  buttonVariant?: 'default' | 'destructive'
  buttonText?: string
  borderColor: string
}

type StatusVariants = {
  [key in KYCStatus]: StatusVariant
}

type RejectionReason = {
  value: KYCRejectionReason
  title: string
  description: string
}

/**
 * Constants for rejection reasons with descriptions
 */
const REJECTION_REASONS: RejectionReason[] = [
  {
    value: KYCRejectionReason.INVALID_SELFIE,
    title: 'Invalid Selfie',
    description:
      'The selfie photo does not meet our requirements or is unclear',
  },
  {
    value: KYCRejectionReason.INVALID_SELFIE_WITH_DOCUMENT,
    title: 'Invalid Selfie with Document',
    description:
      'The selfie with document photo is not properly visible or does not match requirements',
  },
  {
    value: KYCRejectionReason.INVALID_DOCUMENT_FRONT,
    title: 'Invalid Document Front',
    description: 'The front side of the document is unclear or incomplete',
  },
  {
    value: KYCRejectionReason.INVALID_DOCUMENT_BACK,
    title: 'Invalid Document Back',
    description: 'The back side of the document is unclear or incomplete',
  },
  {
    value: KYCRejectionReason.INVALID_ADDRESS,
    title: 'Invalid Address',
    description: 'The provided address information is incorrect or incomplete',
  },
  {
    value: KYCRejectionReason.INVALID_DATA,
    title: 'Invalid Data',
    description:
      'The submitted personal information contains errors or inconsistencies',
  },
  {
    value: KYCRejectionReason.SUSPICIOUS_DATA,
    title: 'Suspicious Data',
    description:
      'The submitted information shows signs of potential fraud or manipulation',
  },
]

/**
 * Constants for form status variants and messages
 */
const STATUS_VARIANTS: StatusVariants = {
  approved: {
    buttonVariant: 'default',
    buttonText: 'Confirm Approval',
    borderColor: 'border-green-500 bg-green-50',
  },
  rejected: {
    buttonVariant: 'destructive',
    buttonText: 'Confirm Rejection',
    borderColor: 'border-red-500 bg-red-50',
  },
  submitted: {
    borderColor: 'border-gray-200',
  },
  pending: {
    borderColor: 'border-yellow-200',
  },
}

/**
 * Form component for updating KYC status
 */
export function KYCUpdateForm({ user }: KYCUpdateFormProps) {
  const form = useActionForm({
    action: sendKYCUpdateAction,
    schema: kycUpdateSchema,
    defaultValues: {
      userId: user.id,
    },
    onSubmitSuccess: ({ message, status }) => {
      toast({
        title: message,
        description: status,
      })
    },
  })

  const selectedStatus = form.watch('status') as KYCStatus
  const isRejected = selectedStatus === 'rejected'
  const isSubmitting = form.actionState.isSubmitting
  const selectedReasons = form.watch('reasons') || []

  function getButtonDisabledState(): boolean {
    if (isSubmitting) {
      return true
    }

    if (isRejected && selectedReasons.length === 0) {
      return true
    }

    return false
  }

  /**
   * Get styles for KYC status button based on selected status
   * @param value - The KYC status value
   * @returns Combined class names for the button
   */
  function getStatusStyles(value: KYCStatus): string {
    const baseStyles =
      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors'

    if (value === selectedStatus) {
      return cn(baseStyles, STATUS_VARIANTS[value].borderColor)
    }

    return cn(baseStyles, STATUS_VARIANTS.submitted.borderColor)
  }

  /**
   * Handle click on a rejection reason
   * @param reason - The rejection reason
   * @param field - The form field
   */
  function handleReasonClick(reason: RejectionReason, field: any) {
    const currentValues = new Set(field.value || [])
    const isValueSelected = currentValues.has(reason.value)

    if (isValueSelected) {
      currentValues.delete(reason.value)
    } else {
      currentValues.add(reason.value)
    }

    field.onChange(Array.from(currentValues))
  }

  if (user.settings.kyc.status !== KYCStatus.SUBMITTED) {
    return null
  }

  return (
    <SheetFooter className="mt-6 sticky bottom-0 bg-background border-t py-4">
      <Form {...form} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem variant="unstyled" className="border-none p-0">
              <FormLabel className="mb-4 block">
                KYC Verification Decision
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={getStatusStyles(KYCStatus.APPROVED)}
                    onClick={() => field.onChange(KYCStatus.APPROVED)}
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="font-medium">Approve</span>
                  </button>

                  <button
                    type="button"
                    className={getStatusStyles(KYCStatus.REJECTED)}
                    onClick={() => field.onChange(KYCStatus.REJECTED)}
                  >
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="font-medium">Reject</span>
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {isRejected && (
          <FormField
            control={form.control}
            name="reasons"
            render={({ field }) => (
              <FormItem className="relative animate-in fade-in slide-in-from-top-2 max-h-[20rem] overflow-y-auto p-0">
                <FormLabel className="sticky block top-0 bg-background opacity-100 p-4 border-b space-y-1">
                  <strong>Rejection Reasons</strong>
                  <p className="text-xs text-muted-foreground">
                    Select all applicable reasons for rejection. These will be
                    shared with the user.
                  </p>
                </FormLabel>
                <FormControl className="p-4 pt-2">
                  <div className="space-y-2">
                    {REJECTION_REASONS.map((reason) => {
                      const isValueSelected = field.value?.includes(
                        reason.value,
                      )

                      const variants = {
                        true: 'border-red-500 bg-red-50',
                        false: 'border-gray-200 hover:border-gray-300',
                      }

                      return (
                        <div
                          key={reason.value}
                          onClick={() => handleReasonClick(reason, field)}
                          className={cn(
                            'flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
                            variants[isValueSelected ? 'true' : 'false'],
                          )}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-xs">
                              {reason.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {reason.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedStatus && (
          <Button
            type="submit"
            className="w-full animate-in fade-in slide-in-from-bottom-2"
            variant={
              STATUS_VARIANTS[selectedStatus]?.buttonVariant || 'default'
            }
            disabled={getButtonDisabledState()}
          >
            {STATUS_VARIANTS[selectedStatus]?.buttonText || 'Submit'}
          </Button>
        )}
      </Form>
    </SheetFooter>
  )
}
