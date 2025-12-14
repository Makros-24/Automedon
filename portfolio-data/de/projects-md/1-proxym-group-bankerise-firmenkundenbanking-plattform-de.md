## Projektübersicht

Ich habe an **Digital Corporate Banking** gearbeitet, einer Multi-Tenant-Plattform, die afrikanischen Finanzinstitutionen ermöglicht, vollständig digitale Firmenbankdienstleistungen anzubieten. Während meiner 2-jährigen Tätigkeit als **Senior Backend Developer und Technical Lead** übernahm ich die Verantwortung für Architekturentscheidungen, nachdem unser ursprünglicher Architekt das Unternehmen verlassen hatte. Ich fungierte als De-facto-Architekt und behielt dabei meine Vielseitigkeit über den gesamten technischen Stack bei—wodurch das Projekt durch agile Anpassung an sich entwickelnde Herausforderungen auf Kurs gehalten wurde.

Die Plattform bedient mehrere Finanzinstitutionen in Westafrika, darunter Geschäftsbanken und Zentralbanken. Das Kernwertversprechen des Produkts ist **Konfigurierbarkeit ohne Code-Änderungen**—jeder Bankkunde kann seine eigenen Genehmigungshierarchien, Transaktionsregeln und operativen Workflows durch Konfiguration statt durch maßgeschneiderte Entwicklung definieren.

<p align="center">
  <img src="/portfolio-data/diagrams/Hexagonal-architecture.drawio.svg" alt="Corporate Banking System Architecture - Hexagonal architecture layers, aggregate boundaries, Sopra integration adapters, CQRS event flow" />
</p>

## Die technische Herausforderung

Traditionelle Firmenbankplattformen basierten auf starren, fest codierten Workflows, die sich nicht ohne maßgeschneiderte Entwicklung an unterschiedliche Organisationsstrukturen anpassen konnten. Die Kernherausforderung bestand darin, eine **regelbasierte Engine** zu entwickeln, bei der Geschäftslogik Daten und nicht Code ist—was Multi-Tenant-Konfigurierbarkeit ohne kundenspezifische Codebases ermöglicht.

Wir haben eine Plattform entworfen, bei der **konfigurierbare Regeln das Systemverhalten steuern**. Die Rule Engine wertet dynamische Genehmigungs-Workflows basierend auf Transaktionsattributen aus und wendet mehrstufige Validierungsketten an, die pro Tenant konfiguriert werden. Dieser architektonische Ansatz eliminierte kundenspezifische Entwicklungszyklen und reduzierte die Time-to-Market von Monaten auf Wochen.

**Wichtigste technische Errungenschaft**: Eine formelbasierte DSL (Domain-Specific Language), die es Nicht-Entwicklern ermöglicht, komplexe Genehmigungslogik durch datengesteuerte Regeln statt durch Code-Änderungen zu konfigurieren.

## Technischer Stack & Begründung

**Backend**: Java 17 mit Spring Boot 3.4
- Java 17 gewählt für LTS-Stabilität und Virtual Threads (Performance-Gewinne ohne Komplexität)
- Spring Boot 3.4 für ausgereiftes Ökosystem und integrierte Observability (Actuator, Micrometer)
- Pragmatische DDD-Architektur ohne Over-Engineering von Event Sourcing (CQRS-Pattern für Read/Write-Separation)

**Frontend**: React 18 mit Design Systems für Kunden-/Agenten-Interfaces, JSF für Backoffice
- React mit Design Systems gewährleistete konsistente UI/UX über Module hinweg und beschleunigte Feature-Entwicklung
- JSF passte zu unseren Backoffice-Anforderungen (schnelle CRUD-Entwicklung, dem Team vertraut)
- Ich trug zu beiden bei: leitete JSF-Backoffice-Entwicklung, behob kritische Bugs in React-Services

**Data**: Oracle/PostgreSQL (kundenabhängig), Elasticsearch für Audit Trails
- Relationale Datenbanken für Transaktionsintegrität (Multi-Currency-Konten, Transfers, Genehmigungen)
- Elasticsearch liefert unveränderliche Audit Logs für regulatorische Compliance—jede Aktion mit Zeitstempel und durchsuchbar

**Infrastructure**: Kubernetes on-premise für interne Bereitstellung mit GitLab CI/CD
- Interne Unternehmensinfrastruktur läuft auf on-premise Kubernetes
- Multi-Tenant-Deployment-Modell ermöglicht isolierte Instanzen pro Bankkunde
- Ich kollaborierte mit DevOps beim Design der Pipeline (mehr dazu später)

