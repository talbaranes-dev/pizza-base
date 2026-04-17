# מדריך הקמת פיצרייה חדשה

## 1. Firebase (חובה)
- [ ] ליצור פרויקט Firebase חדש ב-firebase.google.com
- [ ] להחליף `YOUR_FIREBASE_DB_URL` (בקבצי HTML + seed)
- [ ] להחליף `YOUR_FIREBASE_API_KEY` (בקבצי HTML)
- [ ] להחליף `YOUR_PROJECT_ID` (בקבצי .firebaserc)
- [ ] להחליף `YOUR_ADMIN_TARGET` ו-`YOUR_ORDER_TARGET` (ב-.firebaserc)
- [ ] ליצור משתמש email + password ב-Firebase Authentication
- [ ] להעלות database.rules.json לפרויקט

## 2. פרטי העסק
- [ ] להחליף `YOUR_PHONE` — טלפון העסק
- [ ] להחליף `YOUR_ADDRESS` — כתובת מלאה
- [ ] להחליף `YOUR_CITY` — שם העיר
- [ ] להחליף "PizzaDemo" — שם העסק בכותרות

## 3. תפריט
- [ ] למלא מערך `MENU` בשני קבצי HTML (או דרך seed.js)
- [ ] למלא `TOPPINGS_REGULAR`, `TOPPINGS_PREMIUM`, `TOPPINGS_SPECIAL`
- [ ] למלא `TOPPING_EMOJI`
- [ ] למלא `MARGHERITA_NAMES` ו-`MARGHERITA_FAMILY_ONLY`
- [ ] להוסיף מבצעים (דרך הממשק או seed.js)
- [ ] להוסיף תמונות מוצרים לתיקיות images/ ולמלא `MENU_IMAGES`

## 4. סיסמאות
- [ ] להחליף `YOUR_PASSWORD_HASH` — SHA-256 של סיסמת האפליקציה
- [ ] להחליף `YOUR_MANAGER_PASSWORD` — סיסמת פאנל מנהל

## 5. WhatsApp Bot (אופציונלי)
- [ ] להעלות בוט WhatsApp לשרת (Render.com או אחר)
- [ ] להחליף `YOUR_WHATSAPP_BOT_URL` — כתובת השרת
- [ ] להחליף `YOUR_WHATSAPP_PHONE` — מספר WhatsApp

## 6. תשלומים (אופציונלי)
- [ ] להחליף `YOUR_PAYMENT_PHONE` — מספר סוחר BitPay/Paybox

## 7. Google APIs (אופציונלי)
- [ ] להחליף `YOUR_GOOGLE_PLACES_API_KEY` — להשלמת כתובות

## 8. דומיינים והעלאה
- [ ] להחליף `YOUR_ORDER_DOMAIN` — דומיין דף ההזמנות
- [ ] להחליף `YOUR_ADMIN_DOMAIN` — דומיין פאנל הניהול
- [ ] להעלות ל-Netlify / Firebase Hosting

---
סדר מומלץ: Firebase > פרטי עסק > תפריט > סיסמאות > השאר
