# EduFlow Backend API

Backend API basé sur Node.js pour l'application EduFlow, une plateforme de gestion d'assignments.

## Configuration

1. **Base de Données :** Utilisez MongoDB pour stocker les informations sur les utilisateurs, les assignments, les matières, etc. Assurez-vous d'ajuster la configuration de la base de données dans le fichier `server.js`.

2. **Authentification :** Le backend gère l'authentification des utilisateurs. Vous pouvez choisir entre une gestion simple des utilisateurs ou une intégration JWT pour une sécurité renforcée. Configurez les paramètres d'authentification dans le fichier `auth.js`.

3. **Variables d'Environnement :** Configurez les variables d'environnement nécessaires dans un fichier `.env`)

## Installation

1. Clonez le répertoire : `git clone https://github.com/votre-utilisateur/eduflow-backend.git`
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement si nécessaire.
4. Lancez le serveur : `npm start`

## Routes de l'API

- **POST /api/auth/login :** Authentification des utilisateurs (admin, professeur, étudiant).
- **GET /api/assignments :** Récupération de la liste des assignments.
- **POST /api/assignments :** Ajout d'un nouvel assignment.
- **GET /api/assignments/:id :** Récupération des détails d'un assignment spécifique.
- **PUT /api/assignments/:id :** Mise à jour d'un assignment existant.
- **DELETE /api/assignments/:id :** Suppression d'un assignment.

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ou ajouter des fonctionnalités, veuillez suivre ces étapes :

1. Créez une branche pour votre fonctionnalité : `git checkout -b feature/NouvelleFonctionnalite`
2. Committez vos changements : `git commit -m 'Ajout de NouvelleFonctionnalite'`
3. Poussez votre branche : `git push origin feature/NouvelleFonctionnalite`
4. Créez une pull request sur GitHub.

## Auteurs

- Flavien Rakotoarison et Tendry Rakotoarivony 

## Licence

Ce projet est sous licence [MIT](LICENSE.md).

---

**EduFlow Backend API** - Gérez les données et l'authentification pour une expérience d'apprentissage optimale !
