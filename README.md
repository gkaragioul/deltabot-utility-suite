# DeltaBot Utility Suite

DeltaBot Utility Suite is a hosted MCP service with 25 deterministic utility
tools. Each tool is paid per call through Base-USDC x402; the buyer's MCP
client needs its own x402-capable wallet to approve a paid call.

The npm package is a credential-free local stdio bridge. It connects supported
MCP clients to the hosted DeltaBot service; it does not contain a seller wallet,
buyer key, Railway credential, or local copy of the paid tools.

## Getting started

You need an MCP client and, for paid calls, an x402-capable wallet holding Base
USDC; listing the tools needs no wallet. Clients with Streamable HTTP support need
nothing else (see below). The stdio bridge needs Node.js 18 or later and can be
run from a clone of this repository:

```bash
git clone https://github.com/gkaragioul/deltabot-utility-suite.git
cd deltabot-utility-suite
npm ci
npm test
```

Then configure the client to run `node` with the absolute path of
`bin/deltabot-utility-suite.mjs` as its only argument. Once connected, the client
lists the 25 tools; calling one returns an x402 payment request that your wallet
must approve before the tool runs.

## Connect directly (Streamable HTTP)

MCP clients that support remote Streamable HTTP can connect directly to:

```text
https://deltabot-x402-seller-production.up.railway.app/mcp
```

## Connect from a stdio-only client

Configure the client to run this command:

```json
{
  "command": "npx",
  "args": ["-y", "@gkaragioul/deltabot-utility-suite"]
}
```

The command starts a local stdio bridge to the same hosted service. Tool
discovery is free; a paid tool call receives its Base-USDC x402 payment request
from the hosted seller and can only proceed after the buyer pays with their own
compatible wallet.

## Registry metadata

`server.json` declares the npm stdio package and the direct hosted remote for
the official MCP Registry. It does not claim a Registry listing until the
Registry accepts the published metadata.

## Verification

Verified against the live hosted endpoint with MCP `initialize` and
`tools/list`; no on-chain payment was made.

## Disclaimer

This bridge is provided as is, without warranty of any kind, under the
[MIT License](LICENSE), and the hosted service comes with no guarantee of
availability or correct results. Use both at your own risk. Paid calls spend real
Base USDC from your own wallet and on-chain payments generally cannot be reversed,
so review each payment request before approving it. You are responsible for how
you use the tools and their output.
