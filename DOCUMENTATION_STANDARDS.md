# Documentation Standards

**Purpose:** Prevent future documentation clutter and maintain organization

**Created:** 2025-11-17 (Housekeeping Phase 4)

---

## Before Creating New Documentation

### 1. Search First (MANDATORY)

Before creating any new markdown file:

```bash
# Check the documentation index
cat docs/00-INDEX.md

# Search existing files
grep -r "your topic" .

# Check archive for historical docs
grep -r "your topic" archive/
```

**Rule:** If documentation exists, UPDATE it. Don't create duplicate.

### 2. Choose the Right Location

| Content Type | Location | Example |
|--------------|----------|---------|
| Quick reference | Root | `QUICK_START.md` |
| Feature documentation | Root or `docs/FEATURES/` | `MUSINGS_QUICK_START.md` |
| Technical architecture | Root | `ARCHITECTURE.md`, `CMS_TECHNICAL_ARCHITECTURE.md` |
| Detailed guides | `docs/` | `docs/DEPLOYMENT-GUIDE.md` |
| Specifications | `docs/SPECIFICATIONS/` | `docs/SPECIFICATIONS/SPEC-001-musings.md` |
| Historical/completed | `docs/archive/` | `docs/archive/iterations/iteration-6/` |

### 3. Follow Naming Conventions

#### DO:
- ✅ `FEATURE_NAME.md` (concise, descriptive)
- ✅ `FEATURE_GUIDE.md` (for how-to documents)
- ✅ `ITERATION_N_COMPLETE.md` (single completion file)
- ✅ `TOPIC_ARCHITECTURE.md` (architecture docs)

#### DON'T:
- ❌ `FEATURE_COMPLETE_SUMMARY_FINAL_v2.md` (redundant suffixes)
- ❌ `feature.md` (use UPPERCASE for visibility)
- ❌ `temp_notes.md` (no temporary docs in repo)
- ❌ `doc1.md`, `doc2.md` (non-descriptive names)

---

## Iteration Completion Process

When completing an iteration:

### Step 1: Create Single Completion Report
```markdown
# File: ITERATION_N_COMPLETE.md

## Summary
[One-paragraph summary of iteration]

## What Was Accomplished
- Feature 1
- Feature 2
- Bug fixes

## Testing Results
[Link to validation report]

## Next Steps
[What's next]
```

### Step 2: Archive Intermediate Reports

```bash
# Create iteration archive
mkdir -p docs/archive/iterations/iteration-N

# Move daily/phase reports
mv ITERATION_N_DAY_*.md docs/archive/iterations/iteration-N/
mv ITERATION_N_PHASE_*.md docs/archive/iterations/iteration-N/

# Keep only final completion report at root
# ITERATION_N_COMPLETE.md stays at root
```

### Step 3: Update Documentation Index

```bash
# Add to docs/00-INDEX.md under "Iterations & Progress"
```

### Step 4: Git Tag

```bash
git tag -a iteration-N-complete -m "Iteration N: [summary]"
```

---

## Session Summaries

### When to Create
- Multi-day work sessions
- Significant milestones
- Handoffs between AI agents or developers

### Naming
- `SESSION_NNN_COMPLETE.md` (numbered)
- `SESSION_SUMMARY_YYYY-MM-DD.md` (dated)

### Archiving
Move to `docs/archive/sessions/` after 30 days or when no longer actively referenced.

---

## Documentation Deprecation

When a document becomes outdated:

### Step 1: Add Deprecation Header

```markdown
---
status: deprecated
replaced-by: [New Documentation](link/to/new/doc.md)
deprecated-date: YYYY-MM-DD
---

⚠️ **DEPRECATED:** This document has been superseded by [New Documentation](link).

For current information, see: [New Documentation](link)

---

[Original content below for historical reference]
```

### Step 2: Update References

Update any documents that link to the deprecated file:
```bash
# Find references
grep -r "DEPRECATED_FILE.md" .

# Update to point to new file
```

