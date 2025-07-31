# Diagramme d'Activités - ProMail Assistant

## 1. Activité Principale - Génération d'Email

```mermaid
flowchart TD
    A[Début] --> B[Accès au générateur]
    B --> C{Utilisateur connecté?}
    C -->|Non| D[Redirection connexion]
    C -->|Oui| E[Affichage formulaire]
    
    E --> F[Sélection type d'email]
    F --> G[Saisie informations]
    G --> H{Validation données}
    H -->|Échec| I[Affichage erreurs]
    H -->|Succès| J[Envoi à l'IA]
    
    I --> G
    J --> K{IA disponible?}
    K -->|Non| L[Message d'erreur]
    K -->|Oui| M[Génération email]
    
    L --> N[Fin]
    M --> O{Qualité acceptable?}
    O -->|Non| P[Regénération]
    O -->|Oui| Q[Affichage résultat]
    
    P --> M
    Q --> R{Utilisateur satisfait?}
    R -->|Non| S[Modification manuelle]
    R -->|Oui| T[Sauvegarde]
    
    S --> Q
    T --> U[Options export]
    U --> V{Type d'export}
    
    V --> W[Word]
    V --> X[PDF]
    V --> Y[Excel]
    V --> Z[Email]
    
    W --> AA[Téléchargement]
    X --> AA
    Y --> AA
    Z --> BB[Envoi email]
    
    AA --> CC[Fin]
    BB --> CC
```

## 2. Activité - Processus d'Authentification

```mermaid
flowchart TD
    A[Début] --> B[Accès page connexion]
    B --> C[Saisie credentials]
    C --> D{Validation format}
    D -->|Échec| E[Message erreur]
    D -->|Succès| F[Envoi requête]
    
    E --> C
    F --> G{Authentification}
    G -->|Échec| H[Message invalide]
    G -->|Succès| I[Génération JWT]
    
    H --> C
    I --> J{2FA activé?}
    J -->|Non| K[Connexion réussie]
    J -->|Oui| L[Envoi code 2FA]
    
    K --> M[Redirection dashboard]
    L --> N[Saisie code 2FA]
    N --> O{Validation code}
    O -->|Échec| P[Message erreur]
    O -->|Succès| K
    
    P --> N
    M --> Q[Fin]
```

## 3. Activité - Gestion des Templates

```mermaid
flowchart TD
    A[Début] --> B[Accès section templates]
    B --> C{Action souhaitée}
    
    C --> D[Créer template]
    C --> E[Modifier template]
    C --> F[Supprimer template]
    C --> G[Rechercher template]
    
    D --> H[Formulaire création]
    H --> I[Saisie données]
    I --> J{Validation}
    J -->|Échec| K[Correction erreurs]
    J -->|Succès| L[Sauvegarde]
    
    K --> I
    L --> M[Template créé]
    
    E --> N[Sélection template]
    N --> O[Formulaire modification]
    O --> P[Modifications]
    P --> Q{Validation}
    Q -->|Échec| R[Correction erreurs]
    Q -->|Succès| S[Mise à jour]
    
    R --> P
    S --> T[Template modifié]
    
    F --> U[Sélection template]
    U --> V{Confirmation}
    V -->|Non| W[Annulation]
    V -->|Oui| X[Suppression]
    
    W --> Y[Retour liste]
    X --> Z[Template supprimé]
    
    G --> AA[Saisie critères]
    AA --> BB[Recherche]
    BB --> CC{Résultats}
    CC -->|Aucun| DD[Message vide]
    CC -->|Trouvés| EE[Affichage résultats]
    
    DD --> FF[Fin]
    EE --> GG[Sélection template]
    GG --> HH[Utilisation template]
    
    M --> FF
    T --> FF
    Z --> FF
    HH --> FF
    Y --> FF
```

## 4. Activité - Export et Partage

```mermaid
flowchart TD
    A[Début] --> B[Sélection email]
    B --> C{Type d'export}
    
    C --> D[Export fichier]
    C --> E[Partage direct]
    
    D --> F{Format souhaité}
    F --> G[Word]
    F --> H[PDF]
    F --> I[Excel]
    
    G --> J[Génération .docx]
    H --> K[Génération .pdf]
    I --> L[Génération .xlsx]
    
    J --> M{Taille fichier}
    K --> M
    L --> M
    
    M -->|OK| N[Téléchargement]
    M -->|Trop gros| O[Message erreur]
    
    N --> P[Fichier téléchargé]
    O --> Q[Fin]
    
    E --> R{Plateforme}
    R --> S[Email]
    R --> T[Slack]
    R --> U[Teams]
    R --> V[WhatsApp]
    
    S --> W[Préparation email]
    T --> X[Message Slack]
    U --> Y[Message Teams]
    V --> Z[Message WhatsApp]
    
    W --> AA{Envoi réussi?}
    X --> BB{Envoi réussi?}
    Y --> CC{Envoi réussi?}
    Z --> DD{Envoi réussi?}
    
    AA -->|Oui| EE[Email envoyé]
    AA -->|Non| FF[Erreur envoi]
    BB -->|Oui| GG[Message Slack envoyé]
    BB -->|Non| FF
    CC -->|Oui| HH[Message Teams envoyé]
    CC -->|Non| FF
    DD -->|Oui| II[Message WhatsApp envoyé]
    DD -->|Non| FF
    
    P --> JJ[Fin]
    EE --> JJ
    GG --> JJ
    HH --> JJ
    II --> JJ
    FF --> JJ
```

