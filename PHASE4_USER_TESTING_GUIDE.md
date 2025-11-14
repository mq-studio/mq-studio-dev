# Phase 4: User Testing Guide
## Content Management Workflow Validation

**Date:** November 13, 2025  
**Tester:** Moura (Site Owner)  
**Duration:** 1-2 hours  
**Objective:** Validate content management workflows and measure usability

---

## Pre-Test Setup

### For Test Administrator

1. **Start Development Server:**
   ```bash
   cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio
   npm run dev
   # Server will start at http://localhost:3100
   ```

2. **Prepare Materials:**
   - ✅ This testing guide (printed or on second screen)
   - ✅ Stopwatch or timer
   - ✅ Notepad for observations
   - ✅ Test content samples (below)

3. **Browser Setup:**
   - Open http://localhost:3100 in browser
   - Open DevTools Console (F12) to monitor errors
   - Ensure screen recording if desired

---

## Test Scenarios

### Scenario 1: Create Content Using Templates (Target: <10 minutes)

**Objective:** Measure time to create first piece of content using templates

**Instructions for Moura:**
1. Navigate to `templates/` directory
2. Choose `musing-template.md`
3. Copy the file to `content/musings/`
4. Rename to `test-musing-2025-11-13.mdx`
5. Fill in all fields following inline instructions
6. Save the file
7. Refresh website to see new musing

**Metrics to Collect:**
- ⏱️ **Time to complete:** ___ minutes
- 📝 **Difficulty (1-5):** ___
- ❓ **Questions asked:** ___
- 😊 **Satisfaction (1-5):** ___

**Observer Notes:**
```
Confusion points:


Positive feedback:


Suggested improvements:


```

---

### Scenario 2: Create Content Using TinaCMS (Target: <5 minutes)

**Objective:** Compare TinaCMS visual editor experience

**Instructions for Moura:**
1. Navigate to http://localhost:3100/admin
2. Log in with credentials (if required)
3. Click "Create New" → "Musing"
4. Fill in the form using visual editor
5. Add an image from media library
6. Save and publish

**Metrics to Collect:**
- ⏱️ **Time to complete:** ___ minutes
- 📝 **Difficulty (1-5):** ___
- ❓ **Questions asked:** ___
- 😊 **Satisfaction (1-5):** ___
- 🎨 **Prefer over templates? (Y/N):** ___

**Observer Notes:**
```
Confusion points:


Positive feedback:


Suggested improvements:


```

---

### Scenario 3: Edit Existing Content

**Objective:** Test edit workflow and autosave functionality

**Instructions for Moura:**
1. Find an existing musing on the website
2. Navigate to its source file
3. Make 3 changes:
   - Update title
   - Add a paragraph
   - Change a tag
4. Save and verify changes on website

**Metrics to Collect:**
- ⏱️ **Time to complete:** ___ minutes
- ✅ **Successfully found file? (Y/N):** ___
- ✅ **Changes reflected correctly? (Y/N):** ___
- 😊 **Satisfaction (1-5):** ___

**Observer Notes:**
```
Issues encountered:


Ease of finding file:


Clarity of file structure:


```

---

### Scenario 4: Accessibility Testing

**Objective:** Validate keyboard navigation and screen reader support

**Instructions for Moura:**
1. Navigate website using only keyboard (Tab, Enter, Esc)
2. Test mobile navigation menu
3. Try skip link (first Tab press)
4. Navigate through all main pages

**Checklist:**
- [ ] Skip link appears on first Tab
- [ ] All navigation links reachable by keyboard
- [ ] Mobile menu opens/closes with keyboard
- [ ] Focus indicators visible
- [ ] No keyboard traps

**Observer Notes:**
```
Keyboard navigation issues:


Mobile navigation feedback:


Accessibility concerns:


```

---

### Scenario 5: Mobile Experience

**Objective:** Test mobile usability

**Instructions for Moura:**
1. Open website on mobile device (or resize browser to mobile)
2. Navigate through all sections
3. Test hamburger menu
4. Try creating content on mobile (if applicable)

**Checklist:**
- [ ] Hamburger menu works smoothly
- [ ] All text readable (no small fonts)
- [ ] Buttons/links easily tappable
- [ ] Images load and display correctly
- [ ] No horizontal scrolling

**Observer Notes:**
```
Mobile usability issues:


Touch target problems:


Layout concerns:


```

---

## Test Content Samples

