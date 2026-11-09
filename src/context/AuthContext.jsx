import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { clearPrivateCaches } from "../utils/pwa";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Al abrir la app se pregunta al servidor si la cookie de sesión sigue vigente
  useEffect(() => {
    const fallback = setTimeout(() => setChecking(false), 2500);

    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch((error) => {
        setUser(null);
        if (error.response?.status === 401) clearPrivateCaches(); // la sesión caducó: se borra lo guardado para uso sin conexión
      })
      .finally(() => {
        clearTimeout(fallback);
        setChecking(false);
      });

    return () => clearTimeout(fallback);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      await clearPrivateCaches(); // inventario y sesión guardados para uso sin conexión
    }
  }, []);

  const value = useMemo(
    () => ({ user, checking, isAuthenticated: Boolean(user), login, register, logout }),
    [user, checking, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}
