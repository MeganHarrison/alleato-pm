-- Add descriptive fields to budget_modifications to match the UI form
ALTER TABLE public.budget_modifications
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS modification_type text,
  ADD COLUMN IF NOT EXISTS reason text,
  ADD COLUMN IF NOT EXISTS approver text;
