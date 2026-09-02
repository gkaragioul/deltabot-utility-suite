import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

export const REMOTE_MCP_URL = 'https://deltabot-x402-seller-production.up.railway.app/mcp';

const require = createRequire(import.meta.url);

export function proxyArguments(proxyEntrypoint) {
  return [proxyEntrypoint, REMOTE_MCP_URL, '--transport', 'http-only'];
}

export function launchProxy({
  spawnProcess = spawn,
  proxyEntrypoint = require.resolve('mcp-remote/dist/proxy.js'),
} = {}) {
  return spawnProcess(process.execPath, proxyArguments(proxyEntrypoint), { stdio: 'inherit' });
}
