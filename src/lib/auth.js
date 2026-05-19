import { AUTH_CONFIG } from './authConfig.generated';

const AUTH_SESSION_KEY = 'blue-site-auth-session-v1';

function base64ToBytes(value) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function safeEqual(left, right) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

async function deriveCredentialHash(value, descriptor) {
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(value),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(descriptor.salt),
      iterations: descriptor.iterations,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  return bytesToBase64(new Uint8Array(bits));
}

export function getAuthSession() {
  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;

    if (!session?.expiresAt || Date.now() >= session.expiresAt) {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function clearAuthSession() {
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAuthSessionTtlMs() {
  return AUTH_CONFIG.sessionTtlMs;
}

export async function verifyCredentials(username, password) {
  if (!window.crypto?.subtle) {
    throw new Error('Crypto API unavailable.');
  }

  const normalizedUsername = username.trim();
  const [usernameHash, passwordHash] = await Promise.all([
    deriveCredentialHash(normalizedUsername, AUTH_CONFIG.username),
    deriveCredentialHash(password, AUTH_CONFIG.password),
  ]);
  const valid =
    safeEqual(usernameHash, AUTH_CONFIG.username.hash) &&
    safeEqual(passwordHash, AUTH_CONFIG.password.hash);

  if (!valid) {
    clearAuthSession();
    return null;
  }

  const authenticatedAt = Date.now();
  const session = {
    authenticatedAt,
    expiresAt: authenticatedAt + AUTH_CONFIG.sessionTtlMs,
  };

  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}
