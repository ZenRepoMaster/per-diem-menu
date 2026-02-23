import { NextRequest, NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/square';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache';
import { validateRequiredParams } from '@/lib/api-error';
import { ApiCategoriesResponse } from '@/types';
import { getMockCatalog } from '@/lib/mock-data';
import {
  createApiContext,
  logResponse,
  logError,
  tryMockMode,
  tryCache,
} from '../../utils';

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
      () => {
        const mockCatalog = getMockCatalog();
        return { categories: mockCatalog.categories };
      },
      context,
      `Returning mock categories for location: ${locationId}`
    );
    if (mockResponse) return mockResponse;

    const cacheKey = CacheKeys.categories(locationId);
    const cachedResponse = tryCache<ApiCategoriesResponse>(
      cacheKey,
      context,
      `Returning cached categories for location: ${locationId}`
    );
    if (cachedResponse) return cachedResponse;

    const categories = await fetchCategories(locationId);
    const response: ApiCategoriesResponse = { categories };

    cache.set(cacheKey, response, CacheTTL.CATEGORIES);

    return logResponse(NextResponse.json(response), context);
  } catch (error) {
    return logError(error, context);
  }
}