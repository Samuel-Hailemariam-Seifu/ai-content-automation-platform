# ContentFlow — AI Content Automation (MVP)

Next.js (App Router) dashboard that turns one brief into a blog post, an X thread, and LinkedIn copy using the Hugging Face Inference API, with Supabase Auth + PostgreSQL and simulated scheduling.

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Hugging Face](https://huggingface.co) access token with inference access

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Supabase database**

   In the Supabase SQL editor, run `supabase/migrations/001_initial.sql` to create `contents` and `scheduled_posts` with Row Level Security.

3. **Auth (demo-friendly)**

   In Supabase → Authentication → Providers → Email, consider disabling “Confirm email” for local demos, or confirm the address Supabase sends to.

4. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API (required for the browser client).
   - `SUPABASE_URL` / `SUPABASE_ANON_KEY` — optional duplicates; server code falls back to the `NEXT_PUBLIC_*` values.
   - `HUGGINGFACE_API_KEY` — [token settings](https://huggingface.co/settings/tokens).
   - `HUGGINGFACE_MODEL` — optional; default is `mistralai/Mistral-7B-Instruct-v0.2`. If cold-start or model access errors occur, pick another **Inference API–compatible** text model you are allowed to call.

5. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000), sign up, then use **Dashboard** → **Generate Campaign**.

## Deploy on Vercel

1. Push the repo to GitHub and import the project in Vercel.
2. Add the same environment variables in the Vercel project settings (include all `NEXT_PUBLIC_*` values).
3. Deploy. No real social posting is performed; scheduling is stored in Supabase only.

## Project map

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/login`, `/signup` | Supabase email/password |
| `/dashboard` | Input + generate |
| `/results/[id]` | Tabs, copy/regenerate, chat, schedule modal |
| `/scheduler` | List of simulated scheduled posts |
| `/api/generate`, `/api/regenerate`, `/api/chat`, `/api/schedule` | Server routes calling HF + Supabase |

## Notes

- Free-tier Hugging Face inference can be slow or return loading errors on cold start; retries are normal for demos.
- JSON-shaped campaign output is parsed server-side; malformed model output surfaces as an error toast.
- Social APIs are intentionally not integrated.
