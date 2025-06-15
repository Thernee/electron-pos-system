import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { existsSync } from 'fs';

let backendProcess: ChildProcess | null = null;

function startBackend() {
  if (backendProcess) return;
  const backendRoot = path.join(process.resourcesPath, 'backend');
  const entry = path.join(backendRoot, 'index.js');

  if (!existsSync(entry)) {
    console.error(`Backend entry not found: ${entry}`);
    return;
  }

  backendProcess = spawn(process.execPath, [entry], {
    cwd: backendRoot,
    stdio: 'inherit',
    windowsHide: true,
    env: {
      ...process.env,
      APP_USER_DATA: app.getPath('userData'),
    },
  });

  backendProcess.on('error', err => {
    console.error('Failed to start backend:', err);
    backendProcess = null;
  });
  backendProcess.on('exit', code => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
  });
}

// single‑instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (BrowserWindow.getAllWindows().length) {
      BrowserWindow.getAllWindows()[0].focus();
    }
  });

  app.whenReady().then(() => {
    startBackend();
    const win = new BrowserWindow({ width: 1024, height: 768 });
    win.loadFile(path.join(process.resourcesPath, 'frontend', 'index.html'));
  });

  // Clean up
  app.on('before-quit', () => {
    if (backendProcess) backendProcess.kill();
  });
}
