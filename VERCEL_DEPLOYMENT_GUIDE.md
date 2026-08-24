# 🚀 Vercel Deployment Guide (ভার্সেল ডিপ্লয়মেন্ট গাইড)

এই প্রজেক্টটি **Vercel**-এ খুব সহজেই সম্পূর্ণ ফ্রিতে হোস্ট করা যাবে। নিচে সহজ ধাপগুলো দেওয়া হলো:

---

## 📌 অপশন ১: Frontend এবং Backend আলাদাভাবে Vercel-এ ডিপ্লয় করা (সবচেয়ে সহজ ও সেরা উপায়)

---

### ধাপ ১: Backend (Express API) Vercel-এ হোস্ট করা

1. আপনার পুরো প্রজেক্টটি GitHub-এ পুশ করুন।
2. [Vercel Dashboard](https://vercel.com/new)-এ যান এবং আপনার GitHub রিপোজিটরি ইমপোর্ট করুন।
3. **Configure Project** সেকশনে:
   - **Root Directory**: `Edit` বাটনে ক্লিক করে `server` ফোল্ডারটি সিলেক্ট করুন।
   - **Framework Preset**: `Other` সিলেক্ট করুন।
4. **Environment Variables** যোগ করুন:
   - `MONGODB_URI` = `mongodb+srv://shantodev1670_db_user:PsftPU5JBbuYZJGh@cluster0.mongodb.net/qrcode_platform?retryWrites=true&w=majority`
   - `NODE_ENV` = `production`
   - `BASE_URL` = *(ডিপ্লয় হওয়ার পর যে Vercel URL পাবেন, যেমন: `https://your-qr-backend.vercel.app`)*
   - `CLIENT_URL` = *(আপনার Frontend Vercel URL, যেমন: `https://your-qr-client.vercel.app`)*
5. **Deploy** বাটনে ক্লিক করুন।
6. ডিপ্লয় শেষ হলে একটি ব্যাকএন্ড ডোমেইন পাবেন (যেমন: `https://your-qr-backend.vercel.app`)।

---

### ধাপ ২: Frontend (React + Vite) Vercel-এ হোস্ট করা

1. Vercel Dashboard থেকে আবার **Add New Project**-এ ক্লিক করুন এবং একই রিপোজিটরি সিলেক্ট করুন।
2. **Configure Project** সেকশনে:
   - **Root Directory**: `Edit` বাটনে ক্লিক করে `client` ফোল্ডারটি সিলেক্ট করুন।
   - **Framework Preset**: `Vite` অটোমেটিক ডিটেক্ট করবে।
3. **Environment Variables** যোগ করুন:
   - `VITE_API_URL` = *(ধাপ ১-এ পাওয়া ব্যাকএন্ড URL, যেমন: `https://your-qr-backend.vercel.app`)*
   - `VITE_APP_NAME` = `QRFlex`
   - *(যদি Firebase তৈরি থাকে, তাহলে `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID` ইত্যাদি যোগ করুন)*
4. **Deploy** বাটনে ক্লিক করুন।
5. ব্যস! আপনার Frontend লাইভ হয়ে যাবে।

> **💡 SPA Routing নোট:** `client/vercel.json` ফাইলটি ইতিমধ্যে তৈরি করে দেওয়া হয়েছে যাতে পেজ রিফ্রেশ দিলে কোনো 404 Not Found এরর না আসে।

---

## 🔐 Environment Variables তালিকা (Vercel-এ যা যা বসাবেন)

### Backend (`server`) Environment Variables:
| Variable Name | Value / Description |
|---|---|
| `MONGODB_URI` | `mongodb+srv://shantodev1670_db_user:PsftPU5JBbuYZJGh@cluster0.mongodb.net/qrcode_platform?retryWrites=true&w=majority` |
| `NODE_ENV` | `production` |
| `BASE_URL` | আপনার ব্যাকএন্ড ডোমেইন (যেমন: `https://your-qr-backend.vercel.app`) |
| `CLIENT_URL` | আপনার ফ্রন্টএন্ড ডোমেইন (যেমন: `https://your-qr-client.vercel.app`) |

### Frontend (`client`) Environment Variables:
| Variable Name | Value / Description |
|---|---|
| `VITE_API_URL` | আপনার ব্যাকএন্ড ডোমেইন (যেমন: `https://your-qr-backend.vercel.app`) |
| `VITE_APP_NAME` | `QRFlex` |
| `VITE_FIREBASE_API_KEY` | *(Firebase Console থেকে)* |
| `VITE_FIREBASE_PROJECT_ID` | *(Firebase Console থেকে)* |

---

## 🔄 Dynamic QR এর কাজ করার নিয়ম:
যখন কেউ আপনার তৈরি করা ডাইনামিক QR স্ক্যান করবে, সেটি সরাসরি Backend ডোমেইনে (`https://your-backend.vercel.app/q/:slug`) হিট করবে এবং мгণেই কাঙ্ক্ষিত ওয়েবসাইটে 302 Redirect করবে অথবা Wi-Fi পোর্টালে নিয়ে যাবে।
