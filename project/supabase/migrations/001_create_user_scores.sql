
-- Create user_scores table
create table if not exists public.user_scores (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    score integer not null check (score >= 0 and score <= 100),
    entry_date date default current_date,
    created_at timestamptz default timezone('utc'::text, now()) not null,

    -- Ensure one score per user per day
    constraint unique_user_daily_score unique (user_id, entry_date)
);

-- Set up RLS (Row Level Security)
alter table public.user_scores enable row level security;

-- Create policies
create policy "Users can view their own scores"
    on public.user_scores
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own scores"
    on public.user_scores
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own scores"
    on public.user_scores
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create indexes
create index idx_user_scores_user_id on public.user_scores(user_id);
create index idx_user_scores_date on public.user_scores(entry_date);

-- Add comments
comment on table public.user_scores is 'Stores daily productivity scores for users';
comment on column public.user_scores.score is 'Productivity score from 0 to 100';
