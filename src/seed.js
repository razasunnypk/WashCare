import { dbAll, dbPut } from './db.js';
import { uid, nowISO } from './utils.js';
import { APP, DEFAULT_TERMS } from './config.js';

export async function seedIfEmpty() {
  const customers = await dbAll('customers');
  if (customers.length) return false;
  const stamp = nowISO();
  const settings = {
    id:'business', name:APP.name, mobile:APP.mobile, email:APP.email, web:APP.web, address:APP.address,
    vatRate:APP.vatRate, receiptPrefix:APP.receiptPrefix, terms:DEFAULT_TERMS, currency:APP.currency,
    loyaltyEnabled:false, loyaltyPointsPer10:1, defaultFastMultiplier:1.5, updated_at:stamp
  };
  const demoCustomer = { id:uid('cus'), customer_code:'CUS-0001', name:'Ahmed Khan', phone:'0501234567', address:'Jumeirah Lake Towers', building:'Tiffany Tower', flat:'1203', loyalty_points:0, total_orders:0, total_spent:0, notes:'Demo customer', active:true, created_at:stamp, updated_at:stamp };
  const items = [
    {id:uid('itm'),name:'Kandura Cotton',name_urdu:'',category:'Traditional Wear',dryclean_price:12,washiron_price:8,ironing_price:6.3,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Ghatra',name_urdu:'',category:'Traditional Wear',dryclean_price:9,washiron_price:6,ironing_price:4.2,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Shirt',category:'Shirts',dryclean_price:10,washiron_price:7,ironing_price:5,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Trouser',category:'Trousers',dryclean_price:11,washiron_price:7.5,ironing_price:5.5,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Suit',category:'Formal Wear',dryclean_price:30,washiron_price:18,ironing_price:12,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Abaya',category:'Dresses',dryclean_price:25,washiron_price:16,ironing_price:10,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Bedsheet',category:'Home Linen',dryclean_price:18,washiron_price:12,ironing_price:8,fast_multiplier:1.5,active:true,created_at:stamp},
    {id:uid('itm'),name:'Curtain',category:'Home Linen',dryclean_price:22,washiron_price:15,ironing_price:10,fast_multiplier:1.5,active:true,created_at:stamp}
  ];
  const employee = {id:uid('emp'),employee_code:'EMP-0001',name:'Admin User',role:'Admin',phone:'0559944375',salary:0,salary_type:'Monthly',joining_date:stamp.slice(0,10),active:true};
  const inventory = [
    {id:uid('inv'),item_name:'Detergent',quantity:24,unit:'KG',threshold_alert:10,cost_per_unit:8,supplier:'',active:true},
    {id:uid('inv'),item_name:'Packaging Bags',quantity:650,unit:'PCS',threshold_alert:100,cost_per_unit:0.3,supplier:'',active:true},
    {id:uid('inv'),item_name:'Starch',quantity:12,unit:'L',threshold_alert:4,cost_per_unit:10,supplier:'',active:true}
  ];
  for (const row of [settings]) await dbPut('settings',row);
  for (const row of [demoCustomer]) await dbPut('customers',row);
  for (const row of items) await dbPut('items',row);
  for (const row of [employee]) await dbPut('employees',row);
  for (const row of inventory) await dbPut('inventory',row);
  await dbPut('audit_logs',{id:uid('audit'),action:'System seed',entity_type:'system',entity_id:'seed',old_value:null,new_value:'Demo data created',reason:'Initial WashCare setup',user_id:'system',created_at:stamp});
  return true;
}
