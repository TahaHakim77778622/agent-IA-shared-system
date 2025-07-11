// Service API pour communiquer avec le backend FastAPI

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
}

export interface Email {
  id: number;
  subject: string;
  body: string;
  createdAt: string;
  userId: number;
}

export interface LoginHistory {
  id: number;
  loginAt: string;
  userId: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Récupérer le token depuis localStorage si disponible (côté client uniquement)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // Si la réponse n'est pas du JSON, utiliser le texte brut
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        const error: ApiError = {
          detail: errorMessage,
          status: response.status
        };
        throw error;
      }

      // Vérifier si la réponse est vide
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  // Authentification
  async register(email: string, password: string): Promise<User> {
    return this.request<User>('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Login Error: ${errorMessage}`);
      }

      const authData = await response.json();
      
      // Sauvegarder le token
      this.token = authData.access_token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', authData.access_token);
      }

      return authData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login Error: ${error.message}`);
      }
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Utilisateur
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Emails
  async getEmails(skip: number = 0, limit: number = 100): Promise<Email[]> {
    return this.request<Email[]>(`/users/me/emails?skip=${skip}&limit=${limit}`);
  }

  async getEmail(emailId: number): Promise<Email> {
    return this.request<Email>(`/emails/${emailId}`);
  }

  async createEmail(subject: string, body: string): Promise<Email> {
    return this.request<Email>('/emails', {
      method: 'POST',
      body: JSON.stringify({ subject, body }),
    });
  }

  async updateEmail(emailId: number, updates: Partial<Pick<Email, 'subject' | 'body'>>): Promise<Email> {
    return this.request<Email>(`/emails/${emailId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEmail(emailId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/emails/${emailId}`, {
      method: 'DELETE',
    });
  }

  // Historique des connexions
  async getLoginHistory(skip: number = 0, limit: number = 100): Promise<LoginHistory[]> {
    return this.request<LoginHistory[]>(`/users/me/login-history?skip=${skip}&limit=${limit}`);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtenir le token actuel
  getToken(): string | null {
    return this.token;
  }

  // Rafraîchir le token depuis localStorage
  refreshToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Vérifier si l'API est accessible
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instance globale du service API
export const apiService = new ApiService(API_BASE_URL);

// Hook personnalisé pour utiliser l'API (pour React)
export function useApi() {
  return apiService;
}

// Fonction utilitaire pour gérer les erreurs API
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    return (error as ApiError).detail;
  }
  return 'Une erreur inconnue s\'est produite';
} 