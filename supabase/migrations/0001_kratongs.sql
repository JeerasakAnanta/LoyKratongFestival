-- แม่น้ำกลางของลอยกระทงออนไลน์
-- เข้าถึงผ่าน route handler ของ Next.js ด้วย service role เท่านั้น
-- เปิด RLS โดยไม่สร้าง policy จึงปิดการเข้าถึงจาก anon/authenticated key ทั้งหมด

create table if not exists public.kratongs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  design      jsonb not null,
  wish        text not null check (char_length(wish) between 1 and 120),
  anon_id     text not null,
  ip_hash     text not null,
  blessings   integer not null default 0,
  reports     integer not null default 0,
  hidden      boolean not null default false
);

create index if not exists kratongs_created_idx on public.kratongs (created_at desc);
create index if not exists kratongs_anon_idx on public.kratongs (anon_id, created_at desc);
create index if not exists kratongs_ip_idx on public.kratongs (ip_hash, created_at desc);

-- บันทึกว่าใครอนุโมทนา/รายงานใบไหนแล้ว กันกดซ้ำ
create table if not exists public.kratong_actions (
  kratong_id  uuid not null references public.kratongs (id) on delete cascade,
  anon_id     text not null,
  kind        text not null check (kind in ('bless', 'report')),
  created_at  timestamptz not null default now(),
  primary key (kratong_id, anon_id, kind)
);

create index if not exists kratong_actions_anon_idx
  on public.kratong_actions (anon_id, created_at desc);

alter table public.kratongs enable row level security;
alter table public.kratong_actions enable row level security;

create or replace function public.bless_kratong(k uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update kratongs set blessings = blessings + 1 where id = k and not hidden;
$$;

-- เพิ่มจำนวนรายงาน และซ่อนอัตโนมัติเมื่อถึง limit_n
create or replace function public.report_kratong(k uuid, limit_n integer)
returns integer
language sql
security definer
set search_path = public
as $$
  update kratongs
     set reports = reports + 1,
         hidden = (reports + 1) >= limit_n
   where id = k
  returning reports;
$$;

revoke all on function public.bless_kratong(uuid) from public, anon, authenticated;
revoke all on function public.report_kratong(uuid, integer) from public, anon, authenticated;

-- ลบกระทงที่เก่ากว่า 7 วัน (เรียกเป็นระยะ เช่น pg_cron)
-- select cron.schedule('prune-kratongs', '0 3 * * *',
--   $$delete from public.kratongs where created_at < now() - interval '7 days'$$);
