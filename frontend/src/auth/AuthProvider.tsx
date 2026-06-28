import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { getToken, setToken, clearToken } from "../lib/token";
import {
  login as loginRequest,
  getMe,
  type Credentials,
  type User,
} from "../services/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials: Credentials) {
    const { token } = await loginRequest(credentials);
    setToken(token);
    setUser(await getMe());
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
