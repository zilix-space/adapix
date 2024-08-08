import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../helpers/cn'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface Option {
  value: string
  label: string
}

interface ComboBoxProps {
  options: Option[]
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className,
  readOnly,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between hover:no-underline font-normal text-md opacity-60',
            className,
          )}
          disabled={readOnly}
          size="default"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[19rem] p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup className="h-auto overflow-y-auto max-h-80">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(value === option.value ? '' : option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
