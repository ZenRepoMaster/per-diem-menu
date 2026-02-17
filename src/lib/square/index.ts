/**
 * Square API Module
 * 
 * Barrel export for Square client and service functions.
 */

export { getSquareClient, getCatalogApi, getLocationsApi, isSandbox } from './client';
export { 
  fetchLocations, 
  fetchCatalog, 
  fetchCategories,
  formatPrice,
} from './service';
