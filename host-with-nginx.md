---
description: How to host with Nginx Proxy Manager and valid News API
---

# Self-Hosting with Nginx Proxy Manager (NPM)

Since you are using NPM + Cloudflare Tunnel, your "backend" logic (Cloudflare Functions) won't run automatically. You need to configure Nginx to proxy the API requests securely.

## 1. Build the App
Run the build to generate the static files.
```bash
npm run build
```
This creates a `weather` folder. Host this folder using your preferred method (Docker, generic web server, etc) so it's accessible at your internal IP (e.g., `http://192.168.1.50:80`).

## 2. Configure Nginx Proxy Manager
In your NPM Dashboard:

1.  **Edit Proxy Host** for your domain (`yourdomain.com`).
2.  **Details Tab**: Point to your static site (e.g., `192.168.1.50` Port `80`).

### 3. Add the API Proxy (Crucial)
This tricks the browser into thinking the API is local (bypassing CORS), while Nginx forwards it to the real NewsAPI.

1.  Go to the **Custom Locations** tab.
2.  Click **Add Location**.
3.  **Define Location**: `/api/news`
4.  **Scheme**: `https`
5.  **Forward Hostname**: `newsapi.org`
6.  **Forward Port**: `443`
7.  **Advanced (Gear Icon)**:
    Paste this config exactly to handle the path rewrite and SSL handshake:

    ```nginx
    # Rewrite /api/news?q=... -> /v2/everything?q=...
    rewrite ^/api/news(.*)$ /v2/everything$1 break;
    
    # SSL/SNI Configuration for NewsAPI
    proxy_ssl_server_name on;
    proxy_set_header Host newsapi.org;
    proxy_set_header X-Real-IP $remote_addr;
    ```

## 4. Verification
1.  Save the configuration.
2.  Visit `https://yourdomain.com`.
3.  Search for a city.
    *   **Browser** sends request to: `https://yourdomain.com/api/news?q=...&apiKey=...`
    *   **Nginx** forwards to: `https://newsapi.org/v2/everything?q=...&apiKey=...`
    *   **Result**: Real News appears! ✅
