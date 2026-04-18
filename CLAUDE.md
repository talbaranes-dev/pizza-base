# Pizza-base — instructions for Claude

You are working in the **pizza-base template repo**. This file is loaded automatically on every session so you have the project context cold.

## Goal

Given a new pizzeria name (e.g. `pizza-jordi`), produce a live site at `https://<name>.bybe.co.il`, end-to-end, using the agents in `.claude/agents/`.

## Folder layout under `C:\Users\jorde\OneDrive\שולחן העבודה\BYBE\`

- **`pizza-base-main\`** — this directory. Pristine template + agents + docx. **Never edit the source folders inside here when provisioning a new pizzeria** — clone them into a new directory instead.
- **`pizza nemo\`** — reference deployed pizzeria at https://pizza-nemo.bybe.co.il/. Left as-is for comparison.
- **`<new-name>\`** — created fresh by the orchestrator/template-agent for each new pizzeria. Never pre-exists.

## How to invoke

When the user says **"הקם פיצרייה `<name>`"** / **"set up pizzeria `<name>`"**, delegate to the `orchestrator` subagent with that name. Orchestrator runs the 10-stage pipeline (template-agent → firebase-agent → dns-agent → deploy-agent → verify-agent).

If the user is invoking via Dispatch (fresh session with no memory of earlier conversations), **assume you know nothing beyond this file**. The prompt from Dispatch should be self-contained; if it isn't, ask the user once for the pizzeria name before doing anything.

## Key facts the agents rely on

- **Parent domain:** `bybe.co.il` (registered with JetServer, DNS at `ns{1-4}.jetdns.net`, managed via https://jetclients.co.il).
- **Firebase:** the user's Google account has a Spark (free) plan. Project IDs = `<name>`, with two Hosting sites per pizzeria: `<name>-order` (customer) and `<name>-admin` (manager).
- **RTDB region:** detect from the template's hardcoded `DB_URL` (us-central1 if `.firebaseio.com`, else the region in the subdomain). Wrong region = silently broken site.
- **Custom domain mode:** Firebase uses **Quick setup (CNAME only)** for subdomains, not TXT+A. Only apex domains use Advanced.
- **JetClients / JetServer:** JetServer מחובר למחשב המשתמש — ברירת המחדל היא לנסות לגשת ל-JetClients ישירות ללא התחברות ידנית. עצור ובקש התחברות רק אם הדף מחזיר login/CAPTCHA (Session פג). אל תעצור מראש.

## What NOT to do

- Don't reuse existing Firebase project IDs (`pizza-nemo`, `sapak-app`). Every new pizzeria = new project.
- Don't edit `pizza nemo\` (the reference) while provisioning.
- Don't skip the custom-domain stage even if `*.web.app` works — the contract is `<name>.bybe.co.il`.
- Don't commit/push without the user asking.

## Docx

`מערך-סוכנים-להקמת-אתרים.docx` at this directory's root is generated from the agents. If you edit any `.claude/agents/*.md`, regenerate with `python scripts/build-agents-docx.py` so the docx stays in sync.
