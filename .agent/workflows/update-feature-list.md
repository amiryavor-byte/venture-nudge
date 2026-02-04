---
description: How to update the Venture Nudge feature list
---

# Update Feature List Workflow

This workflow guides you through auditing and updating the comprehensive Venture Nudge feature list.

## When to Run This Workflow

- After implementing new features
- After modifying existing features
- After deprecating/removing features
- Before investor presentations or product demos
- Quarterly (Q1, Q2, Q3, Q4) for full verification

---

## Workflow Steps

### 1. Review the Maintenance Guide

Read the complete maintenance guide:
```bash
cat /Users/amir/.gemini/antigravity/knowledge/venture_nudge/artifacts/maintenance/feature_list_maintenance.md
```

### 2. Research Current Codebase State

// turbo
Count all pages:
```bash
find /Users/amir/Documents/ai\ workspace/Businessplanner/src/app -name "page.tsx" | wc -l
```

// turbo
Count all components:
```bash
find /Users/amir/Documents/ai\ workspace/Businessplanner/src/components -name "*.tsx" | wc -l
```

// turbo
Count database tables:
```bash
grep -c "sqliteTable" /Users/amir/Documents/ai\ workspace/Businessplanner/src/db/schema.ts
```

// turbo
Count API routes:
```bash
find /Users/amir/Documents/ai\ workspace/Businessplanner/src/app/api -name "route.ts" | wc -l
```

// turbo
List server actions:
```bash
find /Users/amir/Documents/ai\ workspace/Businessplanner/src/app/actions -name "*.ts"
```

### 3. Review Key Files

View the database schema:
```bash
cat /Users/amir/Documents/ai\ workspace/Businessplanner/src/db/schema.ts
```

Check the ROADMAP for planned features:
```bash
cat /Users/amir/Documents/ai\ workspace/Businessplanner/ROADMAP.md
```

Review package.json for technology stack:
```bash
cat /Users/amir/Documents/ai\ workspace/Businessplanner/package.json
```

### 4. Compare with Current Feature List

Open the current feature list:
```bash
cat /Users/amir/.gemini/antigravity/knowledge/venture_nudge/artifacts/features/complete_feature_list.md
```

Identify:
- ✅ Features that exist but aren't documented
- ❌ Features that are documented but don't exist
- 🔄 Features that have changed

### 5. Update the Feature List

Edit the feature list at:
`/Users/amir/.gemini/antigravity/knowledge/venture_nudge/artifacts/features/complete_feature_list.md`

- Add new features in the appropriate category
- Remove deprecated features
- Update modified feature descriptions
- Update the "Last Updated" date at the top
- Update the "Feature Summary by Category" table

### 6. Verify Changes

Review your changes:
```bash
git diff /Users/amir/.gemini/antigravity/knowledge/venture_nudge/artifacts/features/complete_feature_list.md
```

Spot-check 3-5 features to ensure they work as described.

### 7. Request User Review

Present the updated feature list to the user for final verification, especially if:
- Major features were added/removed
- Multiple categories were affected
- User requested the update for a specific purpose (demo, presentation, etc.)

---

## Tips

- **Be thorough**: Search the entire codebase, don't rely on memory
- **Be specific**: Include technical details (e.g., "SQLite + Drizzle ORM")
- **Be accurate**: Only list features that actually exist and work
- **Be current**: Update the date and statistics
- **Be organized**: Keep features grouped logically within categories

---

## Quick Verification Commands

**Check if a feature exists:**
```bash
# For a page
ls -la /Users/amir/Documents/ai\ workspace/Businessplanner/src/app/<route>/page.tsx

# For a component
ls -la /Users/amir/Documents/ai\ workspace/Businessplanner/src/components/<component>.tsx

# For an API route
ls -la /Users/amir/Documents/ai\ workspace/Businessplanner/src/app/api/<route>/route.ts
```

**Search for feature implementation:**
```bash
grep -r "feature_name" /Users/amir/Documents/ai\ workspace/Businessplanner/src
```
