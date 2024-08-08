import { useEffect, useState } from 'react';

type UseBooleanProps = { defaultValue: boolean; timeout?: number }

export function useBoolean({ defaultValue, timeout }: UseBooleanProps) {
  const [value, setValue] = useState(defaultValue)

  const onToggle = () => setValue(!value)
  const onChange = (newValue: boolean) => setValue(newValue)

  useEffect(() => {
    if (timeout && value !== defaultValue) {
      const timer = setTimeout(() => {
        setValue(defaultValue)
      }, timeout)

      return () => clearTimeout(timer)
    }
  }, [defaultValue, timeout, value])

  return { onToggle, onChange, value }
}
