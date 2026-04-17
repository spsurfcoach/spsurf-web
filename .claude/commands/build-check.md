# Build Check

Run a TypeScript type-check before committing to catch errors that will break the Vercel build.

## Context

`node_modules` is not installed locally, so running `tsc` produces many false-positive errors
from missing package types (React, Next.js, Firebase, etc.). The Vercel build installs
packages first via `npm install`, so those errors disappear there.

The only errors that **will actually break the Vercel build** are logic/type errors
that don't depend on external package declarations.

## Quick check command

```bash
tsc --noEmit --skipLibCheck 2>&1 | grep "^src/" | grep -v "TS2307\|TS2882\|TS2591\|TS2875\|TS7026\|TS7006\|TS2503\|TS2503\|TS2322.*key"
```

If this outputs **nothing** → safe to commit.
If it outputs errors → fix them before committing.

## Errors to always ignore (missing node_modules noise)

| Code | Reason |
|------|--------|
| TS2307 | Cannot find module (package not installed) |
| TS2882 | Side-effect import not found |
| TS2591 | Cannot find name 'process'/'Buffer' (missing @types/node) |
| TS2875 | JSX tag requires jsx-runtime (missing React types) |
| TS7026 | JSX element implicitly 'any' (missing React types) |
| TS7006 | Parameter implicitly 'any' (cascades from missing React/lib types) |
| TS2503 | Cannot find namespace 'React' (missing React types) |
| TS2322 …`key` | 'key' prop type mismatch (missing React types) |

## Errors that ARE real and must be fixed

| Code | Meaning |
|------|---------|
| TS2339 | Property does not exist on type (e.g., accessing `.slug` on `never`) |
| TS2345 | Argument type not assignable |
| TS2322 (non-key) | Type not assignable (real mismatches) |
| TS2304 | Cannot find name (undefined variable/function) |
| TS2531 | Object is possibly null (unguarded access) |
| TS2540 | Cannot assign to readonly property |

## Steps before every commit touching `.ts`/`.tsx` files

1. Run the quick check command above
2. If output is empty → commit
3. If real errors appear → fix them, re-run, then commit
