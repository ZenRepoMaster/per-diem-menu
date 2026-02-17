/**
 * Square API Type Definitions
 * 
 * These types represent the data structures returned by Square's APIs
 * and our transformed/simplified response formats.
 */

// ============================================================================
// Square API Raw Types (from Square SDK)
// ============================================================================

/**
 * Square Address object
 */
export interface SquareAddress {
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  locality?: string; // City
  sublocality?: string;
  administrative_district_level_1?: string; // State/Province
  postal_code?: string;
  country?: string;
}

/**
 * Square Location object from Locations API
 */
export interface SquareLocation {
  id: string;
  name?: string;
  address?: SquareAddress;
  timezone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
  merchant_id?: string;
  country?: string;
  language_code?: string;
  currency?: string;
  phone_number?: string;
  business_name?: string;
  type?: 'PHYSICAL' | 'MOBILE';
  description?: string;
}

/**
 * Square Money object for pricing
 */
export interface SquareMoney {
  amount?: bigint | number;
  currency?: string;
}

/**
 * Square Item Variation data
 */
export interface SquareItemVariationData {
  item_id?: string;
  name?: string;
  ordinal?: number;
  price_money?: SquareMoney;
  pricing_type?: 'FIXED_PRICING' | 'VARIABLE_PRICING';
  sku?: string;
}

/**
 * Square Category reference in item
 */
export interface SquareCategoryReference {
  id?: string;
  ordinal?: number;
}

/**
 * Square Item data
 */
export interface SquareItemData {
  name?: string;
  description?: string;
  categories?: SquareCategoryReference[];
  variations?: SquareCatalogObject[];
  image_ids?: string[];
  product_type?: string;
  visibility?: string;
}

/**
 * Square Category data
 */
export interface SquareCategoryData {
  name?: string;
  ordinal?: number;
  is_top_level?: boolean;
  parent_category?: { id?: string };
}

/**
 * Square Image data
 */
export interface SquareImageData {
  name?: string;
  url?: string;
  caption?: string;
}

/**
 * Square Catalog Object - generic container for all catalog types
 */
export interface SquareCatalogObject {
  type: 'ITEM' | 'ITEM_VARIATION' | 'CATEGORY' | 'IMAGE' | string;
  id: string;
  updated_at?: string;
  version?: bigint | number;
  is_deleted?: boolean;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[];
  absent_at_location_ids?: string[];
  item_data?: SquareItemData;
  item_variation_data?: SquareItemVariationData;
  category_data?: SquareCategoryData;
  image_data?: SquareImageData;
}

// ============================================================================
// API Response Types (our simplified/transformed responses)
// ============================================================================

/**
 * Simplified address for API response
 */
export interface ApiAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Simplified location for API response
 */
export interface ApiLocation {
  id: string;
  name: string;
  address: ApiAddress;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Item variation with price
 */
export interface ApiItemVariation {
  id: string;
  name: string;
  price: number; // Price in cents
  formattedPrice: string; // e.g., "$12.50"
  currency: string;
}

/**
 * Menu item for API response
 */
export interface ApiMenuItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
  variations: ApiItemVariation[];
}

/**
 * Category with item count
 */
export interface ApiCategory {
  id: string;
  name: string;
  itemCount: number;
}

/**
 * Catalog response grouped by category
 */
export interface ApiCatalogResponse {
  categories: ApiCategory[];
  itemsByCategory: Record<string, ApiMenuItem[]>;
  totalItems: number;
}

/**
 * Categories response
 */
export interface ApiCategoriesResponse {
  categories: ApiCategory[];
}

/**
 * Locations response
 */
export interface ApiLocationsResponse {
  locations: ApiLocation[];
}

// ============================================================================
// API Error Types
// ============================================================================

/**
 * Standard API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

/**
 * Square API error structure
 */
export interface SquareApiError {
  category?: string;
  code?: string;
  detail?: string;
  field?: string;
}
