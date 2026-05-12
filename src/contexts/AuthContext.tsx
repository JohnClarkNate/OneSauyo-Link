import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import apiService from "@/services/apiService";

export type UserRole = "resident" | "staff" | "admin";

export interface Resident {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  gender?: string;
  birthDate?: string;
  age?: number;
  registeredVoter?: boolean;
  barangayId?: string;
  username?: string;
  validIdPhoto?: string;
  schoolIdPhoto?: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: string;
  birthDate?: string;
  age?: number;
  address?: string;
  registeredVoter?: boolean;
  username: string;
  email: string;
  password: string;
  validIdPhoto: string;
  schoolIdPhoto?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: Resident | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await apiService.get<{ status: string; user?: Resident }>(
          "/api.php?action=getUser"
        );
        if (response.status === "success" && response.user) {
          setUser(response.user);
        }
      } catch {
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.post<{ status: string; user?: Resident; message?: string }>(
        "/api.php?action=login",
        { email, password }
      );

      if (response.status === "success" && response.user) {
        setUser(response.user);
        return true;
      } else {
        setError(response.message || "Login failed");
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMsg);
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.post<{ status: string; message?: string; user_id?: number }>(
        "/api.php?action=register",
        payload
      );

      if (response.status === "success") {
        // Auto-login after registration
        return await login(payload.username, payload.password);
      } else {
        setError(response.message || "Registration failed");
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMsg);
      console.error("Registration error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiService.post("/api.php?action=logout");
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthContext.Provider value={{ user, loading: loading || bootstrapping, error, login, register, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};
