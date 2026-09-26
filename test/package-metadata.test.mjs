import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
const serverJson = JSON.parse(await readFile(new URL('../server.json', import.meta.url)));

test('declares the same verified MCP identity in npm and Registry metadata', () => {
  assert.equal(packageJson.mcpName, 'io.github.gkaragioul/deltabot-utility-suite');
  assert.equal(serverJson.name, packageJson.mcpName);
  assert.ok(serverJson.description.length <= 100, 'Registry descriptions are limited to 100 characters');
  assert.deepEqual(serverJson.packages, [{
    registryType: 'npm',
    identifier: '@gkaragioul/deltabot-utility-suite',
    version: '1.0.0',
    transport: { type: 'stdio' },
    environmentVariables: [{
      name: 'DELTABOT_SERVICE_URL',
      description: 'MCP endpoint of a DeltaBot server you trust; the bridge refuses to start without it.',
      isRequired: true,
      format: 'string',
    }],
  }]);
});

test('points at no hosted endpoint, since the original service is offline', () => {
  assert.equal(serverJson.remotes, undefined);
  assert.equal(serverJson.websiteUrl, undefined);
  assert.doesNotMatch(JSON.stringify(serverJson), /railway\.app/);
});