### Sample Musing Content
```
Title: Reflections on Urban Planning and Community Engagement
Date: 2025-11-13
Category: thinking
Tags: urban-planning, community, engagement

Urban planning is fundamentally about people. When we design spaces, 
we're not just arranging buildings and streets—we're shaping how communities
interact, grow, and thrive.

[Add your own paragraph here about a recent project or observation]

What makes great public spaces? Three key elements:
1. Accessibility for all
2. Meaningful engagement opportunities
3. Adaptability to changing needs

[Conclude with a question or call to action]
```

---

## Post-Test Questionnaire

### Overall Experience

1. **Which workflow did you prefer?**
   - [ ] Templates (manual file editing)
   - [ ] TinaCMS (visual editor)
   - [ ] Both equally useful
   - [ ] Neither worked well

2. **How confident do you feel managing content independently?**
   - [ ] Very confident (can do it alone)
   - [ ] Somewhat confident (might need occasional help)
   - [ ] Not confident (need frequent help)

3. **What was the most confusing part?**
   ```
   
   
   ```

4. **What worked really well?**
   ```
   
   
   ```

5. **On a scale of 1-10, how satisfied are you with the content management system?**
   - **Rating:** ___ / 10
   - **Why?** ___________

6. **Would you recommend any changes?**
   ```
   Priority 1 (must have):
   
   
   Priority 2 (nice to have):
   
   
   Priority 3 (future enhancement):
   
   
   ```

---

## Success Criteria

### Must Pass (Required for Production)
- [ ] Create content in <10 minutes (template workflow)
- [ ] Create content in <5 minutes (TinaCMS workflow)
- [ ] Moura rates satisfaction ≥7/10
- [ ] Moura feels confident managing content independently
- [ ] Zero critical usability issues

### Should Pass (Fix Before Production)
- [ ] No confusion points that block workflow
- [ ] All accessibility checklist items pass
- [ ] Mobile experience is smooth
- [ ] Documentation is clear and helpful

### Nice to Have (Can Fix Post-Launch)
- [ ] Moura prefers workflow over old method
- [ ] Suggests only minor improvements
- [ ] Workflow faster than expected

---

## Testing Timeline

**Session Structure:**
- **0:00-0:10:** Introduction and setup
- **0:10-0:25:** Scenario 1 (Templates)
- **0:25-0:35:** Scenario 2 (TinaCMS)
- **0:35-0:45:** Scenario 3 (Edit existing)
- **0:45-0:55:** Scenario 4 (Accessibility)
- **0:55-1:05:** Scenario 5 (Mobile)
- **1:05-1:20:** Post-test questionnaire and discussion
- **1:20-1:30:** Buffer for questions and wrap-up

**Total Duration:** 90 minutes maximum

---

## Results Summary Template

```
PHASE 4 USER TESTING RESULTS
Date: _____________
Tester: Moura
Observer: _____________

KEY METRICS:
- Template workflow time: ___ minutes (Target: <10)
- TinaCMS workflow time: ___ minutes (Target: <5)
- Overall satisfaction: ___ / 10 (Target: ≥7)
- Confidence level: _____________
- Preferred workflow: _____________

PASS/FAIL CRITERIA:
Must Pass: [ PASS / FAIL ]
Should Pass: [ PASS / FAIL ]  
Nice to Have: [ PASS / FAIL ]

CRITICAL ISSUES (must fix before production):
1. 
2.
3.

RECOMMENDED IMPROVEMENTS (should fix):
1.
2.
3.

OPTIONAL ENHANCEMENTS (future):
1.
2.
3.

DECISION:
[ ] APPROVED for production deployment
[ ] CONDITIONAL approval (fix critical issues first)
[ ] NOT APPROVED (major rework needed)

Next Steps:
1.
2.
3.
```

---

## Additional Notes

### For Observer
- Take detailed notes during testing
- Don't help unless Moura is completely stuck
- Note any hesitations or confusion (even if resolved)
- Time each scenario accurately
- Capture exact quotes when useful

### For Moura
- Think aloud as you work
- Don't worry about making mistakes
- Ask questions when confused
- Be honest in feedback
- There are no wrong answers

### Equipment Needed
- [ ] Computer with development server running
- [ ] Mobile device for mobile testing
- [ ] Timer/stopwatch
- [ ] Notepad/laptop for notes
- [ ] Screen recording (optional but helpful)

---

**Prepared By:** Claude Code Meta-Orchestrator  
**Version:** 1.0  
**Last Updated:** November 13, 2025

*🤖 Ready for Phase 4 user validation*
