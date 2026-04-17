// fix-created-at.js
// מתקן את כל ההזמנות שיש להן createdAt כ-string → ממיר למספר (timestamp)
// Usage: node fix-created-at.js

const FB_URL = "https://pizza-nemo-default-rtdb.europe-west1.firebasedatabase.app";

async function run() {
  console.log('📥 טוען הזמנות מ-Firebase...');
  const res = await fetch(`${FB_URL}/orders.json`);
  const data = await res.json();
  if (!data) { console.log('אין הזמנות'); return; }

  const updates = {};
  let fixed = 0;

  for (const [key, order] of Object.entries(data)) {
    if (typeof order.createdAt === 'string') {
      const ts = new Date(order.createdAt).getTime();
      if (!isNaN(ts)) {
        updates[key + '/createdAt'] = ts;
        fixed++;
      }
    }
    // גם אם אין createdAt בכלל — בנה מתאריך+שעה
    if (!order.createdAt && order.date && order.time) {
      try {
        const [d, m, y] = order.date.split('.').map(Number);
        const [h, min] = order.time.split(':').map(Number);
        const ts = new Date(y, m - 1, d, h, min).getTime();
        if (!isNaN(ts)) {
          updates[key + '/createdAt'] = ts;
          fixed++;
        }
      } catch(e) {}
    }
  }

  if (fixed === 0) { console.log('✅ אין מה לתקן'); return; }

  console.log(`🔧 מתקן ${fixed} הזמנות...`);
  await fetch(`${FB_URL}/orders.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  console.log(`✅ תוקנו ${fixed} הזמנות בהצלחה!`);
}

run().catch(console.error);
