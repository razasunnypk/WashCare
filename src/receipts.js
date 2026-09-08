import { APP, DEFAULT_TERMS } from './config.js';
import { escapeHtml, money, dateTime } from './utils.js';

function header(copy, settings) {
  return `<div class="r-head"><div class="r-mark">WC<span>★</span></div><div class="r-brand">WASHCARE<div>LAUNDRY</div></div><div class="r-title">${escapeHtml(settings.name || APP.name)}</div><div>${escapeHtml(settings.mobile || APP.mobile)} · ${escapeHtml(settings.email || APP.email)} · ${escapeHtml(settings.web || APP.web)}</div><div>${escapeHtml(settings.address || APP.address)}</div><hr/><h2>${copy === 'delivery' ? 'DELIVERY COPY' : 'TAX INVOICE'}</h2></div>`;
}

function customerBlock(order, customer) {
  return `<div class="r-grid"><div><b>Order No</b><span>${escapeHtml(order.order_number)}</span></div><div><b>Date</b><span>${dateTime(order.created_at)}</span></div><div><b>Delivery</b><span>${escapeHtml(order.delivery_date || '—')} ${escapeHtml(order.delivery_time || '')}</span></div><div><b>Customer</b><span>${escapeHtml(customer?.name || 'Walk-in')}</span></div><div><b>Mobile #</b><span>${escapeHtml(customer?.phone || '—')}</span></div><div><b>Address</b><span>${escapeHtml(customer?.address || '—')}</span></div><div><b>Building</b><span>${escapeHtml(customer?.building || '—')}</span></div><div><b>Flat No.</b><span>${escapeHtml(customer?.flat || '—')}</span></div></div>`;
}

function itemsTable(lines, delivery=false) {
  return `<table class="r-table"><thead><tr><th>Qty</th><th>Description</th><th>Service</th>${delivery?'':'<th>Rate</th><th>Amount</th>'}</tr></thead><tbody>${lines.map(l=>`<tr><td>${l.quantity}</td><td>${escapeHtml(l.item_name)}</td><td>${escapeHtml(l.service_name)}${l.speed==='FAST'?' · Fast':''}</td>${delivery?'':`<td>${Number(l.unit_price).toFixed(2)}</td><td>${Number(l.amount).toFixed(2)}</td>`}</tr>`).join('')}</tbody></table>`;
}

function totals(order) {
  return `<div class="r-totals"><div><b>Subtotal</b><span>${money(order.subtotal)}</span></div><div><b>Discount</b><span>${money(order.discount)}</span></div><div><b>Urgent Charges</b><span>${money(order.urgent_charges)}</span></div><div><b>Delivery Fee</b><span>${money(order.delivery_fee)}</span></div><div><b>Amount Before VAT</b><span>${money(order.before_vat)}</span></div><div><b>VAT ${Number(order.vat_rate*100).toFixed(0)}%</b><span>${money(order.vat)}</span></div><div class="grand"><b>Net Amount / Total</b><span>${money(order.total_amount)}</span></div><div><b>Advance</b><span>${money(order.paid_amount)}</span></div><div class="balance"><b>Balance in AED</b><span>${money(order.balance_amount)}</span></div><div><b>Current Balance</b><span>${money(order.balance_amount)}</span></div></div>`;
}

export function receiptHtml({copy='customer', order, customer, lines, settings, deliverySignature=false}) {
  const delivery = copy === 'delivery';
  return `<article class="receipt ${delivery?'delivery-receipt':''}">${header(copy,settings)}${customerBlock(order,customer)}${itemsTable(lines,delivery)}${delivery ? `<div class="delivery-box"><b>STATUS</b><span>${escapeHtml(order.status)}</span></div><div class="signature"><div>Delivered By: __________________________</div><div>Customer Signature: ____________________</div><div>Delivery Notes: _________________________</div></div>` : `${totals(order)}<div class="terms"><b>Terms and Conditions</b><p>${escapeHtml(settings.terms || DEFAULT_TERMS)}</p></div><div class="r-thanks">Thank You for Choosing WashCare<br/><small>Care for Your Clothes</small></div>`}</article>`;
}

export function printCopies({copies, ...payload}) {
  const html = copies.map(c=>receiptHtml({copy:c,...payload})).join('<div class="print-break"></div>');
  const w = window.open('', '_blank', 'width=900,height=900');
  if (!w) throw new Error('Pop-up blocked. Please allow pop-ups to print receipts.');
  w.document.write(`<!doctype html><html><head><title>WashCare Receipt</title><link rel="stylesheet" href="${location.origin}${location.pathname.replace(/[^/]*$/,'')}src/styles.css"></head><body class="print-page">${html}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);
  w.document.close();
}
