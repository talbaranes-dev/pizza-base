// Daily Orders Generator - Run daily to add realistic orders to the demo
// Usage: node daily-orders.js
// Optional: node daily-orders.js 2026-03-20  (to add orders for a specific date)

const FB_URL = "https://pizza-nemo-default-rtdb.europe-west1.firebasedatabase.app";

const FIRST_NAMES = ["יוסי","דני","מיכל","רונית","אבי","שרה","דוד","רחל","משה","נעמי","אלי","תמר","עומר","יעל","איתי","לינוי","גיל","מאיה","ניר","שירה","עידו","אסתר","בועז","הדר","רועי","ענת","טל","ליאור","נועם","דנה","אריאל","קרן","יונתן","מורן","עמית","סיגל","אורי","נטע","אדם","שלי","תומר","רוני","בן","גלית","איתמר","הילה","עדי","מיטל","ליאם","רוית"];
const LAST_NAMES = ["כהן","לוי","מזרחי","פרץ","ביטון","דהן","אברהם","פרידמן","שלום","חדד","יוסף","בן דוד","אזולאי","גבאי","מלכה","רוזנברג","שמעון","דוד","עמר","בכר","מרציאנו","גולדשטיין","אלון","נחמיאס","בן שמעון","וקנין","הלוי","רפפורט","צדוק","בנימין"];
const STREETS = ["הרצל","רוטשילד","בן יהודה","דיזנגוף","אלנבי","ז'בוטינסקי","ויצמן","הפלמח","סוקולוב","בלפור","שינקין","קינג ג'ורג'","הגפן","התמר","רמבם","השלום","אבן גבירול","הנשיא","ספיר","רנגם"];
const CITIES = ["תל אביב","חיפה","ירושלים","ראשון לציון","פתח תקווה","אשדוד","נתניה","באר שבע","בני ברק","רמת גן","חולון","הרצליה","כפר סבא","רעננה","הוד השרון","גבעתיים","מודיעין","אשקלון","בת ים","רחובות"];
const PAYMENT_METHODS = ["מזומן","אשראי","ביט","פייבוקס"];
// TODO: Add your menu items here
const FAMILY_PIZZAS = [];
const PERSONAL_PIZZAS = [];
const CALZONES = [];
const PASTAS = [];
const DRINKS = [];
const TOPPINGS = [];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pad(n) { return n.toString().padStart(2, '0'); }

async function run() {
  // Parse target date
  const targetDate = process.argv[2] ? new Date(process.argv[2]) : new Date();
  console.log(`📅 Generating orders for: ${targetDate.toLocaleDateString('he-IL')}`);

  // Get current max order ID from orderCounter (publicly readable)
  const counterResp = await fetch(`${FB_URL}/orderCounter.json`);
  const counterVal = await counterResp.json();
  let maxId = (counterVal && counterVal >= 100) ? counterVal : 100;
  console.log(`📊 Current max order ID: ${maxId}`);

  // Get existing customers
  const custResp = await fetch(`${FB_URL}/customers.json`);
  const custData = await custResp.json() || {};
  const custList = Object.entries(custData).map(([k, v]) => ({ ...v, _key: k }));
  console.log(`👥 Existing customers: ${custList.length}`);

  // Generate 20-30 orders
  const orderCount = randInt(20, 30);
  const updates = {};
  let nextId = maxId + 1;

  // Generate chronological times
  const times = [];
  for (let i = 0; i < orderCount; i++) {
    times.push({ hour: randInt(11, 22), minute: randInt(0, 59) });
  }
  times.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  for (let i = 0; i < orderCount; i++) {
    // 70% chance to use existing customer
    // בחר לקוח קיים (רק אם יש לו שם וטלפון), אחרת צור חדש
    const validCustomers = custList.filter(c => c.name && c.phone);
    let custName, custPhone, custAddress;
    if (validCustomers.length > 0 && Math.random() < 0.7) {
      const c = rand(validCustomers);
      custName = c.name;
      custPhone = c.phone;
      custAddress = c.address || (rand(STREETS) + " " + randInt(1, 120) + ", " + rand(CITIES));
    } else {
      custName = rand(FIRST_NAMES) + " " + rand(LAST_NAMES);
      custPhone = `05${randInt(0, 8)}-${randInt(1000000, 9999999)}`;
      custAddress = rand(STREETS) + " " + randInt(1, 120) + ", " + rand(CITIES);
    }

    const isDelivery = Math.random() > 0.5;
    const itemCount = randInt(1, 4);
    const items = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const type = Math.random();
      let name, price;
      if (type < 0.35) {
        name = "משפחתית — " + rand(FAMILY_PIZZAS);
        price = randInt(62, 79);
      } else if (type < 0.55) {
        name = "אישית — " + rand(PERSONAL_PIZZAS);
        price = randInt(38, 48);
      } else if (type < 0.7) {
        name = rand(CALZONES);
        price = randInt(35, 42);
      } else if (type < 0.8) {
        name = rand(PASTAS);
        price = randInt(42, 52);
      } else {
        name = rand(DRINKS);
        price = randInt(8, 15);
      }

      const toppings = [];
      if (name.includes("משפחתית") || name.includes("אישית")) {
        const topCount = Math.random() > 0.6 ? randInt(1, 3) : 0;
        const available = [...TOPPINGS];
        for (let t = 0; t < topCount; t++) {
          const ti = Math.floor(Math.random() * available.length);
          toppings.push(available.splice(ti, 1)[0]);
        }
      }
      total += price;
      items.push({ name, qty: 1, price, toppings: toppings.length ? toppings : undefined });
    }

    if (isDelivery) total += 10;
    const paid = Math.random() > 0.15;
    const payMethod = rand(PAYMENT_METHODS);
    const paymentMethod = payMethod === 'מזומן' ? 'cash' : payMethod === 'אשראי' ? 'credit' : payMethod === 'ביט' ? 'bit' : 'paybox';
    const dateStr = `${pad(targetDate.getDate())}.${pad(targetDate.getMonth() + 1)}.${targetDate.getFullYear()}`;
    const timeStr = `${pad(times[i].hour)}:${pad(times[i].minute)}`;

    // ודא שלמשלוח תמיד יש כתובת וטלפון
    const finalPhone = custPhone || `05${randInt(0, 8)}-${randInt(1000000, 9999999)}`;
    const finalAddress = custAddress || (rand(STREETS) + " " + randInt(1, 120) + ", " + rand(CITIES));
    const finalName = custName || (rand(FIRST_NAMES) + " " + rand(LAST_NAMES));

    const order = {
      id: nextId,
      name: finalName,
      phone: finalPhone,
      address: isDelivery ? finalAddress : "",
      type: isDelivery ? "delivery" : "pickup",
      items,
      total,
      paymentStatus: paid ? "paid" : "unpaid",
      paymentMethod,
      date: dateStr,
      time: timeStr,
      createdAt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), times[i].hour, times[i].minute).getTime(),
      status: "done"
    };

    const key = "order_" + String(nextId).padStart(6, "0");
    updates[key] = order;
    nextId++;
  }

  // Write orders to Firebase
  await fetch(`${FB_URL}/orders.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });

  // Update orderCounter so next run starts from the right ID
  await fetch(`${FB_URL}/orderCounter.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nextId - 1)
  });

  console.log(`✅ Added ${orderCount} orders (IDs ${maxId + 1} - ${nextId - 1})`);
  console.log(`📊 New max order ID: ${nextId - 1}`);
}

run().catch(console.error);