### Step 3: Archive After 90 Days

```bash
# After 90 days, move to archive
mv DEPRECATED_FILE.md docs/archive/deprecated-YYYY-MM/
```

---

## File Type Guidelines

### Quick Starts (`*_QUICK_START.md`)
- Single-page getting started guides
- Target: New users or specific feature
- Location: Root directory
- Length: 1-3 pages maximum

### Guides (`*_GUIDE.md`)
- Comprehensive how-to documentation
- Target: Users who need detailed instructions
- Location: Root or `docs/`
- Length: Variable (can be long)

### Architecture (`*_ARCHITECTURE.md`)
- Technical design documentation
- Target: Developers and architects
- Location: Root
- Length: Detailed technical specs

### Reports (`*_REPORT.md`)
- Status, analysis, or completion reports
- Target: Project stakeholders
- Location: Root (current) or `docs/archive/` (historical)
- Length: Variable

### Specifications (`SPEC-NNN-*.md`)
- Formal feature specifications
- Target: Developers and product managers
- Location: `docs/SPECIFICATIONS/`
- Naming: `SPEC-NNN-feature-name.md` (numbered)

---

## Consolidation Rules

### When to Consolidate

Consolidate ONLY when:
- ✅ >90% content overlap (true duplicates)
- ✅ Same topic, same audience, different files
- ✅ One clearly supersedes the other

### When NOT to Consolidate

Keep separate when:
- ❌ Different audiences (developers vs content managers)
- ❌ Different purposes (quick start vs detailed guide)
- ❌ Historical value (shows evolution of thinking)
- ❌ <70% overlap (not true duplicates)

### Consolidation Process

1. **User Approval Required** - Never consolidate without review
2. **Preserve Attribution** - Note source files in consolidated doc
3. **Keep Originals** - Archive originals for 90 days minimum
4. **Update Links** - Find and update all references
5. **Test** - Verify all links still work

---

## Archive Guidelines

### What to Archive

Move to `docs/archive/` when:
- ✅ Work is completed (iteration reports, phase docs)
- ✅ Document is superseded (deprecated)
- ✅ Historical value but not actively referenced
- ✅ Test artifacts >7 days old

### Archive Structure

```
docs/archive/
├── iterations/
│   ├── iteration-1/
│   ├── iteration-2/
│   └── ...
├── sessions/
│   ├── 2025-10/
│   └── 2025-11/
├── validation-reports/
├── test-artifacts-YYYY-MM/
└── deprecated-YYYY-MM/
```

### Archive Retention

| Type | Retention Period |
|------|------------------|
| Test artifacts | 6 months |
| Session reports | 1 year |
| Iteration reports | 2 years |
| Deprecated docs | 2 years |
| Crisis/incident docs | Forever |
| Strategic planning | Forever |

---

## Quality Standards

### Every Document Should Have:

1. **Clear Title** - Descriptive filename
2. **Purpose Statement** - Why this doc exists
3. **Date** - When created/last updated
4. **Audience** - Who should read this
5. **Content** - Well-organized information
6. **Links** - Properly formatted markdown links

### Example Header

```markdown
# Feature Name Documentation

**Purpose:** [One sentence purpose]
**Audience:** [Developers/Content Managers/All]
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD

---

[Content starts here]
```

---

## Monthly Housekeeping

### First of Each Month

1. **Count root files:**
   ```bash
   find . -maxdepth 1 -name "*.md" | wc -l
   ```
   **Target:** <50 files

2. **Identify stale reports:**
   ```bash
   find . -maxdepth 1 -name "*_COMPLETE*.md" -mtime +60
   ```
   Archive if >60 days old

3. **Check for duplicates:**
   - Review similar filenames
   - Consolidate if truly duplicate

4. **Update index:**
   - Add new docs to `docs/00-INDEX.md`
   - Remove archived docs from index

---

## Anti-Patterns to Avoid

