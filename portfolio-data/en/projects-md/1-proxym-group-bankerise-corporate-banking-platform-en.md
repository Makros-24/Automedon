## Project Overview

I worked on **Digital Corporate Banking**, a multi-tenant platform enabling African financial institutions to offer fully digital corporate banking services. Over my 2-year tenure as **Senior Backend Developer and Technical Lead**, I took ownership of architecture decisions after our original architect departed, serving as the de-facto architect while maintaining my versatility across the full technical stack—keeping the project on track through agile adaptation to evolving challenges.

The platform serves multiple financial institutions across West Africa, including commercial banks and central banking authorities. The product's core value proposition is **configurability without code changes**—each bank client can define their own approval hierarchies, transaction rules, and operational workflows through configuration rather than custom development.

<p align="center">
  <img src="/portfolio-data/diagrams/Hexagonal-architecture.drawio.svg" alt="Corporate Banking System Architecture - Hexagonal architecture layers, aggregate boundaries, Sopra integration adapters, CQRS event flow" />
</p>

## The Technical Challenge

Traditional corporate banking platforms relied on rigid, hardcoded workflows that couldn't adapt to different organizational structures without custom development. The core challenge was building a **rule-driven engine** where business logic is data, not code—enabling multi-tenant configurability without per-client codebases.

We architected a platform where **configurable rules drive system behavior**. The rule engine evaluates dynamic approval workflows based on transaction attributes, applying multi-tier validation chains configured per tenant. This architectural approach eliminated per-client development cycles and reduced time-to-market from months to weeks.

**Key Technical Achievement**: A formula-based DSL (Domain-Specific Language) that allows non-developers to configure complex approval logic through data-driven rules rather than code changes.

## Technical Stack & Rationale

**Backend**: Java 17 with Spring Boot 3.4
- Chose Java 17 for LTS stability and virtual threads (performance gains without complexity)
- Spring Boot 3.4 for mature ecosystem and built-in observability (Actuator, Micrometer)
- Pragmatic DDD architecture without over-engineering event sourcing (CQRS pattern for read/write separation)

**Frontend**: React 18 with design systems for customer/agent interfaces, JSF for backoffice
- React with design systems ensured consistent UI/UX across modules and accelerated feature development
- JSF suited our backoffice needs (rapid CRUD development, familiar to team)
- I contributed to both: led JSF backoffice development, fixed critical bugs in React services

**Data**: Oracle/PostgreSQL (client-dependent), Elasticsearch for audit trails
- Relational databases for transactional integrity (multi-currency accounts, transfers, approvals)
- Elasticsearch provides immutable audit logs for regulatory compliance—every action timestamped and searchable

**Infrastructure**: Kubernetes on-premise for internal deployment with GitLab CI/CD
- Internal company infrastructure runs on-premise Kubernetes
- Multi-tenant deployment model allows isolated instances per bank client
- I collaborated with DevOps to design the pipeline (more on this later)

**Shared Platform**: Internal Proxym stack providing API Gateway, Keycloak (identity), common services
- Avoided reinventing auth, user management, multi-language support
- Let us focus on banking domain logic instead of infrastructure plumbing

## Architecture: Pragmatic DDD with Hexagonal Design

We organized the codebase around **domain contexts** with clear boundaries:

**Core Domains**:
- **Companies & Workspaces**: Multi-tenant foundation. Users can belong to multiple companies and switch workspaces within a single login session
- **Transaction Rules Engine**: Formulas defining initiation/validation requirements based on amount thresholds, account types, and service types (I'll detail this below—it's the heart of the system)
- **Transaction Workflows**: State machine I designed that orchestrates initiations, validations, rejections across corporate and bank-agent sides
- **Services & Permissions**: Spring `@PreAuthorize` secures endpoints based on loginAccount-level service assignments. Departments define what services a login account is eligible to be assigned
- **Bundles**: Packages of services with different price ranges based on the company's subscription tier with the bank

**Feature Domains**:
- **Beneficiaries**: Local and international beneficiary management with workflow integration
- **Transfers**: Standard, permanent, file-based, and batch transfers—all workflow-driven
- **Checkbooks, Cards, Credit Simulations, Credit Requests**: Each leverages the same workflow engine
- **Reference Data**: Banks, branches, currencies, countries for localization

**Hexagonal Architecture**:
- **Domain Core**: Pure business logic, no infrastructure dependencies
- **Ports**: Interfaces defining contracts (e.g., `CoreBankingPort` for account operations)
- **Adapters**: CBS-specific implementations (Sopra Banking, Temenos T24)

