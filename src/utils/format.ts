import type { PaymentMethod, OrderStatus } from '../types';

/**
 * Formats a number to the Senegalese FCFA (XOF) currency format
 * e.g., 45000 -> "45 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 FCFA';
  }
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  return `${formatted} FCFA`;
}

/**
 * Generates a unique key for cart items to distinguish different variants of the same product
 */
export function generateCartItemId(
  productId: string,
  size?: string,
  colorName?: string
): string {
  const s = size ? size.trim().toLowerCase() : 'nosize';
  const c = colorName ? colorName.trim().toLowerCase() : 'nocolor';
  return `${productId}_${s}_${c}`;
}

/**
 * Validates whether an email address has a valid syntax
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Contact phone numbers & email for e-commerce
 */
export const STORE_WHATSAPP_PHONE = '221768321157'; // WhatsApp officiel (+221 76 832 11 57)
export const STORE_CALL_PHONE = '221772563990'; // Ligne d'appel direct (+221 77 256 39 90)

export const STORE_PHONE_WHATSAPP_DISPLAY = '+221 76 832 11 57';
export const STORE_PHONE_CALL_DISPLAY = '+221 77 256 39 90';
export const STORE_EMAIL = 'capostore221@gmail.com'; // Email officiel du vendeur

/**
 * Official Social Media links
 */
export const FACEBOOK_URL = 'https://www.facebook.com/share/1Edu4vsdUn/?mibextid=wwXIfr';
export const INSTAGRAM_URL = 'https://www.instagram.com/capostore221?rpxt=OTBydGo5MW81NGtx&utm_source=qr';
export const TIKTOK_URL = 'https://www.tiktok.com/@capostore.221';

/**
 * Payment Methods supported in Senegal
 */
export const PAYMENT_METHODS_DATA: {
  id: PaymentMethod;
  label: string;
  icon: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'wave',
    label: 'Wave',
    icon: '🌊',
    badge: 'Recommandé',
    description: 'Paiement sans frais via votre compte Wave',
  },
  {
    id: 'orange_money',
    label: 'Orange Money',
    icon: '🟠',
    badge: 'Instantané',
    description: 'Paiement direct par transfert Orange Money',
  },
  {
    id: 'free_money',
    label: 'Free Money',
    icon: '🔴',
    badge: 'Disponible',
    description: 'Paiement simple via votre compte Free Money',
  },
  {
    id: 'especes',
    label: 'Espèces à la livraison',
    icon: '💵',
    badge: 'Classique',
    description: 'Payez en espèces à la réception de votre colis',
  },
];

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'wave':
      return 'Wave (🌊)';
    case 'orange_money':
      return 'Orange Money (🟠)';
    case 'free_money':
      return 'Free Money (🔴)';
    case 'especes':
      return 'Espèces à la livraison (💵)';
    default:
      return method;
  }
}

/**
 * Order Tracking Status Definitions & Visual badges
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    step: number;
    badgeClass: string;
    description: string;
  }
> = {
  transmise: {
    label: '1. Reçue en Ligne',
    step: 1,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Nouvelle commande reçue en ligne, en attente de confirmation avec le client.',
  },
  confirmee: {
    label: 'Confirmée par CAPOSTORE221',
    step: 2,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Disponibilité vérifiée et commande confirmée par le vendeur.',
  },
  en_preparation: {
    label: 'En cours de préparation',
    step: 3,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Votre article est emballé avec soin dans notre atelier.',
  },
  en_livraison: {
    label: 'En cours d\'acheminement',
    step: 4,
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Le livreur est en route vers votre adresse de livraison.',
  },
  livree: {
    label: 'Colis Livré',
    step: 5,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Colis remis avec succès. Merci pour votre confiance !',
  },
};

/**
 * Generates an easy-to-read order tracking number
 * e.g. "CAPO-8472"
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CAPO-${randomNum}`;
}

/**
 * Get public site origin for photo links
 */
export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')) {
    return window.location.origin;
  }
  return 'https://capostore221.vercel.app';
}

/**
 * Builds WhatsApp message for single quick order
 */
