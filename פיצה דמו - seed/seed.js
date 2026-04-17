/**
 * Seed script for "פיצה דמו" — generates ~500 customers, ~7000 orders over 2 years,
 * 6 employees with attendance, deals, and settings.
 * Run: node seed.js   (Node 18+)
 */

const DB_URL = "https://pizza-nemo-default-rtdb.europe-west1.firebasedatabase.app";

// ─── HELPERS ───
async function fbSet(path, data) {
  const r = await fetch(`${DB_URL}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`);
  return r.json();
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}
function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function formatDate(d) {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}
function formatTime(h, m) {
  return `${pad(h)}:${pad(m)}`;
}

// ─── NAMES DATA ───
const FIRST_NAMES = [
  "יוסי","דני","משה","אבי","רון","גיל","עמית","איתי","נועם","אורי",
  "שי","תומר","יונתן","אלון","עידו","ניר","רועי","עומר","איתמר","דביר",
  "יעל","מיכל","שירה","נועה","דנה","רונית","אורלי","טלי","ענת","שרון",
  "ליאת","הילה","מאיה","רותם","אפרת","קרן","סיגל","גלית","אלינור","תמר",
  "ליאור","עדי","אריאל","דור","סהר","איילת","לירון","שחר","יובל","נתנאל",
  "אייל","בועז","אסף","גדעון","חיים","אהרון","ברוך","דוד","אליהו","יצחק",
  "רחל","לאה","שרה","רבקה","חנה","מרים","דבורה","אסתר","צפורה","בתיה",
];
const LAST_NAMES = [
  "כהן","לוי","מזרחי","פרץ","ביטון","אברהם","דהן","אגבריה","חדד","עמר",
  "שמעון","אזולאי","דוד","מלכה","בן דוד","רוזנברג","פרידמן","גולדשטיין","ברק","שלום",
  "גבאי","יוסף","חיים","נחמיאס","סויסה","טובי","אלמוג","בכר","זהבי","צדוק",
  "וקנין","מרציאנו","עטיה","בן שמעון","כץ","אוחנה","רפפורט","בנימין","שטרן","הלוי",
];

const STREETS = [
  "הרצל","בן גוריון","ויצמן","ז'בוטינסקי","רוטשילד","דיזנגוף","אלנבי","בלפור",
  "סוקולוב","בן יהודה","אחד העם","נורדאו","ביאליק","גורדון","ארלוזורוב","פינסקר",
  "קינג ג'ורג'","שינקין","מאפו","טשרניחובסקי","הנביאים","יפו","עמק רפאים","הגפן",
  "התמר","הדקל","הברוש","האלון","הזית","הרימון","הגאולה","העצמאות","השלום","החירות",
  "רמבם","רשי","הרמבן","אבן גבירול","ספיר","הנשיא","הפלמח","קרליבך",
];

const CITIES = [
  "תל אביב","ירושלים","חיפה","ראשון לציון","פתח תקווה","נתניה","באר שבע",
  "הרצליה","רמת גן","גבעתיים","בני ברק","חולון","רעננה","כפר סבא","הוד השרון","רמת השרון",
];

const NOTES = [
  "","","","","","","","",
  "בלי זיתים","חריף מאוד","לחתוך ל-8","לחתוך ל-12","בלי בצל","אקסטרה רוטב",
  "בלי גבינה בחצי","להוסיף רוטב בצד","לא לצלצל בדלת","לשים ליד הדלת",
  "קומה 3 ימין","להתקשר שהגעתם","הילד אלרגי לאגוזים","טבעוני","ללא גלוטן",
  "מהר בבקשה","ליום הולדת","לא חריף","רוטב בצד","בלי בולגרית",
];

// ─── MENU DATA (matching the app HTML) ───
// TODO: Add your menu items here
// Example format:
// { category: "פיצות משפחתיות", items: [{ name: "משפחתית — נפוליטנה", price: 62 }] }
const MENU = [];

// TODO: Add your toppings here
const TOPPINGS_REGULAR = [];
const TOPPINGS_PREMIUM = [];

const PAYMENT_METHODS = ["cash", "credit", "bit", "paybox"];
const PAYMENT_WEIGHTS = [30, 40, 20, 10];