**Shared Platform**: Interne Proxym-Stack mit API Gateway, Keycloak (Identity), gemeinsame Services
- Vermeidung der Neuerfindung von Auth, User Management, Multi-Language-Support
- Ermöglichte uns, uns auf Banking-Domain-Logik statt auf Infrastruktur-Plumbing zu konzentrieren

## Architektur: Pragmatisches DDD mit Hexagonal Design

Wir organisierten die Codebase um **Domain-Kontexte** mit klaren Grenzen:

**Core Domains**:
- **Companies & Workspaces**: Multi-Tenant-Fundament. Benutzer können zu mehreren Unternehmen gehören und Workspaces innerhalb einer einzigen Login-Session wechseln
- **Transaction Rules Engine**: Formeln, die Initiierungs-/Validierungsanforderungen basierend auf Betragsgrenzwerten, Kontotypen und Service-Typen definieren (Ich werde dies unten detaillieren—es ist das Herzstück des Systems)
- **Transaction Workflows**: State Machine, die ich entworfen habe und die Initiierungen, Validierungen, Ablehnungen auf Corporate- und Bank-Agent-Seite orchestriert
- **Services & Permissions**: Spring `@PreAuthorize` sichert Endpoints basierend auf Service-Zuweisungen auf LoginAccount-Ebene. Abteilungen definieren, welche Services ein Login Account zugewiesen bekommen kann
- **Bundles**: Pakete von Services mit unterschiedlichen Preisklassen basierend auf dem Subscription-Tier des Unternehmens bei der Bank

**Feature Domains**:
- **Beneficiaries**: Lokale und internationale Begünstigten-Verwaltung mit Workflow-Integration
- **Transfers**: Standard-, permanente, dateibasierte und Batch-Transfers—alle workflow-gesteuert
- **Checkbooks, Cards, Credit Simulations, Credit Requests**: Jedes nutzt dieselbe Workflow-Engine
- **Reference Data**: Banken, Filialen, Währungen, Länder für Lokalisierung

**Hexagonal Architecture**:
- **Domain Core**: Reine Geschäftslogik, keine Infrastruktur-Abhängigkeiten
- **Ports**: Schnittstellen, die Verträge definieren (z.B. `CoreBankingPort` für Kontooperationen)
- **Adapters**: CBS-spezifische Implementierungen (Sopra Banking, Temenos T24)

Diese Trennung erwies sich als kritisch bei der Integration heterogener Core-Banking-Systeme (mehr unten).

**CQRS Pattern**:
- Commands ändern den State durch Aggregates (Transfer erstellen, Transaktion genehmigen)
- Queries greifen auf optimierte Read Models zu (Dashboard-Views, Transaktionshistorien)
- Kein Event Sourcing—einfach gehalten mit Datenbanktransaktionen und Elasticsearch Audit Trails

![CQRS Flow - Command/Query separation, write model aggregates, read model projections](/portfolio-data/diagrams/DDD-arch.drawio.svg)

### Architektur-Implementierungsdetails

**Aggregate Design Patterns**:
- **Transaction Aggregate**: Root Entity erzwingt Invarianten (Balance-Sufficiency, Approval-Quorum)
- **Workspace Aggregate**: Kapselt Multi-Tenancy-Logik und Access Control
- Aggregates kommunizieren über Domain Events (Spring ApplicationEventPublisher)
- Keine direkten Aggregate-Referenzen—nur per ID zur Wahrung der Grenzen

**Domain Events & Event Handling**:
- Domain Events werden innerhalb der Transaktionsgrenze veröffentlicht mit `@TransactionalEventListener(phase = BEFORE_COMMIT)`
- Event Handler aktualisieren Read Models, senden Benachrichtigungen, invalidieren Caches
- Events in Elasticsearch für Audit Trail und temporale Queries gespeichert
- Retry-Mechanismus für fehlgeschlagene Event Handler (Spring Retry mit Exponential Backoff)

**Transaction Boundary Management**:
- `@Transactional` auf Service-Ebene, nicht Repository-Ebene (grobgranulare Transaktionen)
- Pessimistic Locking für Account-Balance-Updates zur Vermeidung von Race Conditions
- Optimistic Locking (`@Version`) für die meisten anderen Aggregates
- Verteilte Transaktionen vermieden—Eventual Consistency über asynchrone Event-Propagation

