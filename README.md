# DeltaBot Utility Suite

DeltaBot Utility Suite is a hosted MCP service with 25 deterministic utility
tools. Each tool is paid per call through Base-USDC x402; the buyer's MCP
client needs its own x402-capable wallet to approve a paid call.

The npm package is a credential-free local stdio bridge. It connects supported
MCP clients to the hosted DeltaBot service; it does not contain a seller wallet,
buyer key, Railway credential, or local copy of the paid tools.

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