// ─── GENERATE CUSTOMERS ───
function generateCustomers(count) {
  const customers = {};
  const phoneSet = new Set();
  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    let phone;
    do {
      const prefix = pick(["050", "052", "053", "054", "055", "058"]);
      phone = `${prefix}-${rand(1000000, 9999999)}`;
    } while (phoneSet.has(phone));
    phoneSet.add(phone);

    const street = pick(STREETS);
    const houseNum = rand(1, 120);
    const city = pick(CITIES);
    const address = `${street} ${houseNum}, ${city}`;

    const isProblematic = Math.random() < 0.03;
    const key = `cust_${i}`;
    customers[key] = {
      name,
      phone,
      address,
      createdAt: Date.now() - rand(0, 730 * 24 * 3600 * 1000),
      orderCount: 0,
      lastOrderDate: "",
      marketingConsent: Math.random() < 0.6,
      problematic: isProblematic,
      problematicNote: isProblematic
        ? pick(["לא שילם פעמיים", "בעיות חוזרות", "תלונות רבות", "לא פתח דלת", "ביטל פעמיים"])
        : "",
      orders: [], // will be populated after order generation
    };
  }
  return customers;
}

// ─── GENERATE A SINGLE ORDER ───
function generateOrder(id, date, customerList, custKeys, forceStatus) {
  const custKey = pick(custKeys);
  const cust = customerList[custKey];

  const hour = weightedPick(
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    [5, 15, 12, 8, 4, 4, 6, 18, 20, 15, 8, 3]
  );
  const minute = rand(0, 59);
  const timeStr = formatTime(hour, minute);
  const dateStr = formatDate(date);

  const isDelivery = Math.random() < 0.6;
  const type = isDelivery ? "delivery" : "pickup";
  const deliveryFee = isDelivery ? 15 : 0;

  // Generate items (1-5 items per order)
  const numItems = weightedPick([1, 2, 3, 4, 5], [15, 35, 30, 15, 5]);
  const items = [];

  for (let i = 0; i < numItems; i++) {
    const catIdx = weightedPick(
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [35, 15, 8, 8, 6, 3, 4, 15, 6]
    );
    const cat = MENU[catIdx];
    const item = pick(cat.items);
    const qty = catIdx >= 7 ? rand(1, 3) : 1;

    const orderItem = {
      name: item.name,
      price: item.price * qty,
      basePrice: item.price,
      qty,
      toppings: [],
      extraToppings: [],
      itemNote: "",
      isDeal: false,
      dealLocked: false,
      _dealGroupKey: "",
      _dealName: "",
      freeToppings: 0,
    };

    // Add toppings to נפוליטנה only
    if (item.name.includes("נפוליטנה") && Math.random() < 0.5) {
      const numToppings = rand(1, 4);
      const allToppings = [...TOPPINGS_REGULAR, ...TOPPINGS_PREMIUM];
      const selected = new Set();
      for (let t = 0; t < numToppings; t++) {
        const topping = pick(allToppings);
        if (!selected.has(topping)) {
          selected.add(topping);
          const numQuarters = weightedPick([4, 2, 1], [50, 30, 20]);
          if (numQuarters === 4) {
            orderItem.toppings.push(topping);
          } else {
            const quarters = [1, 2, 3, 4];
            const selectedQ = quarters.sort(() => Math.random() - 0.5).slice(0, numQuarters);
            selectedQ.forEach((q) => orderItem.toppings.push(`רבע ${q} — ${topping}`));
          }
          const isPremium = TOPPINGS_PREMIUM.includes(topping);
          const isFamily = item.name.includes("משפחתית");
          const pricePerTopping = isPremium ? (isFamily ? 8 : 6) : isFamily ? 6 : 5;
          const fraction = numQuarters / 4;
          orderItem.price += Math.round(pricePerTopping * fraction);
        }
      }
    }

    if (Math.random() < 0.1) {
      orderItem.itemNote = pick(["בלי זיתים", "אקסטרה רוטב", "חריף", "בלי בצל", "פחות גבינה"]);
    }

    items.push(orderItem);
  }

  const subtotal = items.reduce((sum, it) => sum + it.price, 0);
  const discount = Math.random() < 0.08 ? rand(5, 20) : 0;
  const total = Math.max(subtotal - discount + deliveryFee, 0);

  const paymentMethod = weightedPick(PAYMENT_METHODS, PAYMENT_WEIGHTS);

  let status;
  if (forceStatus) {
    status = forceStatus;
  } else {
    status = "done";
  }

  const source = weightedPick(["customer", "manager"], [70, 30]);
  const createdAt = date.getTime() + hour * 3600000 + minute * 60000;

  // Update customer stats
  cust.orderCount++;
  cust.lastOrderDate = dateStr;
  cust._key = custKey;

  return {
    id,
    name: cust.name,
    phone: cust.phone,
    address: isDelivery ? cust.address : "",
    floor: isDelivery ? String(rand(0, 8)) : "",
    apt: isDelivery ? String(rand(1, 30)) : "",
    type,
    date: dateStr,
    time: timeStr,
    items,
    total,
    deliveryFee,
    discount,
    notes: pick(NOTES),
    paymentMethod,
    paymentStatus: Math.random() < 0.92 ? "paid" : "unpaid",
    status,
    source,
    createdAt,
    approvedAt: status !== "pending" ? createdAt + rand(60000, 600000) : 0,
    marketingConsent: cust.marketingConsent,
    estimatedTime: isDelivery ? `${rand(25, 55)} דקות` : `${rand(15, 35)} דקות`,
    _chatId: "",
    _custKey: custKey,
  };
}