**Angewendete Design Patterns**:
- **Strategy Pattern**: Rule Matcher, CBS Adapter-Auswahl
- **Template Method**: Workflow-Phasen (precheck → initiate → validate → execute)
- **Factory Pattern**: Transaction Context-Erstellung (Single/Bulk/Batch)
- **Builder Pattern**: Komplexe Aggregate-Konstruktion (TransactionBuilder, RuleBuilder)
- **Anti-Corruption Layer**: CBS Adapters mappen externe Modelle auf Domain Aggregates

## Die Kerninnovation: Transaction Rules + Workflows

Dies war das Feature, auf dessen Design und Implementierung ich am stolzesten bin (nach anfänglicher Anleitung unseres Architekten vor seinem Weggang).

### Transaction Rules: Formula Parser & Evaluation Engine

**Technische Implementierung** der konfigurierbaren Rule Engine, die ich entworfen habe:

**Formula DSL Architecture**:
- Aufbau einer benutzerdefinierten Domain-Specific Language für Genehmigungs-Formeln, die als Strings in der Datenbank gespeichert werden
- **Lexer** tokenisiert Formel-Strings in Operatoren (`×`, `+`, `OR`, `AND`), Operanden (Rollen-Identifikatoren) und Klammern
- **Recursive Descent Parser** baut einen Abstract Syntax Tree (AST) aus Tokens
- **Evaluator** durchläuft den AST zur Laufzeit und löst Rollen-Identifikatoren gegen User Context auf
- Geparste ASTs im Speicher gecacht (Caffeine Cache), um erneutes Parsing bei jeder Transaktion zu vermeiden

**Rule Evaluation Flow**:
```java
// Vereinfachter Pseudocode
RuleEngine {
  evaluateFormula(String formula, UserContext context) {
    AST tree = parseAndCache(formula); // Cache hit ~95% der Requests
    return tree.evaluate(context);     // Durchläuft Knoten, prüft Rollenmitgliedschaft
  }
}
```

**Rule Matching Strategy**:
- Jeder Service-Typ hat mehrere Regeln mit Prädikat-Bedingungen (Betragsbereiche, Kontotypen)
- **Strategy Pattern**: Verschiedene Rule Matcher für betragsbasierte, kontotypbasierte, service-spezifische Regeln
- Datenbankabfrage mit indizierten Prädikaten wählt passende Regeln effizient aus
- Regeln werden in Prioritätsreihenfolge bis zum ersten Match ausgewertet

**Performance-Optimierungen**:
- Vor-geparste Formeln gecacht, um Parsing-Overhead zu vermeiden
- Indizierte Regel-Prädikate für schnellen Datenbank-Abruf
- Batch-Evaluierung für Bulk-Transaction-Contexts (Hunderte von Transaktionen in einem Durchlauf ausgewertet)

Diese Architektur eliminierte fest codierte Genehmigungs-Logik vollständig—neue Kunden werden durch Konfiguration von Regeldaten onboarded, nicht durch Code-Deployment.

### Transaction Workflows: Corporate + Bank-Agent Orchestrierung

Ich habe diese State Machine entworfen, um drei Transaktionskontexte zu handhaben:

1. **Single Context**: Eine Transaktion, unkomplizierte Genehmigungs-Kette
2. **Bulk Context**: Mehrere Transaktionen mit Sub-Validierungen (z.B. 8 von 10 genehmigen, 2 ablehnen)
3. **Batch Context**: Datei-Uploads mit Hunderten von Transfers, die atomar verarbeitet werden

**PreChecks & Verifications**:
Vor der Workflow-Initiierung führt das System umfassende Validierungen durch:
- Account-Balance-Verifizierung (Sufficient Funds Check)
- Segment-Parameter-Validierung (Transaktionslimits, erlaubte Währungen)
- Smart-Routing-Regeln, die Kontexte zu Bank Agents umleiten, statt Benutzer zu blockieren
- Business-Rule-Compliance-Checks

**Corporate-Seite**: 
- Custom Workflow Engine, die ich gebaut habe, handhabt Initiierung → Validierung → Completion
- Unterstützt partielle Genehmigungen, Ablehnungen mit Kommentaren, Delegation