## 5. Activité - Recherche et Filtrage

```mermaid
flowchart TD
    A[Début] --> B[Accès historique]
    B --> C{Type de recherche}
    
    C --> D[Recherche texte]
    C --> E[Filtres avancés]
    C --> F[Tri]
    
    D --> G[Saisie terme]
    G --> H{Débounce 300ms}
    H -->|Non| I[Attente]
    H -->|Oui| J[Recherche serveur]
    
    I --> H
    J --> K{Terme valide?}
    K -->|Non| L[Message erreur]
    K -->|Oui| M[Recherche base]
    
    L --> G
    M --> N{Résultats trouvés?}
    N -->|Non| O[Message aucun résultat]
    N -->|Oui| P[Affichage résultats]
    
    E --> Q[Sélection filtres]
    Q --> R{Type de filtre}
    R --> S[Par type]
    R --> T[Par date]
    R --> U[Par destinataire]
    R --> V[Par favoris]
    
    S --> W[Application filtre type]
    T --> X[Application filtre date]
    U --> Y[Application filtre destinataire]
    V --> Z[Application filtre favoris]
    
    W --> AA[Résultats filtrés]
    X --> AA
    Y --> AA
    Z --> AA
    
    F --> BB{Type de tri}
    BB --> CC[Par date]
    BB --> DD[Par type]
    BB --> EE[Par destinataire]
    BB --> FF[Par taille]
    
    CC --> GG[Tri par date]
    DD --> HH[Tri par type]
    EE --> II[Tri par destinataire]
    FF --> JJ[Tri par taille]
    
    GG --> KK[Résultats triés]
    HH --> KK
    II --> KK
    JJ --> KK
    
    P --> LL[Fin]
    O --> LL
    AA --> LL
    KK --> LL
```

## 6. Activité - Configuration Sécurité

```mermaid
flowchart TD
    A[Début] --> B[Accès paramètres]
    B --> C{Section sécurité}
    
    C --> D[Configuration 2FA]
    C --> E[Gestion sessions]
    C --> F[Paramètres RGPD]
    C --> G[Logs d'accès]
    
    D --> H{2FA actuel}
    H -->|Désactivé| I[Activation 2FA]
    H -->|Activé| J[Désactivation 2FA]
    
    I --> K[Génération QR Code]
    K --> L[Saisie code vérification]
    L --> M{Code valide?}
    M -->|Non| N[Message erreur]
    M -->|Oui| O[Activation confirmée]
    
    N --> L
    O --> P[2FA activé]
    
    J --> Q{Confirmation}
    Q -->|Non| R[Annulation]
    Q -->|Oui| S[Désactivation]
    
    R --> T[Retour paramètres]
    S --> U[2FA désactivé]
    
    E --> V[Affichage sessions]
    V --> W{Sélection action}
    W --> X[Terminer session]
    W --> Y[Terminer toutes sessions]
    
    X --> Z[Session terminée]
    Y --> AA[Toutes sessions terminées]
    
    F --> BB{Paramètres RGPD}
    BB --> CC[Consentement IA]
    BB --> DD[Rétention données]
    BB --> EE[Export données]
    
    CC --> FF{Consentement actuel}
    FF -->|Donné| GG[Révocation consentement]
    FF -->|Non donné| HH[Donner consentement]
    
    GG --> II[Consentement révoqué]
    HH --> JJ[Consentement donné]
    
    DD --> KK[Configuration rétention]
    KK --> LL[Sauvegarde paramètres]
    
    EE --> MM[Demande export]
    MM --> NN[Génération fichier]
    NN --> OO[Téléchargement données]
    
    G --> PP[Affichage logs]
    PP --> QQ{Filtres logs}
    QQ --> RR[Par date]
    QQ --> SS[Par action]
    QQ --> TT[Par IP]
    
    RR --> UU[Logs filtrés]
    SS --> UU
    TT --> UU
    
    P --> VV[Fin]
    U --> VV
    Z --> VV
    AA --> VV
    II --> VV
    JJ --> VV
    LL --> VV
    OO --> VV
    UU --> VV
    T --> VV
```

## 7. Activité - Onboarding Utilisateur

