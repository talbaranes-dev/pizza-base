# מדריך הקמת פיצרייה חדשה

> **🤖 אוטומטי** = הסוכן (orchestrator) עושה זאת אוטומטית
> **✋ ידני** = דרוש טיפול ידני לאחר ההקמה

## 1. Firebase (חובה)
- [🤖] ליצור פרויקט Firebase חדש
- [🤖] להחליף `YOUR_FIREBASE_API_KEY` (בקבצי HTML)
- [🤖] להחליף `YOUR_FIREBASE_DB_URL` (בקבצי HTML)
- [🤖] להחליף `YOUR_PROJECT_ID` (בקבצי .firebaserc)
- [🤖] ליצור Hosting sites (`<name>-order`, `<name>-admin`)
- [🤖] ליצור RTDB ב-region הנכון
- [🤖] להעלות database.rules.json לפרויקט
- [🤖] ליצור משתמש email + password ב-Firebase Authentication (הסוכן יוצר אוטומטית ב-Stage 5.5)

## 2. פרטי העסק
- [✋] להחליף `YOUR_PHONE` — טלפון העסק (אין placeholder בHTML, הוסף ידנית)
- [✋] להחליף `YOUR_ADDRESS` — כתובת מלאה (אין placeholder בHTML, הוסף ידנית)
- [✋] להחליף `YOUR_CITY` — שם העיר (אין placeholder בHTML, הוסף ידנית)
- [✋] להחליף "PizzaDemo" — שם העסק בכותרות (אין placeholder בHTML, הוסף ידנית)

> הסוכן שואל על פרטים אלה ב-Stage 0 ומציג אותם בסיכום הסופי לצורך העתקה-הדבקה ידנית.

## 3. תפריט
- [✋] למלא מערך `MENU` בשני קבצי HTML (או דרך seed.js)
- [✋] למלא `TOPPINGS_REGULAR`, `TOPPINGS_PREMIUM`, `TOPPINGS_SPECIAL`
- [✋] למלא `TOPPING_EMOJI`
- [✋] למלא `MARGHERITA_NAMES` ו-`MARGHERITA_FAMILY_ONLY`
- [✋] להוסיף מבצעים (דרך הממשק או seed.js)
- [✋] להוסיף תמונות מוצרים לתיקיות images/ ולמלא `MENU_IMAGES`

## 4. סיסמאות
- [🤖] `MANAGER_PASSWORD_HASH` + `MANAGER_PANEL_PASSWORD` — סיסמת פאנל מנהל בלבד
- ℹ️ אין סיסמת לקוח — כל לקוח מזמין ישירות ללא הרשמה

## 5. WhatsApp Bot (אופציונלי)
- [✋] להעלות בוט WhatsApp לשרת (Render.com או אחר)
- [🤖] `YOUR_WHATSAPP_BOT_URL` — הסוכן שואל ומחליף אם סופק
- [🤖] `YOUR_WHATSAPP_PHONE` — הסוכן שואל ומחליף אם סופק

## 6. תשלומים (אופציונלי)
- [✋] להחליף `YOUR_PAYMENT_PHONE` — מספר סוחר BitPay/Paybox (אין placeholder בHTML, הוסף ידנית)

## 7. Google APIs (אופציונלי)
- [🤖] `YOUR_GOOGLE_PLACES_API_KEY` — הסוכן שואל ומחליף אם סופק

## 8. דומיינים והעלאה
- [🤖] `YOUR_ORDER_DOMAIN` → `<name>.bybe.co.il`
- [🤖] `YOUR_ADMIN_DOMAIN` → `<name>-admin.bybe.co.il`
- [🤖] Deploy + DNS (CNAME לשני הדומיינים) + SSL

---
סדר מומלץ: Firebase > פרטי עסק > תפריט > סיסמאות > השאר
