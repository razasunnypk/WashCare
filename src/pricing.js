import { APP, SPEEDS } from './config.js';

export function calculateLine({ quantity=1, unitPrice=0, speed='NORMAL', fastMultiplier=1.5 }) {
  const qty = Math.max(1, Number(quantity));
  const base = Number(unitPrice) * qty;
  const multiplier = speed === 'FAST' ? Number(fastMultiplier || SPEEDS[1].multiplier) : 1;
  const amount = base * multiplier;
  return { quantity: qty, unitPrice: Number(unitPrice), multiplier, base, amount, urgentCharge: amount-base };
}

export function calculateOrder(lines, { discount=0, deliveryFee=0, otherFee=0, vatRate=APP.vatRate } = {}) {
  const subtotal = lines.reduce((s,l)=>s + Number(l.amount||0), 0);
  const urgentCharges = lines.reduce((s,l)=>s + Number(l.urgentCharge||0), 0);
  const discountAmount = Math.max(0, Number(discount||0));
  const preTax = Math.max(0, subtotal + Number(deliveryFee||0) + Number(otherFee||0) - discountAmount);
  const vat = preTax * Number(vatRate||0);
  const total = preTax + vat;
  return { subtotal, urgentCharges, deliveryFee:Number(deliveryFee||0), otherFee:Number(otherFee||0), discount:discountAmount, beforeVat:preTax, vat, total };
}
