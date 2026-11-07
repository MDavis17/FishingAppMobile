import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthUser,
  getCurrentUser,
  loginUser,
  registerUser,
} from "features/auth/api/auth";
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from "common/auth/tokenStorage";
import { setOnUnauthorized } from "common/api/request";

type AuthResult = { ok: boolean; error?: string };

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function apiErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail: unknown }).detail;
    if (typeof detail === "string") {
      return detail;
    }
  }
  return fallback;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await clearStoredAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const establishSession = useCallback(
    async (accessToken: string): Promise<AuthResult> => {
      const meResponse = await getCurrentUser(accessToken);
      if (!meResponse.ok) {
        await clearStoredAuthToken();
        setToken(null);
        setUser(null);
        return {
          ok: false,
          error: apiErrorMessage(meResponse.data, "Session expired"),
        };
      }
      await setStoredAuthToken(accessToken);
      setToken(accessToken);
      setUser(meResponse.data as AuthUser);
      return { ok: true };
    },
    []
  );

  useEffect(() => {
    setOnUnauthorized(() => {
      void logout();
    });
    return () => setOnUnauthorized(null);
  }, [logout]);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await getStoredAuthToken();
        if (!storedToken) {
          return;
        }
        await establishSession(storedToken);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [establishSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const response = await loginUser(email.trim(), password);
      if (!response.ok) {
        return {
          ok: false,
          error: apiErrorMessage(response.data, "Incorrect email or password"),
        };
      }
      const { access_token } = response.data as { access_token: string };
      return establishSession(access_token);
    },
    [establishSession]
  );

  const register = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const response = await registerUser(email.trim(), password);
      if (!response.ok) {
        return {
          ok: false,
          error: apiErrorMessage(response.data, "Registration failed"),
        };
      }
      return login(email, password);
    },
    [login]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
