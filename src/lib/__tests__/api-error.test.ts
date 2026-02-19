/**
 * Unit tests for API error handling utilities
 */

import { handleApiError, validateRequiredParams, createErrorResponse, ErrorCodes } from '../api-error'
import { NextResponse } from 'next/server'

// Mock logger
jest.mock('../logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('handleApiError', () => {
  it('should handle Error objects', () => {
    const error = new Error('Test error')
    const response = handleApiError(error, '/api/test')

    // Check that it's a Response-like object with status property
    expect(response).toBeInstanceOf(Response)
    expect(response).toHaveProperty('status')
  })

  it('should handle unknown error types', () => {
    const error = 'String error'
    const response = handleApiError(error, '/api/test')

    // Check that it's a Response-like object with status property
    expect(response).toBeInstanceOf(Response)
    expect(response).toHaveProperty('status')
  })

  it('should return 500 status code for generic errors', async () => {
    const error = new Error('Test error')
    const response = handleApiError(error, '/api/test')
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data.error).toHaveProperty('code', ErrorCodes.INTERNAL_ERROR)
    expect(data.error).toHaveProperty('message')
  })

  it('should handle Square API errors', async () => {
    const error = new Error('Square API error')
    const response = handleApiError(error, '/api/test')
    const data = await response.json()

    expect(response.status).toBe(502)
    expect(data.error.code).toBe(ErrorCodes.SQUARE_API_ERROR)
  })

  it('should handle configuration errors', async () => {
    const error = new Error('environment variable is required')
    const response = handleApiError(error, '/api/test')
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error.code).toBe(ErrorCodes.CONFIGURATION_ERROR)
  })
})

describe('validateRequiredParams', () => {
  it('should return valid when all params are present', () => {
    const params = new URLSearchParams('location_id=LOC1&other=value')
    const result = validateRequiredParams(params, ['location_id'])

    expect(result.valid).toBe(true)
  })

  it('should return invalid when param is missing', () => {
    const params = new URLSearchParams('other=value')
    const result = validateRequiredParams(params, ['location_id'])

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.response.status).toBe(400)
    }
  })

  it('should return invalid when param is empty', () => {
    const params = new URLSearchParams('location_id=')
    const result = validateRequiredParams(params, ['location_id'])

    expect(result.valid).toBe(false)
  })
})

describe('createErrorResponse', () => {
  it('should create error response with correct structure', async () => {
    const response = createErrorResponse(
      ErrorCodes.BAD_REQUEST,
      'Invalid request',
      400,
      'Details here'
    )
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toEqual({
      code: ErrorCodes.BAD_REQUEST,
      message: 'Invalid request',
      details: 'Details here',
    })
  })
})

