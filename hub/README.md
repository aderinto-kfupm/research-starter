# Research hub

Private, invite-only site for supervisors and collaborators: kanban board, roadmap (Gantt), research log, the latest paper PDF, and threaded feedback. One small [PocketBase](https://pocketbase.io) server (SQLite) serves the API and the static frontend in `pb_public/`.

| Role | Can |
|---|---|
| `admin` | everything, including inviting people (People tab) |
| `collaborator` | edit tasks and log, comment |
| `viewer` | read everything, comment |

Sign-in is passwordless: the user enters their email and gets a 6-digit code. Unknown emails get no code, so access is by invitation only.

## Deploy (Coolify)

1. New application from this repo, **Base Directory** `/hub`, build pack **Dockerfile**, port `8090`.
2. Persistent storage: mount a volume at `/pb/pb_data`.
3. Environment variables: see `.env.example`. They are read once, on the first start of an empty volume (they create the admin and SMTP settings).
4. Domain: `<project>.abdurrahmanaderinto.com`.
5. Back up the `/pb/pb_data` volume (Coolify scheduled backup).

## Publish the PDF from CI

Add repository secrets `HUB_URL`, `HUB_EMAIL`, `HUB_PASSWORD` (the superuser from step 3). `paper.yml` then uploads `main.pdf` on every push to `main`. For other files: `hub/scripts/publish.sh <paper|figure|review> <file> [name]`.

## Local run

```bash
cd hub && cp .env.example .env   # edit
docker build -t hub . && docker run --rm -p 8090:8090 --env-file .env -v hub_data:/pb/pb_data hub
```

Dashboard for raw data: `/_/` (superuser login).

## Notes

- Changing roles or SMTP later: do it in the `/_/` dashboard; the env vars are not re-read.
- `config.js` holds the title shown in the header.
- Comments are plain text; nothing user-supplied is rendered as HTML.
