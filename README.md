# Ink-away.koplugin documentation

Fumadocs with Next.js static export, MDX, local search, and Bun.

```sh
bun install --frozen-lockfile
bun run dev
bun run types:check
bun run build
bun run start
```

The static production site is generated in `out/`. Pages live in `content/docs/`;
Lua documentation mocks are downloadable from `public/examples/`.

Content describes integration API v1 from the Ink Away fork's
`feature/plugin-integration` branch. Unmodified upstream 4.4.0 does not provide
this API. The source reference is `../rolling.koplugin/docs/Plugin-integration.md`.

Origin: https://github.com/KristanLaimon/Ink-away-documentation.git
