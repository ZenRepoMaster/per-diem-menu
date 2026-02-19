"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiCategory } from "@/types"

interface CategoryNavigationProps {
  categories: ApiCategory[]
  selectedCategoryId: string | null
  onCategoryChange: (categoryId: string | null) => void
  className?: string
}

/**
 * CategoryNavigation Component
 * 
 * Displays category tabs for navigation. On mobile, tabs scroll horizontally.
 * Highlights the currently selected category.
 * 
 * @param categories - Array of categories with item counts
 * @param selectedCategoryId - Currently selected category ID (null for "All")
 * @param onCategoryChange - Callback fired when category is changed
 * @param className - Additional CSS classes
 */
export function CategoryNavigation({
  categories,
  selectedCategoryId,
  onCategoryChange,
  className,
}: CategoryNavigationProps) {
  const handleValueChange = (value: string) => {
    // "all" is our special value for showing all items
    onCategoryChange(value === "all" ? null : value)
  }

  // Determine the current tab value
  const currentValue = selectedCategoryId || "all"

  return (
    <div className={className}>
      <Tabs value={currentValue} onValueChange={handleValueChange}>
        <TabsList className="w-full justify-start overflow-x-auto transition-all duration-200">
          <TabsTrigger value="all" className="min-w-fit">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="min-w-fit"
            >
              {category.name} ({category.itemCount})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

