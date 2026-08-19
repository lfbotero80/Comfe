#!/bin/zsh
BASE="$(cd "$(dirname "$0")" && pwd)"
cd "${BASE}/v3-modular" || exit 1
PORT=8055
URL="http://localhost:${PORT}/"

# Se usa `servidor-local.py` (y no `python3 -m http.server`) porque envia
# cabeceras sin cache. Los modulos ES se cachean de forma agresiva y el tablero
# llego a mostrarse a medias — solo menu y header, o pestanas que ya no existian —
# aun con el codigo correcto en disco. Ver `SPRINT-40` en SPRINTS.md.
if ! lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  python3 "${BASE}/servidor-local.py" "${PORT}" . >/tmp/comfenalco-v3-modular.log 2>&1 &
  sleep 1
fi

open "${URL}"
