// Pure tour script. QML maps Qt keys to { key, meta, alt, ctrl, shift }.

function lengthIds() {
  return ["short", "standard", "extensive"]
}

function allSteps() {
  return [
    {
      id: "apps-ahead",
      title: "Opening applications",
      body: "The next cards show how to open the menu, your files, the browser, and a terminal.",
      section: "apps",
      kind: "title",
      keys: [],
      keycaps: [],
      spotlight: "none",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "menu",
      title: "The menu",
      body: "Super + Space opens every app and setting.",
      section: "apps",
      keys: [{ key: "Space", meta: true, alt: false, ctrl: false, shift: false }],
      keycaps: ["Super", "Space"],
      spotlight: "layer:omarchy.menu",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-menu", "toggle"] },
      resumeMs: 5000,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "files",
      title: "Files",
      body: "Super + Shift + F opens your folders — documents, photos, downloads. You can also type Files in the menu.",
      keys: [{ key: "F", meta: true, alt: false, ctrl: false, shift: true }],
      keycaps: ["Super", "Shift", "F"],
      section: "apps",
      spotlight: "none",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-nautilus"] },
      resumeMs: 3500,
      trackLaunches: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "browser",
      title: "The browser",
      body: "Super + Shift + Return opens the web browser. It shares the screen with whatever is already open.",
      section: "apps",
      keys: [{ key: "Enter", meta: true, alt: false, ctrl: false, shift: true }],
      keycaps: ["Super", "Shift", "Return"],
      spotlight: "none",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-browser"] },
      resumeMs: 2500,
      trackLaunches: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "terminal",
      title: "The terminal",
      body: "Super + Return opens a terminal. Useful if you are a programmer. Most people can skip this later and still use Omarchy just fine.",
      section: "apps",
      keys: [{ key: "Enter", meta: true, alt: false, ctrl: false, shift: false }],
      keycaps: ["Super", "Return"],
      spotlight: "none",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-terminal"] },
      resumeMs: 2500,
      trackLaunches: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "windows-ahead",
      title: "Window Management",
      body: "Opened windows share the screen instead of stacking. The next cards show how to move, swap, float, and close them.",
      section: "windows",
      kind: "title",
      keys: [],
      keycaps: [],
      spotlight: "none",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "tiling",
      title: "Windows tile, don't float",
      body: "Opened windows split the screen and fill the gaps. That is tiling. Super + T floats the selected window and you can drag it anywhere with your mouse or touchpad.",
      section: "windows",
      keys: [{ key: "T", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.float({ action = \"toggle\" })"] }],
      keycaps: ["Super", "T"],
      spotlight: "none",
      diagram: "tiling",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.window.float({ action = \"toggle\" })"] },
      resumeMs: 3500,
      letThrough: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "move",
      title: "Move and resize with Super",
      body: "Click a window, then hold Super and left-click drag to move it. Super and right-click drag resizes the split.",
      section: "windows",
      keys: [],
      keycaps: ["Super", "Mouse L", "Mouse R"],
      spotlight: "none",
      diagram: "move",
      enter: "continue",
      demo: null,
      resumeMs: 4000,
      letThrough: true,
      tracks: ["standard", "extensive"]
    },
    {
      id: "snap",
      title: "Snap by swapping tiles",
      body: "Click a window, then Super + arrows to jump to the next one. Super + Shift + arrows swaps their places. That is how you rearrange tiled windows — they do not snap to half the screen.",
      section: "windows",
      keys: [
        { key: "Left", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.focus({ direction = \"l\" })"] },
        { key: "Right", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.focus({ direction = \"r\" })"] },
        { key: "Up", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.focus({ direction = \"u\" })"] },
        { key: "Down", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.focus({ direction = \"d\" })"] },
        { key: "Left", meta: true, alt: false, ctrl: false, shift: true, command: ["hyprctl", "dispatch", "hl.dsp.window.swap({ direction = \"l\" })"] },
        { key: "Right", meta: true, alt: false, ctrl: false, shift: true, command: ["hyprctl", "dispatch", "hl.dsp.window.swap({ direction = \"r\" })"] },
        { key: "Up", meta: true, alt: false, ctrl: false, shift: true, command: ["hyprctl", "dispatch", "hl.dsp.window.swap({ direction = \"u\" })"] },
        { key: "Down", meta: true, alt: false, ctrl: false, shift: true, command: ["hyprctl", "dispatch", "hl.dsp.window.swap({ direction = \"d\" })"] }
      ],
      keycaps: ["Super", "Shift", "Left"],
      spotlight: "none",
      diagram: "snap",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.window.swap({ direction = \"l\" })"] },
      resumeMs: 1600,
      letThrough: true,
      tracks: ["standard", "extensive"]
    },
    {
      id: "resize",
      title: "Resize the split from the keyboard",
      section: "windows",
      body: "Super and the two keys to the right of 0 grow or shrink the focused tile. Super + right-click drag does the same with the mouse.",
      keys: [
        { key: "Minus", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = -100, y = 0, relative = true })"] },
        { key: "Equal", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = 100, y = 0, relative = true })"] },
        { key: "ß", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = -100, y = 0, relative = true })"] },
        { key: "´", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = 100, y = 0, relative = true })"] }
      ],
      keycaps: ["Super", "-", "="],
      spotlight: "none",
      diagram: "resize",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = -100, y = 0, relative = true })"] },
      resumeMs: 1400,
      letThrough: true,
      tracks: ["extensive"]
    },
    {
      id: "float",
      title: "Pop a window out",
      section: "windows",
      body: "Super + O pops a window out so it stays on top — handy for a video or a calculator. Super + T just lets you drag a window freely.",
      keys: [{ key: "O", meta: true, alt: false, ctrl: false, shift: false, command: ["omarchy-hyprland-window-pop"] }],
      keycaps: ["Super", "O"],
      spotlight: "none",
      diagram: "float",
      enter: "demo",
      demo: { command: ["omarchy-hyprland-window-pop"] },
      resumeMs: 4000,
      letThrough: true,
      tracks: ["extensive"]
    },
    {
      id: "demo-offer",
      title: "Help with two or more windows",
      body: "Need two windows to try this? Press Enter, then use the shortcuts below.",
      section: "windows",
      keys: [],
      keycaps: ["Enter (spawn two windows)"],
      spotlight: "none",
      diagram: "none",
      enter: "demo",
      demo: { command: ["tour-demo", "spawn", "2"] },
      resumeMs: 2500,
      letThrough: true,
      trackLaunches: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "close",
      title: "Close a window",
      body: "Super + W closes the selected window. Click a window first if you need to pick which one.",
      section: "windows",
      keys: [{ key: "W", meta: true, alt: false, ctrl: false, shift: false, command: ["hyprctl", "dispatch", "hl.dsp.window.close()"] }],
      keycaps: ["Super", "W"],
      spotlight: "none",
      diagram: "none",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.window.close()"] },
      resumeMs: 1200,
      letThrough: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "bar",
      title: "The bar",
      body: "This strip along the edge of the screen is the bar — time, wifi, and volume live here. Drag it to another edge if you like. Double-click empty space to toggle transparency. Click Tour anytime to replay this walkthrough.",
      section: "bar",
      kind: "title",
      keys: [],
      keycaps: [],
      spotlight: "bar",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "workspaces",
      title: "The bar: workspaces",
      body: "The numbered pills on the left of the bar are workspaces — extra screens for grouping windows. Super + Tab walks them. Super + 1 through 0 jumps to one. Super + Shift + a number takes the currently selected window (for example your browser) with you.",
      section: "bar",
      keys: [
        { key: "Tab", meta: true, alt: false, ctrl: false, shift: false },
        { key: "1", meta: true, alt: false, ctrl: false, shift: false }
      ],
      keycaps: ["Super", "Tab"],
      spotlight: "chip:omarchy.workspaces",
      diagram: "workspaces",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.focus({ workspace = \"e+1\" })"] },
      resumeMs: 1800,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "bar-center",
      title: "The bar: middle section",
      body: "The middle of the bar is the clock, weather, and a few status icons. Click the clock for the calendar. Click weather for the forecast.",
      section: "bar",
      keys: [],
      keycaps: [],
      spotlight: "bar-section:center",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["standard", "extensive"]
    },
    {
      id: "bar-right",
      title: "The bar: the other end",
      body: "The right side is wifi, volume, bluetooth, and power. Click a chip to change it — the same kinds of controls you would look for in the bottom-right on Windows or the top-right on a Mac.",
      section: "bar",
      keys: [],
      keycaps: [],
      spotlight: "bar-section:right",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["standard", "extensive"]
    },
    {
      id: "extras-ahead",
      title: "A few extras",
      body: "The rest is optional. Skip anything you do not need.",
      section: "extras",
      kind: "title",
      keys: [],
      keycaps: [],
      spotlight: "none",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "theme",
      title: "Look and background",
      body: "Super + Ctrl + Space picks a background. Super + Shift + Ctrl + Space opens themes.",
      section: "extras",
      keys: [
        { key: "Space", meta: true, alt: false, ctrl: true, shift: false },
        { key: "Space", meta: true, alt: false, ctrl: true, shift: true }
      ],
      keycaps: ["Super", "Ctrl", "Space"],
      spotlight: "layer:omarchy.menu",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-menu", "toggle", "background"] },
      resumeMs: 4000,
      tracks: ["standard", "extensive"]
    },
    {
      id: "clipboard",
      title: "Clipboard history",
      body: "Super + Ctrl + V pastes from history, including images. Sensitive copies stay out of the list.",
      section: "extras",
      keys: [{ key: "V", meta: true, alt: false, ctrl: true, shift: false }],
      keycaps: ["Super", "Ctrl", "V"],
      spotlight: "layer:omarchy.clipboard",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-shell", "shell", "toggle", "omarchy.clipboard"] },
      resumeMs: 5000,
      tracks: ["standard", "extensive"]
    },
    {
      id: "agent",
      title: "Ask the AI agent",
      body: "If you connect a subscription such as ChatGPT, Claude, or Gemini in the menu under Setup → Defaults → Agent, that AI agent can help set up this computer, fix errors, and install software — you just describe what you need. Super + Shift + Ctrl + A opens it.",
      section: "extras",
      keys: [{ key: "A", meta: true, alt: false, ctrl: true, shift: true }],
      keycaps: ["Super", "Shift", "Ctrl", "A"],
      spotlight: "layer:omarchy.menu,app:org.omarchy.agent",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-agent", "--pick"] },
      resumeMs: 5000,
      requiresAgent: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "keybindings",
      title: "Every shortcut",
      body: "Super + K opens every shortcut in a searchable list.",
      section: "extras",
      keys: [{ key: "K", meta: true, alt: false, ctrl: false, shift: false }],
      keycaps: ["Super", "K"],
      spotlight: "layer:omarchy.menu",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-menu-keybindings"] },
      resumeMs: 4500,
      tracks: ["extensive"]
    },
    {
      id: "monitors",
      title: "Two monitors",
      body: "Ctrl + Alt + Tab jumps to the other screen. Super + Shift + Alt + Left or Right moves a whole workspace onto that monitor.",
      section: "extras",
      keys: [{ key: "Tab", meta: false, alt: true, ctrl: true, shift: false }],
      keycaps: ["Ctrl", "Alt", "Tab"],
      spotlight: "none",
      diagram: "monitors",
      enter: "demo",
      demo: { command: ["hyprctl", "dispatch", "hl.dsp.focus({ monitor = \"+1\" })"] },
      resumeMs: 2000,
      minMonitors: 2,
      tracks: ["standard", "extensive"]
    },
    {
      id: "done",
      title: "That was the Omarchy tour",
      body: "Click a card below to go back to that lesson. Scroll down to see the rest.",
      section: "done",
      keys: [],
      keycaps: [],
      spotlight: "chip:io.github.herr-brandt.tour",
      diagram: "none",
      enter: "finish",
      demo: null,
      resumeMs: 0,
      tracks: ["short", "standard", "extensive"]
    }
  ]
}

