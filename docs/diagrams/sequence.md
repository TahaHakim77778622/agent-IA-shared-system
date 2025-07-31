# Diagramme de Séquences - ProMail Assistant

## 1. Séquence d'Authentification

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    participant E as Email Service
    
    U->>F: Accès page de connexion
    F->>U: Affichage formulaire
    
    U->>F: Saisie email/mot de passe
    F->>B: POST /api/login
    B->>DB: Vérification credentials
    DB-->>B: Données utilisateur
    B->>B: Génération JWT
    B-->>F: Token + données utilisateur
    F->>F: Stockage token localStorage
    F->>U: Redirection dashboard
    
    Note over U,F: Si 2FA activé
    B->>E: Envoi code 2FA
    E-->>U: Email avec code
    U->>F: Saisie code 2FA
    F->>B: POST /api/verify-2fa
    B->>B: Validation code
    B-->>F: Confirmation
    F->>U: Accès complet
```

## 2. Séquence de Génération d'Email

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant AI as Service IA
    participant DB as Base de Données
    
    U->>F: Accès générateur
    F->>U: Affichage formulaire
    
    U->>F: Sélection type email
    U->>F: Saisie informations
    F->>F: Validation données
    
    F->>B: POST /api/generate-email
    B->>B: Validation token
    B->>AI: Envoi prompt IA
    AI->>AI: Traitement IA
    AI-->>B: Email généré
    B->>DB: Sauvegarde email
    DB-->>B: Confirmation
    B-->>F: Email généré
    F->>U: Affichage résultat
    
    U->>F: Modification manuelle
    F->>F: Mise à jour contenu
    F->>B: PUT /api/emails/{id}
    B->>DB: Mise à jour email
    DB-->>B: Confirmation
    B-->>F: Email mis à jour
    F->>U: Confirmation modification
```

## 3. Séquence d'Export d'Email

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant E as Export Service
    participant S as Storage
    
    U->>F: Sélection email à exporter
    F->>U: Affichage options export
    
    U->>F: Choix format (Word/PDF/Excel)
    F->>B: GET /api/emails/{id}
    B->>B: Validation accès
    B-->>F: Données email
    
    F->>E: Demande génération fichier
    E->>E: Création fichier
    E->>S: Stockage temporaire
    S-->>E: URL fichier
    E-->>F: URL de téléchargement
    
    F->>U: Déclenchement téléchargement
    U->>S: Téléchargement fichier
    
    Note over U,F: Export par email
    U->>F: Choix export par email
    F->>B: POST /api/export-email
    B->>B: Préparation email
    B->>E: Envoi email avec pièce jointe
    E-->>U: Email reçu
```

## 4. Séquence de Gestion des Templates

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    
    U->>F: Accès section templates
    F->>B: GET /api/templates
    B->>B: Validation token
    B->>DB: Récupération templates
    DB-->>B: Liste templates
    B-->>F: Templates utilisateur
    F->>U: Affichage templates
    
    U->>F: Création nouveau template
    F->>U: Formulaire création
    U->>F: Saisie données template
    F->>F: Validation formulaire
    F->>B: POST /api/templates
    B->>B: Validation données
    B->>DB: Insertion template
    DB-->>B: Template créé
    B-->>F: Confirmation création
    F->>U: Template ajouté
    
    U->>F: Modification template
    F->>B: GET /api/templates/{id}
    B->>DB: Récupération template
    DB-->>B: Données template
    B-->>F: Template à modifier
    F->>U: Formulaire pré-rempli
    U->>F: Modifications
    F->>B: PUT /api/templates/{id}
    B->>DB: Mise à jour template
    DB-->>B: Confirmation
    B-->>F: Template mis à jour
    F->>U: Confirmation modification
```

## 5. Séquence de Recherche et Filtrage

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    
    U->>F: Saisie terme de recherche
    F->>F: Débounce (300ms)
    F->>B: GET /api/emails?search={term}
    B->>B: Validation token
    B->>DB: Recherche full-text
    DB-->>B: Résultats recherche
    B->>B: Filtrage côté serveur
    B-->>F: Emails filtrés
    F->>U: Affichage résultats
    
    U->>F: Application filtres
    F->>F: Construction query
    F->>B: GET /api/emails?filters={filters}
    B->>DB: Requête avec filtres
    DB-->>B: Données filtrées
    B-->>F: Résultats filtrés
    F->>U: Mise à jour affichage
    
    U->>F: Tri des résultats
    F->>B: GET /api/emails?sort={field}&order={direction}
    B->>DB: Requête avec tri
    DB-->>B: Données triées
    B-->>F: Résultats triés
    F->>U: Affichage trié
