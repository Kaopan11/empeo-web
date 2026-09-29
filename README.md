# 📌 empeo-web

> Next.js UI for Empeo: HR fairness dashboard, manager evaluations, and
> employee results after HR publishes the review cycle.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)

---

## 📖 Table of Contents

- [Live & design](#-live--design)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages](#-pages)
- [Website flow](#-website-flow)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🔗 Live & design

| | URL |
|---|---|
| **Web (prod)** | [https://empeo-web.vercel.app/hr](https://empeo-web.vercel.app/hr) |
| **API (prod)** | [https://empeo-api.onrender.com](https://empeo-api.onrender.com) |
| **Figma** | [empo-prototype](https://www.figma.com/design/IQl2G0gFCmEnfiSjPr1FC1/empo-prototype?t=C2si2JRYCETkCDjE-1) |
| **Repo** | [Kaopan11/empeo-web](https://github.com/Kaopan11/empeo-web) |

The app talks to empeo-api. If the API is on Render free tier, the first
request after sleep can be slow.

---

## ✨ Features

- Role switcher (HR, managers, employees) for the classroom demo
- **HR:** coverage, distribution, manager bias, talent table, publish, resolve overdue
- **Manager:** team sidebar with live status, save draft, submit (poll/refetch)
- **Employee:** results only when the cycle is published and their review is submitted
- Form validation (Zod + react-hook-form), including leniency feedback when both scores are 5

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **API client:** axios
- **Forms:** react-hook-form, Zod
- **UI:** shadcn / Base UI, lucide-react
- **Backend:** [empeo-api](https://github.com/Kaopan11/empeo-api) + Supabase (via the API)

---

## 📁 Project Structure

```text
empeo-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # redirects to /hr
│   │   ├── hr/page.tsx
│   │   ├── hr/calibration-guide/
│   │   ├── manager/page.tsx
│   │   └── employee/page.tsx
│   ├── components/               # app-shell, ui
│   ├── lib/                      # api helpers, forms, role-switcher
│   └── types/
├── .env.local.example
└── package.json
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, empeo-api running (local or prod).

```bash
git clone https://github.com/Kaopan11/empeo-web.git
cd empeo-web
npm install
cp .env.local.example .env.local
```

```bash
npm run dev     # http://localhost:3000 → /hr
npm run lint
npm run build
```

For a full local stack, run empeo-api on port 4000 and keep
`NEXT_PUBLIC_API_URL=http://localhost:4000`.

---

## 🔐 Environment Variables

Copy from `.env.local.example`. **Do not commit `.env.local`.**

| Name | Required | Description |
|------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | no | API origin, no trailing slash (default `http://localhost:4000`) |
| `NEXT_PUBLIC_CYCLE_ID` | no | Demo cycle UUID (default H2 2026 seed id) |

Production web should set `NEXT_PUBLIC_API_URL=https://empeo-api.onrender.com`.

Never put the Supabase **service role** in this repo.

---

## 📄 Pages

| Path | Description |
|------|-------------|
| `/` | Redirects to `/hr` |
| `/hr` | Fairness & analytics, publish, overdue |
| `/hr/calibration-guide` | Calibration copy |
| `/manager` | Team reviews, save/submit |
| `/employee` | Published review for the selected employee |

Demo users (Nicha, Somchai, Wichai, Alice, Ivy, Hiro) are chosen in the header.
HR publish and employee review send `x-user-id` from that actor.

---

## 🔁 Website flow

This is a **demo walkthrough**, not a login app. Open
[the live site](https://empeo-web.vercel.app/hr). Use the **header dropdown**
to become HR, a manager, or an employee. The page changes with the person.

```text
  Open site
      │
      ▼
  /  →  /hr   (always lands on HR first)
      │
      ├── dropdown: Nicha     →  stay on /hr
      ├── dropdown: Somchai   →  /manager   (Engineering team)
      ├── dropdown: Wichai    →  /manager   (Sales team)
      └── dropdown: Alice / Ivy / Hiro  →  /employee
```

Walk it in this order on the seeded demo:

### 1. You are a manager — fill a review

1. Dropdown → **Manager · Somchai**.
2. You see the team on the left (Pending / Draft / Submitted / Overdue).
3. Click someone who is **Pending** or **Draft**.
4. Score Technical and Collaboration (1–5). **Save draft** → badge becomes Draft. **Submit evaluation** → Submitted. The counter “X of Y submitted” goes up (no refresh).
5. Click someone **Submitted** or **Overdue** — buttons are off. Overdue says HR will follow up.

Same idea for **Wichai** (Sales).

### 2. You are HR — calibrate and publish

1. Dropdown → **HR · Nicha**. You are on `/hr`.
2. Read the numbers: how many submitted, in progress, overdue; High / Core / Low; who looks too lenient or too strict.
3. Optional: **Resolve overdue** if Hiro or Owen is still Overdue (they go back to Draft if there are no scores).
4. When you are ready, **Publish cycle**. The header says **Cycle published**.

Until you publish, employees cannot see scores.

### 3. You are an employee — see the result (or a wait screen)

1. Dropdown → **Employee · Alice** (or Ivy).
2. **Before publish:** wait screen (cycle not published).
3. **After publish + their review is Submitted:** scores, tier, feedback.
4. Try **Hiro** after publish: if HR has not submitted him, you still wait (“manager has not submitted”).

```text
  Manager scores people
           │
           ▼
  HR checks fairness  →  Publish
           │
           ▼
  Employee opens /employee  →  sees review
           │
           └── if not published or not submitted → wait message
```


---

## 🚢 Deployment

Hosted on **Vercel**.

1. Import `Kaopan11/empeo-web`
2. Set `NEXT_PUBLIC_API_URL` to the Render API URL
3. Optional: `NEXT_PUBLIC_CYCLE_ID`

No `Dockerfile` / `vercel.json` in-repo; Vercel uses Next.js defaults.

---

## 👤 Author

[Kaopan11](https://github.com/Kaopan11) — API: [empeo-api](https://github.com/Kaopan11/empeo-api)
