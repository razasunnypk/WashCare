import { dbAll, dbPut } from './db.js';
import { uid, nowISO } from './utils.js';
import { APP, DEFAULT_TERMS } from './config.js';

const DEMO_ITEMS = [
  ['Kandura Cotton','Traditional Wear',12,8,6.3], ['Ghatra','Traditional Wear',9,6,4.2],
  ['Shirt','Shirts',10,7,5], ['Trouser','Trousers',11,7.5,5.5], ['Suit','Formal Wear',30,18,12],
  ['Abaya','Dresses',25,16,10], ['Bedsheet','Home Linen',18,12,8], ['Curtain','Home Linen',22,15,10]
];

export async function seedIfEmpty() {
  const stamp = nowISO();
  const [customers, items, employees, inventory, settingsRows] = await Promise.all([
    dbAll('customers'), dbAll('items'), dbAll('employees'), dbAll('inventory'), dbAll('settings')
  ]);
  let changed = false;

  const currentSettings = settingsRows.find(x => x.id === 'business');
  const settings = {
    ...(currentSettings || {}), id:'business', name:currentSettings?.name || APP.name,
    mobile:currentSettings?.mobile || APP.mobile, email:currentSettings?.email || APP.email,
    web:currentSettings?.web || APP.web, address:currentSettings?.address || APP.address,
    vatRate:Number.isFinite(Number(currentSettings?.vatRate)) ? Number(currentSettings.vatRate) : APP.vatRate,
    receiptPrefix:currentSettings?.receiptPrefix || APP.receiptPrefix, terms:currentSettings?.terms || DEFAULT_TERMS,
    currency:currentSettings?.currency || APP.currency, logoUrl:currentSettings?.logoUrl || './assets/washcare-logo.png',
    loyaltyEnabled:currentSettings?.loyaltyEnabled ?? false, loyaltyPointsPer10:Number(currentSettings?.loyaltyPointsPer10 ?? 1),
    defaultFastMultiplier:Number(currentSettings?.defaultFastMultiplier || 1.5), updated_at:stamp
  };
  if (!currentSettings || JSON.stringify(currentSettings) !== JSON.stringify(settings)) { await dbPut('settings', settings); changed = true; }

  if (!customers.length) {
    await dbPut('customers',{id:uid('cus'),customer_code:'CUS-0001',name:'Ahmed Khan',phone:'0501234567',address:'Jumeirah Lake Towers',building:'Tiffany Tower',flat:'1203',loyalty_points:0,total_orders:0,total_spent:0,notes:'Demo customer',active:true,created_at:stamp,updated_at:stamp});
    changed = true;
  }
  if (!items.length) {
    for (const [name,category,dry,wash,iron] of DEMO_ITEMS) await dbPut('items',{id:uid('itm'),name,name_urdu:'',category,dryclean_price:dry,washiron_price:wash,ironing_price:iron,fast_multiplier:1.5,active:true,created_at:stamp,updated_at:stamp});
    changed = true;
  }
  if (!employees.length) {
    await dbPut('employees',{id:uid('emp'),employee_code:'EMP-0001',name:'Admin User',role:'Admin',phone:APP.mobile,salary:0,salary_type:'Monthly',joining_date:stamp.slice(0,10),active:true,created_at:stamp,updated_at:stamp});
    changed = true;
  }
  if (!inventory.length) {
    for (const row of [
      ['Detergent',24,'KG',10,8], ['Packaging Bags',650,'PCS',100,.3], ['Starch',12,'L',4,10]
    ]) await dbPut('inventory',{id:uid('inv'),item_name:row[0],quantity:row[1],unit:row[2],threshold_alert:row[3],cost_per_unit:row[4],supplier:'',active:true,created_at:stamp,updated_at:stamp});
    changed = true;
  }
  if (changed) await dbPut('audit_logs',{id:uid('audit'),action:'System initialization',entity_type:'system',entity_id:'seed',old_value:null,new_value:'WashCare data/config initialized or repaired',reason:'Startup consistency check',user_id:'system',created_at:stamp});
  return changed;
}
