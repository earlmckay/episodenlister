const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('episodenAPI', {
  getEpisodes: (serientitel) => ipcRenderer.invoke('get-episodes', serientitel),
  searchSeries: (suchbegriff) => ipcRenderer.invoke('search-series', suchbegriff)
});