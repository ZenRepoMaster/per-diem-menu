/**
 * API Error Handler
 * 
 * Provides utilities for handling and formatting API errors.
 * Maps Square API errors to clean, user-friendly responses.
 */

import { NextResponse } from 'next/server';
import { ApiError } from '@/types';
import { logger } from './logger';

/**
 * Error codes for API responses
 */
export const ErrorCodes = {
  // Client errors
  BAD_REQUEST: 'BAD_REQUEST',
  INVALID_LOCATION: 'INVALID_LOCATION',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SQUARE_API_ERROR: 'SQUARE_API_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  statusCode: number,
  details?: string
): NextResponse<ApiError> {
  const error: ApiError = {
    error: {
      code,
      message,
      details,
    },
  };
  
  return NextResponse.json(error, { status: statusCode });
}

/**
 * Handle errors and return appropriate API response
 */
export function handleApiError(error: unknown, path: string): NextResponse<ApiError> {
  // Log the error
  logger.error(`API Error on ${path}`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  
  // Handle specific error types
  if (error instanceof Error) {
    // Configuration errors (missing env vars, etc.)
    if (error.message.includes('environment variable')) {
      return createErrorResponse(
        ErrorCodes.CONFIGURATION_ERROR,
        'Server configuration error',
        500,
        'The server is not properly configured. Please contact support.'
      );
    }
    
    // Square API errors
    if (error.message.includes('Square') || error.message.includes('API')) {
      return createErrorResponse(
        ErrorCodes.SQUARE_API_ERROR,
        'Failed to fetch data from Square',
        502,
        error.message
      );
    }
  }
  
  // Generic internal error
  return createErrorResponse(
    ErrorCodes.INTERNAL_ERROR,
    'An unexpected error occurred',
    500,
    error instanceof Error ? error.message : 'Unknown error'
  );
}

/**
 * Validate required query parameters
 */
export function validateRequiredParams(
  params: URLSearchParams,
  required: string[]
): { valid: true } | { valid: false; response: NextResponse<ApiError> } {
  for (const param of required) {
    const value = params.get(param);
    
    if (!value || value.trim() === '') {
      return {
        valid: false,
        response: createErrorResponse(
          ErrorCodes.MISSING_PARAMETER,
          `Missing required parameter: ${param}`,
          400,
          `The '${param}' query parameter is required.`
        ),
      };
    }
  }
  
  return { valid: true };
}
