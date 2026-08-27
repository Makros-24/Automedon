## Automedon - Portfolio Jumeau Numérique Propulsé par l'IA

**Pourquoi ce projet** : Un CV est un document statique qui ne répond qu'aux questions anticipées par son auteur. Les recruteurs finissent par chercher des mots-clés au lieu de poser les questions qui les intéressent vraiment. Automedon inverse la logique : un portfolio avec lequel on dialogue, appuyé sur un assistant strictement fondé sur mon CV, mon historique de projets et mon expérience professionnelle — aucune compétence inventée, aucune réponse hors du matériau source.

**Réalisation technique**

**Architecture** : Next.js 15 (App Router) avec React 19 et TypeScript en mode strict. Le contenu vit entièrement hors du code, dans `portfolio-data/{locale}/portfolio.json`, servi via des routes API validées plutôt qu'importé au moment du build. Mettre à jour le portfolio revient à éditer du JSON et redémarrer — pas à redéployer une application.

**Découverte dynamique des locales** : Plutôt qu'un type union figé, le serveur scanne `portfolio-data/` au démarrage, considère comme locale tout sous-dossier contenant un `portfolio.json`, et lit un `locale.json` optionnel pour le nom natif, le drapeau et l'indicateur RTL. Les résultats sont mis en cache au niveau du module : le système de fichiers n'est parcouru qu'une fois. Ajouter une cinquième langue se résume à un dossier et un redémarrage — zéro modification de code.

**Internationalisation** : Quatre langues sont disponibles (anglais, français, allemand, arabe), avec un support complet de la mise en page de droite à gauche pour l'arabe. La sélection de langue passe par un paramètre d'URL avec repli sur `localStorage`, et le contenu change sans rechargement de page. Chaque chaîne visible — descriptions de projets, catégories de compétences, textes de contact — est localisée, et chaque locale dispose de son propre markdown détaillé pour les fiches projet.

**État et rendu** : L'état global est découpé par responsabilité en trois contextes React (`LanguageContext`, `PortfolioDataContext`, `ThemeProvider`) plutôt qu'en un store unique. L'interface est composée à partir de primitives Radix avec Tailwind CSS 4, dans un système de design glass morphism, et Motion pour des animations déclenchées au défilement et respectueuses de `prefers-reduced-motion`.

**Pipeline d'icônes technologiques** : Une chaîne de résolution (base64 → URL distante → repli Lucide) alimente les badges technologiques, avec des transitions niveaux de gris vers couleur au survol de la carte. Les anciens tableaux de chaînes restent compatibles avec le nouveau format objet, ce qui permet une migration progressive des fichiers de données.

**Déploiement** : Approche Docker-first, avec une image pré-construite qui contourne le problème de binaire natif `lightningcss` de Tailwind CSS 4. Le conteneur s'exécute sous un utilisateur non-root, avec health checks et limites de ressources.

**Stack**

| Couche | Choix |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Langage | TypeScript 5, mode strict |
| Style | Tailwind CSS 4, Radix UI, Motion |
| Contenu | JSON + Markdown sur le système de fichiers, servis via routes API |
| Déploiement | Docker, Docker Compose |

**Statut** : Le portfolio, le système multilingue et la vitrine de projets sont en production. La couche IA conversationnelle est le chantier en cours — l'interface est livrée derrière une boîte de dialogue « en cours de développement » pendant que le backend de recherche et d'ancrage est construit.

Le code source est public sur [github.com/Makros-24/Automedon](https://github.com/Makros-24/Automedon).
