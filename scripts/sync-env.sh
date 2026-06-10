#!/usr/bin/env bash
# Sync env from central source-of-truth to mtd/.env.local
# Source: ~/context-2026/agents/.env
# Target: ~/APPS/mtd/.env.local
# Strips whitespace inside *_URL / *_URI values (memory: project_corrupted_env).
# Idempotent; safe to re-run.
#
# Notes:
# - MONGO_DB / MONGODB_DB are NOT pulled from central (which is "AIDB"),
#   because MTD's collections live in db "mtd". We set MONGO_DB=mtd locally.
# - Never echo values; only key names + statuses.

set -euo pipefail

CENTRAL="${HOME}/context-2026/agents/.env"
TARGET="${HOME}/APPS/mtd/.env.local"

[[ -f "$CENTRAL" ]] || { echo "[fail] missing $CENTRAL" >&2; exit 1; }
[[ -f "$TARGET" ]] || touch "$TARGET"

KEYS=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  MONGO_URI
  MONGODB_URI
  S3_ACCESS_KEY
  S3_SECRET_ACCESS_KEY
  S3_BUCKET_NAME
  S3_UPLOAD_BASE_FOLDER
  ANTHROPIC_API_KEY
  RUNWARE_API_KEY
  RUNWARE_API_BASE
  YOUTUBE_API_KEY
)

# MTD-specific local overrides (do NOT pull from central)
LOCAL_OVERRIDES=(
  "MONGO_DB=mtd"
  "MONGODB_DB=mtd"
)

is_url_key() { [[ "$1" == *_URL || "$1" == *_URI ]]; }

get_central() {
  local k="$1"
  awk -v k="$k" 'BEGIN{FS="="} $1==k { sub(/^[^=]*=/, ""); print; exit }' "$CENTRAL"
}

target_has() { grep -qE "^${1}=" "$TARGET"; }

target_set() {
  local k="$1" v="$2"
  awk -v k="$k" -v v="$v" 'BEGIN{FS="="} {
    if ($1==k) print k"="v
    else print
  }' "$TARGET" > "$TARGET.tmp" && mv "$TARGET.tmp" "$TARGET"
}

NEW_KEYS=()
UPDATED=0
STRIPPED=0

for k in "${KEYS[@]}"; do
  v="$(get_central "$k")"
  if [[ -z "$v" ]]; then
    echo "[skip] $k absent in central"
    continue
  fi
  if is_url_key "$k"; then
    cleaned="$(printf %s "$v" | tr -d '[:space:]')"
    if [[ "$cleaned" != "$v" ]]; then
      echo "[strip] $k — removed whitespace"
      STRIPPED=$((STRIPPED + 1))
    fi
    v="$cleaned"
  fi
  if target_has "$k"; then
    target_set "$k" "$v"
    UPDATED=$((UPDATED + 1))
    echo "[update] $k"
  else
    NEW_KEYS+=("$k=$v")
    echo "[add]    $k"
  fi
done

# Append new keys at once with a separator
if (( ${#NEW_KEYS[@]} > 0 )); then
  {
    echo ""
    echo "# Synced from ~/context-2026/agents/.env on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    for kv in "${NEW_KEYS[@]}"; do
      printf '%s\n' "$kv"
    done
  } >> "$TARGET"
fi

# Apply local overrides (MTD-specific MONGO_DB)
for kv in "${LOCAL_OVERRIDES[@]}"; do
  k="${kv%%=*}"
  v="${kv#*=}"
  if target_has "$k"; then
    target_set "$k" "$v"
  else
    echo "$k=$v" >> "$TARGET"
  fi
  echo "[local]  $k=$v"
done

echo ""
echo "[ok] updated $UPDATED · added ${#NEW_KEYS[@]} · stripped-whitespace $STRIPPED"

# Whitespace sanity check on URL/URI lines
if grep -qE '^[A-Z_]+_(URL|URI)=.*[[:space:]]' "$TARGET"; then
  echo "[FAIL] some *_URL / *_URI value still contains whitespace" >&2
  grep -nE '^[A-Z_]+_(URL|URI)=.*[[:space:]]' "$TARGET" | sed 's/=.*$/=<masked>/' >&2
  exit 2
fi
echo "[ok] URL/URI whitespace check passed"
