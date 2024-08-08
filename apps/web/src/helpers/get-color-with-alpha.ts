export function getColorWithAlpha(icon: string, alpha: number): string {
  if (typeof document === 'undefined') return '#121212'

  const getAvgHex = (color: number, total: number) =>
    Math.round(color / total)
      .toString(16)
      .padStart(2, String(0))

  let totalPixels = 0
  const colors = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 0,
  }
  const canvas = document.createElement('canvas')

  const ctx = canvas.getContext('2d')

  if (!ctx) return '#121212'

  ctx.font = '30px Arial'
  ctx.fillText(icon, 0, 28)

  const imageData = ctx.getImageData(0, 0, 30, 30).data
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const a = imageData[i + 3]

    if (a > 50) {
      totalPixels += 1
      colors.red += r
      colors.green += g
      colors.blue += b
      colors.alpha += a
    }
  }
  const r = getAvgHex(colors.red, totalPixels)
  const g = getAvgHex(colors.green, totalPixels)
  const b = getAvgHex(colors.blue, totalPixels)

  return '#' + r + g + b + Math.round(alpha * 255).toString(16)
}
