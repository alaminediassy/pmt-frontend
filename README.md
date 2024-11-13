# PMT Frontend

Ce projet a été généré avec Angular CLI version 17.3.7.

## Table des matières
- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation et Démarrage](#installation-et-démarrage)
- [Configuration Environnementale](#configuration-environnementale)
- [Structure du Projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Tests](#tests)

## Aperçu

Le projet **PMT Frontend** est une application Angular pour la gestion de projets et de tâches, conçue pour offrir une interface utilisateur conviviale permettant aux utilisateurs de gérer leurs projets, d'assigner des tâches, et de suivre l'avancement des travaux. 

Cette application interagit avec une API backend pour obtenir et mettre à jour les données relatives aux projets et aux utilisateurs.

## Fonctionnalités

### Authentification et Gestion Utilisateur
- **Connexion / Déconnexion** : Authentification des utilisateurs.
- **Inscription** : Création de nouveaux comptes utilisateur.
- **Protection des routes** : Utilisation de `AuthGuard` pour restreindre l'accès aux routes sécurisées.

### Gestion de Projets
- **Création, Modification et Suppression de projets** : Gérez vos projets depuis l'interface.
- **Liste des projets** : Affiche une liste de tous les projets dans le composant `project-list`.

### Gestion des Tâches
- **Création et édition des tâches** : Avec les composants `task-modal` et `edit-task-modal`, les utilisateurs peuvent ajouter et modifier des tâches.
- **Assignation de tâches** : Le composant `assign-task-modal` permet d'assigner des tâches aux membres du projet.
- **Drag & Drop** : Le composant `task-list` inclut une interface de glisser-déposer pour organiser les tâches par statut (TODO, IN_PROGRESS, COMPLETED).

### Historique des Tâches
- **Suivi des changements** : Le composant `task-history` affiche un historique des modifications effectuées sur chaque tâche.

### Navigation
- **Barre de navigation et sidebar** : `header` et `sidebar` fournissent une navigation claire et structurée.
- **Fil d'Ariane** : Le composant `breadcrumb` aide à la navigation entre les sections de l'application.

## Technologies Utilisées

- **Angular** : Framework pour construire des applications SPA (Single Page Applications).
- **RxJS** : Utilisé pour la gestion des appels asynchrones.
- **Bootstrap / SCSS** : Pour le style et la mise en page réactive.
- **Ngx-drag-drop** : Pour la gestion des fonctionnalités de glisser-déposer des tâches.
- **Nginx** : Utilisé pour le déploiement en production avec Docker.

## Installation et Démarrage

### Prérequis

- **Node.js** version 18 ou supérieure
- **Angular CLI** (facultatif) : `npm install -g @angular/cli`
- **Docker** (pour le déploiement)

### Installation

1. Clonez le dépôt du projet :
   ```bash
   git clone https://github.com/alaminediassy/pmt-frontend.git
   cd pmt-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```

3. Démarrez l'application en mode développement :
   ```bash
   ng serve
   ```
   Accédez ensuite à [http://localhost:4200](http://localhost:4200) dans votre navigateur.

## Configuration Environnementale

Pour configurer l'URL de l'API backend, créez un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8098'
};
```

Un fichier `environment.prod.ts` avec des paramètres de production doit également être configuré pour le déploiement.

## Structure du Projet

Le projet est organisé comme suit :

- `src/app/components/` : Contient les composants réutilisables de l'interface utilisateur.
  - **assign-task-modal/** : Modal pour assigner des tâches aux membres.
  - **breadcrumb/** : Composant de navigation pour afficher le fil d'Ariane.
  - **dashboard-content/** : Composant principal du tableau de bord.
  - **edit-task-modal/** : Modal pour éditer les tâches.
  - **invite-member/** : Gérer l'invitation des membres au projet.
  - **project-modal/** : Modal pour créer ou éditer des projets.
  - **role-management/** : Gestion des rôles des utilisateurs dans les projets.
  - **task-modal/** : Modal pour ajouter de nouvelles tâches.
- **dashboard/** : Composant de la page principale du tableau de bord.
- **header/** : Composant de la barre de navigation en haut de la page.
- **home/** : Composant de la page d'accueil.
- **login/** : Page de connexion.
- **models/** : Définitions des modèles de données utilisés dans l'application.
- **project-list/** : Composant listant les projets de l'utilisateur.
- **register/** : Page d'inscription.
- **services/** : Contient les services de l'application, y compris les appels HTTP.
- **sidebar/** : Composant de la barre latérale pour la navigation.
- **task-history/** : Affiche l'historique des changements pour une tâche.
- **task-list/** : Affiche la liste des tâches avec des options de glisser-déposer.

## Déploiement

### Docker

1. Construisez l'image Docker :
   ```bash
   docker build -t pmt-frontend .
   ```

2. Lancez le conteneur avec Docker Compose :
   ```bash
   docker-compose up --build -d
   ```

### CI/CD avec GitHub Actions

Un pipeline de CI/CD est configuré dans `.github/workflows/ci-cd.yml` pour :

- Installer les dépendances avec `npm install --legacy-peer-deps`
- Lancer les tests unitaires
- Construire l'image Docker et la pousser vers Docker Hub (nécessite des secrets GitHub pour les identifiants Docker Hub)

## Tests

Les tests unitaires peuvent être exécutés avec :

```bash
ng test
```

Les tests end-to-end (E2E) peuvent être lancés avec :

```bash
ng e2e
```

## Merci