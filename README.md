# Weather Intelligence App

A high-precision Weather Intelligence web application built in **Google AI Studio App Build** featuring real-time meteorological observations from **Open-Meteo**, synoptic 7-day forecasts, 24-hour timeline analytics, and intelligent outdoor planning recommendations. 

This repository is ready to be exported directly from **Google AI Studio to GitHub** and deployed globally via **Cloudflare Pages**.

---

## Table of Contents
1. [Overview & Features](#overview--features)
2. [APIs Used](#apis-used)
3. [AI Studio to GitHub Export Instructions](#ai-studio-to-github-export-instructions)
4. [Deploying GitHub Repository to Cloudflare Pages](#deploying-github-repository-to-cloudflare-pages)
5. [Verifying the Deployed Cloudflare Pages Application](#verifying-the-deployed-cloudflare-pages-application)
6. [In-App Help Notes & Deployment Hub](#in-app-help-notes--deployment-hub)
7. [Local Development & Validation](#local-development--validation)
8. [Edge Configuration Files](#edge-configuration-files)

---

## Overview & Features

- **Global City Search & Geocoding:** Real-time city search powered by the Open-Meteo Geocoding API with administrative regions, country flags, and coordinates.
- **Current Observation Telemetry:**
  - Ambient temperature & apparent "feels like" temperature
  - WMO Weather interpretation code mappings with condition badges and icons
  - Relative humidity, wind speed, wind gusts, and directional cardinal compass
  - UV index with health-risk tiers (Low to Extreme) and visual gauge
  - Precipitation probability and accumulation sum
  - Barometric pressure (hPa)
  - Daily sunrise and sunset times
- **24-Hour Hourly Timeline:** Hourly forecast strip tracking temperature trends and rain chances for the next 24 hours.
- **7-Day Synoptic Forecast:** Daily high/low temperature spectrum bars, weather condition icons, rain chances, and expandable solar/wind extremes.
- **Intelligent Planning & Recommendations:**
  - **Dynamic Weather Advisories:** Alerts for thunderstorms, extreme UV, gusty breezes, and freezing temperatures.
  - **Optimal Outdoor Window:** Identifies the best outdoor activity hours based on temperature, rain probability, and wind.
  - **Adaptive Wardrobe Assistant:** Dynamic clothing recommendations (top, bottom, outerwear, footwear) and essentials checklist.
  - **Activity Suitability Scores:** Multi-factor suitability scoring (0–100%) for Running, Cycling, Outdoor Dining, Hiking, and Stargazing.
- **Unit Customization:** Instant toggle between Metric (°C, km/h, mm) and Imperial (°F, mph, in).
- **Interactive Validation Suite:** One-click in-app test suite to validate valid city lookups (Tokyo, Paris), invalid city handling, and API error states.

---

## APIs Used

This application connects directly to Open-Meteo's open, high-performance APIs without requiring API keys:

1. **Open-Meteo Geocoding API** (Convert city name into latitude and longitude):
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={cityName}&count=6&language=en&format=json
   ```
2. **Open-Meteo Forecast API** (Fetch current weather, hourly timeline, and 7-day forecast data):
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto
   ```

---

## AI Studio to GitHub Export Instructions

Follow either of the methods below to export this application from Google AI Studio to your GitHub account:

### Method 1: Via Google AI Studio UI (One-Click Export)

1. In the **Google AI Studio App Build** workspace, locate the **Settings / Menu** icon in the upper-right corner or left sidebar.
2. Select **Export to GitHub** (or **GitHub Integration**).
3. If prompted, authorize Google AI Studio with your GitHub account.
4. Choose an existing GitHub repository or specify a new repository name (e.g., `weather-intelligence-app`).
5. Select the **main** branch and click **Export / Push**.
6. Google AI Studio pushes the entire source code, build configuration, and assets directly to your GitHub repository.

### Method 2: Via Git CLI (Direct Terminal Push)

If you have downloaded the project archive or are using a terminal:

```bash
# 1. Initialize git (if not already a git repo)
git init

# 2. Stage all project files
git add -A

# 3. Commit the changes
git commit -m "feat: complete Weather Intelligence app with Cloudflare Pages deployment readiness"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub remote repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/weather-intelligence-app.git

# 6. Push code to GitHub
git push -u origin main
```

---

## Deploying GitHub Repository to Cloudflare Pages

Cloudflare Pages provides automated CI/CD directly from your GitHub repository, building and serving the Vite Single-Page Application (SPA) across Cloudflare's global Anycast edge network.

### Step-by-Step Cloudflare Pages Deployment:

1. **Log in to Cloudflare:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and sign in (or sign up for a free account).

2. **Create a Pages Project:**
   - In the left sidebar, navigate to **Compute (Workers & Pages)** > **Workers & Pages**.
   - Click **Create application**.
   - Select the **Pages** tab.
   - Click **Connect to Git**.

3. **Select your GitHub Repository:**
   - Authorize Cloudflare to access your GitHub account.
   - Select the `weather-intelligence-app` repository (or whatever name you chose).
   - Click **Begin setup**.

4. **Configure Build Settings:**
   Use the following configuration values:

   | Setting | Value | Explanation |
   | :--- | :--- | :--- |
   | **Project name** | `weather-intelligence-app` | Determines your live URL: `https://<project-name>.pages.dev` |
   | **Production branch** | `main` | Cloudflare auto-deploys every commit to this branch |
   | **Framework preset** | `Vite` (or `None`) | Pre-configures Vite build environment |
   | **Build command** | `npm run build` | Compiles the React + TypeScript app into `dist/` |
   | **Build output directory** | `dist` | Cloudflare will publish the files inside this directory |
   | **Root directory** | *(leave blank or `/`)* | The project root |

   *(Optional Environment Variable)*: Under **Environment variables**, you can set `NODE_VERSION` to `20`.

5. **Deploy the Application:**
   - Click **Save and Deploy**.
   - Cloudflare Pages will spin up an isolated build container, install dependencies with `npm ci`, run `npm run build`, and distribute the compiled assets globally.
   - The build process typically takes **30–45 seconds**.

6. **View Live Deployment:**
   - Once completed, Cloudflare displays a success confirmation with your live production URL:
     ```
     https://weather-intelligence-app.pages.dev
     ```

---

## Verifying the Deployed Cloudflare Pages Application

To prove that your application is running successfully on Cloudflare Pages:

1. **Open the Cloudflare Pages URL:**
   - Visit `https://<project-name>.pages.dev` in your browser.
2. **Verify SSL & Edge Response:**
   - Confirm that the URL is served over HTTPS with a valid Cloudflare Universal SSL certificate.
   - Verify that the HTTP status code is `200 OK`.
3. **Validate Real-Time Weather Search:**
   - In the search bar, type a city (e.g., `Tokyo` or `Paris`).
   - Confirm that the Open-Meteo Geocoding autocomplete appears and coordinates are displayed.
   - Select the city and verify that real-time temperature, hourly strip, and 7-day forecast cards render accurately.
4. **Run In-App Validation Suite:**
   - Use the built-in **API Validation Suite** buttons below the search bar:
     - `Test Tokyo (Valid 1)`: Confirms geocoding and forecast pipeline for Tokyo.
     - `Test Paris (Valid 2)`: Confirms geocoding and forecast pipeline for Paris.
     - `Test Invalid City`: Confirms that 0-result searches produce a clear, friendly error message.
     - `Test API Error State`: Confirms that out-of-bounds queries produce an actionable error alert with a **Retry** button.
5. **In-App Deployment Prover:**
   - Click the **Help & Deploy** button in the header to use the built-in URL probe tool to test and verify any live `*.pages.dev` endpoint.

---

## In-App Help Notes & Deployment Hub

The application includes an integrated **Help Notes & Deployment Hub** accessible directly from the top navigation bar via the **Help & Deploy** button:

- **Deployment Workflow Visualizer:** Step-by-step interactive visualizer for AI Studio → GitHub → Cloudflare Pages.
- **Build Settings Checklist:** Quick reference card for Framework Preset, Build Command, and Output Directory.
- **Live Endpoint Verifier:** Enter any `*.pages.dev` URL to probe its edge availability, HTTPS connectivity, and response status directly inside the app.
- **Copyable Git CLI & GitHub Actions Workflows:** Ready-to-copy commands and CI/CD workflow definitions.

---

## Local Development & Validation

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server (runs on port 3000)
npm run dev

# 3. Validate Open-Meteo APIs (2 valid searches + 1 invalid + 1 error state)
npm run validate

# 4. Run TypeScript linter
npm run lint

# 5. Build production static bundle (outputs to dist/)
npm run build
```

---

## Edge Configuration Files

This project includes configuration files tailored for Cloudflare Pages:

- **`public/_headers`**: Configures production HTTP security headers (HSTS, Content-Type Options, Referrer-Policy) and aggressive caching rules for static assets (`/assets/*`).
- **`public/_routes.json`**: Explicitly routes all traffic to the Single-Page Application (SPA) index file (`/index.html`), preventing 404 errors on browser page reloads.
- **`.github/workflows/deploy.yml`**: Optional automated GitHub Actions workflow for deploying to Cloudflare Pages on push to `main`.
