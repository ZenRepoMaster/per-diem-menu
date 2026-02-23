import { NextRequest, NextResponse } from 'next/server';
import { fetchLocations } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { ApiLocationsResponse } from '@/types';
import { getMockLocations } from '@/lib/mock-data';
import {
  createApiContext,
  logResponse,
  logError,
  tryMockMode,
  tryCache,
} from '../utils';

export async function GET(request: NextRequest) {
  const context = createApiContext(request);

  try {
    const mockResponse = await tryMockMode(
      getMockLocations,
      context,
      'Returning mock locations'
    );
    if (mockResponse) return mockResponse;

    const cacheKey = CacheKeys.locations();
    const cachedResponse = tryCache<ApiLocationsResponse>(
      cacheKey,
      context,
      'Returning cached locations'
    );
    if (cachedResponse) return cachedResponse;

    const locations = await fetchLocations();
    const response: ApiLocationsResponse = { locations };

    cache.set(cacheKey, response, CacheTTL.LOCATIONS);

    return logResponse(NextResponse.json(response), context);
  } catch (error) {
    return logError(error, context);
  }
}
