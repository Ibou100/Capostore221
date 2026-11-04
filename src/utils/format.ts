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
    label: 'Transmise via WhatsApp',
    step: 1,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Commande enregistrée sur la plateforme et transmise au vendeur.',
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
