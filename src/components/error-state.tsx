"use client"

import * as React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

/**
 * ErrorState Component
 * 
 * Displays a user-friendly error message with optional retry functionality.
 * Includes smooth animations and clear visual hierarchy.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center animate-in fade-in-50 duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-destructive">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-2 touch-manipulation"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}

