# Per Diem Menu

A mobile-friendly web application that connects to the Square Catalog API to display restaurant menu items, filtered by location and category.

## Project Status

| Component | Status |
|-----------|--------|
| Backend API | Complete |
| Frontend UI | In Progress |
| Testing | In Progress |
| Deployment | Pending |

## Features

- **Location Selection**: Choose from available restaurant locations
- **Category Navigation**: Browse menu items by category with smooth scrolling
- **Menu Display**: View items with images, descriptions, and pricing
- **Search**: Filter menu items by name or description
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first design optimized for all screen sizes

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

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── locations/        # GET /api/locations
│   │   └── catalog/          # GET /api/catalog, /api/catalog/categories
│   ├── components/           # React components (coming soon)
│   └── page.tsx              # Main page
├── lib/
│   ├── square/               # Square API client & service
│   │   ├── client.ts         # SDK configuration
│   │   └── service.ts        # API methods & data transformation
│   ├── cache.ts              # In-memory caching with TTL
│   ├── logger.ts             # Request logging utility
│   ├── api-error.ts          # Error handling utilities
│   └── utils.ts              # General utilities
└── types/
    ├── square.ts             # API response types
    └── squareup.d.ts         # Square SDK type declarations
```

## Architecture Decisions

### Backend

- **Next.js App Router**: Leverages route handlers for API endpoints
- **API Proxy Pattern**: Backend securely proxies Square API calls, keeping access tokens server-side
- **In-Memory Caching**: Reduces API calls to Square with configurable TTL (5-10 minutes)
- **Pagination Handling**: Transparently handles Square's cursor-based pagination
- **Error Mapping**: Square API errors are mapped to clean, user-friendly responses

### Frontend (Planned)

- **Mobile-First Design**: Optimized for 375px viewport and scales up
- **Server Components**: Leverage Next.js server components where possible
- **Client-Side State**: Location selection persisted in localStorage

## Development Workflow

This project follows a structured Git workflow:

1. `main` - Production-ready code
2. `dev` - Integration branch
3. `feature/*` - Feature branches
4. `docs/*` - Documentation updates

All changes go through pull requests with detailed descriptions.

## License

This project is for demonstration purposes as part of the Per Diem coding challenge.
