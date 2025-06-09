import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3001');
  } else {
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

app.whenReady().then(createWindow);



// import { app, BrowserWindow } from 'electron';
// import { NestFactory } from '@nestjs/core';

// import { AppModule } from '../backend/dist/app.module.js';

// async function bootstrap() {
//   const nest = await NestFactory.create(AppModule);
//   await nest.listen(3000);
// }

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800, height: 600,
//     webPreferences: { nodeIntegration: true, contextIsolation: false }
//   });
//   win.loadURL('http://localhost:3000');
// }

// app.whenReady().then(async () => {
//   await bootstrap();
//   createWindow();
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });
// app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
