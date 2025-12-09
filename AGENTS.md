# AGENTS.md

## Tech Stack

- OpenAI ChatKit UI
- OpenAI Agents SDK
- Supabase
- Next.js

## Rules

### Always test with playwright in the broswer before stating a task is completge

### Supabase types

ALWAYS run an updated version of the supabase types before writing sql to make sure you are using the most recent schema. this sql needs to be completely redone because there are tables that already exist.

/Users/meganharrison/Documents/github/alleato-procore/.agents/rules/supabase/generate-supabase-types.md


## ExecPlans
 
When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.