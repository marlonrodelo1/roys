/**
 * OpenClaw Bridge — Mini HTTP server que ejecuta el CLI de OpenClaw.
 *
 * Recibe POST /chat con { message, agent }
 * Ejecuta: openclaw agent --agent <agent> --message "<message>" --json
 * Devuelve: { text, agent }
 *
 * Deploy en el VPS de OpenClaw (31.97.37.198)
 * Puerto: 3333
 */

const http = require('http');
const { execSync } = require('child_process');

const PORT = 3333;
const AUTH_TOKEN = 'pKK9r8ONghBDiiTuJrCh6ZWGyHXDBvS1';

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Auth check
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { message, agent } = JSON.parse(body);

      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Message is required' }));
        return;
      }

      const agentId = agent || 'waiter-1';
      // Escape the message for shell
      const safeMessage = message.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');

      console.log(`[${new Date().toISOString()}] ${agentId}: ${message.substring(0, 50)}...`);

      const result = execSync(
        `docker exec openclaw-n0yg-openclaw-1 openclaw agent --agent ${agentId} --message "${safeMessage}" --json`,
        { timeout: 30000, encoding: 'utf-8' }
      );

      const parsed = JSON.parse(result);
      const text = parsed.result?.payloads?.[0]?.text || parsed.result?.text || 'No response';

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ text, agent: agentId }));
    } catch (err) {
      console.error('Error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenClaw Bridge running on http://0.0.0.0:${PORT}`);
});
