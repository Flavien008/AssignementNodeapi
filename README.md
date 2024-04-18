# Backend API de l'Application de Gestion des Assignements

Ce backend API est conçu pour servir de support à l'application de gestion des assignements dans un environnement éducatif ou professionnel. Il fournit des endpoints pour gérer les utilisateurs, les assignements, les groupes, les rendus, les matières, etc. L'API est développée en utilisant Node.js et Express.js, et elle communique avec une base de données MongoDB dans le cloud.

## Configuration

1. Assurez-vous d'avoir Node.js installé sur votre machine.
2. Clonez ce dépôt sur votre machine locale.
3. Assurez-vous d'avoir MongoDB installé ou utilisez un service de base de données cloud comme MongoDB Atlas.
4. Remplacez l'URI de connexion à la base de données MongoDB dans le fichier `server.js` par votre propre URI de connexion.

## Installation

1. Installez les dépendances en exécutant `npm install`.
2. Démarrez le serveur en exécutant `npm start`.

## Structure du Projet
server.js: Point d'entrée de l'application backend.
routes/: Répertoire contenant les fichiers de routage pour chaque entité (assignments, users, matieres, groupes, rendus). Chaque fichier de routage contient des fonctions qui définissent les points d'extrémité (endpoints) pour les opérations CRUD (Create, Read, Update, Delete) associées à chaque entité.
middlewares/: Répertoire contenant les middlewares pour l'authentification.
models/: Répertoire contenant les modèles de données MongoDB.

## Endpoints API

- **Authentification**:
  - `POST /api/signup`: Inscription d'un nouvel utilisateur.
  - `POST /api/login`: Connexion d'un utilisateur.

- **Utilisateurs**:
  - `GET /api/etudiants`: Récupère la liste des étudiants.
  - `GET /api/etudiants/not-in-group`: Récupère la liste des étudiants non attribués à un groupe.
  - `GET /api/etudiants/in-group`: Récupère la liste des étudiants attribués à un groupe.

- **Assignements**:
  - `POST /api/assignments`: Crée un nouvel assignement.
  - `PUT /api/assignments/:id`: Met à jour un assignement existant.
  - `GET /api/assignments`: Récupère la liste des assignements.
  - `GET /api/assignments/:id`: Récupère un assignement spécifique.
  - `GET /api/assignments/group/:id`: Récupère les assignements associés à un groupe.
  - `DELETE /api/assignments/:id`: Supprime un assignement.

- **Matières**:
  - `GET /api/matiere`: Récupère la liste des matières.
  - `POST /api/matiere`: Crée une nouvelle matière.
  - `PUT /api/matiere/:id`: Met à jour une matière existante.
  - `GET /api/matiere/:id`: Récupère une matière spécifique.
  - `DELETE /api/matiere/:id`: Supprime une matière.

- **Groupes**:
  - `GET /api/groupes`: Récupère la liste des groupes.
  - `POST /api/groupes`: Crée un nouveau groupe.
  - `PUT /api/groupes/:id`: Met à jour un groupe existant.
  - `GET /api/groupes/:id`: Récupère un groupe spécifique.
  - `DELETE /api/groupes/:id`: Supprime un groupe.
  - `POST /api/groupes/membre`: Ajoute un utilisateur à un groupe.
  - `DELETE /api/groupes/membre`: Supprime un utilisateur d'un groupe.
  - `GET /api/groupesAll`: Récupère la liste de tous les groupes.
  - `GET /api/groupes/etudiant/:id`: Récupère les groupes auxquels un étudiant est attribué.

- **Rendus**:
  - `POST /api/rendu`: Crée un nouveau rendu.
  - `PUT /api/rendu`: Met à jour un rendu existant.
  - `GET /api/rendu`: Récupère la liste des rendus.


## Gestion des Jetons d'Authentification

L'API utilise des jetons d'authentification pour sécuriser les endpoints réservés aux utilisateurs connectés. Lorsqu'un utilisateur se connecte avec succès, un jeton d'authentification est généré et renvoyé dans la réponse. Ce jeton doit être inclus dans les en-têtes de toutes les requêtes ultérieures aux endpoints nécessitant une authentification.

### Exemple d'utilisation du Jeton d'Authentification

Pour inclure le jeton d'authentification dans une requête, ajoutez un en-tête `Authorization` avec la valeur `Bearer <token>` où `<token>` est le jeton d'authentification reçu lors de la connexion.

Exemple d'en-tête d'authentification :
```
Authorization: Bearer <token>
```

### Validation du Jeton d'Authentification

Le middleware d'authentification de l'API valide chaque requête en vérifiant la présence et la validité du jeton d'authentification. Si le jeton est valide, l'utilisateur est autorisé à accéder à l'endpoint demandé. Sinon, une réponse d'erreur est renvoyée.

## Prérequis Techniques

- Node.js version : v14.17.0
- MongoDB version : v4.4.9

## Auteurs
Ce projet a été développé par N° 21, RAKOTOARISON Tojo Fandresena Flavien et N°22, RAKOTOARIVONY Tendry Hery ny Aina.