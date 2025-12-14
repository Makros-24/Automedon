## Technische Anforderungen

Agent-Banking-Plattform für BICICI, die Bankenagenten die Kontoeröffnung und Kundenverwaltung ermöglicht. Hauptherausforderungen: Orchestrierung des Kontoeröffnungsprozesses mit über 15 Schritten inklusive KYC-Verifizierung und Core-Banking-Integration, dynamische Formularkonfiguration für Business-Anwender ohne Deployments, und hierarchische rollenbasierte Zugriffskontrolle (Super-Agenten, Agenten, Supervisoren).

<!-- DIAGRAM_PLACEHOLDER: BICICI Agent Platform Architecture - BPMN workflow engine, Formio form builder, agent portal, mobile integration, core banking connectivity -->

## BPMN Workflow Engine

**Flowable BPM** orchestriert den Kontoeröffnungsprozess mit komplexer Verzweigungslogik und Fehlerbehandlung.

**Struktur des Kontoeröffnungs-Workflows**:

1. **Kundendateneingabe** (User Task): Agent gibt Kundeninformationen über dynamisches Formio-Formular ein
2. **Validierungs-Gateway** (Service Task): Prüfung auf Duplikat-Kunden via Elasticsearch
3. **KYC-Verifizierung** (Parallel Gateway):
   - Validierung des Dokumenten-Uploads (Personalausweis, Adressnachweis)
   - Gesichtserkennungs-API-Integration zur Identitätsbestätigung
   - Background-Check-Integration
4. **Kontotyp-Auswahl** (User Task): Agent wählt Produkt basierend auf Kundenberechtigung aus
5. **Core-Banking-Integration** (Service Task): POST der Kontoerstellung an BICICIs Core-System
6. **Kartenausgabe** (Service Task): Physische Kartenbestellung mit Versanddetails
7. **Benachrichtigung** (Service Task): SMS/E-Mail-Bestätigung an Kunden

**Fehlerbehandlung**: Kompensations-Transaktionen für Service-Task-Fehler. Wenn die Core-Banking-Integration in Schritt 5 fehlschlägt, macht der Kompensations-Handler die Dokumentenspeicherung rückgängig und gibt die Kundensperre frei. Das Dashboard zur Überwachung blockierter Prozesse identifiziert Prozesse, die das SLA überschreiten (>30 Minuten), und ermöglicht manuelle Eingriffe.

**Wiederverwendbare Sub-Prozesse**: KYC-Verifizierung als eigenständiger Sub-Prozess extrahiert, wiederverwendet in Kontoeröffnungs-, Kreditantrags- und Kartenersatz-Workflows. Error-Boundary-Events umschließen Sub-Prozesse mit zentralisierter Fehlerbehandlung.

**Monitoring**: Flowable-Admin-Dashboard zeigt Prozessinstanzen nach Status (aktiv, abgeschlossen, fehlgeschlagen). Verfolgte Performance-Metriken: durchschnittliche Abschlusszeit, Fehlerrate pro Schritt, aktive Instanzen pro Agent.

<!-- CODE_PLACEHOLDER: BPMN account opening workflow with service tasks, user tasks, gateways, error handling -->

## Dynamisches Formularsystem

**Formio-Integration** ermöglicht Business-Anwendern die Modifikation von Kunden-Onboarding-Formularen ohne Deployments.

**Form Builder**: Web-UI für nicht-technische Anwender zum:
- Drag-and-Drop von Formularkomponenten (Texteingaben, Dropdowns, Datei-Uploads)
- Definition von Validierungsregeln (Regex-Patterns, Pflichtfelder, bedingte Logik)
- Konfiguration mehrsprachiger Labels (Französisch, Arabisch mit RTL-Unterstützung)
- Festlegung bedingter Feldsichtbarkeit (Einkommensnachweis nur anzeigen, wenn employment_status = "employed")

**Formular-Rendering**: Angular-Frontend ruft Formular-JSON-Schema vom Backend ab, dynamisches Rendering. Backend validiert Einreichungen gegen Schema vor BPMN-Workflow-Fortschritt.

**Versionskontrolle**: Formular-Schemata werden mit Versionsverlauf gespeichert. BPMN-Prozessinstanzen referenzieren spezifische Formularversion, was Breaking Changes für laufende Workflows verhindert.

## Authentifizierung & Autorisierung

**Keycloak OAuth2/OIDC** verwaltet Authentifizierung mit hierarchischer rollenbasierter Zugriffskontrolle:

**Rollenhierarchie**:
- **Super-Agent**: Alle Operationen, einschließlich Agentenverwaltung und Reporting
- **Agent**: Kundentransaktionen, Kontoeröffnung (beschränkt auf eigene Kunden)
- **Supervisor**: Nur-Lese-Zugriff auf alle Agentenaktivitäten, Genehmigungsbefugnis für hochwertige Transaktionen

## Suche & Performance

**Elasticsearch** indiziert Agenten und Kunden für schnelle Suche:
- Volltextsuche nach Kundenname, ID-Nummer, Telefon
- Geospatiale Abfragen für standortbasierte Agentenzuweisung
- Aggregationen für Reporting (Kunden pro Agent, Verteilung der Kontotypen)

**PostgreSQL** für transaktionale Daten mit optimistischem Locking für gleichzeitige Kontoupdates.

**Redis** für Session-Storage und Caching von Referenzdaten (Produktkataloge, Gebührenpläne).

## Technische Herausforderungen

**Workflow-Orchestrierungs-Komplexität**

Herausforderung: Kontoeröffnung umfasst über 15 Schritte mit Verzweigungslogik (unterschiedliche KYC-Anforderungen für Minderjährige vs. Erwachsene), paralleler Ausführung (Dokumentenverifizierung + Background-Check), und externen Service-Abhängigkeiten (Core-Banking, SMS-Gateway).

Lösung: Workflow in wiederverwendbare Sub-Prozesse zerlegt (KYC, Core-Banking-Integration, Benachrichtigungen). Error-Boundary-Events um Sub-Prozesse behandeln Fehler mit Kompensationslogik. Automatisches Retry mit exponentiellem Backoff für transiente Fehler (Netzwerk-Timeouts). Dead-Letter-Queue für permanente Fehler, die manuellen Eingriff erfordern.

**Formular-Schema-Evolution**

Herausforderung: Formular-Schema-Änderungen brechen laufende Workflows, die auf alte Schema-Versionen verweisen.

Lösung: Formular-Schemata versioniert in Datenbank. BPMN-Prozessinstanzen speichern Referenz auf spezifische Schema-Version, die beim Workflow-Start verwendet wurde. Formular-Renderer ruft versioniertes Schema ab, gewährleistet Konsistenz. Neue Einreichungen verwenden neueste Schema-Version, während laufende Workflows mit ursprünglichem Schema abschließen.

<!-- SCREENSHOT_PLACEHOLDER: BICICI Agent Portal - dashboard, customer search, account opening form, transaction history -->