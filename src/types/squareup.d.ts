/**
 * Type declarations for the Square SDK (square)
 * 
 * Based on the official Square Node.js SDK.
 */

declare module 'square' {
  export enum SquareEnvironment {
    Production = 'production',
    Sandbox = 'sandbox',
  }

  export interface SquareClientOptions {
    token?: string;
    environment?: SquareEnvironment;
  }

  // Money type
  export interface Money {
    amount?: bigint;
    currency?: string;
  }

  // Address type
  export interface Address {
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    locality?: string;
    sublocality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  }

  // Location types
  export interface Location {
    id?: string;
    name?: string;
    address?: Address;
    timezone?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    merchantId?: string;
    country?: string;
    languageCode?: string;
    currency?: string;
    phoneNumber?: string;
    businessName?: string;
    type?: 'PHYSICAL' | 'MOBILE';
    description?: string;
  }

  export interface ListLocationsResponse {
    locations?: Location[];
    errors?: Array<{
      category?: string;
      code?: string;
      detail?: string;
      field?: string;
    }>;
  }

  // Catalog types
  export interface CatalogObject {
    type?: string;
    id?: string;
    updatedAt?: string;
    version?: bigint;
    isDeleted?: boolean;
    presentAtAllLocations?: boolean;
    presentAtLocationIds?: string[];
    absentAtLocationIds?: string[];
    itemData?: {
      name?: string;
      description?: string;
      categories?: Array<{ id?: string; ordinal?: number }>;
      variations?: CatalogObject[];
      imageIds?: string[];
      productType?: string;
      visibility?: string;
    };
    itemVariationData?: {
      itemId?: string;
      name?: string;
      ordinal?: number;
      priceMoney?: Money;
      pricingType?: 'FIXED_PRICING' | 'VARIABLE_PRICING';
      sku?: string;
    };
    categoryData?: {
      name?: string;
      ordinal?: number;
      isTopLevel?: boolean;
      parentCategory?: { id?: string };
    };
    imageData?: {
      name?: string;
      url?: string;
      caption?: string;
    };
  }

  export interface SearchCatalogObjectsRequest {
    cursor?: string;
    objectTypes?: string[];
    includeDeletedObjects?: boolean;
    includeRelatedObjects?: boolean;
    beginTime?: string;
    query?: {
      prefixQuery?: {
        attributeName?: string;
        attributePrefix?: string;
      };
      exactQuery?: {
        attributeName?: string;
        attributeValue?: string;
      };
    };
    limit?: number;
  }

  export interface SearchCatalogObjectsResponse {
    cursor?: string;
    objects?: CatalogObject[];
    relatedObjects?: CatalogObject[];
    errors?: Array<{
      category?: string;
      code?: string;
      detail?: string;
      field?: string;
    }>;
  }

  // API interfaces
  export interface CatalogApi {
    search(
      request: SearchCatalogObjectsRequest
    ): Promise<SearchCatalogObjectsResponse>;
  }

  export interface LocationsApi {
    list(): Promise<ListLocationsResponse>;
  }

  export class SquareClient {
    constructor(options: SquareClientOptions);
    catalog: CatalogApi;
    locations: LocationsApi;
  }
}

