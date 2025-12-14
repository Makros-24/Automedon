## Vue d'ensemble
Plateforme d'assurance numérique prenant en charge les produits d'assurance automobile, habitation et voyage sur les canaux web et mobile. Construite avec une architecture microservices, elle sert des milliers d'utilisateurs pour les devis de polices, les souscriptions et le traitement des sinistres.
<!-- DIAGRAM_PLACEHOLDER: Insurise Platform Architecture - Microservices, API gateway, MongoDB documents, PostgreSQL transactions, Redis caching, omnichannel access -->
## Contributions clés
**Système de gestion des devis**
- Conception et développement d'APIs RESTful pour la gestion du cycle de vie des devis d'assurance (création, récupération, conversion en police)
- Intégration avec les APIs externes du système de tarification du client pour récupérer les calculs de primes
- Implémentation d'un moteur de produits flexible utilisant des schémas JSON dans MongoDB pour prendre en charge différents types d'assurance sans modifications de code
- Chaque type de produit (auto/habitation/voyage) nécessitait des modèles de données uniques—résolu avec une approche basée sur les schémas qui a réduit le temps de lancement de nouveaux produits de plusieurs mois à quelques semaines
**Module de souscription de contrats**
- Direction du développement full-stack de la fonctionnalité de souscription de polices après la sortie du MVP
- Réalisation de la collecte des exigences techniques sur site au siège du client, en collaboration avec leur équipe de développement et les experts du domaine de l'assurance
- Intégration de la passerelle de paiement ClickToPay de Tunisie Monétique pour la collecte des primes et la planification des versements
- Traduction de processus d'assurance manuels complexes en processus numériques, établissant un pont entre les exigences métier et l'implémentation technique
**Conception de base de données et développement backend**
- Conception d'une stratégie de base de données hybride : PostgreSQL pour l'intégrité transactionnelle (polices, paiements, sinistres) et MongoDB pour la flexibilité documentaire (contrats, catalogues de produits)
- Construction de modèles de données utilisant des entités Hibernate/JPA avec des annotations de mapping et des relations appropriées
- Rédaction de requêtes SQL complexes et optimisation des requêtes JPA pour les performances
- Implémentation de workflows BPMN utilisant Flowable pour l'automatisation du traitement des sinistres
**Qualité et collaboration**
- Livraison de fonctionnalités de bout en bout, des user stories à la production, avec un minimum de défauts grâce à des tests unitaires complets (JUnit, Mockito)
- Remise en question des analystes métier sur les exigences fonctionnelles, identification des lacunes dans les spécifications et proposition d'alternatives pratiques
- Assistance au tech lead pour les décisions architecturales et l'analyse des exigences techniques
- Génération de rapports utilisant Jasper Reports pour l'analyse des polices et les insights métier
## Impact
- Lancement réussi du MVP en production au service de clients réels
- Réduction de l'intégration de nouveaux produits d'assurance d'une approche nécessitant de nombreuses modifications de code à une approche basée sur la configuration
- Acquisition d'une expérience pratique en modélisation de domaines complexes et en collaboration interfonctionnelle