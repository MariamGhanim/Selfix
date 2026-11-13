# Selfix

### a cozy year-in-pixels journal

Paint your days in soft pastel pixels.  
Track mood, sleep, focus, water, workouts, and little life moments — all inside a sweet open-book diary that feels like a keepsake, not a spreadsheet.

---

## What is Selfix?

**Selfix** is a gentle habit & mood journal.  
Each tracker is a page in your book. Tap chips, log notes, flip pages, and watch your year bloom into a colorful pixel mosaic — saved securely in the cloud with your account.

---

## Features

| | |
| :--- | :--- |
| Open-book UI | Soft page flips, binder tabs, blush pastel themes |
| Rich daily logs | Mood, energy, sleep, focus, fruits, water, gym & more |
| Focus timer | Pomodoro-style sessions that auto-log deep work |
| Ambient music | Tiny cozy YouTube player while you journal |
| Cloud sync | Firebase Auth + Firestore — your journal follows you |
| Secure account | Email verification, password reset, settings & logout |

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
```

---

## Stack

React · Vite · Tailwind · Framer Motion · Lucide · Firebase Auth · Firestore

---

<p align="center">
  <sub>made with soft pixels & warm intention</sub><br/>
  <b>Selfix</b> · your year, one gentle square at a time
</p>
