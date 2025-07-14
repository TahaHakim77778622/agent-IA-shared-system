"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Mail,
  Send,
  Clock,
  AlertCircle,
  Calendar,
  Phone,
  Copy,
  Download,
  Save,
  RotateCcw,
  FileText,
  Code,
  Search,
  Filter,
  Edit,
  Plus,
  TestTube,
  Eye,
  MoreHorizontal,
  LogOut,
  User,
  Settings,
  History,
  Square,
  Home,
  BarChart3,
  Bell,
  HelpCircle,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
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

// Types d'emails
const emailTypes = [
  {
    id: "reclamation",
    title: "Réclamation",
    description: "Email de réclamation ou de plainte",
    icon: AlertCircle,
    color: "bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/40",
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

// Navigation items
const navigationItems = [
  {
    title: "Vue d'ensemble",
    icon: Home,
    id: "overview",
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

// Données simulées
const mockHistory = [
  {
    id: 1,
    subject: "Relance facture n°2024-001",
    type: "relance",
    recipient: "M. Dupont",
    company: "ABC Solutions",
    date: "2024-01-15",
    preview: "Bonjour M. Dupont, J'espère que vous allez bien...",
  },
  {
    id: 2,
    subject: "Demande de rendez-vous commercial",
    type: "rendez-vous",
    recipient: "Mme Martin",
    company: "TechCorp",
    date: "2024-01-14",
    preview: "Madame Martin, Suite à notre échange téléphonique...",
  },
  {
    id: 3,
    subject: "Réclamation produit défectueux",
    type: "reclamation",
    recipient: "Service Client",
    company: "ElectroPlus",
    date: "2024-01-12",
    preview: "Madame, Monsieur, Je vous écris pour vous faire part...",
  },
]

const typeColors = {
  reclamation: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  relance: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "rendez-vous": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  commercial: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  suivi: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  remerciement: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
}

const typeLabels = {
  reclamation: "Réclamation",
  relance: "Relance",
  "rendez-vous": "RDV",
  commercial: "Commercial",
  suivi: "Suivi",
  remerciement: "Remerciement",
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [activeView, setActiveView] = useState("generator")
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    recipient: "",
    company: "",
    subject: "",
    context: "",
    tone: "professionnel",
    urgency: "normale",
  })
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const [emails, setEmails] = useState<any[]>([]);

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
      setEmails(data);
    } catch (err) {
      setEmails([]);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

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
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération")
      }

      const data = await response.json()
      setGeneratedEmail(data.email)
      fetchEmails(); // Rafraîchir l'historique après génération

      toast({
        title: "Email généré avec succès",
        description: "Votre email professionnel est prêt !",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'email. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    toast({
      title: "Copié !",
      description: "L'email a été copié dans le presse-papiers.",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    })
    router.push("/")
  }

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sidebar Component
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
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
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
</SidebarFooter>

    </Sidebar>
  )

  // Vue d'ensemble
  const OverviewView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace ProMail Assistant</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emails récents</CardTitle>
            <CardDescription>Vos dernières générations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHistory.slice(0, 3).map((item) => (
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

        <Card>
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

  // Vue Générateur
  const GeneratorView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Générateur d'emails</h1>
        <p className="text-muted-foreground">Créez des emails professionnels avec l'IA</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <Card>
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

   <Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-foreground">2. Personnalisez votre email</CardTitle>
    <CardDescription className="text-muted-foreground">
      Remplissez les informations pour adapter le contenu
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="recipient" className="text-foreground">
          Destinataire *
        </Label>
        <input
          id="recipient"
          placeholder="Ex: M. Dupont"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          className="bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
          autoComplete="off"
        />
      </div>
      <div>
        <Label htmlFor="company" className="text-foreground">
          Entreprise
        </Label>
        <input
          id="company"
          placeholder="Ex: ABC Solutions"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
          autoComplete="off"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="subject" className="text-foreground">
        Objet personnalisé
      </Label>
      <input
        id="subject"
        placeholder="Laissez vide pour génération automatique"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
        autoComplete="off"
      />
    </div>

    <div>
      <Label htmlFor="context" className="text-foreground">
        Contexte et détails *
      </Label>
      <textarea
        id="context"
        placeholder="Décrivez la situation, les éléments importants, ce que vous souhaitez obtenir..."
        value={formData.context}
        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
        className="min-h-[120px] bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
        autoComplete="off"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="tone" className="text-foreground">
          Ton de l'email
        </Label>
        <select
          id="tone"
          value={formData.tone}
          onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          className="bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
        >
          <option value="professionnel">Professionnel</option>
          <option value="cordial">Cordial</option>
          <option value="formel">Formel</option>
          <option value="amical">Amical</option>
        </select>
      </div>
      <div>
        <Label htmlFor="urgency" className="text-foreground">
          Niveau d'urgence
        </Label>
        <select
          id="urgency"
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
          className="bg-background border border-border text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition"
        >
          <option value="faible">Faible</option>
          <option value="normale">Normale</option>
          <option value="élevée">Élevée</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>
    </div>

    <Button
      onClick={handleGenerate}
      className="w-full bg-primary hover:bg-primary/90"
      disabled={isGenerating}
      size="lg"
    >
      {isGenerating ? "Génération en cours..." : "Générer l'email"}
    </Button>
  </CardContent>
</Card>


        </div>

        {/* Résultat */}
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
                    <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
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
    </div>
  )

  // Autres vues simplifiées
  const TemplatesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground">Gérez vos modèles d'emails</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      <div className="grid gap-6">
        {emailTypes.map((template) => {
          const Icon = template.icon
          return (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{template.title}</h3>
                      <p className="text-muted-foreground">{template.description}</p>
                    </div>
                    <Badge>Actif</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Tester
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const HistoryView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historique</h1>
        <p className="text-muted-foreground">Tous vos emails générés</p>
      </div>

      <Card>
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
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )

  const ExportView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Export</h1>
        <p className="text-muted-foreground">Exportez vos emails</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockHistory.length}</div>
            <p className="text-muted-foreground">Emails totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">2</div>
            <p className="text-muted-foreground">Exportés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
            <p className="text-muted-foreground">KB totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <p className="text-muted-foreground">Sélectionnés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Button variant="ghost" size="sm" className="p-0">
                  <Square className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h4 className="font-medium">{item.subject}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.recipient} • {new Date(item.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge className={typeColors[item.type as keyof typeof typeColors]}>
                  {typeLabels[item.type as keyof typeof typeLabels]}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Word (.docx)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Code className="h-4 w-4 mr-2" />
                      HTML (.html)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Email (.eml)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const StatsView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
        <p className="text-muted-foreground">Analysez vos performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
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
                      <div className="h-2 bg-primary rounded-full" style={{ width: "60%" }} />
                    </div>
                    <span className="text-sm text-muted-foreground">12</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">+24%</div>
              <p className="text-muted-foreground">Amélioration ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">2.3s</div>
              <p className="text-muted-foreground">Génération d'email</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

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

  return (
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
  
}
