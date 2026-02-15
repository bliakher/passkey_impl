import { apolloClient } from '~/apollo/client';
import { LOGOUT_MUT } from '~/graphql/mutations/logout';
import { REFRESH_MUT } from '~/graphql/mutations/refresh';

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
}

export function clearTokens(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  // Dispatch event to notify components of auth state change
  window.dispatchEvent(new Event('authChange'));
}

export function saveUser(user: { id: string; username: string }): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  // Dispatch event to notify components of auth state change
  window.dispatchEvent(new Event('authChange'));
}

export function getUser(): { id: string; username: string } | null {
  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      // Call backend logout mutation to invalidate refresh token
      await apolloClient.mutate({
        mutation: LOGOUT_MUT,
        variables: { refreshToken },
      });
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if backend call fails
    }
  }

  // Clear all local tokens and user data
  clearTokens();
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const result = await apolloClient.mutate({
      mutation: REFRESH_MUT,
      variables: { refreshToken },
    });

    if (result.data?.refresh?.accessToken) {
      // Update only the access token, keep the same refresh token
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, result.data.refresh.accessToken);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Token refresh error:', err);
    // If refresh fails, user needs to log in again
    clearTokens();
    return false;
  }
}
