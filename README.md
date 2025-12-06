<div align="center">

  <h1>CheckLaPrice</h1>
  
  <h3>"Know the Price. Beat the Price."</h3>

  <p>
    A smart price-tracking and trend-monitoring app that helps users make smarter buying decisions.
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

## ⭐ Key Features

### 🔹 1. Wishlist Management (CRUD)
- Add items via URL or manual input.
- Auto-fetch thumbnail, price, and description.
- Edit, delete, and reorder wishlist items.
- *Coming Soon:* Local + cloud sync.

### 🔹 2. Price Monitoring Engine
- Scheduled price checks.
- Supports marketplace/store APIs.
- Web scraping fallback for unsupported sites.
- Stores price history to detect spikes or drops.

### 🔹 3. News & Trend Intelligence
- Scrapes product/brand news.
- **Sentiment Analysis:** Classifies market mood (Positive / Neutral / Negative).
- Uses international + local news APIs.
- Correlates news activity with price movements.

### 🔹 4. Alerts & Notifications
- **Triggers:** Price Drop, Price Hike, Trend/Market Warnings.
- Includes short, readable summaries.
- Push notifications via **Expo Notifications API**.
- Optional email alerts.

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
- [ ] Wishlist CRUD Operations
- [ ] Price Scraping Engine Integration
- [ ] News Sentiment Analysis Model
- [ ] Push Notification System
- [ ] Cloud Sync & User Auth

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.