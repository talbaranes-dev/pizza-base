# Pizza-base — instructions for Claude

You are working in the **pizza-base template repo**. This file is loaded automatically on every session so you have the project context cold.

## Goal

Given a new pizzeria name (e.g. `pizza-example`), produce a live site at `https://<name>.bybe.co.il`, end-to-end, using the agents in `.claude/agents/`.

## Folder layout under `C:\Users\jorde\OneDrive\שולחן העבודה\BYBE\`

- **`pizza-base-main\`** — this directory. Pristine template + agents + docx. The template HTML/`.firebaserc` use pure placeholders (`YOUR_PROJECT_ID`, `YOUR_DISPLAY_NAME`) that template-agent replaces during cloning. **Never edit the source folders inside here when provisioning a new pizzeria** — clone them into a new directory instead.
- **`<new-name>\`** — created fresh by the orchestrator/template-agent for each new pizzeria. Never pre-exists.

## Live reference (visual/sanity check only — not a code source)

Two always-on demo sites for visual comparison of what a working deployment looks like:
- Customer: https://pizzademoorder.bybe.co.il/
- Manager: https://pizzademoadmin.bybe.co.il/

Use them for UI comparison and regression checks. The template source-of-truth remains the placeholder files in `pizza-base-main` — never clone from the demo URLs.

## How to invoke

When the user says **"הקם פיצרייה `<name>`"** / **"set up pizzeria `<name>`"**, delegate to the `orchestrator` subagent with that name. Orchestrator runs the 10-stage pipeline (template-agent → firebase-agent → dns-agent → deploy-agent → verify-agent).

If the user is invoking via Dispatch (fresh session with no memory of earlier conversations), **assume you know nothing beyond this file**. The prompt from Dispatch should be self-contained; if it isn't, ask the user once for the pizzeria name before doing anything.

## Key facts the agents rely on

- **Parent domain:** `bybe.co.il` (registered with JetServer, DNS at `ns{1-4}.jetdns.net`, managed via https://jetclients.co.il).
- **Firebase:** the business account `admin@bybe.co.il` has a Spark (free) plan. Project IDs = `<name>`, with two Hosting sites per pizzeria: `<name>-order` (customer) and `<name>-admin` (manager). All new pizzerias from pizza-test-ver-05 (2026-04-19) onwards are created under `admin@bybe.co.il`, **not** the legacy `jorden1baranes@gmail.com`. The old demo projects (`pizzademoorder`, `pizzademoadmin`, `pizzabulizz`) stay where they are — don't touch.
- **RTDB region:** detect from the template's hardcoded `DB_URL` (us-central1 if `.firebaseio.com`, else the region in the subdomain). Wrong region = silently broken site.
- **Custom domain mode:** Firebase uses **Quick setup (CNAME only)** for subdomains, not TXT+A. Only apex domains use Advanced.
- **JetClients / JetServer:** JetServer מחובר למחשב המשתמש — ברירת המחדל היא לנסות לגשת ל-JetClients ישירות ללא התחברות ידנית. עצור ובקש התחברות רק אם הדף מחזיר login/CAPTCHA (Session פג). אל תעצור מראש.
- **WhatsApp bot infra:** shared repo `github.com/adminbybe/pizza-whatsapp-bot` (private), one Render Web Service per pizzeria. The bot uses `baileys@7.0.0-rc.9` + `"engines": { "node": "20.x" }` — the 6.7.x line crashes on Node 22, don't regress. See orchestrator Stage 5.7 for the full flow.

## Chrome profile (when using Claude-in-Chrome MCP)

For BYBE work the MCP must be connected to the Chrome profile signed into `admin@bybe.co.il`, not the user's personal Gmail. The MCP can only be connected to one profile per session; `switch_browser` broadcasts a Connect request to all Chrome windows with the extension installed and the user clicks Connect in the target window.

**Verify profile before destructive actions.** The browser-name string returned by `switch_browser` (e.g. `"personal chrome"`) is unreliable — both profiles may return the same name. Confirm by navigating to `https://myaccount.google.com/` and reading the email under the avatar before doing anything irreversible.

**URL path by profile:**
- On the admin@bybe.co.il Chrome profile (the desired one): Firebase console is at `/u/0/...` (admin is the only account there).
- On the personal `jorden1baranes@gmail.com` profile: admin@bybe.co.il happens to be account index 2, so use `/u/2/...`. This profile should only be used for non-BYBE tasks.

If the user mentions anything BYBE-related and the MCP is connected to the personal profile, run `switch_browser` first. If they ask for non-BYBE work, don't switch unless they ask.

## What NOT to do

- Don't reuse an existing Firebase project ID (`sapak-app`, or any other project already in your account). Every new pizzeria = new project.
- Don't skip the custom-domain stage even if `*.web.app` works — the contract is `<name>.bybe.co.il`.
- Don't commit/push without the user asking.

## Docx

`מערך-סוכנים-להקמת-אתרים.docx` at this directory's root is generated from the agents. If you edit any `.claude/agents/*.md`, regenerate with `python scripts/build-agents-docx.py` so the docx stays in sync.
