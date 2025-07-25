// app/dashboard/page.tsx
// --------------------------------------------------
// Page principale du dashboard utilisateur
// Permet de générer, gérer, exporter et personnaliser des emails pros avec l'IA
// Auteur : Karim | Dernière modif : 2025-07-24
// --------------------------------------------------

"use client"

// --- Imports React et hooks ---
import { useState, useEffect } from "react"

// --- Imports UI (shadcn/ui) ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Imports Sidebar (navigation dashboard) ---
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// --- Imports d'icônes Lucide ---
import {
  Mail, Send, Clock, AlertCircle, Calendar, Phone, Copy, Download, Save, RotateCcw, FileText, Code, Search, Filter, Edit, Plus, TestTube, Eye, MoreHorizontal, LogOut, User, Settings, History, Square, Home, BarChart3, Bell, HelpCircle, Zap, CheckCircle, TrendingUp,
} from "lucide-react"

// --- Hooks personnalisés et utilitaires ---
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import ChatBot from "@/components/ChatBot";
import ChatBotModal from '@/components/ChatBotModal';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { ThemeSwitcher } from "@/components/navbar";
import { PageTransition } from "@/components/PageTransition";
import jsPDF from "jspdf";

// --- Définition des types d'emails proposés dans le dashboard ---
const emailTypes = [
  {
    id: "reclamation", // Identifiant unique du type
    title: "Réclamation", // Nom affiché
    description: "Email de réclamation ou de plainte", // Description courte
    icon: AlertCircle, // Icône associée (Lucide)
    color: "bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/40", // Couleur pour l'UI
  },
  {
    id: "relance",
    title: "Relance client",
    description: "Relance pour paiement ou suivi",
    icon: Clock,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/40",
  },
  {
    id: "rendez-vous",
    title: "Prise de rendez-vous",
    description: "Demande ou confirmation de rendez-vous",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40",
  },
  {
    id: "commercial",
    title: "Email commercial",
    description: "Prospection ou offre commerciale",
    icon: Send,
    color: "bg-green-500/10 text-green-400 border-green-500/20 hover:border-green-500/40",
  },
  {
    id: "suivi",
    title: "Suivi client",
    description: "Email de suivi ou de service client",
    icon: Phone,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40",
  },
  {
    id: "remerciement",
    title: "Remerciement",
    description: "Email de remerciement professionnel",
    icon: Mail,
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:border-pink-500/40",
  },
]

// --- Définition des items de navigation du dashboard (sidebar) ---
const navigationItems = [
  {
    title: "Vue d'ensemble", // Titre affiché
    icon: Home, // Icône associée
    id: "overview", // Identifiant unique
  },
  {
    title: "Générateur",
    icon: Zap,
    id: "generator",
  },
  {
    title: "Templates",
    icon: FileText,
    id: "templates",
  },
  {
    title: "Historique",
    icon: History,
    id: "history",
  },
  {
    title: "Export",
    icon: Download,
    id: "export",
  },
  {
    title: "Statistiques",
    icon: BarChart3,
    id: "stats",
  },
]

// --- Couleurs associées à chaque type d'email pour les badges/labels ---
const typeColors = {
  reclamation: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  relance: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "rendez-vous": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  commercial: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  suivi: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  remerciement: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
}

// --- Labels courts pour chaque type d'email (pour UI compacte) ---
const typeLabels = {
  reclamation: "Réclamation",
  relance: "Relance",
  "rendez-vous": "RDV",
  commercial: "Commercial",
  suivi: "Suivi",
  remerciement: "Remerciement",
}

