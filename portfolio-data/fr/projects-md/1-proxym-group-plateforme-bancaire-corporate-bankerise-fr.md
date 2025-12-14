## Aperçu du Projet

J'ai travaillé sur **Digital Corporate Banking**, une plateforme multi-tenant permettant aux institutions financières africaines d'offrir des services bancaires d'entreprise entièrement digitaux. Durant mes 2 ans en tant que **Senior Backend Developer et Technical Lead**, j'ai pris en charge les décisions d'architecture après le départ de notre architecte original, servant d'architecte de facto tout en maintenant ma polyvalence sur l'ensemble de la stack technique—gardant le projet sur la bonne voie grâce à une adaptation agile aux défis évolutifs.

La plateforme dessert plusieurs institutions financières à travers l'Afrique de l'Ouest, y compris des banques commerciales et des autorités bancaires centrales. La proposition de valeur principale du produit est la **configurabilité sans modifications de code**—chaque banque cliente peut définir ses propres hiérarchies d'approbation, règles de transaction et workflows opérationnels via la configuration plutôt que le développement personnalisé.

<p align="center">
  <img src="/portfolio-data/diagrams/Hexagonal-architecture.drawio.svg" alt="Corporate Banking System Architecture - Hexagonal architecture layers, aggregate boundaries, Sopra integration adapters, CQRS event flow" />
</p>

## Le Défi Technique

Les plateformes bancaires d'entreprise traditionnelles reposaient sur des workflows rigides et codés en dur qui ne pouvaient pas s'adapter à différentes structures organisationnelles sans développement personnalisé. Le défi principal était de construire un **moteur piloté par des règles** où la logique métier est de la donnée, pas du code—permettant une configurabilité multi-tenant sans codebases par client.

Nous avons architecturé une plateforme où **les règles configurables pilotent le comportement du système**. Le rule engine évalue les workflows d'approbation dynamiques basés sur les attributs des transactions, appliquant des chaînes de validation multi-niveaux configurées par tenant. Cette approche architecturale a éliminé les cycles de développement par client et réduit le time-to-market de plusieurs mois à quelques semaines.

**Réalisation Technique Clé** : Un DSL (Domain-Specific Language) basé sur des formules qui permet aux non-développeurs de configurer une logique d'approbation complexe via des règles pilotées par les données plutôt que des modifications de code.

## Stack Technique & Justification

**Backend** : Java 17 avec Spring Boot 3.4
- Java 17 choisi pour la stabilité LTS et les virtual threads (gains de performance sans complexité)
- Spring Boot 3.4 pour l'écosystème mature et l'observabilité intégrée (Actuator, Micrometer)
- Architecture DDD pragmatique sans sur-ingénierie de l'event sourcing (pattern CQRS pour la séparation lecture/écriture)

**Frontend** : React 18 avec design systems pour les interfaces client/agent, JSF pour le backoffice
- React avec design systems a assuré une UI/UX cohérente à travers les modules et accéléré le développement de fonctionnalités
- JSF adapté à nos besoins backoffice (développement CRUD rapide, familier à l'équipe)
- J'ai contribué aux deux : dirigé le développement backoffice JSF, corrigé des bugs critiques dans les services React

**Data** : Oracle/PostgreSQL (dépendant du client), Elasticsearch pour les audit trails
- Bases de données relationnelles pour l'intégrité transactionnelle (comptes multi-devises, transferts, approbations)
- Elasticsearch fournit des logs d'audit immuables pour la conformité réglementaire—chaque action horodatée et recherchable

**Infrastructure** : Kubernetes on-premise pour le déploiement interne avec GitLab CI/CD
- L'infrastructure interne de l'entreprise fonctionne sur Kubernetes on-premise
- Le modèle de déploiement multi-tenant permet des instances isolées par banque cliente
- J'ai collaboré avec DevOps pour concevoir le pipeline (plus de détails ci-dessous)

**Plateforme Partagée** : Stack Proxym interne fournissant API Gateway, Keycloak (identity), services communs
- Évité de réinventer l'auth, la gestion des utilisateurs, le support multi-langue
- Nous a permis de nous concentrer sur la logique du domaine bancaire au lieu de la plomberie infrastructure

## Architecture : DDD Pragmatique avec Design Hexagonal

Nous avons organisé le codebase autour de **contextes de domaine** avec des frontières claires :

**Core Domains** :
- **Companies & Workspaces** : Fondation multi-tenant. Les utilisateurs peuvent appartenir à plusieurs entreprises et changer de workspaces dans une seule session de connexion
- **Transaction Rules Engine** : Formules définissant les exigences d'initiation/validation basées sur les seuils de montant, types de compte et types de service (je détaillerai ceci ci-dessous—c'est le cœur du système)
- **Transaction Workflows** : State machine que j'ai conçue orchestrant les initiations, validations, rejets du côté corporate et bank-agent
- **Services & Permissions** : Spring `@PreAuthorize` sécurise les endpoints basés sur les affectations de services au niveau loginAccount. Les départements définissent quels services un login account est éligible à recevoir
- **Bundles** : Packages de services avec différentes gammes de prix basées sur le tier d'abonnement de l'entreprise avec la banque