```

## 6. Séquence de Gestion des Favoris

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    
    U->>F: Clic sur étoile favori
    F->>B: POST /api/emails/{id}/favorite
    B->>B: Validation token
    B->>DB: Mise à jour favori
    DB-->>B: Confirmation
    B-->>F: Statut favori mis à jour
    F->>U: Étoile activée/désactivée
    
    U->>F: Accès section favoris
    F->>B: GET /api/emails?favorite=true
    B->>DB: Récupération favoris
    DB-->>B: Liste favoris
    B-->>F: Emails favoris
    F->>U: Affichage favoris
    
    U->>F: Suppression favori
    F->>B: DELETE /api/emails/{id}/favorite
    B->>DB: Suppression favori
    DB-->>B: Confirmation
    B-->>F: Favori supprimé
    F->>U: Mise à jour liste
```

## 7. Séquence de Configuration 2FA

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    participant T as TOTP Service
    
    U->>F: Accès paramètres sécurité
    F->>B: GET /api/user/security
    B->>DB: Récupération config 2FA
    DB-->>B: Configuration actuelle
    B-->>F: Statut 2FA
    F->>U: Affichage options
    
    U->>F: Activation 2FA
    F->>B: POST /api/user/2fa/setup
    B->>T: Génération secret TOTP
    T-->>B: Secret + QR Code
    B->>DB: Sauvegarde secret
    DB-->>B: Confirmation
    B-->>F: QR Code + secret
    F->>U: Affichage QR Code
    
    U->>F: Saisie code de vérification
    F->>B: POST /api/user/2fa/verify
    B->>T: Validation code
    T-->>B: Code valide
    B->>DB: Activation 2FA
    DB-->>B: Confirmation
    B-->>F: 2FA activé
    F->>U: Confirmation activation
```

## 8. Séquence de Réinitialisation de Mot de Passe

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Données
    participant E as Email Service
    
    U->>F: Accès page "Mot de passe oublié"
    F->>U: Formulaire email
    
    U->>F: Saisie email
    F->>B: POST /api/forgot-password
    B->>DB: Vérification email
    DB-->>B: Utilisateur trouvé
    B->>B: Génération token reset
    B->>DB: Sauvegarde token
    DB-->>B: Confirmation
    B->>E: Envoi email reset
    E-->>U: Email avec lien reset
    B-->>F: Confirmation envoi
    F->>U: Message de confirmation
    
    U->>E: Clic sur lien reset
    E->>F: Redirection avec token
    F->>B: GET /api/reset-password?token={token}
    B->>B: Validation token
    B-->>F: Token valide
    F->>U: Formulaire nouveau mot de passe
    
    U->>F: Saisie nouveau mot de passe
    F->>B: POST /api/reset-password
    B->>B: Hash nouveau mot de passe
    B->>DB: Mise à jour mot de passe
    B->>DB: Suppression token
    DB-->>B: Confirmation
    B-->>F: Mot de passe mis à jour
    F->>U: Redirection connexion
```

## 9. Séquence de Monitoring et Logs

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant L as Logger
    participant DB as Base de Données
    participant M as Monitoring
    
    U->>F: Action utilisateur
    F->>F: Capture métriques
    F->>L: Log action client
    L->>DB: Sauvegarde log
    F->>B: Requête API
    B->>B: Validation token
    B->>L: Log action serveur
    L->>DB: Sauvegarde log
    B->>DB: Opération métier
    DB-->>B: Résultat
    B->>L: Log résultat
    L->>DB: Sauvegarde log
    B-->>F: Réponse API
    F->>L: Log performance
    L->>M: Envoi métriques
    M->>M: Analyse performance
    M->>M: Détection anomalies
    
    Note over M: Si anomalie détectée
    M->>B: Alerte système
    B->>L: Log alerte
    L->>DB: Sauvegarde alerte
```

## 10. Séquence PWA et Hors Ligne

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant SW as Service Worker
    participant C as Cache
    participant B as Backend
    
    U->>F: Accès application
    F->>SW: Vérification cache
    SW->>C: Recherche ressources
    C-->>SW: Ressources disponibles
    SW-->>F: Chargement depuis cache
    F->>U: Application chargée
    
    U->>F: Action nécessitant API
    F->>SW: Interception requête
    SW->>B: Tentative requête réseau
    B-->>SW: Réponse API
    SW->>C: Mise en cache réponse
    SW-->>F: Données API
    F->>U: Action complétée
    
    Note over U,F: Mode hors ligne
    U->>F: Action hors ligne
    F->>SW: Interception requête
    SW->>C: Recherche cache
    C-->>SW: Données en cache
    SW-->>F: Données du cache
    F->>U: Action avec données cache
    
    Note over U,F: Synchronisation
    F->>SW: File d'attente actions
    SW->>B: Synchronisation quand en ligne
    B-->>SW: Confirmation
    SW->>C: Nettoyage cache
    SW-->>F: Synchronisation terminée
``` 