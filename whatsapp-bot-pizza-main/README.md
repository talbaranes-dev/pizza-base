# pizza-whatsapp-bot

Shared WhatsApp-bot code for all pizzerias under the bybe.co.il platform.
One repo, multiple Render services — each service is one pizzeria, configured via env vars.

## How it works

- WhatsApp auto-responder built on [Baileys](https://github.com/WhiskeySockets/Baileys) (community fork package name `baileys`, version 7.0.0-rc.9 — the older `@whiskeysockets/baileys@6.7.x` series crashes on Node 22 with `Cannot read properties of undefined (reading 'public')` in `noise-handler.js`, so we pin `"engines": { "node": "20.x" }` and use the newer package — discovered 2026-04-19 debugging pizza-test-ver-05)
- Keyword → response matching (`BOT_KEYWORDS` → `ORDER_URL`)
- Syncs store-open state from Firebase RTDB (`settings/storeOpen`)
- Persists WA session in Firebase RTDB (`botAuth/*`), so restart doesn't require re-scanning QR. Requires `database.rules.json` to allow read+write on `botAuth` (the template already includes this rule; Baileys itself uses unauthenticated REST calls to the DB, so the rule must be public — the DB URL is obscure enough that this is acceptable for the free tier).
- Exposes an Express API (port 3000) for the admin panel to read session status / send messages

## Deploy to Render (per pizzeria)

1. Render Dashboard → New → Web Service → Connect this GitHub repo
2. Name: `<pizzeria-code-name>` (e.g. `pizza-david`)
3. Region: any (Frankfurt recommended for Israel latency)
4. Branch: `main`
5. Runtime: Node
6. Build command: `npm install`
7. Start command: `node index.js`
8. Plan: Free
9. Environment variables — **set these per pizzeria**:
   - `FIREBASE_DB` — e.g. `https://pizza-david-default-rtdb.europe-west1.firebasedatabase.app`
   - `ORDER_URL`   — e.g. `https://pizza-david.bybe.co.il/`
   - `BOT_KEYWORDS` — comma-separated, e.g. `היי אני רוצה להזמין,אני רוצה להזמין`
   - (optional) `BOT_RESPONSE_PREFIX` — default: `בשמחה ❤️ הינה קישור להזמנה אונליין\n`
   - (optional) `DEFAULT_RESPONSE` — message when no keyword matches (default: silent)
   - (optional) `IGNORE_GROUPS` — `true` (default) / `false`
10. Create Web Service → Render auto-builds and deploys
11. Copy the service URL (e.g. `https://pizza-david.onrender.com`) into the pizzeria's admin HTML
    as `YOUR_WHATSAPP_BOT_URL`

## Local dev

Copy `config.json` → fill in your dev values → `npm install` → `node index.js`.
Env vars override `config.json` if set.

## Keep-alive on Render free tier

Render free Web Services sleep after 15 min of inactivity. For production, either:
- Upgrade to Starter ($7/month), or
- Point a free UptimeRobot ping at `https://<service>.onrender.com/` every 5-10 min
