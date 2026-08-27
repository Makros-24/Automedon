## whitelisted-ngrok - Tunnels avec liste blanche d'IP

**Pourquoi je l'ai créé** : Exposer une machine de home lab via ngrok est trivial, mais l'URL obtenue est accessible à quiconque en prend connaissance. Pour un tunnel placé devant un serveur SSH, cela représente un niveau d'exposition difficile à accepter au nom de la simplicité. `ngka` conserve la simplicité et supprime l'exposition : le tunnel se monte toujours en une seule commande, mais seules les adresses que vous désignez sont relayées vers la destination.

**Implémentation technique**

**Architecture** : Un outil en ligne de commande Go bâti sur Cobra, dont les sous-commandes `tcp` et `http` partagent un même moteur de tunnel dans `pkg/ngrokautomator`. La configuration est lue via Viper depuis un fichier YAML, ce qui garde le jeton d'authentification ngrok et les identifiants SMTP hors de la ligne de commande et de l'historique du shell.

**Filtrage des connexions** : Le tunnel est ouvert avec le SDK Go de ngrok, puis la boucle d'acceptation fait le travail. La liste blanche, reçue sous forme de tableau de valeurs de flags, est convertie une seule fois en `map[string]struct{}` : la vérification par connexion devient une recherche à temps constant plutôt qu'un parcours. L'IP distante de chaque connexion acceptée est comparée à cet ensemble — les correspondances sont confiées à une goroutine, tout le reste est fermé immédiatement, avant qu'un seul octet n'atteigne la destination.

**Relais** : Une connexion autorisée est acheminée vers la destination locale via `net.DialContext`, puis les deux sens sont copiés simultanément avec `io.Copy` au sein d'un `errgroup`. Chaque copieur ferme le côté opposé en sortant, de sorte que lorsqu'une extrémité raccroche, la goroutine jumelle se débloque au lieu de fuir. Le relais est transparent : le service de destination n'a pas besoin de connaître l'existence du tunnel.

**Notifications** : ngrok attribue une nouvelle URL à chaque redémarrage, ce qui est gênant lorsque le tunnel doit être joignable plus tard depuis un autre endroit. Si `notification.active` est activé, l'URL fraîchement générée est envoyée par SMTP dès l'établissement du tunnel : l'adresse attend dans la boîte mail plutôt que dans un terminal entre-temps fermé.

**Portée et limites** : Le filtrage s'opère au niveau applicatif, après que ngrok a terminé le tunnel. L'URL publique reste résoluble par tout le monde ; ce qui change, c'est que les clients non autorisés voient leur connexion fermée et n'atteignent jamais le service situé derrière. Les entrées de la liste blanche sont comparées comme des chaînes d'IP exactes : l'usage visé est un petit ensemble d'adresses connues, non des plages CIDR.

**Stack**

| Couche | Choix |
|---|---|
| Langage | Go 1.21 |
| CLI | Cobra (`ngka`, sous-commandes `tcp` / `http`) |
| Configuration | Viper, fichier YAML |
| Tunnellisation | SDK Go ngrok |
| Notifications | SMTP via go-mail |

**Statut** : Fonctionnel et utilisé. Les deux types de tunnels sont implémentés, et le flag de liste blanche est répétable afin d'autoriser plusieurs adresses en un seul appel. Publié sous licence MIT.

Le code source est public sur [github.com/Makros-24/whitelisted-ngrok](https://github.com/Makros-24/whitelisted-ngrok).
