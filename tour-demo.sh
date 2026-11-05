#!/bin/bash
# Spawn or close the numbered demo windows for the window playground.
set -uo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
WIN="$DIR/tour-demo-window.py"
CLASS="io.github.herr-brandt.tour.demo"
FOOT_OPTS=(-o "main.font=monospace:size=16" -o "pad=0x0" -o "scrollback.lines=0")

spawn_one() {
  local n="$1" title="tour demo window $1"
  if command -v foot >/dev/null 2>&1; then
    if command -v uwsm-app >/dev/null 2>&1; then
      setsid uwsm-app -- foot --app-id="$CLASS" -T "$title" "${FOOT_OPTS[@]}" -e python3 "$WIN" "$n" >/dev/null 2>&1 &
    else
      setsid foot --app-id="$CLASS" -T "$title" "${FOOT_OPTS[@]}" -e python3 "$WIN" "$n" >/dev/null 2>&1 &
    fi
  else
    setsid uwsm-app -- xdg-terminal-exec --app-id="$CLASS" --title="$title" python3 "$WIN" "$n" >/dev/null 2>&1 &
  fi
}

case "${1:-}" in
  spawn)
    for ((i = 1; i <= ${2:-2}; i++)); do
      spawn_one "$i"
      sleep 0.14
    done
    ;;
  close)
    # Ask each demo window to close; never touch anything else.
    hyprctl -j clients 2>/dev/null \
      | jq -r --arg c "$CLASS" '.[] | select(.class == $c or .initialClass == $c) | .address' \
      | while read -r addr; do
          [ -n "$addr" ] && hyprctl dispatch "hl.dsp.window.close({ window = \"address:$addr\" })" >/dev/null 2>&1
        done
    ;;
  *)
    echo "usage: tour-demo.sh spawn [count] | close" >&2
    exit 1
    ;;
esac
