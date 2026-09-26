import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

export const SERVICE_URL_ENV = 'DELTABOT_SERVICE_URL';
export const OFFLINE_MESSAGE =
  'the hosted DeltaBot service is offline; set DELTABOT_SERVICE_URL to a server you trust';

const require = createRequire(import.meta.url);

export function resolveServiceUrl(env = process.env) {
  const value = (env[SERVICE_URL_ENV] ?? '').trim();
  if (!value) {
    throw new Error(OFFLINE_MESSAGE);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${SERVICE_URL_ENV} is not a valid URL: ${value}`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${SERVICE_URL_ENV} must be an http(s) URL: ${value}`);
  }
  return url.href;
}

export function proxyArguments(proxyEntrypoint, serviceUrl) {
  return [proxyEntrypoint, serviceUrl, '--transport', 'http-only'];
}

export function launchProxy({
  env = process.env,
  spawnProcess = spawn,
  proxyEntrypoint,
} = {}) {
  const serviceUrl = resolveServiceUrl(env);
  const entrypoint = proxyEntrypoint ?? require.resolve('mcp-remote/dist/proxy.js');
  return spawnProcess(process.execPath, proxyArguments(entrypoint, serviceUrl), { stdio: 'inherit' });
}
