# Weather Intelligence App — Deployment Guide

This guide details how to take the Weather Intelligence App built in **Google AI Studio App Build**, connect it to **GitHub**, deploy it via **Cloudflare Pages**, and prove that the deployed application runs successfully on a Cloudflare Pages URL.

---

## 1. Architectural Readiness as a Deployable Software Artifact

The Weather Intelligence App is architected specifically for friction-free static deployment:
- **Build Artifact:** Pure client-side React 19 + Vite SPA compiling into the `dist/` directory via `npm run build`.
- **Zero API Key Leakage / Zero Backend Requirement:** Data is fetched directly and securely via the public, CORS-enabled Open-Meteo REST APIs (`https://api.open-meteo.com` and `https://geocoding-api.open-meteo.com`), eliminating the need for backend secret management.
- **Edge Compatible:** Static assets (`dist/index.html`, `dist/assets/*`) are served globally via Cloudflare's Anycast Edge CDN with custom headers configured in `public/_headers`.
- **SPA Fallback:** Includes `public/_routes.json` ensuring seamless client-side single-page routing without 404 errors.

---

## 2. Connecting the App Directly to GitHub

### Option A: Via Google AI Studio UI (Recommended)
1. In the Google AI Studio App Build interface, click on the **Settings** / **Export** menu in the top navigation or sidebar.
2. Select **Export to GitHub**.
3. Authenticate with your GitHub account when prompted and choose either an existing repository or create a new one (e.g. `weather-intelligence`).
4. Click **Export / Commit**. AI Studio will push the entire codebase, including all dependencies and configuration files, to your chosen repository on the `main` branch.

### Option B: Via Git CLI
If pushing from your local workstation or container terminal:
```bash
# Initialize git if not already initialized
git init

# Stage all files
git add -A

# Commit changes
git commit -m "feat: complete Weather Intelligence App with Cloudflare Pages deployment readiness"

# Set branch to main
git branch -M main

# Add your GitHub repository remote
git remote add origin https://github.com/<YOUR-USERNAME>/weather-intelligence.git

# Push to GitHub
git push -u origin main
```

---

## 3. Deploying the GitHub Repository through Cloudflare Pages

### Step 1: Connect Repository in Cloudflare
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left-hand navigation, select **Workers & Pages**.
3. Click **Create application** > select the **Pages** tab > click **Connect to Git**.
4. Select your GitHub account and choose the `weather-intelligence` repository.

### Step 2: Configure Build Settings
Fill in the deployment parameters as follows:
| Setting | Recommended Value |
| :--- | :--- |
| **Project name** | `weather-intelligence` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` (or `None`) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave blank or root) |

*(Optional)* Under **Environment variables**, set `NODE_VERSION` to `20` (Cloudflare Pages defaults to modern Node).

### Step 3: Deploy
1. Click **Save and Deploy**.
2. Cloudflare Pages initiates an automated build container, executes `npm ci` and `npm run build`, and deploys the contents of `dist/` across 300+ global edge locations.
3. The build completes in approximately 25–40 seconds.

---

## 4. Automated CI/CD via GitHub Actions (Alternative)

A ready-to-use GitHub Actions workflow is provided at `.github/workflows/deploy.yml`. If you prefer deploying directly via GitHub Actions:
1. In Cloudflare Dashboard, create an API token with **Cloudflare Pages: Edit** permissions.
2. In your GitHub repository settings, add two secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on your dashboard).
3. Every push to the `main` branch will automatically build and deploy the applet.

---

## 5. Proving and Verifying the Deployed Application

Once deployed, Cloudflare generates a production URL:
```
https://<PROJECT-NAME>.pages.dev
# Example: https://weather-intelligence.pages.dev
```

### Verification Checklist:
1. **HTTP Status & SSL:** Navigate to the URL in any browser. Check that the connection is secured with HTTPS (Cloudflare Universal SSL certificate) and returns an HTTP `200 OK`.
2. **City Search Verification:** Type a city name (e.g., "Tokyo", "London", "New York"). Observe the live Open-Meteo autocomplete dropdown.
3. **Current Observation:** Select a city to verify temperature, feels like, humidity, wind velocity, UV index, and air pressure render accurately.
4. **24-Hour Timeline:** Confirm the horizontal hourly forecast displays temperature curves and rain probabilities for the next 24 hours.
5. **Planning Intelligence Engine:** Verify that:
   - The **Best Outdoor Window** calculates the optimal hours for outdoor activities.
   - The **Clothing & Essentials Guide** adapts to the current temperature and provides accurate checklist indicators (umbrella, sunglasses, SPF).
   - **Activity Suitability Scores** (running, cycling, dining, hiking, stargazing) compute based on current meteorological parameters.
6. **In-App Prover Tool:** You can also click the **Deploy & GitHub** button in the app header and run the live probe against your Cloudflare Pages URL directly.
