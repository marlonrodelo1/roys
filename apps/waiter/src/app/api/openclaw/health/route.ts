import { NextResponse } from 'next/server';

/**
 * Health check para verificar si el gateway OpenClaw está disponible.
 * Intenta hacer GET a /v1/models del gateway.
 */

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || process.env.NEXT_PUBLIC_OPENCLAW_URL || '';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.NEXT_PUBLIC_OPENCLAW_TOKEN || '';

export async function GET() {
  if (!GATEWAY_URL || !GATEWAY_TOKEN) {
    return NextResponse.json({ status: 'not_configured' }, { status: 503 });
  }

  try {
    const response = await fetch(`${GATEWAY_URL}/v1/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      return NextResponse.json({ status: 'connected' });
    }

    return NextResponse.json({ status: 'unreachable' }, { status: 502 });
  } catch {
    return NextResponse.json({ status: 'unreachable' }, { status: 502 });
  }
}
