"use client"

import * as React from "react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle";
import { LocationSelector } from "@/components/location-selector";
import { MenuDisplay } from "@/components/menu-display";

export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with theme toggle - Mobile optimized */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 sm:container sm:h-16 sm:px-6">
          <h1 className="text-lg font-semibold sm:text-xl">Per Diem Menu</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content - Mobile first */}
      <main className="flex-1 px-4 py-6 sm:container sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
          {/* Location Selector */}
          <div className="space-y-2 animate-in fade-in-50 duration-300">
            <p className="text-sm font-medium">Select Location</p>
            <LocationSelector
              onLocationChange={(locationId) => {
                setSelectedLocationId(locationId)
              }}
            />
          </div>

          {/* Menu Display */}
          <div className="animate-in fade-in-50 duration-500">
            <MenuDisplay locationId={selectedLocationId} />
          </div>
        </div>
      </main>
    </div>
  );
}
