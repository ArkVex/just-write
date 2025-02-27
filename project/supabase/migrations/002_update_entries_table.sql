alter table public.entries add column if not exists productivity_score integer;
alter table public.entries add column if not exists key_accomplishments text[];
alter table public.entries add column if not exists areas_for_improvement text[];
alter table public.entries add column if not exists actionable_tips text[];
