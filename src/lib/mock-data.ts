/**
 * Mock Data for Testing
 * 
 * Provides sample data that matches the Square API response structure.
 * Used when Square Sandbox doesn't have catalog items configured.
 */

import { ApiLocation, ApiCatalogResponse, ApiMenuItem } from '@/types';

/**
 * Mock locations data
 */
export const mockLocations: ApiLocation[] = [
  {
    id: 'MOCK_LOC_1',
    name: 'Downtown Restaurant',
    address: {
      line1: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    timezone: 'America/Los_Angeles',
    status: 'ACTIVE',
  },
  {
    id: 'MOCK_LOC_2',
    name: 'Uptown Cafe',
    address: {
      line1: '456 Market Street',
      line2: 'Suite 200',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US',
    },
    timezone: 'America/Los_Angeles',
    status: 'ACTIVE',
  },
];

/**
 * Mock catalog data
 */
export const mockCatalog: ApiCatalogResponse = {
  categories: [
    { id: 'MOCK_CAT_1', name: 'Appetizers', itemCount: 3 },
    { id: 'MOCK_CAT_2', name: 'Main Courses', itemCount: 4 },
    { id: 'MOCK_CAT_3', name: 'Desserts', itemCount: 2 },
    { id: 'MOCK_CAT_4', name: 'Beverages', itemCount: 5 },
  ],
  itemsByCategory: {
    MOCK_CAT_1: [
      {
        id: 'MOCK_ITEM_1',
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls served with sweet and sour dipping sauce',
        categoryId: 'MOCK_CAT_1',
        categoryName: 'Appetizers',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_1',
            name: 'Regular (4 pieces)',
            price: 850,
            formattedPrice: '$8.50',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_2',
        name: 'Chicken Satay',
        description: 'Grilled chicken skewers marinated in spices, served with peanut sauce',
        categoryId: 'MOCK_CAT_1',
        categoryName: 'Appetizers',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_2',
            name: 'Regular (3 skewers)',
            price: 1200,
            formattedPrice: '$12.00',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_3',
        name: 'Edamame',
        description: 'Steamed soybeans sprinkled with sea salt',
        categoryId: 'MOCK_CAT_1',
        categoryName: 'Appetizers',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_3',
            name: 'Regular',
            price: 600,
            formattedPrice: '$6.00',
            currency: 'USD',
          },
        ],
      },
    ],
    MOCK_CAT_2: [
      {
        id: 'MOCK_ITEM_4',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with shrimp, tofu, bean sprouts, and peanuts',
        categoryId: 'MOCK_CAT_2',
        categoryName: 'Main Courses',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_4',
            name: 'Regular',
            price: 1650,
            formattedPrice: '$16.50',
            currency: 'USD',
          },
          {
            id: 'MOCK_VAR_5',
            name: 'Large',
            price: 1950,
            formattedPrice: '$19.50',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_5',
        name: 'Green Curry',
        description: 'Thai green curry with chicken, eggplant, and basil leaves, served with jasmine rice',
        categoryId: 'MOCK_CAT_2',
        categoryName: 'Main Courses',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_6',
            name: 'Regular',
            price: 1800,
            formattedPrice: '$18.00',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_6',
        name: 'Beef Teriyaki',
        description: 'Grilled beef marinated in teriyaki sauce, served with steamed vegetables and rice',
        categoryId: 'MOCK_CAT_2',
        categoryName: 'Main Courses',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_7',
            name: 'Regular',
            price: 2200,
            formattedPrice: '$22.00',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_7',
        name: 'Vegetable Stir Fry',
        description: 'Fresh seasonal vegetables stir-fried in a light soy sauce',
        categoryId: 'MOCK_CAT_2',
        categoryName: 'Main Courses',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_8',
            name: 'Regular',
            price: 1400,
            formattedPrice: '$14.00',
            currency: 'USD',
          },
        ],
      },
    ],
    MOCK_CAT_3: [
      {
        id: 'MOCK_ITEM_8',
        name: 'Mango Sticky Rice',
        description: 'Sweet sticky rice topped with fresh mango slices and coconut cream',
        categoryId: 'MOCK_CAT_3',
        categoryName: 'Desserts',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_9',
            name: 'Regular',
            price: 800,
            formattedPrice: '$8.00',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_9',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        categoryId: 'MOCK_CAT_3',
        categoryName: 'Desserts',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_10',
            name: 'Regular',
            price: 950,
            formattedPrice: '$9.50',
            currency: 'USD',
          },
        ],
      },
    ],
    MOCK_CAT_4: [
      {
        id: 'MOCK_ITEM_10',
        name: 'Thai Iced Tea',
        description: 'Traditional Thai tea with condensed milk and ice',
        categoryId: 'MOCK_CAT_4',
        categoryName: 'Beverages',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_11',
            name: 'Regular',
            price: 450,
            formattedPrice: '$4.50',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_11',
        name: 'Fresh Coconut Water',
        description: 'Fresh coconut water served in the shell',
        categoryId: 'MOCK_CAT_4',
        categoryName: 'Beverages',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_12',
            name: 'Regular',
            price: 550,
            formattedPrice: '$5.50',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_12',
        name: 'Green Tea',
        description: 'Premium Japanese green tea',
        categoryId: 'MOCK_CAT_4',
        categoryName: 'Beverages',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_13',
            name: 'Regular',
            price: 350,
            formattedPrice: '$3.50',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_13',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        categoryId: 'MOCK_CAT_4',
        categoryName: 'Beverages',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_14',
            name: 'Regular',
            price: 500,
            formattedPrice: '$5.00',
            currency: 'USD',
          },
        ],
      },
      {
        id: 'MOCK_ITEM_14',
        name: 'Sparkling Water',
        description: 'Premium sparkling water',
        categoryId: 'MOCK_CAT_4',
        categoryName: 'Beverages',
        imageUrl: null,
        variations: [
          {
            id: 'MOCK_VAR_15',
            name: 'Regular',
            price: 300,
            formattedPrice: '$3.00',
            currency: 'USD',
          },
        ],
      },
    ],
  },
  totalItems: 14,
};

/**
 * Get mock locations response
 */
export function getMockLocations() {
  return { locations: mockLocations };
}

/**
 * Get mock catalog response for a specific location
 * 
 * Note: Currently returns the same mock data for all locations.
 * This is intentional for testing purposes - both mock locations
 * will show the same 14 menu items across 4 categories.
 * 
 * To make locations have different catalogs, you can:
 * 1. Create separate mock catalog objects (e.g., mockCatalogDowntown, mockCatalogUptown)
 * 2. Return different catalogs based on locationId
 * 
 * Example:
 * if (locationId === 'MOCK_LOC_1') return mockCatalogDowntown;
 * if (locationId === 'MOCK_LOC_2') return mockCatalogUptown;
 */
export function getMockCatalog(locationId?: string) {
  // Return the same catalog for all locations (intentional for testing)
  return mockCatalog;
}

