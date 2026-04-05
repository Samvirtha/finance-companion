
ALTER TABLE public.profiles 
  ADD COLUMN monthly_income numeric DEFAULT 0,
  ADD COLUMN savings_goal numeric DEFAULT 0,
  ADD COLUMN budget_limit numeric DEFAULT 0,
  ADD COLUMN preferred_currency text DEFAULT 'USD',
  ADD COLUMN profile_completed boolean DEFAULT false;