**Bank-Agent-Seite**: 
- **Flowable** (BPMN Workflow Engine) integriert für komplexe mehrstufige Bank-Validierungen
- Ein- oder mehrstufige Genehmigung abhängig von Bank-Policies
- Bank Agents können validieren, ablehnen oder zur Korrektur zurücksenden

## Integrationsschicht: CBS Adapter-Implementierung

Corporate Banking erfordert enge Integration mit Core Banking Systems (CBS). Wir haben mehrere CBS-Plattformen mit unterschiedlicher technischer Komplexität integriert:

**Sopra Banking Platform Integration** (SOAP/XML):

*XML Schema Validation*:
- JAXB `@XmlRootElement` Annotationen auf Domain Models für Marshaling/Unmarshaling
- XSD-Schemas gegen eingehende/ausgehende XML mit `SchemaFactory` validiert
- Custom JAXB Adapters für Datum/Zeit-Formatierung (ISO 8601 vs. CBS-spezifische Formate)

*Retry & Resilience*:
- Spring Retry (`@Retryable`) mit Exponential Backoff (initial 1s, max 30s, Multiplier 2x)
- Circuit Breaker Pattern mit Resilience4j (offen nach 5 Fehlern, halb-offen nach 60s)
- Fallback-Mechanismus: Fehlgeschlagene Requests für manuellen Retry über Admin-Interface queuen

*Error Mapping Strategy*:
- CBS SOAP Faults auf Domain Exceptions über Custom `SoapFaultMapper` gemappt
- Error-Code-Übersetzungstabelle (CBS Error Codes → Domain Error Types)
- Kontextuelle Error-Anreicherung (Transaction ID, Account Number in Exception einbeziehen)

*Connection Management*:
- Apache CXF `HTTPConduit` mit Connection Pooling (max 20 Verbindungen pro CBS-Instanz)
- Read Timeout: 30s, Connection Timeout: 10s
- Keep-Alive aktiviert zur Wiederverwendung von TCP-Verbindungen

**Temenos T24 Integration** (REST/JSON):

*RestTemplate Configuration*:
- Custom `RestTemplate` mit `ClientHttpRequestInterceptor` für Auth-Token-Injection
- Connection Pooling über `HttpComponentsClientHttpRequestFactory`
- JSON-Deserialisierung mit Jackson `ObjectMapper` (snake_case → camelCase)

*Rate Limiting*:
- Client-seitiger Rate Limiter (Guava RateLimiter) zur Einhaltung von CBS API-Limits (100 req/min)
- Request-Queuing bei Annäherung an Limit

**Anti-Corruption Layer**:
- Adapter Pattern isoliert CBS Models von Domain Models
- Mapping-Layer (`CBSAccountMapper`, `CBSTransactionMapper`) konvertiert zwischen externen und internen Repräsentationen
- Domain Events exponieren nie CBS-spezifische Datenstrukturen

**Key Lesson**: Die `CoreBankingPort`-Abstraktion ermöglichte es uns, CBS-Implementierungen mitten im Projekt zu wechseln, ohne Domain-Logik zu refactoren. Als ein Kunde einen anderen Vendor anforderte, implementierten wir einen neuen Adapter in ~2 Wochen vs. Monaten systemweiter Änderungen.

## Technische Feature-Implementierungen

**Multi-Workspace Isolation**:
- Tenant Context verwaltet über Spring AOP Interceptor + ThreadLocal-Propagation
- Hibernate `@Filter` Annotationen erzwingen Row-Level Security auf ORM-Ebene
- Workspace-Wechsel implementiert ohne Session-Invalidierung (nur Context-Swap)
- Permission-Evaluation nutzt Spring Security `@PreAuthorize` mit SpEL-Ausdrücken, die workspace-scoped Authorities referenzieren

**Workflow Engine Reusability**:
- Single Workflow Engine-Abstraktion unterstützt mehrere Transaktionstypen (Transfers, Kartenanträge, Kreditanträge)
- Template Method Pattern für gemeinsame Workflow-Phasen (Initiierung → Validierung → Ausführung)
- Polymorphes Transaction Context Handling (Single, Bulk, Batch) mit unterschiedlichen State-Transition-Regeln

**Batch Processing Pipeline**:
- CSV-Upload → Apache Commons CSV Parsing → Validation Pipeline → Database Batch Insert
- Chunk-basierte Verarbeitung mit Spring Batch Framework (Chunks von 100 Transaktionen)
- Transaktionales Rollback pro Chunk (All-or-Nothing innerhalb Chunk, partieller Erfolg über Chunks hinweg)
- Async Processing mit Progress Tracking (WebSocket-Benachrichtigungen ans Frontend)

