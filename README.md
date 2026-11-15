<div align="center">

# 🌸 Selfix Life

### *A soft space for your day*

<br/>

[![Live Demo](https://img.shields.io/badge/🌸_Live_Demo-selfix--omega.vercel.app-e8a0b0?style=for-the-badge&labelColor=1a1a1a)](https://selfix-omega.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=f7c6d0)](https://selfix-omega.vercel.app)

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=1a1a1a)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=1a1a1a)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=1a1a1a)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_+_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=1a1a1a&labelColor=1a1a1a)](https://firebase.google.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Motion-e8a0b0?style=flat-square&labelColor=1a1a1a)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-Charts-c992a2?style=flat-square&labelColor=1a1a1a)](https://recharts.org)
[![License](https://img.shields.io/badge/License-Proprietary-1a1a1a?style=flat-square&labelColor=e8a0b0)](#-license--copyright)

<br/>

**Paint your year in gentle pixels.**  
Track habits, sleep, prayer, focus, and little life moments inside a cozy open-book journal.

[🌐 Open Selfix Life](https://selfix-omega.vercel.app) · [📜 Terms](https://selfix-omega.vercel.app/terms) · [🔒 Privacy](https://selfix-omega.vercel.app/privacy)

</div>

---

## 💗 About Selfix Life

**Selfix Life** is a warm, private year-in-pixels journal — designed to feel like a keepsake book, not a cold productivity dashboard.

Each habit is a soft page in your diary. You paint days on a pastel grid, leave quiet notes beside them, flip between trackers, and watch your year bloom into a colorful mosaic. Whether you’re logging sleep, Salah, water, focus sessions, workouts, or the small wins of an ordinary day, Selfix Life stays gentle, personal, and beautiful.

> ✨ *A soft space for your day, thoughts, and habits.*

Built for people who want reflection without pressure — soft rose mornings, midnight journaling, and a book that remembers you across devices.

---

## 🌷 Key Features

| 🎀 Feature | What you get |
| :--- | :--- |
| **📖 Open-book UI** | Soft page flips, binder tabs, paper texture, and a diary-first layout |
| **🎨 Pastel themes** | **Soft Rose** & **Midnight Soft** — cozy light and night modes |
| **📝 Rich daily logs** | Sleep, Salah & prayer, water, teeth, focus, gym, fruits, energy, day rating & more |
| **🔏 Per-tracker notes** | Notes are scoped to each habit and day — no bleed across pages |
| **📊 Insights Logbook** | Filter one tracker at a time; see real entries, your notes, and one clear chart |
| **⏱️ Focus timer** | Pomodoro-style deep work that can auto-log into your Focus page |
| **🧩 Custom pages** | Show/hide, reorder, and create custom grid trackers in Settings |
| **🎵 Ambient music** | A tiny cozy player while you journal |
| **☁️ Cloud sync** | Firebase Authentication + Cloud Firestore — your journal follows you |
| **🔐 Encrypted notes** | Private notes & narrative fields are AES-encrypted on-device before Firestore |
| **🔐 Secure account** | Email verification, password reset, logout, and legal links on sign-in |

---

## 🌐 Deployment & Live Link

Selfix Life is **live** and deployed on **Vercel**:

### 👉 [https://selfix-omega.vercel.app](https://selfix-omega.vercel.app)

<div align="center">

[![Visit Selfix Life](https://img.shields.io/badge/🌸_Visit_Selfix Life_Live-e8a0b0?style=for-the-badge&labelColor=1a1a1a)](https://selfix-omega.vercel.app)

</div>

Production builds ship from this repository to Vercel. The live app includes the full journal experience: auth, cloud sync, Insights Logbook, Soft Rose / Night themes, and legal pages (`/about`, `/privacy`, `/terms`, `/contact`).

---

## 🛠️ Tech Stack

| Layer | Tools |
| :--- | :--- |
| UI | React 19, Vite 8, Tailwind CSS 4 |
| Motion & icons | Framer Motion, Lucide |
| Charts | Recharts |
| Routing | React Router |
| Backend | Firebase Auth, Cloud Firestore |
| Hosting | Vercel |

---

## 🚀 Quick Start (Developer Guide)

> ⚠️ **Never commit real secrets.** Use `.env.example` as a template only. Keep your private Firebase keys in a local `.env` file (gitignored).

### 1. Clone & install

```bash
git clone <your-repo-url>
cd Tracker
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your Firebase web app credentials (from the Firebase console):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_NOTE_ENCRYPTION_SECRET=
```

Use a long random value for `VITE_NOTE_ENCRYPTION_SECRET` in production. Notes are encrypted client-side with AES before sync; changing this secret later will prevent decrypting previously stored ciphertext.

### 3. Firebase project setup

1. Create a Firebase project  
2. Enable **Email/Password** Authentication  
3. Create a **Cloud Firestore** database  
4. Publish security rules from `firestore.rules`  
5. Add your web app config keys to `.env`  

### 4. Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

```bash
npm run dev       # start Selfix Life locally
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # lint with oxlint
```

---

## 📁 Project Structure (high level)

```text
src/
  components/     # Book UI, trackers, Insights, Auth, Settings
  context/        # Auth + Journal (Firebase sync)
  data/           # Trackers, themes, panel options
  lib/            # Firebase, diary insights, helpers
  pages/          # About, Privacy, Terms, Contact
```

---

## 🖤 Soft Rose · Midnight Soft

Selfix Life ships with two carefully tuned looks:

- **Soft Rose** — warm blush paper, rose accents, daylight journaling  
- **Midnight Soft** — deep ink nights, lavender accents, late-hour calm  

Toggle anytime from the header. Both modes keep the same cozy, rounded, high-end feel.

---

## 📄 Legal

On the live app and in this repo’s routes:

| Page | Path |
| :--- | :--- |
| About | `/about` |
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |
| Contact / FAQ | `/contact` |

By continuing in the product, users agree to the Terms & Privacy linked on the sign-in screen.

---

## ⚖️ License & Copyright

> **Proprietary License & Copyright © 2026 Selfix Life.**  
> All rights reserved.

This software, its design system, visual identity, UX patterns, documentation, and source code are **strictly proprietary**.

**Unauthorized copying, modification, distribution, reverse engineering, republication, sublicensing, or commercial use of this project — in whole or in part, via any medium — is strictly prohibited** without prior written permission from the copyright holder.

Selfix Life is provided for authorized use only. Access to the live demo at [selfix-omega.vercel.app](https://selfix-omega.vercel.app) does **not** grant any license to reuse, fork, or commercialize the codebase, brand, or design.

For licensing inquiries, use the [Contact](https://selfix-omega.vercel.app/contact) page.

---

<div align="center">

<br/>

**🌸 Selfix Life**

*A soft space for your day, thoughts, and habits*

[Live app](https://selfix-omega.vercel.app) · Copyright © 2026 Selfix Life · All rights reserved

<br/>

`■■■■■` soft pixels · warm intention · private by design

</div>
