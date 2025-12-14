## Abonnement-Modul: Entwicklung für Veränderung

Ich habe ein generisches Kundenabonnement-Modul für eine digitale Retail-Banking-Plattform entwickelt. Die zentrale Herausforderung bestand darin, ein System zu entwerfen, das mehrere Kundentypen verarbeiten kann—Geschäftskunden, Privatkunden und Kontoinhaber—jeweils mit unterschiedlichen Validierungsregeln, KYC-Anforderungen und Genehmigungs-Workflows. Das System musste flexibel bleiben und gleichzeitig eine hohe Testabdeckung ohne Abhängigkeit von externen Diensten aufrechterhalten.

Aufgrund meiner Erfahrung aus früheren Projekten wusste ich von Anfang an, dass sich die Anforderungen weiterentwickeln würden. Was als einfaches Single-Type-Abonnement begann, erweiterte sich mitten im Projekt schnell auf drei verschiedene Typen. Anstatt für die aktuellen Anforderungen zu entwickeln, habe ich für Veränderung entwickelt.

## Technischer Ansatz: Design Patterns in Aktion

Ich strukturierte das Modul um mehrere Design Patterns herum, die zusammenarbeiten, um Komplexität zu bewältigen:

**Strategy Pattern** bildete das Rückgrat. Jeder Abonnementtyp implementiert ein gemeinsames Interface mit eigener Validierungslogik, KYC-Anforderungen und Workflow-Handling. Wenn ein Benutzer einen Abonnementtyp auswählt, lädt das System zur Runtime die richtige Strategie. Keine chaotischen Conditionals, keine ausufernden if-else-Ketten. Als mitten im Projekt der dritte Abonnementtyp angefordert wurde, fügte ich ihn schnell hinzu, indem ich das Interface implementierte und es in der Factory registrierte—keine Änderungen am Core-Orchestration-Code.

**Factory Pattern** übernimmt die Strategieauswahl. Die SubscriptionStrategyFactory wählt die richtige Strategie basierend auf dem Abonnementtyp aus der Anfrage. Spring autowired alle Strategien in die Factory, was es einfach macht, neue Typen hinzuzufügen, ohne die Auswahllogik anzufassen.

**Adapter Pattern** löste unser größtes Geschwindigkeitsproblem—das Warten auf externe Systeme. Ich erstellte Adapter-Interfaces für den KYC-Service und das Core Banking System und baute dann sowohl Mock- als auch echte Implementierungen. Mock-Adapter geben vorhersehbare Antworten basierend auf Eingabemustern zurück (wie Steuernummern, die mit "999" beginnen und Ablehnungen auslösen) und simulieren realistische Netzwerkverzögerungen. Dies ermöglichte uns, eine hohe Testabdeckung ohne externe Abhängigkeiten zu erreichen—Unit-Tests laufen in Millisekunden, anstatt auf langsame externe Dienste zu warten.

Echte Adapter integrieren sich mit tatsächlichen Systemen unter Verwendung von RestTemplate für KYC und SOAP für das Core Banking System. Sie enthalten Circuit Breakers, Retry-Logik und ordnungsgemäße Fehlerbehandlung. Wenn sich externe APIs ändern, müssen nur die Adapter-Implementierungen aktualisiert werden—das Interface bleibt stabil.

**Decorator Pattern** fügte das letzte Teil hinzu—kundenspezifische Anpassungen. Wir können Basis-Strategien mit zusätzlicher Validierungs- oder Anreicherungslogik umhüllen, ohne den generischen Code zu ändern. Dies hält das Modul über verschiedene Kundenbereitstellungen hinweg wiederverwendbar.

## Abonnement-Flow

Der Workflow durchläuft mehrere Phasen: Benutzer wählt Abonnementtyp aus, System validiert Daten und führt KYC-Prüfungen über den Adapter durch, erstellt asynchron eine Prospect-Entität, um das Blockieren der UI zu vermeiden, startet dann einen Flowable-BPMN-Prozess für die Genehmigung durch den Bankagenten. Agenten überprüfen Abonnements im JSF-Backoffice und genehmigen oder lehnen sie ab. Bei Genehmigung erstellen Service-Tasks das CBS-Konto und provisionieren den Keycloak-Benutzer. Bei Ablehnung werden Kunden mit klaren Anweisungen für die erneute Einreichung benachrichtigt.

KYC-Ablehnungen werden sofort behandelt—Status wird auf KYC_REJECTED aktualisiert, Benachrichtigungsdienst sendet Email/SMS mit dem Grund, und das System erlaubt die erneute Einreichung mit korrigierten Daten, ohne den gesamten Flow neu zu starten.

## Testing und CI/CD

Ich verwendete Mockito, um externe Adapter in Unit-Tests zu mocken, was uns umfassende Abdeckung ohne KYC- oder CBS-Abhängigkeiten ermöglichte. Jede Strategie wird unabhängig mit vorhersehbaren Mock-Antworten getestet. Integrationstests verwenden Testcontainers mit PostgreSQL—echte Datenbank, gemockte externe Dienste.

Die GitLab-CI/CD-Pipeline führt Maven Surefire und Failsafe aus. Wir haben die 80%-Abdeckungsanforderung überschritten und 85% beim Abonnement-Modul erreicht. SonarQube-Quality-Gates erzwingen Mindestschwellenwerte—Builds veröffentlichen Artefakte erst nach Bestehen aller Tests.

Mock-Adapter eliminierten die blockierte Zeit beim Warten auf externe Systeme. Die schnelle Testausführung unterstützte schnelle Entwicklungszyklen. Das Team konnte parallel arbeiten, während externe Integrationen finalisiert wurden.

## Ergebnisse und zukünftige Arbeiten

Die Pattern-Kombination erwies sich als widerstandsfähig gegen sich ändernde Anforderungen. Als dieser dritte Abonnementtyp hereinkam, dauerte es Tage statt der Wochen, die wir für die Refaktorisierung eines traditionellen Ansatzes geschätzt hatten. Die Investition in das Adapter Pattern zahlte sich in der Entwicklungsgeschwindigkeit aus—kein Warten auf externe Systeme, keine blockierten Entwickler.

Das Modul ist bereit für die Bereitstellung bei zusätzlichen Kunden über den ersten hinaus. Das Decorator Pattern ermöglicht es uns, kundenspezifische Anpassungen hinzuzufügen, ohne den Code zu forken.

Für zukünftige Verbesserungen könnte eine Rule Engine wie Drools BPMN für dynamischere Genehmigungslogik ersetzen. Event-Driven Architecture mit Domain Events (SubscriptionApproved, KYCRejected) würde eine bessere entkoppelte Downstream-Verarbeitung ermöglichen. Redis-Caching ist derzeit untergenutzt—es gibt Potenzial für Leistungsoptimierung bei häufig abgerufenen Konfigurationsdaten.