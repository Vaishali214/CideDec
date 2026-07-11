import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting CideDec combined dev environments (Frontend + Backend)...');

// 1. Start Backend Express Server
const backend = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// 2. Start Frontend Vite Server
const frontend = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Clean up child processes on termination
const cleanup = () => {
  console.log('\nShutting down CideDec processes...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
backend.on('exit', cleanup);
frontend.on('exit', cleanup);
