#!/bin/bash
# Spawn, reset, act on, or close numbered demo windows.
# Hyprland 0.56 needs Lua dispatchers; uwsm-app launches the terminals.
set -uo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
WIN="$DIR/tour-demo-window.sh"
CLASS="io.github.herr-brandt.tour.demo"

spawn_one() {
  local n="$1"
  if command -v uwsm-app >/dev/null 2>&1 && command -v foot >/dev/null 2>&1; then
    setsid uwsm-app -- foot --app-id="$CLASS" -T "tour demo window ${n}" \
      -o "main.font=monospace:size=16" -o "pad=0x0" -o "scrollback.lines=0" \
      -e "$WIN" "$n" >/dev/null 2>&1 &
  elif command -v foot >/dev/null 2>&1; then
    setsid foot --app-id="$CLASS" -T "tour demo window ${n}" \
      -o "main.font=monospace:size=16" -o "pad=0x0" -o "scrollback.lines=0" \
      -e "$WIN" "$n" >/dev/null 2>&1 &
  else
    setsid uwsm-app -- xdg-terminal-exec --title="tour demo window ${n}" "$WIN" "$n" >/dev/null 2>&1 &
  fi
}

case "${1:-}" in
  spawn)
    n="${2:-2}"
    i=1
    while [ "$i" -le "$n" ]; do
      spawn_one "$i"
      i=$((i + 1))
      sleep 0.14
    done
    ;;
  reset|act|close)
    python3 - "$DIR" "$CLASS" "$@" <<'PY'
import json, os, signal, subprocess, sys

klass = sys.argv[2]
action = sys.argv[3]
args = sys.argv[4:]

def clients():
    try:
        data = json.loads(subprocess.check_output(["hyprctl", "-j", "clients"], text=True))
    except Exception:
        return []
    out = []
    for client in data:
        if client.get("class") == klass or client.get("initialClass") == klass:
            out.append(client)
    out.sort(key=lambda c: (c.get("at") or [0, 0])[0])
    return out

def dispatch(lua):
    subprocess.call(["hyprctl", "dispatch", lua], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def win(client):
    return "address:" + str(client.get("address") or "")

def focus(client):
    dispatch('hl.dsp.focus({ window = "%s" })' % win(client))

demos = clients()

if action == "close":
    for client in demos:
        pid = client.get("pid")
        if pid:
            try:
                os.kill(int(pid), signal.SIGTERM)
            except OSError:
                pass
    sys.exit(0)

if not demos:
    sys.exit(0)

if action == "reset":
    for client in demos:
        w = win(client)
        if client.get("pinned"):
            dispatch('hl.dsp.window.pin({ window = "%s" })' % w)
        if client.get("floating"):
            dispatch('hl.dsp.window.float({ window = "%s", action = "toggle" })' % w)
        dispatch('hl.dsp.window.tag({ window = "%s", tag = "-pop" })' % w)
    sys.exit(0)

target = demos[0]
if action != "act" or not args:
    sys.exit(0)

kind = args[0]
direction = args[1] if len(args) > 1 else "l"

if kind == "float":
    dispatch('hl.dsp.window.float({ window = "%s", action = "toggle" })' % win(target))
elif kind == "swap":
    if direction in ("l", "u") and len(demos) > 1:
        target = demos[-1]
    dispatch('hl.dsp.window.swap({ window = "%s", direction = "%s" })' % (win(target), direction))
elif kind == "focus":
    if direction in ("r", "d") and len(demos) > 1:
        target = demos[-1]
    else:
        target = demos[0]
    focus(target)
    dispatch('hl.dsp.focus({ direction = "%s" })' % direction)
elif kind == "pop":
    focus(target)
    subprocess.call(["omarchy-hyprland-window-pop"])
elif kind == "resize":
    dispatch('hl.dsp.window.resize({ window = "%s", x = -100, y = 0, relative = true })' % win(target))
PY
    ;;
  *)
    echo "usage: tour-demo.sh spawn|reset|act|close" >&2
    exit 1
    ;;
esac
