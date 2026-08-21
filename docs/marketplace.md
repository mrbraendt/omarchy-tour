# Marketplace listing

Submitted: https://github.com/HANCORE-linux/omarchy-plugin-marketplace/issues/1326

## Prepare the repository

- [x] `manifest.json` in the repository root (`omarchy plugin validate .`)
- [x] README and MIT license
- [x] Safe install: `omarchy plugin add <url> --enable`
- [x] Safe removal: `omarchy plugin remove io.github.herr-brandt.tour`
- [x] Public GitHub repository
- [x] Optional preview image (1200×630 or similar; marketplace optimizes it)

## Form answers

| Field | Value |
| --- | --- |
| Plugin repository | `https://github.com/herr-brandt/omarchy-tour` |
| Plugin ID | `io.github.herr-brandt.tour` |
| Name | Tour |
| Category | Desktop |
| Tags | `tour`, `onboarding`, `bar`, `hyprland` |
| Short description | Interactive desktop tour for Omarchy. The bar chip starts it; lessons wait for the shortcut, or Enter shows you. |
| Author | herr-brandt |

## Publish locally, then GitHub

```sh
omarchy plugin validate .
node tests/tour-model.test.js
python3 tests/tour-lights.test.py

gh auth login
gh repo create herr-brandt/omarchy-tour --public --source=. --remote=origin --push
```

Submitted with category Desktop and tags `bar`, `hyprland`, `quickshell`. Suggested extra tag: `onboarding`.
