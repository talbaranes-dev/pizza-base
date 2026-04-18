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
- [🤖] `YOUR_DISPLAY_NAME` — שם העסק בעברית, מופיע בכותרות, Footer, עמודי הצהרת נגישות/פרטיות/תנאי שימוש
- [🤖] `YOUR_PHONE` — טלפון, מופיע בכל המקומות (tel: links, Waze, הודעות בוט, Footer)
- [🤖] `YOUR_ADDRESS` — רחוב ומספר (Waze, Footer, עמודים משפטיים)
- [🤖] `YOUR_CITY` — עיר (Waze, Footer, בדיקת איזור משלוחים בצד לקוח — `address.includes('YOUR_CITY')`)

> הסוכן שואל על פרטים אלה ב-Stage 0 ומחליף אותם אוטומטית בכל ה-HTML. אם המשתמש דילג על שדה מסוים, ה-placeholder נשאר בקוד והאתר עדיין רץ — חוץ מהבדיקה של `YOUR_CITY` שתחסום משלוחים אם העיר חסרה. הסוכן מתריע על זה ב-Stage 0.

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

## 7א. שעות פעילות — תצוגה בלבד (אופציונלי, דלג = ברירת מחדל)
- [🤖] `YOUR_HOURS_WEEKDAY` — שעות תצוגה לימים א'-ה' (ברירת מחדל: `13:00 - 23:00`)
- [🤖] `YOUR_HOURS_FRIDAY` — שעות תצוגה ליום שישי (ברירת מחדל: `13:00 - 15:00`, אפשר `סגור`)
- [🤖] `YOUR_HOURS_SATURDAY` — שעות תצוגה לשבת / מוצ"ש (ברירת מחדל: `19:00 - 23:00`, אפשר `סגור`)

> **שעות פעילות הן טקסט בלבד** — הן מופיעות בתחתית האתר ולא משפיעות על פתוח/סגור. מי ששולט על פתיחת/סגירת אתר ההזמנות הוא **כפתור "הפעל בוט" / "כבה בוט" בפאנל המנהל בלבד**, שכותב ל-`settings/storeOpen` ב-Firebase. תרצה אוטומציה זמנית עתידית? אפשר דרך הגדרות אוטומטיות בפאנל המנהל (כותב ל-`settings/autoSchedule`), אבל זה רק רץ כשהפאנל פתוח במחשב/טלפון של המנהל.

## 8. דומיינים והעלאה
- [🤖] `YOUR_ORDER_DOMAIN` → `<name>.bybe.co.il`
- [🤖] `YOUR_ADMIN_DOMAIN` → `<name>-admin.bybe.co.il`
- [🤖] Deploy + DNS (CNAME לשני הדומיינים) + SSL

---
סדר מומלץ: Firebase > פרטי עסק > תפריט > סיסמאות > השאר
