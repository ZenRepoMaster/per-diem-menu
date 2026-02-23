import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { validateRequiredParams } from '@/lib/api-error';
import { ApiCatalogResponse } from '@/types';
import { getMockCatalog } from '@/lib/mock-data';
import {
  createApiContext,
  logResponse,
  logError,
  tryMockMode,
  tryCache,
} from '../utils';

export async function GET(request: NextRequest) {
  const context = createApiContext(request);
  const searchParams = request.nextUrl.searchParams;

  try {
    const validation = validateRequiredParams(searchParams, ['location_id']);
    if (!validation.valid) {
      return logResponse(validation.response, context, 'Missing location_id parameter');
    }

    const locationId = searchParams.get('location_id')!;

    const mockResponse = await tryMockMode(
      () => getMockCatalog(locationId),
      context,
      `Returning mock catalog for location: ${locationId}`
    );
    if (mockResponse) return mockResponse;

    const cacheKey = CacheKeys.catalog(locationId);
    const cachedResponse = tryCache<ApiCatalogResponse>(
      cacheKey,
      context,
      `Returning cached catalog for location: ${locationId}`
    );
    if (cachedResponse) return cachedResponse;

    const catalog = await fetchCatalog(locationId);

    cache.set(cacheKey, catalog, CacheTTL.CATALOG);

    return logResponse(NextResponse.json(catalog), context);
  } catch (error) {
    return logError(error, context);
  }
}