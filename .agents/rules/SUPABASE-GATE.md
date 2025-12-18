### EXECUTION GATE: SUPABASE TYPES FIRST (MANDATORY)

Triggered by ANY task involving:

- Supabase
- SQL
- Postgres
- Tables
- Columns
- RLS
- Migrations
- Backend data access
- API routes touching the database

#### REQUIRED ORDER (NON-NEGOTIABLE)

Claude MUST perform the following IN THIS ORDER:

1. Generate Supabase types (or confirm they already exist)
2. READ the generated types
3. Verify table names, columns, relationships from types
4. ONLY THEN write code

Claude MUST NOT:

- Write SQL before reading types
- Reference tables or columns not present in types
- Infer schema from memory
- “Fix forward” schema mistakes in code

If types do not exist, Claude MUST STOP and ask to generate them.

This gate CANNOT be bypassed.

Canonical reference: