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
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Aperçu

Le projet **PMT Frontend** est l'interface utilisateur de l'application **Project Management Tool** (PMT). Elle permet aux utilisateurs de gérer leurs projets, d'assigner des tâches, de suivre leur historique, et d'accéder à des fonctionnalités avancées d'administration. Ce frontend est développé avec Angular et interagit avec une API backend pour récupérer et gérer les données.

## Fonctionnalités

Voici les principales fonctionnalités implémentées dans cette application frontend :

### Authentification et Gestion Utilisateur
- **Connexion / Déconnexion** : Authentification sécurisée des utilisateurs.
- **Récupération d'informations utilisateurs** : Affiche les informations du profil utilisateur connecté.
  
### Gestion de Projets
- **Création de projets** : Permet aux utilisateurs d'ajouter de nouveaux projets.
- **Modification et Suppression de projets** : Éditez les informations des projets et supprimez-les si nécessaire.
- **Liste des projets** : Affiche la liste des projets de l'utilisateur.
  
### Gestion des Tâches
- **Création de tâches** : Ajoute de nouvelles tâches à un projet existant.
- **Modification de tâches** : Modifie les détails d'une tâche, tels que son statut et sa priorité.
- **Suppression de tâches** : Supprime une tâche d'un projet.
- **Drag & Drop des tâches** : Réorganisez les tâches avec une interface glisser-déposer pour une meilleure gestion visuelle.
  
### Historique des Tâches
- **Historique des modifications** : Suivi des modifications effectuées sur chaque tâche, permettant aux utilisateurs de voir l'historique complet.

### Notifications et Gestion des Erreurs
- **Affichage des erreurs** : Notification en cas d'erreur lors de la connexion, de la gestion des tâches, ou des projets.
- **Success Messages** : Confirmation visuelle des actions réussies (création, mise à jour, suppression).

## Technologies Utilisées

- **Angular** : Framework JavaScript pour la construction d'applications SPA (Single Page Applications).
- **RxJS** : Programmation réactive pour gérer les appels asynchrones.
- **Bootstrap / SCSS** : Pour le style et la mise en page réactive.
- **Ngx-drag-drop** : Pour la gestion des fonctionnalités de glisser-déposer des tâches.
- **Nginx** : Utilisé pour le déploiement en production avec Docker.

## Installation et Démarrage

### Prérequis

- **Node.js** version 18 ou supérieure
- **Angular CLI** (facultatif, mais recommandé) : `npm install -g @angular/cli`
- **Docker** (pour l'utilisation en production et le déploiement)

### Installation

1. Clonez le dépôt du projet :
   ```bash
   git clone https://github.com/votre-utilisateur/pmt-frontend.git
   cd pmt-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application en mode développement :
   ```bash
   ng serve
   ```
   Accédez ensuite à [http://localhost:4200](http://localhost:4200) dans votre navigateur.

## Configuration Environnementale

Pour se connecter au backend, créez un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8098'
};
```

En production, un fichier `environment.prod.ts` avec les paramètres spécifiques au déploiement doit également être configuré.

## Structure du Projet

- `src/app` : Composants et services principaux de l'application
  - **components/** : Composants UI réutilisables
  - **services/** : Services pour les appels API et la gestion des données
  - **models/** : Interfaces pour la typage des données (tâches, projets, utilisateurs, etc.)

## Déploiement

### Docker

1. Construisez l'image Docker :
   ```bash
   docker build -t pmt-frontend .
   ```

2. Démarrez le conteneur Docker avec Docker Compose :
   ```bash
   docker-compose up --build -d
   ```

### GitHub Actions pour CI/CD

Le fichier `ci-cd.yml` dans `.github/workflows/` est configuré pour :
- Installer les dépendances avec `npm install --legacy-peer-deps`
- Lancer les tests unitaires
- Construire l'image Docker et la pousser vers Docker Hub (nécessite des secrets GitHub pour les identifiants Docker Hub)

## Tests

Les tests unitaires peuvent être exécutés avec :

```bash
ng test
```

Les tests end-to-end (E2E) sont également configurés :

```bash
ng e2e
```
