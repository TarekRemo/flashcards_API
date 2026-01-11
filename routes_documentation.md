### Endpoints d'authentification

#### POST /auth/register
- **Rôle fonctionnel** : Créer un nouveau compte utilisateur
- **Authentification** : Publique
- **Body (JSON)** :
  - `firstName` (string, requis) : Prénom de l'utilisateur (3-30 caractères)
  - `lastName` (string, requis) : Nom de famille de l'utilisateur (3-30 caractères)
  - `email` (email, requis) : Adresse email de l'utilisateur
  - `password` (string, requis) : Mot de passe (8-255 caractères)
- **Réponse** : Données utilisateur et token JWT

#### POST /auth/login
- **Rôle fonctionnel** : Connecter un utilisateur existant
- **Authentification** : Publique
- **Body (JSON)** :
  - `email` (email, requis) : Adresse email de l'utilisateur
  - `password` (string, requis) : Mot de passe (8-255 caractères)
- **Réponse** : Données utilisateur et token JWT

#### GET /auth/me
- **Rôle fonctionnel** : Récupérer le profil de l'utilisateur connecté
- **Authentification** : Authentifiée (token JWT requis)
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Profil utilisateur (id, firstName, lastName, email, createdAt)

### Endpoints de flashcards

#### GET /flashcard/all/:collectionId
- **Rôle fonctionnel** : Récupérer toutes les flashcards d'une collection
- **Authentification** : Authentifiée (token JWT requis)
- **Route params** :
  - `collectionId` (UUID, requis) : Identifiant de la collection
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** : Collections publiques ou collections privées appartenant à l'utilisateur ou utilisateur admin
- **Réponse** : Liste des flashcards de la collection

#### GET /flashcard/:id
- **Rôle fonctionnel** : Récupérer une flashcard spécifique par son ID
- **Authentification** : Authentifiée (token JWT requis)
- **Route params** :
  - `id` (UUID, requis) : Identifiant unique de la flashcard
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** : Collections publiques ou collections privées appartenant à l'utilisateur ou utilisateur admin
- **Réponse** : Détails de la flashcard

#### GET /flashcard/revision/:collectionId
- **Rôle fonctionnel** : Récupérer les flashcards à réviser dans une collection selon l'algorithme de répétition espacée
- **Authentification** : Authentifiée (token JWT requis)
- **Route params** :
  - `collectionId` (UUID, requis) : Identifiant de la collection
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** : Collections publiques ou collections privées appartenant à l'utilisateur ou utilisateur admin
- **Réponse** : Liste des flashcards nécessitant une révision

#### POST /flashcard
- **Rôle fonctionnel** : Créer une nouvelle flashcard dans une collection
- **Authentification** : Authentifiée (propriétaire de la collection)
- **Headers** : `Authorization: Bearer <token>`
- **Body (JSON)** :
  - `collectionId` (UUID, requis) : Identifiant de la collection
  - `recto` (string, requis) : Texte du recto (1-512 caractères)
  - `verso` (string, requis) : Texte du verso (1-512 caractères)
  - `rectoUrl` (URL, optionnel) : URL d'image pour le recto (max 512 caractères)
  - `versoUrl` (URL, optionnel) : URL d'image pour le verso (max 512 caractères)
- **Permissions** : Propriétaire de la collection uniquement
- **Réponse** : Détails de la flashcard créée

#### PUT /flashcard
- **Rôle fonctionnel** : Modifier une flashcard existante
- **Authentification** : Authentifiée (propriétaire de la collection)
- **Headers** : `Authorization: Bearer <token>`
- **Body (JSON)** :
  - `id` (UUID, requis) : Identifiant de la flashcard à modifier
  - `recto` (string, optionnel) : Nouveau texte du recto (1-512 caractères)
  - `verso` (string, optionnel) : Nouveau texte du verso (1-512 caractères)
  - `rectoUrl` (URL, optionnel) : Nouvelle URL d'image pour le recto (max 512 caractères)
  - `versoUrl` (URL, optionnel) : Nouvelle URL d'image pour le verso (max 512 caractères)
- **Permissions** : Propriétaire de la collection uniquement
- **Réponse** : Flashcard mise à jour

