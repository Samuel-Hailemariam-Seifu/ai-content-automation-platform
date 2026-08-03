# ContentFlow

A portfolio-style **AI content automation** dashboard: one brief → blog post, X thread, and LinkedIn copy, with optional Q&A over the output and **simulated** scheduling. Built with **Next.js (App Router)**, **Supabase** (Auth + Postgres), and **Groq** (OpenAI-compatible chat completions).

Social networks are **not** integrated—scheduling is stored in the database only.

---

## Features

- **Auth** — Email/password via Supabase Auth; middleware protects app routes; sign out.
- **Dashboard** — Paste an idea, generate structured campaign JSON via the HF router.
- **Results** — Tabs (Blog / Tweets / LinkedIn), copy, regenerate per section, “chat with this content.”
- **Scheduler** — List scheduled posts; modal to pick platform + time (demo only).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| AI | Groq `api.groq.com` chat completions |
| Toasts | Sonner |

---

## Prerequisites

- **Node.js** 20+
- A **[Supabase](https://supabase.com)** project
- A **[Groq](https://console.groq.com/keys)** API key

---

## Quick start

### 1. Install

```bash
git clone <your-repo-url>
cd ai-content-automation-platform
npm install
```

### 2. Supabase database

In the Supabase **SQL Editor**, run the migration:

[`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql)

This creates `contents` and `scheduled_posts` and enables Row Level Security.

### 3. Environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL (Settings → API). Must be `NEXT_PUBLIC_` for the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | **anon / public** key only—not `service_role`. |
| `GROQ_API_KEY` | Yes | Groq API key. |
| `GROQ_MODEL` | No | Model id. Default in code: `llama-3.3-70b-versatile`. |
| `GROQ_CHAT_COMPLETIONS_URL` | No | Defaults to `https://api.groq.com/openai/v1/chat/completions`. |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | No | Optional; server code can use these as fallbacks alongside `NEXT_PUBLIC_*`. |

**Important:** After any change to `.env` or `.env.local`, **restart** the dev server (`Ctrl+C`, then `npm run dev`).

### 4. Auth (local demos)

Supabase → **Authentication** → **Providers** → **Email** — for quick testing you can disable email confirmation, or confirm the inbox Supabase uses.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign up → **Dashboard** → **Generate campaign**.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

---

## Deploy on Vercel

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. Add the same variables as in `.env.local` in **Project → Settings → Environment Variables** (include every `NEXT_PUBLIC_*` value).
3. Deploy. Redeploy after changing env vars.

---

## Routes overview

| Path | Description |
| --- | --- |
| `/` | Landing |
| `/login`, `/signup` | Email/password |
| `/dashboard` | Create campaign |
| `/results/[id]` | View output, chat, schedule modal |
| `/scheduler` | Scheduled posts list + schedule modal |
| `POST /auth/signout` | Sign out |
| `POST /api/generate` | HF + save `contents` |
| `POST /api/regenerate` | Regenerate one section |
| `POST /api/chat` | Q&A over campaign |
| `GET` / `POST /api/schedule` | List / create `scheduled_posts` |
| `GET /api/contents` | Recent campaigns (for scheduler picker) |

---

## Troubleshooting

| Issue | What to check |
| --- | --- |
| **401 / Invalid API key** (Supabase) | Use the **anon public** key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`, never the service role secret. Restart `next dev`. |
| **`Failed to fetch`** (auth) | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be set for the client; project not paused. |
| **`model_decommissioned`** (Groq) | Set `GROQ_MODEL` to a currently supported model — see [Groq's model list](https://console.groq.com/docs/models). |
| **Env not applied** | Only `.env`, `.env.local`, etc. loaded at process start—always restart the dev server. |

---

## Notes

- Campaign JSON is **parsed on the server**; if the model returns invalid JSON, the API returns an error.
- **Do not** commit real `.env` files or expose `service_role` / Groq tokens in client-side code.

---

## License

Use and modify freely for learning and portfolio demos.
