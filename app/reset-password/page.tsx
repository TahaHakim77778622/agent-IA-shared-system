"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ new: '', confirm: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.new !== form.confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: form.new }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la réinitialisation");
      }
      setSuccess(true);
      toast({ title: "Mot de passe réinitialisé", description: "Vous pouvez maintenant vous connecter." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Impossible de réinitialiser le mot de passe.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-12 animate-fade-in">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <CardTitle className="text-2xl font-bold text-center">Réinitialiser le mot de passe</CardTitle>
            <div className="text-muted-foreground text-center text-sm">Choisissez un nouveau mot de passe sécurisé</div>
          </CardHeader>
          <CardContent className="space-y-6">
            {success ? (
              <div className="flex flex-col items-center gap-2 text-green-600 animate-fade-in">
                <CheckCircle className="h-8 w-8" />
                <div className="font-semibold">Mot de passe modifié avec succès !</div>
                <div className="text-muted-foreground text-sm">Redirection vers la connexion...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="new">Nouveau mot de passe</Label>
                  <Input id="new" type="password" placeholder="Nouveau mot de passe" value={form.new} onChange={e => setForm({ ...form, new: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirm" type="password" placeholder="Confirmez le nouveau mot de passe" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                  {isSubmitting ? "Changement..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
} 