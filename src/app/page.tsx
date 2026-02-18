import { ThemeToggle } from "@/components/theme-toggle";
import { LocationSelector } from "@/components/location-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
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
        <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold sm:text-3xl">Location Selector Test</h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Testing location selector with localStorage persistence
              </p>
            </div>
            
            {/* Location Selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Location</p>
              <LocationSelector />
            </div>
          </div>

          {/* Component showcase - Stacks on mobile */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            {/* Card component */}
            <Card>
              <CardHeader>
                <CardTitle>Card Component</CardTitle>
                <CardDescription>
                  Testing the card component with dark mode support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates the card component styling.
                </p>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Testing different button styles</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button className="min-h-[44px] touch-manipulation">Default</Button>
                <Button variant="secondary" className="min-h-[44px] touch-manipulation">Secondary</Button>
                <Button variant="outline" className="min-h-[44px] touch-manipulation">Outline</Button>
                <Button variant="ghost" className="min-h-[44px] touch-manipulation">Ghost</Button>
              </CardContent>
            </Card>

            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle>Input Component</CardTitle>
                <CardDescription>Testing input field</CardDescription>
              </CardHeader>
              <CardContent>
                <Input placeholder="Enter text here..." />
              </CardContent>
            </Card>

            {/* Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Loading</CardTitle>
                <CardDescription>Testing loading skeleton</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                ✅ Location selector loads locations from API
              </p>
              <p className="text-sm">
                ✅ Selected location persists in localStorage
              </p>
              <p className="text-sm">
                ✅ Refresh page to verify persistence
              </p>
              <p className="text-sm">
                ⏭️ Next: Create menu display components
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
