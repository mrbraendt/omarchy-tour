#!/usr/bin/env python3
"""Optional per-key lighting for the Tour overlay.

Talks to a local OpenRGB SDK server (port 6742) when one is running.
Exits 0 with no effect otherwise — including Cooler Master MasterKeys Pro M
Single white LEDs, which only have on-the-fly FN lighting, not USB per-key maps.
"""

from __future__ import annotations

import json
import os
import socket
import struct
import sys

HOST = "127.0.0.1"
PORT = 6742
TIMEOUT = 0.2
CLIENT_PROTO = 1
MAGIC = b"ORGB"

ID_COUNT = 0
ID_DATA = 1
ID_PROTO = 40
ID_NAME = 50
ID_UPDATELEDS = 1050
ID_CUSTOMMODE = 1100

DEVICE_KEYBOARD = 5
STATE_PATH = os.path.join(os.path.expanduser("~"), ".local", "state", "omarchy", "tour-lights.json")

# Skip pointing-device labels from the overlay keycaps.
SKIP_CAPS = {"Mouse L", "Mouse R", "Print"}

ALIASES = {
    "Super": ("left windows", "right windows", "left gui", "right gui", "left win", "lwin", "super", "meta"),
    "Space": ("space",),
    "Ctrl": ("left control", "right control", "left ctrl", "lctrl", "control"),
    "Alt": ("left alt", "right alt", "lalt", "alt"),
    "Shift": ("left shift", "right shift", "lshift", "shift"),
    "Tab": ("tab",),
    "Esc": ("escape", "esc"),
    "Enter": ("enter", "return"),
    "Left": ("left arrow", "arrow left"),
    "Right": ("right arrow", "arrow right"),
    "Up": ("up arrow", "arrow up"),
    "Down": ("down arrow", "arrow down"),
    "T": ("t",),
    "O": ("o",),
    "V": ("v",),
    "E": ("e",),
    "1": ("1", "n1", "num 1"),
    "2": ("2", "n2"),
    "3": ("3", "n3"),
    "-": ("minus", "oem_minus", "-"),
    "=": ("equals", "equal", "+", "="),
}


def led_norm(name: str) -> str:
    text = name.lower().replace("_", " ")
    if text.startswith("key:"):
        text = text[4:]
    return " ".join(text.split())


def match_led(cap: str, led_name: str) -> bool:
    if cap in SKIP_CAPS:
        return False
    led = led_norm(led_name)
    aliases = ALIASES.get(cap)
    if not aliases:
        aliases = (cap.lower(),)
    for alias in aliases:
        if len(alias) == 1:
            compact = led.replace(" ", "")
            if compact == alias or compact == "key" + alias:
                return True
            if led == alias or led.endswith(" " + alias):
                # Do not match "t" inside "left" / "control".
                parts = led.split()
                if parts and parts[-1] == alias and alias not in {"left", "right"}:
                    return True
            continue
        if alias in led:
            return True
    return False


def matching_indices(caps: list[str], led_names: list[str]) -> list[int]:
    hits: list[int] = []
    seen: set[int] = set()
    for cap in caps:
        for i, name in enumerate(led_names):
            if i in seen:
                continue
            if match_led(cap, name):
                hits.append(i)
                seen.add(i)
                break
    return hits


def u16(buf: bytes, i: int) -> tuple[int, int]:
    return struct.unpack_from("<H", buf, i)[0], i + 2


def u32(buf: bytes, i: int) -> tuple[int, int]:
    return struct.unpack_from("<I", buf, i)[0], i + 4


def i32(buf: bytes, i: int) -> tuple[int, int]:
    return struct.unpack_from("<i", buf, i)[0], i + 4


def read_str(buf: bytes, i: int) -> tuple[str, int]:
    n, i = u16(buf, i)
    if n < 1 or i + n > len(buf):
        raise ValueError("bad string")
    raw = buf[i : i + n]
    i += n
    return raw.split(b"\x00", 1)[0].decode("utf-8", "replace"), i


