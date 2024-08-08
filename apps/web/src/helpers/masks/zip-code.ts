export function maskZipCode(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (value: string) => void,
) {
  const value = e.target.value.replace(/\D/g, '')
  const maskedValue = value.replace(/(\d{5})(\d{3})$/, '$1-$2')

  console.log(maskedValue)

  e.target.value = maskedValue
  callback?.(maskedValue)
}
