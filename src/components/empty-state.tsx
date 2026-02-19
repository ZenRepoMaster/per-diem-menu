"use client"

import * as React from "react"
import { Search, Package, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string | React.ReactNode
  action?: React.ReactNode
  className?: string
}

/**
 * EmptyState Component
 * 
 * Displays a consistent empty state with icon, title, description, and optional action.
 * Used for no results, no items, etc.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted p-8 text-center animate-in fade-in-50 duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        {icon && (
          <div className="rounded-full bg-muted-foreground/10 p-4">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          {description && (
            typeof description === 'string' ? (
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {description}
              </p>
            ) : (
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                {description}
              </div>
            )
          )}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  )
}

/**
 * Pre-configured empty states
 */
export function EmptySearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6 text-muted-foreground" />}
      title={`No items found matching "${query}"`}
      description="Try adjusting your search terms or browse by category"
      action={
        <button
          onClick={onClear}
          className="text-xs text-primary underline hover:no-underline touch-manipulation font-medium"
        >
          Clear search
        </button>
      }
    />
  )
}

export function EmptyCategory({ onClearCategory }: { onClearCategory: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-6 w-6 text-muted-foreground" />}
      title="No items found in this category"
      description="Try selecting a different category or view all items"
      action={
        <button
          onClick={onClearCategory}
          className="text-xs text-primary underline hover:no-underline touch-manipulation font-medium"
        >
          View all items
        </button>
      }
    />
  )
}

export function EmptyCatalog() {
  return (
    <EmptyState
      icon={<Package className="h-6 w-6 text-muted-foreground" />}
      title="No menu items available for this location"
      description={
        <div className="text-xs text-muted-foreground space-y-2 max-w-md mx-auto">
          <p>
            The Square Sandbox location doesn't have any catalog items yet.
          </p>
          <p>To add menu items:</p>
          <ol className="list-decimal list-inside space-y-1 text-left">
            <li>
              Go to{" "}
              <a
                href="https://squareupsandbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Square Sandbox Seller Dashboard
              </a>
            </li>
            <li>Navigate to Items &gt; Catalog</li>
            <li>Add items and assign them to this location</li>
            <li>Refresh this page to see the menu</li>
          </ol>
        </div>
      }
    />
  )
}

export function EmptyLocation() {
  return (
    <EmptyState
      icon={<AlertCircle className="h-6 w-6 text-muted-foreground" />}
      title="Please select a location"
      description="Choose a location from the dropdown above to view the menu"
    />
  )
}