This separation proved critical when integrating heterogeneous core banking systems (more below).

**CQRS Pattern**:
- Commands modify state through aggregates (create transfer, approve transaction)
- Queries hit optimized read models (dashboard views, transaction histories)
- No event sourcing—kept it simple with database transactions and Elasticsearch audit trails

![CQRS Flow - Command/Query separation, write model aggregates, read model projections](/portfolio-data/diagrams/DDD-arch.drawio.svg)

### Architecture Implementation Details

**Aggregate Design Patterns**:
- **Transaction Aggregate**: Root entity enforces invariants (balance sufficiency, approval quorum)
- **Workspace Aggregate**: Encapsulates multi-tenancy logic and access control
- Aggregates communicate via domain events (Spring ApplicationEventPublisher)
- No direct aggregate references—only by ID to maintain boundaries

**Domain Events & Event Handling**:
- Domain events published within transaction boundary using `@TransactionalEventListener(phase = BEFORE_COMMIT)`
- Event handlers update read models, send notifications, invalidate caches
- Events stored in Elasticsearch for audit trail and temporal queries
- Retry mechanism for failed event handlers (Spring Retry with exponential backoff)

**Transaction Boundary Management**:
- `@Transactional` at service layer, not repository layer (coarse-grained transactions)
- Pessimistic locking for account balance updates to prevent race conditions
- Optimistic locking (`@Version`) for most other aggregates
- Distributed transaction avoided—eventual consistency via asynchronous event propagation

**Design Patterns Applied**:
- **Strategy Pattern**: Rule matchers, CBS adapter selection
- **Template Method**: Workflow phases (precheck → initiate → validate → execute)
- **Factory Pattern**: Transaction context creation (Single/Bulk/Batch)
- **Builder Pattern**: Complex aggregate construction (TransactionBuilder, RuleBuilder)
- **Anti-Corruption Layer**: CBS adapters map external models to domain aggregates

## The Core Innovation: Transaction Rules + Workflows

This was the feature I'm most proud of designing and implementing (after initial guidance from our architect before his departure).

### Transaction Rules: Formula Parser & Evaluation Engine

**Technical Implementation** of the configurable rule engine I designed:

**Formula DSL Architecture**:
- Built a custom Domain-Specific Language for approval formulas stored as strings in the database
- **Lexer** tokenizes formula strings into operators (`×`, `+`, `OR`, `AND`), operands (role identifiers), and parentheses
- **Recursive descent parser** builds an Abstract Syntax Tree (AST) from tokens
- **Evaluator** traverses the AST at runtime, resolving role identifiers against user context
- Cached parsed ASTs in-memory (Caffeine cache) to avoid re-parsing on every transaction

**Rule Evaluation Flow**:
```java
// Simplified pseudocode
RuleEngine {
  evaluateFormula(String formula, UserContext context) {
    AST tree = parseAndCache(formula); // Cache hit ~95% of requests
    return tree.evaluate(context);     // Traverses nodes, checks role membership
  }
}
```

**Rule Matching Strategy**:
- Each service type has multiple rules with predicate conditions (amount ranges, account types)
- **Strategy Pattern**: Different rule matchers for amount-based, account-type-based, service-specific rules
- Database query with indexed predicates selects matching rules efficiently
- Rules evaluated in priority order until first match

**Performance Optimizations**:
- Pre-parsed formulas cached to avoid parsing overhead
- Indexed rule predicates for fast database retrieval
- Batch evaluation for bulk transaction contexts (hundreds of transactions evaluated in single pass)

This architecture eliminated hardcoded approval logic entirely—new clients onboard by configuring rule data, not deploying code.

### Transaction Workflows: Corporate + Bank-Agent Orchestration

I designed this state machine to handle three transaction contexts:

1. **Single Context**: One transaction, straightforward approval chain
2. **Bulk Context**: Multiple transactions with sub-validations (e.g., approve 8 out of 10, reject 2)
3. **Batch Context**: File uploads with hundreds of transfers processed atomically

**PreChecks & Verifications**:
Before workflow initiation, the system runs comprehensive validations:
- Account balance verification (sufficient funds check)
- Segment parameter validation (transaction limits, allowed currencies)
- Smart routing rules that redirect contexts to bank agents instead of blocking users
- Business rule compliance checks

**Corporate Side**: 
- Custom workflow engine I built handles initiation → validation → completion
- Supports partial approvals, rejections with comments, delegation

**Bank-Agent Side**: 
- Integrated **Flowable** (BPMN workflow engine) for complex multi-step bank validations
- Single or multi-level approval depending on bank policies
- Bank agents can validate, reject, or send back for corrections

