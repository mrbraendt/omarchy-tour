// Pure tour script. QML maps Qt keys to { key, meta, alt, ctrl, shift }.

function lengthIds() {
  return ["short", "standard", "extensive"]
}

function allSteps() {
  return [
    {
      id: "menu",
      title: "The menu",
      body: "One shortcut for apps, settings, and every Omarchy command. There is no dock.",
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
      id: "tiling",
      title: "Windows tile, they don't float",
      body: "Other operating systems give you free-floating windows you drag and resize. Omarchy tiles: a new window splits the screen and fills the gap. Super + T floats one window if you want that old behavior.",
      emptyBody: "Two demo windows split the screen. That is tiling. Super + T floats one if you want it free again.",
      keys: [{ key: "T", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "float"] }],
      keycaps: ["Super", "T"],
      spotlight: "windows,desktop",
      diagram: "tiling",
      enter: "demo",
      demo: { command: ["tour-demo", "act", "float"] },
      resumeMs: 3500,
      needsWindows: true,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "move",
      title: "Move and resize with Super",
      body: "Hold Super and left-click drag to move a window. Super and right-click drag resizes the split.",
      emptyBody: "Hold Super and left-click drag to move a demo window. Super and right-click drag resizes the split.",
      keys: [],
      keycaps: ["Super", "Mouse L", "Mouse R"],
      spotlight: "windows,desktop",
      diagram: "move",
      enter: "demo",
      demo: null,
      resumeMs: 4000,
      needsWindows: true,
      tracks: ["standard", "extensive"]
    },
    {
      id: "snap",
      title: "Snap by swapping tiles",
      body: "Super + arrows focuses a neighbor. Super + Shift + arrows swaps two tiles. That is how you rearrange — not snap to half the screen.",
      emptyBody: "Super + arrows focuses a neighbor. Super + Shift + arrows swaps the two demo windows.",
      keys: [
        { key: "Left", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "focus", "l"] },
        { key: "Right", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "focus", "r"] },
        { key: "Up", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "focus", "u"] },
        { key: "Down", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "focus", "d"] },
        { key: "Left", meta: true, alt: false, ctrl: false, shift: true, command: ["tour-demo", "act", "swap", "l"] },
        { key: "Right", meta: true, alt: false, ctrl: false, shift: true, command: ["tour-demo", "act", "swap", "r"] },
        { key: "Up", meta: true, alt: false, ctrl: false, shift: true, command: ["tour-demo", "act", "swap", "u"] },
        { key: "Down", meta: true, alt: false, ctrl: false, shift: true, command: ["tour-demo", "act", "swap", "d"] }
      ],
      keycaps: ["Super", "Shift", "Left"],
      spotlight: "windows,desktop",
      diagram: "snap",
      enter: "demo",
      demo: { command: ["tour-demo", "act", "swap", "l"] },
      resumeMs: 1600,
      needsWindows: true,
      tracks: ["standard", "extensive"]
    },
    {
      id: "resize",
      title: "Resize the split from the keyboard",
      body: "Super + minus and Super + equal grow or shrink the focused tile. Super + right-click drag does the same with the mouse.",
      emptyBody: "Super + minus and Super + equal grow or shrink a demo tile.",
      keys: [
        { key: "Minus", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "resize"] },
        { key: "Equal", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "resize"] }
      ],
      keycaps: ["Super", "-", "="],
      spotlight: "windows,desktop",
      diagram: "resize",
      enter: "demo",
      demo: { command: ["tour-demo", "act", "resize"] },
      resumeMs: 1400,
      needsWindows: true,
      tracks: ["extensive"]
    },
    {
      id: "float",
      title: "Pop a window out",
      body: "Super + O floats a window and pins it above the tiles. Super + T only toggles floating.",
      emptyBody: "Super + O pops a demo window out and pins it above the tiles. Super + T only toggles floating.",
      keys: [{ key: "O", meta: true, alt: false, ctrl: false, shift: false, command: ["tour-demo", "act", "pop"] }],
      keycaps: ["Super", "O"],
      spotlight: "windows,desktop",
      diagram: "float",
      enter: "demo",
      demo: { command: ["tour-demo", "act", "pop"] },
      resumeMs: 4000,
      needsWindows: true,
      tracks: ["extensive"]
    },
    {
      id: "workspaces",
      title: "Workspaces, one stack per screen",
      body: "Each monitor has its own stack of workspaces. Super + Tab walks them. Super + 1 through 0 jumps to one. Super + Shift + a number takes the window with you.",
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
      id: "monitors",
      title: "Two monitors",
      body: "Ctrl + Alt + Tab jumps to the other screen. Super + Shift + Alt + Left or Right moves a whole workspace onto that monitor.",
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
      id: "terminal",
      title: "The terminal",
      body: "Super + Return opens a terminal.",
      keys: [{ key: "Enter", meta: true, alt: false, ctrl: false, shift: false }],
      keycaps: ["Super", "Return"],
      spotlight: "app:new,desktop",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-terminal"] },
      resumeMs: 2500,
      tracks: ["standard", "extensive"]
    },
    {
      id: "browser",
      title: "The browser",
      body: "Super + Shift + Return opens the browser. It tiles next to whatever is already open.",
      keys: [{ key: "Enter", meta: true, alt: false, ctrl: false, shift: true }],
      keycaps: ["Super", "Shift", "Return"],
      spotlight: "app:new,desktop",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-browser"] },
      resumeMs: 2500,
      tracks: ["standard", "extensive"]
    },
    {
      id: "files",
      title: "Files",
      body: "Super + Shift + F opens the file manager. Or type Files in the menu.",
      keys: [{ key: "F", meta: true, alt: false, ctrl: false, shift: true }],
      keycaps: ["Super", "Shift", "F"],
      spotlight: "app:new,desktop",
      diagram: "none",
      enter: "demo",
      demo: { command: ["omarchy-launch-nautilus"] },
      resumeMs: 3500,
      tracks: ["short", "standard", "extensive"]
    },
    {
      id: "bar",
      title: "The bar",
      body: "The bar sits on one edge of the screen — top by default. Drag it to any edge. Double-click empty space to toggle transparency. Click a chip for its panel. Tour lives here — click it anytime.",
      keys: [],
      keycaps: [],
      spotlight: "bar",
      diagram: "none",
      enter: "continue",
      demo: null,
      resumeMs: 0,
      tracks: ["standard", "extensive"]
    },
    {
      id: "clipboard",
      title: "Clipboard history",
      body: "Super + Ctrl + V pastes from history, including images. Sensitive copies stay out of the list.",
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
      title: "Ask the agent",
      body: "If a monitor, printer, or speaker does not work, ask the agent. Super + Shift + Ctrl + A opens it. Choose which agent in the menu: Setup → Defaults → Agent.",
      keys: [{ key: "A", meta: true, alt: false, ctrl: true, shift: true }],
      keycaps: ["Super", "Shift", "Ctrl", "A"],
      spotlight: "layer:omarchy.menu,app:org.omarchy.agent,desktop",
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
      id: "theme",
      title: "Look and background",
      body: "Super + Ctrl + Space picks a background. Super + Shift + Ctrl + Space opens themes.",
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
      tracks: ["extensive"]
    },
    {
      id: "done",
      title: "That was the Omarchy tour",
      body: "Learn in the menu has the full manual. Click Tour on the bar to run this again. Press Enter once for a recap of the shortcuts from this tour.",
      keys: [],
      keycaps: [],
      spotlight: "chip:io.github.julio.tour",
      diagram: "none",
      enter: "overview",
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
  return copy
}

function stepApplies(step, opts) {
  if (!step) return false
  var monitors = monitorCountFrom(opts)
  if (step.minMonitors && monitors < step.minMonitors) return false
  if (step.requiresAgent && !hasAgentFrom(opts)) return false
  if (step.requiresLaptop && !isLaptopFrom(opts)) return false
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
    out.push(resolveStep(step, opts))
  }
  return out
}

function lengthMeta(opts) {
  var shortDetail = hasAgentFrom(opts)
    ? "Menu, tiling, workspaces, files, and the agent"
    : "Menu, tiling, workspaces, and files"
  var standardDetail = monitorCountFrom(opts) >= 2
    ? "Plus move, snap, terminal, browser, two monitors, and the bar"
    : "Plus move, snap, terminal, browser, and the bar"
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

function hasKeycaps(step) {
  return !!(step && step.keycaps && step.keycaps.length > 0)
}

function lengthFromKey(name) {
  if (name === "1") return "short"
  if (name === "2") return "standard"
  if (name === "3") return "extensive"
  return ""
}
