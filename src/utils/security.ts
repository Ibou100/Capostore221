/**
 * Security and Authentication Utilities for CAPOSTORE221 Owner Admin
 * Uses Web Crypto API for SHA-256 hashing with salt, rate-limiting, and session management.
 */

const ADMIN_STORAGE_KEY = 'capostore_admin_auth_v2';
const ATTEMPTS_STORAGE_KEY = 'capostore_admin_attempts_v2';
const SESSION_STORAGE_KEY = 'capostore_admin_session_v2';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours session expiry

// Default owner password: "CapoStore221@Admin" (or "capo221" for quick access)
// The owner can change this password at any time from the Admin settings!
const DEFAULT_INITIAL_PASSWORDS = ['CapoStore221@Admin', 'capo221', '221'];

interface StoredAuth {
  salt: string;
  hash: string;
  updatedAt: string;
}

interface AttemptTracker {
  count: number;
  lockedUntil: number | null;
}

interface AdminSession {
  token: string;
  expiresAt: number;
  loginTime: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

const AUDIT_LOG_STORAGE_KEY = 'capostore_security_audit_log_v1';

/**
 * Converts ArrayBuffer to Hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Computes SHA-256 hash with salt
 */
export async function computeHash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

/**
 * Generates a random cryptographic hex salt
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return bufferToHex(array.buffer);
}

/**
 * Initializes or retrieves the stored master password hash
 */
export async function getStoredAuth(): Promise<StoredAuth | null> {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoredAuth;
    }
  } catch (e) {
    console.error('Failed to read admin auth', e);
  }
  return null;
}

/**
 * Sets a new master password for the owner
 */
export async function setOwnerPassword(newPassword: string): Promise<void> {
  const salt = generateSalt();
  const hash = await computeHash(newPassword, salt);
  const data: StoredAuth = {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  addAuditLog('Modification du mot de passe administrateur propriétaire');
}

/**
 * Verifies if entered password matches the stored owner password
 */
export async function verifyOwnerPassword(candidatePassword: string): Promise<{ success: boolean; error?: string }> {
  // Check lockout status
  const attempts = getAttemptTracker();
  const now = Date.now();

  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attempts.lockedUntil - now) / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return {
      success: false,
      error: `Accès temporairement bloqué pour sécurité suite à plusieurs tentatives échouées. Réessayez dans ${minutes}m ${seconds}s.`,
    };
  }

  const stored = await getStoredAuth();
  let isValid = false;

  if (stored) {
    const candidateHash = await computeHash(candidatePassword, stored.salt);
    isValid = candidateHash === stored.hash;
  } else {
    // If no custom password set yet, check default owner passwords
    isValid = DEFAULT_INITIAL_PASSWORDS.includes(candidatePassword.trim());
    if (isValid) {
      // Auto-migrate to secure hashed storage
      await setOwnerPassword(candidatePassword.trim());
    }
  }

  if (isValid) {
    // Reset attempt tracker on success
    resetAttemptTracker();
    // Create new session token
    createAdminSession();
    addAuditLog('Connexion réussie à l\'Espace Propriétaire');
    return { success: true };
  } else {
    // Register failed attempt
    const newCount = (attempts.count || 0) + 1;
    let lockedUntil: number | null = null;
    let remaining = MAX_FAILED_ATTEMPTS - newCount;

    if (newCount >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = now + LOCKOUT_DURATION_MS;
      remaining = 0;
      addAuditLog(`Alerte de sécurité : 5 tentatives échouées consécutives. Blocage de 15 minutes activé.`);
    }

    saveAttemptTracker({ count: newCount, lockedUntil });

    const msg = remaining > 0
      ? `Mot de passe incorrect. Attention : plus que ${remaining} tentative(s) avant blocage de sécurité.`
      : `Mot de passe incorrect. 5 tentatives échouées : l'accès est bloqué pendant 15 minutes.`;

    return { success: false, error: msg };
  }
}

/**
 * Gets attempt tracker state
 */
export function getAttemptTracker(): AttemptTracker {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: null };
}

function saveAttemptTracker(tracker: AttemptTracker): void {
  try {
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(tracker));
  } catch {}
}

function resetAttemptTracker(): void {
  try {
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
  } catch {}
}

/**
 * Creates cryptographically random session
 */
export function createAdminSession(): void {
  if (typeof window === 'undefined') return;
  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const session: AdminSession = {
    token: bufferToHex(tokenBytes.buffer),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    loginTime: new Date().toISOString(),
  };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Checks if current active session is valid
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as AdminSession;
    if (session.expiresAt > Date.now()) {
      return true;
    }
  } catch {}
  return false;
}

/**
 * Terminates session
 */
export function revokeAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  addAuditLog('Déconnexion de l\'administrateur');
}

/**
 * Security Audit Log handling
 */
export function addAuditLog(action: string, details?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    const logs: SecurityAuditLog[] = raw ? JSON.parse(raw) : [];
    const newEntry: SecurityAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    const updated = [newEntry, ...logs].slice(0, 50); // Keep last 50 actions
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Audit log error', e);
  }
}

export function getAuditLogs(): SecurityAuditLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {}
  return [];
}
