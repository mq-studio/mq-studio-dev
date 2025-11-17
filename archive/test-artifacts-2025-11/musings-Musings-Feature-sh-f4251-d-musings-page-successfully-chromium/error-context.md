# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "Build Error" [level=1] [ref=e7]
        - paragraph [ref=e8]: Failed to compile
        - generic [ref=e9]:
          - generic "An outdated version detected (latest is 16.0.1), upgrade is highly recommended!" [ref=e11]: Next.js (14.2.5) is outdated
          - link "(learn more)" [ref=e12] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
      - generic [ref=e13]:
        - generic [ref=e14]:
          - link "./components/LegacyMusingBadge.tsx" [ref=e15] [cursor=pointer]:
            - text: ./components/LegacyMusingBadge.tsx
            - img [ref=e16] [cursor=pointer]
          - generic [ref=e20]:
            - generic [ref=e21]: "'client-only' cannot be imported from a Server Component module. It should only be used from a Client Component. The error was caused by using 'styled-jsx' in './components/LegacyMusingBadge.tsx'. It only works in a Client Component but none of its parents are marked with \"use client\", so they're Server Components by default. Import trace for requested module:"
            - link "./components/LegacyMusingBadge.tsx" [ref=e22] [cursor=pointer]:
              - text: ./components/LegacyMusingBadge.tsx
              - img [ref=e23] [cursor=pointer]
            - link "./app/musings/[slug]/page.tsx" [ref=e27] [cursor=pointer]:
              - text: ./app/musings/[slug]/page.tsx
              - img [ref=e28] [cursor=pointer]
        - contentinfo [ref=e32]:
          - paragraph [ref=e33]:
            - generic [ref=e34]: This error occurred during the build process and can only be dismissed by fixing the error.
```