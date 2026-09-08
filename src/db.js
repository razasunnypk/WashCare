const DB_NAME = 'washcare-db';
const DB_VERSION = 1;
export const STORES = ['settings','customers','items','orders','order_items','payments','expenses','inventory','inventory_movements','employees','attendance','deliveries','loyalty_transactions','cash_transactions','audit_logs'];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut(store, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbDelete(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGet(store, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store).objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store).objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbClearAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES, 'readwrite');
    for (const store of STORES) tx.objectStore(store).clear();
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function exportDatabase() {
  const out = { schemaVersion: DB_VERSION, exportedAt: new Date().toISOString(), stores: {} };
  for (const store of STORES) out.stores[store] = await dbAll(store);
  return out;
}

export async function importDatabase(payload) {
  if (!payload || typeof payload !== 'object' || !payload.stores) throw new Error('Invalid backup file.');
  await dbClearAll();
  for (const store of STORES) {
    const rows = Array.isArray(payload.stores[store]) ? payload.stores[store] : [];
    for (const row of rows) await dbPut(store, row);
  }
}
