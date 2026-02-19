"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiMenuItem } from "@/types"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: ApiMenuItem
  className?: string
}

/**
 * MenuItemCard Component
 * 
 * Displays a menu item with image, name, description, and price variations.
 * Handles image loading errors with a placeholder.
 * Supports "Read more" expansion for long descriptions.
 * 
 * @param item - Menu item data from API
 * @param className - Additional CSS classes
 */
export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)
  
  // Determine if description should be truncated (more than 100 characters)
  const shouldTruncate = item.description.length > 100
  const displayDescription = isDescriptionExpanded 
    ? item.description 
    : (shouldTruncate ? `${item.description.slice(0, 100)}...` : item.description)

  // Get primary price (first variation or first with price)
  const primaryVariation = item.variations.find(v => v.price > 0) || item.variations[0]
  const primaryPrice = primaryVariation?.formattedPrice || "Price unavailable"

  // Format multiple variations for display
  const variationsText = item.variations.length > 1
    ? item.variations
        .map(v => `${v.name} ${v.formattedPrice}`)
        .join(" · ")
    : null

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]", className)}>
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        {item.imageUrl && !imageError ? (
          <div className="relative h-48 w-full flex-shrink-0 sm:h-32 sm:w-32">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, 128px"
            />
          </div>
        ) : (
          <div className="relative h-48 w-full flex-shrink-0 bg-muted flex items-center justify-center sm:h-32 sm:w-32">
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-xs text-muted-foreground">No image</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">{item.name}</CardTitle>
            {item.categoryName && (
              <p className="text-xs text-muted-foreground capitalize">
                {item.categoryName}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-0">
            {/* Description */}
            {item.description && (
              <div className="mb-3">
                <CardDescription className="text-sm">
                  {displayDescription}
                </CardDescription>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-1 text-xs font-medium text-primary hover:underline touch-manipulation"
                    aria-label={isDescriptionExpanded ? "Read less" : "Read more"}
                  >
                    {isDescriptionExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Price Section */}
            <div className="mt-auto">
              {variationsText ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {primaryPrice}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {variationsText}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-foreground">
                  {primaryPrice}
                </p>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

