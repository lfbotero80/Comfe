#!/bin/zsh
cd "$(dirname "$0")/v3-modular" || exit 1
PORT=8055
URL="http://localhost:${PORT}/"

if ! lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  python3 -m http.server "${PORT}" >/tmp/comfenalco-v3-modular.log 2>&1 &
  sleep 1
fi

open "${URL}"