## Performance & Skalierbarkeit

**Multi-Tenancy Data Isolation**:
- Shared Schema-Ansatz mit Tenant-Discriminator-Spalte (`workspace_id`)
- Row-Level Security erzwungen über Hibernate `@FilterDef` und `@Filter` Annotationen
- Tenant Context injiziert über Spring AOP `@Before` Advice auf Service-Layer
- ThreadLocal speichert aktuellen Workspace-Context, propagiert durch Async Calls über `TaskDecorator`
- Connection Pooling pro Tenant vermieden (shared HikariCP Pool mit dynamischer Größenanpassung)

**Caching Strategy**:
- **L1 Cache**: Hibernate Session Cache (automatisch, pro Transaktion)
- **L2 Cache**: Redis für verteiltes Entity-Caching über Instanzen hinweg
  - Spring Cache Abstraction (`@Cacheable`, `@CacheEvict`, `@CachePut`)
  - Entity-Level Caching für unveränderliche Referenzdaten (Währungen, Länder, Banken)
  - Query-Result Caching für Dashboard-Aggregationen (TTL: 5 Minuten)
- **Cache Invalidation**: Domain Events triggern `@CacheEvict` auf relevanten Cache-Regionen
- **Cache Key Strategy**: `workspace_id + entity_id` zur Vermeidung von Cross-Tenant Cache Pollution

**Concurrency Control**:
- **Optimistic Locking**: `@Version` Annotation auf den meisten Aggregates (Transaction, Workspace)
- **Pessimistic Locking**: `@Lock(PESSIMISTIC_WRITE)` für Account-Balance-Updates zur Vermeidung von Double-Spend
- **Distributed Locks**: Redis-basierte Locks (Redisson) für Cross-Instance-Koordination (z.B. Batch Job Execution)
- **Retry Logic**: Spring Retry mit Exponential Backoff für `OptimisticLockException`

**Database Optimization**:
- Indizierte Spalten: `workspace_id`, `transaction_status`, `created_at`, `amount` (für Range Queries)
- Composite Indexes für häufige Query-Patterns (`workspace_id + status + created_at`)
- N+1 Query-Prävention über `@EntityGraph` für Eager Fetching spezifischer Assoziationen
- Batch Fetching aktiviert (`hibernate.default_batch_fetch_size=20`)
- Read-Only Queries markiert mit `@Transactional(readOnly = true)` für Optimierung

**Horizontal Scaling**:
- Stateless Services ermöglichen Horizontal Pod Autoscaling (HPA) in Kubernetes
- Session-Daten in Redis gespeichert (nicht in-memory) für Sticky-Session-freies Load Balancing
- Async Job Processing über Message Queue (Zukunft: Kafka/RabbitMQ) für Background-Tasks

## Data Modeling & Persistence

**JPA Entity Design**:
- **Single Table Inheritance** für Transaction Types (Transfer, CardRequest, CreditRequest)
  - `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`
  - `@DiscriminatorColumn(name = "transaction_type")`
- **Embedded Value Objects**: `@Embeddable` für Money (amount + currency), Address
- **Bi-directional Associations**: `@JsonIgnore` auf inverse Seite zur Vermeidung von Serialisierungs-Zyklen
- **Lazy Loading Strategy**: Default `LAZY` für Collections, `EAGER` nur für kritische Pfade mit `@EntityGraph`

**Schema Evolution**:
- **Liquibase** für Database Change Management
- XML-basierte Changesets organisiert pro Release (`db/changelog/v1.0.0/`, `v1.1.0/`)
- Automatisierte Migration beim Application Startup (`liquibase.enabled=true`)
- Rollback-Scripts für kritische Migrationen (z.B. Column Drops, Type Changes)
- Separate Changesets für Development (Test Data) vs. Production (nur DDL)

**Audit Trail Implementation**:
- Custom Audit Interceptor über `@EntityListeners(AuditListener.class)`
- `AuditListener` erfasst Entity-Änderungen (created_by, created_at, modified_by, modified_at)
- Async Indexing zu Elasticsearch für Full-Text Search und temporale Queries
- Unveränderliche Audit Records (nur Insert, keine Updates/Deletes)
- Audit Table Partitionierung nach Monat für Query-Performance

