## Technical Requirements

Agent banking platform for BICICI enabling banking agents to perform account opening and customer management. Core challenges: orchestrating 15+ step account opening process with KYC verification and core banking integration, dynamic form configuration for business users without deployments, and hierarchical role-based access (super agents, agents, supervisors).

<!-- DIAGRAM_PLACEHOLDER: BICICI Agent Platform Architecture - BPMN workflow engine, Formio form builder, agent portal, mobile integration, core banking connectivity -->

## BPMN Workflow Engine

**Flowable BPM** orchestrates account opening process with complex branching logic and error handling.

**Account Opening Workflow Structure**:

1. **Customer Data Entry** (User Task): Agent inputs customer information via dynamic Formio form
2. **Validation Gateway** (Service Task): Check for duplicate customers via Elasticsearch
3. **KYC Verification** (Parallel Gateway):
   - Document upload validation (ID card, proof of address)
   - Facial recognition API integration for identity confirmation
   - Background check integration
4. **Account Type Selection** (User Task): Agent selects product based on customer eligibility
5. **Core Banking Integration** (Service Task): POST account creation to BICICI's core system
6. **Card Issuance** (Service Task): Physical card order with shipping details
7. **Notification** (Service Task): SMS/email confirmation to customer

**Error Handling**: Compensation transactions for service task failures. If core banking integration fails at step 5, compensation handler reverses document storage and releases customer lock. Stuck process monitor Dashboard identifies processes exceeding SLA (>30 minutes), enabling manual intervention.

**Reusable Sub-Processes**: KYC verification extracted as standalone sub-process, reused across account opening, loan application, and card replacement workflows. Error boundary events wrap sub-processes with centralized error handling.

**Monitoring**: Flowable Admin dashboard shows process instances by status (active, completed, failed). Performance metrics tracked: average completion time, failure rate by step, active instances per agent.

<!-- CODE_PLACEHOLDER: BPMN account opening workflow with service tasks, user tasks, gateways, error handling -->

## Dynamic Form System

**Formio Integration** enables business users to modify customer onboarding forms without deployments.

**Form Builder**: Web UI for non-technical users to:
- Drag-drop form components (text inputs, dropdowns, file uploads)
- Define validation rules (regex patterns, required fields, conditional logic)
- Configure multi-language labels (French, Arabic with RTL support)
- Set conditional field visibility (show proof of income only if employment_status = "employed")

**Form Rendering**: Angular frontend fetches form JSON schema from backend, renders dynamically. Backend validates submissions against schema before BPMN workflow progression.

**Version Control**: Form schemas stored with version history. BPMN process instances reference specific form version, preventing breaking changes for in-flight workflows.

## Authentication & Authorization

**Keycloak OAuth2/OIDC** manages authentication with hierarchical role-based access:

**Role Hierarchy**:
- **Super Agent**: All operations, including agent management and reporting
- **Agent**: Customer transactions, account opening (limited to own customers)
- **Supervisor**: Read-only access to all agents' activities, approval authority for high-value transactions

## Search & Performance

**Elasticsearch** indexes agents and customers for fast lookup:
- Full-text search on customer name, ID number, phone
- Geospatial queries for agent location-based assignment
- Aggregations for reporting (customers per agent, account types distribution)

**PostgreSQL** for transactional data with optimistic locking for concurrent account updates.

**Redis** for session storage and caching reference data (product catalogs, fee schedules).

## Technical Challenges

**Workflow Orchestration Complexity**

Challenge: Account opening involves 15+ steps with branching logic (different KYC requirements for minors vs. adults), parallel execution (document verification + background check), and external service dependencies (core banking, SMS gateway).

Solution: Decomposed workflow into reusable sub-processes (KYC, core banking integration, notifications). Error boundary events around sub-processes handle failures with compensation logic. Automatic retry with exponential backoff for transient failures (network timeouts). Dead letter queue for permanent failures requiring manual intervention.

**Form Schema Evolution**

Challenge: Form schema changes break in-flight workflows referencing old schema versions.

Solution: Form schemas versioned in database. BPMN process instances store reference to specific schema version used at workflow start. Form renderer fetches versioned schema, ensuring consistency. New submissions use latest schema version while in-flight workflows complete with original schema.

<!-- SCREENSHOT_PLACEHOLDER: BICICI Agent Portal - dashboard, customer search, account opening form, transaction history -->