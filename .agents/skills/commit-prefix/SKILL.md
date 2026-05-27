---
name: commit-prefix
description: Use when creating git commits. Ensures commit messages start with feat:, fix:, or chores: based on the nature of changes.
---

# Commit Prefix Convention

When writing a git commit message, analyze the changes and prefix the message with one of:

- `feat:` — a new feature or user-facing enhancement
- `fix:` — a bug fix
- `chores:` — anything else (refactoring, documentation, tests, dependency updates, build config, linting, etc.)

Rules:
- The prefix must be lowercase, followed by a space, then the message text
- Do not use any other prefixes
- The first letter after the prefix + space should be lowercase (e.g., `feat: add login button`, not `feat: Add login button`)
