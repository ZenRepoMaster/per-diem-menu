/**
 * Unit tests for Square API service functions
 */

import { formatPrice } from '../service'

describe('formatPrice', () => {
  it('should format price from cents to currency string', () => {
    expect(formatPrice(1250)).toBe('$12.50')
    expect(formatPrice(100)).toBe('$1.00')
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('should handle bigint values', () => {
    expect(formatPrice(BigInt(1250))).toBe('$12.50')
    expect(formatPrice(BigInt(9999))).toBe('$99.99')
  })

  it('should handle undefined and null', () => {
    expect(formatPrice(undefined)).toBe('$0.00')
    expect(formatPrice(null as any)).toBe('$0.00')
  })

  it('should use custom currency', () => {
    expect(formatPrice(1250, 'EUR')).toBe('€12.50')
    expect(formatPrice(1250, 'GBP')).toBe('£12.50')
  })

  it('should handle large amounts', () => {
    expect(formatPrice(100000)).toBe('$1,000.00')
    expect(formatPrice(1234567)).toBe('$12,345.67')
  })
})

