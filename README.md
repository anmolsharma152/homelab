# 🏠 Personal Homelab Stack

A modular, self-hosted developer homelab stack orchestrated with **Docker Compose**, reverse-proxied via **Caddy**, and monitored using **Homepage** and **Glance**.

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────┐
                          │     Caddy Gateway     │
                          │   (Reverse Proxy/TLS) │
                          └───────────┬───────────┘
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       │                              │                              │
┌──────┴──────────────┐    ┌──────────┴──────────┐    ┌──────────────┴──────────────┐
│  Core Dashboards    │    │  Data & Databases   │    │     AI & Utilities          │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────────────┤
│ • Homepage (:8082)  │    │ • PostgreSQL v16    │    │ • Open WebUI (Local LLM UI) │
│ • Glance   (:8081)  │    │ • Redis Cache       │    │ • Odysseus AI Multi-Agent   │
│ • Glances Hardware  │    │ • Chroma Vector DB  │    │ • SearXNG Private Search    │
│                     │    │                     │    │ • Ntfy Notifications        │
└─────────────────────┘    └─────────────────────┘    └─────────────────────────────┘
```

---

## 📦 Services Directory

| Category | Service | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Gateway** | `caddy` | `:80`, `:443` | Reverse proxy routing `*.archbox.local` domains with automatic local TLS. |
| **Dashboards**| `homepage` | `:8082` | Modern application dashboard with live Docker container metrics. |
| | `glance` | `:8081` | Feed aggregator and developer information hub. |
| | `glances` | `:61208` | System hardware and resource monitoring engine. |
| **Databases** | `postgres` | `:5432` | PostgreSQL 16 relational database with `pgvector` vector extension. |
| | `redis` | `:6379` | In-memory key-value cache (Valkey engine). |
| | `chromadb` | `:8000` | Embeddings vector store for AI workflows. |
| **AI & Search**| `open-webui`| `:3000` | Local web interface for Ollama and LLM inference. |
| | `odysseus` | `:8000` | Autonomous multi-agent development environment. |
| | `searxng` | `:8080` | Privacy-respecting metasearch engine. |
| | `ntfy` | `:80` | Pub/Sub push notification server. |

---

## 🚀 Quick Start

### 1. Prerequisites
- Docker Engine & Docker Compose (`v2+`)
- Local DNS resolution for `*.archbox.local` (or standard `localhost` mapping)

### 2. Environment Configuration
Each service contains an `.env.example` where applicable. Copy and fill in necessary environment variables:
```bash
cp postgres/.env.example postgres/.env
```

### 3. Start Core Services
```bash
# Start Caddy gateway & Core Dashboards
cd caddy && docker compose up -d
cd ../homepage && docker compose up -d
cd ../glance && docker compose up -d
cd ../postgres && docker compose up -d
cd ../redis && docker compose up -d
```

---

## 🔒 Security & Backup
- **Data Volumes**: Live persistent volumes and databases are excluded from Git via `.gitignore`.
- **Automated Backups**: Postgres database backups are managed via `postgres/backup_postgres.sh`.
