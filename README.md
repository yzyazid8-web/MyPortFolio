# Portfolio  - SPA Vite

Portfolio personnel en Single Page Application (SPA), construit avec Vite.

Le site conserve une navigation par URL:
- /
- /experiences
- /education
- /projects
- /contact

Le rendu est alimenté dynamiquement par des fichiers JSON pour les sections principales.

## Stack technique

- Vite (build + dev server)
- JavaScript ES Modules
- Tailwind CSS (via CDN dans la page)
- AOS (animations au scroll)
- Boxicons
- EmailJS pour le formulaire de contact
- Netlify pour le déploiement

## Fonctionnalités

- Architecture SPA avec un seul fichier HTML
- Navigation interne sans rechargement de page
- Données dynamiques chargées depuis public/data
- Modales de détail pour formations, expériences et projets
- Thème clair/sombre avec persistance
- Formulaire de contact connecté à EmailJS

## Structure du projet

- index.html: shell de la SPA et toutes les vues
- src/main.js: routing, chargement des données, interactions UI, formulaire
- public/css/style.css: styles personnalisés
- public/data: contenus JSON
- public/images: images
- public/files: fichiers téléchargeables
- netlify.toml: build + redirects Netlify

## Installation locale

1. Installer les dépendances:

```bash
npm install
```

2. Configurer les variables d'environnement dans .env:

```env
VITE_EMAIL_JS=your_emailjs_public_key
```

3. Lancer le serveur local:

```bash
npm run dev
```

4. Ouvrir l'URL affichée par Vite (par défaut http://localhost:5173).

## Scripts npm

```bash
npm run dev      # développement
npm run build    # build production (dossier dist)
npm run preview  # prévisualisation du build
```

## Variables d'environnement

Le projet utilise:

- VITE_EMAIL_JS: clé publique EmailJS (public key)

Important:
- Les variables Vite doivent commencer par VITE_.
- Ne jamais stocker de clé privée dans le front.

## Déploiement Netlify

Le fichier netlify.toml est déjà configuré:

- commande de build: npm run build
- dossier publié: dist
- redirection SPA: /* -> /index.html (status 200)

Étapes:

1. Connecter le repo à Netlify.
2. Ajouter la variable d'environnement VITE_EMAIL_JS dans Site settings > Environment variables.
3. Lancer le deploy.

## Personnaliser le contenu

Modifier les fichiers dans public/data:

- education.json
- experiences.json
- projects.json
- skills.json

Les images et documents associés doivent être placés dans:

- public/images
- public/files

Utiliser des chemins relatifs depuis public, par exemple:

- images/mon-image.jpg
- files/mon-cv.pdf

## Dépannage rapide

- Le formulaire n'envoie rien:
	- vérifier VITE_EMAIL_JS dans .env (local) ou Netlify.
- Une route affiche 404 en production:
	- vérifier que netlify.toml contient bien la redirection SPA.
- Un visuel ne s'affiche pas:
	- vérifier le chemin dans les JSON et la présence du fichier dans public.

## Licence

Usage personnel et portfolio.
