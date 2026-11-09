-- Publications: card (image + title) on the website that opens/downloads a PDF.

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text not null,
  pdf_path text not null,
  created_at timestamptz not null default now()
);

-- Users allowed to manage content. Being authenticated is not enough:
-- only users listed here can write (fails closed if signups are left open).
create table public.admins (
  user_id uuid primary key references auth.users on delete cascade
);

alter table public.publications enable row level security;
alter table public.admins enable row level security;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- New tables are not exposed to the Data API by default: grant explicitly.
grant select on public.publications to anon, authenticated;
grant insert, delete on public.publications to authenticated;
grant execute on function public.is_admin() to authenticated;

create policy "Anyone can read publications"
  on public.publications for select
  using (true);

create policy "Admins can insert publications"
  on public.publications for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can delete publications"
  on public.publications for delete to authenticated
  using ((select public.is_admin()));

-- Public bucket: files are readable by URL without a policy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'publications',
  'publications',
  true,
  52428800, -- 50 MB
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
);

create policy "Admins can upload publication files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'publications' and (select public.is_admin()));

-- Delete requires both select and delete on storage.objects.
create policy "Admins can read publication files"
  on storage.objects for select to authenticated
  using (bucket_id = 'publications' and (select public.is_admin()));

create policy "Admins can delete publication files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'publications' and (select public.is_admin()));
