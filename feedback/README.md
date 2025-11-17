# Feedback Directory

This directory contains all external feedback, reviews, and critiques about the MQ Studio website.

## Directory Structure

```
feedback/
├── reviews/        # Website reviews and critiques
├── user-testing/   # User testing sessions and observations
├── analytics/      # Analysis of feedback patterns and trends
└── README.md       # This file
```

## Purpose

Track and organize feedback to inform design decisions, feature development, and iterative improvements to the website.

## File Naming Convention

### Reviews
- `YYYY-MM-DD-reviewer-name-review.md` - Individual reviews
- `YYYY-MM-DD-source-name.md` - Reviews from external sources (e.g., design communities)

### User Testing
- `YYYY-MM-DD-session-N-notes.md` - User testing session notes
- `YYYY-MM-DD-session-N-recording-transcript.md` - Transcripts if available

### Analytics
- `YYYY-MM-feedback-summary.md` - Monthly feedback summaries
- `theme-[theme-name]-analysis.md` - Analysis by theme (e.g., navigation, visual design)
- `iteration-[N]-feedback-report.md` - Feedback reports tied to iterations

## Adding New Feedback

1. **Save raw feedback** in the appropriate subdirectory using naming convention
2. **Include metadata** at top of each file:
   ```markdown
   ---
   date: YYYY-MM-DD
   source: [Name/Organization/Platform]
   type: [review|user-testing|critique|suggestion]
   priority: [high|medium|low]
   status: [new|reviewed|implemented|deferred]
   ---
   ```
3. **Tag actionable items** with clear markers:
   - `[ACTIONABLE]` - Needs implementation
   - `[QUESTION]` - Needs clarification
   - `[INSIGHT]` - Important learning
   - `[CONFLICT]` - Conflicts with other feedback

## Analysis Workflow

1. Collect feedback in `reviews/` or `user-testing/`
2. Review and tag actionable items
3. Create thematic analysis in `analytics/`
4. Reference in implementation decisions
5. Track implementation in `docs/IMPLEMENTATION_DECISIONS_LOG.md`

## Integration with Project

- Link to implementation decisions in `/docs/IMPLEMENTATION_DECISIONS_LOG.md`
- Reference in iteration reports (`/docs/ITERATION_*_*.md`)
- Consider feedback when planning features and changes

---

**Created:** 2025-11-17
**Purpose:** Centralized feedback management for data-driven design decisions
