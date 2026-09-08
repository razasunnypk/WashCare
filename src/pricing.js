import { APP, SPEEDS } from './config.js';

const finite = (n, fallback=0) => Number.isFinite(Number(n)) ? Number(n) : fallback;

export function calculateLine({ quantity=1, unitPrice=0, speed='NORMAL', fastMultiplier=1.5 }) {
  const qty = Math.max(1, finite(quantity, 1));
  const price = Math.max(0, finite(unitPrice));
  const multiplier = speed === 'FAST' ? Math.max(1, finite(fastMultiplier, SPEEDS[1].multiplier)) : 1;
  const base = price * qty;
  const amount = base * multiplier;
  return { quantity: qty, unitPrice: price, multiplier, base, amount, urgentCharge: amount - base };
}

export function calculateOrder(lines=[], { discount=0, deliveryFee=0, otherFee=0, vatRate=APP.vatRate } = {}) {
  const safeLines = Array.isArray(lines) ? lines : [];
  const subtotal = safeLines.reduce((s,l)=>s + Math.max(0, finite(l.amount)), 0);
  const urgentCharges = safeLines.reduce((s,l)=>s + Math.max(0, finite(l.urgentCharge)), 0);
  const discountAmount = Math.min(subtotal, Math.max(0, finite(discount)));
  const delivery = Math.max(0, finite(deliveryFee));
  const other = Math.max(0, finite(otherFee));
  const preTax = Math.max(0, subtotal + delivery + other - discountAmount);
  const rate = Math.max(0, finite(vatRate, APP.vatRate));
  const vat = preTax * rate;
  const total = preTax + vat;
  return { subtotal, urgentCharges, deliveryFee:delivery, otherFee:other, discount:discountAmount, beforeVat:preTax, vat, total };
}
