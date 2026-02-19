/**
 * GET /api/catalog
 * 
 * Fetch catalog items from Square's Catalog API for a specific location.
 * Returns items grouped by category with images and variations.
 * 
 * Query Parameters:
 * - location_id (required): The Square location ID to filter items by
 * 
 * Response:
 * {
 *   categories: [{ id, name, itemCount }],
 *   itemsByCategory: {
 *     [categoryId]: [
 *       {
 *         id, name, description, categoryId, categoryName,
 *         imageUrl, variations: [{ id, name, price, formattedPrice, currency }]
 *       }
 *     ]
 *   },
 *   totalItems: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { logger, startTimer } from '@/lib/logger';
import { handleApiError, validateRequiredParams } from '@/lib/api-error';
import { ApiCatalogResponse } from '@/types';
import { isMockModeEnabled } from '@/lib/mock-mode';
import { getMockCatalog } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const getElapsed = startTimer();
  const path = '/api/catalog';
  const searchParams = request.nextUrl.searchParams;
  
  try {
    // Validate required parameters
    const validation = validateRequiredParams(searchParams, ['location_id']);
    if (!validation.valid) {
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 400,
        duration: getElapsed(),
        error: 'Missing location_id parameter',
      });
      return validation.response;
    }
    
    const locationId = searchParams.get('location_id')!;
    
    // Check if mock mode is enabled
    const mockMode = await isMockModeEnabled();
    
    if (mockMode) {
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 200,
        duration: getElapsed(),
      });
      logger.debug(`Returning mock catalog for location: ${locationId}`);
      
      return NextResponse.json(getMockCatalog(locationId));
    }
    
    const cacheKey = CacheKeys.catalog(locationId);
    
    // Check cache first
    const cached = cache.get<ApiCatalogResponse>(cacheKey);
    
    if (cached) {
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 200,
        duration: getElapsed(),
      });
      logger.debug(`Returning cached catalog for location: ${locationId}`);
      
      return NextResponse.json(cached);
    }
    
    // Fetch from Square API
    const catalog = await fetchCatalog(locationId);
    
    // Cache the response
    cache.set(cacheKey, catalog, CacheTTL.CATALOG);
    
    logger.logRequest({
      method: 'GET',
      path,
      statusCode: 200,
      duration: getElapsed(),
    });
    
    return NextResponse.json(catalog);
    
  } catch (error) {
    logger.logRequest({
      method: 'GET',
      path,
      statusCode: 500,
      duration: getElapsed(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return handleApiError(error, path);
  }
}
