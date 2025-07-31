# Diagramme de Cas d'Utilisation - ProMail Assistant

## 1. Diagramme Principal des Cas d'Utilisation

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur Non Authentifié]
        B[Utilisateur Authentifié]
        C[Administrateur]
        D[Système IA]
        E[Système Email]
    end
    
    subgraph "Cas d'Utilisation - Authentification"
        UC1[Se connecter]
        UC2[S'inscrire]
        UC3[Réinitialiser mot de passe]
        UC4[Activer 2FA]
        UC5[Gérer profil]
    end
    
    subgraph "Cas d'Utilisation - Génération Email"
        UC6[Générer email IA]
        UC7[Personnaliser email]
        UC8[Sauvegarder email]
        UC9[Exporter email]
        UC10[Partager email]
    end
    
    subgraph "Cas d'Utilisation - Gestion"
        UC11[Gérer templates]
        UC12[Consulter historique]
        UC13[Gérer favoris]
        UC14[Rechercher emails]
        UC15[Voir statistiques]
    end
    
    subgraph "Cas d'Utilisation - Sécurité"
        UC16[Gérer accès]
        UC17[Consulter logs]
        UC18[Configurer RGPD]
        UC19[Gérer consentement IA]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    B --> UC4
    B --> UC5
    B --> UC6
    B --> UC7
    B --> UC8
    B --> UC9
    B --> UC10
    B --> UC11
    B --> UC12
    B --> UC13
    B --> UC14
    B --> UC15
    B --> UC16
    B --> UC17
    B --> UC18
    B --> UC19
    C --> UC17
    C --> UC18
    D --> UC6
    E --> UC9
    E --> UC10
```

## 2. Diagramme Détaillé - Génération d'Email

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur]
        B[Système IA]
        C[Base de Données]
        D[Système Export]
    end
    
    subgraph "Cas d'Utilisation"
        UC1[Choisir type d'email]
        UC2[Saisir informations]
        UC3[Générer avec IA]
        UC4[Prévisualiser résultat]
        UC5[Modifier email]
        UC6[Valider email]
        UC7[Sauvegarder]
        UC8[Exporter]
        UC9[Partager]
    end
    
    subgraph "Extensions"
        E1[Type non reconnu]
        E2[IA indisponible]
        E3[Données invalides]
        E4[Export échoué]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC9
    
    UC1 --> E1
    UC3 --> E2
    UC2 --> E3
    UC8 --> E4
    
    B --> UC3
    C --> UC7
    D --> UC8
    D --> UC9
```

## 3. Diagramme - Gestion des Templates

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur]
        B[Administrateur]
        C[Base de Données]
    end
    
    subgraph "Cas d'Utilisation"
        UC1[Créer template]
        UC2[Modifier template]
        UC3[Supprimer template]
        UC4[Rechercher template]
        UC5[Utiliser template]
        UC6[Partager template]
        UC7[Évaluer template]
        UC8[Catégoriser template]
    end
    
    subgraph "Extensions"
        E1[Template existant]
        E2[Permissions insuffisantes]
        E3[Template utilisé]
        E4[Recherche sans résultat]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    
    B --> UC1
    B --> UC2
    B --> UC3
    B --> UC8
    
    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> UC6
    C --> UC7
    C --> UC8
    
    UC1 --> E1
    UC2 --> E2
    UC3 --> E3
    UC4 --> E4
```

## 4. Diagramme - Sécurité et RGPD

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur]
        B[Administrateur]
        C[Système de Sécurité]
        D[Base de Données]
    end
    
    subgraph "Cas d'Utilisation"
        UC1[Configurer 2FA]
        UC2[Gérer sessions]
        UC3[Consulter logs]
        UC4[Configurer RGPD]
        UC5[Gérer consentement]
        UC6[Exporter données]
        UC7[Supprimer données]
        UC8[Auditer accès]
    end
    
    subgraph "Extensions"
        E1[2FA déjà activé]
        E2[Session expirée]
        E3[Logs non disponibles]
        E4[Données en cours d'utilisation]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    
    B --> UC3
    B --> UC4
    B --> UC8
    
    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC8
    
    D --> UC3
    D --> UC6
    D --> UC7
    D --> UC8
    
    UC1 --> E1
    UC2 --> E2
    UC3 --> E3
    UC7 --> E4
```

## 5. Diagramme - Export et Partage

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur]
        B[Système Export]
        C[Système Email]
        D[Services Externes]
    end
    
    subgraph "Cas d'Utilisation"
        UC1[Exporter en Word]
        UC2[Exporter en PDF]
        UC3[Exporter en Excel]
        UC4[Exporter en Email]
        UC5[Partager via lien]
        UC6[Envoyer par email]
        UC7[Partager sur Slack]
        UC8[Partager sur Teams]
    end
    
    subgraph "Extensions"
        E1[Fichier trop volumineux]
        E2[Service indisponible]
        E3[Permissions insuffisantes]
        E4[Format non supporté]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    
    B --> UC1
    B --> UC2
    B --> UC3
    
    C --> UC4
    C --> UC6
    
    D --> UC5
    D --> UC7
    D --> UC8
    
    UC1 --> E1
    UC2 --> E1
    UC3 --> E1
    UC4 --> E2
    UC5 --> E3
    UC6 --> E2
    UC7 --> E2
    UC8 --> E2
```

## 6. Diagramme - Statistiques et Analytics

```mermaid
graph TB
    subgraph "Acteurs"
        A[Utilisateur]
        B[Administrateur]
        C[Système Analytics]
        D[Base de Données]
    end
    
    subgraph "Cas d'Utilisation"
        UC1[Voir statistiques personnelles]
        UC2[Consulter performance]
        UC3[Analyser tendances]
        UC4[Générer rapports]
        UC5[Exporter données]
        UC6[Configurer alertes]
        UC7[Voir métriques système]
        UC8[Auditer utilisation]
    end
    
    subgraph "Extensions"
        E1[Aucune donnée disponible]
        E2[Période invalide]
        E3[Permissions insuffisantes]
        E4[Service indisponible]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    
    B --> UC6
    B --> UC7
    B --> UC8
    
    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> UC6
    C --> UC7
    C --> UC8
    
    D --> UC1
    D --> UC2
    D --> UC3
    D --> UC4
    D --> UC5
    D --> UC7
    D --> UC8
    
    UC1 --> E1
    UC2 --> E2
    UC3 --> E3
    UC4 --> E4
    UC5 --> E1
    UC6 --> E3
    UC7 --> E4
    UC8 --> E3
``` 