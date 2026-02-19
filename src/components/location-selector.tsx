"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiLocation } from "@/types"

const STORAGE_KEY = "per-diem-selected-location-id"

interface LocationSelectorProps {
  onLocationChange?: (locationId: string | null) => void
  className?: string
}

/**
 * LocationSelector Component
 * 
 * Fetches locations from the API and provides a dropdown selector.
 * Persists the selected location in localStorage and restores it on mount.
 * 
 * @param onLocationChange - Callback fired when location changes
 * @param className - Additional CSS classes
 */
export function LocationSelector({
  onLocationChange,
  className,
}: LocationSelectorProps) {
  const [locations, setLocations] = React.useState<ApiLocation[]>([])
  const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load selected location from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSelectedLocationId(saved)
        // Notify parent of initial selection
        onLocationChange?.(saved)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Fetch locations from API (only once on mount)
  React.useEffect(() => {
    async function fetchLocations() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/locations")
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}. ${errorText}`)
        }

        const data = await response.json()
        const locationsList = data.locations || []
        setLocations(locationsList)

        // If we have a saved location ID, verify it still exists
        if (selectedLocationId) {
          const locationExists = locationsList.some(
            (loc: ApiLocation) => loc.id === selectedLocationId
          )
          if (!locationExists) {
            // Clear invalid saved location
            setSelectedLocationId(null)
            if (typeof window !== "undefined") {
              localStorage.removeItem(STORAGE_KEY)
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load locations"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Handle location selection change
  const handleValueChange = (value: string) => {
    setSelectedLocationId(value)
    
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value)
    }

    // Notify parent component
    onLocationChange?.(value)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-11 w-full" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <Select disabled>
          <SelectTrigger className="border-destructive">
            <SelectValue placeholder="Error loading locations" />
          </SelectTrigger>
        </Select>
        <p className="mt-2 text-sm text-destructive">{error}</p>
      </div>
    )
  }

  // Empty state
  if (locations.length === 0) {
    return (
      <div className={className}>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="No locations available" />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <Select
      value={selectedLocationId || undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * Get the selected location ID from localStorage
 * Useful for server components or initial data fetching
 */
export function getSelectedLocationId(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(STORAGE_KEY)
}

/**
 * Clear the selected location from localStorage
 */
export function clearSelectedLocation(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

