"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [editName, setEditName] = useState({ first_name: user?.first_name || "", last_name: user?.last_name || "" });
  const [loadingName, setLoadingName] = useState(false);
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [loadingPw, setLoadingPw] = useState(false);

  if (!user) return null;

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingName(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/register/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editName),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification du profil");
      toast({ title: "Succès", description: "Profil mis à jour." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de modifier le profil.", variant: "destructive" });
    } finally {
      setLoadingName(false);
    }
  };

  const handlePwChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setLoadingPw(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/register/me/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ old_password: pwForm.old_password, new_password: pwForm.new_password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur lors du changement de mot de passe");
      }
      toast({ title: "Succès", description: "Mot de passe modifié." });
      setPwForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Impossible de changer le mot de passe.", variant: "destructive" });
    } finally {
      setLoadingPw(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/40 py-12 px-2">
      <Card className="w-full max-w-lg shadow-2xl border-0 animate-in fade-in zoom-in-95">
        {/* Header visuel */}
        <div className="flex flex-col items-center gap-2 bg-primary/90 rounded-t-xl pb-8 pt-8 relative">
          <Avatar className="h-28 w-28 text-4xl border-4 border-white shadow-lg mb-2 bg-background">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user.first_name?.[0] || "U"}{user.last_name?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <User className="h-6 w-6" /> {user.first_name} {user.last_name}
            </span>
            <span className="text-primary-foreground/80 text-base mt-1">{user.email}</span>
            <Badge className="bg-green-500/90 text-white mt-2">Connecté</Badge>
          </div>
        </div>
        <CardContent className="flex flex-col gap-10 py-10 px-6">
          {/* Section modification nom/prénom */}
          <section className="w-full flex flex-col gap-4 bg-muted/60 rounded-xl p-6 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">Modifier mes informations</span>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleNameChange}>
              <div className="flex gap-2">
                <Input
                  placeholder="Prénom"
                  value={editName.first_name}
                  onChange={e => setEditName(n => ({ ...n, first_name: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Nom"
                  value={editName.last_name}
                  onChange={e => setEditName(n => ({ ...n, last_name: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loadingName}>
                {loadingName ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Enregistrement...</> : "Enregistrer"}
              </Button>
            </form>
          </section>

          {/* Section changement de mot de passe */}
          <section className="w-full flex flex-col gap-4 bg-muted/60 rounded-xl p-6 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">Changer mon mot de passe</span>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handlePwChange}>
              <Input
                type="password"
                placeholder="Ancien mot de passe"
                value={pwForm.old_password}
                onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={pwForm.new_password}
                onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                required
              />
              <Button type="submit" className="w-full" disabled={loadingPw}>
                {loadingPw ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Changement...</> : "Changer le mot de passe"}
              </Button>
            </form>
          </section>

          <Button variant="destructive" size="lg" className="w-full flex gap-2 items-center justify-center text-base font-semibold mt-2" onClick={() => { logout(); router.push("/login"); }}>
            <LogOut className="h-5 w-5" /> Déconnexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 