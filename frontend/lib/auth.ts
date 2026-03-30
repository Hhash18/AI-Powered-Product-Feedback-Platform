// Simple auth utility for hardcoded admin credentials

const ADMIN_EMAIL = 'admin@feedpulse.com';
const ADMIN_PASSWORD = 'FeedPulse@123';
const AUTH_TOKEN_KEY = 'feedpulse_auth_token';

interface AuthToken {
  email: string;
  timestamp: number;
}

export const auth = {
  login: (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token: AuthToken = {
        email,
        timestamp: Date.now(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
      }
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;
    try {
      const parsed = JSON.parse(token) as AuthToken;
      return parsed.email === ADMIN_EMAIL;
    } catch {
      return false;
    }
  },

  getToken: (): AuthToken | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    try {
      return JSON.parse(token) as AuthToken;
    } catch {
      return null;
    }
  },

  getCredentials: () => ({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  }),
};
