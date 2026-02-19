"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "per-diem-mock-mode"

/**
 * Get mock mode from localStorage
 */
export function getMockMode(): boolean {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === "true"
}

/**
 * Set mock mode in localStorage
 */
export function setMockMode(enabled: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false")
}

interface MockModeToggleProps {
  className?: string
}

/**
 * MockModeToggle Component
 * 
 * Toggle button to enable/disable mock data mode.
 * When enabled, the app uses mock data instead of Square API.
 * Useful for testing when Square Sandbox doesn't have catalog items.
 */
export function MockModeToggle({ className }: MockModeToggleProps) {
  const [isMockMode, setIsMockMode] = React.useState(false)

  // Load mock mode from localStorage on mount
  // Note: Cookie sync happens on page load, localStorage is for UI state
  React.useEffect(() => {
    setIsMockMode(getMockMode())
    
    // Sync with cookie on mount (cookie is source of truth for API routes)
    const checkCookie = async () => {
      try {
        const response = await fetch('/api/mock-mode')
        if (response.ok) {
          const data = await response.json()
          if (data.mockMode !== undefined) {
            setIsMockMode(data.mockMode)
            setMockMode(data.mockMode)
          }
        }
      } catch (error) {
        // If API fails, use localStorage as fallback
        console.error('Failed to check mock mode cookie:', error)
      }
    }
    
    checkCookie()
  }, [])

  const handleToggle = async () => {
    const newMode = !isMockMode
    setIsMockMode(newMode)
    setMockMode(newMode)
    
    // Set cookie via API
    try {
      await fetch('/api/mock-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: newMode }),
      })
    } catch (error) {
      console.error('Failed to set mock mode cookie:', error)
    }
    
    // Reload page to apply mock mode changes
    window.location.reload()
  }

  return (
    <Button
      variant={isMockMode ? "secondary" : "ghost"}
      size="sm"
      onClick={handleToggle}
      className={cn(
        "gap-1.5 touch-manipulation h-9 px-2.5 sm:px-3",
        isMockMode && "bg-muted text-foreground hover:bg-muted/80",
        className
      )}
      aria-label={isMockMode ? "Disable mock data mode" : "Enable mock data mode"}
      title={isMockMode ? "Using mock data - Click to use real Square API" : "Using Square API - Click to use mock data"}
    >
      <Database className={cn(
        "h-4 w-4 transition-colors",
        isMockMode && "text-primary"
      )} />
      <span className="hidden sm:inline text-xs font-medium">
        {isMockMode ? "Mock Data" : "Live Data"}
      </span>
      {isMockMode && (
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary sm:hidden" aria-hidden="true" />
      )}
    </Button>
  )
}

