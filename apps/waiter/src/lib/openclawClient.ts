/**
 * Cliente OpenClaw — se conecta al bridge HTTP en el VPS.
 * El bridge ejecuta el CLI de OpenClaw y devuelve la respuesta.
 *
 * Flujo: Frontend → /api/chat → Bridge (VPS:3333) → openclaw CLI → agente IA
 */

/**
 * Mapea número de mesa al agentId de OpenClaw.
 * mesa 1 = waiter-1, mesa 2 = waiter-2, mesa 3 = waiter-3
 */
function getAgentId(tableNumber: number): string {
  if (tableNumber >= 1 && tableNumber <= 3) {
    return `waiter-${tableNumber}`;
  }
  return 'waiter-1';
}

/**
 * Envía un mensaje al agente OpenClaw via el bridge HTTP.
 */
export async function sendToOpenClaw(
  message: string,
  tableNumber: number
): Promise<string> {
  const agent = getAgentId(tableNumber);

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agent }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Unknown' }));
    if (data.fallback) {
      throw new Error('FALLBACK');
    }
    throw new Error(`OpenClaw error ${response.status}: ${data.error}`);
  }

  const data = await response.json();
  return data.text;
}

/**
 * Verifica si el bridge OpenClaw está disponible.
 */
export async function checkOpenClawHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', agent: 'waiter-1' }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
