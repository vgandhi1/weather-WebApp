---
description: How to deploy the Vite React app to Cloudflare Pages
---

# Deploying to Cloudflare Pages

Cloudflare Pages is a great alternative to GitHub Pages, offering fast global CDN, free SSL, and easy custom domain setup.

## 1. Prepare Codebase
Cloudflare Pages usually serves your site from the "root" of a domain (e.g., `yourname.com` or `weather.yourname.com`), unlike GitHub Pages which often uses a subdirectory (e.g., `github.io/repo-name/`).

### Update `vite.config.js`
You must remove or comment out the `base` property if you are deploying to a root domain.

```javascript
export default defineConfig({
  plugins: [react()],
  // base: '/weather-WebApp/', // <-- COMMENT OUT or REMOVE this line for Cloudflare
})
```

### Push Changes
Commit and push this change to your GitHub repository.

```bash
git add vite.config.js
git commit -m "Update build config for Cloudflare Pages"
git push
```

## 2. Connect Cloudflare
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select your GitHub repository (`weather-app`).

## 3. Configure Build Settings
Cloudflare detects Vite automatically, but verify these settings:

*   **Framework preset**: `Vite` (or `React`)
*   **Build command**: `npm run build`
*   **Build output directory**: `dist`
*   **Environment Variables**:
    *   Add `VITE_NEWS_API_KEY` and your actual key value here. (Cloudflare secrets are secure).

## 4. Save and Deploy
Click **Save and Deploy**. Cloudflare will pull your code, build it, and publish it to a `*.pages.dev` URL.

## 5. Add Custom Domain
Once deployed:
1.  Go to the Project Settings in Cloudflare.
2.  Click **Custom Domains**.
3.  Click **Set up a custom domain** and enter your domain (e.g., `weather.vinay.com`).
4.  Follow the DNS instructions (Cloudflare manages this automatically if they are your registrar).
