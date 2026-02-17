/**
 * Square API Client Configuration
 * 
 * Initializes and exports a configured Square SDK client.
 * Uses environment variables for secure credential management.
 */

import { SquareClient, SquareEnvironment } from 'square';

/**
 * Validate required environment variables
 */
function validateEnvVariables(): void {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    throw new Error(
      'SQUARE_ACCESS_TOKEN environment variable is required. ' +
      'Please add it to your .env.local file.'
    );
  }
}

/**
 * Get the Square environment based on configuration
 */
function getSquareEnvironment(): SquareEnvironment {
  const env = process.env.SQUARE_ENVIRONMENT?.toLowerCase();
  
  if (env === 'production') {
    return SquareEnvironment.Production;
  }
  
  // Default to sandbox for safety
  return SquareEnvironment.Sandbox;
}

/**
 * Create and configure the Square client
 * 
 * Note: This is lazily initialized to avoid errors during build time
 * when environment variables might not be available.
 */
let squareClient: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!squareClient) {
    validateEnvVariables();
    
    squareClient = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: getSquareEnvironment(),
    });
  }
  
  return squareClient;
}

/**
 * Get the Catalog API instance
 */
export function getCatalogApi() {
  return getSquareClient().catalog;
}

/**
 * Get the Locations API instance
 */
export function getLocationsApi() {
  return getSquareClient().locations;
}

/**
 * Check if we're using the sandbox environment
 */
export function isSandbox(): boolean {
  return getSquareEnvironment() === SquareEnvironment.Sandbox;
}

