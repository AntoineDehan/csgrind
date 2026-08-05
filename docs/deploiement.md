# Deployment (OVH VPS)

Target setup: a single OVH **VPS** running the whole stack with Docker Compose, behind [Caddy](https://caddyserver.com) as a reverse proxy handling HTTPS certificates automatically.

```
                    ┌──────────────── VPS ────────────────┐
Internet ──443──►   │  Caddy ──► frontend (nginx)         │
                    │        └─► backend (Express) ──► db  │
                    └─────────────────────────────────────┘
```

Only Caddy exposes ports (80/443). The database, API and frontend are reachable only through the internal Docker network.

---

## 1. Prerequisites

| | |
|---|---|
| Hosting | An OVH **VPS** — *not* "Hébergement Web" (shared hosting cannot run Docker, Node or PostgreSQL) |
| Specs | 2 vCPU / 4 GB RAM minimum (OVH VPS-1 is enough) |
| OS | Ubuntu 26.04 LTS — 24.04 LTS also works. Docker publishes packages for both |
| Domain | Any registrar. Steam OpenID requires a real domain served over HTTPS |
| Steam | A Steam Web API key — https://steamcommunity.com/dev/apikey |

Two subdomains are used: the root domain for the frontend, `api.` for the backend.

## 2. DNS records

At your registrar, point both names to the VPS IPv4 address:

| Type | Name | Value |
|---|---|---|
| A | `@` | `<VPS_IP>` |
| A | `api` | `<VPS_IP>` |

Propagation usually takes a few minutes. Verify before continuing — Caddy cannot issue certificates until DNS resolves:

```bash
dig +short cs-grind.com
dig +short api.cs-grind.com
```

## 3. Secure the VPS

OVH's Ubuntu images already ship a sudo-enabled `ubuntu` user and disable root SSH login, so connect as that user:

```bash
ssh ubuntu@<VPS_IP>
```

If your image has no default user, connect as root and create one:

```bash
adduser csgrind
usermod -aG sudo csgrind
```

From **your own machine**, copy your SSH public key over (generate one with `ssh-keygen -t ed25519` if you have none):

> On Windows, run these from **Git Bash**, not PowerShell: Windows' OpenSSH client does not ship `ssh-copy-id`.

```bash
ssh-copy-id csgrind@<VPS_IP>
```

Back on the VPS, check what the image already enforces — cloud images keep their overrides in `/etc/ssh/sshd_config.d/`, and those win over `sshd_config`:

```bash
sudo grep -rE "^(PermitRootLogin|PasswordAuthentication)" /etc/ssh/sshd_config /etc/ssh/sshd_config.d/
```

Both must end up set as follows, in whichever file currently defines them:

```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh
```

Then enable the firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

> Keep your current SSH session open until you have confirmed you can reconnect with your key in a second terminal.

## 4. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and back in, then check:

```bash
docker compose version
```

## 5. Get the code

```bash
git clone https://github.com/AntoineDehan/csgrind.git
cd csgrind
```

## 6. Environment files

### Root `.env`

```bash
cp .env.example .env
nano .env
```

```bash
DB_USER="csgrind"
DB_PASSWORD="<a long random password>"
DB_NAME="csgrind"

SITE_DOMAIN="cs-grind.com"
API_DOMAIN="api.cs-grind.com"
VITE_API_URL="https://api.cs-grind.com"
```

### `backend/.env`

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

```bash
JWT_SECRET="<output of: openssl rand -hex 32>"
STEAM_REALM="https://api.cs-grind.com"
STEAM_RETURN_URL="https://api.cs-grind.com/auth/steam/return"
STEAM_API_KEY="<your Steam Web API key>"
SITE_URL="https://cs-grind.com"
NODE_ENV="production"
```

Notes:

- **Generate fresh secrets for production.** Never reuse the development `JWT_SECRET`.
- `DATABASE_URL` is **not** needed here: `docker-compose.prod.yml` builds it from the root `.env` and points it at the `db` service.
- `SITE_URL` must be the public frontend URL — it drives CORS and the links inside notification emails.
- `VITE_API_URL` is injected **at build time**. Changing it later requires rebuilding the frontend image.

## 7. Launch

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

The first build takes several minutes. Caddy requests Let's Encrypt certificates on its own as soon as it starts — no manual certbot step.

Watch the logs if anything looks wrong:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

## 8. Apply the schema and seed

Once only, after the first start:

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma db push
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

## 9. Post-deployment checks

- `https://cs-grind.com` loads over HTTPS with a valid certificate
- Refreshing `https://cs-grind.com/dashboard` returns the app, not a 404 (nginx SPA fallback)
- `https://api.cs-grind.com/` answers
- Registering and logging in works
- Linking Steam redirects back correctly (validates `STEAM_REALM` / `STEAM_RETURN_URL`)
- Creating a goal generates a baseline report (validates the Leetify integration)
- Scheduled jobs are registered: `docker compose -f docker-compose.prod.yml logs backend`

## 10. Updating the app

```bash
cd csgrind
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Run `prisma db push` again only when the Prisma schema changed.

## 11. Database backups

Real user data lives in the `pgdata` volume. Take a dump before any risky operation:

```bash
docker compose -f docker-compose.prod.yml exec -T db \
  pg_dump -U "$DB_USER" "$DB_NAME" > backup-$(date +%F).sql
```

Restore:

```bash
cat backup-2026-08-05.sql | docker compose -f docker-compose.prod.yml exec -T db \
  psql -U "$DB_USER" -d "$DB_NAME"
```

## 12. Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Caddy cannot get a certificate | DNS not propagated yet, or ports 80/443 blocked. Check `dig` and `ufw status` |
| The frontend calls `localhost:3000` | `VITE_API_URL` was wrong at build time. Fix the root `.env` and rebuild with `--build` |
| CORS errors in the browser console | `SITE_URL` in `backend/.env` does not match the real frontend URL |
| Steam returns an error | `STEAM_REALM` must cover `STEAM_RETURN_URL`, and both must use HTTPS |
| The backend exits immediately | Environment validation failed. The logs list each invalid variable |
| The build is killed during `vite build` | Not enough RAM. Add swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` |

## 13. Email notifications (optional)

Report notifications use [Resend](https://resend.com). The default sender (`onboarding@resend.dev`) can only deliver to the address that owns the Resend account, so a verified domain is required to email real users:

1. Add and verify your domain in the Resend dashboard
2. Set `RESEND_API` and `MAIL_FROM` (e.g. `CSGrind <noreply@cs-grind.com>`) in `backend/.env`

When `RESEND_API` is not set, the application runs normally and skips sending.
