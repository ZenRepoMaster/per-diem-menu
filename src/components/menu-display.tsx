"use client"

import * as React from "react"
import { CategoryNavigation } from "@/components/category-navigation"
import { MenuItemCard } from "@/components/menu-item-card"
import { SearchBar, filterMenuItems } from "@/components/search-bar"
import { ErrorState } from "@/components/error-state"
import {
  EmptySearchResults,
  EmptyCategory,
  EmptyCatalog,
  EmptyLocation,
} from "@/components/empty-state"
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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch catalog when location changes
  React.useEffect(() => {
    if (!locationId) {
      setCatalog(null)
      setError(null)
      return
    }

    async function fetchCatalog() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/catalog?location_id=${locationId}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch catalog: ${response.status} ${response.statusText}. ${errorText}`)
        }

        const data = await response.json()
        setCatalog(data)
        
        // Reset category selection and search when catalog changes
        setSelectedCategoryId(null)
        setSearchQuery("")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load menu"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCatalog()
  }, [locationId])

  // Get filtered items based on selected category and search query
  const getFilteredItems = (): ApiMenuItem[] => {
    if (!catalog) return []
    
    let items: ApiMenuItem[] = []
    
    // First filter by category
    if (selectedCategoryId === null) {
      // Show all items
      items = Object.values(catalog.itemsByCategory).flat()
    } else {
      // Show items for selected category
      items = catalog.itemsByCategory[selectedCategoryId] || []
    }
    
    // Then filter by search query
    if (searchQuery.trim()) {
      items = filterMenuItems(items, searchQuery)
    }
    
    return items
  }

  const filteredItems = getFilteredItems()

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
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
        <ErrorState
          message={error}
          onRetry={() => {
            if (locationId) {
              window.location.reload()
            }
          }}
        />
      </div>
    )
  }

  // No location selected
  if (!locationId) {
    return (
      <div className={className}>
        <EmptyLocation />
      </div>
    )
  }

  // Empty catalog
  if (!catalog || catalog.totalItems === 0) {
    return (
      <div className={className}>
        <EmptyCatalog />
      </div>
    )
  }

  // Empty filtered results
  if (filteredItems.length === 0) {
    return (
      <div className={className}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="mb-6"
        />
        
        {/* Category Navigation */}
        {catalog.categories.length > 0 && (
          <CategoryNavigation
            categories={catalog.categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            className="mb-6"
          />
        )}
        
        {/* Empty State */}
        {searchQuery.trim() ? (
          <EmptySearchResults
            query={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        ) : (
          <EmptyCategory
            onClearCategory={() => setSelectedCategoryId(null)}
          />
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-6"
      />
      
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
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${Math.min(index * 50, 300)}ms`,
            }}
          >
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>

      {/* Item count */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {searchQuery.trim() ? (
            <>
              Showing {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for "{searchQuery}"
              {filteredItems.length < catalog.totalItems && (
                <> of {catalog.totalItems} total items</>
              )}
            </>
          ) : (
            <>Showing {filteredItems.length} of {catalog.totalItems} items</>
          )}
        </p>
      </div>
    </div>
  )
}

