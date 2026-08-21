#!/usr/bin/env python3
"""Resolve Hyprland code:20 / code:21 to the user's layout symbols."""

from __future__ import annotations

import json
import re
import subprocess
import sys


def first_layout(raw: str) -> str:
    return (raw or "us").split(",")[0].strip() or "us"


def hypr_layout() -> str:
    try:
        data = json.loads(
            subprocess.check_output(
                ["hyprctl", "-j", "getoption", "input:kb_layout"],
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=1.5,
            )
        )
        return first_layout(str(data.get("str") or ""))
    except Exception:
        return ""


def vconsole_layout() -> str:
    try:
        with open("/etc/vconsole.conf", encoding="utf-8") as handle:
            for line in handle:
                stripped = line.strip()
                if stripped.startswith("XKBLAYOUT="):
                    value = stripped.split("=", 1)[1].strip().strip('"').strip("'")
                    return first_layout(value)
    except OSError:
        pass
    return "us"


def first_sym(keymap: str, name: str) -> str:
    match = re.search(r"key\s*<" + name + r">\s*\{.*?\};", keymap, re.S)
    if not match:
        return ""
    block = match.group(0)
    named = re.search(r"symbols\[[^\]]+\]\s*=\s*\[\s*([A-Za-z0-9_]+)", block)
    if named:
        return named.group(1)
    bare = re.search(r"\[\s*([A-Za-z0-9_]+)", block)
    return bare.group(1) if bare else ""


def main() -> int:
    layout = hypr_layout() or vconsole_layout()
    keymap = ""
    try:
        keymap = subprocess.check_output(
            ["xkbcli", "compile-keymap", "--layout", layout],
            stdin=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=3,
        )
    except Exception:
        pass
    json.dump(
        {
            "layout": layout,
            "code20": first_sym(keymap, "AE11") or "minus",
            "code21": first_sym(keymap, "AE12") or "equal",
        },
        sys.stdout,
        separators=(",", ":"),
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
