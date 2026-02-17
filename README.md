# Per Diem Menu

A mobile-friendly web application that connects to the Square Catalog API to display restaurant menu items, filtered by location and category.

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

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/locations` | Fetch all active restaurant locations |
| `GET /api/catalog?location_id=<ID>` | Fetch menu items for a location, grouped by category |
| `GET /api/catalog/categories?location_id=<ID>` | Fetch categories with item counts for a location |

## Project Structure

```
src/
├── app/
│   ├── api/           # API route handlers
│   ├── components/    # React components
│   └── page.tsx       # Main page
├── lib/
│   ├── square/        # Square API client & types
│   ├── cache/         # Caching utilities
│   └── utils.ts       # Utility functions
└── types/             # TypeScript type definitions
```

## Architecture Decisions

- **Next.js App Router**: Leverages server components and route handlers for optimal performance
- **API Proxy Pattern**: Backend securely proxies Square API calls, keeping access tokens server-side
- **In-Memory Caching**: Reduces API calls to Square with configurable TTL
- **Zod Validation**: Runtime type validation for API responses
- **Mobile-First Design**: Optimized for 375px viewport and scales up


## License

This project is for demonstration purposes as part of the Per Diem coding challenge.