// --- Composant principal du dashboard ---
export default function DashboardPage() {
  const { user, loading, logout } = useAuth(); // Récupère l'utilisateur connecté et les actions auth
  const [activeView, setActiveView] = useState("generator") // Vue active (onglet du dashboard)
  const [selectedType, setSelectedType] = useState("") // Type d'email sélectionné
  const [formData, setFormData] = useState({ // Données du formulaire de génération d'email
    recipient: "",
    company: "",
    subject: "",
    context: "",
    tone: "professionnel",
    urgency: "normale",
  })
  const [generatedEmail, setGeneratedEmail] = useState("") // Email généré par l'IA
  const [isGenerating, setIsGenerating] = useState(false) // Indique si l'IA est en cours de génération
  const [searchTerm, setSearchTerm] = useState("") // Terme de recherche pour filtrer les emails/templates
  const { toast } = useToast() // Hook pour afficher les notifications toast
  const router = useRouter() // Hook Next.js pour la navigation
  const [emails, setEmails] = useState<any[]>([]); // Liste des emails générés (historique)
  const [showChatBot, setShowChatBot] = useState(false); // Affiche ou non le chatbot

  // --- Gestion des templates dynamiques ---
  const [templates, setTemplates] = useState<any[]>([]); // Liste des templates personnalisés
  const [loadingTemplates, setLoadingTemplates] = useState(false); // Chargement des templates
  const [showTemplateForm, setShowTemplateForm] = useState(false); // Affiche le formulaire d'ajout/édition de template
  const [editingTemplate, setEditingTemplate] = useState<any>(null); // Template en cours d'édition
  const [templateForm, setTemplateForm] = useState({ title: "", description: "", type: "", actif: true }); // Formulaire template

  // --- États pour la gestion de la suppression (confirmation modale) ---
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean, id: number|null}>({open: false, id: null});
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<{open: boolean, id: number|null}>({open: false, id: null});

  // --- États pour l'édition d'email ---
  const [editEmail, setEditEmail] = useState<any>(null);
  const [editEmailForm, setEditEmailForm] = useState({ subject: "", body: "", recipient: "", type: "", company: "" });

  // --- Ajout état pour la sauvegarde d'email généré ---
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // --- Ajout état pour la modal Profil ---
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // --- Fonctions utilitaires pour ouvrir/fermer les formulaires ---
  // Affiche le formulaire pour ajouter un template
  const openAddTemplateForm = () => {
    setShowTemplateForm(true); // Ouvre le formulaire
    setEditingTemplate(null); // Pas d'édition en cours
    setTemplateForm({ title: "", description: "", type: "", actif: true }); // Réinitialise le formulaire
  };
  // Affiche le formulaire pour éditer un template
  const openEditTemplateForm = (template: any) => {
    setShowTemplateForm(true); // Ouvre le formulaire
    setEditingTemplate(template); // Passe en mode édition
    setTemplateForm({ title: template.title, description: template.description, type: template.type, actif: template.actif }); // Pré-remplit le formulaire
  };
  // Ferme le formulaire
  const closeTemplateForm = () => {
    setShowTemplateForm(false); // Ferme le formulaire
    setEditingTemplate(null); // Annule l'édition
    setTemplateForm({ title: "", description: "", type: "", actif: true }); // Réinitialise le formulaire
  };

  // --- Récupération des templates depuis l'API backend ---
  const fetchTemplates = async () => {
    setLoadingTemplates(true); // Affiche le loader
    try {
      const token = localStorage.getItem("token"); // Récupère le token JWT
      const res = await fetch("http://localhost:8000/api/templates/", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des templates");
      const data = await res.json();
      setTemplates(data); // Met à jour la liste des templates
    } catch (err) {
      setTemplates([]); // En cas d'erreur, vide la liste
    } finally {
      setLoadingTemplates(false); // Cache le loader
    }
  };
  useEffect(() => { fetchTemplates(); }, []); // Appel au chargement du dashboard

  // --- Ajout ou modification d'un template (POST/PUT) ---
  const handleSubmitTemplate = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingTemplate ? `http://localhost:8000/api/templates/${editingTemplate.id}` : "http://localhost:8000/api/templates/";
    const method = editingTemplate ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(templateForm),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement du template");
      closeTemplateForm(); // Ferme le formulaire
      fetchTemplates(); // Rafraîchit la liste
      toast({ title: "Succès", description: editingTemplate ? "Template modifié." : "Template ajouté." });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le template.", variant: "destructive" });
    }
  };
  // --- Suppression d'un template ---
  const handleDeleteTemplate = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/templates/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du template");
      closeTemplateForm();
      fetchTemplates();
      toast({ title: "Succès", description: "Template supprimé." });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de supprimer le template.", variant: "destructive" });
    }
  };

  // --- Redirection si non authentifié ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || (!loading && !user)) {
      router.push("/login"); // Redirige vers la page de login si pas connecté
    }
  }, [user, loading, router]);

  // --- Récupération des emails générés (historique) depuis l'API ---
  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/emails/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des emails");
      const data = await res.json();
      setEmails(data); // Met à jour la liste des emails
    } catch (err) {
      setEmails([]); // En cas d'erreur, vide la liste
    }
  };

  // --- Chargement initial de l'historique d'emails ---
  useEffect(() => {
    fetchEmails(); // Récupère les emails à l'ouverture du dashboard
  }, []);

  // --- Génération d'email par l'IA (appel API backend) ---
  const handleGenerate = async () => {
    if (!selectedType || !formData.recipient || !formData.context) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Construction du prompt pour l'IA
    const prompt = `Rédige un email de type ${selectedType} à ${formData.recipient}${formData.company ? ` de l'entreprise ${formData.company}` : ''}.
Contexte : ${formData.context}
Ton : ${formData.tone}
Urgence : ${formData.urgency}`

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/generate-email/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          subject: formData.subject || `Email généré par IA`,
          type: selectedType,
          recipient: formData.recipient,
          company: formData.company,
        }),
      })

      if (!response.ok) {
        let errorMsg = "Erreur lors de la génération";
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json()
      setGeneratedEmail(data.email)
      fetchEmails(); // Rafraîchir l'historique après génération

      toast({
        title: "Email généré avec succès",
        description: "Votre email professionnel est prêt !",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer l'email. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // --- Copier l'email généré dans le presse-papiers ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    toast({
      title: "Copié !",
      description: "L'email a été copié dans le presse-papiers.",
    })
  }

  // --- Déconnexion utilisateur ---
  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    })
    router.push("/")
  }

  // --- Mise à jour d'un email existant (édition) ---
  const handleUpdateEmail = async (e: any) => {
    e.preventDefault();
    if (!editEmail) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/emails/${editEmail.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editEmailForm),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification de l'email");
      fetchEmails();
      toast({ title: "Succès", description: "Email modifié." });
      setEditEmail(null);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de modifier l'email.", variant: "destructive" });
    }
  };

  // --- Pré-remplir le formulaire d'édition d'email ---
  const handleEditEmail = (email: any) => {
    setEditEmail(email);
    setEditEmailForm({
      subject: email.subject || "",
      body: email.body || "",
      recipient: email.recipient || "",
      type: email.type || "",
      company: email.company || ""
    });
  };

  // --- Suppression d'un email ---
  const handleDeleteEmail = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/emails/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'email");
      fetchEmails();
      toast({ title: "Succès", description: "Email supprimé." });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'email.", variant: "destructive" });
    }
    setConfirmDeleteEmail({open: false, id: null});
  };

  // --- Fonction pour sauvegarder l'email généré dans l'historique ---
  const handleSaveGeneratedEmail = async () => {
    if (!generatedEmail || isSaved) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/emails/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          subject: formData.subject || `Email généré par IA`,
          body: generatedEmail,
          recipient: formData.recipient,
          company: formData.company,
          type: selectedType,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde de l'email");
      setIsSaved(true);
      fetchEmails();
      toast({ title: "Succès", description: "Email sauvegardé dans l'historique !" });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'email.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Pré-remplissage du générateur depuis le ChatBot ---
  const handleChatBotToGenerator = (fields: Partial<typeof formData & { body: string, type: string }>) => {
    setShowChatBot(false);
    setActiveView("generator");
    if (fields.type) setSelectedType(fields.type);
    setFormData(prev => ({
      ...prev,
      recipient: fields.recipient ?? '',
      subject: fields.subject ?? '',
      company: fields.company ?? '',
      context: fields.context ?? '',
      tone: fields.tone ?? prev.tone ?? 'professionnel',
      urgency: fields.urgency ?? prev.urgency ?? 'normale',
    }));
    if (fields.body) setGeneratedEmail(fields.body);
  };

  // --- Composant Sidebar du dashboard ---
  const AppSidebar = () => (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="bg-primary p-2 rounded-lg">
            <Mail className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">ProMail Assistant</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Raccourcis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircle className="h-4 w-4" />
                  <span>Aide</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

     <SidebarFooter className="border-t border-border">
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="w-full">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>
                {(user?.first_name?.[0] || "U") + (user?.last_name?.[0] || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {user?.first_name || ""} {user?.last_name || ""}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="w-56">
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            <User className="h-4 w-4 mr-2" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
  <div className="px-4 py-2">
    <ThemeSwitcher />
  </div>
</SidebarFooter>

    </Sidebar>
  )

  // --- Vue d'ensemble du dashboard (OverviewView) ---
  const OverviewView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace ProMail Assistant</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Emails générés */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails générés</p>
                <p className="text-3xl font-bold text-foreground">127</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">ce mois</span>
            </div>
          </CardContent>
        </Card>

        {/* Templates utilisés */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates utilisés</p>
                <p className="text-3xl font-bold text-foreground">6</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-muted-foreground">Tous actifs</span>
            </div>
          </CardContent>
        </Card>

        {/* Temps économisé */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps économisé</p>
                <p className="text-3xl font-bold text-foreground">24h</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-muted-foreground">Cette semaine</span>
            </div>
          </CardContent>
        </Card>

        {/* Taux de succès */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de succès</p>
                <p className="text-3xl font-bold text-foreground">94%</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-500">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente (emails récents) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Emails récents</CardTitle>
            <CardDescription>Vos dernières générations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emails.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.recipient}</p>
                  </div>
                  <Badge className={typeColors[item.type as keyof typeof typeColors]} variant="secondary">
                    {typeLabels[item.type as keyof typeof typeLabels]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setActiveView("generator")}
              >
                <Zap className="h-6 w-6" />
                <span className="text-sm">Nouveau email</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setActiveView("templates")}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">Templates</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setActiveView("history")}
              >
                <History className="h-6 w-6" />
                <span className="text-sm">Historique</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setActiveView("export")}
              >
                <Download className="h-6 w-6" />
                <span className="text-sm">Export</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // --- Vue Générateur d'emails (GeneratorView) ---
  const GeneratorView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Générateur d'emails</h1>
        <p className="text-muted-foreground">Créez des emails professionnels avec l'IA</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* --- Configuration du type d'email --- */}
        <div className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>1. Type d'email</CardTitle>
              <CardDescription>Sélectionnez le cas d'usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emailTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        selectedType === type.id ? "bg-primary hover:bg-primary/90" : type.color
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">{type.title}</div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* --- Formulaire de personnalisation de l'email --- */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">2. Personnalisez votre email</CardTitle>
              <CardDescription className="text-muted-foreground">
                Remplissez les informations pour adapter le contenu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleGenerate();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipient" className="text-foreground">
                      Destinataire *
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="Ex: M. Dupont"
                      value={formData.recipient}
                      onChange={e => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-foreground">
                      Entreprise
                    </Label>
                    <Input
                      id="company"
                      placeholder="Ex: ABC Solutions"
                      value={formData.company}
                      onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground">
                    Objet personnalisé
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Laissez vide pour génération automatique"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="context" className="text-foreground">
                    Contexte et détails *
                  </Label>
                  <Textarea
                    id="context"
                    placeholder="Décrivez la situation, les éléments importants, ce que vous souhaitez obtenir..."
                    className="min-h-[120px] bg-background border-border"
                    value={formData.context}
                    onChange={e => setFormData(prev => ({ ...prev, context: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone" className="text-foreground">
                      Ton de l'email
                    </Label>
                    <Select
                      value={formData.tone}
                      onValueChange={value => setFormData(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                        <SelectItem value="cordial">Cordial</SelectItem>
                        <SelectItem value="formel">Formel</SelectItem>
                        <SelectItem value="amical">Amical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency" className="text-foreground">
                      Niveau d'urgence
                    </Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={value => setFormData(prev => ({ ...prev, urgency: value }))}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="élevée">Élevée</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button onClick={() => setShowChatBot(true)} variant="outline">Discuter avec l'IA</Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>Générer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- Résultat de la génération IA --- */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>3. Résultat</CardTitle>
                  <CardDescription>Votre email généré</CardDescription>
                </div>
                {generatedEmail && (
                  <Button variant="outline" size="sm" onClick={() => handleGenerate()} disabled={isGenerating}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regénérer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedEmail ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 border rounded-lg p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedEmail}</pre>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={copyToClipboard} className="flex-1 sm:flex-none">
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none bg-transparent"
                      onClick={handleSaveGeneratedEmail}
                      disabled={isSaving || isSaved || !generatedEmail}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaved ? "Déjà sauvegardé" : isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={exportGeneratedEmailAsEML}>
                          <Mail className="h-4 w-4 mr-2" /> Email (.eml)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportGeneratedEmailAsWord}>
                          <FileText className="h-4 w-4 mr-2" /> Word (.docx)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportGeneratedEmailAsPDF}>
                          <FileText className="h-4 w-4 mr-2" /> PDF (.pdf)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportGeneratedEmailAsExcel}>
                          <FileText className="h-4 w-4 mr-2" /> Excel (.xlsx)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/20 border-2 border-dashed rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                  <div>
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2 font-medium">Aucun email généré</p>
                    <p className="text-sm text-muted-foreground">Sélectionnez un type et remplissez le formulaire</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* --- Intégration du ChatBotModal pour assistance IA --- */}
      <ChatBotModal open={showChatBot} onClose={() => setShowChatBot(false)} onSendToGenerator={handleChatBotToGenerator} />
    </div>
  )

  // --- Vue de gestion des templates (CRUD) ---
  const TemplatesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground">Gérez vos modèles d'emails</p>
        </div>
        {/* Bouton pour ajouter un nouveau template */}
        <Button onClick={() => { setShowTemplateForm(true); setEditingTemplate(null); setTemplateForm({ title: "", description: "", type: "", actif: true }); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>
      {/* Formulaire d'ajout/édition de template */}
      {activeView === "templates" && showTemplateForm && (
        <form className="p-4 border rounded-lg bg-muted/10" onSubmit={handleSubmitTemplate}>
          <h2 className="font-semibold mb-2">{editingTemplate ? "Modifier" : "Ajouter"} un template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Titre" value={templateForm.title} onChange={e => setTemplateForm(f => ({ ...f, title: e.target.value }))} required />
            <Input placeholder="Type (ex: reclamation)" value={templateForm.type} onChange={e => setTemplateForm(f => ({ ...f, type: e.target.value }))} required />
            <Input placeholder="Description" value={templateForm.description} onChange={e => setTemplateForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editingTemplate ? "Enregistrer" : "Ajouter"}</Button>
            <Button variant="outline" type="button" onClick={closeTemplateForm}>Annuler</Button>
            {editingTemplate && (
              <Button variant="destructive" type="button" onClick={() => setConfirmDelete({open: true, id: editingTemplate.id})}>Supprimer</Button>
            )}
          </div>
        </form>
      )}
      {/* Liste des templates existants */}
      <div className="grid gap-6">
        {loadingTemplates ? <div>Chargement...</div> : templates.length === 0 ? <div>Aucun template.</div> : templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    <p className="text-muted-foreground">{template.description}</p>
                    <Badge>{template.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setShowTemplateForm(true); setEditingTemplate(template); setTemplateForm({ title: template.title, description: template.description, type: template.type, actif: template.actif }); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDelete({open: true, id: template.id})}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // --- Vue historique des emails générés (HistoryView) ---
  const HistoryView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historique</h1>
        <p className="text-muted-foreground">Tous vos emails générés</p>
      </div>

      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste filtrée des emails générés */}
      <div className="space-y-4">
        {emails
          .filter((item) =>
            item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.body.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.subject}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Créé le : {new Date(item.createdAt).toLocaleString("fr-FR")}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.body.slice(0, 100)}...</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditEmail(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteEmail({open: true, id: item.id})}>
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )

  // --- Vue d'export des emails (ExportView) ---
  const ExportView = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { toast } = useToast();

    // Sélectionner/désélectionner un email pour l'export
    const toggleSelect = (id: number) => {
      setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
    };
    const selectAll = () => setSelectedIds(emails.map(e => e.id));
    const deselectAll = () => setSelectedIds([]);

    // Export Excel groupé
    const exportExcel = () => {
      const data = emails.filter(e => selectedIds.includes(e.id)).map(e => ({
        Sujet: e.subject,
        Destinataire: e.recipient,
        Société: e.company,
        Type: e.type,
        Date: e.createdAt ? new Date(e.createdAt).toLocaleString("fr-FR") : "",
        Contenu: e.body,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Emails");
      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buf], { type: "application/octet-stream" }), "emails.xlsx");
      toast({ title: "Export Excel", description: "Fichier Excel téléchargé." });
    };

    // Export Word groupé
    const exportWord = async () => {
      const data = emails.filter(e => selectedIds.includes(e.id));
      const doc = new Document({
        sections: [{
          children: data.map(e => new Paragraph({
            children: [
              new TextRun({ text: `Sujet: ${e.subject}`, bold: true }),
              new TextRun("\n"),
              new TextRun({ text: `Destinataire: ${e.recipient}` }),
              new TextRun("\n"),
              new TextRun({ text: `Société: ${e.company}` }),
              new TextRun("\n"),
              new TextRun({ text: `Type: ${e.type}` }),
              new TextRun("\n"),
              new TextRun({ text: `Date: ${e.createdAt ? new Date(e.createdAt).toLocaleString("fr-FR") : ""}` }),
              new TextRun("\n\n"),
              new TextRun({ text: e.body }),
              new TextRun("\n\n-----------------------------\n\n"),
            ],
          })),
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "emails.docx");
      toast({ title: "Export Word", description: "Fichier Word téléchargé." });
    };

    // Export Gmail (mailto) groupé (ouvre un mailto avec tous les sujets concaténés)
    const exportGmail = () => {
      const data = emails.filter(e => selectedIds.includes(e.id));
      if (data.length === 0) return;
      const subject = data.map(e => e.subject).join(" | ");
      const body = data.map(e => `Sujet: ${e.subject}\nDestinataire: ${e.recipient}\nSociété: ${e.company}\nType: ${e.type}\nDate: ${e.createdAt ? new Date(e.createdAt).toLocaleString("fr-FR") : ""}\n\n${e.body}\n\n-----------------------------\n`).join("\n");
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    // Export Excel/Word/Gmail pour un email
    const exportOneExcel = (email: any) => {
      const ws = XLSX.utils.json_to_sheet([{ Sujet: email.subject, Destinataire: email.recipient, Société: email.company, Type: email.type, Date: email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : "", Contenu: email.body }]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Email");
      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buf], { type: "application/octet-stream" }), `email-${email.id}.xlsx`);
      toast({ title: "Export Excel", description: "Fichier Excel téléchargé." });
    };
    // --- Export d'un email individuel au format Word ---
    const exportOneWord = async (email: any) => {
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `Sujet: ${email.subject}`, bold: true }),
                new TextRun("\n"),
                new TextRun({ text: `Destinataire: ${email.recipient}` }),
                new TextRun("\n"),
                new TextRun({ text: `Société: ${email.company}` }),
                new TextRun("\n"),
                new TextRun({ text: `Type: ${email.type}` }),
                new TextRun("\n"),
                new TextRun({ text: `Date: ${email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : ""}` }),
                new TextRun("\n\n"),
                new TextRun({ text: email.body }),
              ],
            }),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `email-${email.id}.docx`);
      toast({ title: "Export Word", description: "Fichier Word téléchargé." });
    };
    // --- Export d'un email individuel vers Gmail (pré-remplissage) ---
    const exportOneGmail = (email: any) => {
      const subject = email.subject;
      const body = `Destinataire: ${email.recipient}\nSociété: ${email.company}\nType: ${email.type}\nDate: ${email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : ""}\n\n${email.body}`;
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    // Ajoute la fonction d'export PDF groupé dans ExportView
    // Export PDF groupé
    const exportPDF = () => {
      const doc = new jsPDF();
      emails.filter(e => selectedIds.includes(e.id)).forEach((email, idx) => {
        let y = 10;
        if (idx > 0) {
          doc.addPage();
        }
        doc.setFontSize(14);
        doc.text(`Sujet: ${email.subject}`, 10, y); y += 10;
        doc.text(`Destinataire: ${email.recipient}`, 10, y); y += 10;
        doc.text(`Société: ${email.company}`, 10, y); y += 10;
        doc.text(`Type: ${email.type}`, 10, y); y += 10;
        doc.text(`Date: ${email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : ""}`, 10, y); y += 10;
        doc.text("Contenu:", 10, y); y += 10;
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(email.body, 180), 10, y);
      });
      doc.save(`emails-${Date.now()}.pdf`);
      toast({ title: "Export PDF", description: "Fichier PDF téléchargé." });
    };
    // Export PDF individuel
    const exportOnePDF = (email: any) => {
      const doc = new jsPDF();
      let y = 10;
      doc.setFontSize(14);
      doc.text(`Sujet: ${email.subject}`, 10, y); y += 10;
      doc.text(`Destinataire: ${email.recipient}`, 10, y); y += 10;
      doc.text(`Société: ${email.company}`, 10, y); y += 10;
      doc.text(`Type: ${email.type}`, 10, y); y += 10;
      doc.text(`Date: ${email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : ""}`, 10, y); y += 10;
      doc.text("Contenu:", 10, y); y += 10;
      doc.setFontSize(12);
      doc.text(doc.splitTextToSize(email.body, 180), 10, y);
      doc.save(`email-${email.id}.pdf`);
      toast({ title: "Export PDF", description: "Fichier PDF téléchargé." });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Export</h1>
            <p className="text-muted-foreground">Exportez vos emails au format Excel, Word ou Gmail</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll}>Tout sélectionner</Button>
            <Button variant="outline" onClick={deselectAll}>Tout désélectionner</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={selectedIds.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter la sélection
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportExcel} disabled={selectedIds.length === 0}>
                  <FileText className="h-4 w-4 mr-2" /> Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportWord} disabled={selectedIds.length === 0}>
                  <FileText className="h-4 w-4 mr-2" /> Word (.docx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportGmail} disabled={selectedIds.length === 0}>
                  <Mail className="h-4 w-4 mr-2" /> Gmail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF} disabled={selectedIds.length === 0}>
                  <FileText className="h-4 w-4 mr-2" /> PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* --- Tableau des emails à exporter --- */}
        <Card className="animate-fade-in">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2"><input type="checkbox" checked={selectedIds.length === emails.length && emails.length > 0} onChange={e => e.target.checked ? selectAll() : deselectAll()} /></th>
                    <th className="px-4 py-2">Sujet</th>
                    <th className="px-4 py-2">Destinataire</th>
                    <th className="px-4 py-2">Société</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map(email => (
                    <tr key={email.id} className={selectedIds.includes(email.id) ? "bg-primary/10" : ""}>
                      <td className="px-4 py-2 text-center">
                        <input type="checkbox" checked={selectedIds.includes(email.id)} onChange={() => toggleSelect(email.id)} />
                      </td>
                      <td className="px-4 py-2 font-medium">{email.subject}</td>
                      <td className="px-4 py-2">{email.recipient}</td>
                      <td className="px-4 py-2">{email.company}</td>
                      <td className="px-4 py-2">{email.type}</td>
                      <td className="px-4 py-2">{email.createdAt ? new Date(email.createdAt).toLocaleString("fr-FR") : ""}</td>
                      <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" /> Exporter
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => exportOneExcel(email)}>
                              <FileText className="h-4 w-4 mr-2" /> Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportOneWord(email)}>
                              <FileText className="h-4 w-4 mr-2" /> Word (.docx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportOneGmail(email)}>
                              <Mail className="h-4 w-4 mr-2" /> Gmail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportOnePDF(email)}>
                              <FileText className="h-4 w-4 mr-2" /> PDF (.pdf)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // --- Vue statistiques (StatsView) ---
  const StatsView = () => {
    // Calculer les stats à partir des vrais emails générés
    const emailsByType = emails.reduce((acc, email) => {
      acc[email.type] = (acc[email.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground">Analysez vos performances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Emails par type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(typeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: `${(emailsByType[key] || 0) / (emails.length || 1) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground">{emailsByType[key] || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Performance mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {(() => {
                    const thisMonth = new Date().getMonth();
                    const count = emails.filter(e => new Date(e.createdAt).getMonth() === thisMonth).length;
                    return `+${count}`;
                  })()}
                </div>
                <p className="text-muted-foreground">Générés ce mois</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Emails totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{emails.length}</div>
                <p className="text-muted-foreground">Total générés</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // --- Fonction de rendu de la vue active (onglet) ---
  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <OverviewView />
      case "generator":
        return <GeneratorView />
      case "templates":
        return <TemplatesView />
      case "history":
        return <HistoryView />
      case "export":
        return <ExportView />
      case "stats":
        return <StatsView />
      default:
        return <OverviewView />
    }
  }

  // --- Fonction pour exporter l'email généré au format EML (email) ---
  const exportGeneratedEmailAsEML = () => {
    if (!generatedEmail) return;
    const emlContent = `Subject: ${formData.subject || "Email généré par IA"}\nTo: ${formData.recipient}\n\n${generatedEmail}`;
    const blob = new Blob([emlContent], { type: "message/rfc822" });
    saveAs(blob, `email-${Date.now()}.eml`);
    toast({ title: "Export Email", description: "Fichier .eml téléchargé." });
  };
  // --- Fonction pour exporter l'email généré au format Word ---
  const exportGeneratedEmailAsWord = async () => {
    if (!generatedEmail) return;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `Sujet: ${formData.subject || "Email généré par IA"}`, bold: true }),
              new TextRun("\n"),
              new TextRun({ text: `Destinataire: ${formData.recipient}` }),
              new TextRun("\n"),
              new TextRun({ text: `Société: ${formData.company}` }),
              new TextRun("\n"),
              new TextRun({ text: `Type: ${selectedType}` }),
              new TextRun("\n\n"),
              new TextRun({ text: generatedEmail }),
            ],
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `email-${Date.now()}.docx`);
    toast({ title: "Export Word", description: "Fichier Word téléchargé." });
  };
  // --- Fonction pour exporter l'email généré au format Excel ---
  const exportGeneratedEmailAsExcel = () => {
    if (!generatedEmail) return;
    const data = [{
      Sujet: formData.subject || "Email généré par IA",
      Destinataire: formData.recipient,
      Société: formData.company,
      Type: selectedType,
      Contenu: generatedEmail,
    }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Email");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `email-${Date.now()}.xlsx`);
    toast({ title: "Export Excel", description: "Fichier Excel téléchargé." });
  };
  // --- Fonction pour exporter l'email généré au format PDF ---
  const exportGeneratedEmailAsPDF = () => {
    if (!generatedEmail) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Sujet: ${formData.subject || "Email généré par IA"}`, 10, 10);
    doc.text(`Destinataire: ${formData.recipient}`, 10, 20);
    doc.text(`Société: ${formData.company}`, 10, 30);
    doc.text(`Type: ${selectedType}`, 10, 40);
    doc.text("Contenu:", 10, 50);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(generatedEmail, 180), 10, 60);
    doc.save(`email-${Date.now()}.pdf`);
    toast({ title: "Export PDF", description: "Fichier PDF téléchargé." });
  };

  // --- Fonction pour mettre à jour le nom/prénom ---
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
      setShowProfileModal(false);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de modifier le profil.", variant: "destructive" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // --- Fonction pour changer le mot de passe ---
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
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de changer le mot de passe.", variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </header>
            <main className="flex-1 overflow-auto p-6 bg-background">
              <div className="max-w-7xl mx-auto">{renderView()}</div>
            </main>
            {/* Widget ChatBot flottant en bas à droite */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
              <ChatBot />
            </div>
          </SidebarInset>
        </div>
        <Dialog open={confirmDelete.open} onOpenChange={open => !open && setConfirmDelete({open: false, id: null})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p>Voulez-vous vraiment supprimer ce template ? Cette action est irréversible.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete({open: false, id: null})}>Annuler</Button>
              <Button variant="destructive" onClick={() => { if (confirmDelete.id) handleDeleteTemplate(confirmDelete.id); setConfirmDelete({open: false, id: null}); }}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={confirmDeleteEmail.open} onOpenChange={open => !open && setConfirmDeleteEmail({open: false, id: null})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p>Voulez-vous vraiment supprimer cet email ? Cette action est irréversible.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteEmail({open: false, id: null})}>Annuler</Button>
              <Button variant="destructive" onClick={() => confirmDeleteEmail.id && handleDeleteEmail(confirmDeleteEmail.id)}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editEmail} onOpenChange={open => !open && setEditEmail(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'email</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <Input placeholder="Sujet" value={editEmailForm.subject} onChange={e => setEditEmailForm(f => ({ ...f, subject: e.target.value }))} required />
              <Textarea placeholder="Contenu" value={editEmailForm.body} onChange={e => setEditEmailForm(f => ({ ...f, body: e.target.value }))} required />
              <Input placeholder="Destinataire" value={editEmailForm.recipient} onChange={e => setEditEmailForm(f => ({ ...f, recipient: e.target.value }))} />
              <Input placeholder="Type" value={editEmailForm.type} onChange={e => setEditEmailForm(f => ({ ...f, type: e.target.value }))} />
              <Input placeholder="Société" value={editEmailForm.company} onChange={e => setEditEmailForm(f => ({ ...f, company: e.target.value }))} />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditEmail(null)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Ajoute un loader global si isGenerating ou loadingTemplates */}
        {(isGenerating || loadingTemplates) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col items-center gap-2">
              <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              <span className="text-muted-foreground mt-2">Chargement…</span>
            </div>
          </div>
        )}
      </SidebarProvider>
    </PageTransition>
  )
  
}