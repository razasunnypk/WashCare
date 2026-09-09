const DB_NAME = 'washcare-db';
const DB_VERSION = 2;
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
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    req.onerror = () => reject(req.error || new Error('Unable to open local database.'));
    req.onblocked = () => reject(new Error('Database upgrade is blocked by another open tab. Close other WashCare tabs and retry.'));
  });
}

async function withTransaction(storeNames, mode, work) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(storeNames, mode);
      let result;
      try { result = work(tx); } catch (err) { reject(err); return; }
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('Database transaction failed.'));
      tx.onabort = () => reject(tx.error || new Error('Database transaction aborted.'));
    });
  } finally { db.close(); }
}

export async function dbPut(store, value) {
  await withTransaction(store, 'readwrite', tx => tx.objectStore(store).put(value));
  return value;
}

export async function dbDelete(store, id) {
  await withTransaction(store, 'readwrite', tx => tx.objectStore(store).delete(id));
  return true;
}

export async function dbGet(store, id) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const req = db.transaction(store, 'readonly').objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error || new Error('Database read failed.'));
    });
  } finally { db.close(); }
}

export async function dbAll(store) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const req = db.transaction(store, 'readonly').objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error || new Error('Database read failed.'));
    });
  } finally { db.close(); }
}

export async function dbClearAll() {
  await withTransaction(STORES, 'readwrite', tx => STORES.forEach(store => tx.objectStore(store).clear()));
  return true;
}

export async function exportDatabase() {
  const out = { schemaVersion: DB_VERSION, exportedAt: new Date().toISOString(), stores: {} };
  for (const store of STORES) out.stores[store] = await dbAll(store);
  return out;
}

export async function importDatabase(payload) {
  if (!payload || typeof payload !== 'object' || !payload.stores || typeof payload.stores !== 'object') {
    throw new Error('Invalid backup file.');
  }
  const rowsByStore = {};
  for (const store of STORES) {
    rowsByStore[store] = Array.isArray(payload.stores[store]) ? payload.stores[store] : [];
    for (const row of rowsByStore[store]) {
      if (!row || typeof row !== 'object' || !row.id) throw new Error(`Invalid record in ${store}.`);
    }
  }
  await dbClearAll();
  for (const store of STORES) for (const row of rowsByStore[store]) await dbPut(store, row);
  return true;
}
