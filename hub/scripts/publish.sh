#!/usr/bin/env bash
# Upload (or replace) a file on the hub. Used by CI.
# usage: HUB_URL=https://x.example.com HUB_EMAIL=.. HUB_PASSWORD=.. publish.sh <paper|figure|review> <file> [name]
set -euo pipefail
[ -n "${HUB_URL:-}" ] || { echo "HUB_URL not set, skipping"; exit 0; }
kind=$1; file=$2; name=${3:-$(basename "$file")}
tok=$(curl -fsS -X POST "$HUB_URL/api/collections/_superusers/auth-with-password" \
  -H 'content-type: application/json' \
  -d "$(jq -n --arg i "$HUB_EMAIL" --arg p "$HUB_PASSWORD" '{identity:$i,password:$p}')" | jq -r .token)
auth="Authorization: $tok"
# replace any earlier upload with the same name
curl -fsS -G "$HUB_URL/api/collections/docs/records" -H "$auth" --data-urlencode "filter=name='$name'" -d fields=id \
  | jq -r '.items[].id' | tr -d '\r' | while read -r id; do curl -fsS -X DELETE "$HUB_URL/api/collections/docs/records/$id" -H "$auth"; done
curl -fsS -X POST "$HUB_URL/api/collections/docs/records" -H "$auth" \
  -F "name=$name" -F "kind=$kind" -F "commit=${GITHUB_SHA:0:7}" -F "file=@$file" >/dev/null
echo "published $name"
