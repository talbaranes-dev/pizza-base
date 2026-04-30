---
description: Push the base repo to GitHub and propagate the new commits to every derived pizzeria site.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task
---

You just received `/push`. Treat this as: "publish the base + sync everything downstream".

## Steps

### 1. Push the base

```bash
cd "C:/Users/jorde/OneDrive/שולחן העבודה/BYBE/pizza-base-main"
git status --porcelain
```

- If working tree has uncommitted tracked changes, stop and tell the user to commit first. Do not auto-commit.
- If clean (or only untracked files), proceed.

```bash
git push origin main
```

If `git push` reports "Everything up-to-date", that's fine — continue to step 2; the sync may still have catching-up to do for derived sites that lag behind.

If push fails (rejected, auth, network) — print the error verbatim and stop. Do NOT run the sync agent.

### 2. Capture the SHA we just pushed

```bash
TO_SHA=$(git rev-parse HEAD)
```

### 3. Invoke sync-derivatives-agent

Dispatch the `sync-derivatives-agent` subagent with:

```json
{
  "base_root":  "C:\\Users\\jorde\\OneDrive\\שולחן העבודה\\BYBE\\pizza-base-main",
  "sites_root": "C:\\Users\\jorde\\OneDrive\\שולחן העבודה\\BYBE",
  "to_sha":     "<TO_SHA>",
  "auto_deploy": true
}
```

Let the agent decide `from_sha` from each site's manifest.

### 4. Report

Print the agent's summary verbatim. If the agent reported any conflicts, surface them prominently — those sites need manual `.rej` resolution before the next `/push`.

## Don't

- Don't run the sync agent if `git push` failed.
- Don't `git pull` automatically — assume the user is up-to-date with the remote.
- Don't commit anything on the user's behalf during this command.
