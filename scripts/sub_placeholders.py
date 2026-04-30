#!/usr/bin/env python3
"""Apply pizzeria placeholder substitutions to stdin -> stdout.

Usage:
    python sub_placeholders.py <manifest.json> < input.txt > output.txt

Used by sync-derivatives-agent to translate base-template content (with
YOUR_* placeholders) into a derived site's substituted form. Order of
substitutions matters: qualified forms (`-order`, `-admin`,
`.bybe.co.il`) are applied before the bare `YOUR_PROJECT_ID` so the bare
pass cannot corrupt the qualified ones. This list MUST stay in sync
with template-agent.md sections 3, 3b, 4.
"""

import io
import json
import sys


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("usage: sub_placeholders.py <manifest.json>\n")
        sys.exit(2)

    with open(sys.argv[1], encoding='utf-8') as f:
        manifest = json.load(f)

    # Force UTF-8 on stdin/stdout regardless of the OS default code page.
    # Critical on Windows where the console is cp1255 for Hebrew locales —
    # without this, Hebrew bytes get double-encoded and the merged file ends
    # up with invalid UTF-8 sequences.
    text = sys.stdin.buffer.read().decode('utf-8')

    def has(k):
        v = manifest.get(k)
        return v is not None and v != ''

    new_name = manifest.get('new_name', '')
    if not new_name:
        sys.stderr.write("manifest is missing required field: new_name\n")
        sys.exit(2)

    rules = [
        # Qualified project-id forms first
        ('YOUR_PROJECT_ID-order',                new_name + '-order',                                         True),
        ('YOUR_PROJECT_ID-admin',                new_name + '-admin',                                         True),
        ('YOUR_PROJECT_ID.bybe.co.il',           new_name + '.bybe.co.il',                                    True),
        ('YOUR_PROJECT_ID',                      new_name,                                                    True),
        # Display name + domain placeholders
        ('YOUR_DISPLAY_NAME',                    manifest.get('display_name', ''),                            has('display_name')),
        ('YOUR_ORDER_DOMAIN',                    new_name + '.bybe.co.il',                                    True),
        ('YOUR_ADMIN_DOMAIN',                    new_name + '-admin.bybe.co.il',                              True),
        # Bare YOUR_DOMAIN — order matters: come AFTER YOUR_ORDER_DOMAIN/YOUR_ADMIN_DOMAIN
        # and AFTER YOUR_OLD_DOMAIN appears in source (so we don't half-replace it).
        # Template-agent has been substituting this in practice even though the docs missed it.
        ('YOUR_DOMAIN',                          new_name + '.bybe.co.il',                                    True),
        # Hours
        ('YOUR_HOURS_WEEKDAY',                   manifest.get('hours_weekday', ''),                           has('hours_weekday')),
        ('YOUR_HOURS_FRIDAY',                    manifest.get('hours_friday', ''),                            has('hours_friday')),
        ('YOUR_HOURS_SATURDAY',                  manifest.get('hours_saturday', ''),                          has('hours_saturday')),
        # Contact
        ('YOUR_PHONE',                           manifest.get('phone', ''),                                   has('phone')),
        ('YOUR_ADDRESS',                         manifest.get('address', ''),                                 has('address')),
        ('YOUR_CITY',                            manifest.get('city', ''),                                    has('city')),
        # WhatsApp / payment phone (template uses single quotes around the literal)
        ("'YOUR_WHATSAPP_PHONE'",                "'" + manifest.get('phone', '') + "'",                       has('phone')),
        ("'YOUR_WHATSAPP_BOT_URL'",              "'" + manifest.get('whatsapp_bot_url', '') + "'",            has('whatsapp_bot_url')),
        ('src="YOUR_WHATSAPP_BOT_URL/qr-view"',  'src="' + manifest.get('whatsapp_bot_url', '') + '/qr-view"', has('whatsapp_bot_url')),
        # Google Places
        ('YOUR_GOOGLE_PLACES_API_KEY',           manifest.get('google_places_key', ''),                       has('google_places_key')),
        # Firebase + DB
        ('YOUR_FIREBASE_API_KEY',                manifest.get('firebase_api_key', ''),                        has('firebase_api_key')),
        ('YOUR_DATABASE_URL',                    manifest.get('database_url', ''),                            has('database_url')),
        # Manager passwords (full const-declaration match)
        ('MANAGER_PASSWORD_HASH = "DEMO_NO_PASSWORD";',
            'MANAGER_PASSWORD_HASH = "' + manifest.get('manager_password_hash', '') + '";',
            has('manager_password_hash')),
        ("MANAGER_PANEL_PASSWORD = '1';",
            "MANAGER_PANEL_PASSWORD = '" + manifest.get('manager_panel_password', '') + "';",
            has('manager_panel_password')),
    ]

    for find, replace, cond in rules:
        if cond:
            text = text.replace(find, replace)

    sys.stdout.buffer.write(text.encode('utf-8'))


if __name__ == '__main__':
    main()
