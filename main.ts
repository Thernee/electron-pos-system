// const { app, BrowserWindow } = require("electron");
// const path = require("path");

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './backend/src/app.module';


async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  await nestApp.listen(3000)
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:3000');
  // load the react app. adjust path after setup
  // win.loadFile(path.join(__dirname, 'frontend/build/index.html'));
}

app.whenReady().then(async () => {
  await bootstrap();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});