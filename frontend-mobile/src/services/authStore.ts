/**
 * Lightweight auth store backed by expo-secure-store.
 * Keeps the JWT token and user info in memory (with persistence).
 *
 * Usage:
 *   await authStore.load();          // call once on app start
 *   await authStore.save(user, token);
 *   authStore.token                  // current token (string | null)
 *   authStore.user                   // current user (AuthUser | null)
 *   await authStore.clear();         // logout
 */

import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from './auth.service';

const TOKEN_KEY = 'joints_auth_token';
const USER_KEY = 'joints_auth_user';

class AuthStore {
  token: string | null = null;
  user: AuthUser | null = null;

  /** Load persisted credentials into memory — call once in _layout.tsx */
  async load(): Promise<void> {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      this.token = token ?? null;
      this.user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
    } catch {
      // ignore — first launch or corrupted data
    }
  }

  /** Persist credentials after a successful login */
  async save(user: AuthUser, token: string): Promise<void> {
    this.user = user;
    this.token = token;
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    ]);
  }

  /** Clear credentials on logout */
  async clear(): Promise<void> {
    this.user = null;
    this.token = null;
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}

export const authStore = new AuthStore();
