# TAHA - Application de Gestion d'Emails

Une application complète de gestion d'emails avec un frontend Next.js et un backend FastAPI.

## 🚀 Fonctionnalités

### Frontend (Next.js)
- ✅ Interface utilisateur moderne avec Tailwind CSS
- ✅ Authentification utilisateur
- ✅ Gestion des emails (CRUD)
- ✅ Dashboard utilisateur
- ✅ Design responsive

### Backend (FastAPI)
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ CRUD pour les emails
- ✅ Enregistrement automatique des connexions
- ✅ Base de données MySQL avec Prisma
- ✅ Documentation API automatique (Swagger)

## 📁 Structure du Projet

```
taha/
├── app/                    # Frontend Next.js
│   ├── api/               # Routes API Next.js
│   ├── dashboard/         # Page dashboard
│   ├── login/            # Page de connexion
│   └── register/         # Page d'inscription
├── backend/              # Backend FastAPI
│   ├── main.py          # Application principale
│   ├── models.py        # Modèles SQLAlchemy
│   ├── schemas.py       # Schémas Pydantic
│   ├── crud.py          # Opérations CRUD
│   ├── auth.py          # Authentification JWT
│   └── database.py      # Configuration DB
├── components/           # Composants React
├── lib/                 # Utilitaires et services
└── prisma/              # Schéma de base de données
```

## 🛠️ Installation

### Prérequis
- Node.js 18+ et npm/pnpm
- Python 3.8+
- MySQL 8.0+

### 1. Frontend (Next.js)

```bash
# Installer les dépendances
npm install
# ou
pnpm install

# Configurer la base de données
npx prisma generate
npx prisma db push

# Démarrer le serveur de développement
npm run dev
# ou
pnpm dev
```

Le frontend sera accessible sur `http://localhost:3000`

### 2. Backend (FastAPI)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances Python
pip install -r requirements.txt

# Configurer les variables d'environnement
cp env_example.txt .env
# Modifier le fichier .env avec vos paramètres

# Démarrer le serveur
python run.py
# ou
python start_server.py
```

Le backend sera accessible sur `http://localhost:8000`

### 3. Avec Docker (Optionnel)

```bash
# Démarrer avec Docker Compose
cd backend
docker-compose up -d
```

## 🔧 Configuration

### Variables d'environnement Frontend

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=mysql://username:password@localhost:3306/agent_db
```

### Variables d'environnement Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/agent_db
SECRET_KEY=your-super-secret-key-here
HOST=0.0.0.0
PORT=8000
```

## 📚 API Endpoints

### Authentification
- `POST /register` - Enregistrer un utilisateur
- `POST /login` - Connexion utilisateur

### Utilisateurs
- `GET /users/me` - Informations utilisateur connecté
- `GET /users/me/login-history` - Historique des connexions

### Emails
- `GET /users/me/emails` - Liste des emails
- `POST /emails` - Créer un email
- `GET /emails/{id}` - Obtenir un email
- `PUT /emails/{id}` - Modifier un email
- `DELETE /emails/{id}` - Supprimer un email

## 🧪 Tests

### Tester le Backend

```bash
cd backend
python test_api.py
```

### Tester le Frontend

```bash
npm run test
# ou
pnpm test
```

## 📖 Documentation API

Une fois le backend démarré, accédez à :
- **Swagger UI :** `http://localhost:8000/docs`
- **ReDoc :** `http://localhost:8000/redoc`

## 🚀 Déploiement

### Frontend (Vercel)
```bash
npm run build
# Déployer sur Vercel
```

### Backend (Docker)
```bash
cd backend
docker build -t taha-backend .
docker run -p 8000:8000 taha-backend
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que tous les services sont démarrés
2. Consultez les logs du serveur
3. Vérifiez la configuration de la base de données
4. Ouvrez une issue sur GitHub

## 🔄 Mise à jour

Pour mettre à jour le projet :

```bash
# Frontend
npm update
# ou
pnpm update

# Backend
pip install -r requirements.txt --upgrade
``` 

---

## 🚀 Installation et Lancement (pour un nouveau poste)

### 1. Cloner le projet
```bash
# Remplace par l’URL de ton dépôt
 git clone https://github.com/ton-utilisateur/nom-du-repo.git
 cd nom-du-repo
```

### 2. Installer et lancer le backend
```bash
cd backend
python -m venv venv
# Sous Windows :
venv\Scripts\activate
# Sous Mac/Linux :
# source venv/bin/activate
pip install -r requirements.txt
pip install pymysql
```

- Copier le fichier `env_example.txt` en `.env` et le remplir (base de données, clé Cohere, etc.)
- S’assurer que MySQL est installé et la base créée (voir doc plus haut)

```bash
# Lancer le backend
python run.py
# ou
python start_with_checks.py
```

### 3. Installer et lancer le frontend
Dans un autre terminal, à la racine du projet :
```bash
npm install
# ou
pnpm install

npm run dev
# ou
pnpm dev
```

### 4. Accéder à l’application
- Frontend : http://localhost:3000
- Backend (API docs) : http://localhost:8000/docs

---

**Résumé :**
1. Cloner le repo
2. Installer backend (venv, requirements, .env, MySQL)
3. Lancer backend
4. Installer frontend (npm install)
5. Lancer frontend
6. Accéder à l’app sur http://localhost:3000

--- 