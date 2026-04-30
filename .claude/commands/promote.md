---
description: Promote a fix made directly inside an account back to the base template, then propagate to all other accounts.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task
argument-hint: "<account-name> [file-path]"
---

You just received `/promote $ARGUMENTS`. The user fixed something inside one account (`bybe-accounts/accounts/<name>/`) and wants the same fix everywhere. Treat this as: "reverse the substitution, apply to base, push base, propagate to all other accounts".

## Parse arguments

- First positional arg: account name (e.g., `pizza-bulizz`). Required.
- Optional second arg: a single relative file path (within the account's folder) to promote. If omitted, promote ALL changed files in that account.

If the user typed just `/promote` with no arguments → ask once: "Which account? (e.g., `/promote pizza-bulizz`)" and wait. Don't guess.

## Steps

### 1. Sanity-check the account exists

```bash
ACCOUNTS_ROOT="C:/Users/jorde/OneDrive/שולחן העבודה/BYBE/bybe-accounts/accounts"
test -d "$ACCOUNTS_ROOT/<account>" || abort "no account at $ACCOUNTS_ROOT/<account> — accounts: $(ls "$ACCOUNTS_ROOT")"
```

### 2. Make sure the bybe-accounts repo is up to date with origin

```bash
cd "$ACCOUNTS_ROOT/.."
git fetch origin main
git pull --ff-only origin main 2>&1 || true
```

If pull fails (uncommitted changes block it), continue — the user's uncommitted changes are exactly what we want to promote.

### 3. Make sure pizza-base is up to date

```bash
cd "C:/Users/jorde/OneDrive/שולחן העבודה/BYBE/pizza-base-main"
git status --porcelain  # if the base has uncommitted changes that are NOT placeholder-form, abort and tell the user
git fetch origin main
git pull --ff-only origin main 2>&1 || abort "base has unpushed local commits — run /push first or rebase manually"
```

### 4. Dispatch promote-to-base-agent

```json
{
  "account": "<account>",
  "files": <single-element array if file path was given, else omit>,
  "auto_propagate": true,
  "auto_commit_base": true
}
```

The agent will:
- Identify the account's modified files.
- Reverse-substitute each file via `unsub_placeholders.py` + the account's manifest.
- Show you a diff and wait for your `כן`/`yes` confirmation per file.
- If approved, write to base, run a round-trip sanity check, commit + push base.
- Then dispatch `sync-derivatives-agent` to propagate to all other accounts.

### 5. Report the agent's summary verbatim

The summary covers:
- Which files were promoted and the line-count diff
- Round-trip integrity status
- Base commit SHA + push outcome
- Forward propagation: which accounts got the change, which had conflicts
- Which Hosting URLs were redeployed

If any per-file confirmation was rejected, surface that — the user may want to investigate or adjust before retrying.

## Don't

- Don't auto-approve diffs on the user's behalf — reverse substitution false positives are real and per-file confirmation is the only safety net.
- Don't run `/promote` if the base has un-pushed local commits (would mean the base diverged from origin; surface that and stop).
- Don't promote files outside the customer (`לקוח`) or admin (`מנהל`) folders. Per-site infra (firebase.json, .firebaserc, manifest, database.rules.json) is intentionally per-account and never goes to base.
