<div align="center">

  <h1>CheckLaPrice</h1>
  
  <h3>"Know the Price. Beat the Price."</h3>

  <p>
    <strong>Price-Hike Aware Wishlist App</strong><br>
    A web/mobile application that allows users to maintain a wishlist of items and automatically monitors world and local news to detect signals of potential price hikes. Users receive proactive alerts before price increases happen.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
  </p>

  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

<br />

## 📌 Problem Statement

Non-tech users often struggle to know:
- **Is this a good price or an overpriced one?**
- **Will the price go up or down?**
- **Are there market events that might affect prices?**

**CheckLaPrice** automates all the research by tracking prices, analyzing news sentiment, and sending alerts to users so they can buy confidently.

---

## 📱 App Showcase

| **Home & Wishlist** | **Price Analysis** | **Smart Alerts** |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/250x500?text=Home+Screen" alt="Home Screen" width="200"/> | <img src="https://via.placeholder.com/250x500?text=Price+Graph" alt="Price Graph" width="200"/> | <img src="https://via.placeholder.com/250x500?text=Notifications" alt="Notifications" width="200"/> |
| *Manage your wishlist items* | *View price history & trends* | *Get notified on price drops* |

---

## ⭐ Functional Specifications

### 🔹 1. Wishlist Management
Users can maintain a personalized list of items to track.
- **Add Items via:**
  - Product URL
  - Manual entry (name, brand, category, price range)
  - Barcode/QR scan (optional)
- **Management:** Edit, remove, tag/categorize, and reorder items.
- **Data Stored:** Name, thumbnail, category, current price, price history, source URL, target price, and alert preferences (drop/hike).

### 🔹 2. Price Monitoring Engine
Automatically tracks price changes to detect trends.
- **Monitoring Intervals:** Default 24 hours (configurable 1–48 hours) or event-triggered.
- **Data Sources:** Web scrapers and Marketplace APIs (Shopee, Lazada, Amazon).
- **Price Logs:** Timestamp, price, source, % change, and predicted trend (UP/DOWN/STABLE).
- **Triggers:**
  - Price increases above threshold.
  - Price drops to target.
  - Sudden price spikes.
  - Imminent predicted price increase.

### 🔹 3. News & Event Monitoring Engine
Scans global and local sources to predict market shifts.
- **Sources:** Global/Local news, Industry feeds, Social media (X, Reddit), Government announcements, Economic reports.
- **Processing Pipeline:**
  - Aggregates news every X minutes.
  - **NLP Classification:** Detects supply shortages, demand surges, geopolitical tensions, inflation, trade restrictions, etc.
  - **Risk Scoring:** `RiskScore = (NewsSeverity * CategoryMappingWeight * RecencyFactor) - NoiseFilter`
- **Action:** Alerts user if RiskScore exceeds threshold.

### 🔹 4. Alerting System
Proactive notifications to keep users informed.
- **Channels:** Push notifications, Email, In-app, Telegram/WhatsApp bot (optional).
- **Alert Types:**
  - 🚨 Price Hike Warning
  - 📈 Price Increase Detected
  - 📉 Price Drop Detected
  - ⚠️ Critical Event Alert
- **Payload:** Event summary, item affected, confidence level, and recommended action.

---

## 🛠️ Tech Stack

### Mobile App
- **Framework:** React Native (Expo)
- **Routing:** Expo Router
- **Notifications:** Expo Notifications
- **Networking:** Axios / Fetch
- **State Management:** Zustand / Redux Toolkit

### Backend & Intelligence
- **Server:** Node.js + Express OR Python FastAPI
- **Workers:** Scheduled Cron Jobs / Cloud Functions
- **ML Model:** Sentiment Analysis & Trend Scoring
- **Database:** Firebase Firestore / Supabase / MongoDB Atlas

### Integrations
- Marketplace APIs
- Google News API / NewsData.io
- Web Scraping (Puppeteer/Cheerio/BeautifulSoup)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/client) app installed on your iOS/Android device.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aimanzahar/CheckLaPrice.git
   cd CheckLaPrice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npx expo start
   ```

4. **Run on Device**
   - Scan the QR code with the **Expo Go** app (Android) or Camera app (iOS).

---

## 📱 Why Expo Go?

We chose **Expo Go** to enable rapid development and testing:
- **Build fast** without complex native setup (Xcode/Android Studio).
- **Instant testing** on real devices.
- Access to powerful APIs like **Notifications**, **SecureStore**, and **Background Tasks**.
- **Quick deployment** capabilities for hackathons.

---

## 🗺️ Roadmap

- [x] Project Setup & UI Shell
- [ ] **Wishlist Management:** URL scraping, Manual entry, Barcode scanning.
- [ ] **Price Engine:** Scrapers for Shopee/Lazada, Price history logging.
- [ ] **Intelligence:** News NLP pipeline, Risk Score algorithm, Social media signals.
- [ ] **Alerts:** Push notifications, Email integration, Telegram bot.
- [ ] **Advanced:** ML-based price prediction, Cloud Sync.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.