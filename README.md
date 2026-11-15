# Selfix

### a soft space for your day

Paint your days in soft pastel pixels.  
Track sleep, prayer, water, focus, workouts, and little life moments — all inside a cozy open-book journal that feels like a keepsake, not a spreadsheet.

---

## What is Selfix?

**Selfix** is a gentle habit & mood journal.  
Each tracker is a page in your book. Tap chips, leave private notes, flip pages, and watch your year bloom into a colorful pixel mosaic — saved securely in the cloud with your account.

---

## Features

| | |
| :--- | :--- |
| Open-book UI | Soft page flips, binder tabs, blush pastel themes |
| Rich daily logs | Sleep, Salah, water, teeth, focus, gym, fruits, energy, day rating & more |
| Per-tracker notes | Notes stay scoped to each habit and day — no bleed between pages |
| Insights Logbook | Filter one tracker at a time; see real entries, your notes, and one clear chart |
| Focus timer | Pomodoro-style sessions that auto-log deep work |
| Custom pages | Show/hide, reorder, and create custom grid trackers in Settings |
| Soft Rose / Night | Two cozy themes with a split-screen auth welcome |
| Ambient music | Tiny cozy YouTube player while you journal |
| Cloud sync | Firebase Auth + Firestore — your journal follows you |
| Secure account | Email verification, password reset, Terms & Privacy links |

---

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

---

## Firebase setup

1. Create a Firebase project and enable **Email/Password** Authentication  
2. Create a **Cloud Firestore** database  
3. Paste your web app keys into `.env`  
4. Publish the rules from `firestore.rules`  

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## Scripts

```bash
npm run dev       # start Selfix locally
npm run build     # production build
npm run preview   # preview the build
npm run lint      # lint with oxlint
```

---

## Stack

React · Vite · Tailwind CSS · Framer Motion · Lucide · Recharts · React Router · Firebase Auth · Firestore

---

## Legal pages

- [/about](/about) — About Selfix  
- [/privacy](/privacy) — Privacy Policy  
- [/terms](/terms) — Terms of Service  
- [/contact](/contact) — Contact & FAQ  

---

<p align="center">
  <sub>A soft space for your day, thoughts, and habits</sub><br/>
  <b>Selfix</b> · your year, one gentle square at a time
</p>
