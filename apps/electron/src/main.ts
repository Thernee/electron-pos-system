import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let backendProcess: ReturnType<typeof spawn>;

function startBackend() {
  const backendPath = path.join(__dirname, '../..', 'backend', 'dist', 'main.js');
  backendProcess = spawn('node', [backendPath], { stdio: 'inherit' });
}

function createWindow() {
  const win = new BrowserWindow({ width: 1024, height: 768 });
  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  } else {
    win.loadURL('http://localhost:3001');
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('will-quit', () => {
  if (backendProcess) backendProcess.kill();
});
