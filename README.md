# DeltaBot Utility Suite

DeltaBot Utility Suite is a hosted MCP service with 25 deterministic utility
tools. Each tool is paid per call through Base-USDC x402; the buyer's MCP
client needs its own x402-capable wallet to approve a paid call.

> [!WARNING]
> **The hosted service is offline.** Since at least 26 September 2026 its
> old address returns "Application not found", and it has been removed from
> this repository. The bridge now refuses to start unless you point it at a
> server yourself with `DELTABOT_SERVICE_URL`. The code is kept for reference.

This repository contains a credential-free local stdio bridge. It connects
supported MCP clients to a DeltaBot server you choose; it does not contain a
seller wallet, buyer key, Railway credential, or local copy of the paid tools.
It is not published on npm; `npx` installs it straight from this repository.

## Getting started

You need an MCP client and, for paid calls, an x402-capable wallet holding Base
USDC; listing the tools needs no wallet. Clients with Streamable HTTP support need
nothing else (see below). Stdio-only clients need Node.js 18 or later and the
`npx` command shown in [Connect from a stdio-only client](#connect-from-a-stdio-only-client).

To run the bridge from a clone instead:

```bash
git clone https://github.com/gkaragioul/deltabot-utility-suite.git
cd deltabot-utility-suite
npm ci
npm test
```

Then configure the client to run `node` with the absolute path of
`bin/deltabot-utility-suite.mjs` as its only argument, and set
`DELTABOT_SERVICE_URL` (see below). Once connected, the client
lists the 25 tools; calling one returns an x402 payment request that your wallet
must approve before the tool runs.

## Choose a server: `DELTABOT_SERVICE_URL`

There is no default server. The bridge reads the MCP endpoint from the
`DELTABOT_SERVICE_URL` environment variable and, when it is not set, exits with:

```text
the hosted DeltaBot service is offline; set DELTABOT_SERVICE_URL to a server you trust
```

Only use a server you trust: it decides which tools exist and what each paid
call asks your wallet to approve. Clients with Streamable HTTP support can
connect to that server's MCP endpoint directly instead of using the bridge.

## Connect from a stdio-only client

Configure the client to run this command:

```json
{
  "command": "npx",
  "args": ["-y", "github:gkaragioul/deltabot-utility-suite"],
  "env": { "DELTABOT_SERVICE_URL": "https://your-trusted-server.example/mcp" }
}
```

The command downloads the bridge from this repository and starts it as a local
stdio bridge to the server in `DELTABOT_SERVICE_URL`. Tool
discovery is free; a paid tool call receives its Base-USDC x402 payment request
from that server and can only proceed after the buyer pays with their own
compatible wallet.

## Registry metadata

`server.json` is prepared for the official MCP Registry. It names the npm
package `@gkaragioul/deltabot-utility-suite`, which has not been published, and
declares `DELTABOT_SERVICE_URL` as a required variable. It lists no hosted remote,
because the original service is offline. The project is not listed in the Registry.

## Verification

While the service was online, the bridge was verified against the live hosted
endpoint with MCP `initialize` and `tools/list`; no on-chain payment was made.
On 26 September 2026 the `npx` install from GitHub worked, but the hosted
endpoint returned 404 "Application not found".

## Disclaimer

This bridge is provided as is, without warranty of any kind, under the
[MIT License](LICENSE), and the hosted service comes with no guarantee of
availability or correct results. Use both at your own risk. Paid calls spend real
Base USDC from your own wallet and on-chain payments generally cannot be reversed,
so review each payment request before approving it. You are responsible for how
you use the tools and their output.
