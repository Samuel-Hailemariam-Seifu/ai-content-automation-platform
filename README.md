# ContentFlow

A portfolio-style **AI content automation** dashboard: one brief → blog post, X thread, and LinkedIn copy, with optional Q&A over the output and **simulated** scheduling.

Built with **Next.js (App Router)**, **Supabase** (Auth + Postgres), and **Groq** (OpenAI-compatible chat completions).

Social networks are **not** integrated—no real posting to X, LinkedIn, YouTube, or blogs. Scheduling is stored in the database only for demo purposes.

---

## Features

- **Auth** — Email/password via Supabase Auth; Edge middleware protects `/dashboard`, `/results`, and `/scheduler`; sign out.
- **Dashboard** — Paste an idea or draft; Groq returns structured campaign JSON (blog + 5 tweets + LinkedIn).
- **Results** — Tabs (Blog / Tweets / LinkedIn), copy to clipboard, regenerate per section, “chat with this content.”
- **Scheduler** — List scheduled posts; modal to pick platform (`twitter` | `linkedin` | `blog`) + time (demo only).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| AI | Groq `api.groq.com` OpenAI-compatible chat completions |
| Auth cookies | `@supabase/ssr` |
| Toasts | Sonner |

---

## Prerequisites

- **Node.js** 20+
- A live **[Supabase](https://supabase.com/dashboard)** project (URL must resolve — paused/deleted projects break signup/login)
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

In the Supabase **SQL Editor**, run:

[`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql)

This creates:

| Table | Purpose |
| --- | --- |
| `contents` | User briefs + generated `blog_output`, `tweets_output`, `linkedin_output` |
| `scheduled_posts` | Demo schedule rows (`twitter` / `linkedin` / `blog` + `scheduled_time`) |

Row Level Security is enabled so users only see their own data.

### 3. Environment variables

Copy the example and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from Supabase → **Settings → API** (e.g. `https://xxxx.supabase.co`). Must start with `NEXT_PUBLIC_` for the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | **anon / public** key only — never `service_role`. |
| `GROQ_API_KEY` | Yes | Key from [console.groq.com/keys](https://console.groq.com/keys). |
| `GROQ_MODEL` | No | Default: `llama-3.3-70b-versatile`. |
| `GROQ_CHAT_COMPLETIONS_URL` | No | Default: `https://api.groq.com/openai/v1/chat/completions`. |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | No | Optional server-side fallbacks alongside `NEXT_PUBLIC_*`. |

**Important:**

- Do **not** leave duplicate empty assignments above real values in `.env` — the first value wins.
- After any change to `.env` / `.env.local`, **restart** the dev server (`Ctrl+C`, then `npm run dev`).
- Never commit real `.env` files (they are gitignored).

### 4. Auth (local demos)

Supabase → **Authentication** → **Providers** → **Email**.

For quick local testing you can disable email confirmation, or confirm via the inbox Supabase uses.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Sign up** → **Dashboard** → paste a brief → **Generate campaign**.

---

## Sample brief (for testing)

Paste into the dashboard:

```text
Launching a productivity app for freelancers that blocks distracting sites during focus sessions.
Target: solo founders and remote workers. Tone: practical and encouraging.
Include a short how-it-works section and a clear CTA to join the waitlist.
```

After generation, try chat on the results page:

```text
Make the LinkedIn version shorter and more casual.
```

---

## What generation returns

The `/api/generate` route asks Groq for a single JSON object:

| Key | Shape |
| --- | --- |
| `blog` | Markdown blog post with `##` headings (3+ sections) |
| `tweets` | Exactly 5 strings, each under 280 characters |
| `linkedin` | One professional LinkedIn post |

Invalid model JSON → API error (parsed on the server).

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
2. In **Project → Settings → Environment Variables**, add for **Production** (and Preview if needed):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public only)
   - `GROQ_API_KEY`
3. Deploy.
4. **Redeploy after changing env vars** — `NEXT_PUBLIC_*` values are baked in at build time.
5. Confirm you set vars on the **correct** Vercel project if you have more than one with a similar name.

---

## Routes overview

| Path | Description |
| --- | --- |
| `/` | Landing |
| `/login`, `/signup` | Email/password auth |
| `/dashboard` | Create campaign (protected) |
| `/results/[id]` | View output, chat, schedule modal (protected) |
| `/scheduler` | Scheduled posts list (protected) |
| `POST /auth/signout` | Sign out |
| `POST /api/generate` | Groq generate + save `contents` |
| `POST /api/regenerate` | Regenerate one section |
| `POST /api/chat` | Q&A over campaign |
| `GET` / `POST /api/schedule` | List / create `scheduled_posts` |
| `GET /api/contents` | Recent campaigns (scheduler picker) |

---

## Project layout (high level)

```text
middleware.ts                 # Session refresh + route protection
src/app/                      # App Router pages + API routes
src/components/               # UI (results, chat, schedule modal, …)
src/lib/env.ts                # Env helpers (safe middleware read)
src/lib/groq.ts               # Groq chat completions client
src/lib/prompts.ts            # Generate / regenerate / chat prompts
src/lib/supabase/             # Browser, server, middleware clients
supabase/migrations/          # SQL schema + RLS
```

---

## Troubleshooting

| Issue | What to check |
| --- | --- |
| **`MIDDLEWARE_INVOCATION_FAILED` / 500** on Vercel | Missing or invalid `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` on that Vercel project. Add them and **redeploy**. |
| **`ERR_NAME_NOT_RESOLVED` / `Failed to fetch`** on signup/login | Supabase URL host does not exist (deleted/paused project or typo). Open Supabase dashboard, copy a live **Project URL**, update env, redeploy. |
| **401 / Invalid API key** (Supabase) | Use the **anon public** key — never `service_role`. Restart `next dev` / redeploy. |
| **`Failed to fetch`** (auth) with a valid URL | Client missing `NEXT_PUBLIC_*` vars; or project paused; or need restart after env change. |
| **`model_decommissioned`** (Groq) | Set `GROQ_MODEL` to a supported model — [Groq models](https://console.groq.com/docs/models). |
| **Env not applied** | Env files load at process start only — restart `next dev`. On Vercel, redeploy after edits. |
| **Generate returns error** | Groq key missing/invalid, or model returned non-JSON — check server logs / Network tab for `/api/generate`. |

---

## Notes

- Middleware fails soft when Supabase config is missing (public pages still load; protected routes redirect to login) so a bad deploy does not always hard-crash Edge.
- Campaign JSON is **parsed on the server**; bad model output surfaces as an API error.
- **Do not** commit real `.env` files or expose `service_role` / Groq tokens in client-side code.

---

## License

Use and modify freely for learning and portfolio demos.