## Integration Layer: CBS Adapter Implementation

Corporate banking requires tight integration with Core Banking Systems (CBS). We integrated multiple CBS platforms with varying technical complexity:

**Sopra Banking Platform Integration** (SOAP/XML):

*XML Schema Validation*:
- JAXB `@XmlRootElement` annotations on domain models for marshaling/unmarshaling
- XSD schemas validated against incoming/outgoing XML using `SchemaFactory`
- Custom JAXB adapters for date/time formatting (ISO 8601 vs CBS-specific formats)

*Retry & Resilience*:
- Spring Retry (`@Retryable`) with exponential backoff (initial 1s, max 30s, multiplier 2x)
- Circuit breaker pattern using Resilience4j (open after 5 failures, half-open after 60s)
- Fallback mechanism: Queue failed requests for manual retry via admin interface

*Error Mapping Strategy*:
- CBS SOAP faults mapped to domain exceptions via custom `SoapFaultMapper`
- Error code translation table (CBS error codes → domain error types)
- Contextual error enrichment (include transaction ID, account number in exception)

*Connection Management*:
- Apache CXF `HTTPConduit` with connection pooling (max 20 connections per CBS instance)
- Read timeout: 30s, connection timeout: 10s
- Keep-alive enabled to reuse TCP connections

**Temenos T24 Integration** (REST/JSON):

*RestTemplate Configuration*:
- Custom `RestTemplate` with `ClientHttpRequestInterceptor` for auth token injection
- Connection pooling via `HttpComponentsClientHttpRequestFactory`
- JSON deserialization with Jackson `ObjectMapper` (snake_case → camelCase)

*Rate Limiting*:
- Client-side rate limiter (Guava RateLimiter) to respect CBS API limits (100 req/min)
- Request queuing when approaching limit

**Anti-Corruption Layer**:
- Adapter pattern isolates CBS models from domain models
- Mapping layer (`CBSAccountMapper`, `CBSTransactionMapper`) converts between external and internal representations
- Domain events never expose CBS-specific data structures

**Key Lesson**: The `CoreBankingPort` abstraction let us swap CBS implementations mid-project without refactoring domain logic. When a client requested a different vendor, we implemented a new adapter in ~2 weeks vs. months of system-wide changes.

## Technical Feature Implementations

**Multi-Workspace Isolation**:
- Tenant context managed via Spring AOP interceptor + ThreadLocal propagation
- Hibernate `@Filter` annotations enforce row-level security at ORM level
- Workspace switching implemented without session invalidation (context swap only)
- Permission evaluation uses Spring Security `@PreAuthorize` with SpEL expressions referencing workspace-scoped authorities

**Workflow Engine Reusability**:
- Single workflow engine abstraction supports multiple transaction types (transfers, card requests, credit applications)
- Template Method pattern for common workflow phases (initiation → validation → execution)
- Polymorphic transaction context handling (Single, Bulk, Batch) with different state transition rules

**Batch Processing Pipeline**:
- CSV upload → Apache Commons CSV parsing → validation pipeline → database batch insert
- Chunk-based processing with Spring Batch framework (chunks of 100 transactions)
- Transactional rollback per chunk (all-or-nothing within chunk, partial success across chunks)
- Async processing with progress tracking (WebSocket notifications to frontend)

## Performance & Scalability

**Multi-Tenancy Data Isolation**:
- Shared schema approach with tenant discriminator column (`workspace_id`)
- Row-level security enforced via Hibernate `@FilterDef` and `@Filter` annotations
- Tenant context injected via Spring AOP `@Before` advice on service layer
- ThreadLocal stores current workspace context, propagated through async calls via `TaskDecorator`
- Connection pooling per tenant avoided (shared HikariCP pool with dynamic sizing)

**Caching Strategy**:
- **L1 Cache**: Hibernate session cache (automatic, per-transaction)
- **L2 Cache**: Redis for distributed entity caching across instances
  - Spring Cache abstraction (`@Cacheable`, `@CacheEvict`, `@CachePut`)
  - Entity-level caching for immutable reference data (currencies, countries, banks)
  - Query result caching for dashboard aggregations (TTL: 5 minutes)
- **Cache Invalidation**: Domain events trigger `@CacheEvict` on relevant cache regions
- **Cache Key Strategy**: `workspace_id + entity_id` to prevent cross-tenant cache pollution