function includesLength(step, length) {
  if (!step || !step.tracks) return false
  for (var i = 0; i < step.tracks.length; i++) {
    if (step.tracks[i] === length) return true
  }
  return false
}

function normalizeLength(value) {
  var id = String(value || "")
  var ids = lengthIds()
  for (var i = 0; i < ids.length; i++) {
    if (ids[i] === id) return id
  }
  return "standard"
}

function monitorCountFrom(opts) {
  if (!opts || opts.monitors === undefined || opts.monitors === null || opts.monitors === "") return 2
  var n = Number(opts.monitors)
  if (!isFinite(n) || n < 1) return 1
  return n
}

function clientCountFrom(opts) {
  if (!opts || opts.clients === undefined || opts.clients === null || opts.clients === "") return 2
  var n = Number(opts.clients)
  if (!isFinite(n) || n < 0) return 0
  return n
}

function windowsMissing(opts) {
  return clientCountFrom(opts) < 2
}

function boolOpt(opts, name, fallback) {
  if (!opts || opts[name] === undefined || opts[name] === null) return fallback
  return opts[name] === true
}

function hasAgentFrom(opts) {
  return boolOpt(opts, "hasAgent", true)
}

function isLaptopFrom(opts) {
  return boolOpt(opts, "laptop", true)
}

