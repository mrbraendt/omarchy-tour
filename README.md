# Tour

An interactive tour of the Omarchy desktop. Learn and understand the
keyboard, keybindings, shortcuts, tiling windows, workspaces, and the bar.

A card sits at the bottom of the screen, names one idea, and waits. Press the
shortcut to try it. Enter shows you. Escape closes. The **Tour** chip on the
bar starts it.

Built for people arriving from Ubuntu, macOS, or Windows: there is no dock,
windows tile instead of floating, and an AI agent can help set up the computer
if you connect a ChatGPT-style subscription.

Requires [Omarchy Quattro](https://omarchy.org/) (tested on 4.5). No extra packages. No sudo.

The plugin does not edit Hyprland, `shell.json`, or `omarchy-menu.jsonc`. It
only writes `~/.local/state/omarchy/tour.json`.

## Install

```sh
omarchy plugin add https://github.com/mrbraendt/omarchy-tour.git --enable
```

The bar chip is highlighted until you finish the tour or right-click it. It
does not open by itself.

```sh
omarchy-shell shell summon io.github.herr-brandt.tour '{}'
```

From a local checkout:

```sh
omarchy plugin add "$PWD" --enable
```

## Usage

**Tour of Omarchy**: press **1** Short, **2** Standard, or **3** Extensive, or
pick one and press Enter. Each choice shows what it covers and how many lessons
it has. Esc closes the tour.

Window lessons open Files, the browser, and a terminal first, then teach tiling
on those windows. Super + W closes them so you finish on the same desktop you
started with. The tour card stays out of the way: you can click windows and
use Super + W while those lessons are on screen.

| Key | Action |
| --- | --- |
| ← → or the arrow buttons | Previous / next lesson |
| The keys on the card | Try the feature |
| Enter | Show me / continue / finish |
| ↑ ↓ or Page Up/Down | Scroll the map on the last card |
| Escape | Close |

| Length | What you get |
| --- | --- |
| Short | Menu, Files, browser, tiling, close, playground, bar, workspaces, AI agent |
| Standard | Plus terminal, move, swap, bar center/right, look and background, clipboard, two monitors |
| Extensive | Plus resize, pop-out, full screen, every shortcut |

The card shows where you are (section and `3 / 21`). The AI agent lesson only
appears when an agent is set up; the two-monitor lesson only with two screens.

```sh
omarchy-shell shell toggle io.github.herr-brandt.tour '{}'
```

Optional: add it under Learn in Super+Space yourself. Tour never writes
`~/.config/omarchy/extensions/omarchy-menu.jsonc`.

```jsonc
"learn.tour": {
  "icon": "󰗲",
  "label": "Desktop tour",
  "action": "omarchy-shell shell summon io.github.herr-brandt.tour '{}'"
}
```

## Remove

```sh
omarchy plugin remove io.github.herr-brandt.tour
rm -f ~/.local/state/omarchy/tour.json ~/.local/state/omarchy/tour-lights.json
```

## Marketplace

Listing metadata for [omarchyplugins.com](https://omarchyplugins.com/):

- Category: `Desktop`
- Tags: `tour`, `onboarding`, `bar`, `hyprland`
- License: MIT (see `LICENSE`)
- Repository: `https://github.com/mrbraendt/omarchy-tour`

Filled-in form answers live in [`docs/marketplace.md`](docs/marketplace.md).

Community plugins run unsandboxed. Marketplace listing is not a security
audit. Review this repository before you enable it.

## Develop

```sh
node tests/tour-model.test.js
python3 tests/tour-lights.test.py
omarchy plugin validate .
```

## License

MIT. See `LICENSE`.
