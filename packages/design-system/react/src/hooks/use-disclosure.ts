import React from 'react'

export type ComponentWithDisclosureProps<T = unknown> = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  onToggle: (state?: boolean) => void
} & T

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = (state?: boolean) => setIsOpen((prev) => state ?? !prev)

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
