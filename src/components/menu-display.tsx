"use client"

import * as React from "react"
import { CategoryNavigation } from "@/components/category-navigation"
import { MenuItemCard } from "@/components/menu-item-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiCatalogResponse, ApiMenuItem } from "@/types"

interface MenuDisplayProps {
  locationId: string | null
  className?: string
}

/**
 * MenuDisplay Component
 * 
 * Fetches and displays menu items grouped by category.
 * Supports category filtering and displays items in a responsive grid.
 * 
 * @param locationId - Square location ID to fetch catalog for
 * @param className - Additional CSS classes
 */
export function MenuDisplay({ locationId, className }: MenuDisplayProps) {
  const [catalog, setCatalog] = React.useState<ApiCatalogResponse | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch catalog when location changes
  React.useEffect(() => {
    if (!locationId) {
      console.log("MenuDisplay: No locationId provided")
      setCatalog(null)
      setError(null)
      return
    }

    async function fetchCatalog() {
      try {
        setIsLoading(true)
        setError(null)

        console.log(`MenuDisplay: Fetching catalog for location: ${locationId}`)
        const response = await fetch(`/api/catalog?location_id=${locationId}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`MenuDisplay: API error ${response.status}:`, errorText)
          throw new Error(`Failed to fetch catalog: ${response.status} ${response.statusText}. ${errorText}`)
        }

        const data = await response.json()
        console.log("MenuDisplay: Catalog API response:", data)
        console.log(`MenuDisplay: Total items: ${data.totalItems}, Categories: ${data.categories?.length || 0}`)
        
        setCatalog(data)
        
        // Reset category selection when catalog changes
        setSelectedCategoryId(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load menu"
        setError(message)
        console.error("MenuDisplay: Error fetching catalog:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCatalog()
  }, [locationId])

  // Get filtered items based on selected category
  const getFilteredItems = (): ApiMenuItem[] => {
    if (!catalog) return []
    
    if (selectedCategoryId === null) {
      // Show all items
      return Object.values(catalog.itemsByCategory).flat()
    }
    
    // Show items for selected category
    return catalog.itemsByCategory[selectedCategoryId] || []
  }

  const filteredItems = getFilteredItems()

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <button
            onClick={() => locationId && window.location.reload()}
            className="mt-2 text-xs text-destructive underline hover:no-underline touch-manipulation"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No location selected
  if (!locationId) {
    return (
      <div className={className}>
        <div className="rounded-lg border bg-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Please select a location to view the menu
          </p>
        </div>
      </div>
    )
  }

  // Empty catalog
  if (!catalog || catalog.totalItems === 0) {
    return (
      <div className={className}>
        <div className="rounded-lg border bg-muted p-8 text-center space-y-3">
          <p className="text-sm font-medium text-foreground">
            No menu items available for this location
          </p>
          <div className="text-xs text-muted-foreground space-y-2 max-w-md mx-auto">
            <p>
              The Square Sandbox location doesn't have any catalog items yet.
            </p>
            <p>
              To add menu items:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Go to <a href="https://squareupsandbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Square Sandbox Seller Dashboard</a></li>
              <li>Navigate to Items &gt; Catalog</li>
              <li>Add items and assign them to this location</li>
              <li>Refresh this page to see the menu</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Empty filtered results
  if (filteredItems.length === 0) {
    return (
      <div className={className}>
        <CategoryNavigation
          categories={catalog.categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          className="mb-6"
        />
        <div className="rounded-lg border bg-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No items found in this category
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Category Navigation */}
      {catalog.categories.length > 0 && (
        <CategoryNavigation
          categories={catalog.categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          className="mb-6"
        />
      )}

      {/* Menu Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Item count */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {catalog.totalItems} items
        </p>
      </div>
    </div>
  )
}

