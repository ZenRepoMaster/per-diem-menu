# Per Diem Menu

A mobile-friendly web application that connects to the Square Catalog API to display restaurant menu items, filtered by location and category.

## Project Status

| Component | Status |
|-----------|--------|
| Backend API | Complete |
| Frontend UI | Complete |
| Testing | Complete |
| Mock Data Mode | Complete |
| Deployment | Pending |

## Features

- **Location Selection**: Choose from available restaurant locations with persistence
- **Category Navigation**: Browse menu items by category with smooth horizontal scrolling
- **Menu Display**: View items with images, descriptions, and pricing variations
- **Search**: Filter menu items by name or description (client-side)
- **Dark Mode**: Toggle between light, dark, and system themes
- **Mock Data Mode**: Toggle between real Square API and mock data for testing
- **Responsive Design**: Mobile-first design optimized for 375px viewport and up
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: User-friendly error messages with retry functionality

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: Square Catalog & Locations API
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Square Developer Account ([Sign up here](https://developer.squareup.com))

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ZenRepoMaster/per-diem-menu.git
   cd per-diem-menu
   ```

2. Install dependencies:
   ```bash
    npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Square credentials to `.env.local`:
   ```
   SQUARE_ACCESS_TOKEN=your_sandbox_access_token
   SQUARE_ENVIRONMENT=sandbox
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run E2E tests in UI mode:

```bash
npm run test:e2e:ui
```

### Mock Data Mode

If Square Sandbox doesn't have catalog items configured, you can use mock data mode:

1. Click the "Mock Data" button in the header (Database icon)
2. The application will reload and use sample data
3. Mock data includes 2 locations and 14 menu items across 4 categories
4. Toggle back to "Live Data" to use the real Square API

## API Documentation

### GET /api/locations

Fetches all active restaurant locations.

**Response:**
```json
{
  "locations": [
    {
      "id": "L8Y2XKQBDPN3M",
      "name": "Downtown Location",
      "address": {
        "line1": "123 Main Street",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94102",
        "country": "US"
      },
      "timezone": "America/Los_Angeles",
      "status": "ACTIVE"
    }
  ]
}
```

### GET /api/catalog?location_id=<ID>

Fetches menu items for a location, grouped by category.

**Parameters:**
- `location_id` (required): Square location ID

**Response:**
```json
{
  "categories": [
    { "id": "CAT123", "name": "Appetizers", "itemCount": 5 }
  ],
  "itemsByCategory": {
    "CAT123": [
      {
        "id": "ITEM001",
        "name": "Spring Rolls",
        "description": "Crispy vegetable spring rolls",
        "categoryId": "CAT123",
        "categoryName": "Appetizers",
        "imageUrl": "https://...",
        "variations": [
          {
            "id": "VAR001",
            "name": "Regular",
            "price": 850,
            "formattedPrice": "$8.50",
            "currency": "USD"
          }
        ]
      }
    ]
  },
  "totalItems": 25
}
```

### GET /api/catalog/categories?location_id=<ID>

Fetches categories with item counts for a location.

**Parameters:**
- `location_id` (required): Square location ID

**Response:**
```json
{
  "categories": [
    { "id": "CAT123", "name": "Appetizers", "itemCount": 5 },
    { "id": "CAT456", "name": "Main Course", "itemCount": 8 }
  ]
}
```

### GET /api/mock-mode

Gets the current mock mode status.

**Response:**
```json
{
  "mockMode": true
}
```

### POST /api/mock-mode

Sets the mock mode status.

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "enabled": true
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── locations/              # GET /api/locations
│   │   ├── catalog/                # GET /api/catalog
│   │   │   └── categories/        # GET /api/catalog/categories
│   │   └── mock-mode/              # GET/POST /api/mock-mode
│   ├── layout.tsx                  # Root layout with ThemeProvider
│   ├── page.tsx                    # Main page component
│   └── globals.css                 # Global styles & animations
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── tabs.tsx
│   ├── category-navigation.tsx     # Category tabs navigation
│   ├── empty-state.tsx             # Reusable empty states
│   ├── error-state.tsx             # Reusable error states
│   ├── location-selector.tsx       # Location dropdown
│   ├── menu-display.tsx            # Main menu orchestrator
│   ├── menu-item-card.tsx          # Individual menu item card
│   ├── mock-mode-toggle.tsx        # Mock data toggle button
│   ├── search-bar.tsx              # Search input component
│   ├── theme-provider.tsx          # Theme context provider
│   └── theme-toggle.tsx            # Theme toggle button
├── lib/
│   ├── square/                     # Square API integration
│   │   ├── client.ts               # Square SDK client setup
│   │   ├── service.ts              # API methods & data transformation
│   │   └── index.ts                # Public exports
│   ├── cache.ts                    # In-memory caching with TTL
│   ├── logger.ts                   # Request logging utility
│   ├── api-error.ts                # Error handling utilities
│   ├── mock-data.ts                # Mock data for testing
│   ├── mock-mode.ts                # Mock mode cookie utilities
│   └── utils.ts                    # General utilities (cn, etc.)
└── types/
    ├── square.ts                   # Square API & app types
    ├── squareup.d.ts               # Square SDK type declarations
    └── index.ts                    # Type exports
```

## Architecture Decisions

### Backend

- **Next.js App Router**: Leverages route handlers for API endpoints
- **API Proxy Pattern**: Backend securely proxies Square API calls, keeping access tokens server-side
- **In-Memory Caching**: Reduces API calls to Square with configurable TTL (5-10 minutes)
- **Pagination Handling**: Transparently handles Square's cursor-based pagination
- **Error Mapping**: Square API errors are mapped to clean, user-friendly responses

### Frontend

- **Mobile-First Design**: Optimized for 375px viewport and scales up to desktop
- **Server & Client Components**: Mix of Server Components (layout) and Client Components (interactive features)
- **State Management**: 
  - Location selection persisted in localStorage
  - Theme preference persisted in localStorage
  - Mock mode persisted in cookies (server-side) and localStorage (client-side)
- **Client-Side Filtering**: Search and category filtering performed on client (no additional API calls)
- **Loading States**: Skeleton loaders and smooth fade-in animations
- **Error Handling**: Comprehensive error states with retry functionality
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support


### Branch Strategy

- Always branch from `dev` for new features
- Use descriptive branch names (e.g., `feature/location-selector`)
- Write detailed, multi-line commit messages
- Create PRs to `dev` with clear descriptions
- Merge to `main` periodically for releases

