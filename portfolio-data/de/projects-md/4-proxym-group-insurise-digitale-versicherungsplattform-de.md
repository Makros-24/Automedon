## Überblick
Digitale Versicherungsplattform, die Auto-, Hausrat- und Reiseversicherungsprodukte über Web- und Mobile-Kanäle unterstützt. Aufgebaut mit Microservices-Architektur, bedient sie Tausende von Benutzern für Policen-Angebote, Abonnements und Schadensbearbeitung.
<!-- DIAGRAM_PLACEHOLDER: Insurise Platform Architecture - Microservices, API gateway, MongoDB documents, PostgreSQL transactions, Redis caching, omnichannel access -->
## Wesentliche Beiträge
**Angebotsverwaltungssystem**
- Entwurf und Entwicklung von RESTful APIs für das Lifecycle-Management von Versicherungsangeboten (Erstellung, Abruf, Umwandlung in Police)
- Integration mit externen Rating-System-APIs des Kunden zum Abrufen von Prämienberechnungen
- Implementierung einer flexiblen Produkt-Engine unter Verwendung von JSON-Schemas in MongoDB zur Unterstützung verschiedener Versicherungsarten ohne Code-Änderungen
- Jeder Produkttyp (Auto/Hausrat/Reise) erforderte einzigartige Datenmodelle—gelöst mit einem schemabasierten Ansatz, der die Markteinführungszeit neuer Produkte von Monaten auf Wochen reduzierte
**Vertragsabschluss-Modul**
- Leitung der Full-Stack-Entwicklung der Policen-Abonnement-Funktion nach MVP-Veröffentlichung
- Durchführung der technischen Anforderungserhebung vor Ort am Hauptsitz des Kunden, in Zusammenarbeit mit deren Entwicklungsteam und Versicherungsdomänenexperten
- Integration des ClickToPay-Zahlungsgateways von Tunisie Monétique für Prämieneinzug und Ratenzahlungsplanung
- Übersetzung komplexer manueller Versicherungsworkflows in digitale Prozesse, Brückenschlag zwischen Geschäftsanforderungen und technischer Implementierung
**Datenbankdesign und Backend-Entwicklung**
- Entwurf einer hybriden Datenbankstrategie: PostgreSQL für transaktionale Integrität (Policen, Zahlungen, Schadensfälle) und MongoDB für Dokumentenflexibilität (Verträge, Produktkataloge)
- Aufbau von Datenmodellen unter Verwendung von Hibernate/JPA-Entities mit geeigneten Mapping-Annotationen und Beziehungen
- Verfassen komplexer SQL-Abfragen und Optimierung von JPA-Abfragen für Performance
- Implementierung von BPMN-Workflows mit Flowable zur Automatisierung der Schadensbearbeitung
**Qualität und Zusammenarbeit**
- End-to-End-Lieferung von Features von User Stories bis zur Produktion mit minimalen Defekten durch umfassende Unit-Tests (JUnit, Mockito)
- Hinterfragung von Business-Analysten zu funktionalen Anforderungen, Identifizierung von Lücken in Spezifikationen und Vorschlag praktischer Alternativen
- Unterstützung des Tech Leads bei Architekturentscheidungen und technischer Anforderungsanalyse
- Erstellung von Reports mit Jasper Reports für Policen-Analysen und Business-Insights
## Auswirkungen
- Erfolgreicher Launch des MVP in Produktion mit echten Kunden
- Reduzierung des Onboardings neuer Versicherungsprodukte von code-intensiven Änderungen zu einem konfigurationsbasierten Ansatz
- Praktische Erfahrung in komplexer Domänenmodellierung und funktionsübergreifender Zusammenarbeit gewonnen