**Transaction Management**:
- `@Transactional` auf Service-Ebene (grobgranulare Transaktionen)
- Propagation.REQUIRES_NEW für Audit Logging (unabhängige Transaktion)
- Isolation.READ_COMMITTED für die meisten Operationen (verhindert Dirty Reads)
- Isolation.SERIALIZABLE für kritische Finanzoperationen (Account Balance Updates)

## CI/CD & Quality Gates

Ich kollaborierte mit DevOps beim Design einer **Monorepo Pipeline** mit intelligenter Change Detection und paralleler Ausführung:

**GitLab CI/CD Pipeline-Struktur**:

*Build Stage*:
- **Conditional Builds**: Git Diff Analysis bestimmt geänderte Module (Backend, Customer-Frontend, Agent-Frontend, Backoffice)
- **Parallel Jobs**: Jedes Modul baut unabhängig (Maven für Backend, npm für Frontends)
- **Build Caching**: Maven Dependencies über Pipeline Runs gecacht (~70% schnellere Builds)
- **Docker Multi-Stage Builds**: Separate Build- und Runtime-Images für kleinere Production Artifacts

*Analysis Stage*:
- **SonarQube**: Statische Analyse mit Quality Gates (80% Code Coverage, 0 Blocker Issues, < 3% Code Duplication)
- **PMD**: Java Code Quality Rules (Komplexitäts-Metriken, Unused Imports, Best Practices)
- **OWASP Dependency Check**: Scannt nach anfälligen Dependencies (Fails Build bei High/Critical CVEs)
- **Security Hotspot Analysis**: Manuelle Review erforderlich für erkannte Security Patterns

*Test Stage*:
- **Unit Tests**: JUnit 5 + Mockito (Ziel: 80% Coverage, erzwungen durch Jacoco)
- **Integration Tests**: Testcontainers startet Postgres + Elasticsearch + Redis Container
  - Database State Reset zwischen Tests über Liquibase Rollback
  - Test-spezifische Profile (`application-test.yml`)
- **Contract Tests** (Zukunft): Pact für Frontend-Backend API-Verträge

*Publish Stage*:
- **Artifact Publishing**: Nexus Repository für Maven Artifacts (Snapshot vs. Release basierend auf Branch)
- **Docker Image Build**: Multi-Arch Images (amd64, arm64) gepusht zu GitLab Container Registry
- **Image Tagging Strategy**:
  - `latest` für Main Branch
  - `${GIT_COMMIT_SHA}` für Traceability
  - `${VERSION}-${BRANCH_NAME}` für Feature Branches

*Deploy Stage*:
- **Development Environment**: Auto-Deploy bei Merge zu Main (Kubernetes Rolling Update)
- **QA/Demo Environments**: Manueller Trigger mit Approval Gates
- **Deployment Health Checks**: Kubernetes Readiness/Liveness Probes gewährleisten Zero-Downtime Deployments
- **Rollback Strategy**: Vorherige Image-Version im Registry behalten für schnelles Rollback

**Merge Request Pipeline**:
- **Pre-Merge Validations**:
  - Conventional Commits Format (commitlint)
  - MR Description Quality Check (min 50 Zeichen, muss Issue referenzieren)
  - Keine Merge Conflicts
  - Alle Diskussionen gelöst
- **Automated Checks**: Build + Unit Tests + Integration Tests müssen bestehen
- **Code Review**: Minimum 1 Approval erforderlich (CODEOWNERS erzwungen)

**Environment Promotion Strategy**:
```
Development (auto) → QA (manuell) → Demo (manuell) → UAT (manuell)
```

**Testing Infrastructure**:
- Testcontainers für Integration Tests (isolierte Datenbank pro Test Suite)
- Kubernetes Namespace pro Environment (dev, qa, demo, uat)
- Secrets verwaltet über GitLab CI/CD Variables (zur Laufzeit injiziert)

<!-- DIAGRAM: CI/CD Pipeline - Stages, conditional builds, environment promotion -->

## Observability & Security

**Monitoring & Observability**:
- **Spring Actuator**: Custom Health Indicators für CBS-Konnektivität, Redis-Verfügbarkeit, Database Connection Pool
- **Elasticsearch Audit Trail**: Unveränderliche Event Logs indiziert mit Transaction ID, User ID, Workspace ID, Timestamp
- **Exception Auditing**: Custom `@ControllerAdvice` erfasst Exceptions mit vollem Kontext (Request Params, Headers, User Info)
- **Metrics**: Micrometer-Integration publiziert zu Prometheus (Transaction Throughput, Cache Hit Rate, CBS Latency)
- **Distributed Tracing** (Zukunft): OpenTelemetry für Cross-Service Trace Correlation

