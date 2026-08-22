#!/usr/bin/env python3
"""Numbered demo window. Draw once after the terminal is sized; redraw only on resize."""
import signal
import shutil
import sys
import time

n = sys.argv[1] if len(sys.argv) > 1 else "1"

DIGITS = {
    "0": [
        " ██████ ",
        "██    ██",
        "██    ██",
        "██    ██",
        " ██████ ",
    ],
    "1": [
        "   ██   ",
        " ████   ",
        "   ██   ",
        "   ██   ",
        " ██████ ",
    ],
    "2": [
        " ██████ ",
        "      ██",
        " ██████ ",
        "██      ",
        "████████",
    ],
    "3": [
        " ██████ ",
        "      ██",
        "  █████ ",
        "      ██",
        " ██████ ",
    ],
    "4": [
        "██    ██",
        "██    ██",
        "████████",
        "      ██",
        "      ██",
    ],
    "5": [
        "████████",
        "██      ",
        "███████ ",
        "      ██",
        " ██████ ",
    ],
    "6": [
        " ██████ ",
        "██      ",
        "███████ ",
        "██    ██",
        " ██████ ",
    ],
    "7": [
        "████████",
        "     ██ ",
        "    ██  ",
        "   ██   ",
        "  ██    ",
    ],
    "8": [
        " ██████ ",
        "██    ██",
        " ██████ ",
        "██    ██",
        " ██████ ",
    ],
    "9": [
        " ██████ ",
        "██    ██",
        " ███████",
        "      ██",
        " ██████ ",
    ],
}


def size():
    cols, rows = shutil.get_terminal_size(fallback=(40, 12))
    return max(1, cols), max(1, rows)


def art_for(label):
    chars = [ch for ch in str(label) if ch in DIGITS]
    if not chars:
        chars = ["1"]
    rows = [""] * 5
    for i, ch in enumerate(chars):
        digit = DIGITS[ch]
        gap = "  " if i else ""
        for r in range(5):
            rows[r] += gap + digit[r]
    return rows


def draw(_signum=None, _frame=None):
    cols, rows = size()
    art = art_for(n)
    caption = "window %s" % n
    block = art + ["", caption]
    height = len(block)
    width = max(len(line) for line in block)
    top = max(0, (rows - height) // 2)
    left = max(0, (cols - width) // 2)
    out = ["\033[?25l", "\033[?2026h", "\033[2J"]
    for i, line in enumerate(block):
        out.append("\033[%d;%dH%s" % (top + i + 1, left + 1, line))
    out.append("\033[?2026l")
    sys.stdout.write("".join(out))
    sys.stdout.flush()


def quit_(_signum=None, _frame=None):
    sys.exit(0)


signal.signal(signal.SIGTERM, quit_)
signal.signal(signal.SIGINT, quit_)
signal.signal(signal.SIGHUP, quit_)
signal.signal(signal.SIGWINCH, draw)

sized = {"ok": False}


def on_winch(signum, frame):
    sized["ok"] = True
    draw()


signal.signal(signal.SIGWINCH, on_winch)

deadline = time.monotonic() + 0.8
while time.monotonic() < deadline and not sized["ok"]:
    cols, rows = size()
    if cols >= 16 and rows >= 10 and (cols, rows) != (80, 24):
        break
    time.sleep(0.025)

draw()
signal.signal(signal.SIGWINCH, draw)

while True:
    signal.pause()
