# Guide d'utilisation de l'API

Ce guide explique comment utiliser l'API service dans votre application Next.js.

## 📦 Installation

L'API service est déjà configuré dans `lib/api.ts`. Assurez-vous que votre backend FastAPI est en cours d'exécution sur `http://localhost:8000`.

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine de votre projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Utilisation de base

### Import du service

```typescript
import { apiService } from '@/lib/api';
```

### Authentification

```typescript
// Connexion
try {
  const authResponse = await apiService.login('user@example.com', 'password');
  console.log('Connecté avec succès:', authResponse);
} catch (error) {
  console.error('Erreur de connexion:', error);
}

// Inscription
try {
  const user = await apiService.register('newuser@example.com', 'password');
  console.log('Utilisateur créé:', user);
} catch (error) {
  console.error('Erreur d\'inscription:', error);
}

// Déconnexion
apiService.logout();
```

### Gestion des emails

```typescript
// Récupérer tous les emails
const emails = await apiService.getEmails();

// Créer un nouvel email
const newEmail = await apiService.createEmail('Sujet', 'Contenu de l\'email');

// Modifier un email
const updatedEmail = await apiService.updateEmail(1, {
  subject: 'Nouveau sujet',
  body: 'Nouveau contenu'
});

// Supprimer un email
await apiService.deleteEmail(1);

// Récupérer un email spécifique
const email = await apiService.getEmail(1);
```

### Informations utilisateur

```typescript
// Récupérer les informations de l'utilisateur connecté
const user = await apiService.getCurrentUser();

// Récupérer l'historique des connexions
const loginHistory = await apiService.getLoginHistory();
```

## 🎣 Hooks React

### Hook d'authentification

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Connecté en tant que: {user?.email}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Connexion</button>
      )}
    </div>
  );
}
```

### Hook de gestion des emails

```typescript
import { useEmails } from '@/hooks/useEmails';

function EmailsComponent() {
  const { 
    emails, 
    isLoading, 
    error, 
    createEmail, 
    updateEmail, 
    deleteEmail 
  } = useEmails();

  const handleCreateEmail = async () => {
    try {
      await createEmail('Nouveau sujet', 'Nouveau contenu');
    } catch (error) {
      console.error('Erreur de création:', error);
    }
  };

  if (isLoading) return <div>Chargement des emails...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateEmail}>Créer un email</button>
      {emails.map(email => (
        <div key={email.id}>
          <h3>{email.subject}</h3>
          <p>{email.body}</p>
          <button onClick={() => deleteEmail(email.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
```

## 🛡️ Gestion des erreurs

### Utilisation de handleApiError

```typescript
import { handleApiError } from '@/lib/api';

try {
  await apiService.createEmail('Sujet', 'Contenu');
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error('Erreur API:', errorMessage);
}
```

### Types d'erreurs

```typescript
interface ApiError {
  detail: string;
  status: number;
}
```

## 🔍 Test de connexion

Utilisez le composant `ApiTest` pour vérifier la connexion :

```typescript
import { ApiTest } from '@/components/ApiTest';

function TestPage() {
  return (
    <div>
      <h1>Test de l'API</h1>
      <ApiTest />
    </div>
  );
}
```

## 📋 Exemples complets

### Page de connexion

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### Page de gestion des emails

```typescript
'use client';

import { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';

export default function EmailsPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { emails, createEmail, deleteEmail, isLoading, error } = useEmails();

  const handleCreateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmail(subject, body);
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Erreur de création:', error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Gestion des Emails</h1>
      
      <form onSubmit={handleCreateEmail}>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Sujet"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Contenu"
          required
        />
        <button type="submit">Créer un email</button>
      </form>

      <div>
        <h2>Emails existants</h2>
        {emails.map(email => (
          <div key={email.id}>
            <h3>{email.subject}</h3>
            <p>{email.body}</p>
            <button onClick={() => deleteEmail(email.id)}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Dépannage

### Problèmes courants

1. **Erreur CORS** : Vérifiez que le backend autorise les requêtes depuis `http://localhost:3000`

2. **Token invalide** : Utilisez `apiService.refreshToken()` pour rafraîchir le token

3. **Connexion refusée** : Vérifiez que le backend FastAPI est en cours d'exécution

4. **Erreur de base de données** : Vérifiez la configuration de la base de données MySQL

### Debug

```typescript
// Vérifier l'état de l'authentification
console.log('Authentifié:', apiService.isAuthenticated());
console.log('Token:', apiService.getToken());

// Tester la connexion
const isConnected = await apiService.healthCheck();
console.log('API connectée:', isConnected);
``` 