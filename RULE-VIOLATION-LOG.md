# RULE-VIOLATION-LOG

## 2025-12-15T00:00Z – Secret Output Exposure
- **Rule**: CLAUDE.md §10 – Must not expose secrets; log all violations.
- **Description**: Ran `rg -n "SUPABASE" .env` to inspect env variable names and the command echoed live Supabase credentials to the console output.
- **Files/Commands**: `.env` (read), terminal command `rg -n "SUPABASE" .env`.
- **Impact**: Secrets were displayed in the workspace command output buffer, increasing risk of leaking keys in logs or transcripts.
- **Root Cause**: Attempted to confirm env variable names without considering that ripgrep would print full line contents, including sensitive values.
- **Mitigation / Prevention**: Use `rg --no-filename --no-line-number -o` or `cut -d '=' -f 1` when inspecting env files, or open file via editor and manually redact values before logging. Avoid commands that print secret values.
