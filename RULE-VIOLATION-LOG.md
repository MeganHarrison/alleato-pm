# RULE VIOLATION LOG

> **Purpose**: Track all rule violations to identify patterns and prevent future occurrences.
> **Requirement**: ALL identified rule violations MUST be logged here immediately upon discovery.

## Value of This Log

1. **Pattern Recognition**: Identifies recurring issues to address systemically
2. **Training Data**: Helps AI agents learn from past mistakes
3. **Accountability**: Creates a transparent record of compliance issues
4. **Continuous Improvement**: Enables refinement of rules and processes
5. **Context Preservation**: Provides historical context for future development

## How This Prevents Future Violations

- **Pre-work Review**: AI agents should review this log before starting tasks
- **Rule Reinforcement**: Each violation serves as a learning example
- **Process Refinement**: Patterns reveal where rules need clarification
- **Automated Checks**: Violations can inform new validation scripts

## Violation Entry Format

```
### [Date] [Time] - [Rule Category]
**Rule Violated**: [Specific rule that was broken]
**File(s) Affected**: [List of files]
**Description**: [What happened]
**Root Cause**: [Why it happened]
**Impact**: [Consequences of the violation]
**Prevention**: [How to prevent this in future]
**Agent/User**: [Who made the change]
```

---

## Logged Violations

### 2025-12-11 02:57 - Documentation Update
**Rule Violated**: EXEC_PLAN.md must be updated after completing tasks
**File(s) Affected**: EXEC_PLAN.md
**Description**: EXEC_PLAN.md was not updated after tasks were completed
**Root Cause**: Missing post-task documentation step
**Impact**: Project status out of sync with actual progress
**Prevention**: Add EXEC_PLAN.md update to task completion checklist
**Agent/User**: Unknown
