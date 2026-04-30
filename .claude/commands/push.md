---
description: Push the base repo to GitHub and propagate the new commits to every account in bybe-accounts.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task
---

You just received `/push`. Treat this as: "publish the base + sync everything downstream + commit/push the accounts repo".

## Steps

### 1. Push the base

```bash
cd "C:/Users/jorde/OneDrive/שולחן העבודה/BYBE/pizza-base-main"
git status --porcelain
```

- If the working tree has uncommitted tracked changes, stop and tell the user to commit first. Do not auto-commit.
- If clean (or only untracked files), proceed.

```bash
git push origin main
```

If `git push` reports "Everything up-to-date", that's fine — continue. The sync may still have catching-up to do for accounts that lag behind.

If push fails (rejected, auth, network) — print the error verbatim and stop. Do NOT run the sync agent.

### 2. Capture the SHA we just pushed

```bash
TO_SHA=$(git rev-parse HEAD)
```

### 3. Make sure the accounts repo is up to date

```bash
cd "C:/Users/jorde/OneDrive/שולחן העבודה/BYBE/bybe-accounts"
git fetch origin main
# If behind, fast-forward — the accounts repo always tracks remote
git pull --ff-only origin main 2>&1 || true
```

If the accounts repo doesn't exist locally, stop and tell the user: `clone https://github.com/adminbybe/bybe-accounts.git into BYBE/bybe-accounts first, then re-run /push`.

### 4. Invoke sync-derivatives-agent

Dispatch the `sync-derivatives-agent` subagent with:

```json
{
  "base_root":      "C:\\Users\\jorde\\OneDrive\\שולחן העבודה\\BYBE\\pizza-base-main",
  "accounts_root":  "C:\\Users\\jorde\\OneDrive\\שולחן העבודה\\BYBE\\bybe-accounts\\accounts",
  "to_sha":         "<TO_SHA>",
  "auto_deploy":         true,
  "auto_push_accounts":  true
}
```

Let the agent decide each account's `from_sha` from its own manifest.

### 5. Report

Print the agent's summary verbatim. The summary should include:
- Which accounts were synced (and to what SHA)
- Which accounts had `.rej` conflicts (require manual resolution)
- Which Hosting URLs were redeployed
- Whether the bybe-accounts repo was committed + pushed

If the agent reported any conflicts, surface them prominently — those accounts need manual `.rej` resolution before the next `/push`.

## Don't

- Don't run the sync agent if `git push` (base) failed.
- Don't auto-commit untracked changes in the base repo on the user's behalf.
- Don't push the bybe-accounts repo manually here — that's the sync agent's job (§4e in its doc) and ensures the manifest updates are part of the same commit.
