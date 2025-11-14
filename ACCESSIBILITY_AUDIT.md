# Accessibility Audit Checklist for MQ Studio

## WCAG 2.2 Level AA Compliance Checklist

### Perceivable

#### Text Alternatives
- [x] All images have meaningful alt text
- [x] Decorative images use `aria-hidden="true"`
- [x] Complex images have extended descriptions
- [ ] Verify all alt text is descriptive and contextual (manual review needed)

#### Time-based Media
- [x] Audio content (musings) has text transcripts
- [ ] Add captions for any future video content
- [x] Audio player controls are accessible

#### Adaptable
- [x] Content can be presented in different ways
- [x] Semantic HTML structure (header, main, nav, article, aside)
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Lists use proper list markup
- [x] Form labels are properly associated

#### Distinguishable
- [x] Color is not the only means of conveying information
- [x] Text has sufficient contrast ratio
- [ ] **TODO:** Verify all color contrast ratios meet WCAG 2.2 (4.5:1 for normal text, 3:1 for large text)
- [x] Text can be resized up to 200%
- [x] No background images with text overlays (except hero where contrast is managed)
- [x] Focus indicators are visible

### Operable

#### Keyboard Accessible
- [x] All functionality available via keyboard
- [x] No keyboard traps
- [x] Skip link to bypass navigation
- [x] Logical tab order
- [x] Mobile menu keyboard accessible

#### Enough Time
- [x] No time limits on content
- [x] Auto-playing audio can be controlled
- [x] Search auto-suggestions can be dismissed

#### Seizures and Physical Reactions
- [x] No flashing content
- [x] Animations respect `prefers-reduced-motion`
- [x] Watercolor texture animation is subtle

#### Navigable
- [x] Skip link present
- [x] Page titles are descriptive
- [x] Link purpose clear from context
- [x] Multiple ways to find content (search, navigation, recent)
- [x] Headings and labels describe topic
- [x] Focus is visible

#### Input Modalities
- [x] Touch targets are at least 44x44px (mobile menu)
- [x] No pointer-specific interactions
- [x] Labels for form controls present
- [x] Mobile menu accessible via touch

### Understandable

#### Readable
- [x] Language of page specified (`lang="en"`)
- [x] Text is readable and understandable
- [x] Jargon and technical terms minimized
- [x] Content is well-structured

#### Predictable
- [x] Navigation is consistent across pages
- [x] Interactive elements behave predictably
- [x] No unexpected context changes
- [x] Mobile menu behavior is clear

#### Input Assistance
- [x] Form errors are identified
- [x] Labels and instructions provided
- [x] Search suggestions help users
- [ ] **TODO:** Add inline validation for content management

### Robust

#### Compatible
- [x] Valid HTML structure
- [x] ARIA roles and properties used correctly
- [x] Name, role, value available for UI components
- [x] Status messages use appropriate ARIA

---

## Priority Issues to Address

### High Priority
1. **Color Contrast Verification**
   - Tool: Use WebAIM Contrast Checker or Lighthouse
   - Check: All text against background colors
   - Required: 4.5:1 for normal text, 3:1 for large text

2. **Screen Reader Testing**
   - Tool: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
   - Test: Complete user journey through site
   - Verify: All content is announced correctly

3. **Mobile Device Testing**
   - Devices: iPhone, Android phones, tablets
   - Test: Navigation, touch targets, gestures
   - Verify: All functionality works on mobile

### Medium Priority
4. **Automated Testing**
   - Tool: axe DevTools, Lighthouse, WAVE
   - Run: On all major pages
   - Fix: Any issues identified

5. **Keyboard-Only Navigation**
   - Test: Navigate entire site using only keyboard
   - Verify: All content and features accessible
   - Check: Focus order is logical

6. **Content Validation**
   - Add: Scripts to validate content files
   - Check: Required fields present
   - Warn: Missing or incorrect metadata

### Low Priority
7. **Print Styles**
   - Add: Print-friendly CSS
   - Test: Publications print well
   - Optimize: Remove navigation when printing

8. **High Contrast Mode**
   - Test: Windows High Contrast Mode
   - Verify: Site is usable
   - Fix: Any visibility issues

---

## Testing Tools

### Automated Tools
1. **axe DevTools** (Browser Extension)
   - Tests: WCAG 2.0, 2.1, 2.2
   - Free: Chrome, Firefox extensions
   - Use: On every page

2. **Lighthouse** (Built into Chrome)
   - Tests: Performance, Accessibility, SEO
   - Free: Chrome DevTools
   - Run: Regular audits

3. **WAVE** (Web Accessibility Evaluation Tool)
   - Tests: Comprehensive accessibility
   - Free: Browser extension and web service
   - Visual: Shows issues on page

