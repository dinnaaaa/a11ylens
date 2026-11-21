export function normalizeHexColor(color) {
  if (typeof color !== 'string') return null

  const value = color.trim()

  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
    return null
  }

  if (value.length === 4) {
    return (
      '#' +
      value
        .slice(1)
        .split('')
        .map((character) => character + character)
        .join('')
    )
  }

  return value
}

function getRelativeLuminance(hexColor) {
  const normalizedColor = normalizeHexColor(hexColor)

  if (!normalizedColor) return null

  const rgb = normalizedColor
    .slice(1)
    .match(/.{2}/g)
    .map((value) => parseInt(value, 16) / 255)

  const linearRGB = rgb.map((channel) => {
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })

  return (
    0.2126 * linearRGB[0] +
    0.7152 * linearRGB[1] +
    0.0722 * linearRGB[2]
  )
}

export function calculateContrastRatio(foreground, background) {
  const foregroundLuminance = getRelativeLuminance(foreground)
  const backgroundLuminance = getRelativeLuminance(background)

  if (
    foregroundLuminance === null ||
    backgroundLuminance === null
  ) {
    return null
  }

  const lighter = Math.max(
    foregroundLuminance,
    backgroundLuminance,
  )

  const darker = Math.min(
    foregroundLuminance,
    backgroundLuminance,
  )

  return (lighter + 0.05) / (darker + 0.05)
}
