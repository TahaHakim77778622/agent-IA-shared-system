# Diagrammes de Flux Utilisateur - ProMail Assistant

## 1. Flux Principal Utilisateur

```mermaid
journey
    title Flux Principal - ProMail Assistant
    section Première Visite
      Arrivée sur la page d'accueil: 5: User
      Découverte des fonctionnalités: 4: User
      Inscription: 3: User
      Onboarding: 5: User
      Accès au dashboard: 5: User
    section Utilisation Quotidienne
      Connexion: 5: User
      Génération d'email: 5: User
      Personnalisation: 4: User
      Sauvegarde: 4: User
      Export: 3: User
    section Fonctionnalités Avancées
      Gestion des templates: 4: User
      Historique: 3: User
      Statistiques: 3: User
      Paramètres: 2: User
```

## 2. Flux d'Inscription et Onboarding

```mermaid
flowchart TD
    A[Arrivée sur le site] --> B{Utilisateur existant?}
    B -->|Non| C[Page d'inscription]
    B -->|Oui| D[Page de connexion]
    
    C --> E[Saisie des informations]
    E --> F{Validation}
    F -->|Échec| G[Affichage erreurs]
    F -->|Succès| H[Création compte]
    
    H --> I[Onboarding Modal]
    I --> J[Étape 1: Bienvenue]
    J --> K[Étape 2: Générateur IA]
    K --> L[Étape 3: Templates]
    L --> M[Étape 4: Export]
    M --> N[Étape 5: Sécurité]
    N --> O[Fin onboarding]
    O --> P[Dashboard principal]
    
    G --> E
```

## 3. Flux de Génération d'Email

```mermaid
flowchart TD
    A[Dashboard] --> B[Générateur IA]
    B --> C{Sélection type email}
    
    C --> D[Commercial]
    C --> E[Relance]
    C --> F[Rendez-vous]
    C --> G[Réclamation]
    C --> H[Remerciement]
    C --> I[Informations]
    
    D --> J[Saisie informations]
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[Génération IA]
    K --> L{Qualité OK?}
    L -->|Non| M[Regénération]
    L -->|Oui| N[Affichage résultat]
    
    M --> K
    N --> O{Utilisateur satisfait?}
    O -->|Non| P[Modification manuelle]
    O -->|Oui| Q[Sauvegarde]
    
    P --> N
    Q --> R[Options export]
    R --> S[Word/PDF/Excel]
    R --> T[Email]
    R --> U[Partage]
```

## 4. Flux de Gestion des Templates

```mermaid
flowchart TD
    A[Dashboard] --> B[Section Templates]
    B --> C{Actions disponibles}
    
    C --> D[Créer template]
    C --> E[Modifier template]
    C --> F[Supprimer template]
    C --> G[Rechercher template]
    
    D --> H[Formulaire création]
    H --> I[Sauvegarde]
    
    E --> J[Sélection template]
    J --> K[Édition]
    K --> I
    
    F --> L[Confirmation]
    L --> M{Confirmé?}
    M -->|Oui| N[Suppression]
    M -->|Non| B
    
    G --> O[Barre de recherche]
    O --> P[Résultats]
    P --> Q[Sélection]
    Q --> R[Utilisation]
```

## 5. Flux d'Export et Partage

```mermaid
flowchart TD
    A[Email généré] --> B[Options export]
    B --> C{Type d'export}
    
    C --> D[Word (.docx)]
    C --> E[PDF]
    C --> F[Excel (.xlsx)]
    C --> G[Email (.eml)]
    C --> H[Partage direct]
    
    D --> I[Téléchargement]
    E --> I
    F --> I
    G --> I
    
    H --> J{Plateforme}
    J --> K[Email]
    J --> L[Slack]
    J --> M[Teams]
    J --> N[WhatsApp]
    
    K --> O[Envoi email]
    L --> P[Message Slack]
    M --> Q[Message Teams]
    N --> R[Message WhatsApp]
```

## 6. Flux de Sécurité et RGPD

