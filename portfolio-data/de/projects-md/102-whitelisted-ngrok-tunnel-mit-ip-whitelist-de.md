## whitelisted-ngrok - Tunnel mit IP-Whitelist

**Warum ich es gebaut habe**: Einen Rechner im Home Lab über ngrok verfügbar zu machen, ist trivial — die entstehende URL ist jedoch für jeden erreichbar, der sie erfährt. Bei einem Tunnel vor einem SSH-Server ist das ein Maß an Exposition, das sich nur schwer mit Bequemlichkeit rechtfertigen lässt. `ngka` behält die Bequemlichkeit und nimmt die Exposition weg: Der Tunnel steht weiterhin mit einem einzigen Befehl, aber nur die von Ihnen benannten Adressen werden zum Ziel durchgereicht.

**Technische Umsetzung**

**Architektur**: Ein in Go geschriebenes CLI auf Basis von Cobra, dessen Unterbefehle `tcp` und `http` dieselbe Tunnel-Engine in `pkg/ngrokautomator` nutzen. Die Konfiguration wird über Viper aus einer YAML-Datei gelesen, wodurch ngrok-Token und SMTP-Zugangsdaten weder auf der Kommandozeile noch in der Shell-History landen.

**Verbindungsfilterung**: Der Tunnel wird mit dem ngrok-Go-SDK geöffnet, die eigentliche Arbeit leistet dann die Accept-Schleife. Die Whitelist kommt als Slice von Flag-Werten an und wird einmalig in eine `map[string]struct{}` überführt, sodass die Prüfung pro Verbindung ein Lookup in konstanter Zeit ist statt eines Durchlaufs. Die Remote-IP jeder angenommenen Verbindung wird gegen diese Menge geprüft — Treffer übernimmt eine Goroutine, alles andere wird sofort geschlossen, bevor auch nur ein Byte das Ziel erreicht.

**Weiterleitung**: Eine erlaubte Verbindung wird per `net.DialContext` zum lokalen Ziel aufgebaut, anschließend werden beide Richtungen nebenläufig mit `io.Copy` innerhalb einer `errgroup` kopiert. Jeder Kopiervorgang schließt beim Beenden die Gegenseite, sodass beim Auflegen einer Seite die zugehörige Goroutine entblockt wird, statt zu lecken. Die Weiterleitung ist transparent: Der Zieldienst muss nichts vom Tunnel wissen.

**Benachrichtigungen**: ngrok vergibt bei jedem Neustart eine neue URL — unpraktisch, wenn der Tunnel später von anderswo erreichbar sein soll. Ist `notification.active` gesetzt, wird die frisch erzeugte URL unmittelbar nach dem Aufbau per SMTP verschickt; die Adresse wartet dann im Postfach statt in einem längst geschlossenen Terminal.

**Geltungsbereich und Grenzen**: Die Filterung erfolgt auf Anwendungsebene, nachdem ngrok den Tunnel terminiert hat. Die öffentliche URL bleibt für jeden auflösbar; geändert wird lediglich, dass nicht freigegebene Clients getrennt werden und den dahinterliegenden Dienst nie erreichen. Whitelist-Einträge werden als exakte IP-Zeichenketten verglichen — gedacht ist das für eine kleine Menge bekannter Adressen, nicht für CIDR-Bereiche.

**Stack**

| Ebene | Wahl |
|---|---|
| Sprache | Go 1.21 |
| CLI | Cobra (`ngka`, Unterbefehle `tcp` / `http`) |
| Konfiguration | Viper, YAML-Datei |
| Tunneling | ngrok-Go-SDK |
| Benachrichtigungen | SMTP über go-mail |

**Status**: Funktionsfähig und im Einsatz. Beide Tunnelarten sind implementiert, und das Whitelist-Flag ist wiederholbar, sodass sich mehrere Adressen in einem Aufruf freigeben lassen. Veröffentlicht unter der MIT-Lizenz.

Der Quellcode ist öffentlich unter [github.com/Makros-24/whitelisted-ngrok](https://github.com/Makros-24/whitelisted-ngrok).
