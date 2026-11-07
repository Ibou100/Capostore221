/**
 * Security and Authentication Utilities for CAPOSTORE221 Owner Admin
 * - Single secure master PIN: 2210 (or custom password updated by the owner)
 * - Persistent 30-day session
 * - Cryptographic SHA-256 password hashing with salt
 */

const ADMIN_STORAGE_KEY = 'capostore_admin_auth_v3';
const SESSION_STORAGE_KEY = 'capostore_admin_session_v3';

// Ephemeral 2-hour session stored ONLY in sessionStorage (never permanently in localStorage)
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

// Single default master PIN
export const DEFAULT_OWNER_PIN = '2210';

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

// Immediately purge any old persistent admin sessions from localStorage
// This guarantees that visitors and customers NEVER inherit admin privileges.
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('capostore_admin_session_v2');
    localStorage.removeItem('capostore_admin_session_v1');
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
 * Single secure password verification
 * Checks custom hashed password if set, otherwise validates against master PIN (2210).
 */
export async function verifyOwnerPassword(candidatePassword: string): Promise<{ success: boolean; error?: string }> {
  const cleanInput = candidatePassword.trim();
  if (!cleanInput) {
    return {
      success: false,
      error: 'Veuillez saisir votre mot de passe.',
    };
  }

  // 1. Check against custom saved password if owner customized it
  const stored = await getStoredAuth();
  if (stored && stored.hash) {
    const candidateHash = await computeHash(cleanInput, stored.salt);
    if (candidateHash === stored.hash) {
      createAdminSession();
      addAuditLog('Connexion réussie avec mot de passe personnalisé');
      return { success: true };
    }
    return {
      success: false,
      error: 'Mot de passe incorrect.',
    };
  }

  // 2. Single default master PIN
  if (cleanInput === DEFAULT_OWNER_PIN) {
    createAdminSession();
    addAuditLog('Connexion réussie à la Console Propriétaire');
    return { success: true };
  }

  return {
    success: false,
    error: 'Mot de passe incorrect.',
  };
}

/**
 * Creates temporary secure session strictly in sessionStorage
 * Automatically clears when tab or browser is closed.
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
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    // Purge localStorage to prevent cross-tab leaks
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

/**
 * Checks if current admin session is valid in active sessionStorage
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as AdminSession;
    if (session && session.expiresAt > Date.now()) {
      return true;
    }
    // Expired
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
  return false;
}

/**
 * Terminates session
 */
export function revokeAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
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
