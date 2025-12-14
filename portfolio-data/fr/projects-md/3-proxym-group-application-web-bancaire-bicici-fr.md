## Exigences Techniques

Plateforme bancaire d'agents pour BICICI permettant aux agents bancaires d'effectuer l'ouverture de comptes et la gestion des clients. Défis principaux : orchestration du processus d'ouverture de compte en 15+ étapes avec vérification KYC et intégration au core banking, configuration dynamique des formulaires pour les utilisateurs métier sans déploiements, et accès basé sur les rôles hiérarchiques (super agents, agents, superviseurs).

<!-- DIAGRAM_PLACEHOLDER: BICICI Agent Platform Architecture - BPMN workflow engine, Formio form builder, agent portal, mobile integration, core banking connectivity -->

## Moteur de Workflow BPMN

**Flowable BPM** orchestre le processus d'ouverture de compte avec une logique de branchement complexe et la gestion des erreurs.

**Structure du Workflow d'Ouverture de Compte** :

1. **Saisie des Données Client** (User Task) : L'agent saisit les informations client via un formulaire Formio dynamique
2. **Passerelle de Validation** (Service Task) : Vérification des clients en double via Elasticsearch
3. **Vérification KYC** (Parallel Gateway) :
   - Validation du téléchargement de documents (carte d'identité, justificatif de domicile)
   - Intégration API de reconnaissance faciale pour confirmation d'identité
   - Intégration de vérification des antécédents
4. **Sélection du Type de Compte** (User Task) : L'agent sélectionne le produit selon l'éligibilité du client
5. **Intégration Core Banking** (Service Task) : POST de création de compte vers le système core de BICICI
6. **Émission de Carte** (Service Task) : Commande de carte physique avec détails d'expédition
7. **Notification** (Service Task) : Confirmation SMS/email au client

**Gestion des Erreurs** : Transactions de compensation pour les échecs de service tasks. Si l'intégration core banking échoue à l'étape 5, le gestionnaire de compensation annule le stockage des documents et libère le verrou client. Le tableau de bord de surveillance des processus bloqués identifie les processus dépassant le SLA (>30 minutes), permettant une intervention manuelle.

**Sous-Processus Réutilisables** : La vérification KYC est extraite en tant que sous-processus autonome, réutilisée dans les workflows d'ouverture de compte, de demande de prêt et de remplacement de carte. Les événements de frontière d'erreur encapsulent les sous-processus avec une gestion centralisée des erreurs.

**Monitoring** : Le tableau de bord Flowable Admin affiche les instances de processus par statut (actif, terminé, échoué). Métriques de performance suivies : temps de complétion moyen, taux d'échec par étape, instances actives par agent.

<!-- CODE_PLACEHOLDER: BPMN account opening workflow with service tasks, user tasks, gateways, error handling -->

## Système de Formulaires Dynamiques

**Intégration Formio** permet aux utilisateurs métier de modifier les formulaires d'onboarding client sans déploiements.

**Form Builder** : Interface web pour utilisateurs non techniques pour :
- Glisser-déposer des composants de formulaire (champs texte, listes déroulantes, téléchargements de fichiers)
- Définir des règles de validation (patterns regex, champs obligatoires, logique conditionnelle)
- Configurer des labels multilingues (français, arabe avec support RTL)
- Définir la visibilité conditionnelle des champs (afficher le justificatif de revenu uniquement si employment_status = "employed")

**Rendu des Formulaires** : Le frontend Angular récupère le schéma JSON du formulaire depuis le backend, rendu dynamique. Le backend valide les soumissions contre le schéma avant la progression du workflow BPMN.

**Contrôle de Version** : Les schémas de formulaires sont stockés avec un historique de versions. Les instances de processus BPMN référencent une version spécifique du formulaire, empêchant les changements cassants pour les workflows en cours.

## Authentification & Autorisation

**Keycloak OAuth2/OIDC** gère l'authentification avec accès basé sur les rôles hiérarchiques :

**Hiérarchie des Rôles** :
- **Super Agent** : Toutes les opérations, incluant la gestion des agents et le reporting
- **Agent** : Transactions clients, ouverture de compte (limité à ses propres clients)
- **Superviseur** : Accès en lecture seule à toutes les activités des agents, autorité d'approbation pour les transactions de haute valeur

## Recherche & Performance

**Elasticsearch** indexe les agents et clients pour une recherche rapide :
- Recherche en texte intégral sur nom client, numéro d'identité, téléphone
- Requêtes géospatiales pour l'assignation d'agents basée sur la localisation
- Agrégations pour le reporting (clients par agent, distribution des types de comptes)

**PostgreSQL** pour les données transactionnelles avec verrouillage optimiste pour les mises à jour concurrentes de comptes.

**Redis** pour le stockage de sessions et la mise en cache des données de référence (catalogues de produits, barèmes de frais).

## Défis Techniques

**Complexité de l'Orchestration des Workflows**

Défi : L'ouverture de compte implique 15+ étapes avec logique de branchement (exigences KYC différentes pour mineurs vs. adultes), exécution parallèle (vérification de documents + vérification des antécédents), et dépendances de services externes (core banking, passerelle SMS).

Solution : Workflow décomposé en sous-processus réutilisables (KYC, intégration core banking, notifications). Les événements de frontière d'erreur autour des sous-processus gèrent les échecs avec logique de compensation. Réessai automatique avec backoff exponentiel pour les échecs transitoires (timeouts réseau). File d'attente de lettres mortes pour les échecs permanents nécessitant une intervention manuelle.

**Évolution du Schéma de Formulaire**

Défi : Les changements de schéma de formulaire cassent les workflows en cours référençant les anciennes versions de schéma.

Solution : Schémas de formulaires versionnés dans la base de données. Les instances de processus BPMN stockent une référence à la version de schéma spécifique utilisée au démarrage du workflow. Le moteur de rendu de formulaire récupère le schéma versionné, assurant la cohérence. Les nouvelles soumissions utilisent la dernière version de schéma tandis que les workflows en cours se terminent avec le schéma original.

<!-- SCREENSHOT_PLACEHOLDER: BICICI Agent Portal - dashboard, customer search, account opening form, transaction history -->