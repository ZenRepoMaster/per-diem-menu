import { NextRequest, NextResponse } from 'next/server'
import { logger, startTimer } from '@/lib/logger'
import { handleApiError } from '@/lib/api-error'
import { isMockModeEnabled } from '@/lib/mock-mode'
import { cache, CacheKeys, CacheTTL } from '@/lib/cache'

// Context object passed to route handlers
export interface ApiRouteContext {
  request: NextRequest
  path: string
  method: string
  getElapsed: () => number
}

// Helper to extract error message from unknown error type
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

// Log request and return response with optional debug message
export function logResponse<T>(
  response: NextResponse<T>,
  context: ApiRouteContext,
  debugMessage?: string
): NextResponse<T> {
  logger.logRequest({
    method: context.method,
    path: context.path,
    statusCode: response.status,
    duration: context.getElapsed(),
  });

  if (debugMessage) {
    logger.debug(debugMessage)
  }

  return response;
}

// Log error and return error response
export function logError(
  error: unknown,
  context: ApiRouteContext
): NextResponse {
  logger.logRequest({
    method: context.method,
    path: context.path,
    statusCode: 500,
    duration: context.getElapsed(),
    error: getErrorMessage(error),
  });

  return handleApiError(error, context.path);
}

// Check if mock mode enabled and return mock data if enabled
export async function tryMockMode<T>(
  getMockData: () => T,
  context: ApiRouteContext,
  debugMessage: string
): Promise<NextResponse<T> | null> {
  const mockMode = await isMockModeEnabled();
  
  if (!mockMode) {
    return null;
  }

  const response = NextResponse.json(getMockData());
  return logResponse(response, context, debugMessage);
}

// Check cache and return cache response if available
export function tryCache<T>(
  cacheKey: string,
  context: ApiRouteContext,
  debugMessage: string
): NextResponse<T> | null {
  const cached = cache.get<T>(cacheKey);
  
  if (!cached) {
    return null;
  }

  const response = NextResponse.json(cached);
  return logResponse(response, context, debugMessage);
}

// Create API route context
export function createApiContext(
  request: NextRequest,
  path?: string,
  method?: string
): ApiRouteContext {
  return {
    request,
    path: path ?? request.nextUrl.pathname,
    method: method ?? request.method,
    getElapsed: startTimer(),
  };
}
