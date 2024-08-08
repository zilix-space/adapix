import React from 'react'

import { ColorChangeHandler, TwitterPicker } from 'react-color'
import { useDisclosure } from '../../hooks/use-disclosure'
import { Button } from './button'

export const ColorPicker = (props: {
  onChange?: (value: string) => void
  value?: string
  defaultValue?: string
}) => {
  const { onChange, value, defaultValue } = props

  const [color, setColor] = React.useState(value || defaultValue || '#444ce7')

  const { isOpen, onToggle, onClose } = useDisclosure()

  const handleToogle = () => {
    onToggle()
  }

  const handleChange: ColorChangeHandler = (color) => {
    setColor(color.hex)
  }

  React.useEffect(() => {
    if (!onChange) return
    onChange(color)
  }, [color])

  return (
    <div>
      <ColorPickerTrigger onClick={handleToogle} color={color} value={color} />
      {isOpen && (
        <ColorPickerPopover
          value={color}
          onChange={handleChange}
          onClose={onClose}
          isOpen={isOpen}
        />
      )}
    </div>
  )
}

const ColorPickerTrigger = (props: {
  color?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  value?: string
}) => {
  const { color, onClick, value } = props

  return (
    <Button type="button" variant="outline" onClick={onClick}>
      <span
        className={`mr-2 h-4 w-4 rounded-full border border-input`}
        style={{ backgroundColor: color }}
      />
      <span>{value}</span>
    </Button>
  )
}

const ColorPickerPopover = (props: {
  onChange?: ColorChangeHandler
  onClose?: () => void
  isOpen?: boolean
  value?: string
}) => {
  const { onChange, onClose, isOpen, value } = props

  // close if click outside of twitter picker
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('.color-picker')) return
      onClose && onClose()
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <TwitterPicker
        className="color-picker"
        onChange={onChange}
        onChangeComplete={onChange}
        color={value}
      />
    </>
  )
}