**Concurrency Control**:
- **Optimistic Locking**: `@Version` annotation on most aggregates (Transaction, Workspace)
- **Pessimistic Locking**: `@Lock(PESSIMISTIC_WRITE)` for account balance updates to prevent double-spend
- **Distributed Locks**: Redis-based locks (Redisson) for cross-instance coordination (e.g., batch job execution)
- **Retry Logic**: Spring Retry with exponential backoff for `OptimisticLockException`

**Database Optimization**:
- Indexed columns: `workspace_id`, `transaction_status`, `created_at`, `amount` (for range queries)
- Composite indexes for common query patterns (`workspace_id + status + created_at`)
- N+1 query prevention via `@EntityGraph` for eager fetching specific associations
- Batch fetching enabled (`hibernate.default_batch_fetch_size=20`)
- Read-only queries marked with `@Transactional(readOnly = true)` for optimization

**Horizontal Scaling**:
- Stateless services enable horizontal pod autoscaling (HPA) in Kubernetes
- Session data stored in Redis (not in-memory) for sticky-session-free load balancing
- Async job processing via message queue (future: Kafka/RabbitMQ) for background tasks

## Data Modeling & Persistence

**JPA Entity Design**:
- **Single Table Inheritance** for transaction types (Transfer, CardRequest, CreditRequest)
  - `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`
  - `@DiscriminatorColumn(name = "transaction_type")`
- **Embedded Value Objects**: `@Embeddable` for Money (amount + currency), Address
- **Bi-directional Associations**: `@JsonIgnore` on inverse side to prevent serialization cycles
- **Lazy Loading Strategy**: Default `LAZY` for collections, `EAGER` only for critical paths with `@EntityGraph`

**Schema Evolution**:
- **Liquibase** for database change management
- XML-based changesets organized per release (`db/changelog/v1.0.0/`, `v1.1.0/`)
- Automated migration on application startup (`liquibase.enabled=true`)
- Rollback scripts for critical migrations (e.g., column drops, type changes)
- Separate changesets for development (test data) vs. production (DDL only)

**Audit Trail Implementation**:
- Custom audit interceptor via `@EntityListeners(AuditListener.class)`
- `AuditListener` captures entity changes (created_by, created_at, modified_by, modified_at)
- Async indexing to Elasticsearch for full-text search and temporal queries
- Immutable audit records (insert-only, no updates/deletes)
- Audit table partitioning by month for query performance

**Transaction Management**:
- `@Transactional` at service layer (coarse-grained transactions)
- Propagation.REQUIRES_NEW for audit logging (independent transaction)
- Isolation.READ_COMMITTED for most operations (prevents dirty reads)
- Isolation.SERIALIZABLE for critical financial operations (account balance updates)

## CI/CD & Quality Gates

I collaborated with DevOps to design a **monorepo pipeline** with intelligent change detection and parallel execution:

**GitLab CI/CD Pipeline Structure**:

*Build Stage*:
- **Conditional Builds**: Git diff analysis determines changed modules (backend, customer-frontend, agent-frontend, backoffice)
- **Parallel Jobs**: Each module builds independently (Maven for backend, npm for frontends)
- **Build Caching**: Maven dependencies cached across pipeline runs (~70% faster builds)
- **Docker Multi-Stage Builds**: Separate build and runtime images for smaller production artifacts

*Analysis Stage*:
- **SonarQube**: Static analysis with quality gates (80% code coverage, 0 blocker issues, < 3% code duplication)
- **PMD**: Java code quality rules (complexity metrics, unused imports, best practices)
- **OWASP Dependency Check**: Scans for vulnerable dependencies (fails build on high/critical CVEs)
- **Security Hotspot Analysis**: Manual review required for detected security patterns

*Test Stage*:
- **Unit Tests**: JUnit 5 + Mockito (target: 80% coverage, enforced by Jacoco)
- **Integration Tests**: Testcontainers spins up Postgres + Elasticsearch + Redis containers
  - Database state reset between tests via Liquibase rollback
  - Test-specific profiles (`application-test.yml`)
- **Contract Tests** (future): Pact for frontend-backend API contracts

*Publish Stage*:
- **Artifact Publishing**: Nexus repository for Maven artifacts (snapshot vs release based on branch)
- **Docker Image Build**: Multi-arch images (amd64, arm64) pushed to GitLab Container Registry
- **Image Tagging Strategy**:
  - `latest` for main branch
  - `${GIT_COMMIT_SHA}` for traceability
  - `${VERSION}-${BRANCH_NAME}` for feature branches