def skip_mode(buf: bytes, i: int, proto: int) -> int:
    _, i = read_str(buf, i)
    i += 16  # value, flags, speed_min, speed_max
    if proto >= 3:
        i += 8  # brightness min/max
    i += 8  # colors min/max
    i += 4  # speed
    if proto >= 3:
        i += 4  # brightness
    i += 8  # direction, color_mode
    ncolors, i = u16(buf, i)
    i += 4 * ncolors
    return i


def skip_zone(buf: bytes, i: int, proto: int) -> int:
    _, i = read_str(buf, i)
    i += 16  # type, leds_min, leds_max, leds_count
    matrix_len, i = u16(buf, i)
    i += matrix_len
    if proto >= 4:
        nseg, i = u16(buf, i)
        for _ in range(nseg):
            _, i = read_str(buf, i)
            i += 12
            if proto >= 6:
                sm, i = u16(buf, i)
                i += sm
                i += 4
        if proto >= 5:
            i += 4
        if proto >= 6:
            nmodes, i = u16(buf, i)
            i += 4
            for _ in range(nmodes):
                i = skip_mode(buf, i, proto)
    elif proto >= 5:
        i += 4
    return i


def parse_device(buf: bytes, proto: int) -> dict:
    i = 4  # data_size
    dtype, i = i32(buf, i)
    name, i = read_str(buf, i)
    if proto >= 1:
        _, i = read_str(buf, i)  # vendor
    for _ in range(4):
        _, i = read_str(buf, i)  # description, version, serial, location
    nmodes, i = u16(buf, i)
    _, i = i32(buf, i)  # active_mode
    for _ in range(nmodes):
        i = skip_mode(buf, i, proto)
    nzones, i = u16(buf, i)
    for _ in range(nzones):
        i = skip_zone(buf, i, proto)
    nleds, i = u16(buf, i)
    leds = []
    for _ in range(nleds):
        led_name, i = read_str(buf, i)
        if proto < 6:
            i += 4  # led_value
        leds.append(led_name)
    ncolors, i = u16(buf, i)
    colors = []
    for _ in range(ncolors):
        c, i = u32(buf, i)
        colors.append(c)
    return {"type": dtype, "name": name, "leds": leds, "colors": colors}


class OpenRgb:
    def __init__(self) -> None:
        self.sock = socket.create_connection((HOST, PORT), TIMEOUT)
        self.sock.settimeout(TIMEOUT)
        self.proto = 0

    def close(self) -> None:
        try:
            self.sock.close()
        except OSError:
            pass

    def send(self, pkt_id: int, dev: int = 0, payload: bytes = b"") -> None:
        header = MAGIC + struct.pack("<III", dev, pkt_id, len(payload))
        self.sock.sendall(header + payload)

    def recv_one(self) -> tuple[int, int, bytes]:
        header = self._recv_exact(16)
        if header[:4] != MAGIC:
            raise ValueError("bad magic")
        dev, pkt_id, size = struct.unpack_from("<III", header, 4)
        payload = self._recv_exact(size) if size else b""
        return pkt_id, dev, payload

    def recv_expect(self, expected: int) -> tuple[int, bytes]:
        for _ in range(12):
            pkt_id, dev, payload = self.recv_one()
            if pkt_id == expected:
                return dev, payload
        raise ValueError("missing packet")

    def _recv_exact(self, n: int) -> bytes:
        chunks = bytearray()
        while len(chunks) < n:
            piece = self.sock.recv(n - len(chunks))
            if not piece:
                raise ConnectionError("closed")
            chunks.extend(piece)
        return bytes(chunks)

    def handshake(self) -> None:
        self.send(ID_NAME, payload=b"Tour\x00")
        self.send(ID_PROTO, payload=struct.pack("<I", CLIENT_PROTO))
        _, payload = self.recv_expect(ID_PROTO)
        if len(payload) < 4:
            raise ValueError("no protocol")
        server = struct.unpack_from("<I", payload, 0)[0]
        self.proto = min(CLIENT_PROTO, server)

    def devices(self) -> list[tuple[int, dict]]:
        self.send(ID_COUNT)
        _, payload = self.recv_expect(ID_COUNT)
        if len(payload) < 4:
            raise ValueError("no count")
        count = struct.unpack_from("<I", payload, 0)[0]
        out = []
        for idx in range(count):
            self.send(ID_DATA, dev=idx, payload=struct.pack("<I", self.proto))
            dev, data = self.recv_expect(ID_DATA)
            parsed = parse_device(data, self.proto)
            out.append((idx, parsed))
            del dev
        return out

    def custom_mode(self, dev: int) -> None:
        self.send(ID_CUSTOMMODE, dev=dev)

    def update_leds(self, dev: int, colors: list[int]) -> None:
        payload = struct.pack("<IH", 4 + 2 + 4 * len(colors), len(colors))
        payload += b"".join(struct.pack("<I", c & 0xFFFFFFFF) for c in colors)
        self.send(ID_UPDATELEDS, dev=dev, payload=payload)


