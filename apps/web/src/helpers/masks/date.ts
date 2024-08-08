export function maskDate(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (value: string) => void,
) {
  const value = e.target.value.replace(/\D/g, '')
  const maskedValue = value
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1')

  e.target.value = maskedValue
  callback?.(maskedValue)
}
