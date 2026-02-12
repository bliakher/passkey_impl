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
}

export function saveUser(user: { id: string; username: string }): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
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
