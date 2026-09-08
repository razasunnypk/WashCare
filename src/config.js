export const APP = {
  name: 'WashCare Laundry Services',
  shortName: 'WashCare',
  mobile: '0559944375',
  email: 'support@washcare.ae',
  web: 'Washcare.ae',
  address: 'R01 West Avenue Towers, Marina, Dubai, UAE',
  currency: 'AED',
  vatRate: 0.05,
  receiptPrefix: 'WC-'
};

export const ORDER_STATUS = {
  RECEIVED: 'Received',
  PROCESSING: 'Processing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PARTIAL: 'Partially Paid',
  UNPAID: 'Unpaid',
  REFUNDED: 'Refunded'
};

export const SERVICE_TYPES = [
  { id: 'DRY_CLEAN', name: 'Dry Clean' },
  { id: 'WASH_IRON', name: 'Wash + Iron' },
  { id: 'IRONING', name: 'Ironing / Press' }
];

export const SPEEDS = [
  { id: 'NORMAL', name: 'Normal', multiplier: 1 },
  { id: 'FAST', name: 'Fast / Urgent', multiplier: 1.5 }
];

export const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'Digital Wallet', 'Other'];

export const ROLES = ['Admin', 'Manager', 'Cashier', 'Laundry Staff', 'Delivery Staff'];

export const DEFAULT_TERMS = `Articles not collected within 30 days may be disposed of. For articles damaged or lost, the maximum sum payable will be five times the charge on the bill of the article. WashCare is not responsible for shrinkage or fastness of colours. We are not responsible for valuables left in pockets. Please check your laundry while receiving; the company will not be responsible for any lost items.`;