#### PUT /flashcard/revision
- **Rôle fonctionnel** : Enregistrer une session de révision pour une flashcard (système de répétition espacée)
- **Authentification** : Authentifiée (token JWT requis)
- **Headers** : `Authorization: Bearer <token>`
- **Body (JSON)** :
  - `flashcardId` (UUID, requis) : Identifiant de la flashcard révisée
  - `level` (number, requis) : Niveau représentant le délai souhaité avant le prochaine révision (voir en bas)
- **Permissions** : Collections publiques ou collections privées appartenant à l'utilisateur ou utilisateur admin
- **Réponse** : Données de révision créées/mises à jour

#### DELETE /flashcard/:id
- **Rôle fonctionnel** : Supprimer définitivement une flashcard
- **Authentification** : Authentifiée (propriétaire de la collection)
- **Route params** :
  - `id` (UUID, requis) : Identifiant de la flashcard à supprimer
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** : Propriétaire de la collection uniquement
- **Réponse** : Confirmation de suppression

#### Niveaux de révision
- 1 = 1 jour
- 2 = 2 jours
- 3 = 4 jours
- 4 = 8 jours
- 5 = 16 jours

### Endpoints de collections

#### GET /collection/search
- **Rôle fonctionnel** : Rechercher des collections publiques par titre (recherche partielle)
- **Authentification** : Publique
- **Query params** :
  - `title` (string, requis) : Terme de recherche sur le titre
- **Réponse** : Liste des collections publiques correspondant au filtre

#### GET /collection
- **Rôle fonctionnel** : Lister les collections appartenant à l’utilisateur connecté
- **Authentification** : Authentifiée (token JWT requis)
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Liste des collections de l’utilisateur

#### GET /collection/:id
- **Rôle fonctionnel** : Récupérer une collection spécifique
- **Authentification** : Authentifiée (token JWT requis)
- **Route params** :
  - `id` (UUID, requis) : Identifiant de la collection
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** :
  - Lecture autorisée si collection publique
  - Lecture autorisée si propriétaire de la collection
  - Lecture autorisée si utilisateur admin
- **Réponse** : Détails de la collection

#### POST /collection
- **Rôle fonctionnel** : Créer une nouvelle collection
- **Authentification** : Authentifiée (token JWT requis)
- **Headers** : `Authorization: Bearer <token>`
- **Body (JSON)** :
  - `title` (string, requis) : Titre (1-128 caractères)
  - `description` (string, requis) : Description (1-512 caractères)
  - `isPrivate` (boolean, optionnel) : Privée (par défaut `false` via validation)
- **Réponse** : Détails de la collection créée

#### PUT /collection
- **Rôle fonctionnel** : Mettre à jour une collection existante
- **Authentification** : Authentifiée (token JWT requis)
- **Headers** : `Authorization: Bearer <token>`
- **Body (JSON)** :
  - `id` (UUID, requis) : Identifiant de la collection à mettre à jour
  - `title` (string, optionnel) : Nouveau titre (1-128 caractères)
  - `description` (string, optionnel) : Nouvelle description (1-512 caractères)
  - `isPrivate` (boolean, optionnel) : Nouveau statut de confidentialité
- **Permissions** : Propriétaire de la collection uniquement
- **Réponse** : Collection mise à jour

#### DELETE /collection/:id
- **Rôle fonctionnel** : Supprimer une collection
- **Authentification** : Authentifiée (token JWT requis)
- **Route params** :
  - `id` (UUID, requis) : Identifiant de la collection
- **Headers** : `Authorization: Bearer <token>`
- **Permissions** : Propriétaire de la collection uniquement
- **Réponse** : Confirmation de suppression

### Routes admin

Tous les endpoints admin nécessitent un utilisateur admin (champ `isAdmin` true) et un token JWT valide.

#### GET /admin/user
- **Rôle fonctionnel** : Lister tous les utilisateurs
- **Authentification** : Authentifiée (admin uniquement)
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Liste des utilisateurs

#### GET /admin/user/:id
- **Rôle fonctionnel** : Récupérer un utilisateur par son ID
- **Authentification** : Authentifiée (admin uniquement)
- **Route params** :
  - `id` (UUID, requis) : Identifiant de l’utilisateur
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Détails de l’utilisateur

#### DELETE /admin/user/:id
- **Rôle fonctionnel** : Supprimer un utilisateur
- **Authentification** : Authentifiée (admin uniquement)
- **Route params** :
  - `id` (UUID, requis) : Identifiant de l’utilisateur
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Confirmation de suppression