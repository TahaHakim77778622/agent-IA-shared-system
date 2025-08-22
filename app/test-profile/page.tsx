"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TestProfilePage() {
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({ 
    first_name: 'Jean', 
    last_name: 'Dupont' 
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setResult("Test en cours...");
    
    try {
      // Test de l'endpoint de mise à jour du profil
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token", // Token de test
        },
        body: JSON.stringify({ 
          first_name: profileForm.first_name, 
          last_name: profileForm.last_name 
        }),
      });
      
      const responseText = await res.text();
      setResult(`Status: ${res.status}\nResponse: ${responseText}`);
      
      if (res.ok) {
        toast({ 
          title: "Test réussi", 
          description: "L'endpoint de mise à jour du profil fonctionne !" 
        });
      } else {
        toast({ 
          title: "Test échoué", 
          description: `Erreur ${res.status}: ${responseText}`, 
          variant: "destructive" 
        });
      }
    } catch (err: any) {
      setResult(`Erreur: ${err.message}`);
      toast({ 
        title: "Erreur de test", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Test de la Mise à Jour du Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions de test :</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Modifiez le prénom ou nom ci-dessous</li>
              <li>Cliquez sur "Tester la mise à jour"</li>
              <li>Vérifiez la réponse de l'API</li>
              <li>Regardez les notifications toast</li>
            </ol>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                  placeholder="Votre nom"
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Test en cours..." : "Tester la mise à jour"}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <Label>Résultat du test :</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded-md font-mono text-sm whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <a href="/test-auth" className="block text-blue-600 hover:underline">
              → Test de l'authentification
            </a>
            <a href="/dashboard/profile" className="block text-blue-600 hover:underline">
              → Page de profil complète
            </a>
            <a href="/" className="block text-blue-600 hover:underline">
              → Retour à l'accueil
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 