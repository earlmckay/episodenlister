const input = document.getElementById('serienname');
const button = document.getElementById('startButton');
const status = document.getElementById('status');
const vorschlaege = document.getElementById('vorschlaege');

let timeout;

input.addEventListener('input', () => {
  clearTimeout(timeout);
  const suchtext = input.value.trim();
  if (suchtext.length < 2) {
    vorschlaege.innerHTML = '';
    return;
  }

  timeout = setTimeout(async () => {
    const ergebnisse = await window.episodenAPI.searchSeries(suchtext);
    vorschlaege.innerHTML = '';
    ergebnisse.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      li.style.padding = '8px';
      li.style.cursor = 'pointer';
      li.style.background = '#f0f0f0';
      li.style.marginTop = '4px';
      li.style.borderRadius = '8px';
      li.addEventListener('click', () => {
        input.value = name;
        vorschlaege.innerHTML = '';
      });
      vorschlaege.appendChild(li);
    });
  }, 300);
});

button.addEventListener('click', async () => {
  const serienname = input.value.trim();
  status.textContent = 'Lade Episoden...';
  vorschlaege.innerHTML = '';

  if (!serienname) {
    status.textContent = 'Bitte gib einen Serientitel ein.';
    return;
  }

  try {
    const result = await window.episodenAPI.getEpisodes(serienname);
    status.textContent = result.message;
    status.style.color = result.success ? 'green' : 'red';
  } catch (err) {
    status.textContent = 'Fehler beim Abruf.';
    status.style.color = 'red';
  }
});