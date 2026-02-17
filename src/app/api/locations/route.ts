/**
 * GET /api/locations
 * 
 * Fetch all active locations from Square's Locations API.
 * Returns simplified location data with id, name, address, timezone, and status.
 * 
 * Response:
 * {
 *   locations: [
 *     {
 *       id: string,
 *       name: string,
 *       address: { line1, line2?, city, state, postalCode, country },
 *       timezone: string,
 *       status: "ACTIVE"
 *     }
 *   ]
 * }
 */

import { NextResponse } from 'next/server';
import { fetchLocations } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { logger, startTimer } from '@/lib/logger';
import { handleApiError } from '@/lib/api-error';
import { ApiLocationsResponse } from '@/types';

export async function GET() {
  const getElapsed = startTimer();
  const path = '/api/locations';
  
  try {
    // Check cache first
    const cached = cache.get<ApiLocationsResponse>(CacheKeys.locations());
    
    if (cached) {
      logger.logRequest({
        method: 'GET',
        path,
        statusCode: 200,
        duration: getElapsed(),
      });
      logger.debug('Returning cached locations');
      
      return NextResponse.json(cached);
    }
    
    // Fetch from Square API
    const locations = await fetchLocations();
    
    const response: ApiLocationsResponse = { locations };
    
    // Cache the response
    cache.set(CacheKeys.locations(), response, CacheTTL.LOCATIONS);
    
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
