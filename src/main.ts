import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron';
import path from 'node:path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 760,
    minWidth: 820,
    minHeight: 560,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'World Time Board'
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

function createTray(): void {
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAqElEQVR4AWMgGAXUAZjEgNFDQFhQfPjwQeMfM2YMpA6kgv///5+BjY0NQqWfPn2C9J8/f4YUQfLly4f0f/z4AekvXLgAEhQ3b95kYGRkRJqB0o8fP2BgYGAAqfL9+/cM8vPnz5B2QGkGBgYobdu2DWkGiiBz5swZSCNQ/NOnT9A4M2fORPqB0p8/fxjY2NgQKqA0A8V3794xSE9PR6oA0jA0NIT0A6UYGBhA+oHSd+7cQdqA0j8AAK6sI4hG2sJIAAAAAElFTkSuQmCC'
  );
  tray = new Tray(icon);

  const refreshTrayMenu = () => {
    const visible = !!mainWindow?.isVisible();
    const contextMenu = Menu.buildFromTemplate([
      {
        label: visible ? '隐藏主窗口' : '显示主窗口',
        click: () => {
          if (!mainWindow) return;
          if (mainWindow.isVisible()) mainWindow.hide();
          else {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: '退出',
        click: () => {
          app.isQuiting = true;
          app.quit();
        }
      }
    ]);
    tray?.setContextMenu(contextMenu);
    tray?.setToolTip('World Time Board');
  };

  tray.on('double-click', () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.focus();
    refreshTrayMenu();
  });

  mainWindow?.on('show', refreshTrayMenu);
  mainWindow?.on('hide', refreshTrayMenu);
  refreshTrayMenu();
}

ipcMain.handle('window:set-always-on-top', (_event, isOnTop: boolean) => {
  if (!mainWindow) return false;
  mainWindow.setAlwaysOnTop(isOnTop);
  return mainWindow.isAlwaysOnTop();
});

ipcMain.handle('window:get-always-on-top', () => {
  if (!mainWindow) return false;
  return mainWindow.isAlwaysOnTop();
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow?.show();
  });
});

app.on('before-quit', () => {
  app.isQuiting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

declare global {
  namespace Electron {
    interface App {
      isQuiting?: boolean;
    }
  }
}
