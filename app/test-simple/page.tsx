"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestSimplePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Bonjour ${name} ! Le formulaire fonctionne !`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Test Simple</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Votre nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez votre nom"
              />
            </div>
            <Button type="submit" className="w-full">
              Tester
            </Button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
              {message}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 