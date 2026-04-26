# Vercel Build Conservation Workflow

Use this workflow when Vercel build quota is tight or when a batch of small utility-layer changes should ship together.

## Rule

Do not merge small PRs directly into `main` during quota pressure.

Small PRs should be stacked, reviewed by diff, and batch-merged later so `main` deploys once instead of repeatedly.

## Current stack pattern

```text
main
└── feature-parent-branch
    └── next-stacked-branch
        └── final-stacked-branch
```

Each stacked PR should target its parent branch, not `main`.

## Branching pattern

```bash
git checkout feature-parent-branch
git checkout -b next-stacked-branch
```

Open the PR with:

```text
base: feature-parent-branch
head: next-stacked-branch
```

## Review rules

Prefer GitHub diff review for small utility changes.

Only rely on a Vercel preview when the change affects:

- routing
- environment variables
- build configuration
- major UI behavior
- public conversion paths

## Batch merge sequence

Merge from the deepest branch upward:

1. Merge final stacked branch into its parent.
2. Merge that parent into the next parent.
3. Merge the top parent into `main`.
4. Let `main` deploy once.

## Vercel config note

This repo uses `github.autoAlias: false` in `vercel.json` to reduce surprise aliasing behavior during Git-based workflows. It does not eliminate all preview builds by itself. The main protection is disciplined stacked PR workflow and delayed batch merge.

## Do not add during conservation mode

Avoid adding new vendors, auth, analytics, database writes, or speculative dashboard work while build quota is constrained.
