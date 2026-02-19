/**
 * Integration tests for LocationSelector component
 */

import { render, screen, waitFor } from '@testing-library/react'
import { LocationSelector } from '../location-selector'

// Mock fetch
global.fetch = jest.fn()

describe('LocationSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should show loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    const { container } = render(<LocationSelector />)
    // Skeleton component renders during loading
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should display locations when loaded', async () => {
    const mockLocations = {
      locations: [
        {
          id: 'LOC1',
          name: 'Location 1',
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
      ],
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLocations,
    })

    render(<LocationSelector />)

    // Wait for loading to complete (Select component to render)
    await waitFor(() => {
      expect(screen.getByText('Select a location')).toBeInTheDocument()
    })

    // Verify the Select component is rendered (locations are loaded)
    const selectTrigger = screen.getByRole('combobox')
    expect(selectTrigger).toBeInTheDocument()
  })

  it('should show error state when API fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<LocationSelector />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading locations/i)).toBeInTheDocument()
    })
  })

  it('should initialize with location from localStorage', async () => {
    // Set localStorage before rendering
    localStorage.setItem('per-diem-selected-location-id', 'LOC1')

    const mockLocations = {
      locations: [
        {
          id: 'LOC1',
          name: 'Location 1',
          address: { line1: '123 Main St', city: 'SF', state: 'CA', postalCode: '94102', country: 'US' },
          timezone: 'America/Los_Angeles',
          status: 'ACTIVE' as const,
        },
      ],
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLocations,
    })

    render(<LocationSelector />)

    // Wait for loading to complete
    // When a location is in localStorage, it shows the location name, not "Select a location"
    await waitFor(() => {
      expect(screen.getByText('Location 1')).toBeInTheDocument()
    })

    // Verify the component rendered with the selected location
    const selectTrigger = screen.getByRole('combobox')
    expect(selectTrigger).toBeInTheDocument()
    
    // Verify localStorage value is preserved
    expect(localStorage.getItem('per-diem-selected-location-id')).toBe('LOC1')
    
    // Note: Full interaction testing with Radix UI Select requires E2E tests
    // due to JSDOM limitations with pointer events and portals
  })
})

