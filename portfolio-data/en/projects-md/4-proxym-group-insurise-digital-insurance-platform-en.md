## Overview

Digital insurance platform supporting auto, home, and travel insurance products across web and mobile channels. Built with microservices architecture, serving thousands of users for policy quotes, subscriptions, and claims processing.

<!-- DIAGRAM_PLACEHOLDER: Insurise Platform Architecture - Microservices, API gateway, MongoDB documents, PostgreSQL transactions, Redis caching, omnichannel access -->

## Key Contributions

**Quote Management System**
- Designed and developed RESTful APIs for insurance quote lifecycle management (creation, retrieval, conversion to policy)
- Integrated with client's external rating system APIs to fetch premium calculations
- Implemented flexible product engine using JSON schemas in MongoDB to support different insurance types without code changes
- Each product type (auto/home/travel) required unique data models—solved with schema-driven approach that reduced new product launch time from months to weeks

**Contract Subscription Module**
- Led full-stack development of policy subscription feature after MVP release
- Conducted on-site technical requirement gathering at client headquarters, working with their development team and insurance domain experts
- Integrated Tunisie Monétique ClickToPay payment gateway for premium collection and installment scheduling
- Translated complex manual insurance workflows into digital processes, bridging business requirements with technical implementation

**Database Design & Backend Development**
- Designed hybrid database strategy: PostgreSQL for transactional integrity (policies, payments, claims) and MongoDB for document flexibility (contracts, product catalogs)
- Built data models using Hibernate/JPA entities with proper mapping annotations and relationships
- Wrote complex SQL queries and optimized JPA queries for performance
- Implemented BPMN workflows using Flowable for claims processing automation

**Quality & Collaboration**
- Delivered features end-to-end from user stories to production with minimal defects through comprehensive unit testing (JUnit, Mockito)
- Challenged business analysts on functional requirements, identified gaps in specifications, and proposed practical alternatives
- Assisted tech lead with architectural decisions and technical requirement analysis
- Generated reports using Jasper Reports for policy analytics and business insights

## Impact
- Successfully launched MVP to production serving real customers
- Reduced new insurance product onboarding from code-heavy changes to configuration-based approach
- Gained hands-on experience in complex domain modeling and cross-functional collaboration