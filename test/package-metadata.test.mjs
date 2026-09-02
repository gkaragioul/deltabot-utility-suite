import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
const serverJson = JSON.parse(await readFile(new URL('../server.json', import.meta.url)));

test('declares the same verified MCP identity in npm and Registry metadata', () => {
  assert.equal(packageJson.mcpName, 'io.github.gkaragioul/deltabot-utility-suite');
  assert.equal(serverJson.name, packageJson.mcpName);
  assert.deepEqual(serverJson.packages, [{
    registryType: 'npm',
    identifier: '@gkaragioul/deltabot-utility-suite',
    version: '1.0.0',
    transport: { type: 'stdio' },
  }]);
  assert.deepEqual(serverJson.remotes, [{
    type: 'streamable-http',
    url: 'https://deltabot-x402-seller-production.up.railway.app/mcp',
  }]);
});
