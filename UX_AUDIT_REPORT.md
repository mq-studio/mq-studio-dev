# UX/CX Audit — Moura Quayle site (novice-first)

This report contains annotated screenshots and recommendations focused on creating a calm, supportive, and designer-friendly experience for Moura (novice on this site).

## Contents
- Persona & session scenario (summary)
- Screenshots and annotations
  - Home page
  - CMS/Admin entry
  - Example asset (sitemap)
- Prioritized quick wins
- Next steps

## Persona & session scenario
- Moura is a designer, novice to this CMS and anxious about breaking the site. She needs calm, clear guidance, minimal choices, friendly microcopy, autosave, and elegant visuals.

## Screenshots and annotations
Screenshots are saved in `ux_screenshots/`.

### 1) Home page
![Home](/home/ichardart/dev/projects/moura-quayle/website-mq-studio/ux_screenshots/home.png)

Annotation:
- Primary observation: The initial hero could use a friendly onboarding message targeted at first-time editors, and a single primary CTA to reduce decision-making.
- Recommendation: Add a "Welcome — Start a quick edit" hero variant for first-time users with two clear buttons: "Show me how" and "Skip".
- Visual changes: soften background, increase spacing around CTA, and use a calming primary blue (#345D8A).

### 2) Admin (TinaCMS) entry
![Admin](/home/ichardart/dev/projects/moura-quayle/website-mq-studio/ux_screenshots/admin.png)

Annotation:
- Primary observation: The admin URL is discoverable but the labels and configuration may be technical for a novice. The admin interface should surface a "Quick Start" guide and hide advanced developer options.
- Recommendation: When a user visits `/admin` for the first time, show a step-by-step overlay: "Create your first post" with a 3-step minimal flow.

### 3) Sitemap (example content)
![Sitemap](/home/ichardart/dev/projects/moura-quayle/website-mq-studio/ux_screenshots/sitemap.png)

Annotation:
- Primary observation: The sitemap is useful for a technical audit but is not shown in the UI a novice will use. Use it to auto-suggest recent or priority content on the homepage "Quick Start" list.
- Recommendation: Expose a simplified "Recent & Drafts" card on the dashboard so Moura can jump to a single content item.

## Prioritized quick wins
1. Autosave & clear saved indicator
2. Minimal edit UI: only title/body/image for first-time users
3. Onboarding hero and first publish wizard (3 steps)
4. Friendly empty states and success confirmations with next action
5. Template starter content for portfolio/announcement

## Next steps
- I can produce annotated images (callouts over screenshots) if you'd like explicit visual callouts.
- I can build a small HTML/CSS prototype of the "First publish" wizard that you can open locally.
- Run a 5-person moderated usability test (I can provide a script and metrics template).

---

Report generated automatically with screenshots saved to `ux_screenshots/`.
