## whitelisted-ngrok - IP-Allowlisted Tunnels

**Why I built it**: Exposing a machine on a home lab through ngrok is trivial, but the resulting URL is reachable by anyone who learns it. For a tunnel that fronts an SSH server, that is an uncomfortable amount of exposure to accept for convenience. `ngka` keeps the convenience and removes the exposure: the tunnel still goes up in one command, but only addresses you name are ever proxied to the destination.

**Technical Implementation**

**Architecture**: A Go CLI built on Cobra, with `tcp` and `http` subcommands sharing a single tunnel engine in `pkg/ngrokautomator`. Configuration is read through Viper from a YAML file, keeping the ngrok auth token and SMTP credentials out of the command line and out of shell history.

**Connection filtering**: The tunnel is opened with the ngrok Go SDK, then the accept loop does the work. The whitelist arrives as a slice of flag values and is converted once into a `map[string]struct{}`, so the per-connection check is a constant-time lookup rather than a scan. Each accepted connection has its remote IP compared against that set — matches are handed to a goroutine, everything else is closed immediately, before a single byte reaches the destination.

**Proxying**: An allowed connection is dialed through to the local destination with `net.DialContext`, then both directions are copied concurrently with `io.Copy` inside an `errgroup`. Each copier closes the opposite side on exit, so when either end hangs up the paired goroutine unblocks instead of leaking. The proxy is transparent — the destination service needs no awareness of the tunnel.

**Notifications**: ngrok issues a new URL on every restart, which is awkward when the tunnel is meant to be reachable later from somewhere else. With `notification.active` enabled, the freshly minted URL is emailed over SMTP as soon as the tunnel is established, so the address is waiting in the inbox rather than in a terminal that has since been closed.

**Scope and limits**: Filtering happens at the application layer, after ngrok terminates the tunnel. The public URL still resolves for anyone; what changes is that non-whitelisted clients get their connection dropped and never reach the service behind it. Whitelist entries are matched as exact IP strings, so the intended use is a small set of known addresses rather than CIDR ranges.

**Stack**

| Layer | Choice |
|---|---|
| Language | Go 1.21 |
| CLI | Cobra (`ngka`, with `tcp` / `http` subcommands) |
| Configuration | Viper, YAML file |
| Tunnelling | ngrok Go SDK |
| Notifications | SMTP via go-mail |

**Status**: Working and in use. Both tunnel types are implemented, and the whitelist flag is repeatable so several addresses can be permitted in one invocation. Released under the MIT license.

The source is public at [github.com/Makros-24/whitelisted-ngrok](https://github.com/Makros-24/whitelisted-ngrok).
