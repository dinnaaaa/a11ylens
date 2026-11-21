
import { describe, it, expect } from 'vitest'
import {
  normalizeHexColor,
  calculateContrastRatio,
} from './contrastUtils'

describe('normalizeHexColor', () => {
  it('should accept a valid six-digit HEX color', () => {
    expect(normalizeHexColor('#FFFFFF')).toBe('#FFFFFF')
  })

  it('should expand a valid three-digit HEX color', () => {
    expect(normalizeHexColor('#FFF')).toBe('#FFFFFF')
  })

  it('should accept lowercase HEX colors', () => {
    expect(normalizeHexColor('#ffffff')).toBe('#ffffff')
  })

  it('should trim whitespace from HEX colors', () => {
    expect(normalizeHexColor(' #FFF ')).toBe('#FFFFFF')
  })

  it('should reject invalid HEX colors', () => {
    expect(normalizeHexColor('FFFFFF')).toBeNull()
    expect(normalizeHexColor('#GGG')).toBeNull()
    expect(normalizeHexColor('#FFFF')).toBeNull()
    expect(normalizeHexColor('#12345')).toBeNull()
    expect(normalizeHexColor('red')).toBeNull()
  })
})

describe('calculateContrastRatio', () => {
  it('should calculate a contrast ratio of 21:1 for black and white', () => {
    expect(
      calculateContrastRatio('#000000', '#FFFFFF')
    ).toBeCloseTo(21, 2)
  })

  it('should return the same ratio when colors are reversed', () => {
    const first = calculateContrastRatio('#000000', '#FFFFFF')
    const second = calculateContrastRatio('#FFFFFF', '#000000')

    expect(first).toBeCloseTo(second, 5)
  })

  it('should return 1:1 for identical colors', () => {
    expect(
      calculateContrastRatio('#FFFFFF', '#FFFFFF')
    ).toBeCloseTo(1, 5)
  })

  it('should return null when foreground color is invalid', () => {
    expect(
      calculateContrastRatio('INVALID', '#FFFFFF')
    ).toBeNull()
  })

  it('should return null when background color is invalid', () => {
    expect(
      calculateContrastRatio('#000000', 'INVALID')
    ).toBeNull()
  })
})
