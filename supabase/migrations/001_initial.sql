-- Run in Supabase SQL Editor or via CLI after linking a project.

create extension if not exists "pgcrypto";

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input_text text not null,
  blog_output text,
  tweets_output jsonb default '[]'::jsonb,
  linkedin_output text,
  created_at timestamptz not null default now()
);

create table public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents (id) on delete cascade,
  platform text not null check (platform in ('twitter', 'linkedin', 'blog')),
  scheduled_time timestamptz not null,
  created_at timestamptz not null default now()
);

create index scheduled_posts_scheduled_time_idx on public.scheduled_posts (scheduled_time);
create index contents_user_id_idx on public.contents (user_id);

alter table public.contents enable row level security;
alter table public.scheduled_posts enable row level security;

create policy "Users manage own contents"
  on public.contents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage schedules for own content"
  on public.scheduled_posts
  for all
  using (
    exists (
      select 1
      from public.contents c
      where c.id = content_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.contents c
      where c.id = content_id and c.user_id = auth.uid()
    )
  );
