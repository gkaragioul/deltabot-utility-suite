#!/usr/bin/env node
import { launchProxy } from '../src/proxy-launcher.mjs';

const child = launchProxy();

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
