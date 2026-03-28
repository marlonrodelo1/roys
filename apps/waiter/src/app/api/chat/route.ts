import { NextRequest, NextResponse } from 'next/server';

/**
 * Chat API route — proxy to OpenClaw bridge running on VPS.
 * The bridge receives HTTP POST and executes the openclaw CLI command.
 */

const BRIDGE_URL = process.env.OPENCLAW_BRIDGE_URL || '';
const BRIDGE_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN || '';

export async function POST(request: NextRequest) {
  if (!BRIDGE_URL || !BRIDGE_TOKEN) {
    return NextResponse.json(
      { error: 'OpenClaw bridge not configured', fallback: true },
      { status: 503 }
    );
  }

  try {
    const { message, agent } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await fetch(`${BRIDGE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRIDGE_TOKEN}`,
      },
      body: JSON.stringify({ message, agent: agent || 'waiter-1' }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: `Bridge error: ${errorText}`, fallback: true },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Proxy error: ${msg}`, fallback: true },
      { status: 502 }
    );
  }
}
