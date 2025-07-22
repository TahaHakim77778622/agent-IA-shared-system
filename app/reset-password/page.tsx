"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [form, setForm] = useState({ new_password: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.new_password || !form.confirm) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    if (form.new_password !== form.confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, new_password: form.new_password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la réinitialisation");
      }
      setSuccess(true);
      toast({ title: "Mot de passe modifié", description: "Vous pouvez maintenant vous connecter." });
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Impossible de réinitialiser le mot de passe.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="max-w-md w-full shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Mot de passe modifié !</h2>
            <p className="text-muted-foreground mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <Button className="w-full bg-primary hover:bg-primary/90" asChild>
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="max-w-md w-full shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Réinitialiser le mot de passe</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choisissez un nouveau mot de passe pour <span className="font-semibold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={form.new_password}
                onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading} size="lg">
              {isLoading ? "Changement..." : "Réinitialiser"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 