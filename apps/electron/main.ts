import { app, BrowserWindow } from 'electron';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'backend/dist/backend/src/app.module';
import path from 'path';

async function bootstrap() {
  const nest = await NestFactory.create(AppModule);
  await nest.listen(3000);
}
function createWindow() {
  const win = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(async () => {
  await bootstrap();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
