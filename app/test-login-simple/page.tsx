"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestLoginSimplePage() {
  const [email, setEmail] = useState("th082919@gmail.com");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("Connexion en cours...");
    
    try {
      console.log("🔄 Tentative de connexion...");
      
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("📊 Réponse reçue:", response.status);
      
      const responseText = await response.text();
      console.log("📝 Contenu de la réponse:", responseText);
      
      if (response.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          setResult(`✅ Connexion réussie mais réponse non-JSON: ${responseText}`);
          setIsLoading(false);
          return;
        }
        
        if (responseData.access_token) {
          setResult(`✅ Connexion réussie!\nToken: ${responseData.access_token.substring(0, 20)}...\n\nMaintenant, testons la récupération des données utilisateur...`);
          
          // Test de récupération des données utilisateur
          try {
            const userResponse = await fetch('http://localhost:8000/api/users/me', {
              headers: {
                'Authorization': `Bearer ${responseData.access_token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setResult(prev => prev + `\n\n✅ Données utilisateur récupérées:\n${JSON.stringify(userData, null, 2)}`);
            } else {
              setResult(prev => prev + `\n\n❌ Erreur récupération utilisateur: ${userResponse.status}`);
            }
          } catch (userError) {
            setResult(prev => prev + `\n\n❌ Erreur récupération utilisateur: ${userError}`);
          }
        } else {
          setResult(`❌ Pas de token dans la réponse: ${JSON.stringify(responseData, null, 2)}`);
        }
      } else {
        setResult(`❌ Échec de la connexion (${response.status}):\n${responseText}`);
      }
    } catch (error: any) {
      setResult(`❌ Erreur: ${error.message}`);
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Test Simple de Connexion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions :</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Entrez votre mot de passe</li>
              <li>Cliquez sur "Se connecter"</li>
              <li>Regardez le résultat détaillé ci-dessous</li>
              <li>Vérifiez la console du navigateur (F12)</li>
            </ol>
          </div>

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
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <Label>Résultat :</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded-md font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {result}
              </div>
            </div>
          )}

          <div className="text-center">
            <a href="/test-auth" className="text-blue-600 hover:underline">
              → Test avec useAuth hook
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 