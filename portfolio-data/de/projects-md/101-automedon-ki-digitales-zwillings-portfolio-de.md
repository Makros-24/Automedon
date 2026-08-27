## Automedon - KI-gestütztes digitales Zwillings-Portfolio

**Warum dieses Projekt**: Ein Lebenslauf ist ein statisches Dokument, das nur die Fragen beantwortet, die sein Autor vorhergesehen hat. Recruiter suchen am Ende nach Stichworten, statt zu fragen, was sie wirklich wissen wollen. Automedon dreht das um: ein Portfolio, mit dem man sprechen kann, gestützt auf einen Assistenten, der ausschließlich auf meinem Lebenslauf, meiner Projekthistorie und meiner Berufserfahrung basiert — keine erfundenen Qualifikationen, keine Antworten außerhalb des Quellmaterials.

**Technische Umsetzung**

**Architektur**: Next.js 15 (App Router) mit React 19 und TypeScript im Strict Mode. Die Inhalte liegen vollständig außerhalb des Codes in `portfolio-data/{locale}/portfolio.json` und werden über validierte API-Routen ausgeliefert, statt zur Build-Zeit importiert zu werden. Das Portfolio zu aktualisieren bedeutet, JSON zu bearbeiten und neu zu starten — kein erneutes Deployment der Anwendung.

**Dynamische Locale-Erkennung**: Statt eines fest verdrahteten Union-Typs scannt der Server beim Start `portfolio-data/`, behandelt jedes Unterverzeichnis mit einer `portfolio.json` als Locale und liest eine optionale `locale.json` für nativen Namen, Flagge und RTL-Kennzeichen. Die Ergebnisse werden auf Modulebene zwischengespeichert, das Dateisystem wird also nur einmal durchlaufen. Eine fünfte Sprache hinzuzufügen heißt: ein Verzeichnis und ein Neustart — null Codeänderungen.

**Internationalisierung**: Vier Sprachen sind verfügbar (Englisch, Französisch, Deutsch, Arabisch), inklusive vollständiger Rechts-nach-links-Darstellung für Arabisch. Die Sprachauswahl läuft über einen URL-Parameter mit `localStorage` als Fallback, und Inhalte wechseln ohne Seitenneuladen. Jede sichtbare Zeichenkette — Projektbeschreibungen, Skill-Kategorien, Kontakttexte — ist lokalisiert, und jede Locale bringt ihr eigenes ausführliches Markdown für die Projektdetailansicht mit.

**State und Rendering**: Der globale State ist nach Zuständigkeit auf drei React-Kontexte aufgeteilt (`LanguageContext`, `PortfolioDataContext`, `ThemeProvider`) statt auf einen einzigen Store. Die Oberfläche ist aus Radix-Primitiven mit Tailwind CSS 4 aufgebaut, in einem Glass-Morphism-Designsystem, mit Motion für scroll-getriggerte Animationen, die `prefers-reduced-motion` respektieren.

**Technologie-Icon-Pipeline**: Eine Auflösungskette (base64 → externe URL → Lucide-Fallback) speist die Technologie-Badges, mit Graustufen-zu-Farbe-Übergängen beim Hovern über die Karte. Alte String-Arrays funktionieren weiterhin neben dem erweiterten Objektformat, sodass Datendateien schrittweise migriert werden können.

**Deployment**: Docker-first, mit einem vorgebauten Image-Ansatz, der das Problem der nativen `lightningcss`-Binaries in Tailwind CSS 4 umgeht. Der Container läuft als Non-Root-Benutzer mit Health Checks und festen Ressourcenlimits.

**Stack**

| Ebene | Auswahl |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Sprache | TypeScript 5, Strict Mode |
| Styling | Tailwind CSS 4, Radix UI, Motion |
| Inhalte | JSON + Markdown im Dateisystem, über API-Routen ausgeliefert |
| Deployment | Docker, Docker Compose |

**Status**: Portfolio, mehrsprachiges System und Projektübersicht sind produktiv. Die konversationelle KI-Schicht ist die laufende Arbeit — die Oberfläche wird hinter einem „In Entwicklung"-Dialog ausgeliefert, während das Retrieval- und Grounding-Backend entsteht.

Der Quellcode ist öffentlich unter [github.com/Makros-24/Automedon](https://github.com/Makros-24/Automedon).