*Deploy Stage*:
- **Development Environment**: Auto-deploy on merge to main (Kubernetes rolling update)
- **QA/Demo Environments**: Manual trigger with approval gates
- **Deployment Health Checks**: Kubernetes readiness/liveness probes ensure zero-downtime deployments
- **Rollback Strategy**: Previous image version retained in registry for quick rollback

**Merge Request Pipeline**:
- **Pre-Merge Validations**:
  - Conventional Commits format (commitlint)
  - MR description quality check (min 50 characters, must reference issue)
  - No merge conflicts
  - All discussions resolved
- **Automated Checks**: Build + unit tests + integration tests must pass
- **Code Review**: Minimum 1 approval required (CODEOWNERS enforced)

**Environment Promotion Strategy**:
```
Development (auto) → QA (manual) → Demo (manual) → UAT (manual)
```

**Testing Infrastructure**:
- Testcontainers for integration tests (isolated database per test suite)
- Kubernetes namespace per environment (dev, qa, demo, uat)
- Secrets managed via GitLab CI/CD variables (injected at runtime)

<!-- DIAGRAM: CI/CD Pipeline - Stages, conditional builds, environment promotion -->

## Observability & Security

**Monitoring & Observability**:
- **Spring Actuator**: Custom health indicators for CBS connectivity, Redis availability, database connection pool
- **Elasticsearch Audit Trail**: Immutable event logs indexed with transaction ID, user ID, workspace ID, timestamp
- **Exception Auditing**: Custom `@ControllerAdvice` captures exceptions with full context (request params, headers, user info)
- **Metrics**: Micrometer integration publishing to Prometheus (transaction throughput, cache hit rate, CBS latency)
- **Distributed Tracing** (future): OpenTelemetry for cross-service trace correlation

**Security Implementation**:

*Authentication & Authorization*:
- **Keycloak** as OAuth2/OIDC identity provider (centralized user management)
- **JWT Tokens**: Access tokens with custom claims (workspace_id, roles, permissions)
- **Spring Security Filter Chain**:
  - `JwtAuthenticationFilter` extracts and validates JWT signature (RSA256)
  - `WorkspaceContextFilter` populates ThreadLocal from token claims
  - `@PreAuthorize` SpEL expressions for method-level access control

*Role-Based Access Control (RBAC)*:
```java
// Example authorization rules
@PreAuthorize("hasAuthority('PERM_TRANSFER_INITIATE') and #workspaceId == principal.workspaceId")
public void initiateTransfer(Long workspaceId, TransferRequest request)

@PreAuthorize("hasRole('ROLE_ADMIN') or @permissionEvaluator.canAccessTransaction(#transactionId)")
public Transaction getTransaction(Long transactionId)
```

*Data Encryption*:
- **At Rest**: JPA `@Convert` with `AttributeConverter` for sensitive fields (account numbers, card details)
- **AES-256-GCM** encryption using Spring Crypto utilities
- **Key Management**: Encryption keys stored in environment variables (prepared for AWS KMS/Azure Key Vault)
- **In Transit**: TLS 1.3 enforced for all external communications

*Security Headers*:
- Spring Security configured with OWASP recommended headers
- Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options
- CORS configured with allowlist of permitted origins

## Documentation & Knowledge Transfer

One aspect I'm particularly proud of: **comprehensive documentation**. Knowing this would be a product deployed for multiple clients, I:

- Documented every domain concept, workflow state, and configuration option
- Created onboarding guides for new developers
- Wrote CBS integration playbooks (Sopra quirks, Temenos patterns)
- Maintained architecture decision records (ADRs) for major choices

This will allow Proxym to onboard future clients with minimal friction—new teams can understand the system without tribal knowledge.

## Impact & Reflection

**Time-to-Market Advantage**: 
The configurable rule engine means new clients deploy in **weeks, not months**. No custom development for approval workflows—just configuration. This positions Proxym competitively in the African banking digitization market.

**Architectural Resilience**: 
When our architect left, the clean hexagonal architecture and bounded contexts let us continue without major refactoring. New developers could work on isolated features (e.g., Cards, Credits) without breaking the core.

**Personal Growth**: 
Stepping into the de-facto architect role taught me the balance between **pragmatism and best practices**. We skipped event sourcing (too complex for our needs), but kept CQRS for read/write optimization. We used Flowable only where needed (bank-agent workflows), not everywhere. Good architecture isn't about using every pattern—it's about solving real problems efficiently.

**What's Next**:
As clients move toward production deployment, we'll gain real-world performance data and user feedback. The system is designed to scale horizontally (stateless services, database sharding-ready), and I'm confident it will handle the transaction volumes of multi-country banking operations across West Africa.