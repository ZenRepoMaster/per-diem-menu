"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * SearchBar Component
 * 
 * Provides a search input for filtering menu items by name or description.
 * Includes a clear button and search icon. Mobile-optimized with touch-friendly interactions.
 * 
 * @param value - Current search query value
 * @param onChange - Callback fired when search query changes
 * @param placeholder - Placeholder text for the input
 * @param className - Additional CSS classes
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search menu items...",
  className,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Search menu items"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full touch-manipulation"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Filter menu items by search query
 * 
 * Searches in item name and description (case-insensitive).
 * 
 * @param items - Array of menu items to filter
 * @param query - Search query string
 * @returns Filtered array of menu items
 */
export function filterMenuItems(
  items: Array<{ name: string; description: string }>,
  query: string
): typeof items {
  if (!query.trim()) {
    return items
  }

  const lowerQuery = query.toLowerCase().trim()

  return items.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(lowerQuery)
    const descriptionMatch = item.description.toLowerCase().includes(lowerQuery)
    return nameMatch || descriptionMatch
  })
}