// ─── GENERATE DEALS ───
function generateDeals() {
  // TODO: Add your deals here
  return {};
}

// ─── GENERATE EMPLOYEES WITH ATTENDANCE ───
function generateEmployees() {
  // TODO: Add your employees here
  // Example: { key: "emp_1", name: "שם עובד", role: "תפקיד" }
  const empData = [];

  const employees = {};
  const today = new Date(2026, 2, 23); // 23.03.2026
  const threeMonthsAgo = new Date(2025, 11, 23); // ~3 months back

  for (const emp of empData) {
    const attendance = [];
    const current = new Date(threeMonthsAgo);

    while (current <= today) {
      // Each employee works 4-5 days per week; skip ~2-3 days
      if (Math.random() < 0.35) {
        // day off
        current.setDate(current.getDate() + 1);
        continue;
      }

      const entryHour = rand(10, 15); // shift start between 10:00-15:00
      const entryMin = rand(0, 59);
      const shiftLength = rand(6, 9); // 6-9 hour shift
      const exitHour = Math.min(entryHour + shiftLength, 23);
      const exitMin = exitHour === 23 ? 0 : rand(0, 59);

      const hours = (exitHour + exitMin / 60 - (entryHour + entryMin / 60)).toFixed(1);

      attendance.push({
        date: formatDate(current),
        entry: formatTime(entryHour, entryMin),
        exit: formatTime(exitHour, exitMin),
        hours,
      });

      current.setDate(current.getDate() + 1);
    }

    employees[emp.key] = {
      name: emp.name,
      pin: "",
      role: emp.role,
      attendance,
    };
  }

  return employees;
}

