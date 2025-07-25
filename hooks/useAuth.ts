'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifie le token et récupère le user au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://127.0.0.1:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fonction pour rafraîchir les infos utilisateur (à exposer)
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://127.0.0.1:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  // Connexion : stocke le token et récupère le user
  const login = async (email: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Email ou mot de passe incorrect.");
    }
    const { access_token } = await response.json();
    localStorage.setItem("token", access_token);
    // Récupère le user
    const userRes = await fetch("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!userRes.ok) throw new Error("Impossible de récupérer l'utilisateur");
    const userData = await userRes.json();
    setUser(userData);
    return userData;
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return { user, loading, login, logout, refreshUser };
} 