**Security Implementation**:

*Authentication & Authorization*:
- **Keycloak** als OAuth2/OIDC Identity Provider (zentralisiertes User Management)
- **JWT Tokens**: Access Tokens mit Custom Claims (workspace_id, roles, permissions)
- **Spring Security Filter Chain**:
  - `JwtAuthenticationFilter` extrahiert und validiert JWT-Signatur (RSA256)
  - `WorkspaceContextFilter` populiert ThreadLocal aus Token Claims
  - `@PreAuthorize` SpEL-Ausdrücke für Method-Level Access Control

*Role-Based Access Control (RBAC)*:
```java
// Beispiel-Autorisierungsregeln
@PreAuthorize("hasAuthority('PERM_TRANSFER_INITIATE') and #workspaceId == principal.workspaceId")
public void initiateTransfer(Long workspaceId, TransferRequest request)

@PreAuthorize("hasRole('ROLE_ADMIN') or @permissionEvaluator.canAccessTransaction(#transactionId)")
public Transaction getTransaction(Long transactionId)
```

*Data Encryption*:
- **At Rest**: JPA `@Convert` mit `AttributeConverter` für sensible Felder (Kontonummern, Kartendetails)
- **AES-256-GCM** Encryption mit Spring Crypto Utilities
- **Key Management**: Encryption Keys in Environment Variables gespeichert (vorbereitet für AWS KMS/Azure Key Vault)
- **In Transit**: TLS 1.3 erzwungen für alle externen Kommunikationen

*Security Headers*:
- Spring Security konfiguriert mit OWASP-empfohlenen Headers
- Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options
- CORS konfiguriert mit Allowlist erlaubter Origins

## Dokumentation & Knowledge Transfer

Ein Aspekt, auf den ich besonders stolz bin: **umfassende Dokumentation**. In dem Wissen, dass dies ein Produkt sein würde, das für mehrere Kunden deployed wird, habe ich:

- Jedes Domain-Konzept, jeden Workflow-State und jede Konfigurationsoption dokumentiert
- Onboarding-Guides für neue Entwickler erstellt
- CBS-Integrations-Playbooks geschrieben (Sopra-Eigenheiten, Temenos-Patterns)
- Architecture Decision Records (ADRs) für wichtige Entscheidungen gepflegt

Dies wird Proxym ermöglichen, zukünftige Kunden mit minimaler Reibung zu onboarden—neue Teams können das System ohne Tribal Knowledge verstehen.

## Impact & Reflexion

**Time-to-Market-Vorteil**: 
Die konfigurierbare Rule Engine bedeutet, dass neue Kunden in **Wochen, nicht Monaten** deployen. Keine maßgeschneiderte Entwicklung für Genehmigungs-Workflows—nur Konfiguration. Dies positioniert Proxym wettbewerbsfähig im afrikanischen Banking-Digitalisierungsmarkt.

**Architektonische Resilienz**: 
Als unser Architekt ging, ermöglichten uns die saubere Hexagonal Architecture und Bounded Contexts, ohne größeres Refactoring fortzufahren. Neue Entwickler konnten an isolierten Features arbeiten (z.B. Cards, Credits), ohne den Core zu brechen.

**Persönliches Wachstum**: 
Der Schritt in die De-facto-Architektenrolle lehrte mich die Balance zwischen **Pragmatismus und Best Practices**. Wir übersprangen Event Sourcing (zu komplex für unsere Bedürfnisse), behielten aber CQRS für Read/Write-Optimierung. Wir nutzten Flowable nur wo nötig (Bank-Agent Workflows), nicht überall. Gute Architektur bedeutet nicht, jedes Pattern zu verwenden—es geht darum, echte Probleme effizient zu lösen.

**What's Next**:
Während Kunden zum Production Deployment übergehen, erhalten wir echte Performance-Daten und User-Feedback. Das System ist für horizontales Scaling konzipiert (Stateless Services, Database Sharding-Ready), und ich bin zuversichtlich, dass es die Transaktionsvolumen von Multi-Country-Banking-Operationen in Westafrika bewältigen wird.
