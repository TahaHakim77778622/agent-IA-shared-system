"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function TestGenerationPage() {
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    prompt: "Rédige un email professionnel de remerciement pour une réunion",
    subject: "Remerciements pour la réunion",
    type: "remerciement",
    recipient: "client@example.com",
    company: "Test Company"
  });

  // Charger le token au montage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Test de connexion
  const testLogin = async () => {
    setIsGenerating(true);
    setResult("Test de connexion en cours...");

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "th082919@gmail.com",
          password: "votre_mot_de_passe" // Remplacez par votre mot de passe
        }),
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nRéponse: ${responseText}`);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.access_token) {
            setToken(data.access_token);
            localStorage.setItem('token', data.access_token);
            toast({
              title: "Connexion réussie",
              description: "Token obtenu et stocké !"
            });
          }
        } catch (e) {
          setResult(prev => prev + "\n\n❌ Erreur parsing JSON");
        }
      } else {
        toast({
          title: "Échec de connexion",
          description: `Erreur ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setResult(`Erreur: ${error.message}`);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Test de génération d'email
  const testGeneration = async () => {
    if (!token) {
      toast({
        title: "Token manquant",
        description: "Connectez-vous d'abord !",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setResult("Test de génération en cours...");

    try {
      const response = await fetch("http://localhost:8000/api/generate-email/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nRéponse: ${responseText}`);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          toast({
            title: "Génération réussie !",
            description: "Email généré avec succès"
          });
        } catch (e) {
          toast({
            title: "Succès mais erreur parsing",
            description: "Réponse reçue mais format invalide"
          });
        }
      } else {
        toast({
          title: "Échec de génération",
          description: `Erreur ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setResult(`Erreur: ${error.message}`);
      toast({
        title: "Erreur de génération",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Test de l'endpoint sans authentification
  const testWithoutAuth = async () => {
    setIsGenerating(true);
    setResult("Test sans authentification...");

    try {
      const response = await fetch("http://localhost:8000/api/generate-email/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nRéponse: ${responseText}`);

      if (response.status === 401) {
        toast({
          title: "Authentification requise",
          description: "L'endpoint nécessite un token valide"
        });
      }
    } catch (error: any) {
      setResult(`Erreur: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Vérifier le token stocké
  const checkStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setResult(`Token trouvé dans localStorage:\n${storedToken.substring(0, 50)}...`);
    } else {
      setResult("Aucun token trouvé dans localStorage");
    }
  };

  // Effacer le token
  const clearToken = () => {
    localStorage.removeItem('token');
    setToken("");
    setResult("Token effacé");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test de Génération d'Email - Diagnostic Complet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Token d'authentification</Label>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Token JWT..."
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={checkStoredToken} variant="outline" size="sm">
                  Vérifier localStorage
                </Button>
                <Button onClick={clearToken} variant="outline" size="sm">
                  Effacer
                </Button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={testLogin} disabled={isGenerating}>
                🔐 Tester Connexion
              </Button>
              <Button onClick={testGeneration} disabled={isGenerating || !token}>
                📧 Tester Génération (avec token)
              </Button>
              <Button onClick={testWithoutAuth} disabled={isGenerating} variant="outline">
                🚫 Tester sans Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Données de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type d'email</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remerciement">Remerciement</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Destinataire</Label>
                <Input
                  value={formData.recipient}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <Label>Entreprise</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div>
              <Label>Prompt</Label>
              <Textarea
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Description de l'email à générer"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Résultats des tests</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="p-4 bg-gray-100 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            ) : (
              <p className="text-gray-500">Aucun test effectué</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            <p>💡 <strong>Instructions :</strong></p>
            <p>1. Remplacez "votre_mot_de_passe" dans le code par votre vrai mot de passe</p>
            <p>2. Testez la connexion pour obtenir un token</p>
            <p>3. Testez la génération d'email avec le token</p>
          </div>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            → Retour au Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 