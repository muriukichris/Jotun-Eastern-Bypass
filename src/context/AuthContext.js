import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);

const storageKey = "ekoni3_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch (_) {
        localStorage.removeItem(storageKey);
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(storageKey, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  const clear = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(storageKey);
  };

  const login = async (payload) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    persist(data.user, data.token);
    return data.user;
  };

  const register = async (payload) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    persist(data.user, data.token);
    return data.user;
  };

  const value = useMemo(
    () => ({ user, token, login, register, logout: clear, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
