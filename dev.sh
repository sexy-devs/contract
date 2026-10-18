#!/usr/bin/env bash
#
# Levanta backend y frontend en simultáneo y multiplexa sus logs
# en vivo sobre una sola terminal.
#
# Uso: ./dev.sh

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
CYAN='\033[1;36m'
MAGENTA='\033[1;35m'
RED='\033[1;31m'
YELLOW='\033[1;33m'

PIDS=()

log() {
  printf "${YELLOW}${BOLD}[dev]${RESET} %s\n" "$1"
}

fail() {
  printf "${RED}${BOLD}[dev]${RESET} %s\n" "$1" >&2
  exit 1
}

[[ -d "$BACKEND_DIR" ]] || fail "No se encontró la carpeta backend en $BACKEND_DIR"
[[ -d "$FRONTEND_DIR" ]] || fail "No se encontró la carpeta frontend en $FRONTEND_DIR"
command -v bun >/dev/null 2>&1 || fail "No se encontró 'bun' en el PATH"

cleanup() {
  trap - INT TERM EXIT
  echo
  log "Deteniendo backend y frontend..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" >/dev/null 2>&1
  done
  wait >/dev/null 2>&1
  log "Listo, chau 👋"
  exit 0
}

trap cleanup INT TERM

# Prefija cada línea con una etiqueta coloreada y la timestampea.
tag() {
  local label="$1" color="$2"
  while IFS= read -r line; do
    printf "${color}${BOLD}[%s]${RESET} ${DIM}%s${RESET} %s\n" "$label" "$(date '+%H:%M:%S')" "$line"
  done
}

run() {
  local label="$1" color="$2" dir="$3" cmd="$4"
  ( cd "$dir" && exec $cmd ) > >(tag "$label" "$color") 2>&1 &
  PIDS+=("$!")
}

clear
printf "${CYAN}${BOLD}┌──────────────────────────────────────────┐${RESET}\n"
printf "${CYAN}${BOLD}│${RESET}   🚀  Globito · entorno de desarrollo     ${CYAN}${BOLD}│${RESET}\n"
printf "${CYAN}${BOLD}└──────────────────────────────────────────┘${RESET}\n\n"

log "Iniciando backend  -> http://localhost:3000"
run "BACKEND " "$CYAN" "$BACKEND_DIR" "bun run dev"

log "Iniciando frontend -> http://localhost:5173"
run "FRONTEND" "$MAGENTA" "$FRONTEND_DIR" "bun run dev"

echo
log "Ctrl+C para detener ambos procesos."
echo

wait