**Feature Domains** :
- **Beneficiaries** : Gestion des bénéficiaires locaux et internationaux avec intégration de workflow
- **Transfers** : Transferts standard, permanents, basés sur fichiers et par lots—tous pilotés par workflow
- **Checkbooks, Cards, Credit Simulations, Credit Requests** : Chacun exploite le même workflow engine
- **Reference Data** : Banques, branches, devises, pays pour la localisation

**Hexagonal Architecture** :
- **Domain Core** : Logique métier pure, aucune dépendance d'infrastructure
- **Ports** : Interfaces définissant les contrats (ex., `CoreBankingPort` pour les opérations de compte)
- **Adapters** : Implémentations spécifiques CBS (Sopra Banking, Temenos T24)

Cette séparation s'est avérée critique lors de l'intégration de systèmes bancaires centraux hétérogènes (plus ci-dessous).

**Pattern CQRS** :
- Les Commands modifient l'état via des aggregates (créer un transfert, approuver une transaction)
- Les Queries atteignent des modèles de lecture optimisés (vues de dashboard, historiques de transactions)
- Pas d'event sourcing—maintenu simple avec des transactions de base de données et des audit trails Elasticsearch

![CQRS Flow - Command/Query separation, write model aggregates, read model projections](/portfolio-data/diagrams/DDD-arch.drawio.svg)

### Détails d'Implémentation de l'Architecture

**Aggregate Design Patterns** :
- **Transaction Aggregate** : L'entité racine applique les invariants (suffisance de solde, quorum d'approbation)
- **Workspace Aggregate** : Encapsule la logique multi-tenancy et le contrôle d'accès
- Les Aggregates communiquent via des domain events (Spring ApplicationEventPublisher)
- Pas de références directes entre aggregates—seulement par ID pour maintenir les frontières

**Domain Events & Event Handling** :
- Domain events publiés dans la limite transactionnelle utilisant `@TransactionalEventListener(phase = BEFORE_COMMIT)`
- Les event handlers mettent à jour les read models, envoient des notifications, invalident les caches
- Events stockés dans Elasticsearch pour audit trail et requêtes temporelles
- Mécanisme de retry pour les event handlers en échec (Spring Retry avec exponential backoff)

**Transaction Boundary Management** :
- `@Transactional` au niveau service, pas au niveau repository (transactions à gros grain)
- Pessimistic locking pour les mises à jour de solde de compte afin de prévenir les race conditions
- Optimistic locking (`@Version`) pour la plupart des autres aggregates
- Transaction distribuée évitée—cohérence éventuelle via propagation d'événements asynchrones

**Design Patterns Appliqués** :
- **Strategy Pattern** : Rule matchers, sélection d'adapter CBS
- **Template Method** : Phases de workflow (precheck → initiate → validate → execute)
- **Factory Pattern** : Création de contexte de transaction (Single/Bulk/Batch)
- **Builder Pattern** : Construction d'aggregate complexe (TransactionBuilder, RuleBuilder)
- **Anti-Corruption Layer** : Les adapters CBS mappent les modèles externes aux aggregates de domaine

