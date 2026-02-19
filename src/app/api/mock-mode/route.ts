/**
 * GET /api/mock-mode
 * Get current mock mode status from cookie
 * 
 * POST /api/mock-mode
 * Set mock mode cookie to enable/disable mock data.
 * 
 * Body:
 * {
 *   enabled: boolean
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { setMockModeCookie, isMockModeEnabled } from '@/lib/mock-mode';

export async function GET() {
  try {
    const mockMode = await isMockModeEnabled();
    return NextResponse.json({ mockMode });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get mock mode' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const enabled = Boolean(body.enabled);
    
    await setMockModeCookie(enabled);
    
    return NextResponse.json({ success: true, mockMode: enabled });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set mock mode' },
      { status: 500 }
    );
  }
}

