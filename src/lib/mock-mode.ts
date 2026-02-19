/**
 * Mock Mode Utilities
 * 
 * Functions to check and manage mock mode on the server side.
 * Mock mode is stored in cookies to be accessible from API routes.
 */

import { cookies } from 'next/headers';

const COOKIE_NAME = 'per-diem-mock-mode';

/**
 * Check if mock mode is enabled from cookies
 * Used in API routes to determine if mock data should be returned
 */
export async function isMockModeEnabled(): Promise<boolean> {
  const cookieStore = await cookies();
  const mockModeCookie = cookieStore.get(COOKIE_NAME);
  return mockModeCookie?.value === 'true';
}

/**
 * Set mock mode cookie
 * Used when toggling mock mode from the client
 */
export async function setMockModeCookie(enabled: boolean): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, enabled ? 'true' : 'false', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
}

