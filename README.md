
#  API d'envoi de crédits – Test LafricaMobile

Cette API simule un service d'envoi de crédit mobile. Elle permet :
- de recevoir des requêtes HTTP contenant des données d'envoi,
- de sécuriser l'accès par API Key,
- d'enregistrer les transactions en base PostgreSQL,
- d’envoyer un `callback` HTTP à une URL distante.

---

## Technologies utilisées

| Tech          | Usage                                 |
|---------------|----------------------------------------|
| Node.js       | Runtime JavaScript                     |
| Express.js    | Framework web/API                      |
| PostgreSQL    | Base de données relationnelle          |
| Axios         | Requêtes HTTP (pour callback)          |
| UUID          | Génération d’identifiants uniques      |
| Dotenv        | Gestion des variables d’environnement  |
| Nodemon       | Reload auto en dev                     |


## Architecture du projet


test-envoi-api/
├── src/
│   ├── config/
│   │   └── db.js                  # Connexion PostgreSQL
│   ├── controllers/
│   │   └── envoi.controller.js   # Logique principale de la route
│   ├── middlewares/
│   │   └── apiKey.middleware.js  # Authentification API-KEY
│   ├── routes/
│   │   └── envoi.routes.js        # Déclaration de la route POST /envoi
│   ├── services/
│   │   └── callback.service.js   # Envoi du callback HTTP
│   ├── app.js                    # App Express
│   └── server.js                 # Point d'entrée serveur
├── .env                          # Config (API\_KEY, DB URL)
├── package.json
└── README.md

````

---

## Installation

### 1. Cloner le projet

```bash
git clone <repo-url>
cd test-envoi-api
````

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l’environnement

Créer un fichier `.env` à la racine, en remplacant '.env.example' par '.env':

```env
PORT=3000
API_KEY=123456
DATABASE_URL=postgres://postgres:motdepasse@localhost:5432/dbname
```

> ⚠️ Remplace `motdepasse` et `dbname` par ta configuration locale

### 4. Lancer le projet

```bash
npm run dev
```

---

## Authentification API-KEY

Toutes les requêtes doivent contenir un en-tête :

```http
API-KEY: 123456
```

Sinon la réponse est :

```json
{ "error": "API-KEY header manquant ou invalide" }
```

---

## Exemple de requête

### Endpoint

```http
POST /envoi
```

### Headers

```http
API-KEY: 123456
Content-Type: application/json
```

### Body

```json
{
  "montant": 1000,
  "telephone": "770000000",
  "correlation_id": "ref-001",
  "operateur": "ORANGE",
  "callback_url": "https://webhook.site/..."
}
```

---

## ✅ Réponse attendue

```json
{
  "montant": 1000,
  "telephone": "770000000",
  "correlation_id": "ref-001",
  "transaction_id": "3f10a9e4-8db1-4c1b-a67f-123456789abc",
  "status": "SUCCESS",
  "operateur": "ORANGE",
  "callback_url": "https://webhook.site/..."
}
```

---

##  Envoi automatique vers le `callback_url`

Après traitement, l’API envoie une requête `POST` vers `callback_url` avec le même JSON que ci-dessus.

Ce callback est effectué via **Axios**, sans bloquer la réponse principale.

---

##  Structure de la table PostgreSQL

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  montant DECIMAL(12,2) NOT NULL,
  telephone VARCHAR(30) NOT NULL,
  correlation_id VARCHAR(64) NOT NULL,
  transaction_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'SUCCESS',
  operateur VARCHAR(20) NOT NULL,
  callback_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

> Seuls les opérateurs `ORANGE`, `EXPRESSO`, `YAS` sont acceptés (validation manuelle dans le contrôleur).

---

## ⚠️ Gestion des erreurs

| Cas                           | Réponse HTTP | Message                              |
| ----------------------------- | ------------ | ------------------------------------ |
| Clé API manquante ou invalide | 401          | "API-KEY header manquant"            |
| Données manquantes            | 400          | "Tous les champs sont obligatoires." |
| Opérateur invalide            | 400          | "Valeurs acceptées : ORANGE..."      |
| Erreur serveur ou base        | 500          | "Erreur serveur"                     |

---



##  Auteur

**Papa Mamour T. Diop**
Candidat au poste de Développeur Full Stack – LafricaMobile
 Email : \[[pirlothiouk@gmail.com](mailto:pirlothiouk@gmail.com)]
 GitHub : \[[https://github.com/LordThiouk](https://github.com/LordThiouk)]
 Téléphone : +221 77 095 15 43

---

##  Pour tester en ligne

Tu peux utiliser [https://webhook.site](https://webhook.site) pour visualiser le `callback_url` et valider l’envoi automatique par l’API.
