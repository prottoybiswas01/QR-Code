# 🚀 QRFlex — Dynamic QR Code Generator Platform

A modern, scalable, and production-ready **Dynamic QR Code Generator Platform** built with **React, Vite, Tailwind CSS, Express.js, MongoDB**, and **Firebase Authentication**.

The core value proposition of QRFlex is **Dynamic QR Codes**: users can physically print a QR code once (on posters, restaurant counters, product packages, or business cards) and freely update its destination URL, Wi-Fi password, vCard contact information, or social links inside the dashboard at any time without reprinting.

---

## 🌟 Key Features

### 1. 🔄 Dynamic QR Code Engine
- Permanent short URLs generated via cryptographic unique slugs (e.g. `https://yourdomain.com/q/8f73ab21`).
- Decouples the physical QR matrix from the cloud destination.
- Edit destination links, Wi-Fi passwords, or text anytime from Dashboard — **existing printed QR images continue working seamlessly without reprinting**.

### 2. 📶 Dynamic Wi-Fi Portals
- Unlike native static Wi-Fi QRs which break whenever a router password is changed, QRFlex generates a permanent dynamic Wi-Fi portal.
- Mobile scanners receive a dedicated, responsive connection page showing:
  - Network Name (SSID)
  - Security Type & Hidden Network Indicator
  - Current Wi-Fi Password with reveal toggle
  - 1-Click **Copy Password** button
  - Step-by-step device connection instructions.

### 3. 🎯 11 Supported QR Code Types
1. **Website URL**: Direct link to websites or landing pages
2. **Wi-Fi Network**: Dynamic Wi-Fi portal with editable password
3. **vCard (3.0)**: Digital business card with 1-click `.vcf` phone contact download
4. **WhatsApp**: Pre-filled chat template and direct message launcher
5. **Facebook**: Profile and business page links
6. **Instagram**: Direct profile page redirection
7. **Email**: Pre-filled recipient, subject line, and body
8. **Phone Call**: Direct dialer launcher (`tel:`)
9. **SMS**: Direct SMS composer with pre-written message (`sms:`)
10. **Plain Text**: Markdown and notes viewer with 1-click copy
11. **Location / Maps**: Coordinates and address search with direct Google Maps redirection.

### 4. 🎨 Design Customizer & High-Res Export
- Solid foreground colors and **linear gradient styles** with preset palettes
- 6 QR dot shapes: *Rounded, Dots, Classy, Classy Rounded, Smooth, Standard*
- Corner square & inner eye shapes customization
- Center logo embedding with adjustable margin & auto error correction upgrading (High - 30%)
- **PNG downloads** with resolution multipliers (512px, 1024px High-Res, 2048px Ultra HD Print)
- **Vector SVG downloads** for infinite print fidelity.

### 5. 📊 Real-Time Scan Analytics & Telemetry
- Scan counter and last scanned timestamp
- Daily / weekly time-series scan distribution charts
- Mobile vs Desktop vs Tablet category breakdowns
- Operating systems (iOS, Android, Windows, macOS, Linux)
- Top browsers and referrers
- Privacy-safe anonymized IP hashing.

### 6. 🔒 Robust Security & Isolation
- **Firebase Authentication** (Google OAuth, Email/Password, Email Verification, Password Reset)
- **Backend Firebase Admin Token Verification** with seamless dev mode support
- User ownership validation on all CRUD operations
- React Error Boundary at root, route, and component levels for bulletproof crash isolation
- Express rate limiters, Helmet headers, CORS policies, and centralized error sanitization.

---

## 🏗️ Architecture & Folder Structure

```
c:/QR code/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ErrorBoundary, Modal, Skeleton, Toast
│   │   │   ├── dashboard/      # Sidebar, Header, StatCard, QRCard
│   │   │   └── qr/             # TypeSelector, FormInputs, Customizer, Preview, DownloadModal
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Create, Edit, MyQRs, Analytics, Profile, Settings, PublicViewer
│   │   ├── routes/             # AppRoutes, ProtectedRoute
│   │   ├── services/           # api, authService, qrService, firebase
│   │   └── utils/              # qrPayloadBuilder
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Backend Application (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/             # MongoDB connection, Firebase Admin SDK
│   │   ├── controllers/        # auth, qr, redirect, analytics controllers
│   │   ├── middleware/         # authMiddleware, rateLimiter, errorMiddleware
│   │   ├── models/             # User, QRCode, ScanAnalytics
│   │   ├── routes/             # authRoutes, qrRoutes, redirectRoutes, analyticsRoutes
│   │   ├── utils/              # slugGenerator, qrFormatter, analyticsParser
│   │   ├── app.js              # Express app definition
│   │   └── server.js           # Server startup script
│   ├── package.json
│   └── .env.example
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn
- MongoDB instance (MongoDB Atlas connection string provided in `.env`)

---

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   BASE_URL=http://localhost:5000

   # MongoDB Connection String (Atlas or Local)
   MONGODB_URI=mongodb+srv://shantodev1670_db_user:PsftPU5JBbuYZJGh@cluster0.mongodb.net/qrcode_platform?retryWrites=true&w=majority

   # Firebase Admin Configuration (Optional in dev mode)
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Backend will be running on `http://localhost:5000`.

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=QRFlex

   # Optional Firebase Web App credentials (from Firebase Console)
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

> **💡 Quick Testing Tip**: You can immediately test the full platform using the built-in **Instant Demo Account (1-Click)** button on the Login page without configuring Firebase credentials first!

---

## 📡 REST API Documentation

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/q/:slug` | Public dynamic QR redirect endpoint (records analytics & performs 302 redirect / serves portal) |
| `GET` | `/api/public/q/:slug` | Public JSON resolver for frontend mobile dynamic viewer pages |
| `GET` | `/api/health` | Service health status check |

### Authentication & Profile (Bearer Token Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile, plan tier, and quota stats |
| `PUT` | `/api/auth/profile` | Update user display name and avatar photo |
| `POST` | `/api/auth/sync` | Sync Firebase user profile into MongoDB |

### QR Code Management (Bearer Token Required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/qr` | Create a new Dynamic or Static QR code |
| `GET` | `/api/qr` | Get paginated QR codes with type, mode, status, and search filters |
| `GET` | `/api/qr/:id` | Get details of a single QR code (with ownership check) |
| `PUT` | `/api/qr/:id` | Update QR destination/credentials (**slug remains unchanged**) |
| `POST` | `/api/qr/:id/duplicate` | Duplicate an existing QR code |
| `DELETE` | `/api/qr/:id` | Permanently delete a QR code and its scan logs |

### Analytics (Bearer Token Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/qr/:id/analytics?period=30d` | Get time series, devices, OS, browsers, and scan logs for a QR |
| `GET` | `/api/analytics/overview` | Get aggregated dashboard metrics across all user QRs |

---

## 🌐 Production Deployment Guidelines

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Set environment variables on your hosting provider:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://api.yourdomain.com`)
   - `VITE_FIREBASE_API_KEY`, etc.
3. Deploy the generated `dist/` directory.

### Backend Deployment (Render / Railway / Docker / AWS ECS)
1. Set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI`: Production MongoDB Atlas connection URI
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://yourdomain.com`)
   - `BASE_URL`: Your deployed API / redirect domain (e.g. `https://yourdomain.com` or `https://api.yourdomain.com`)
2. Start using `npm start` (or process manager `pm2 start src/server.js -i max`).

---

## 📄 License
This project is released under the **MIT License**.