## L'Innovation Centrale : Transaction Rules + Workflows

C'était la fonctionnalité dont je suis le plus fier d'avoir conçue et implémentée (après guidance initiale de notre architecte avant son départ).

### Transaction Rules : Formula Parser & Evaluation Engine

**Implémentation Technique** du moteur de règles configurable que j'ai conçu :

**Formula DSL Architecture** :
- Construit un Domain-Specific Language personnalisé pour les formules d'approbation stockées comme strings dans la base de données
- **Lexer** tokenise les strings de formule en opérateurs (`×`, `+`, `OR`, `AND`), opérandes (identifiants de rôle) et parenthèses
- **Recursive descent parser** construit un Abstract Syntax Tree (AST) à partir des tokens
- **Evaluator** parcourt l'AST au runtime, résolvant les identifiants de rôle par rapport au contexte utilisateur
- ASTs parsés mis en cache en mémoire (Caffeine cache) pour éviter de re-parser à chaque transaction

**Rule Evaluation Flow** :
```java
// Pseudocode simplifié
RuleEngine {
  evaluateFormula(String formula, UserContext context) {
    AST tree = parseAndCache(formula); // Cache hit ~95% des requêtes
    return tree.evaluate(context);     // Parcourt les nœuds, vérifie l'appartenance aux rôles
  }
}
```

**Rule Matching Strategy** :
- Chaque type de service a plusieurs règles avec des conditions de prédicat (plages de montants, types de compte)
- **Strategy Pattern** : Différents rule matchers pour les règles basées sur le montant, le type de compte, spécifiques au service
- Requête de base de données avec prédicats indexés sélectionne les règles correspondantes efficacement
- Règles évaluées par ordre de priorité jusqu'à la première correspondance

**Optimisations de Performance** :
- Formules pré-parsées mises en cache pour éviter le surcoût de parsing
- Prédicats de règles indexés pour une récupération rapide en base de données
- Évaluation par lots pour les contextes de transactions en masse (des centaines de transactions évaluées en un seul passage)

Cette architecture a complètement éliminé la logique d'approbation codée en dur—les nouveaux clients s'intègrent en configurant les données de règles, pas en déployant du code.

### Transaction Workflows : Orchestration Corporate + Bank-Agent

J'ai conçu cette state machine pour gérer trois contextes de transaction :

1. **Single Context** : Une transaction, chaîne d'approbation simple
2. **Bulk Context** : Plusieurs transactions avec sous-validations (ex., approuver 8 sur 10, rejeter 2)
3. **Batch Context** : Uploads de fichiers avec des centaines de transferts traités de manière atomique

**PreChecks & Verifications** :
Avant l'initiation du workflow, le système exécute des validations complètes :
- Vérification du solde du compte (vérification de fonds suffisants)
- Validation des paramètres de segment (limites de transaction, devises autorisées)
- Règles de routage intelligent qui redirigent les contextes vers les bank agents au lieu de bloquer les utilisateurs
- Vérifications de conformité aux règles métier

**Côté Corporate** : 
- Workflow engine personnalisé que j'ai construit gère initiation → validation → completion
- Supporte les approbations partielles, rejets avec commentaires, délégation

**Côté Bank-Agent** : 
- Intégré **Flowable** (moteur de workflow BPMN) pour les validations bancaires multi-étapes complexes
- Approbation à un ou plusieurs niveaux selon les politiques bancaires
- Les bank agents peuvent valider, rejeter ou renvoyer pour corrections

## Couche d'Intégration : Implémentation CBS Adapter

Le corporate banking nécessite une intégration étroite avec les Core Banking Systems (CBS). Nous avons intégré plusieurs plateformes CBS avec une complexité technique variable :

**Sopra Banking Platform Integration** (SOAP/XML) :