def rgb(r: int, g: int, b: int) -> int:
    return (b << 16) | (g << 8) | r


ON = rgb(255, 255, 255)
OFF = rgb(0, 0, 0)


def load_state() -> dict | None:
    try:
        with open(STATE_PATH, encoding="utf-8") as fh:
            data = json.load(fh)
        if isinstance(data, dict) and data.get("devices"):
            return data
    except (OSError, json.JSONDecodeError):
        return None
    return None


def save_state(devices: list[dict]) -> None:
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    tmp = STATE_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump({"devices": devices}, fh)
        fh.write("\n")
    os.replace(tmp, STATE_PATH)


def clear_state() -> None:
    try:
        os.remove(STATE_PATH)
    except OSError:
        pass


def pick_keyboards(devices: list[tuple[int, dict]]) -> list[tuple[int, dict]]:
    keyed = []
    for dev, info in devices:
        name = (info.get("name") or "").lower()
        leds = info.get("leds") or []
        if info.get("type") == DEVICE_KEYBOARD or "keyboard" in name:
            keyed.append((dev, info))
        elif len(leds) >= 40 and any("key" in led_norm(n) for n in leds[:12]):
            keyed.append((dev, info))
    return keyed


def highlight(caps: list[str]) -> None:
    client = OpenRgb()
    try:
        client.handshake()
        devices = pick_keyboards(client.devices())
        if not devices:
            return
        state = load_state()
        saved = {item["id"]: item["colors"] for item in (state or {}).get("devices", [])}
        snapshot = []
        for dev, info in devices:
            colors = list(info["colors"])
            if len(colors) != len(info["leds"]):
                colors = [OFF] * len(info["leds"])
            if dev not in saved:
                saved[dev] = list(colors)
            snapshot.append({"id": dev, "colors": saved[dev]})
            hits = matching_indices(caps, info["leds"])
            painted = [OFF] * len(info["leds"])
            if hits:
                for idx in hits:
                    painted[idx] = ON
            else:
                painted = list(saved[dev])
            client.custom_mode(dev)
            client.update_leds(dev, painted)
        save_state(snapshot)
    finally:
        client.close()


def restore() -> None:
    state = load_state()
    if not state:
        return
    client = OpenRgb()
    try:
        client.handshake()
        present = {dev: info for dev, info in client.devices()}
        for item in state.get("devices", []):
            dev = int(item["id"])
            colors = [int(c) for c in item.get("colors") or []]
            if dev not in present or not colors:
                continue
            client.custom_mode(dev)
            client.update_leds(dev, colors)
    finally:
        client.close()
        clear_state()


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        return 0
    action = argv[1]
    try:
        if action == "highlight":
            highlight(argv[2:])
        elif action == "restore":
            restore()
    except (OSError, ValueError, TimeoutError, ConnectionError, struct.error):
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
