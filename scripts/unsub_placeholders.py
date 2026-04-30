#!/usr/bin/env python3
"""Reverse the placeholder substitutions: account-form -> base placeholder form.

Usage:
    python unsub_placeholders.py <manifest.json> < input.txt > output.txt

Used by promote-to-base-agent. Reads a file in its substituted (account)
form, applies the reverse of the substitution table from sub_placeholders.py,
and writes the placeholder (base) form to stdout.

Critical: rules are applied in order of LONGEST VALUE FIRST. If we processed
the bare `<new_name>` first, it would corrupt longer values that contain it
(e.g., `<new_name>-admin.bybe.co.il`). Forward sub_placeholders has the
opposite issue and solves it via "qualified before bare"; here we solve it
via length-descending sort.

Empty manifest fields are skipped — there's no value to map back from.
"""

import io
import json
import sys


def main():
    if len(sys.argv) != 2:
        sys.stderr.write("usage: unsub_placeholders.py <manifest.json>\n")
        sys.exit(2)

    with open(sys.argv[1], encoding='utf-8') as f:
        manifest = json.load(f)

    text = sys.stdin.buffer.read().decode('utf-8')

    new_name = manifest.get('new_name', '')
    if not new_name:
        sys.stderr.write("manifest is missing required field: new_name\n")
        sys.exit(2)

    # (placeholder, value) pairs — same set as sub_placeholders.py.
    # We intentionally include every rule; missing-value rules get filtered
    # out below before sorting.
    pairs = [
        ('YOUR_PROJECT_ID-order',                new_name + '-order'),
        ('YOUR_PROJECT_ID-admin',                new_name + '-admin'),
        ('YOUR_PROJECT_ID.bybe.co.il',           new_name + '.bybe.co.il'),
        ('YOUR_PROJECT_ID',                      new_name),
        ('YOUR_DISPLAY_NAME',                    manifest.get('display_name', '')),
        ('YOUR_ORDER_DOMAIN',                    new_name + '.bybe.co.il'),
        ('YOUR_ADMIN_DOMAIN',                    new_name + '-admin.bybe.co.il'),
        ('YOUR_DOMAIN',                          new_name + '.bybe.co.il'),
        ('YOUR_HOURS_WEEKDAY',                   manifest.get('hours_weekday', '')),
        ('YOUR_HOURS_FRIDAY',                    manifest.get('hours_friday', '')),
        ('YOUR_HOURS_SATURDAY',                  manifest.get('hours_saturday', '')),
        ('YOUR_PHONE',                           manifest.get('phone', '')),
        ('YOUR_ADDRESS',                         manifest.get('address', '')),
        ('YOUR_CITY',                            manifest.get('city', '')),
        # WhatsApp/payment phone — quoted form
        ("'YOUR_WHATSAPP_PHONE'",                "'" + manifest.get('phone', '') + "'"),
        ("'YOUR_WHATSAPP_BOT_URL'",              "'" + manifest.get('whatsapp_bot_url', '') + "'"),
        ('src="YOUR_WHATSAPP_BOT_URL/qr-view"',  'src="' + manifest.get('whatsapp_bot_url', '') + '/qr-view"'),
        ('YOUR_GOOGLE_PLACES_API_KEY',           manifest.get('google_places_key', '')),
        ('YOUR_FIREBASE_API_KEY',                manifest.get('firebase_api_key', '')),
        ('YOUR_DATABASE_URL',                    manifest.get('database_url', '')),
        ('MANAGER_PASSWORD_HASH = "DEMO_NO_PASSWORD";',
            'MANAGER_PASSWORD_HASH = "' + manifest.get('manager_password_hash', '') + '";'),
        ("MANAGER_PANEL_PASSWORD = '1';",
            "MANAGER_PANEL_PASSWORD = '" + manifest.get('manager_panel_password', '') + "';"),
    ]

    # Drop rules whose VALUE side is empty / wrapping-only / too short to be
    # uniquely identifying. Reverse-substituting a short common word like
    # "סגור" (which is the canonical hours_saturday value) corrupts hundreds
    # of unrelated UI strings. The forward substitution direction handles
    # short values fine because placeholders ARE unique; the reverse direction
    # has no such guarantee.
    SHORT_VALUE_BYTES_THRESHOLD = 11  # exclude very short values from reverse mapping

    def is_meaningful(placeholder, value):
        if not value:
            return False
        # Empty wrappers — replacing wouldn't accomplish anything useful:
        if value in ("''", '""', 'src=""/qr-view"',
                     'MANAGER_PASSWORD_HASH = "";', "MANAGER_PANEL_PASSWORD = '';"):
            return False
        # Idempotent (placeholder appears as its own value):
        if value == placeholder:
            return False
        # Short values for fields that are visual config — these have a high
        # false-positive rate (e.g. "סגור" / "13:00 - 23:00" / city names
        # appearing in unrelated UI). Reverse-mapping them on whole-file
        # promotes too aggressively. Skip short ones; long ones (full URLs,
        # API keys, hashes) are still safe.
        if placeholder in ('YOUR_HOURS_SATURDAY', 'YOUR_HOURS_FRIDAY',
                           'YOUR_HOURS_WEEKDAY', 'YOUR_CITY', 'YOUR_ADDRESS') \
                and len(value.encode('utf-8')) < SHORT_VALUE_BYTES_THRESHOLD:
            return False
        return True

    pairs = [(p, v) for p, v in pairs if is_meaningful(p, v)]

    # CRITICAL ORDERING: longest value first, so `pizza-bulizz-admin.bybe.co.il`
    # is processed before `pizza-bulizz.bybe.co.il`, which is processed before
    # `pizza-bulizz`. Otherwise the shorter substring would corrupt the longer
    # ones during replacement.
    pairs.sort(key=lambda pv: len(pv[1]), reverse=True)

    for placeholder, value in pairs:
        text = text.replace(value, placeholder)

    sys.stdout.buffer.write(text.encode('utf-8'))


if __name__ == '__main__':
    main()
