-- Music Survey: 응답 저장 테이블
create extension if not exists "pgcrypto";

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  response_id text not null unique,
  submitted_at timestamptz not null,
  student_id text not null default '',
  student_name text not null default '',
  student_class smallint,
  student_group smallint,
  started_at timestamptz,
  reactions jsonb not null default '[]'::jsonb,
  favorites jsonb not null default '[]'::jsonb,
  app_version text not null default 'music_survey_v1',
  mode text not null default 'stable',
  sheet_sync_status text not null default 'pending'
    check (sheet_sync_status in ('pending', 'syncing', 'synced', 'failed', 'skipped')),
  sheet_sync_error text,
  sheet_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_survey_responses_submitted_at
  on public.survey_responses (submitted_at desc);

create index if not exists idx_survey_responses_student_id
  on public.survey_responses (student_id);

create index if not exists idx_survey_responses_sheet_sync_status
  on public.survey_responses (sheet_sync_status)
  where sheet_sync_status in ('pending', 'failed');

create or replace function public.set_survey_responses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_survey_responses_updated_at on public.survey_responses;
create trigger trg_survey_responses_updated_at
  before update on public.survey_responses
  for each row execute function public.set_survey_responses_updated_at();

alter table public.survey_responses enable row level security;

comment on table public.survey_responses is 'Music Survey 설문 응답 (서버 API 경유만 저장)';