*XML Schema Validation* :
- Annotations JAXB `@XmlRootElement` sur les modèles de domaine pour marshaling/unmarshaling
- Schémas XSD validés par rapport au XML entrant/sortant utilisant `SchemaFactory`
- Adapters JAXB personnalisés pour le formatage date/heure (ISO 8601 vs formats spécifiques CBS)

*Retry & Resilience* :
- Spring Retry (`@Retryable`) avec exponential backoff (initial 1s, max 30s, multiplicateur 2x)
- Pattern Circuit breaker utilisant Resilience4j (ouvert après 5 échecs, semi-ouvert après 60s)
- Mécanisme de fallback : Mise en file d'attente des requêtes échouées pour retry manuel via interface admin

*Error Mapping Strategy* :
- Faults SOAP CBS mappés aux exceptions de domaine via `SoapFaultMapper` personnalisé
- Table de traduction de codes d'erreur (codes d'erreur CBS → types d'erreur de domaine)
- Enrichissement d'erreur contextuel (inclure ID de transaction, numéro de compte dans l'exception)

*Connection Management* :
- Apache CXF `HTTPConduit` avec connection pooling (max 20 connexions par instance CBS)
- Read timeout : 30s, connection timeout : 10s
- Keep-alive activé pour réutiliser les connexions TCP

**Temenos T24 Integration** (REST/JSON) :

*RestTemplate Configuration* :
- `RestTemplate` personnalisé avec `ClientHttpRequestInterceptor` pour l'injection de token d'auth
- Connection pooling via `HttpComponentsClientHttpRequestFactory`
- Désérialisation JSON avec Jackson `ObjectMapper` (snake_case → camelCase)

*Rate Limiting* :
- Rate limiter côté client (Guava RateLimiter) pour respecter les limites API CBS (100 req/min)
- Mise en file d'attente des requêtes lors de l'approche de la limite

**Anti-Corruption Layer** :
- Pattern Adapter isole les modèles CBS des modèles de domaine
- Couche de mapping (`CBSAccountMapper`, `CBSTransactionMapper`) convertit entre représentations externes et internes
- Les domain events n'exposent jamais les structures de données spécifiques CBS

**Leçon Clé** : L'abstraction `CoreBankingPort` nous a permis de changer d'implémentation CBS en milieu de projet sans refactoriser la logique de domaine. Quand un client a demandé un vendor différent, nous avons implémenté un nouvel adapter en ~2 semaines vs plusieurs mois de modifications à l'échelle du système.

## Implémentations de Fonctionnalités Techniques

**Multi-Workspace Isolation** :
- Contexte tenant géré via intercepteur Spring AOP + propagation ThreadLocal
- Annotations Hibernate `@Filter` appliquent la sécurité au niveau des lignes au niveau ORM
- Changement de workspace implémenté sans invalidation de session (swap de contexte uniquement)
- L'évaluation des permissions utilise Spring Security `@PreAuthorize` avec expressions SpEL référençant les autorités scopées au workspace

**Workflow Engine Reusability** :
- Une seule abstraction de workflow engine supporte plusieurs types de transactions (transferts, demandes de carte, demandes de crédit)
- Pattern Template Method pour les phases de workflow communes (initiation → validation → execution)
- Gestion de contexte de transaction polymorphe (Single, Bulk, Batch) avec différentes règles de transition d'état

**Batch Processing Pipeline** :
- Upload CSV → parsing Apache Commons CSV → pipeline de validation → insertion en lot dans la base de données
- Traitement basé sur des chunks avec framework Spring Batch (chunks de 100 transactions)
- Rollback transactionnel par chunk (tout-ou-rien dans le chunk, succès partiel entre chunks)
- Traitement asynchrone avec suivi de progression (notifications WebSocket vers frontend)

## Performance & Scalabilité

**Multi-Tenancy Data Isolation** :
- Approche de schéma partagé avec colonne discriminateur de tenant (`workspace_id`)
- Sécurité au niveau des lignes appliquée via annotations Hibernate `@FilterDef` et `@Filter`
- Contexte tenant injecté via advice Spring AOP `@Before` sur la couche service
- ThreadLocal stocke le contexte workspace actuel, propagé à travers les appels async via `TaskDecorator`
- Connection pooling par tenant évité (pool HikariCP partagé avec dimensionnement dynamique)

