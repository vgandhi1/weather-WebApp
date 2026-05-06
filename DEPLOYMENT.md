# Deployment — recommendations and next steps

This document summarizes what to do next to ship the weather app to **GitHub Pages**, and optional improvements. It also clarifies **`dist` vs `weather`** for this repo.

---

## Build output: `weather` (not `dist`)

Vite is configured to write production files to the **`weather`** folder, not the default `dist`:

- `vite.config.js` → `build.outDir: 'weather'`
- `npm run deploy` → `gh-pages -d weather`

So when you read “deploy the build folder,” **use `weather`** unless you change the config (see below).

### If you want a standard `dist` folder instead

1. In `vite.config.js`, set `outDir: 'dist'` (or remove `outDir` to use Vite’s default `dist`).
2. In `package.json`, change the deploy script to `gh-pages -d dist`.
3. If the live site is a **project page** (`https://<user>.github.io/<repo>/`), set the correct base path in Vite:

   ```js
   export default defineConfig({
     base: '/weather-WebApp/', // must match your GitHub repo name
     // ...
   })
   ```

4. Rebuild and redeploy.

---

## Recommendation plan (before every release)

| Priority | Action | Why |
|----------|--------|-----|
| 1 | Use **Node.js 20.19+** or **22.12+** | Current Vite 7 requires it; older Node can fail the build. |
| 2 | Run **`npm ci`** (or a clean **`npm install`**) after pulling | Avoids broken optional deps (e.g. Rollup native binaries on Linux). |
| 3 | Keep **`.env` out of git**; set **`VITE_OPENWEATHER_API_KEY`** for CI if you automate builds | Keys must be present at **build** time for Vite; they are baked into the client bundle. |
| 4 | Optional: **`VITE_RSS2JSON_API_KEY`** | Helps if rss2json rate-limits anonymous traffic for news/guide RSS fallback. |
| 5 | Optional: **`VITE_NEWS_API_KEY`** + **`VITE_NEWS_PROXY=true`** only if you host **`/api/news`** (Cloudflare Worker, Nginx, etc.) | Without `VITE_NEWS_PROXY`, production skips NewsAPI; plain GitHub Pages uses Google News RSS via rss2json. See [`.env.example`](./.env.example). |
| 6 | After build, open **`weather/index.html`** locally or run **`npx vite preview --outDir weather`** | Smoke-test assets and routing before pushing to `gh-pages`. |
| 7 | Confirm **GitHub Pages** source is **`gh-pages` branch** (or **GitHub Actions** artifact) and the **repo name** matches **`base`** in Vite if the app is not at the domain root. | Wrong `base` breaks JS/CSS paths on project pages. |

---

## What to do next — deploy the build folder to GitHub Pages

### Option A — One-command deploy (uses `weather` folder)

From the project root, with `.env` configured:

```bash
npm install
npm run build
npm run deploy
```

- `predeploy` runs `build` automatically if you only run `npm run deploy`.
- `gh-pages` publishes the contents of **`weather`** to the **`gh-pages`** branch.

Then in the GitHub repo: **Settings → Pages → Build and deployment → Branch: `gh-pages` / root (or `/ (root)`)**.

### Option B — Manual copy (same artifact, full control)

```bash
npm run build
# Upload or push only the contents of ./weather to your hosting root
```

Use this if you deploy from another host (S3, Netlify drop, etc.) or maintain the `gh-pages` branch yourself.

### Option C — GitHub Actions (build in CI with secrets)

1. Add repo secrets: **`VITE_OPENWEATHER_API_KEY`**, and optionally **`VITE_RSS2JSON_API_KEY`**, **`VITE_NEWS_API_KEY`**, and **`VITE_NEWS_PROXY`** (set to `true` only when `/api/news` exists). See [`.env.example`](./.env.example).
2. Workflow steps (conceptually):

   - Checkout  
   - `npm ci`  
   - Build with env vars available to the job  
   - Deploy **`weather`** (or **`dist`**) to `gh-pages` with [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) or **actions/upload-pages-artifact** + **configure-pages**.

This avoids committing keys and keeps Node version consistent.

---

## After deploy — quick verification

- [ ] Weather search returns data (OpenWeather key embedded correctly).  
- [ ] **Local Headlines** and **Explore** load (RSS fallback on static hosting).  
- [ ] No mixed-content or 404s on `assets/*.js` (check **`base`** for project pages).  
- [ ] Hard refresh (Ctrl+Shift+R) to avoid cached old bundles.

---

## Summary

- **Today’s repo:** deploy the **`weather`** folder, not `dist`, unless you change Vite.  
- **Next concrete step:** `npm run build` → confirm `weather/` → `npm run deploy` (or CI equivalent) → point GitHub Pages at **`gh-pages`**.  
- **Align README with reality:** the main README should say the output directory is **`weather`** until `outDir` is switched to `dist`.
