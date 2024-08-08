export function hexToHsl(hex: string): string {
  // Remover o caractere "#" se estiver presente
  hex = hex.replace('#', '')

  // Converter o valor hexadecimal para RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  // Encontrar o valor máximo e mínimo das componentes RGB
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // Calcular a luminosidade (lightness)
  const lightness = (max + min) / 2

  let hue, saturation

  if (max === min) {
    // Caso especial: tons de cinza
    hue = 0
    saturation = 0
  } else {
    const delta = max - min

    // Calcular a saturação (saturation)
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    // Calcular o matiz (hue)
    if (max === r) {
      hue = (g - b) / delta + (g < b ? 6 : 0)
    } else if (max === g) {
      hue = (b - r) / delta + 2
    } else {
      hue = (r - g) / delta + 4
    }

    hue /= 6
  }

  // Arredondar os valores e formatar a string HSL
  const h = Math.round(hue * 360)
  const s = Math.round(saturation * 100)
  const l = Math.round(lightness * 100)

  return `${h}, ${s}%, ${l}%`
}
