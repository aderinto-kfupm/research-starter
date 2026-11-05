#!/usr/bin/env bash
# Local dev server: downloads PocketBase once, loads ../.env, serves pb_public on :8090.
# Usage: bash hub/scripts/dev.sh   (Git Bash, WSL, Linux, macOS)
set -euo pipefail
hub="$(cd "$(dirname "$0")/.." && pwd)"
ver=0.40.6   # keep in sync with Dockerfile PB_VERSION

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) os=windows; ext=.exe ;;
  Darwin) os=darwin; ext= ;;
  *) os=linux; ext= ;;
esac
case "$(uname -m)" in
  arm64|aarch64) arch=arm64 ;;
  *) arch=amd64 ;;
esac
bin="$hub/.pb/pocketbase$ext"

if [ ! -x "$bin" ]; then
  mkdir -p "$hub/.pb"
  zip="$(mktemp -u).zip"
  curl -fL "https://github.com/pocketbase/pocketbase/releases/download/v$ver/pocketbase_${ver}_${os}_${arch}.zip" -o "$zip"
  if command -v unzip >/dev/null; then unzip -qo "$zip" -d "$hub/.pb"; else tar -xf "$zip" -C "$hub/.pb"; fi
  rm -f "$zip"; chmod +x "$bin"
fi

if [ -f "$hub/.env" ]; then
  # Parse literally (no shell expansion), so a '$' in a password survives.
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"
    [[ "$line" =~ ^[[:space:]]*([A-Z_]+)=(.*)$ ]] || continue
    v="${BASH_REMATCH[2]}"; v="${v%%[[:space:]]#*}"; v="${v%"${v##*[![:space:]]}"}"
    export "${BASH_REMATCH[1]}=$v"
  done < "$hub/.env"
else
  echo "warning: .env missing (copy .env.example); sign-in emails won't send." >&2
fi

echo "Hub: http://localhost:8090   Admin: http://localhost:8090/_/"
exec "$bin" serve --http=127.0.0.1:8090 --dir "$hub/.pb/pb_data" --publicDir "$hub/pb_public" --migrationsDir "$hub/pb_migrations" --hooksDir "$hub/pb_hooks"
