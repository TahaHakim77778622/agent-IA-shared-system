# Backend FastAPI - Gestion des Emails

Ce backend FastAPI fournit une API complète pour la gestion des emails avec authentification JWT et enregistrement automatique des connexions.

## Prérequis

- **MySQL** doit être installé et la base `agent_db` créée (via phpMyAdmin ou autre)
- **Le driver Python `pymysql` doit être installé** :
  ```bash
  pip install pymysql
  ```
- Le fichier `.env` doit contenir :
  ```env
  DATABASE_URL=mysql+pymysql://root:password@localhost:3306/agent_db
  SECRET_KEY=une-cle-secrete
  HOST=0.0.0.0
  PORT=8000
  LOG_LEVEL=info
  ```

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Enregistrement automatique des connexions
- ✅ CRUD complet pour les emails (Create, Read, Update, Delete)
- ✅ Gestion des utilisateurs
- ✅ Historique des connexions
- ✅ Sécurité avec hachage des mots de passe

## Installation

1. **Installer les dépendances Python :**
```bash
cd backend
pip install -r requirements.txt
pip install pymysql
```

2. **Configurer les variables d'environnement :**
```bash
# Copier le fichier d'exemple
cp env_example.txt .env

# Modifier le fichier .env avec vos paramètres
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/agent_db
SECRET_KEY=votre-cle-secrete-ici
```

3. **Démarrer le serveur :**
```bash
# Option 1: Démarrage simple
python run.py

# Option 2: Démarrage avec vérifications
python start_with_checks.py

# Option 3: Démarrage avec uvicorn directement
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur `http://localhost:8000`

## Endpoints API

### Authentification
- `POST /register` - Enregistrer un nouvel utilisateur
- `POST /login` - Connexion utilisateur (enregistre automatiquement la connexion)

### Utilisateurs
- `GET /users/me` - Obtenir les informations de l'utilisateur connecté
- `GET /users/me/login-history` - Historique des connexions

### Emails
- `GET /users/me/emails` - Liste des emails de l'utilisateur
- `POST /emails` - Créer un nouvel email
- `GET /emails/{email_id}` - Obtenir un email spécifique
- `PUT /emails/{email_id}` - Modifier un email
- `DELETE /emails/{email_id}` - Supprimer un email

## Documentation API

Une fois le serveur démarré, vous pouvez accéder à :
- **Swagger UI :** `http://localhost:8000/docs`
- **ReDoc :** `http://localhost:8000/redoc`

## Structure de la base de données

### Table User
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashé)

### Table Email
- `id` (Primary Key)
- `subject` (Sujet de l'email)
- `body` (Contenu de l'email)
- `createdAt` (Date de création)
- `userId` (Foreign Key vers User)

### Table LoginHistory
- `id` (Primary Key)
- `loginAt` (Date de connexion)
- `userId` (Foreign Key vers User)

## Exemples d'utilisation

### Connexion
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=mypassword"
```

### Créer un email
```bash
curl -X POST "http://localhost:8000/emails" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test", "body": "Contenu du test"}'
```

### Obtenir les emails
```bash
curl -X GET "http://localhost:8000/users/me/emails" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Tests

### Tester le Backend

```bash
cd backend

# Test de l'API complète
python test_api.py

# Test des modèles SQLAlchemy
python test_models.py

# Test avec vérifications complètes
python start_with_checks.py
```

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que MySQL est en cours d'exécution
   - Vérifiez la configuration DATABASE_URL dans .env
   - Assurez-vous que la base de données `agent_db` existe

2. **Erreur de dépendances manquantes**
   - Exécutez `pip install -r requirements.txt`
   - Exécutez `pip install pymysql`
   - Vérifiez que vous utilisez Python 3.8+

3. **Erreur de port déjà utilisé**
   - Changez le port dans le fichier .env
   - Ou arrêtez le processus qui utilise le port 8000

4. **Erreur de CORS**
   - Vérifiez que les origines CORS sont configurées correctement
   - Assurez-vous que le frontend est accessible sur l'URL configurée 