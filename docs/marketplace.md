# Marketplace listing (not submitted)

Fill the [submit-plugin](https://github.com/HANCORE-linux/omarchy-plugin-marketplace/issues/new?template=submit-plugin.yml) form **after** `https://github.com/herr-brandt/omarchy-tour` is public. Do not open the issue until then.

## Prepare the repository

- [x] `manifest.json` in the repository root (`omarchy plugin validate .`)
- [x] README and MIT license
- [x] Safe install: `omarchy plugin add <url> --enable`
- [x] Safe removal: `omarchy plugin remove io.github.julio.tour`
- [x] Public GitHub repository
- [ ] Optional preview image (1200×630 or similar; marketplace optimizes it)

## Form answers

| Field | Value |
| --- | --- |
| Plugin repository | `https://github.com/herr-brandt/omarchy-tour` |
| Plugin ID | `io.github.julio.tour` |
| Name | Tour |
| Category | Desktop |
| Tags | `tour`, `onboarding`, `bar`, `hyprland` |
| Short description | Interactive desktop tour for Omarchy. The bar chip starts it; lessons wait for the shortcut, or Enter shows you. |
| Author | Julio |

## Publish locally, then GitHub

```sh
omarchy plugin validate .
node tests/tour-model.test.js
python3 tests/tour-lights.test.py

gh auth login
gh repo create herr-brandt/omarchy-tour --public --source=. --remote=origin --push
```

Then open the marketplace issue with the table above. Do not submit until Julio says so.
