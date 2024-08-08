export function maskCpf(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (value: string) => void,
) {
  const value = e.target.value.replace(/\D/g, '')
  const maskedValue = value
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  e.target.value = maskedValue
  callback?.(maskedValue)
}
