import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
  type User,
} from "@/api/auth";
import { ApiError } from "@/api/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  ensureAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const checkedRef = useRef(false);

  const ensureAuth = useCallback(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    setLoading(true);
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await apiLogin({ email, password });
    setUser(user);
  }, []);

  const signup = useCallback(
    async (params: {
      email: string;
      password: string;
      password_confirmation: string;
      first_name: string;
      last_name: string;
    }) => {
      const user = await apiSignup(params);
      setUser(user);
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) throw e;
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, ensureAuth, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