4. **Pa11y** (Command Line)
   ```bash
   npm install -g pa11y
   pa11y http://localhost:3100
   ```

### Manual Testing

1. **Keyboard Navigation**
   - Tab through entire site
   - Use arrow keys in menus
   - Test Enter/Space for buttons
   - Try Escape to close modals

2. **Screen Reader Testing**
   - **Mac:** VoiceOver (Cmd+F5)
   - **Windows:** NVDA (free) or JAWS
   - **iOS:** VoiceOver (Settings > Accessibility)
   - **Android:** TalkBack (Settings > Accessibility)

3. **Color Contrast**
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Chrome DevTools: Inspect element → Styles → Color picker shows contrast ratio

4. **Zoom Testing**
   - Zoom to 200% (Cmd/Ctrl + +)
   - Check: All content still visible and usable
   - Verify: No horizontal scrolling needed

---

## Accessibility Test Script

### Homepage Test
1. [ ] Press Tab - skip link appears
2. [ ] Press Enter - jumps to main content
3. [ ] Tab through navigation - all links reachable
4. [ ] Open mobile menu (on mobile) - works with touch and keyboard
5. [ ] Tab through hero cards - proper focus order
6. [ ] Verify image alt text is descriptive
7. [ ] Check color contrast on all text
8. [ ] Test search with keyboard only
9. [ ] Zoom to 200% - check layout doesn't break

### Publications Page Test
1. [ ] Tab to first publication - focus visible
2. [ ] Read with screen reader - metadata announced
3. [ ] Open publication detail - proper heading structure
4. [ ] Check PDF download is accessible
5. [ ] Test citation copy buttons with keyboard
6. [ ] Verify DOI links work

### Artworks Page Test
1. [ ] Tab to first artwork - focus visible
2. [ ] Open artwork detail - image loads
3. [ ] Test image zoom with keyboard
4. [ ] Check alt text describes artwork
5. [ ] Verify availability status is announced

### Musings Page Test
1. [ ] Tab to first musing - focus visible
2. [ ] Open musing with audio - player accessible
3. [ ] Test audio controls with keyboard
4. [ ] Verify audio player has proper labels
5. [ ] Check reading time is announced

### Search Test
1. [ ] Focus search input - label announced
2. [ ] Type query - suggestions appear
3. [ ] Arrow down - navigates suggestions
4. [ ] Enter - opens selected result
5. [ ] Escape - closes suggestions

---

## Color Contrast Requirements

### WCAG 2.2 Level AA
- **Normal text** (< 18pt or < 14pt bold): 4.5:1
- **Large text** (≥ 18pt or ≥ 14pt bold): 3:1
- **UI components and graphics**: 3:1

### Current Color Palette to Verify

```css
/* Text on Rice Paper Background (#FDFCF8) */
--ink-black: #1A1A1A (Primary text)
--charcoal-wash: #4A4A4A (Secondary text)
--muted-foreground: #6B6B6B (Muted text)

/* Interactive Elements */
--moura-teal: #00A8A8 (Links, buttons)
--scholar-blue: #2C5985 (Thinking)
--vibrant-magenta: #D33479 (Feeling)

/* Backgrounds */
--rice-paper: #FDFCF8 (Main background)
--studio-cream: #FFF8F0 (Muted background)
```

**Action Items:**
1. Test each color combination
2. Document contrast ratios
3. Adjust colors if needed to meet 4.5:1
4. Maintain brand identity while ensuring accessibility

---

## Browser Testing Matrix

### Desktop Browsers (Latest Versions)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome (Android)
- [ ] Firefox (Android)
- [ ] Samsung Internet

### Assistive Technologies
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (Mac)
- [ ] VoiceOver (iOS)
- [ ] TalkBack (Android)

---

## Known Accessibility Features

### Already Implemented ✅
1. Skip link for keyboard users
2. ARIA labels on navigation
3. Semantic HTML structure
4. Keyboard-accessible mobile menu
5. Focus indicators
6. Screen reader support
7. Alt text on images
8. Proper heading hierarchy
9. Accessible forms
10. Loading states with announcements

### Needs Verification ⚠️
1. Color contrast ratios
2. Screen reader testing
3. Mobile device testing
4. High contrast mode support

### Future Enhancements 🔮
1. Live region announcements for dynamic content
2. Breadcrumb navigation
3. Automated accessibility testing in CI/CD
4. Accessibility statement page
5. User preference for reduced motion
6. High contrast theme toggle

---

## Resources

### Guidelines
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Guidelines](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Testing
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Tool](https://wave.webaim.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Last Updated:** November 13, 2024
**Next Review:** December 13, 2024 (monthly)
**Responsible:** Development Team
