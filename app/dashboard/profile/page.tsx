"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Save, KeyRound, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Mise à jour du nom/prénom
  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ first_name: profileForm.first_name, last_name: profileForm.last_name }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil");
      toast({ title: "Profil mis à jour", description: "Votre nom a été modifié." });
      setEditMode(false);
      setProfileSuccess(true);
      await refreshUser(); // Rafraîchir le contexte utilisateur global
      setTimeout(() => setProfileSuccess(false), 2000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de modifier le profil.", variant: "destructive" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Changement de mot de passe
  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.new }),
      });
      if (!res.ok) throw new Error("Erreur lors du changement de mot de passe");
      toast({ title: "Mot de passe changé", description: "Votre mot de passe a été modifié." });
      setShowPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setPasswordSuccess(true);
      await refreshUser(); // Rafraîchir le contexte utilisateur global
      setTimeout(() => setPasswordSuccess(false), 2000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de changer le mot de passe.", variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const initials = (user?.first_name?.[0] || "U") + (user?.last_name?.[0] || "");

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-12 animate-fade-in">
        <div className="w-full max-w-lg mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary text-lg font-medium mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au dashboard
          </Link>
        </div>
        <Card className="w-full max-w-lg shadow-2xl border-0 rounded-2xl bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <Avatar className="h-20 w-20 mb-2 shadow-lg">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold text-center">Mon profil</CardTitle>
            <div className="text-muted-foreground text-center text-sm">Gérez vos informations personnelles</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" placeholder="Votre prénom" value={editMode ? profileForm.first_name : user?.first_name || ''} disabled={!editMode} onChange={e => setProfileForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Votre nom" value={editMode ? profileForm.last_name : user?.last_name || ''} disabled={!editMode} onChange={e => setProfileForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>
            <div className="flex gap-2 mt-4">
              {editMode ? (
                <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isUpdatingProfile ? "Enregistrement..." : "Enregistrer"}
                </Button>
              ) : (
                <Button onClick={() => setEditMode(true)} variant="outline" className="gap-2">
                  <User className="h-4 w-4" /> Modifier le nom
                </Button>
              )}
              <Button onClick={() => setShowPassword(v => !v)} variant="outline" className="gap-2">
                <KeyRound className="h-4 w-4" /> Changer le mot de passe
              </Button>
            </div>
            {profileSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm mt-2 animate-fade-in">
                <CheckCircle className="h-4 w-4" /> Modifié avec succès
              </div>
            )}
            <hr className="my-4 border-muted" />
            {showPassword && (
              <form onSubmit={handleUpdatePassword} className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="current">Mot de passe actuel</Label>
                  <Input id="current" type="password" placeholder="Votre mot de passe actuel" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="new">Nouveau mot de passe</Label>
                  <Input id="new" type="password" placeholder="Nouveau mot de passe" value={passwordForm.new} onChange={e => setPasswordForm(f => ({ ...f, new: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirm" type="password" placeholder="Confirmez le nouveau mot de passe" value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} required />
                </div>
                <Button type="submit" disabled={isUpdatingPassword} className="gap-2">
                  <KeyRound className="h-4 w-4" /> {isUpdatingPassword ? "Changement..." : "Changer le mot de passe"}
                </Button>
                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm mt-2 animate-fade-in">
                    <CheckCircle className="h-4 w-4" /> Mot de passe modifié
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
} 