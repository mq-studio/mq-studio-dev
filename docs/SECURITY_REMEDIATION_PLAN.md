# Security Remediation Plan

**Project:** MQ Studio Website (Next.js + TinaCMS)  
**Date:** 2025-11-18  
**Author:** Security Engineering  
**Scope:** Remaining 20 npm advisories after `npm audit fix`

---

## Executive Summary

- `npm audit fix` removed all upgradable advisories; **20 vulnerabilities remain** (6 critical, 8 high, 4 moderate, 2 low).
- All critical and high advisories sit in **TinaCMS tooling** (`tinacms`, `@tinacms/graphql`, `@tinacms/cli`) or **Stagehand test helpers** and are therefore limited to the authenticated CMS UI or developer workflows—not the static production build served to end-users.
- TinaCMS **v2.9.x is still the latest stable series** (no 3.x GA yet), and the upstream maintainers have not shipped patched versions of `mermaid`, `dompurify`, or `jsonpath-plus`. We must either accept risk or apply local overrides.
- **Stagehand 3.0.2** is the current stable release (per `PHASE5_ASSESSMENT.md`), bundling patched `ai`, `jsondiffpatch`, and modern `esbuild`. Upgrading Stagehand or isolating it as a dev-only dependency will address four advisories outright.
- Recommended approach: apply **targeted overrides** for `dompurify`, `jsonpath-plus`, `glob`, `lodash.set`, and `esbuild`, upgrade Stagehand to 3.0.2 (or remove it from production dependencies), reclassify Stagehand as `devDependency`, and re-run TinaCMS build validation before releasing.

---

## Stack Snapshot & Version Research

| Component | Current Version | Latest Known | Notes |
|-----------|-----------------|--------------|-------|
| Next.js | 15.5.6 | 16.0.3 | Staying on 15.5.x avoids recently introduced 16.x churn.
| TinaCMS | 2.9.5 | 2.9.5 | No 2.9.x patch released for DOMPurify/JSONPath; 3.x not GA.
| @tinacms/cli | 1.12.2 | 1.12.2 | Pinned due to compatibility with TinaCMS 2.9.x.
| @tinacms/graphql | 2.9.x | 2.9.x | Still bundles vulnerable `jsonpath-plus` and `lodash.set`.
| @browserbasehq/stagehand | 2.5.x | 3.0.2 | 3.0.x refresh pulls patched `ai`, `jsondiffpatch`, `esbuild`.

**Research Notes**
1. TinaCMS maintainers confirmed (Phase 5 documentation) that 2.9.x is the latest stable branch; they recommend waiting for a coordinated release instead of forcing overrides inside `tinacms` packages. There is no Tina 3.x release candidate published to npm as of 2025‑11‑18.
2. Stagehand 3.0.2 has been vetted internally (see `PHASE5_ASSESSMENT.md:45`), and its changelog only contains TypeScript typing updates plus dependency refreshes—safe for dev/test usage.
3. DOMPurify, JSONPath Plus, glob, lodash.set, ai, jsondiffpatch, and esbuild all have patch versions available today (summarized per advisory below).

---

## Severity Overview

| Severity | Count | Primary Components | Exposure |
|----------|-------|--------------------|----------|
| Critical | 6 | DOMPurify (mermaid), JSONPath Plus | TinaCMS admin + CLI only |
| High | 8 | glob, lodash.set | TinaCMS CLI/GraphQL only |
| Moderate | 4 | ai, jsondiffpatch, esbuild | Stagehand tests, TinaCMS dev CLI |
| Low | 2 | Legacy CLI utilities (ansi-regex family) | Stagehand test automation |

Totals align with the latest `npm audit` report captured on 2025‑11‑18.

---

## Detailed Breakdown & Remediation Options

### Critical Advisories (6)

| Package | Advisory | Dependency Path | Environment | Remediation Options |
|---------|----------|-----------------|-------------|---------------------|
| `dompurify` ≤3.2.3 | GHSA-vhxf-7vqr-mrjg, GHSA-mmhx-hmjr-r674, etc. | `tinacms → mermaid → dompurify` | TinaCMS admin diagram preview only | 1) **Override** to `dompurify@3.2.4` (first patched release) via `overrides` and retest mermaid rendering. 2) Disable mermaid blocks/server rendering inside TinaCMS. 3) Accept risk until TinaCMS ships patched dependency.
| `jsonpath-plus` ≤10.2.0 | GHSA-5c4m-w2pp-8xv9 (RCE) | `@tinacms/graphql` | TinaCMS GraphQL resolver (admin only) | 1) Add `overrides: { "jsonpath-plus": "10.2.1" }` to force patched build. 2) Remove GraphQL queries requiring JSONPath (if unused). 3) Defer until TinaCMS updates.

### High Advisories (8)

| Package | Advisory | Dependency Path | Environment | Remediation Options |
|---------|----------|-----------------|-------------|---------------------|
| `glob` 10.3.7‑11.0.3 | GHSA-57f3-j8wx-3f4f (CLI command injection) | `@tinacms/cli` | Local TinaCMS build/dev only | 1) Force `glob@11.0.4` via overrides. 2) Run TinaCMS CLI behind scripts that never pass attacker input. 3) Keep CLI pinned but restrict usage to trusted machines.
| `lodash.set` <4.3.2 | GHSA-35jh-r3h4-6jhm (prototype pollution) | `tinacms`, `@tinacms/graphql` | TinaCMS admin | 1) Override to `lodash.set@4.3.2`. 2) Monitor TinaCMS roadmap for patched release. 3) Rebuild TinaCMS GraphQL bundle locally with patched dependency.

