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
 * WhatsApp order helper for Dakar e-commerce
 */
export const DAKAR_WHATSAPP_PHONE = '221770000000';

export function getWhatsAppOrderLink(productName: string, price: number, size?: string): string {
  const sizeText = size ? `\n• Taille souhaitée : ${size}` : '';
  const message = `Bonjour CAPOSTORE221 ! 🇸🇳\nJe souhaite commander cet article vu sur votre boutique en ligne :\n\n• Article : ${productName}\n• Prix : ${formatFCFA(price)}${sizeText}\n\nEst-il disponible pour une livraison à Dakar ? Merci !`;
  return `https://wa.me/${DAKAR_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