export function getWhatsAppOrderLink(
  productName: string, 
  price: number, 
  size?: string,
  imagePath?: string,
  extra?: {
    orderId?: string;
    customerPhone?: string;
    customerName?: string;
    customerCity?: string;
    customerAddress?: string;
    paymentMethod?: PaymentMethod;
  }
): string {
  const origin = getSiteOrigin();
  const sizeText = size ? `\n• Taille choisie : ${size}` : '';
  const photoText = imagePath 
    ? `\n\n📸 Photo de l'article :\n${origin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}` 
    : '';

  const orderIdText = extra?.orderId ? `📦 COMMANDE N° : ${extra.orderId}\n` : '';
  const clientText = extra?.customerPhone
    ? `\n👤 Client : ${extra.customerName || 'Client CAPOSTORE221'}\n📞 Téléphone : ${extra.customerPhone}\n📍 Adresse : ${extra.customerCity || 'Dakar'} - ${extra.customerAddress || 'À préciser'}`
    : '';
  const paymentText = extra?.paymentMethod 
    ? `\n💳 Mode de paiement : ${getPaymentMethodLabel(extra.paymentMethod)}`
    : '';

  const message = `Bonjour CAPOSTORE221,\n${orderIdText}Je valide ma commande sur votre boutique en ligne :${clientText}${paymentText}\n\n• Article : ${productName}\n• Prix : ${formatFCFA(price)}${sizeText}${photoText}\n\nMerci de me confirmer la prise en charge et le délai de livraison.`;
  return `https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds WhatsApp message for Cart checkout
 */
export function getWhatsAppCheckoutLink(
  items: Array<{ product: { name: string; images?: string[] }; quantity: number; unitPrice: number; selectedSize?: string }>,
  total: number,
  customer: { 
    orderId?: string;
    name: string; 
    phone: string; 
    city: string; 
    address: string;
    paymentMethod: PaymentMethod;
  }
): string {
  const origin = getSiteOrigin();

  const itemsText = items.map((i) => {
    const photo = i.product.images?.[0] ? `\n  📸 Photo : ${origin}${i.product.images[0]}` : '';
    return `• ${i.quantity}x ${i.product.name}${i.selectedSize ? ` (Taille : ${i.selectedSize})` : ''} — ${formatFCFA(i.unitPrice * i.quantity)}${photo}`;
  }).join('\n\n');

  const orderIdHeader = customer.orderId ? `📦 COMMANDE N° : ${customer.orderId}\n` : '';

  const message = `Bonjour CAPOSTORE221,\n${orderIdHeader}Nouvelle commande validée sur votre boutique en ligne :\n\n👤 Client : ${customer.name}\n📞 Téléphone : ${customer.phone}\n📍 Ville : ${customer.city}\n🏠 Adresse : ${customer.address}\n💳 Mode de paiement : ${getPaymentMethodLabel(customer.paymentMethod)}\n\n📦 Articles commandés :\n${itemsText}\n\n💰 Total : ${formatFCFA(total)}\n\nMerci de me confirmer la prise en charge et la livraison !`;

  return `https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Normalizes phone numbers for secure verification
 * Strips non-digits, international dialing prefixes (+221, 00221, 221)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('00221')) {
    digits = digits.slice(5);
  } else if (digits.startsWith('221') && digits.length > 9) {
    digits = digits.slice(3);
  }
  if (digits.startsWith('0') && digits.length === 10) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Compares two phone numbers to verify ownership
 */
export function arePhoneNumbersMatching(phoneA: string, phoneB: string): boolean {
  const normA = normalizePhoneNumber(phoneA);
  const normB = normalizePhoneNumber(phoneB);
  if (!normA || !normB) return false;
  // Match exact or trailing (e.g. 771234567 matching 771234567)
  return normA === normB || normA.endsWith(normB) || normB.endsWith(normA);
}

/**
 * Strict Senegalese phone number validation:
 * Mobile numbers must be exactly 9 digits and start with 70, 75, 76, 77, 78 (or 33 for landline).
 */
export function validateSenegalPhone(rawPhone: string): {
  isValid: boolean;
  digits: string;
  formatted: string;
  error?: string;
} {
  if (!rawPhone || !rawPhone.trim()) {
    return {
      isValid: false,
      digits: '',
      formatted: '',
      error: 'Veuillez renseigner votre numéro de téléphone.',
    };
  }

  let clean = rawPhone.replace(/\D/g, '');

  // Strip international prefix if entered (+221, 00221, 221)
  if (clean.startsWith('00221')) {
    clean = clean.slice(5);
  } else if (clean.startsWith('221') && clean.length >= 11) {
    clean = clean.slice(3);
  } else if (clean.startsWith('0') && clean.length === 10) {
    clean = clean.slice(1);
  }

  if (clean.length < 9) {
    return {
      isValid: false,
      digits: clean,
      formatted: clean,
      error: `Numéro trop court (${clean.length}/9 chiffres). Un numéro sénégalais doit comporter exactement 9 chiffres (ex: 77 455 23 41).`,
    };
  }

  if (clean.length > 9) {
    return {
      isValid: false,
      digits: clean,
      formatted: clean,
      error: `Numéro trop long (${clean.length} chiffres). Un numéro sénégalais doit comporter exactement 9 chiffres (ex: 77 455 23 41).`,
    };
  }

  const prefix = clean.slice(0, 2);
  const validPrefixes = ['77', '78', '76', '70', '75', '33'];
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      digits: clean,
      formatted: clean,
      error: `Préfixe "${prefix}" non reconnu. Un numéro mobile sénégalais doit commencer par 77, 78, 76, 70 ou 75.`,
    };
  }

  const formatted = `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;

  return {
    isValid: true,
    digits: clean,
    formatted,
  };
}

/**
 * Formats user typing into Senegalese phone pattern "XX XXX XX XX", capped at 9 digits
 */
export function formatSenegalPhoneInput(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00221')) digits = digits.slice(5);
  else if (digits.startsWith('221') && digits.length >= 11) digits = digits.slice(3);
  else if (digits.startsWith('0') && digits.length === 10) digits = digits.slice(1);

  // Strictly cap at 9 digits
  digits = digits.slice(0, 9);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
}

/**
 * Masks customer phone number for confidential display (e.g. "77 ••• •• 12")
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '••• ••• •• ••';
  const clean = phone.trim();
  const digits = clean.replace(/\D/g, '');
  if (digits.length >= 9) {
    const firstTwo = digits.slice(-9, -7);
    const lastTwo = digits.slice(-2);
    return `${firstTwo} ••• •• ${lastTwo}`;
  }
  if (clean.length > 4) {
    return `${clean.slice(0, 2)} •••• ${clean.slice(-2)}`;
  }
  return '••• ••• •• ••';
}

/**
 * Masks customer name for confidential display (e.g. "Ibr•••• G•••")
 */
export function maskCustomerName(name?: string): string {
  if (!name) return 'Client Privé';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 2) return p;
      return `${p.slice(0, 2)}${'•'.repeat(Math.min(4, p.length - 2))}`;
    })
    .join(' ');
}