function knownDiagrams() {
  return ["none", "tiling", "workspaces", "move", "snap", "monitors", "float", "resize"]
}

function parseSpotlight(value) {
  var raw = String(value || "none").replace(/^\s+|\s+$/g, "")
  if (raw === "bar") return { kind: "bar", id: "" }
  if (raw === "windows") return { kind: "windows", id: "" }
  if (raw === "desktop") return { kind: "desktop", id: "" }
  if (raw.indexOf("bar-section:") === 0) {
    var section = raw.substring(12).replace(/^\s+|\s+$/g, "")
    if (section === "left" || section === "center" || section === "right")
      return { kind: "bar-section", id: section }
  }
  if (raw.indexOf("chip:") === 0) {
    var chip = raw.substring(5).replace(/^\s+|\s+$/g, "")
    if (chip) return { kind: "chip", id: chip }
  }
  if (raw.indexOf("layer:") === 0) {
    var layer = raw.substring(6).replace(/^\s+|\s+$/g, "")
    if (layer) return { kind: "layer", id: layer }
  }
  if (raw.indexOf("app:") === 0) {
    var app = raw.substring(4).replace(/^\s+|\s+$/g, "")
    if (app) return { kind: "app", id: app }
  }
  return { kind: "none", id: "" }
}

function parseSpotlights(value) {
  var raw = String(value || "none")
  if (raw === "none" || !raw.replace(/^\s+|\s+$/g, "").length) return []
  var parts = raw.split(",")
  var out = []
  for (var i = 0; i < parts.length; i++) {
    var parsed = parseSpotlight(parts[i])
    if (parsed.kind !== "none") out.push(parsed)
  }
  return out
}

