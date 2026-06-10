# Masters Billiards Lounge — Website & Booking System

A React + TypeScript (Vite) frontend with an Express + SQLite backend for the
Masters billiards lounge (Al Salam Mall, Salmiya, Kuwait).

## Project structure

```
masters-lounge/
├── src/            # React frontend (pages, components, styles)
├── public/         # Static assets (favicon, etc.)
├── server/         # Express + SQLite API
│   ├── src/
│   └── data/       # SQLite database file (created automatically, gitignored)
└── dist/           # Production build of the frontend (created by `npm run build`)
```

In production, the Express server serves the built frontend (`dist/`) **and**
the `/api/*` routes from a single Node process — one app, one URL.

## Local development

Two dev servers run side by side (Vite proxies `/api` to Express on port 4000):

```bash
# Terminal 1 — frontend (http://localhost:5173)
npm install
npm run dev

# Terminal 2 — backend API (http://localhost:4000)
cd server
npm install
npm run dev
```

## Building for production

From the `masters-lounge/` folder:

```bash
npm install
npm run build          # builds the frontend into dist/

cd server
npm install
npm run build           # compiles the API into server/dist/
```

Then start the combined app:

```bash
cd server
npm start                # serves dist/ + /api/* on $PORT (default 4000)
```

## Deploying to Hostinger (Node.js hosting)

Hostinger's hPanel **Node.js** feature (Business / Cloud plans) runs a Node
app from a folder you choose and assigns it a `PORT` automatically — the
server already reads `process.env.PORT`, so no changes are needed there.

1. **Push this repo to GitHub** (see below), then in hPanel go to
   **Advanced → Git** and connect/pull the repository into your hosting
   account (e.g. into a folder like `masters-lounge`).

2. **Create the Node.js app** in hPanel → **Advanced → Node.js**:
   - Application root: `masters-lounge/server`
   - Application startup file: `dist/index.js`
   - Node.js version: 20.x or later

3. **Build the app** — open the SSH/terminal access included with your plan
   (hPanel → Advanced → SSH Access) and run:

   ```bash
   cd masters-lounge
   npm install
   npm run build

   cd server
   npm install
   npm run build
   ```

   The Express server in `server/dist/index.js` will automatically detect
   and serve the frontend build at `masters-lounge/dist`.

4. In hPanel's Node.js app screen, click **Restart** to start the app, then
   point your domain to the application URL it gives you.

5. Whenever you push new changes: pull the latest code via Git, re-run the
   two `npm install && npm run build` steps above, then restart the Node app.

The SQLite database is created automatically at `server/data/masters.db` on
first run and persists between restarts/deploys (it's outside `dist/` and
`node_modules`, and is gitignored so it won't be overwritten by deploys).

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
