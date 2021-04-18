# SoPeckoko

Projet 6 du parcours Développeur Web d'OpenClassRooms
Une fois le projet installer, rendez-vous sur http://localhost:4200/

## Technologies

• Node.js
• MongoBD
• Mongoose

## Installation

1. Cloner le repository
2. Installer Node.js
3. Installer Angular CLI
4. Installer Nodemon
5. Installer les dépendences pour les dossiers frontend et backend
6. Mettre en place le fichier .env à la racine

````text
# MongoDB credentials
MONGODB_URI = mongodb+srv://USER:PSW@HOST/ <dbname >?retryWrites=true & w=majority

# Random secret token
JWT_SECRET_TOKEN = xxx

# Session code
SECRET_SESSION = xxx
````

7. Lancer le server frontend avec 'ng serve'
8. Lancer le server backend avec 'nodemon server'

***Le but est de créer le backend de l'application, le frontend étant déjà codé et fourni***

* Implémenter un modèle logique de données conformément à la réglementation
* Stocker des données de manière sécurisée
* Mettre en œuvre des opérations CRUD de manière sécurisée

##### API REST

* Sécurité **OWASP** et **RGPD**

## L'objectif de ce projet est d'écrire un back-end sécurisé et de suivre la recommandation de "owasp"
## afin d’être en conformité avec «owasp» des middlewares Sécuritaire ont été installés pour protéger l’application
## vous avez la liste ci-dessous, la menace et comment le middleware protège l'application


## Des failles d'injection


Le premier du Top Ten de "OWASP"
lorsqu'un attaquant peut envoyer des données hostiles à un interprète

Empêcher l'injection nécessite de séparer les données des commandes et des requêtes


l'utilisation de "MONGOOSE" résout ce problème en utilisant des objets, appelés schémas,
pour modéliser et structurer la base de données.

"express-mongo-sanitize” désinfecte votre charge utile express pour empêcher l'injection d'opérateur MongoDB

"email-validator" garantit un format de courrier électronique valide et empêche l'injection de SQL

"express-validator" côté serveur pour valider les données pour s'assurer que nous avons des données dans le format recommandé
et empêche l'injection de SQL


## Authentification cassée
Le deuxième du Top Ten de "OWASP"
Les attaquants doivent accéder à seulement quelques comptes ou à un seul compte administrateur pour compromettre le système
"password-validator" Valide le mot de passe selon des spécifications flexibles et intuitives  ajouter de complexité et de rotation des mots de pass 


“express-bouncer” Limiter ou retarder de plus en plus les tentatives de connexion infructueuses.

“express-rate-limit” Utilisez pour limiter les demandes répétées aux API publiques et / ou aux points de terminaison tels que la réinitialisation du mot de passe.


## Exposition des données sensibles
La troisième du Top Ten de "OWASP"
Les attaquants volent des clés, exécutent des attaques de type "man-in-the-middle" ou volent des données en texte clair du serveur, en transit, ou du client de l'utilisateur, par ex. le navigateur.
“noCache” Désactivez la mise en cache pour les réponses contenant des données sensibles.


“bcrypt” Assurez-vous de crypter toutes les données sensibles au repos. Stockez les mots de passe en utilisant des fonctions de hachage adaptatives et salées fortes avec un facteur de travail (facteur de retard), comme  bcrypt.

“maskData” est utilisé pour masquer les données sensibles


## Contrôle d'accès cassé
La  Quatrième du Top Ten de "OWASP"
les attaquants agissant en tant qu'utilisateurs ou administrateurs, ou utilisateurs utilisant des fonctions privilégiées, ou créant, accédant, mettant à jour ou supprimant chaque enregistrement.
“Morgan”créer des logs  au format combiné Apache dans STDOUT


"xss_Clean" méthode faille xss nettoie
 les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d'URL

“hpp” middleware  HTTP pour se protéger contre les attaques de pollution des paramètres HTTP 

“express-rate-limit” Limitez le taux d'accès à l'API et au contrôleur pour minimiser les dommages causés par les outils d'attaque automatisés.

“helmet” Helmet vous aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
