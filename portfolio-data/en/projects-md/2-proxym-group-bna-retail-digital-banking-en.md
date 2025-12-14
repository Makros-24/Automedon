## Subscription Module: Building for Change

I built a generic customer subscription module for a retail digital banking platform. The core challenge was designing a system that could handle multiple customer types—business customers, individual customers, and account owners—each with different validation rules, KYC requirements, and approval workflows. The system needed to stay flexible while maintaining high test coverage without depending on external services.

Drawing on my experience from previous projects, I knew upfront that requirements would evolve. What started as a simple single-type subscription quickly expanded to three distinct types mid-project. Instead of building for the current requirement, I built for change.

## Technical Approach: Design Patterns in Action

I structured the module around several design patterns that worked together to handle complexity:

**Strategy Pattern** formed the backbone. Each subscription type implements a common interface with its own validation logic, KYC requirements, and workflow handling. When a user selects a subscription type, the system loads the right strategy at runtime. No messy conditionals, no sprawling if-else chains. When the third subscription type was requested mid-project, I added it quickly by implementing the interface and registering it in the factory—no changes to the core orchestration code.

**Factory Pattern** handles strategy selection. The SubscriptionStrategyFactory picks the right strategy based on the subscription type from the request. Spring autowires all strategies into the factory, making it easy to add new types without touching the selection logic.

**Adapter Pattern** solved our biggest velocity problem—waiting for external systems. I created adapter interfaces for the KYC service and Core Banking System, then built both mock and real implementations. Mock adapters return predictable responses based on input patterns (like tax numbers starting with "999" triggering rejections) and simulate realistic network delays. This let us achieve high test coverage without any external dependencies—unit tests run in milliseconds instead of waiting on slow external services.

Real adapters integrate with actual systems using RestTemplate for KYC and SOAP for the Core Banking System. They include circuit breakers, retry logic, and proper error handling. When external APIs change, only the adapter implementations need updates—the interface stays stable.

**Decorator Pattern** added the final piece—client-specific customizations. We can wrap base strategies with additional validation or enrichment logic without modifying the generic code. This keeps the module reusable across different client deployments.

## Subscription Flow

The workflow moves through several stages: user selects subscription type, system validates data and runs KYC checks through the adapter, creates a prospect entity asynchronously to avoid blocking the UI, then kicks off a Flowable BPMN process for bank agent approval. Agents review subscriptions in the JSF backoffice and either approve or reject them. On approval, service tasks create the CBS account and provision the Keycloak user. On rejection, customers get notified with clear guidance for resubmission.

KYC rejections are handled immediately—status updates to KYC_REJECTED, notification service sends email/SMS with the reason, and the system allows resubmission with corrected data without restarting the entire flow.

## Testing and CI/CD

I used Mockito to mock external adapters in unit tests, giving us comprehensive coverage without KYC or CBS dependencies. Each strategy is tested independently with predictable mock responses. Integration tests use Testcontainers with PostgreSQL—real database, mock external services.

The GitLab CI/CD pipeline runs Maven Surefire and Failsafe. We exceeded the 80% coverage requirement and hit 85% on the subscription module. SonarQube quality gates enforce minimum thresholds—builds only publish artifacts after passing all tests.

Mock adapters eliminated blocked time waiting for external systems. Fast test execution supported rapid development cycles. The team could work in parallel while external integrations were being finalized.

## Results and Future Work

The pattern combination proved resilient against changing requirements. When that third subscription type came in, it took days instead of the weeks we'd estimated for refactoring a traditional approach. The adapter pattern investment paid off in development velocity—no waiting on external systems, no blocked developers.

The module is ready for deployment to additional clients beyond the initial one. The decorator pattern lets us add client-specific customizations without forking the code.

For future improvements, a rule engine like Drools could replace BPMN for more dynamic approval logic. Event-driven architecture with domain events (SubscriptionApproved, KYCRejected) would enable better decoupled downstream processing. Redis caching is currently underutilized—there's opportunity for performance optimization on frequently accessed configuration data.