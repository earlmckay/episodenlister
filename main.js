const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const API_KEY = 'YOUR-API'; // <-- Deinen TMDB-Key hier eintragen
const LANGUAGE = 'de';

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    fullscreenable: false,
    title: 'Episodenlister',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-episodes', async (event, serienname) => {
  try {
    const suchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(serienname)}`;
    const suchRes = await fetch(suchUrl);
    const suchJson = await suchRes.json();

    if (!suchJson.results.length) {
      return { success: false, message: 'Serie nicht gefunden.' };
    }

    const serie = suchJson.results[0];
    const tv_id = serie.id;
    const offiziellerName = serie.name;

    const serienUrl = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${API_KEY}&language=${LANGUAGE}`;
    const serienRes = await fetch(serienUrl);
    const serienJson = await serienRes.json();
    const staffelAnzahl = serienJson.number_of_seasons;

    let ausgabe = [];

    for (let staffel = 1; staffel <= staffelAnzahl; staffel++) {
      const staffelUrl = `https://api.themoviedb.org/3/tv/${tv_id}/season/${staffel}?api_key=${API_KEY}&language=${LANGUAGE}`;
      const staffelRes = await fetch(staffelUrl);
      const staffelJson = await staffelRes.json();

      for (const folge of staffelJson.episodes) {
        const line = `${offiziellerName} - S${String(staffel).padStart(2, '0')}E${String(folge.episode_number).padStart(2, '0')} - ${folge.name}`;
        ausgabe.push(line);
      }
    }

    const { filePath } = await dialog.showSaveDialog({
      title: 'Speichern unter...',
      defaultPath: `${offiziellerName.replace(/\s+/g, '_')}_Episoden.txt`,
      filters: [{ name: 'Textdateien', extensions: ['txt'] }],
    });

    if (filePath) {
      fs.writeFileSync(filePath, ausgabe.join('\n'), 'utf-8');
      return { success: true, message: `Datei gespeichert` };
    } else {
      return { success: false, message: 'Speichern abgebrochen.' };
    }
  } catch (err) {
    return { success: false, message: `Fehler: ${err.message}` };
  }
});

ipcMain.handle('search-series', async (event, suchbegriff) => {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(suchbegriff)}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json || !json.results) return [];

  return json.results.map(serie => serie.name);
});