```mermaid
flowchart TD
    A[Accès application] --> B{Vérification 2FA}
    B -->|Activé| C[Saisie code 2FA]
    B -->|Désactivé| D[Accès direct]
    
    C --> E{Code valide?}
    E -->|Oui| D
    E -->|Non| F[Erreur 2FA]
    
    D --> G[Session active]
    G --> H[Log activité]
    H --> I[Vérification RGPD]
    
    I --> J{Consentement IA?}
    J -->|Oui| K[Utilisation IA]
    J -->|Non| L[Mode limité]
    
    K --> M[Génération emails]
    L --> N[Fonctionnalités de base]
    
    M --> O[Suppression automatique]
    N --> O
    O --> P[Conformité RGPD]
```

## 7. Flux de Performance et Monitoring

```mermaid
flowchart TD
    A[Chargement page] --> B[Collecte métriques]
    B --> C[FCP Measurement]
    C --> D[LCP Measurement]
    D --> E[CLS Measurement]
    E --> F[FID Measurement]
    F --> G[TTI Measurement]
    
    G --> H{Performance OK?}
    H -->|Oui| I[Log succès]
    H -->|Non| J[Alert performance]
    
    I --> K[Envoi métriques]
    J --> L[Notification équipe]
    L --> K
    
    K --> M[Dashboard monitoring]
    M --> N[Analyse tendances]
    N --> O[Optimisations]
```

## 8. Flux PWA et Hors Ligne

```mermaid
flowchart TD
    A[Accès application] --> B{Connexion internet?}
    B -->|Oui| C[Mode normal]
    B -->|Non| D[Mode hors ligne]
    
    C --> E[Service Worker actif]
    E --> F[Mise en cache]
    F --> G[Fonctionnalités complètes]
    
    D --> H[Vérification cache]
    H --> I{Cache disponible?}
    I -->|Oui| J[Fonctionnalités limitées]
    I -->|Non| K[Page offline]
    
    J --> L[Consultation historique]
    J --> M[Modification emails]
    J --> N[Pas de génération IA]
    
    K --> O[Message hors ligne]
    O --> P[Bouton réessayer]
    P --> Q{Vérification connexion}
    Q -->|Rétablie| A
    Q -->|Toujours hors ligne| K
```

## 9. Flux de Support et Aide

```mermaid
flowchart TD
    A[Utilisateur en difficulté] --> B{Type de problème}
    
    B --> C[Problème technique]
    B --> D[Question utilisation]
    B --> E[Bug application]
    B --> F[Demande fonctionnalité]
    
    C --> G[ChatBot IA]
    D --> G
    E --> H[Formulaire bug]
    F --> I[Formulaire demande]
    
    G --> J{Résolution automatique?}
    J -->|Oui| K[Solution proposée]
    J -->|Non| L[Escalade support]
    
    H --> M[Enregistrement bug]
    I --> N[Enregistrement demande]
    
    K --> O{Utilisateur satisfait?}
    O -->|Oui| P[Fermeture ticket]
    O -->|Non| L
    
    L --> Q[Support humain]
    M --> Q
    N --> Q
    Q --> R[Résolution]
    R --> S[Feedback utilisateur]
```

## 10. Flux de Mise à Jour et Maintenance

```mermaid
flowchart TD
    A[Détection mise à jour] --> B{Type de mise à jour}
    
    B --> C[Mise à jour critique]
    B --> D[Mise à jour normale]
    B --> E[Mise à jour mineure]
    
    C --> F[Notification immédiate]
    D --> G[Notification différée]
    E --> H[Mise à jour silencieuse]
    
    F --> I[Redirection maintenance]
    G --> J[Notification push]
    H --> K[Mise à jour automatique]
    
    I --> L[Page maintenance]
    J --> M{Utilisateur accepte?}
    K --> N[Rechargement application]
    
    M -->|Oui| N
    M -->|Non| O[Remise à plus tard]
    
    L --> P[Maintenance terminée]
    N --> Q[Application mise à jour]
    O --> R[Prochaine notification]
    
    P --> Q
    Q --> S[Nouvelles fonctionnalités]
    R --> T[Vérification disponibilité]
``` 