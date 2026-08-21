# Homepage Dashboard Configuration

Self-hosted dashboard (ghcr.io/gethomepage/homepage:latest) deployed via Docker Compose.

## Quick Start

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f homepage
```

## Configuration Structure

All config in `config/` directory, mounted to `/app/config` in container:

| File | Purpose |
|------|---------|
| `settings.yaml` | Title, theme, layout groups |
| `services.yaml` | Service cards (Active/Inactive), linked to Docker containers |
| `widgets.yaml` | Widgets: resources, search (SearXNG), weather, datetime |
| `bookmarks.yaml` | Bookmark links organized by category |
| `docker.yaml` | Docker socket config for container monitoring (`my-local-server`) |
| `proxmox.yaml`, `kubernetes.yaml` | Template examples (commented) |
| `custom.css`, `custom.js` | Custom styling/scripts |

## Key Details

- **Port**: `127.0.0.1:8082` → container port 3000
- **Network**: Requires external `homelab` network (`docker network create homelab` if missing)
- **Docker socket**: Mounted read-only for container status monitoring
- **Timezone**: Asia/Kolkata
- **Services** in `services.yaml` reference containers by name (e.g., `container: algodeck_app`) — must match actual container names on the `homelab` network

## Critical Gotchas (Verified)

### 1. Layout Group Names Must Match Exactly
`settings.yaml` layout groups must match the **exact group names** in `bookmarks.yaml` and `services.yaml`. The group `Bookmarks` does not exist — your bookmarks.yaml uses: `Developer & Tech`, `AI Chatbots`, `Career & Social`, `Media`. Using a non-matching name silently puts those groups at the bottom of the page.

### 2. settings.yaml Changes Need Manual Refresh
`custom.css` hot-reloads on save. **Layout changes in `settings.yaml` do not** — click the refresh icon (bottom-right of page) or restart container to regenerate static HTML.

### 3. Search Bar Width / Right Alignment Fixed via CSS Grid
Flexbox with `space-between` + `margin-left: auto` distributes space unpredictably when `flex-grow` is involved. Switch `#widgets-wrap` to CSS Grid with 3 explicit columns:

```css
#widgets-wrap {
    display: grid !important;
    grid-template-columns: auto 1fr auto !important;
    align-items: center !important;
    width: 100% !important;
    column-gap: 2rem !important;
}
```

Middle column (`1fr`) genuinely fills available width; right column pins to true right edge.

### 4. Service Groups Regrouped by Status (Not Function)
`services.yaml` uses two top-level groups: `Active:` (4 items) and `Inactive:` (6 items). `settings.yaml` layout gives each a full row:

```yaml
layout:
  Developer & Tech:
  AI Chatbots:
  Career & Social:
  Media:
  Active:
    style: row
    columns: 4
  Inactive:
    style: row
    columns: 6
```

Bookmark groups get 25% width each (4 per row); Active/Inactive each take 100% width (one full row each).

### 5. Active vs Inactive Card Styling via nth-child
Active row = 5th child of `#layout-groups` (after 4 bookmark groups), Inactive = 6th. **If bookmark group count or layout order changes, these indices must be updated.**

```css
/* Active — taller cards, stats visible */
#layout-groups > div:nth-child(5) li { height: auto !important; min-height: 68px !important; }
#layout-groups > div:nth-child(5) .service-stats { max-height: 30px !important; opacity: 1 !important; }

/* Inactive — compact, stats hidden */
#layout-groups > div:nth-child(6) li { height: 44px !important; }
#layout-groups > div:nth-child(6) .service-stats { display: none !important; }
```

## Adding a Service

1. Add entry to `services.yaml` under `Active:` or `Inactive:`
2. Set `container:` to the exact Docker container name
3. Set `server: my-local-server` (matches `docker.yaml`)
4. Restart: `docker compose restart homepage`

## Adding a Widget/Bookmark

Edit `widgets.yaml` or `bookmarks.yaml` — changes apply on container restart (or live-reload if enabled).

## Current Working custom.css

See `config/custom.css` — contains the verified CSS Grid header layout, search bar styling, right-aligned weather/datetime, and the Active/Inactive card differentiation via nth-child selectors.