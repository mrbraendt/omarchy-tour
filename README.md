# Tour

An interactive tour of the Omarchy desktop. It is not a keybinding list.

A card sits at the bottom of the screen, names one idea, and waits. Press the
shortcut to try it. Enter shows you. Escape closes. The **Tour** chip on the
bar starts it.

Built for people arriving from Ubuntu, macOS, or Windows: there is no dock,
windows tile instead of floating, and the agent can finish setup when something
does not work out of the box.

Requires [Omarchy Quattro](https://omarchy.org/). No extra packages. No sudo.

The plugin does not edit Hyprland, `shell.json`, or `omarchy-menu.jsonc`. It
only writes `~/.local/state/omarchy/tour.json`.

## Install

```sh
omarchy plugin add https://github.com/herr-brandt/omarchy-tour.git --enable
```

The bar chip is highlighted until you finish the tour or right-click it. It
does not open by itself.

```sh
omarchy-shell shell summon io.github.julio.tour '{}'
```

From a local checkout:

```sh
omarchy plugin add "$PWD" --enable
```

## Usage

**Tour of Omarchy**: **1** Short, **2** Standard, **3** Extensive. Enter starts
Standard.

Window lessons run as one block. Two numbered demo windows appear for tiling,
move, snap, resize, and pop-out, then close so you can look at the rest of the
desktop again.

| Key | Action |
| --- | --- |
| ← → or the arrow buttons | Previous / next lesson |
| The keys on the card | Try the feature |
| Enter | Show me / continue / recap / finish |
| Escape | Close |

| Length | What you get |
| --- | --- |
| Short | Menu, tiling, workspaces, files, agent |
| Standard | Plus move, snap, terminal, browser, two monitors, bar, clipboard |
| Extensive | Plus resize, pop-out, every shortcut, themes |

```sh
omarchy-shell shell toggle io.github.julio.tour '{}'
```

Optional: add it under Learn in Super+Space yourself. Tour never writes
`~/.config/omarchy/extensions/omarchy-menu.jsonc`.

```jsonc
"learn.tour": {
  "icon": "󰗲",
  "label": "Desktop tour",
  "action": "omarchy-shell shell summon io.github.julio.tour '{}'"
}
```

## Remove

```sh
omarchy plugin remove io.github.julio.tour
rm -f ~/.local/state/omarchy/tour.json ~/.local/state/omarchy/tour-lights.json
```

## Marketplace

Listing metadata for [omarchyplugins.com](https://omarchyplugins.com/):

- Category: `Desktop`
- Tags: `tour`, `onboarding`, `bar`, `hyprland`
- License: MIT (see `LICENSE`)
- Repository: `https://github.com/herr-brandt/omarchy-tour`

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
