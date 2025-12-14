## Module d'Abonnement : Construire pour le Changement

J'ai construit un module d'abonnement client générique pour une plateforme bancaire numérique de détail. Le défi principal était de concevoir un système capable de gérer plusieurs types de clients—clients professionnels, clients individuels et titulaires de compte—chacun avec des règles de validation, des exigences KYC et des workflows d'approbation différents. Le système devait rester flexible tout en maintenant une couverture de tests élevée sans dépendre de services externes.

En m'appuyant sur mon expérience de projets précédents, je savais dès le départ que les exigences évolueraient. Ce qui a commencé comme un simple abonnement à type unique s'est rapidement étendu à trois types distincts en cours de projet. Au lieu de construire pour l'exigence actuelle, j'ai construit pour le changement.

## Approche Technique : Les Design Patterns en Action

J'ai structuré le module autour de plusieurs design patterns qui fonctionnent ensemble pour gérer la complexité :

**Strategy Pattern** a formé l'épine dorsale. Chaque type d'abonnement implémente une interface commune avec sa propre logique de validation, ses exigences KYC et sa gestion de workflow. Lorsqu'un utilisateur sélectionne un type d'abonnement, le système charge la bonne stratégie au runtime. Pas de conditionnels désordonnés, pas de chaînes if-else tentaculaires. Lorsque le troisième type d'abonnement a été demandé en cours de projet, je l'ai ajouté rapidement en implémentant l'interface et en l'enregistrant dans la factory—aucune modification du code d'orchestration principal.

**Factory Pattern** gère la sélection de stratégie. Le SubscriptionStrategyFactory choisit la bonne stratégie en fonction du type d'abonnement de la requête. Spring autowire toutes les stratégies dans la factory, ce qui facilite l'ajout de nouveaux types sans toucher à la logique de sélection.

**Adapter Pattern** a résolu notre plus gros problème de vélocité—attendre les systèmes externes. J'ai créé des interfaces adapter pour le service KYC et le Core Banking System, puis j'ai construit des implémentations mock et réelles. Les adapters mock retournent des réponses prévisibles basées sur des patterns d'entrée (comme les numéros fiscaux commençant par "999" déclenchant des rejets) et simulent des délais réseau réalistes. Cela nous a permis d'atteindre une couverture de tests élevée sans aucune dépendance externe—les tests unitaires s'exécutent en millisecondes au lieu d'attendre des services externes lents.

Les adapters réels s'intègrent avec les systèmes réels en utilisant RestTemplate pour KYC et SOAP pour le Core Banking System. Ils incluent des circuit breakers, une logique de retry et une gestion d'erreurs appropriée. Lorsque les APIs externes changent, seules les implémentations adapter nécessitent des mises à jour—l'interface reste stable.

**Decorator Pattern** a ajouté la pièce finale—les personnalisations spécifiques au client. Nous pouvons envelopper les stratégies de base avec une validation ou une logique d'enrichissement supplémentaire sans modifier le code générique. Cela maintient le module réutilisable à travers différents déploiements clients.

## Flux d'Abonnement

Le workflow se déroule en plusieurs étapes : l'utilisateur sélectionne le type d'abonnement, le système valide les données et effectue des vérifications KYC via l'adapter, crée une entité prospect de manière asynchrone pour éviter de bloquer l'UI, puis lance un processus Flowable BPMN pour l'approbation de l'agent bancaire. Les agents examinent les abonnements dans le backoffice JSF et les approuvent ou les rejettent. En cas d'approbation, les service tasks créent le compte CBS et provisionnent l'utilisateur Keycloak. En cas de rejet, les clients sont notifiés avec des instructions claires pour la resoumission.

Les rejets KYC sont traités immédiatement—le statut passe à KYC_REJECTED, le service de notification envoie un email/SMS avec la raison, et le système permet la resoumission avec des données corrigées sans redémarrer tout le flux.

## Tests et CI/CD

J'ai utilisé Mockito pour mocker les adapters externes dans les tests unitaires, nous donnant une couverture complète sans dépendances KYC ou CBS. Chaque stratégie est testée indépendamment avec des réponses mock prévisibles. Les tests d'intégration utilisent Testcontainers avec PostgreSQL—base de données réelle, services externes mockés.

Le pipeline GitLab CI/CD exécute Maven Surefire et Failsafe. Nous avons dépassé l'exigence de couverture de 80% et atteint 85% sur le module d'abonnement. Les quality gates SonarQube imposent des seuils minimums—les builds ne publient les artifacts qu'après avoir passé tous les tests.

Les adapters mock ont éliminé le temps bloqué à attendre les systèmes externes. L'exécution rapide des tests a soutenu des cycles de développement rapides. L'équipe pouvait travailler en parallèle pendant que les intégrations externes étaient finalisées.

## Résultats et Travaux Futurs

La combinaison de patterns s'est avérée résiliente face aux exigences changeantes. Lorsque ce troisième type d'abonnement est arrivé, cela a pris des jours au lieu des semaines que nous avions estimées pour refactoriser une approche traditionnelle. L'investissement dans l'Adapter Pattern a porté ses fruits en termes de vélocité de développement—pas d'attente de systèmes externes, pas de développeurs bloqués.

Le module est prêt pour le déploiement vers des clients supplémentaires au-delà du premier. Le Decorator Pattern nous permet d'ajouter des personnalisations spécifiques au client sans forker le code.

Pour les améliorations futures, un rule engine comme Drools pourrait remplacer BPMN pour une logique d'approbation plus dynamique. Une architecture event-driven avec des domain events (SubscriptionApproved, KYCRejected) permettrait un meilleur traitement décuplé en aval. Le caching Redis est actuellement sous-utilisé—il y a une opportunité d'optimisation des performances sur les données de configuration fréquemment accédées.
