/**
 * Cliente OpenClaw Gateway
 *
 * Se conecta al gateway via HTTP API (compatible OpenAI).
 * Endpoint: POST /v1/chat/completions
 * Auth: Bearer token
 * Routing: model = "openclaw/<agentId>" para dirigir al agente correcto
 */

export interface OpenClawMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenClawResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Mapea número de mesa al agentId de OpenClaw.
 * mesa 1 = waiter-1, mesa 2 = waiter-2, mesa 3 = waiter-3
 * Mesas sin agente asignado usan "default"
 */
function getAgentId(tableNumber: number): string {
  if (tableNumber >= 1 && tableNumber <= 3) {
    return `waiter-${tableNumber}`;
  }
  return 'default';
}

/**
 * Envía un mensaje al gateway OpenClaw a través del proxy /api/openclaw
 * para evitar problemas de CORS.
 */
export async function sendToOpenClaw(
  messages: OpenClawMessage[],
  tableNumber: number,
  sessionKey?: string
): Promise<string> {
  const agentId = getAgentId(tableNumber);

  const response = await fetch('/api/openclaw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `openclaw/${agentId}`,
      messages,
      stream: false,
      ...(sessionKey ? { user: sessionKey } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenClaw error ${response.status}: ${errorText}`);
  }

  const data: OpenClawResponse = await response.json();

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenClaw returned empty response');
  }

  return content;
}

/**
 * Verifica si el gateway OpenClaw está disponible via el proxy.
 */
export async function checkOpenClawHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/openclaw/health', {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
