#!/usr/bin/env node
import { launchProxy } from '../src/proxy-launcher.mjs';

let child;
try {
  child = launchProxy();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
