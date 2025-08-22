"use client";
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalide, le supprimer
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Sauvegarder le token
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          
          // Maintenant, récupérer les informations de l'utilisateur
          try {
            const userResponse = await fetch('http://localhost:8000/api/users/me', {
              headers: {
                'Authorization': `Bearer ${data.access_token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
              return true;
            } else {
              console.error('Erreur lors de la récupération des données utilisateur');
              // Même si on ne peut pas récupérer les données utilisateur, on a le token
              return true;
            }
          } catch (userError) {
            console.error('Erreur lors de la récupération des données utilisateur:', userError);
            // Même si on ne peut pas récupérer les données utilisateur, on a le token
            return true;
          }
        } else {
          throw new Error('Token d\'accès manquant dans la réponse');
        }
      } else {
        let errorMessage = 'Erreur de connexion';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            // Si detail est un objet, on essaie de l'extraire
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (errorData.detail.message) {
              errorMessage = errorData.detail.message;
            } else {
              errorMessage = JSON.stringify(errorData.detail);
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Si on ne peut pas parser la réponse d'erreur
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalide, le supprimer
          localStorage.removeItem('token');
          setUser(null);
          console.warn('Token invalide, déconnexion automatique');
        }
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error);
      // En cas d'erreur, on déconnecte l'utilisateur
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
} 