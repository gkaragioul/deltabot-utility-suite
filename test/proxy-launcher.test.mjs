import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REMOTE_MCP_URL,
  launchProxy,
  proxyArguments,
} from '../src/proxy-launcher.mjs';

test('pins the public hosted MCP endpoint and HTTP transport', () => {
  assert.equal(REMOTE_MCP_URL, 'https://deltabot-x402-seller-production.up.railway.app/mcp');
  assert.deepEqual(proxyArguments('/tmp/mcp-remote-proxy.js'), [
    '/tmp/mcp-remote-proxy.js',
    REMOTE_MCP_URL,
    '--transport',
    'http-only',
  ]);
});

test('launches mcp-remote with inherited MCP stdio', () => {
  const calls = [];
  const fakeChild = { on() {} };

  const result = launchProxy({
    proxyEntrypoint: '/tmp/mcp-remote-proxy.js',
    spawnProcess(...args) {
      calls.push(args);
      return fakeChild;
    },
  });

  assert.equal(result, fakeChild);
  assert.deepEqual(calls, [[
    process.execPath,
    proxyArguments('/tmp/mcp-remote-proxy.js'),
    { stdio: 'inherit' },
  ]]);
});