### ❌ Multiple Completion Markers
```
FEATURE_COMPLETE.md
FEATURE_COMPLETE_SUMMARY.md
FEATURE_IMPLEMENTATION_COMPLETE.md
FEATURE_FINAL_COMPLETE.md  ← NO!
```

**Instead:** One file - `FEATURE_COMPLETE.md`

### ❌ Iteration Depth Explosion
```
ITERATION_6_DAY_1.md
ITERATION_6_DAY_2.md
ITERATION_6_DAY_3.md
ITERATION_6_DAY_4.md
ITERATION_6_DAY_5.md
ITERATION_6_FINAL_REPORT.md  ← Archive days 1-5
```

**Instead:** Daily reports in archive/, only final at root

### ❌ Version Suffixes in Filenames
```
GUIDE_v1.md
GUIDE_v2.md
GUIDE_final.md
GUIDE_final_reviewed.md  ← NO!
```

**Instead:** Use git history for versions, one filename

### ❌ Temporary Files in Repo
```
temp_notes.md
scratch.md
TODO.md
draft.md  ← NO!
```

**Instead:** Use `.md` files in gitignore or editor scratch pads

---

## Integration with Development Workflow

### Feature Development

```
1. Create spec (optional):
   docs/SPECIFICATIONS/SPEC-NNN-feature-name.md

2. Implement feature
   [Code work]

3. Single completion doc:
   FEATURE_NAME_COMPLETE.md

4. Update index:
   docs/00-INDEX.md

5. Git tag:
   git tag -a feature-name-v1.0
```

### Bug Fixes

```
1. No new documentation needed for small fixes
2. For significant fixes:
   - Update existing feature documentation
   - Note fix in git commit message
3. For critical fixes:
   - Create SECURITY_FIX_SUMMARY.md if security-related
   - Otherwise update relevant docs
```

### Testing

```
1. Test results:
   - Archive after 7 days
   - Don't commit to git (add to .gitignore)

2. Test strategy docs:
   - Keep at root or docs/
   - Update as strategy evolves
   - Don't create new doc per test run
```

---

## Tools & Scripts

### Check Root File Count

```bash
#!/bin/bash
# check-root-docs.sh

COUNT=$(find . -maxdepth 1 -name "*.md" | wc -l)
echo "Root markdown files: $COUNT"

if [ $COUNT -gt 75 ]; then
  echo "⚠️  WARNING: Exceeds recommended limit (50)"
  echo "Consider archiving old reports"
elif [ $COUNT -gt 50 ]; then
  echo "⚠️  NOTICE: Approaching limit (target: <50)"
else
  echo "✓ Within healthy range"
fi
```

### Find Duplicate Filenames

```bash
#!/bin/bash
# find-duplicates.sh

# Find similar names
find . -name "*.md" | sed 's/_COMPLETE.*//' | sed 's/_SUMMARY.*//' | sort | uniq -d
```

---

## Summary: Key Principles

1. **Search before creating** - Avoid duplicates
2. **One topic = one file** - Consolidate only true duplicates
3. **Clear naming** - Descriptive, no version suffixes
4. **Right location** - Use directory structure intentionally
5. **Archive completed work** - Keep root clean
6. **Update the index** - Maintain docs/00-INDEX.md
7. **Git tags for milestones** - Use version control properly
8. **Monthly housekeeping** - Regular maintenance prevents accumulation

---

## Questions?

- **Where does this go?** → See "Choose the Right Location" above
- **Can I consolidate?** → See "Consolidation Rules" above
- **How to deprecate?** → See "Documentation Deprecation" above
- **When to archive?** → See "Archive Guidelines" above

---

**Standards Maintained By:** Development Team + AI Agents
**Review Schedule:** Quarterly (Jan 1, Apr 1, Jul 1, Oct 1)
**Next Review:** 2026-01-01

*Following these standards prevents the accumulation of duplicate and outdated documentation.*
