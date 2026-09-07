# Weather Intelligence App

A high-precision Weather Intelligence web application built in Google AI Studio App Build with live Open-Meteo meteorological telemetry, 7-day synoptic forecasting, automated outdoor planning recommendations, and instant deployment support for GitHub and Cloudflare Pages.

---

## Key Features

- **Global City Search & Geocoding:** Instant debounced city search powered by Open-Meteo Geocoding API with administrative regions, country codes, and timezones.
- **Geolocation Support:** One-click GPS location detection using browser Geolocation with reverse geocoding fallback.
- **Comprehensive Current Weather:**
  - Real-time temperature & apparent "feels like" temperature
  - WMO Weather interpretation code mappings with custom icons and descriptive states
  - Relative humidity, wind speed & directional compass cardinal
  - UV radiation index with safety tiers (Low to Extreme) and visual gauge
  - Precipitation probability and accumulation sum
  - Barometric pressure (hPa)
  - Daily sunrise and sunset times
- **24-Hour Timeline Outlook:** Hourly forecast strip tracking temperature trends and rain chances for the next 24 hours.
- **7-Day Synoptic Forecast:** Daily high/low temperature spectrum bars, weather condition icons, rain chances, and expandable panels for solar and wind extremes.
- **Weather Intelligence & Planning Recommendations:**
  - **Dynamic Alerts:** Real-time advisories for thunderstorms, extreme UV, gusty breezes, and freezing temperatures.
  - **Optimal Outdoor Window:** Automatically calculates the day's ideal hours for outdoor activities based on temperature, rain probability, and wind.
  - **Adaptive Wardrobe Assistant:** Dynamic clothing advice (top, bottom, outerwear, footwear) and essentials checklist (umbrella, sunglasses, SPF 30+).
  - **Activity Suitability Scores:** Multi-factor suitability scoring (0–100%) and practical coaching for Running, Cycling, Outdoor Dining, Hiking, and Stargazing.
- **Units & Customization:** Instant toggle between Metric (°C, km/h, mm) and Imperial (°F, mph, in) with local storage memory.
- **Saved / Bookmarked Cities:** Pin favorite cities for immediate one-click weather switching.

---

## Deploying to Cloudflare Pages via GitHub

The app is built as a zero-dependency static SPA with no server secrets, making it 100% compatible with Cloudflare Pages:

1. **Export to GitHub:** In Google AI Studio, select **Settings > Export to GitHub** (or use `git push`).
2. **Connect to Cloudflare Pages:** In Cloudflare Dashboard, go to **Workers & Pages > Create application > Pages > Connect to Git**.
3. **Build Settings:**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Live Verification:** Once deployed, Cloudflare provides a live `https://<project-name>.pages.dev` URL. Verify with the built-in deployment tool in the app header or see `DEPLOYMENT.md` for full instructions.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Run linter
npm run lint
```