function spotlightValid(value) {
  var raw = String(value || "none").replace(/^\s+|\s+$/g, "")
  if (raw === "none" || raw === "") return true
  var parts = raw.split(",")
  if (!parts.length) return false
  for (var i = 0; i < parts.length; i++) {
    if (parseSpotlight(parts[i]).kind === "none") return false
  }
  return true
}

function prettyKeysym(sym) {
  var raw = String(sym || "").replace(/^\s+|\s+$/g, "")
  var lower = raw.toLowerCase()
  var named = {
    minus: "-",
    underscore: "-",
    equal: "=",
    plus: "=",
    ssharp: "ß",
    dead_acute: "´",
    acute: "´",
    dead_grave: "`",
    grave: "`",
    dead_circumflex: "^",
    dead_tilde: "~",
    numbersign: "#",
    asterisk: "*",
    apostrophe: "'",
    quotedbl: "\""
  }
  if (named[lower]) return named[lower]
  if (raw.length === 1) return raw
  if (lower.indexOf("dead_") === 0 && raw.length > 5) return raw.substring(5)
  return raw || ""
}

function uniqueStrings(list) {
  var seen = {}
  var out = []
  for (var i = 0; i < list.length; i++) {
    var value = String(list[i] || "")
    if (!value || seen[value]) continue
    seen[value] = true
    out.push(value)
  }
  return out
}

function resizeLeftKey(opts) {
  return prettyKeysym((opts && opts.resizeLeft) || "minus") || "-"
}

function resizeRightKey(opts) {
  return prettyKeysym((opts && opts.resizeRight) || "equal") || "="
}

