-- 두꺼비통신 홍보 사이트: 초기 스키마, RLS, 스토리지, 시드
-- Supabase 대시보드 > SQL Editor에 전체를 붙여 넣고 한 번 실행한다.

-- ───────────────────────── 운영자 판별 ─────────────────────────
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- ───────────────────────── 테이블 ─────────────────────────
create table public.store_info (
  id smallint primary key default 1 check (id = 1),
  phone text not null default '',
  instagram_id text not null default 'duggeobi_mobile',
  road_address text not null default '',
  detail_address text not null default '',
  lat double precision,
  lng double precision,
  parking text not null default '',
  transit text not null default '',
  visit_items text not null default '',
  business_name text not null default '두꺼비통신',
  owner_name text not null default '',
  business_reg_no text not null default '',
  preapproval_text text not null default '',
  updated_at timestamptz not null default now()
);

-- weekday: 0 = 일요일 ... 6 = 토요일
create table public.business_hours (
  weekday smallint primary key check (weekday between 0 and 6),
  open_time time,
  close_time time,
  closed boolean not null default false
);

create table public.phones (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  category text not null default '',
  name text not null check (length(name) > 0),
  summary text not null default '',
  price_text text not null default '',
  image_path text,
  hidden boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.notices (
  kind text primary key check (kind in ('top', 'campaign')),
  title text not null default '',
  body text not null default '',
  hidden boolean not null default false
);

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  price_mode text not null default 'consult' check (price_mode in ('consult', 'public'))
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger phones_touch before update on public.phones
  for each row execute function public.touch_updated_at();
create trigger store_info_touch before update on public.store_info
  for each row execute function public.touch_updated_at();

-- ───────────────────────── 권한 (RLS) ─────────────────────────
alter table public.admins enable row level security;
alter table public.store_info enable row level security;
alter table public.business_hours enable row level security;
alter table public.phones enable row level security;
alter table public.notices enable row level security;
alter table public.settings enable row level security;

revoke all on public.admins from anon, authenticated;
grant select on public.store_info, public.business_hours, public.phones, public.notices, public.settings
  to anon, authenticated;
grant insert, update, delete on public.store_info, public.business_hours, public.phones, public.notices, public.settings
  to authenticated;

-- 고객(비로그인 포함): 읽기만. 숨김 항목은 보이지 않는다.
create policy "public read" on public.store_info for select using (true);
create policy "public read" on public.business_hours for select using (true);
create policy "public read" on public.settings for select using (true);
create policy "public read visible" on public.phones for select using (not hidden);
create policy "public read visible" on public.notices for select using (not hidden);

-- 운영자: 전체 읽기·쓰기 (숨김 항목 포함)
create policy "admin all" on public.store_info for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.business_hours for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.phones for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin all" on public.notices for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ───────────────────────── 사진 저장소 ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('phones', 'phones', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "admin upload phones" on storage.objects for insert to authenticated
  with check (bucket_id = 'phones' and (select public.is_admin()));
create policy "admin update phones" on storage.objects for update to authenticated
  using (bucket_id = 'phones' and (select public.is_admin()));
create policy "admin delete phones" on storage.objects for delete to authenticated
  using (bucket_id = 'phones' and (select public.is_admin()));

-- ───────────────────────── 시드 ─────────────────────────
insert into public.store_info (id) values (1);
insert into public.settings (id) values (1);
insert into public.business_hours (weekday) select generate_series(0, 6);
insert into public.notices (kind, title, body, hidden) values
  ('top', '', '', false),
  ('campaign', '헌 폰 줄게, 새 폰 다오', '쓰던 폰을 반납하고 새 폰으로 바꿔 보세요.', false);
