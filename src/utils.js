import { APP } from './config.js';

export const uid = (prefix = 'id') => `${prefix}_${crypto.randomUUID()}`;
export const nowISO = () => new Date().toISOString();
export const money = (n) => `${APP.currency} ${Number(n || 0).toFixed(2)}`;
export const dateOnly = (iso = nowISO()) => new Date(iso).toISOString().slice(0, 10);
export const dateTime = (iso) => iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—';
export const escapeHtml = (s = '') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const sum = arr => arr.reduce((a,b)=>a + Number(b || 0), 0);
export const clamp = (n,min,max) => Math.min(max, Math.max(min,n));
export const download = (name, content, type='application/json') => {
  const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
};
export const csv = rows => {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  return [keys.join(','), ...rows.map(r=>keys.map(k=>`"${String(r[k] ?? '').replaceAll('"','""')}"`).join(','))].join('\n');
};
export const nextOrderNumber = (orders) => {
  const max = orders.reduce((m,o)=>Math.max(m, Number(String(o.order_number||'').replace(/\D/g,''))||0), 0);
  return `${APP.receiptPrefix}${String(max+1).padStart(7,'0')}`;
};
