"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TestAuthPage() {
  const { user, loading, login, logout } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Tentative de connexion...");
    
    try {
      const success = await login(email, password);
      if (success) {
        setMessage("Connexion réussie !");
      } else {
        setMessage("Échec de la connexion");
      }
    } catch (error) {
      setMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleLogout = () => {
    logout();
    setMessage("Déconnexion effectuée");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Test d'Authentification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div>
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">Connecté en tant que :</p>
                <p className="text-blue-600">{user.email}</p>
                {user.first_name && <p>Prénom: {user.first_name}</p>}
                {user.last_name && <p>Nom: {user.last_name}</p>}
              </div>
              <Button onClick={handleLogout} className="w-full">
                Se déconnecter
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          )}
          
          {message && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md text-center">
              {message}
            </div>
          )}
          
          <div className="text-center">
            <a href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 