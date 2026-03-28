import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API route para OpenClaw Gateway.
 * El frontend llama a /api/openclaw y el servidor hace el request
 * al gateway real, evitando problemas de CORS.
 */

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || '';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.NEXT_PUBLIC_OPENCLAW_TOKEN || '';

export async function POST(request: NextRequest) {
  if (!GATEWAY_URL || !GATEWAY_TOKEN) {
    return NextResponse.json(
      { error: 'OpenClaw gateway not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const gatewayResponse = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: `Gateway error: ${errorText}` },
        { status: gatewayResponse.status }
      );
    }

    const data = await gatewayResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Proxy error: ${message}` },
      { status: 502 }
    );
  }
}
