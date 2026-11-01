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

export function getWhatsAppOrderLink(
  productName: string, 
  price: number, 
  size?: string,
  imagePath?: string
): string {
  const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin 
    : 'https://capostore221.vercel.app';
  const sizeText = size ? `\n• Taille : ${size}` : '';
  const photoText = imagePath 
    ? `\n\n📸 Photo de l'article :\n${origin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}` 
    : '';

  const message = `Bonjour CAPOSTORE221,\nJe souhaite commander cet article vu sur votre boutique en ligne :\n\n• Article : ${productName}\n• Prix : ${formatFCFA(price)}${sizeText}${photoText}\n\nMerci de me confirmer la disponibilité et la livraison.`;
  return `https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCheckoutLink(
  items: Array<{ product: { name: string; images?: string[] }; quantity: number; unitPrice: number; selectedSize?: string }>,
  total: number,
  customer: { name: string; phone: string; city: string; address: string }
): string {
  const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin 
    : 'https://capostore221.vercel.app';

  const itemsText = items.map((i) => {
    const photo = i.product.images?.[0] ? `\n  📸 Photo : ${origin}${i.product.images[0]}` : '';
    return `• ${i.quantity}x ${i.product.name}${i.selectedSize ? ` (Taille : ${i.selectedSize})` : ''} — ${formatFCFA(i.unitPrice * i.quantity)}${photo}`;
  }).join('\n\n');

  const message = `Bonjour CAPOSTORE221,\nNouvelle commande validée sur votre boutique en ligne :\n\n👤 Client : ${customer.name}\n📞 Téléphone : ${customer.phone}\n📍 Ville : ${customer.city}\n🏠 Adresse : ${customer.address}\n\n📦 Articles commandés :\n${itemsText}\n\n💰 Total : ${formatFCFA(total)}\n💳 Règlement : Espèces à la livraison / Wave / Orange Money\n\nMerci de me confirmer la prise en charge et la livraison !`;

  return `https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
