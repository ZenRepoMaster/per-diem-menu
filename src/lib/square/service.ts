/**
 * Square API Service
 * 
 * Provides high-level methods for interacting with Square APIs.
 * Handles data transformation, pagination, and error mapping.
 */

import { 
  CatalogObject, 
  Location,
} from 'square';
import { getCatalogApi, getLocationsApi } from './client';
import { 
  ApiLocation, 
  ApiMenuItem, 
  ApiCategory, 
  ApiCatalogResponse,
  ApiItemVariation,
} from '@/types';
import { logger } from '@/lib/logger';

// ============================================================================
// Data Transformation Helpers
// ============================================================================

/**
 * Format price from cents to currency string
 * @param amount - Amount in cents (as bigint or number)
 * @param currency - Currency code (default: USD)
 */
export function formatPrice(amount: bigint | number | undefined, currency = 'USD'): string {
  if (amount === undefined || amount === null) {
    return '$0.00';
  }
  
  // Convert bigint to number if needed
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  const dollars = numAmount / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

/**
 * Transform Square Location to API Location format
 */
function transformLocation(location: Location): ApiLocation {
  return {
    id: location.id ?? '',
    name: location.name ?? 'Unknown Location',
    address: {
      line1: location.address?.addressLine1 ?? '',
      line2: location.address?.addressLine2,
      city: location.address?.locality ?? '',
      state: location.address?.administrativeDistrictLevel1 ?? '',
      postalCode: location.address?.postalCode ?? '',
      country: location.address?.country ?? 'US',
    },
    timezone: location.timezone ?? 'America/New_York',
    status: location.status ?? 'INACTIVE',
  };
}

/**
 * Check if a catalog object is present at a specific location
 */
function isItemPresentAtLocation(item: CatalogObject, locationId: string): boolean {
  // If present at all locations, it's available everywhere
  if (item.presentAtAllLocations) {
    // But check if it's explicitly absent at this location
    if (item.absentAtLocationIds?.includes(locationId)) {
      return false;
    }
    return true;
  }
  
  // Otherwise, check if it's explicitly present at this location
  return item.presentAtLocationIds?.includes(locationId) ?? false;
}

/**
 * Transform item variations to API format
 */
function transformVariations(
  variations: CatalogObject[] | undefined
): ApiItemVariation[] {
  if (!variations || variations.length === 0) {
    return [];
  }
  
  return variations
    .filter(v => v.itemVariationData)
    .map(v => {
      const data = v.itemVariationData!;
      const amount = data.priceMoney?.amount;
      const currency = data.priceMoney?.currency ?? 'USD';
      
      return {
        id: v.id ?? '',
        name: data.name ?? 'Regular',
        price: typeof amount === 'bigint' ? Number(amount) : (amount ?? 0),
        formattedPrice: formatPrice(amount, currency),
        currency,
      };
    })
    .sort((a, b) => a.price - b.price); // Sort by price ascending
}

// ============================================================================
// API Methods
// ============================================================================

/**
 * Fetch all active locations from Square
 * 
 * Uses Square Locations API: https://developer.squareup.com/reference/square/locations-api/list-locations
 * 
 * Note: In Square Sandbox environment, there is typically one default test location
 * ("Default Test Account"). To test with multiple locations, create additional
 * locations via the Square Sandbox Seller Dashboard.
 * 
 * @returns Promise resolving to array of active locations
 */
export async function fetchLocations(): Promise<ApiLocation[]> {
  const locationsApi = getLocationsApi();
  
  logger.debug('Fetching locations from Square API');
  
  // Square Locations API: list() returns all locations for the merchant
  // Reference: https://developer.squareup.com/reference/square/locations-api/list-locations
  const result = await locationsApi.list();
  
  if (result.errors && result.errors.length > 0) {
    logger.error('Square API returned errors', { errors: result.errors });
    throw new Error(result.errors[0]?.detail ?? 'Failed to fetch locations');
  }
  
  const locations = result.locations ?? [];
  
  // Filter to only active locations and transform
  // Square API returns locations with status: 'ACTIVE' | 'INACTIVE'
  const activeLocations = locations
    .filter(loc => loc.status === 'ACTIVE')
    .map(transformLocation);
  
  logger.debug(`Fetched ${activeLocations.length} active locations`);
  
  return activeLocations;
}

/**
 * Fetch catalog items for a specific location with pagination handling
 */
export async function fetchCatalog(locationId: string): Promise<ApiCatalogResponse> {
  const catalogApi = getCatalogApi();
  
  logger.debug(`Fetching catalog for location: ${locationId}`);
  
  // Fetch all pages of catalog items
  let allObjects: CatalogObject[] = [];
  let allRelatedObjects: CatalogObject[] = [];
  let cursor: string | undefined;
  
  do {
    const result = await catalogApi.search({
      objectTypes: ['ITEM'],
      includeRelatedObjects: true,
      includeDeletedObjects: false,
      cursor,
    });
    
    if (result.errors && result.errors.length > 0) {
      logger.error('Square API returned errors', { errors: result.errors });
      throw new Error(result.errors[0]?.detail ?? 'Failed to fetch catalog');
    }
    
    if (result.objects) {
      allObjects = [...allObjects, ...result.objects];
    }
    
    if (result.relatedObjects) {
      allRelatedObjects = [...allRelatedObjects, ...result.relatedObjects];
    }
    
    cursor = result.cursor;
    
    logger.debug(`Fetched page with ${result.objects?.length ?? 0} items, cursor: ${cursor ? 'yes' : 'no'}`);
    
  } while (cursor);
  
  // Build lookup maps for related objects (categories and images)
  const categoryMap = new Map<string, CatalogObject>();
  const imageMap = new Map<string, CatalogObject>();
  
  for (const obj of allRelatedObjects) {
    if (obj.type === 'CATEGORY' && obj.id) {
      categoryMap.set(obj.id, obj);
    } else if (obj.type === 'IMAGE' && obj.id) {
      imageMap.set(obj.id, obj);
    }
  }
  
  // Filter items present at this location
  const locationItems = allObjects.filter(item => 
    item.type === 'ITEM' && isItemPresentAtLocation(item, locationId)
  );
  
  logger.debug(`Found ${locationItems.length} items for location ${locationId}`);
  
  // Transform items and group by category
  const itemsByCategory: Record<string, ApiMenuItem[]> = {};
  const categoryItemCounts: Record<string, number> = {};
  
  for (const item of locationItems) {
    const itemData = item.itemData;
    if (!itemData) continue;
    
    // Get category info
    const categoryRef = itemData.categories?.[0];
    const category = categoryRef?.id ? categoryMap.get(categoryRef.id) : null;
    const categoryId = category?.id ?? 'uncategorized';
    const categoryName = category?.categoryData?.name ?? 'Uncategorized';
    
    // Get image URL
    const imageId = itemData.imageIds?.[0];
    const image = imageId ? imageMap.get(imageId) : null;
    const imageUrl = image?.imageData?.url ?? null;
    
    // Transform item
    const menuItem: ApiMenuItem = {
      id: item.id ?? '',
      name: itemData.name ?? 'Unknown Item',
      description: itemData.description ?? '',
      categoryId,
      categoryName,
      imageUrl,
      variations: transformVariations(itemData.variations),
    };
    
    // Add to category group
    if (!itemsByCategory[categoryId]) {
      itemsByCategory[categoryId] = [];
    }
    itemsByCategory[categoryId].push(menuItem);
    
    // Count items per category
    categoryItemCounts[categoryId] = (categoryItemCounts[categoryId] ?? 0) + 1;
  }
  
  // Build categories array with counts
  const categories: ApiCategory[] = Object.entries(categoryItemCounts)
    .map(([id, count]) => ({
      id,
      name: id === 'uncategorized' 
        ? 'Uncategorized' 
        : categoryMap.get(id)?.categoryData?.name ?? 'Unknown',
      itemCount: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return {
    categories,
    itemsByCategory,
    totalItems: locationItems.length,
  };
}

/**
 * Fetch categories for a specific location
 * Returns only categories that have items at this location
 */
export async function fetchCategories(locationId: string): Promise<ApiCategory[]> {
  // Reuse the catalog fetch to get accurate category counts
  const catalog = await fetchCatalog(locationId);
  return catalog.categories;
}
