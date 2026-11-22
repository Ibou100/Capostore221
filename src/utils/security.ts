/**
 * Security and Authentication Utilities for CAPOSTORE221 Owner Admin
 * - Salted SHA-256 verification (no plaintext default PIN in bundle)
 * - Anti-brute-force rate limiting (5 failed attempts -> 5-minute lockout)
 * - Ephemeral 2-hour session in sessionStorage with integrity signature
 * - Constant-time hash comparison
 */

const ADMIN_STORAGE_KEY = 'capostore_admin_auth_v3';
const SESSION_STORAGE_KEY = 'capostore_admin_session_v3';
const ATTEMPTS_STORAGE_KEY = 'capostore_admin_attempts_v4';

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Salted SHA-256 of default owner PIN (never stored in plaintext)
const DEFAULT_PIN_SALT = 'capo221_pin_salt_v4';
const DEFAULT_PIN_HASH = '998b4123f6171304cc09b7d01852abe65a77839642d19a56def1dfd067276f95';
const SESSION_INTEGRITY_PEPPER = 'capo221_sess_sig_v4';

interface StoredAuth {
  salt: string;
  hash: string;
  updatedAt: string;
}

interface AdminSession {
  token: string;
  expiresAt: number;
  loginTime: string;
  sig: string;
}

interface AttemptState {
  count: number;
  lockedUntil: number | null;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

const AUDIT_LOG_STORAGE_KEY = 'capostore_security_audit_log_v1';

// Purge legacy persistent admin sessions from localStorage
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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function computeSessionSig(token: string, expiresAt: number, loginTime: string): string {
  const input = `${SESSION_INTEGRITY_PEPPER}:${token}:${expiresAt}:${loginTime}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
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
  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
  }
  const salt = generateSalt();
  const hash = await computeHash(trimmed, salt);
  const data: StoredAuth = {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  addAuditLog('Modification du mot de passe propriétaire');
}

function readAttempts(): AttemptState {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AttemptState;
      if (parsed && typeof parsed.count === 'number') {
        if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
          localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
          return { count: 0, lockedUntil: null };
        }
        return parsed;
      }
    }
  } catch {}
  return { count: 0, lockedUntil: null };
}

function recordFailedAttempt(): AttemptState {
  const current = readAttempts();
  const nextCount = current.count + 1;
  const lockedUntil = nextCount >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : null;
  const nextState: AttemptState = { count: nextCount, lockedUntil };
  try {
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(nextState));
  } catch {}
  if (lockedUntil) {
    addAuditLog('Blocage temporaire après tentatives échouées', `${nextCount} essais`);
  } else {
    addAuditLog('Tentative de connexion échouée', `Essai ${nextCount}/${MAX_FAILED_ATTEMPTS}`);
  }
  return nextState;
}

function clearFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
  } catch {}
}

/**
 * Verifies owner password with rate limiting and constant-time comparison
 */
export async function verifyOwnerPassword(candidatePassword: string): Promise<{ success: boolean; error?: string }> {
  const attempts = readAttempts();
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const remainingSec = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
    const remainingMin = Math.ceil(remainingSec / 60);
    return {
      success: false,
      error: `Trop de tentatives échouées. Réessayez dans ${remainingMin} minute(s).`,
    };
  }

  const cleanInput = candidatePassword.trim();
  if (!cleanInput) {
    return {
      success: false,
      error: 'Veuillez saisir votre mot de passe.',
    };
  }

  // 1. Check against custom saved password if owner customized it
  const stored = await getStoredAuth();
  if (stored && stored.hash && stored.salt) {
    const candidateHash = await computeHash(cleanInput, stored.salt);
    if (timingSafeEqual(candidateHash, stored.hash)) {
      clearFailedAttempts();
      createAdminSession();
      addAuditLog('Connexion réussie avec mot de passe personnalisé');
      return { success: true };
    }
    const next = recordFailedAttempt();
    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - next.count);
    return {
      success: false,
      error:
        remaining > 0
          ? `Mot de passe incorrect (${remaining} essai(s) restant(s)).`
          : 'Trop de tentatives échouées. Accès bloqué 5 minutes.',
    };
  }

  // 2. Check against salted SHA-256 of default owner PIN
  const defaultCandidateHash = await computeHash(cleanInput, DEFAULT_PIN_SALT);
  if (timingSafeEqual(defaultCandidateHash, DEFAULT_PIN_HASH)) {
    clearFailedAttempts();
    createAdminSession();
    addAuditLog('Connexion réussie à la Console Propriétaire');
    return { success: true };
  }

  const next = recordFailedAttempt();
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - next.count);
  return {
    success: false,
    error:
      remaining > 0
        ? `Mot de passe incorrect (${remaining} essai(s) restant(s)).`
        : 'Trop de tentatives échouées. Accès bloqué 5 minutes.',
  };
}

/**
 * Creates temporary secure session strictly in sessionStorage with integrity signature
 */
export function createAdminSession(): void {
  if (typeof window === 'undefined') return;
  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = bufferToHex(tokenBytes.buffer);
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const loginTime = new Date().toISOString();
  const session: AdminSession = {
    token,
    expiresAt,
    loginTime,
    sig: computeSessionSig(token, expiresAt, loginTime),
  };
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

/**
 * Checks if current admin session is valid and untampered in active sessionStorage
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as AdminSession;
    if (
      session &&
      typeof session.token === 'string' &&
      /^[a-f0-9]{64}$/.test(session.token) &&
      typeof session.expiresAt === 'number' &&
      typeof session.loginTime === 'string' &&
      typeof session.sig === 'string' &&
      session.expiresAt > Date.now() &&
      session.expiresAt <= Date.now() + SESSION_DURATION_MS + 60000
    ) {
      const expectedSig = computeSessionSig(session.token, session.expiresAt, session.loginTime);
      if (timingSafeEqual(session.sig, expectedSig)) {
        return true;
      }
    }
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
  addAuditLog("Déconnexion de l'administrateur");
}

export function getAttemptTracker(): AttemptState {
  return readAttempts();
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
      return parsed.filter(
        (l): l is SecurityAuditLog => !!l && typeof l === 'object' && typeof l.id === 'string'
      );
    }
  } catch {}
  return [];
}