**Caching Strategy** :
- **L1 Cache** : Cache de session Hibernate (automatique, par transaction)
- **L2 Cache** : Redis pour le caching d'entités distribué entre instances
  - Abstraction Spring Cache (`@Cacheable`, `@CacheEvict`, `@CachePut`)
  - Caching au niveau entité pour les données de référence immuables (devises, pays, banques)
  - Caching des résultats de requête pour les agrégations de dashboard (TTL : 5 minutes)
- **Cache Invalidation** : Les domain events déclenchent `@CacheEvict` sur les régions de cache pertinentes
- **Cache Key Strategy** : `workspace_id + entity_id` pour prévenir la pollution de cache inter-tenant

**Concurrency Control** :
- **Optimistic Locking** : Annotation `@Version` sur la plupart des aggregates (Transaction, Workspace)
- **Pessimistic Locking** : `@Lock(PESSIMISTIC_WRITE)` pour les mises à jour de solde de compte pour prévenir le double-spend
- **Distributed Locks** : Locks basés sur Redis (Redisson) pour la coordination inter-instances (ex., exécution de batch job)
- **Retry Logic** : Spring Retry avec exponential backoff pour `OptimisticLockException`

**Database Optimization** :
- Colonnes indexées : `workspace_id`, `transaction_status`, `created_at`, `amount` (pour les requêtes de plage)
- Index composites pour les patterns de requête courants (`workspace_id + status + created_at`)
- Prévention des requêtes N+1 via `@EntityGraph` pour eager fetching d'associations spécifiques
- Batch fetching activé (`hibernate.default_batch_fetch_size=20`)
- Requêtes read-only marquées avec `@Transactional(readOnly = true)` pour l'optimisation

**Horizontal Scaling** :
- Les services stateless permettent le horizontal pod autoscaling (HPA) dans Kubernetes
- Données de session stockées dans Redis (pas en mémoire) pour le load balancing sans sticky-session
- Traitement de jobs async via message queue (futur : Kafka/RabbitMQ) pour les tâches de background

## Data Modeling & Persistence

**JPA Entity Design** :
- **Single Table Inheritance** pour les types de transaction (Transfer, CardRequest, CreditRequest)
  - `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`
  - `@DiscriminatorColumn(name = "transaction_type")`
- **Embedded Value Objects** : `@Embeddable` pour Money (montant + devise), Address
- **Bi-directional Associations** : `@JsonIgnore` du côté inverse pour prévenir les cycles de sérialisation
- **Lazy Loading Strategy** : `LAZY` par défaut pour les collections, `EAGER` uniquement pour les chemins critiques avec `@EntityGraph`

**Schema Evolution** :
- **Liquibase** pour la gestion des changements de base de données
- Changesets basés sur XML organisés par release (`db/changelog/v1.0.0/`, `v1.1.0/`)
- Migration automatisée au démarrage de l'application (`liquibase.enabled=true`)
- Scripts de rollback pour les migrations critiques (ex., suppressions de colonnes, changements de type)
- Changesets séparés pour développement (données de test) vs production (DDL uniquement)

**Audit Trail Implementation** :
- Intercepteur d'audit personnalisé via `@EntityListeners(AuditListener.class)`
- `AuditListener` capture les changements d'entité (created_by, created_at, modified_by, modified_at)
- Indexation asynchrone vers Elasticsearch pour recherche full-text et requêtes temporelles
- Enregistrements d'audit immuables (insertion uniquement, pas de mises à jour/suppressions)
- Partitionnement de la table d'audit par mois pour la performance des requêtes

**Transaction Management** :
- `@Transactional` au niveau service (transactions à gros grain)
- Propagation.REQUIRES_NEW pour la journalisation d'audit (transaction indépendante)
- Isolation.READ_COMMITTED pour la plupart des opérations (prévient les dirty reads)
- Isolation.SERIALIZABLE pour les opérations financières critiques (mises à jour de solde de compte)

