import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  OFFLINE_MESSAGE,
  SERVICE_URL_ENV,
  launchProxy,
  proxyArguments,
  resolveServiceUrl,
} from '../src/proxy-launcher.mjs';

const SERVICE_URL = 'https://mcp.example.test/mcp';

test('passes the configured service URL to mcp-remote over HTTP transport', () => {
  assert.equal(SERVICE_URL_ENV, 'DELTABOT_SERVICE_URL');
  assert.deepEqual(proxyArguments('/tmp/mcp-remote-proxy.js', SERVICE_URL), [
    '/tmp/mcp-remote-proxy.js',
    SERVICE_URL,
    '--transport',
    'http-only',
  ]);
});

test('refuses to start without DELTABOT_SERVICE_URL', () => {
  for (const env of [{}, { DELTABOT_SERVICE_URL: '' }, { DELTABOT_SERVICE_URL: '   ' }]) {
    assert.throws(() => resolveServiceUrl(env), { message: OFFLINE_MESSAGE });
  }

  const calls = [];
  assert.throws(
    () => launchProxy({ env: {}, proxyEntrypoint: '/tmp/p.js', spawnProcess: (...args) => calls.push(args) }),
    { message: OFFLINE_MESSAGE },
  );
  assert.equal(calls.length, 0);
});

test('rejects service URLs that are not http(s)', () => {
  assert.throws(() => resolveServiceUrl({ DELTABOT_SERVICE_URL: 'not a url' }), /not a valid URL/);
  assert.throws(() => resolveServiceUrl({ DELTABOT_SERVICE_URL: 'file:///etc/passwd' }), /must be an http\(s\) URL/);
  assert.equal(resolveServiceUrl({ DELTABOT_SERVICE_URL: ` ${SERVICE_URL} ` }), SERVICE_URL);
});

test('launches mcp-remote with inherited MCP stdio', () => {
  const calls = [];
  const fakeChild = { on() {} };

  const result = launchProxy({
    env: { DELTABOT_SERVICE_URL: SERVICE_URL },
    proxyEntrypoint: '/tmp/mcp-remote-proxy.js',
    spawnProcess(...args) {
      calls.push(args);
      return fakeChild;
    },
  });

  assert.equal(result, fakeChild);
  assert.deepEqual(calls, [[
    process.execPath,
    proxyArguments('/tmp/mcp-remote-proxy.js', SERVICE_URL),
    { stdio: 'inherit' },
  ]]);
});

test('the bin exits with the offline message when no service URL is set', () => {
  const bin = fileURLToPath(new URL('../bin/deltabot-utility-suite.mjs', import.meta.url));
  const env = { ...process.env };
  delete env.DELTABOT_SERVICE_URL;
  const result = spawnSync(process.execPath, [bin], { env, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /the hosted DeltaBot service is offline; set DELTABOT_SERVICE_URL to a server you trust/);
});
