/**
 * Security and Authentication Utilities for CAPOSTORE221 Owner Admin
 * Simplified, friction-free security:
 * - Direct PIN support (ex: 2210 or 2026 or capo221)
 * - Persistent 30-day session (no need to log in repeatedly)
 * - Direct secret URL key support (?cle=2210)
 * - NO locking out the business owner
 */

const ADMIN_STORAGE_KEY = 'capostore_admin_auth_v3';
const SESSION_STORAGE_KEY = 'capostore_admin_session_v3';

// 30 days session duration so the owner remains authenticated on their phone and PC
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Accepted fast PINs and Master credentials for the owner
const ACCEPTED_DEFAULT_CREDENTIALS = [
  '2210',
  '2026',
  '221',
  'capo221',
  'capostore221',
  'CapoStore221@Admin'
];

interface StoredAuth {
  salt: string;
  hash: string;
  updatedAt: string;
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

// Immediately clear any old lockout locks from previous versions
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('capostore_admin_attempts_v2');
    localStorage.removeItem('capostore_admin_attempts_v1');
  } catch {}
}

function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeHash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return bufferToHex(array.buffer);
}

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

export async function setOwnerPassword(newPassword: string): Promise<void> {
  const salt = generateSalt();
  const hash = await computeHash(newPassword.trim(), salt);
  const data: StoredAuth = {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  addAuditLog('Modification du mot de passe propriétaire');
}

/**
 * Fast & resilient password / PIN verification
 * Accepts fast PINs (2210, 221), master passwords, and custom hashed passwords.
 * Zero lockouts to never block the store owner.
 */
export async function verifyOwnerPassword(candidatePassword: string): Promise<{ success: boolean; error?: string }> {
  const cleanInput = candidatePassword.trim();
  const cleanLower = cleanInput.toLowerCase();

  // 1. Check against accepted fast PINs and master credentials
  const isDefaultMatch = ACCEPTED_DEFAULT_CREDENTIALS.some(
    (cred) => cred.toLowerCase() === cleanLower || cred === cleanInput
  );

  if (isDefaultMatch) {
    createAdminSession();
    addAuditLog('Connexion réussie à la Console Propriétaire');
    return { success: true };
  }

  // 2. Check against custom saved password if owner customized it
  const stored = await getStoredAuth();
  if (stored) {
    const candidateHash = await computeHash(cleanInput, stored.salt);
    if (candidateHash === stored.hash) {
      createAdminSession();
      addAuditLog('Connexion réussie avec mot de passe personnalisé');
      return { success: true };
    }
  }

  return {
    success: false,
    error: 'Code ou mot de passe incorrect. Vous pouvez utiliser votre code PIN (ex: 2210 ou 221) ou votre mot de passe.',
  };
}

/**
 * Creates persistent 30-day admin session
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
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

/**
 * Checks if current admin session is valid (persists across tab closes)
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Check localStorage first (persistent), then sessionStorage
    const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
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
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
  addAuditLog('Déconnexion de l\'administrateur');
}

/**
 * Dummy attempt tracker for compatibility (lockouts removed!)
 */
export function getAttemptTracker(): { count: number; lockedUntil: null } {
  return { count: 0, lockedUntil: null };
}

/**
 * Security Audit Log handling
 */
export function addAuditLog(action: string, details?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAuditLogs();
    const newEntry: SecurityAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action: String(action || ''),
      details: details ? String(details) : undefined,
    };
    const updated = [newEntry, ...logs].slice(0, 50);
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Audit log error', e);
  }
}

export function getAuditLogs(): SecurityAuditLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((l): l is SecurityAuditLog => !!l && typeof l === 'object' && typeof l.id === 'string');
    }
  } catch {}
  return [];
}
