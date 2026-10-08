/**
 * Auth store backed by expo-secure-store on native, localStorage on web.
 * Keeps token + user in memory for fast synchronous access.
 *
 * Usage:
 *   await authStore.load();           // call once on app start
 *   await authStore.save(user, token);
 *   authStore.token                   // current token (string | null)
 *   authStore.user                    // current user (AuthUser | null)
 *   await authStore.clear();          // logout
 */

import { Platform } from 'react-native';
import type { AuthUser } from './auth.service';

const TOKEN_KEY = 'joints_auth_token';
const USER_KEY = 'joints_auth_user';

// ── Storage adapter ──────────────────────────────────────────────────────────
// expo-secure-store is native-only; fall back to localStorage on web.

async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const { getItemAsync } = await import('expo-secure-store');
  return getItemAsync(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const { setItemAsync } = await import('expo-secure-store');
  return setItemAsync(key, value);
}

async function storageDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  const { deleteItemAsync } = await import('expo-secure-store');
  return deleteItemAsync(key);
}

// ── Store ────────────────────────────────────────────────────────────────────

class AuthStore {
  token: string | null = null;
  user: AuthUser | null = null;

  /** Load persisted credentials into memory — call once in _layout.tsx */
  async load(): Promise<void> {
    try {
      const [token, userJson] = await Promise.all([
        storageGet(TOKEN_KEY),
        storageGet(USER_KEY),
      ]);
      this.token = token ?? null;
      this.user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
    } catch (e) {
      console.warn('[authStore] load failed:', e);
    }
  }

  /** Persist credentials after a successful login */
  async save(user: AuthUser, token: string): Promise<void> {
    this.user = user;
    this.token = token;
    try {
      await Promise.all([
        storageSet(TOKEN_KEY, token),
        storageSet(USER_KEY, JSON.stringify(user)),
      ]);
    } catch (e) {
      console.warn('[authStore] persist failed (in-memory only):', e);
      // Don't throw — token is already set in memory, session will work
    }
  }

  /** Clear credentials on logout */
  async clear(): Promise<void> {
    this.user = null;
    this.token = null;
    try {
      await Promise.all([
        storageDelete(TOKEN_KEY),
        storageDelete(USER_KEY),
      ]);
    } catch (e) {
      console.warn('[authStore] clear failed:', e);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}

export const authStore = new AuthStore();
