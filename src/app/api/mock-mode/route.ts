import { NextRequest, NextResponse } from 'next/server';
import { setMockModeCookie, isMockModeEnabled } from '@/lib/mock-mode';
import { createApiContext, logResponse, logError } from '../utils';

export async function GET(request: NextRequest) {
  const context = createApiContext(request);

  try {
    const mockMode = await isMockModeEnabled();
    return logResponse(NextResponse.json({ mockMode }), context);
  } catch (error) {
    return logError(error, context);
  }
}

export async function POST(request: NextRequest) {
  const context = createApiContext(request);

  try {
    const body = await request.json();
    const enabled = Boolean(body.enabled);
    
    await setMockModeCookie(enabled);
    
    return logResponse(
      NextResponse.json({ success: true, mockMode: enabled }),
      context
    );
  } catch (error) {
    return logError(error, context);
  }
}