import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopApi', {
  setAlwaysOnTop: async (isOnTop: boolean): Promise<boolean> =>
    ipcRenderer.invoke('window:set-always-on-top', isOnTop),
  getAlwaysOnTop: async (): Promise<boolean> =>
    ipcRenderer.invoke('window:get-always-on-top')
});

declare global {
  interface Window {
    desktopApi: {
      setAlwaysOnTop: (isOnTop: boolean) => Promise<boolean>;
      getAlwaysOnTop: () => Promise<boolean>;
    };
  }
}