### Moderate Advisories (4)

| Package | Advisory | Dependency Path | Environment | Remediation Options |
|---------|----------|-----------------|-------------|---------------------|
| `ai` ≤5.0.51 | GHSA-rwvc-j5jr-mgvh (filetype bypass) | `@browserbasehq/stagehand` | Dev/stage automation only | 1) Upgrade Stagehand to 3.0.2 (bundles `ai@5.1.x`). 2) Move Stagehand to `devDependencies` to avoid production deployment. 3) Disable Stagehand usage until upgrade tested.
| `jsondiffpatch` <0.7.2 | GHSA-2fj9-hgp9-m878 (XSS) | `@browserbasehq/stagehand` | Dev automation | Same actions as above—Stagehand 3.0.2 or isolate the tool.
| `esbuild` ≤0.24.2 | GHSA-67mh-4wv8-2f99 (dev server SSRF) | `@tinacms/cli → vite → esbuild`, also Stagehand scripts | Local dev servers only | 1) Add root-level `overrides: { "esbuild": "0.24.4" }`. 2) Ensure dev server only binds to localhost. 3) Upgrade TinaCMS CLI when they ship patch.
| (Duplicate) `esbuild` path | Same as above | `@browserbasehq/stagehand → vite → esbuild` | Dev automation | Covered by overrides + Stagehand upgrade.

### Low Advisories (2)

- `ansi-regex` <6.0.2 (ReDoS) and `pathval` <=1.1.1 (prototype pollution) appear only inside Stagehand’s CLI utilities per `npm audit`. Both are non-production, but will be eliminated once Stagehand is upgraded to 3.0.2 and reinstalled under `devDependencies`.

---

## Risk Assessment (Production vs. Development)

| Surface | Components Involved | Exposure | Residual Risk |
|---------|--------------------|----------|---------------|
| **Production build (Next.js site)** | Static Next.js output deployed to Vercel/Hostinger | Does **not** bundle TinaCMS admin, Stagehand, or CLI packages. | **Negligible** – already runs sanitized content using `isomorphic-dompurify@2.32.0`.
| **TinaCMS admin** | `tinacms`, `@tinacms/graphql`, `@tinacms/cli`, `mermaid`, `dompurify`, `jsonpath-plus`, `lodash.set` | Accessible only after Auth + Git write access. | **Low to Medium** – adversary would need valid CMS credentials to exploit DOMPurify/JSONPath issues.
| **Developer tooling / CI** | `@browserbasehq/stagehand`, Stagehand scripts, local `vite`/`esbuild` servers | Only runs on trusted laptops or CI containers. | **Low** – command injection requires maintainer to paste malicious CLI args; esbuild SSRF requires dev to expose CLI publicly.

Conclusion: Production risk is limited; remediation is needed mainly to satisfy compliance and reduce attack surface in admin/dev contexts.

---

## Recommended Action Plan & Priorities

1. **Reclass Stagehand as dev-only (Priority P0)** – move `@browserbasehq/stagehand` to `devDependencies`, upgrade to 3.0.2, and regenerate `package-lock.json` to drop ai/jsondiffpatch/ansi-regex advisories.
2. **Add `package.json` overrides (P0)** for `dompurify@3.2.4`, `jsonpath-plus@10.2.1`, `glob@11.0.4`, `lodash.set@4.3.2`, and `esbuild@0.24.4`. Commit lockfile updates and re-run `tinacms dev` to confirm compatibility.
3. **Harden TinaCMS admin (P1)** – ensure admin stays behind required VPN/SAML and monitor for patch releases. Document risk acceptance until upstream updates land.
4. **Automate Weekly Audits (P1)** – add `npm audit --omit=dev` to CI plus Stagehand-specific audits to catch new regressions.
5. **Prepare for future TinaCMS major (P2)** – track TinaCMS GitHub for 2.10/3.0 planning; schedule spike to test RC builds as soon as they appear.

---

## Testing Requirements After Applying Fixes

- `npm run lint` – validate linting passes with dependency overrides in place.
- `npm run test:unit` – ensure React components still behave with updated DOMPurify types.
- `npm run test:stagehand` – re-run Stagehand suites after the 3.0.2 upgrade to catch breaking API changes.
- `npm run build` + `npm run start` – verify Next.js build plus TinaCMS static build succeed.
- Manual TinaCMS admin regression: open rich-text, mermaid diagrams, GraphQL queries; confirm no runtime errors from forced dependency versions.
- Security smoke tests: rerun `npm audit --production` and `npm audit --omit=dev` to prove vulnerability counts drop to zero (expected) or confirm remaining advisories are documented.

---

## Rollback Plan

1. Create a dedicated remediation branch before modifying dependencies (`git checkout -b security/remediation-plan`).
2. After applying overrides/upgrades, tag the commit (`git tag security-remediation-2025-11-18`).
3. If regressions appear, revert by checking out the previous tag/commit and running `npm ci` to restore the old lockfile.
4. Keep backups of `package.json` and `package-lock.json` from before the remediation (already stored in `package.json.v3-backup`).
5. Document any observed regressions in `VULNERABILITY_TRACKING.md` and reopen advisories if rollback occurs.

---

## Next Steps

- Obtain approval from engineering leadership to proceed with the P0 items above.
- Schedule Stagehand upgrade testing window (0.5 day) and TinaCMS override validation window (0.5 day).
- Re-run `npm audit` post-implementation and attach the report to this document for compliance sign-off.
