/**
 * GET /api/catalog/categories
 * 
 * Fetch categories for a specific location from Square's Catalog API.
 * Returns only categories that have at least one item at the given location.
 * 
 * Query Parameters:
 * - location_id (required): The Square location ID to filter categories by
 * 
 * Response:
 * {
 *   categories: [
 *     { id: string, name: string, itemCount: number }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { logger, startTimer } from '@/lib/logger';
import { handleApiError, validateRequiredParams } from '@/lib/api-error';
import { ApiCategoriesResponse, ApiCategory } from '@/types';
import { isMockModeEnabled } from '@/lib/mock-mode';
import { getMockCatalog } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const getElapsed = startTimer();
  const path = '/api/catalog/categories';
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
      const mockCatalog = getMockCatalog();
      const response: ApiCategoriesResponse = { categories: mockCatalog.categories };
      
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 200,
        duration: getElapsed(),
      });
      logger.debug(`Returning mock categories for location: ${locationId}`);
      
      return NextResponse.json(response);
    }
    
    const cacheKey = CacheKeys.categories(locationId);
    
    // Check cache first
    const cached = cache.get<ApiCategoriesResponse>(cacheKey);
    
    if (cached) {
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 200,
        duration: getElapsed(),
      });
      logger.debug(`Returning cached categories for location: ${locationId}`);
      
      return NextResponse.json(cached);
    }
    
    // Fetch from Square API
    const categories: ApiCategory[] = await fetchCategories(locationId);
    
    const response: ApiCategoriesResponse = { categories };
    
    // Cache the response
    cache.set(cacheKey, response, CacheTTL.CATEGORIES);
    
    logger.logRequest({
      method: 'GET',
      path,
      statusCode: 200,
      duration: getElapsed(),
    });
    
    return NextResponse.json(response);
    
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