## CI/CD & Quality Gates

J'ai collaboré avec DevOps pour concevoir un **pipeline monorepo** avec détection de changements intelligente et exécution parallèle :

**Structure du Pipeline GitLab CI/CD** :

*Build Stage* :
- **Conditional Builds** : L'analyse git diff détermine les modules modifiés (backend, customer-frontend, agent-frontend, backoffice)
- **Parallel Jobs** : Chaque module build indépendamment (Maven pour backend, npm pour frontends)
- **Build Caching** : Dépendances Maven mises en cache entre les exécutions de pipeline (~70% de builds plus rapides)
- **Docker Multi-Stage Builds** : Images de build et runtime séparées pour des artifacts de production plus petits

*Analysis Stage* :
- **SonarQube** : Analyse statique avec quality gates (80% de couverture de code, 0 issues bloquantes, < 3% de duplication de code)
- **PMD** : Règles de qualité de code Java (métriques de complexité, imports inutilisés, bonnes pratiques)
- **OWASP Dependency Check** : Scanne les dépendances vulnérables (échoue le build sur CVEs high/critical)
- **Security Hotspot Analysis** : Revue manuelle requise pour les patterns de sécurité détectés

*Test Stage* :
- **Unit Tests** : JUnit 5 + Mockito (cible : 80% de couverture, appliqué par Jacoco)
- **Integration Tests** : Testcontainers lance des conteneurs Postgres + Elasticsearch + Redis
  - État de base de données réinitialisé entre tests via rollback Liquibase
  - Profils spécifiques aux tests (`application-test.yml`)
- **Contract Tests** (futur) : Pact pour les contrats API frontend-backend

*Publish Stage* :
- **Artifact Publishing** : Repository Nexus pour les artifacts Maven (snapshot vs release basé sur la branche)
- **Docker Image Build** : Images multi-arch (amd64, arm64) poussées vers GitLab Container Registry
- **Image Tagging Strategy** :
  - `latest` pour la branche main
  - `${GIT_COMMIT_SHA}` pour la traçabilité
  - `${VERSION}-${BRANCH_NAME}` pour les feature branches

*Deploy Stage* :
- **Development Environment** : Auto-deploy sur merge vers main (Kubernetes rolling update)
- **QA/Demo Environments** : Déclenchement manuel avec gates d'approbation
- **Deployment Health Checks** : Probes Kubernetes readiness/liveness assurent des déploiements zero-downtime
- **Rollback Strategy** : Version d'image précédente conservée dans le registry pour rollback rapide

**Merge Request Pipeline** :
- **Pre-Merge Validations** :
  - Format Conventional Commits (commitlint)
  - Vérification de qualité de description MR (min 50 caractères, doit référencer une issue)
  - Pas de conflits de merge
  - Toutes discussions résolues
- **Automated Checks** : Build + unit tests + integration tests doivent passer
- **Code Review** : Minimum 1 approbation requise (CODEOWNERS appliqué)

**Environment Promotion Strategy** :
```
Development (auto) → QA (manuel) → Demo (manuel) → UAT (manuel)
```

**Testing Infrastructure** :
- Testcontainers pour les tests d'intégration (base de données isolée par suite de tests)
- Namespace Kubernetes par environnement (dev, qa, demo, uat)
- Secrets gérés via variables GitLab CI/CD (injectées au runtime)

<!-- DIAGRAM: CI/CD Pipeline - Stages, conditional builds, environment promotion -->

## Observability & Security

**Monitoring & Observability** :
- **Spring Actuator** : Indicateurs de santé personnalisés pour la connectivité CBS, disponibilité Redis, pool de connexions base de données
- **Elasticsearch Audit Trail** : Logs d'événements immuables indexés avec ID de transaction, ID utilisateur, ID workspace, timestamp
- **Exception Auditing** : `@ControllerAdvice` personnalisé capture les exceptions avec contexte complet (params de requête, headers, info utilisateur)
- **Metrics** : Intégration Micrometer publiant vers Prometheus (débit de transactions, taux de cache hit, latence CBS)
- **Distributed Tracing** (futur) : OpenTelemetry pour la corrélation de traces inter-services

