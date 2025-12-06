<div align="center">
  <h1>CheckLaPrice</h1>
  <h3>Know the price. Beat the price.</h3>
  <p>Smart wishlist + cross‑market price watcher for Lazada & Shopee.</p>
  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/Apify-FF9900?style=for-the-badge&logo=apachedruid&logoColor=white" alt="Apify" />
    <img src="https://img.shields.io/badge/Convex-Realtime-8B5CF6?style=for-the-badge" alt="Convex" />
  </p>
</div>

## Why it matters
- Prices shift daily across marketplaces; shoppers rarely know when to buy.
- Comparing Lazada vs Shopee is tedious, and “good deal” signals are hidden.
- We aggregate both stores, surface live prices, and show whether now is a good buying window.

## What we built for the hackathon
- **Cross-store scraping gateway**: Apify worker merges Lazada (Playwright/BeautifulSoup) and Shopee (Apify actor) results, sorted by lowest price.
- **Guided add-to-wishlist flow**: Search once, pick a result, set a target price, and save directly to Convex.
- **Price intelligence UI**: History chart, lowest/highest/average, market delta hints, and “buying window” guidance per item.
- **Animated RN experience**: Expo Router navigation, reanimated transitions, responsive cards, and share/open-store shortcuts.

## Quick demo script (2 mins)
1) Tap **Add Product** → search “minecraft” (hits Lazada + Shopee) → pick a card → set target price → **Add to Wishlist**.  
2) Open **Wishlist** to see live stats (items count, dropping prices, total value).  
3) Open a product → view price history chart + insights → tap **Open Store** to jump to the listing.

## Architecture at a glance
- **Mobile app**: React Native (Expo), TypeScript, Expo Router, Reanimated, react-native-chart-kit.
- **Data layer**: Convex for realtime wishlist + price history (`EXPO_PUBLIC_CONVEX_URL` points to the hosted deployment; change if you self-host).
- **Scrape layer (Apify-first)**: Python worker packaged for Apify; uses Playwright/BS4 for Lazada and the Shopee Apify actor via `API_TOKEN`, merges and sorts by price. Can also be run locally via `Backend/main.py`.
- **Config discovery**: The app resolves `EXPO_PUBLIC_API_URL` automatically to your Metro host in dev so mobile devices hit the correct backend (`src/services/api.ts`).

## Getting started

### 1) Mobile app (Expo)
1. Copy env: `cp .env.example .env` and set `EXPO_PUBLIC_API_URL` to your backend (e.g., `http://<your-ip>:8000`).  
2. Install deps: `npm install`  
3. Run: `npx expo start` (use Expo Go or emulator).  
4. Ensure your device can reach the backend host (same Wi‑Fi or use tunnel).

### 2) Scrape worker (Apify / local)
```bash
cd Backend
python -m venv .venv
source .venv/bin/activate # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m playwright install chromium
export API_TOKEN=<your_apify_token>  # required for Shopee
# optional: export SHOPEE_COOKIES='[...]' to override defaults
uvicorn main:app --host 0.0.0.0 --port 8000
```

Key endpoints:
- `GET /` → health check  
- `POST /api/scrape/lazada` → { query }  
- `POST /api/scrape/all` → { query } (Lazada + Shopee merged & sorted)

### 3) Data (Convex)
- Default points to the hosted Convex instance in `.env.example`.  
- If you self-host, set `EXPO_PUBLIC_CONVEX_URL` (and `CONVEX_SELF_HOSTED_*`) accordingly, then run `npx convex dev` or your self-hosted deployment.

## Tech stack
- React Native (Expo), TypeScript, Expo Router, Reanimated, react-native-chart-kit
- Convex (realtime data + mutations for wishlist and price history)
- Apify (Shopee actor + Python worker with Playwright/BS4 for Lazada)
- Tooling: dotenv, AsyncStorage, Expo LinearGradient/StatusBar/SafeArea, Ionicons

## Roadmap / next steps
- Push alerts when a product crosses its target price.
- Background cron to refresh prices and append to history automatically.
- News-signal scoring to warn about upcoming price hikes.
- Add inline receipts for “I bought it” to close the loop.

## License
MIT