// ─── MAIN ───
async function main() {
  console.log("🍕 פיצה דמו - Seed Script");
  console.log("==========================\n");

  // Step 1: Wipe DB
  console.log("🗑️  מנקה נתונים קיימים...");
  await fbSet("", null);
  console.log("   ✅ נוקה!\n");

  // Step 2: Generate customers (~500)
  console.log("👥 מייצר 800 לקוחות...");
  const customers = generateCustomers(800);
  const custKeys = Object.keys(customers);
  console.log("   ✅ נוצרו!\n");

  // Step 3: Generate orders (~7000 over 2 years, ~10/day avg)
  console.log("📦 מייצר הזמנות לשנתיים (23.03.2024 - 23.03.2026)...");
  const startDate = new Date(2024, 2, 23);
  const endDate = new Date(2026, 2, 23);

  const orders = {};
  let orderId = 1;
  let totalOrders = 0;

  // We need ~36500 orders over ~731 days => ~50/day average
  // We'll target ~50/day with weekend/seasonal variation
  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const month = current.getMonth();

    // Check if this is the last day (today) - reserve 4 orders for pending
    const isToday =
      current.getFullYear() === 2026 &&
      current.getMonth() === 2 &&
      current.getDate() === 23;

    let baseOrders = 50;

    // Weekend boost
    if (dayOfWeek === 5) baseOrders = Math.round(baseOrders * 1.5); // Friday
    else if (dayOfWeek === 6) baseOrders = Math.round(baseOrders * 1.7); // Saturday
    else if (dayOfWeek === 4) baseOrders = Math.round(baseOrders * 1.15); // Thursday

    // Seasonal variation
    if (month >= 10 || month <= 2) baseOrders = Math.round(baseOrders * 1.15); // winter boost
    else if (month >= 6 && month <= 8) baseOrders = Math.round(baseOrders * 0.85); // summer dip

    // Add randomness +/-25%
    let numOrders = Math.round(baseOrders * (0.75 + Math.random() * 0.5));
    if (numOrders < 3) numOrders = 3;

    // Generate all orders for this day, then sort by time, then assign IDs
    const dayOrders = [];
    const actualCount = isToday ? Math.max(numOrders - 4, 2) : numOrders;
    for (let i = 0; i < actualCount; i++) {
      dayOrders.push(generateOrder(0, new Date(current), customers, custKeys, null));
    }
    if (isToday) {
      for (let i = 0; i < 4; i++) {
        const o = generateOrder(0, new Date(current), customers, custKeys, "pending");
        o.paymentStatus = "unpaid";
        o.approvedAt = 0;
        dayOrders.push(o);
      }
    }
    // Sort by time chronologically
    dayOrders.sort((a, b) => {
      const [ah, am] = (a.time || "0:0").split(":").map(Number);
      const [bh, bm] = (b.time || "0:0").split(":").map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });
    // Assign sequential IDs
    for (const order of dayOrders) {
      order.id = orderId;
      orders[`order_${String(orderId).padStart(6, "0")}`] = order;
      orderId++;
      totalOrders++;
    }

    current.setDate(current.getDate() + 1);
  }
  console.log(`   ✅ נוצרו ${totalOrders} הזמנות!\n`);

  // Step 4: Populate customer order summaries (max 20 recent per customer)
  console.log("🔗 מקשר הזמנות ללקוחות...");
  // Build a map of custKey -> orders
  const custOrderMap = {};
  const orderKeys = Object.keys(orders);
  for (const ok of orderKeys) {
    const o = orders[ok];
    const ck = o._custKey;
    if (!custOrderMap[ck]) custOrderMap[ck] = [];
    custOrderMap[ck].push({
      id: o.id,
      total: o.total,
      date: o.date,
      time: o.time,
      type: o.type,
      items: o.items.map((it) => it.name),
    });
  }
  // Assign last 20 to each customer
  for (const ck of custKeys) {
    const cOrders = custOrderMap[ck] || [];
    // Orders are already in chronological order (generated sequentially)
    customers[ck].orders = cOrders.slice(-20);
  }
  // Clean up _custKey from orders
  for (const ok of orderKeys) {
    delete orders[ok]._custKey;
  }
  // Clean up _key from customers
  for (const ck of custKeys) {
    delete customers[ck]._key;
  }
  console.log("   ✅ הזמנות קושרו!\n");

  // Step 5: Deals
  console.log("🏷️  מייצר מבצעים...");
  const deals = generateDeals();
  console.log("   ✅ נוצרו 6 מבצעים!\n");

  // Step 6: Employees with attendance
  console.log("👷 מייצר 6 עובדים עם נוכחות...");
  const employees = generateEmployees();
  console.log("   ✅ נוצרו!\n");

  // Step 7: Settings
  const settings = {
    deliveryFee: 15,
    storeOpen: true,
  };

  // Step 8: Upload to Firebase
  console.log("☁️  מעלה נתונים ל-Firebase...");

  console.log("   📤 מעלה לקוחות...");
  await fbSet("customers", customers);
  console.log("   ✅ לקוחות הועלו!");

  console.log("   📤 מעלה מבצעים...");
  await fbSet("deals", deals);
  console.log("   ✅ מבצעים הועלו!");

  console.log("   📤 מעלה עובדים...");
  await fbSet("employees", employees);
  console.log("   ✅ עובדים הועלו!");

  console.log("   📤 מעלה תפריט...");
  await fbSet("menu", MENU);
  console.log("   ✅ תפריט הועלה!");

  console.log("   📤 מעלה הגדרות...");
  await fbSet("settings", settings);
  console.log("   ✅ הגדרות הועלו!");

  console.log("   📤 מעלה orderCounter...");
  await fbSet("orderCounter", orderId - 1);
  console.log("   ✅ orderCounter הועלה!");

  // Upload orders in chunks of 2000
  console.log(`   📤 מעלה ${totalOrders} הזמנות (ב-chunks)...`);
  const CHUNK_SIZE = 2000;

  for (let i = 0; i < orderKeys.length; i += CHUNK_SIZE) {
    const chunk = {};
    const end = Math.min(i + CHUNK_SIZE, orderKeys.length);
    for (let j = i; j < end; j++) {
      chunk[orderKeys[j]] = orders[orderKeys[j]];
    }

    const r = await fetch(`${DB_URL}/orders.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chunk),
    });
    if (!r.ok) throw new Error(`PATCH orders chunk failed: ${r.status}`);

    console.log(
      `   📦 chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(orderKeys.length / CHUNK_SIZE)} (${end}/${orderKeys.length} הזמנות)`
    );
  }
  console.log("   ✅ כל ההזמנות הועלו!\n");

  console.log("🎉 סיום! כל הנתונים הפיקטיביים הועלו בהצלחה.");
  console.log(`   👥 ${Object.keys(customers).length} לקוחות`);
  console.log(`   📦 ${totalOrders} הזמנות`);
  console.log(`   🏷️  ${Object.keys(deals).length} מבצעים`);
  console.log(`   👷 ${Object.keys(employees).length} עובדים`);
  console.log(`\n   🔗 DB: ${DB_URL}`);
}

main().catch((err) => {
  console.error("❌ שגיאה:", err);
  process.exit(1);
});