**Security Implementation** :

*Authentication & Authorization* :
- **Keycloak** comme fournisseur d'identité OAuth2/OIDC (gestion centralisée des utilisateurs)
- **JWT Tokens** : Access tokens avec claims personnalisés (workspace_id, roles, permissions)
- **Spring Security Filter Chain** :
  - `JwtAuthenticationFilter` extrait et valide la signature JWT (RSA256)
  - `WorkspaceContextFilter` peuple ThreadLocal à partir des claims du token
  - Expressions SpEL `@PreAuthorize` pour le contrôle d'accès au niveau méthode

*Role-Based Access Control (RBAC)* :
```java
// Exemples de règles d'autorisation
@PreAuthorize("hasAuthority('PERM_TRANSFER_INITIATE') and #workspaceId == principal.workspaceId")
public void initiateTransfer(Long workspaceId, TransferRequest request)

@PreAuthorize("hasRole('ROLE_ADMIN') or @permissionEvaluator.canAccessTransaction(#transactionId)")
public Transaction getTransaction(Long transactionId)
```

*Data Encryption* :
- **At Rest** : JPA `@Convert` avec `AttributeConverter` pour les champs sensibles (numéros de compte, détails de carte)
- **AES-256-GCM** encryption utilisant Spring Crypto utilities
- **Key Management** : Clés de chiffrement stockées dans les variables d'environnement (préparé pour AWS KMS/Azure Key Vault)
- **In Transit** : TLS 1.3 appliqué pour toutes les communications externes

*Security Headers* :
- Spring Security configuré avec les headers recommandés OWASP
- Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options
- CORS configuré avec allowlist d'origines permises

## Documentation & Knowledge Transfer

Un aspect dont je suis particulièrement fier : **documentation complète**. Sachant que ce serait un produit déployé pour plusieurs clients, j'ai :

- Documenté chaque concept de domaine, état de workflow et option de configuration
- Créé des guides d'onboarding pour les nouveaux développeurs
- Écrit des playbooks d'intégration CBS (particularités Sopra, patterns Temenos)
- Maintenu des architecture decision records (ADRs) pour les choix majeurs

Cela permettra à Proxym d'intégrer de futurs clients avec une friction minimale—les nouvelles équipes peuvent comprendre le système sans connaissances tribales.

## Impact & Réflexion

**Avantage Time-to-Market** : 
Le moteur de règles configurable signifie que les nouveaux clients déploient en **semaines, pas mois**. Pas de développement personnalisé pour les workflows d'approbation—juste de la configuration. Cela positionne Proxym de manière compétitive sur le marché de la digitalisation bancaire africaine.

**Résilience Architecturale** : 
Quand notre architecte est parti, l'architecture hexagonale propre et les bounded contexts nous ont permis de continuer sans refactoring majeur. Les nouveaux développeurs pouvaient travailler sur des fonctionnalités isolées (ex., Cards, Credits) sans casser le core.

**Croissance Personnelle** : 
Passer au rôle d'architecte de facto m'a enseigné l'équilibre entre **pragmatisme et bonnes pratiques**. Nous avons sauté l'event sourcing (trop complexe pour nos besoins), mais gardé CQRS pour l'optimisation lecture/écriture. Nous avons utilisé Flowable uniquement là où nécessaire (workflows bank-agent), pas partout. Une bonne architecture ne consiste pas à utiliser tous les patterns—il s'agit de résoudre des problèmes réels efficacement.

**What's Next** :
Alors que les clients évoluent vers le déploiement en production, nous obtiendrons des données de performance réelles et des retours utilisateurs. Le système est conçu pour scaler horizontalement (services stateless, base de données prête pour le sharding), et je suis confiant qu'il gérera les volumes de transactions des opérations bancaires multi-pays à travers l'Afrique de l'Ouest.