```mermaid
flowchart TD
    A[Début] --> B[Première connexion]
    B --> C{Détection nouvel utilisateur}
    C -->|Oui| D[Lancement onboarding]
    C -->|Non| E[Accès normal]
    
    D --> F[Étape 1: Bienvenue]
    F --> G{Utilisateur prêt?}
    G -->|Non| H[Attente]
    G -->|Oui| I[Étape 2: Générateur]
    
    H --> G
    I --> J{Compréhension OK?}
    J -->|Non| K[Explication supplémentaire]
    J -->|Oui| L[Étape 3: Templates]
    
    K --> I
    L --> M{Compréhension OK?}
    M -->|Non| N[Explication supplémentaire]
    M -->|Oui| O[Étape 4: Export]
    
    N --> L
    O --> P{Compréhension OK?}
    P -->|Non| Q[Explication supplémentaire]
    P -->|Oui| R[Étape 5: Sécurité]
    
    Q --> O
    R --> S{Compréhension OK?}
    S -->|Non| T[Explication supplémentaire]
    S -->|Oui| U[Fin onboarding]
    
    T --> R
    U --> V[Accès complet]
    E --> V
    V --> W[Fin]
```

## 8. Activité - Gestion des Erreurs

```mermaid
flowchart TD
    A[Début] --> B[Action utilisateur]
    B --> C{Validation}
    C -->|Succès| D[Exécution normale]
    C -->|Échec| E{Type d'erreur}
    
    E --> F[Erreur validation]
    E --> G[Erreur réseau]
    E --> H[Erreur serveur]
    E --> I[Erreur authentification]
    E --> J[Erreur permissions]
    
    F --> K[Affichage erreurs]
    K --> L[Correction utilisateur]
    L --> B
    
    G --> M[Message réseau]
    M --> N{Réessayer?}
    N -->|Oui| O[Retry automatique]
    N -->|Non| P[Mode hors ligne]
    
    O --> Q{Succès?}
    Q -->|Oui| D
    Q -->|Non| R[Échec définitif]
    
    H --> S[Message serveur]
    S --> T[Log erreur]
    T --> U[Notification admin]
    
    I --> V[Redirection connexion]
    V --> W[Reconnexion]
    W --> X{Connexion réussie?}
    X -->|Oui| B
    X -->|Non| Y[Session expirée]
    
    J --> Z[Message permissions]
    Z --> AA[Demande élévation]
    AA --> BB{Approuvé?}
    BB -->|Oui| B
    BB -->|Non| CC[Accès refusé]
    
    D --> DD[Fin]
    P --> DD
    R --> DD
    U --> DD
    Y --> DD
    CC --> DD
```

## 9. Activité - Performance Monitoring

```mermaid
flowchart TD
    A[Début] --> B[Chargement page]
    B --> C[Collecte métriques]
    C --> D[Mesure FCP]
    D --> E[Mesure LCP]
    E --> F[Mesure CLS]
    F --> G[Mesure FID]
    G --> H[Mesure TTI]
    
    H --> I{Performance OK?}
    I -->|Oui| J[Log succès]
    I -->|Non| K[Analyse problème]
    
    J --> L[Envoi métriques]
    K --> M{Type de problème}
    
    M --> N[Chargement lent]
    M --> O[Interaction lente]
    M --> P[Layout shift]
    M --> Q[Erreur critique]
    
    N --> R[Optimisation ressources]
    O --> S[Optimisation JavaScript]
    P --> T[Correction layout]
    Q --> U[Alerte immédiate]
    
    R --> V[Retest performance]
    S --> V
    T --> V
    U --> W[Notification équipe]
    
    V --> X{Amélioration?}
    X -->|Oui| Y[Log amélioration]
    X -->|Non| Z[Investigation approfondie]
    
    Y --> L
    Z --> AA[Analyse détaillée]
    AA --> BB[Plan d'optimisation]
    BB --> CC[Mise en œuvre]
    CC --> V
    
    L --> DD[Fin]
    W --> DD
```

## 10. Activité - PWA et Synchronisation

```mermaid
flowchart TD
    A[Début] --> B[Installation PWA]
    B --> C{Connexion internet?}
    C -->|Oui| D[Mode normal]
    C -->|Non| E[Mode hors ligne]
    
    D --> F[Service Worker actif]
    F --> G[Mise en cache]
    G --> H[Fonctionnalités complètes]
    
    E --> I[Vérification cache]
    I --> J{Cache disponible?}
    J -->|Oui| K[Fonctionnalités limitées]
    J -->|Non| L[Page offline]
    
    K --> M[Actions hors ligne]
    M --> N{Action possible?}
    N -->|Oui| O[Exécution action]
    N -->|Non| P[Message limitation]
    
    O --> Q[Stockage local]
    P --> R[Attente connexion]
    
    Q --> S{Connexion rétablie?}
    S -->|Non| T[Attente]
    S -->|Oui| U[Synchronisation]
    
    T --> S
    U --> V[Envoi actions]
    V --> W{Synchronisation OK?}
    W -->|Oui| X[Actions synchronisées]
    W -->|Non| Y[Erreur sync]
    
    X --> Z[Mode normal]
    Y --> AA[Retry sync]
    AA --> W
    
    R --> S
    L --> AB[Message hors ligne]
    AB --> AC{Bouton réessayer}
    AC -->|Clic| AD{Vérification connexion}
    AC -->|Attente| AE[Attente]
    
    AD -->|Connecté| D
    AD -->|Déconnecté| L
    AE --> AD
    
    H --> AF[Fin]
    Z --> AF
    Y --> AF
``` 