# Weather Intelligence App — Deployment & Help Guide

This guide details the complete process to export the Weather Intelligence App from **Google AI Studio App Build**, connect it to **GitHub**, deploy it through **Cloudflare Pages**, and verify that the deployed application runs successfully on a Cloudflare Pages URL (`https://<project-name>.pages.dev`).

---

## 1. Architectural Readiness as a Deployable Software Artifact

The Weather Intelligence App is architected specifically for friction-free static deployment:
- **Zero Server Secrets / Client-Safe:** Telemetry is fetched directly and securely from Open-Meteo's open CORS-enabled APIs (`https://geocoding-api.open-meteo.com` and `https://api.open-meteo.com`). There are no server-side secrets or API keys required, making the app 100% safe to deploy as a public static site.
- **Vite Static SPA Output:** Running `npm run build` compiles TypeScript and Tailwind into optimized, self-contained static assets in `dist/`.
- **Global Edge Optimization:** Included `public/_headers` provisions HTTP security headers (HSTS, X-Content-Type-Options, Referrer-Policy) and long-term caching for immutable asset bundles.
- **Client-Side Routing Support:** Included `public/_routes.json` ensures Cloudflare Pages serves `dist/index.html` on all subpaths, preventing 404 errors.

---

## 2. Exporting from Google AI Studio to GitHub

You can export the project from Google AI Studio into GitHub using either the UI or the Git CLI:

### Option A: Via Google AI Studio UI (Recommended)
1. In the Google AI Studio App Build workspace, click the **Settings / Menu** icon (top right or left sidebar).
2. Select **Export to GitHub**.
3. Authorize Google AI Studio to access your GitHub account.
4. Choose an existing repository or create a new one (e.g., `weather-intelligence`).
5. Choose the **main** branch and click **Export / Commit**.
6. Google AI Studio pushes the entire project directory directly into your GitHub repository.

### Option B: Via Git CLI
If you are working from a terminal or downloaded zip:
```bash
# 1. Initialize git
git init

# 2. Stage all project files
git add -A

# 3. Commit the changes
git commit -m "feat: complete Weather Intelligence app with Cloudflare Pages deployment readiness"

# 4. Set branch to main
git branch -M main

# 5. Add your GitHub remote repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/weather-intelligence.git

# 6. Push to GitHub
git push -u origin main
```

---

## 3. Deploying the GitHub Repository through Cloudflare Pages

### Step 1: Connect Repository in Cloudflare
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, select **Compute (Workers & Pages)** > **Workers & Pages**.
3. Click **Create application** > select the **Pages** tab > click **Connect to Git**.
4. Authorize Cloudflare to access your GitHub account and select your `weather-intelligence` repository.
5. Click **Begin setup**.

### Step 2: Configure Build Settings
Fill in the configuration fields:

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Project name** | `weather-intelligence` | Determines your live subdomain: `https://<name>.pages.dev` |
| **Production branch** | `main` | Deploys automatically on every git push |
| **Framework preset** | `Vite` (or `None`) | Pre-configures the build environment |
| **Build command** | `npm run build` | Compiles the React + TypeScript app to `dist/` |
| **Build output directory** | `dist` | Cloudflare serves static assets from this folder |
| **Root directory** | *(leave blank or `/`)* | Project root |

*(Optional)* Under **Environment variables**, add `NODE_VERSION` with value `20`.

### Step 3: Deploy & Launch
1. Click **Save and Deploy**.
2. Cloudflare Pages boots an isolated build container, runs `npm ci` and `npm run build`, and deploys the contents of `dist/` across 300+ global edge locations.
3. The build completes in approximately 30–45 seconds.

---

## 4. Proving and Verifying the Deployed Application

Once deployed, Cloudflare generates your live production URL:
```
https://<project-name>.pages.dev
# Example: https://weather-intelligence.pages.dev
```

### Verification Checklist:
1. **Edge Reachability & HTTPS:** Open `https://<project-name>.pages.dev` in your browser. Verify the connection has a valid Cloudflare SSL certificate and returns `200 OK`.
2. **Geocoding & City Search:** Enter a city (e.g. `Tokyo` or `Paris`). Confirm the autocomplete dropdown queries `geocoding-api.open-meteo.com` and populates matching locations.
3. **Current Observations & 7-Day Forecast:** Select a city and verify real-time temperature, feels like, humidity, wind, UV index, and 7-day forecast cards render accurately.
4. **Planning Intelligence:** Verify dynamic alerts, optimal outdoor activity window, wardrobe recommendations, and activity suitability scores.
5. **Interactive Validation Suite:** Use the in-app test buttons below the search bar to test valid cities, 0-result searches, and HTTP 400 error handling.
6. **In-App Deploy Verifier:** Click the **Help & Deploy** button in the header to run the live URL probe tool against any `*.pages.dev` address.

---

## 5. Automated CI/CD via GitHub Actions (Alternative)

A ready-to-use GitHub Actions workflow is provided at `.github/workflows/deploy.yml`:
1. In Cloudflare Dashboard, create an API token with **Cloudflare Pages: Edit** permissions.
2. In your GitHub repository settings, add two secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
3. Every push to the `main` branch will automatically build and publish to Cloudflare Pages.
