# episodenlister
A small electron application that uses the TMDM API to generate a text file with all episode titles of a series.


## 📋 What the app does

- You enter the name of a TV series (e.g. `Stromberg`)
- The app fetches all seasons and episodes via the TMDB API
- It creates a `.txt` file containing all episode titles

---

## 🧱 Filename structure

Each line in the exported file follows this pattern:

```
Series Name - S01E01 - Episode Title
```

Example:

```
Stromberg - S01E01 - Mal was anderes
Stromberg - S01E02 - Feueralarm
```

All episode titles are pulled in **German**, unless configured otherwise.

---

## 🛠️ Setup & Usage

### 1. Requirements

- [Node.js + npm](https://nodejs.org/)
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)

---

### 2. Clone and install

```bash
git clone https://github.com/earlmckay/episodenlister.git
cd episodenlister
npm install
```

---

### 3. Set your TMDB API key

Open `main.js` and replace this line:

```js
const API_KEY = 'HIER_DEIN_API_KEY';
```

with your actual TMDB API key.

---

### 4. (Optional) Change language

By default, episode titles are fetched in German. To change the language, adjust this line in `main.js`:

```js
const LANGUAGE = 'de';
```

Use `en`, `fr`, `es`, etc. for other languages.

---

## ▶️ Run the app in development

```bash
npm start
```

---

## 📦 Build for macOS, Windows, or Linux

### Install `electron-builder`:

```bash
npm install --save-dev electron-builder
```

### Then run:

- **macOS:**

```bash
npm run dist
```

- **Windows:**

```bash
npx electron-builder --win
```

> Note: On macOS, building for Windows requires NSIS and may need Wine or CI.

- **Linux:**

```bash
npx electron-builder --linux
```

---

## 📄 License

MIT — free to use, modify and distribute.