function resolveStep(step, opts) {
  if (!step) return null
  var copy = {}
  for (var key in step) copy[key] = step[key]
  if (!copy.diagram) copy.diagram = "none"
  if (!copy.spotlight) copy.spotlight = "none"
  if (step.needsWindows && windowsMissing(opts)) {
    if (step.emptyBody) copy.body = step.emptyBody
    if (step.emptyEnter) copy.enter = step.emptyEnter
    if ("emptyDemo" in step) copy.demo = step.emptyDemo
  }
  if (step.id === "resize") {
    var left = resizeLeftKey(opts)
    var right = resizeRightKey(opts)
    copy.body = "Super + " + left + " and Super + " + right + " grow or shrink the focused tile. Super + right-click drag does the same with the mouse."
    copy.keycaps = ["Super", left, right]
    var leftCmd = ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = -100, y = 0, relative = true })"]
    var rightCmd = ["hyprctl", "dispatch", "hl.dsp.window.resize({ x = 100, y = 0, relative = true })"]
    var keys = []
    var leftNames = uniqueStrings(["Minus", "ß", left])
    var rightNames = uniqueStrings(["Equal", "´", right])
    var i
    for (i = 0; i < leftNames.length; i++)
      keys.push({ key: leftNames[i], meta: true, alt: false, ctrl: false, shift: false, command: leftCmd })
    for (i = 0; i < rightNames.length; i++)
      keys.push({ key: rightNames[i], meta: true, alt: false, ctrl: false, shift: false, command: rightCmd })
    copy.keys = keys
  }
  if (step.id === "demo-offer") {
    copy.keycaps = ["Enter (spawn two windows)"]
    var rows = [{ caps: ["Super", "T"], does: "Float the selected window, then drag it" }]
    var length = (opts && opts.tourLength) || ""
    if (length === "standard" || length === "extensive") {
      rows.push({ caps: ["Super", "arrows"], does: "Jump to the next tiled window" })
      rows.push({ caps: ["Super", "Shift", "arrows"], does: "Swap two tiled windows" })
      rows.push({ caps: ["Super", "Mouse L"], does: "Hold Super and drag to move" })
    }
    if (length === "extensive") {
      rows.push({ caps: ["Super", resizeLeftKey(opts)], does: "Shrink or grow the split" })
      rows.push({ caps: ["Super", "O"], does: "Keep a window on top" })
    }
    copy.practiceCaps = rows
  }
  if (step.id === "extras-ahead") {
    var extraLength = (opts && opts.tourLength) || ""
    if (extraLength === "short")
      copy.body = "One extra if you want it: the AI agent, if you connect a subscription."
    else if (extraLength === "extensive")
      copy.body = "Look and background, clipboard history, every shortcut, two screens if you have them, and the AI agent."
    else
      copy.body = "Look and background, clipboard history, two screens if you have them, and the AI agent."
  }
  return copy
}

function launchCountFrom(opts) {
  if (!opts || opts.launchCount === undefined || opts.launchCount === null || opts.launchCount === "") return 0
  var n = Number(opts.launchCount)
  if (!isFinite(n) || n < 0) return 0
  return n
}

function stepApplies(step, opts) {
  if (!step) return false
  var monitors = monitorCountFrom(opts)
  if (step.minMonitors && monitors < step.minMonitors) return false
  if (step.requiresAgent && !hasAgentFrom(opts)) return false
  if (step.requiresLaptop && !isLaptopFrom(opts)) return false
  if (step.requiresFewWindows && launchCountFrom(opts) >= 2) return false
  return true
}

function stepsFor(length, opts) {
  var id = normalizeLength(length)
  var all = allSteps()
  var out = []
  for (var i = 0; i < all.length; i++) {
    var step = all[i]
    if (!includesLength(step, id)) continue
    if (!stepApplies(step, opts)) continue
    var merged = {}
    if (opts) {
      for (var k in opts) merged[k] = opts[k]
    }
    merged.tourLength = id
    out.push(resolveStep(step, merged))
  }
  return out
}

function lengthMeta(opts) {
  var shortDetail = hasAgentFrom(opts)
    ? "Open apps, tile them, close them, workspaces, and the agent"
    : "Open apps, tile them, close them, and workspaces"
  var standardDetail = monitorCountFrom(opts) >= 2
    ? "Plus move, snap, two monitors, and the bar"
    : "Plus move, snap, and the bar"
  return [
    {
      id: "short",
      key: "1",
      label: "Short Tour",
      detail: shortDetail,
      count: stepsFor("short", opts).length
    },
    {
      id: "standard",
      key: "2",
      label: "Standard Tour",
      detail: standardDetail,
      count: stepsFor("standard", opts).length
    },
    {
      id: "extensive",
      key: "3",
      label: "Extensive Tour",
      detail: "Resize, pop-out windows, keybindings, and themes",
      count: stepsFor("extensive", opts).length
    }
  ]
}

function stepAt(length, index, opts) {
  var list = stepsFor(length, opts)
  if (index < 0 || index >= list.length) return null
  return list[index]
}

function lastIndex(length, opts) {
  return Math.max(0, stepsFor(length, opts).length - 1)
}

function progressLabel(index, total) {
  var n = Number(total)
  if (!isFinite(n) || n < 1) n = 1
  return (index + 1) + " of " + n
}

function lengthLabel(length) {
  var meta = lengthMeta()
  var id = normalizeLength(length)
  for (var i = 0; i < meta.length; i++) {
    if (meta[i].id === id) return meta[i].label
  }
  return "Standard Tour"
}

