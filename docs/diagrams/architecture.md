# Diagramme d'Architecture - ProMail Assistant

## 1. Architecture Générale

```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser/App] --> B[PWA]
        A --> C[Mobile Browser]
    end
    
    subgraph "Frontend Layer"
        D[Next.js App] --> E[React Components]
        D --> F[Service Worker]
        D --> G[PWA Manifest]
    end
    
    subgraph "API Layer"
        H[FastAPI Backend] --> I[Authentication]
        H --> J[Email Generation]
        H --> K[Template Management]
        H --> L[User Management]
    end
    
    subgraph "Data Layer"
        M[PostgreSQL] --> N[Users Table]
        M --> O[Emails Table]
        M --> P[Templates Table]
        M --> Q[Login History]
    end
    
    subgraph "External Services"
        R[AI Service] --> S[Email Generation]
        T[Email Service] --> U[SMTP/Gmail]
        V[Monitoring] --> W[Logs & Metrics]
    end
    
    A --> D
    D --> H
    H --> M
    H --> R
    H --> T
    H --> V
```

## 2. Flux de Données

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant AI as AI Service
    
    U->>F: Accès à l'application
    F->>B: Vérification JWT
    B->>DB: Validation token
    DB-->>B: User data
    B-->>F: Authentification OK
    F-->>U: Dashboard affiché
    
    U->>F: Génération email
    F->>B: Demande génération
    B->>AI: Prompt IA
    AI-->>B: Email généré
    B->>DB: Sauvegarde email
    DB-->>B: Confirmation
    B-->>F: Email généré
    F-->>U: Affichage email
```

## 3. Architecture des Composants

```mermaid
graph LR
    subgraph "Pages"
        A1[Home Page]
        A2[Dashboard]
        A3[Login/Register]
        A4[Profile]
        A5[Roadmap]
    end
    
    subgraph "Components"
        B1[AnimatedLogo]
        B2[ChatBotModal]
        B3[OnboardingModal]
        B4[LoadingSpinner]
        B5[EmailGenerator]
    end
    
    subgraph "Hooks"
        C1[useAuth]
        C2[useEmails]
        C3[usePerformance]
        C4[useLogger]
    end
    
    subgraph "Utils"
        D1[API Client]
        D2[Performance Monitor]
        D3[Logger]
        D4[PWA Utils]
    end
    
    A1 --> B1
    A2 --> B2
    A2 --> B3
    A2 --> B4
    A2 --> B5
    A2 --> C1
    A2 --> C2
    C1 --> D1
    C2 --> D1
    D1 --> D2
    D1 --> D3
```

## 4. Modèle de Données

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        timestamp created_at
        timestamp updated_at
    }
    
    EMAILS {
        int id PK
        int user_id FK
        string subject
        text content
        string email_type
        string recipient
        string company
        string tone
        string urgency
        boolean is_favorite
        timestamp created_at
        timestamp updated_at
    }
    
    TEMPLATES {
        int id PK
        int user_id FK
        string name
        text content
        string category
        boolean is_public
        timestamp created_at
    }
    
    LOGIN_HISTORY {
        int id PK
        int user_id FK
        timestamp login_time
        string ip_address
        text user_agent
        boolean success
    }
    
    USERS ||--o{ EMAILS : "generates"
    USERS ||--o{ TEMPLATES : "creates"
    USERS ||--o{ LOGIN_HISTORY : "logs"
```

## 5. Flux d'Authentification

```mermaid
stateDiagram-v2
    [*] --> NonAuthentifié
    NonAuthentifié --> Inscription : Register
    NonAuthentifié --> Connexion : Login
    Inscription --> Validation : Submit
    Connexion --> Validation : Submit
    Validation --> Authentifié : Success
    Validation --> NonAuthentifié : Failed
    Authentifié --> Dashboard : Access
    Authentifié --> NonAuthentifié : Logout
    Dashboard --> Authentifié : Stay
```

## 6. Workflow de Génération d'Email

```mermaid
flowchart TD
    A[User Input] --> B{Validation}
    B -->|Valid| C[Template Selection]
    B -->|Invalid| D[Show Error]
    C --> E[AI Prompt Generation]
    E --> F[AI Processing]
    F --> G{Quality Check}
    G -->|Pass| H[Format Output]
    G -->|Fail| I[Regenerate]
    I --> F
    H --> J[User Review]
    J --> K{User Approves}
    K -->|Yes| L[Save Email]
    K -->|No| M[Edit Request]
    M --> E
    L --> N[Export Options]
    N --> O[Download/Share]
```

## 7. Architecture PWA

```mermaid
graph TB
    subgraph "PWA Components"
        A[Web App Manifest]
        B[Service Worker]
        C[Offline Page]
        D[App Shell]
    end
    
    subgraph "Caching Strategy"
        E[Cache First - Static]
        F[Network First - API]
        G[Stale While Revalidate]
    end
    
    subgraph "Installation"
        H[Install Prompt]
        I[App Icon]
        J[Shortcuts]
    end
    
    A --> D
    B --> E
    B --> F
    B --> G
    H --> I
    I --> J
```

## 8. Monitoring et Logging

```mermaid
graph LR
    subgraph "Client Side"
        A[Performance Monitor]
        B[Error Logger]
        C[User Actions]
    end
    
    subgraph "Server Side"
        D[API Logger]
        E[Database Logger]
        F[Security Logger]
    end
    
    subgraph "External"
        G[Analytics]
        H[Alerting]
        I[Dashboard]
    end
    
    A --> D
    B --> D
    C --> D
    D --> G
    E --> G
    F --> G
    G --> H
    G --> I
```

## 9. Déploiement et Infrastructure

```mermaid
graph TB
    subgraph "Development"
        A[Local Development]
        B[Git Repository]
        C[Feature Branches]
    end
    
    subgraph "CI/CD"
        D[GitHub Actions]
        E[Tests]
        F[Build]
        G[Deploy]
    end
    
    subgraph "Production"
        H[Load Balancer]
        I[Frontend Server]
        J[Backend Server]
        K[Database]
        L[CDN]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    J --> K
    I --> L
```

## 10. Sécurité et Permissions

```mermaid
graph TD
    A[Request] --> B{JWT Valid?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D[User Permissions]
    D --> E{Can Access?}
    E -->|No| F[403 Forbidden]
    E -->|Yes| G[Process Request]
    G --> H[Rate Limiting]
    H --> I{Within Limits?}
    I -->|No| J[429 Too Many Requests]
    I -->|Yes| K[Execute Action]
    K --> L[Log Activity]
    L --> M[Response]
```

## 11. Performance Monitoring

```mermaid
graph LR
    subgraph "Metrics Collection"
        A[FCP]
        B[LCP]
        C[CLS]
        D[FID]
        E[TTI]
    end
    
    subgraph "Analysis"
        F[Performance Analyzer]
        G[Trend Detection]
        H[Alert System]
    end
    
    subgraph "Reporting"
        I[Dashboard]
        J[Reports]
        K[Notifications]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    H --> K
```

## 12. Tests et Qualité

```mermaid
graph TB
    subgraph "Test Types"
        A[Unit Tests]
        B[Integration Tests]
        C[E2E Tests]
        D[Performance Tests]
    end
    
    subgraph "Tools"
        E[Vitest]
        F[React Testing Library]
        G[Playwright]
        H[Lighthouse]
    end
    
    subgraph "Quality Gates"
        I[Code Coverage >80%]
        J[Performance Score >90]
        K[Security Scan Pass]
        L[Accessibility Check]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> L
``` 