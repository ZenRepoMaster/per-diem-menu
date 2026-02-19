/**
 * Integration tests for /api/locations endpoint
 */

import { GET } from '../locations/route'
import { fetchLocations } from '@/lib/square'

// Mock the Square service
jest.mock('@/lib/square', () => ({
  fetchLocations: jest.fn(),
}))

// Mock cache
jest.mock('@/lib/cache', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
  },
  CacheKeys: {
    locations: jest.fn(() => 'locations'),
  },
  CacheTTL: {
    LOCATIONS: 300000,
  },
}))

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    logRequest: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  startTimer: jest.fn(() => () => 100),
}))

describe('GET /api/locations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return locations successfully', async () => {
    const mockLocations = [
      {
        id: 'LOC1',
        name: 'Test Location',
        address: {
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'US',
        },
        timezone: 'America/Los_Angeles',
        status: 'ACTIVE' as const,
      },
    ]

    ;(fetchLocations as jest.Mock).mockResolvedValue(mockLocations)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ locations: mockLocations })
  })

  it('should handle errors gracefully', async () => {
    ;(fetchLocations as jest.Mock).mockRejectedValue(new Error('Network connection failed'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })
})