function sameBool(a, b) {
  return !!a === !!b
}

function comboMatches(combo, ev) {
  if (!combo || !ev) return false
  if (String(combo.key) !== String(ev.key)) return false
  if (!sameBool(combo.meta, ev.meta)) return false
  if (!sameBool(combo.alt, ev.alt)) return false
  if (!sameBool(combo.ctrl, ev.ctrl)) return false
  if (!sameBool(combo.shift, ev.shift)) return false
  return true
}

function matches(step, ev) {
  return matchingCombo(step, ev) !== null
}

function matchingCombo(step, ev) {
  if (!step || !step.keys || step.keys.length === 0) return null
  for (var i = 0; i < step.keys.length; i++) {
    if (comboMatches(step.keys[i], ev)) return step.keys[i]
  }
  return null
}

function demoCommand(step, ev) {
  var combo = ev ? matchingCombo(step, ev) : null
  if (combo && combo.command && combo.command.length) return combo.command
  if (step && step.demo && step.demo.command && step.demo.command.length) return step.demo.command
  return null
}

function prevIndex(length, index, opts) {
  var n = Number(index)
  if (!isFinite(n) || n <= 0) return 0
  return n - 1
}

function isLast(length, index, opts) {
  return index >= lastIndex(length, opts)
}

function nextIndex(length, index, opts) {
  var last = lastIndex(length, opts)
  var n = Number(index)
  if (!isFinite(n) || n < 0) return 0
  if (n >= last) return last
  return n + 1
}

function parseState(raw) {
  var fallback = { completed: false, skipped: false, seen: false, length: "standard", version: 1 }
  if (typeof raw !== "string" || !raw.replace(/^\s+|\s+$/g, "").length) return fallback
  try {
    var data = JSON.parse(raw)
    return {
      completed: data && data.completed === true,
      skipped: data && data.skipped === true,
      seen: data && data.seen === true,
      length: normalizeLength(data && data.length),
      version: (data && data.version) || 1
    }
  } catch (e) {
    return fallback
  }
}

function serializeState(completed, length, skipped, seen) {
  return JSON.stringify({
    version: 1,
    completed: completed === true,
    skipped: skipped === true,
    seen: seen === true,
    length: normalizeLength(length)
  }, null, 2) + "\n"
}

function chipNudge(state) {
  if (!state) return true
  return state.completed !== true && state.skipped !== true && state.seen !== true
}

function canPractice(step) {
  return !!(step && step.keys && step.keys.length)
}

function enterAction(step) {
  if (!step || !step.enter) return "continue"
  return step.enter
}

function overviewItems(length, opts) {
  var list = stepsFor(length, opts)
  var out = []
  for (var i = 0; i < list.length; i++) {
    var step = list[i]
    if (!step || step.id === "done") continue
    if (!step.keycaps || !step.keycaps.length) continue
    var keys = []
    for (var k = 0; k < step.keycaps.length; k++) keys.push(step.keycaps[k])
    out.push({ title: step.title, keys: keys.join(" + ") })
  }
  return out
}

function isTitleCard(step) {
  return !!(step && step.kind === "title")
}

function sectionLabel(id) {
  if (id === "apps") return "Open things"
  if (id === "windows") return "Window management"
  if (id === "bar") return "The bar"
  if (id === "extras") return "A few extras"
  return ""
}

function overviewGroups(length, opts) {
  var list = stepsFor(length, opts)
  var groups = []
  var current = null
  for (var i = 0; i < list.length; i++) {
    var step = list[i]
    if (!step || step.id === "done" || isTitleCard(step)) continue
    var sec = step.section || ""
    if (!current || current.id !== sec) {
      current = { id: sec, label: sectionLabel(sec), items: [] }
      groups.push(current)
    }
    var keys = ""
    if (step.keycaps && step.keycaps.length) {
      var caps = []
      for (var k = 0; k < step.keycaps.length; k++) caps.push(step.keycaps[k])
      keys = caps.join(" + ")
    }
    current.items.push({
      id: step.id,
      title: step.title,
      keys: keys,
      index: i
    })
  }
  return groups
}

function hasKeycaps(step) {
  return !!(step && step.keycaps && step.keycaps.length > 0)
}

function lengthFromKey(name) {
  if (name === "1") return "short"
  if (name === "2") return "standard"
  if (name === "3") return "extensive"
  return ""
}
