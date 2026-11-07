#!/usr/bin/env node
// One-command load test: builds (if needed), starts `vite preview`, runs the 100-user simulation, shuts down.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
if (!existsSync('dist/index.html')) {
  console.log('📦 No build found — running "npm run build"…');
  const b = spawnSync(npm, ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (b.status !== 0) process.exit(b.status ?? 1);
}

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch {} };
process.on('exit', stop);

const base = process.env.BASE_URL || 'http://localhost:4173';
for (let i = 0; i < 50; i++) {
  try { const r = await fetch(base); if (r.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 200));
}
const sim = spawn(process.execPath, ['loadtest/simulate-users.mjs'], { stdio: 'inherit', env: process.env });
sim.on('exit', (code) => { stop(); process.exit(code ?? 1); });
