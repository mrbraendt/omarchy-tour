pragma ComponentBehavior: Bound
import QtQuick
import Quickshell
import Quickshell.Io
import Quickshell.Wayland
import qs.Commons
import qs.Ui
import "TourModel.js" as TourModel

Item {
  id: root

  property var shell: null
  property var manifest: null

  property bool opened: false
  property bool paused: false
  property bool choosing: true
  property string lengthId: "standard"
  property int stepIndex: 0
  property var step: null
  property var keycaps: []
  property int keyBeat: 0
  property int highlightedLength: 1
  property bool practiced: false
  property bool spawnedDemos: false
  property bool overviewing: false
  property bool slideEnabled: true
  property bool hasAgent: true
  property bool isLaptop: true
  property var skipSnapshot: null

  readonly property string pluginId: (root.manifest && root.manifest.id) || "io.github.julio.tour"
  readonly property string statePath: Quickshell.env("HOME") + "/.local/state/omarchy/tour.json"
  property int monitorCount: 2
  property int clientCount: 2
  readonly property var lengthOptions: TourModel.lengthMeta(root.trackOpts())
  readonly property int stepTotal: TourModel.stepsFor(root.lengthId, root.trackOpts()).length
  readonly property bool canGoBack: !root.choosing && root.stepIndex > 0
  readonly property bool canGoForward: !root.choosing && root.stepIndex < Math.max(0, root.stepTotal - 1)
  readonly property bool onLast: !root.choosing && TourModel.isLast(root.lengthId, root.stepIndex, root.trackOpts())
  readonly property string diagramKind: (!root.choosing && root.step && root.step.diagram) ? String(root.step.diagram) : "none"
  readonly property bool showHints: root.choosing || root.stepIndex === 0 || root.onLast
  readonly property var overviewItems: TourModel.overviewItems(root.lengthId, root.trackOpts())

  property color background: Color.menu.background
  property color foreground: Color.menu.text
  property color border: Color.menu.border
  property var borderSpec: Border.surfaceSpec("menu", "border", border, Math.max(1, Style.space(1)))
  property color scrim: Util.alpha(Color.background, 0.22)
  readonly property int cornerRadius: Math.max(Style.cornerRadius, Style.space(16))
  property string fontFamily: Style.font.menuFamily
  readonly property int cardPad: Math.max(Style.spacing.panelPadding, Style.space(32))

  readonly property bool panelVisible: root.opened
  readonly property bool showKeycaps: !root.choosing && root.nonempty(root.keycaps)

  function nonempty(list) {
    return !!(list && list.length)
  }

  function trackOpts() {
    return {
      monitors: root.skipSnapshot ? root.skipSnapshot.monitors : root.monitorCount,
      clients: root.clientCount,
      hasAgent: root.skipSnapshot ? root.skipSnapshot.hasAgent : root.hasAgent,
      laptop: root.skipSnapshot ? root.skipSnapshot.laptop : root.isLaptop
    }
  }

  function pluginFile(name) {
    var dir = (root.manifest && root.manifest.__sourceDir) || ""
    if (dir) return String(dir).replace(/\/$/, "") + "/" + name
    var url = Qt.resolvedUrl(name).toString()
    if (url.indexOf("file://") === 0) url = url.substring(7)
    return url
  }

  function lightsPath() {
    return root.pluginFile("tour-lights.py")
  }

  function runLights(args) {
    var script = root.lightsPath()
    if (!script) return
    var cmd = ["python3", script]
    for (var i = 0; i < args.length; i++) cmd.push(String(args[i]))
    Quickshell.execDetached(cmd)
  }

  function syncLights() {
    if (!root.opened || root.paused) {
      root.runLights(["restore"])
      return
    }
    var caps = []
    if (root.choosing) {
      caps.push("1")
      caps.push("2")
      caps.push("3")
    } else if (root.keycaps) {
      for (var i = 0; i < root.keycaps.length; i++) caps.push(root.keycaps[i])
    }
    var args = ["highlight"]
    for (var j = 0; j < caps.length; j++) args.push(caps[j])
    root.runLights(args)
  }

  function probeAll() {
    monitorProbe.running = false
    monitorProbe.running = true
    clientProbe.running = false
    clientProbe.running = true
    laptopProbe.running = false
    laptopProbe.running = true
    agentProbe.running = false
    agentProbe.running = true
  }

  Component.onCompleted: root.probeAll()

  function refocus() {
    Qt.callLater(function() {
      keyCatcher.forceActiveFocus()
      root.syncLights()
    })
  }

  function markSeen() {
    var current = TourModel.parseState(stateFile.text())
    if (current.seen || current.completed || current.skipped) return
    Quickshell.execDetached(["mkdir", "-p", Quickshell.env("HOME") + "/.local/state/omarchy"])
    stateFile.setText(TourModel.serializeState(current.completed, current.length, current.skipped, true))
  }

  function resetDemoWindows() {
    if (!root.spawnedDemos) return
    Quickshell.execDetached(["bash", root.pluginFile("tour-demo.sh"), "reset"])
  }

  function syncDemoWindows(step) {
    if (step && step.needsWindows) {
      if (root.spawnedDemos) root.resetDemoWindows()
      else root.ensureDemoWindows()
    } else {
      root.cleanupDemos()
    }
  }

  function execTourCommand(cmd) {
    if (!cmd || !cmd.length) return
    var out = []
    for (var i = 0; i < cmd.length; i++) out.push(String(cmd[i]))
    if (out[0] === "tour-demo") {
      out[0] = root.pluginFile("tour-demo.sh")
      out.unshift("bash")
    }
    Quickshell.execDetached(out)
  }

  function ensureDemoWindows() {
    if (root.spawnedDemos) return
    Quickshell.execDetached(["bash", root.pluginFile("tour-demo.sh"), "spawn", "2"])
    root.spawnedDemos = true
    root.clientCount = Math.max(root.clientCount, 2)
    demoProbeTimer.restart()
  }

  function cleanupDemos() {
    if (!root.spawnedDemos) return
    root.spawnedDemos = false
    Quickshell.execDetached(["bash", root.pluginFile("tour-demo.sh"), "close"])
  }

  function open(payloadJson) {
    var payload = ({})
    try { payload = JSON.parse(payloadJson || "{}") } catch (e) { payload = ({}) }
    root.paused = false
    resumeTimer.stop()
    practiceTimer.stop()
    keyBeat = 0
    root.practiced = false
    root.overviewing = false
    root.skipSnapshot = null
    root.markSeen()
    if (payload.length) {
      root.startLength(payload.length)
    } else {
      root.choosing = true
      root.lengthId = "standard"
      root.highlightedLength = 1
      root.stepIndex = 0
      root.step = null
      root.keycaps = []
    }
    root.opened = true
    root.probeAll()
    root.refocus()
  }

  function close() {
    resumeTimer.stop()
    practiceTimer.stop()
    root.paused = false
    root.practiced = false
    root.overviewing = false
    root.opened = false
    root.cleanupDemos()
    root.runLights(["restore"])
  }

  function dismiss() {
    resumeTimer.stop()
    practiceTimer.stop()
    root.paused = false
    root.practiced = false
    root.overviewing = false
    root.opened = false
    root.cleanupDemos()
    root.runLights(["restore"])
    if (root.shell && typeof root.shell.hide === "function")
      root.shell.hide(root.pluginId)
  }

  function toggle() {
    if (root.opened) root.dismiss()
    else root.open("{}")
  }

  function startLength(id) {
    root.skipSnapshot = {
      monitors: root.monitorCount,
      hasAgent: root.hasAgent,
      laptop: root.isLaptop
    }
    root.lengthId = TourModel.normalizeLength(id)
    root.choosing = false
    root.paused = false
    root.applyStep(0, true)
  }

  function loadStep(index) {
    var next = TourModel.stepAt(root.lengthId, index, root.trackOpts())
    var caps = []
    if (next && next.keycaps) {
      for (var i = 0; i < next.keycaps.length; i++) caps.push(next.keycaps[i])
    }
    root.paused = false
    resumeTimer.stop()
    practiceTimer.stop()
    root.practiced = false
    root.overviewing = false
    root.stepIndex = index
    root.step = next
    root.keycaps = caps
    root.keyBeat = 0
    root.syncDemoWindows(next)
    root.refocus()
  }

  function applyStep(index, instant) {
    var shouldSlide = !instant && !root.choosing && root.step !== null && index !== root.stepIndex
    var dir = index > root.stepIndex ? 1 : -1
    if (shouldSlide) {
      root.slideEnabled = false
      lessonPane.x = dir * Style.space(56)
      lessonPane.opacity = 0
      root.loadStep(index)
      Qt.callLater(function() {
        root.slideEnabled = true
        lessonPane.x = 0
        lessonPane.opacity = 1
      })
      return
    }
    root.loadStep(index)
    lessonPane.x = 0
    lessonPane.opacity = 1
  }

  function finish() {
    Quickshell.execDetached(["mkdir", "-p", Quickshell.env("HOME") + "/.local/state/omarchy"])
    stateFile.setText(TourModel.serializeState(true, root.lengthId, false, true))
    root.dismiss()
  }

  function goBack() {
    if (root.choosing || root.stepIndex <= 0) return
    if (root.overviewing) {
      root.overviewing = false
      return
    }
    root.applyStep(TourModel.prevIndex(root.lengthId, root.stepIndex, root.trackOpts()))
  }

  function goForward() {
    if (root.choosing) return
    if (root.onLast) {
      root.onLastEnter()
      return
    }
    root.applyStep(TourModel.nextIndex(root.lengthId, root.stepIndex, root.trackOpts()))
  }

  function runDemo(step, ev) {
    root.paused = true
    root.syncLights()
    root.execTourCommand(TourModel.demoCommand(step, ev || null))
    resumeTimer.interval = Math.max(800, Number(step && step.resumeMs) || 4000)
    resumeTimer.restart()
  }

  function practice(ev) {
    if (root.paused || root.practiced) return
    root.practiced = true
    var cmd = TourModel.demoCommand(root.step, ev)
    if (cmd && cmd.length) {
      root.paused = true
      root.syncLights()
      root.execTourCommand(cmd)
    }
    practiceTimer.interval = (root.step && root.step.needsWindows)
      ? Math.max(1200, Number(root.step.resumeMs) || 1600)
      : 850
    practiceTimer.restart()
  }

  function onLastEnter() {
    if (TourModel.enterAction(root.step) === "overview" && !root.overviewing) {
      root.overviewing = true
      return
    }
    root.finish()
  }

  function onEnter() {
    if (root.choosing) {
      root.startLength(root.highlightedLength === 0 ? "short" : (root.highlightedLength === 2 ? "extensive" : "standard"))
      return
    }
    var action = TourModel.enterAction(root.step)
    if (action === "finish" || action === "overview") root.onLastEnter()
    else if (action === "demo") root.runDemo(root.step)
    else root.goForward()
  }

  function onEscape() {
    root.dismiss()
  }

  function eventFromQt(event) {
    var name = ""
    if (event.key === Qt.Key_Escape) name = "Escape"
    else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) name = "Enter"
    else if (event.key === Qt.Key_Space) name = "Space"
    else if (event.key === Qt.Key_Tab) name = "Tab"
    else if (event.key === Qt.Key_Left) name = "Left"
    else if (event.key === Qt.Key_Right) name = "Right"
    else if (event.key === Qt.Key_Up) name = "Up"
    else if (event.key === Qt.Key_Down) name = "Down"
    else if (event.key === Qt.Key_Minus) name = "Minus"
    else if (event.key === Qt.Key_Equal) name = "Equal"
    else if (event.key === Qt.Key_Print) name = "Print"
    else if (event.key >= Qt.Key_0 && event.key <= Qt.Key_9) name = String(event.key - Qt.Key_0)
    else if (event.key >= Qt.Key_A && event.key <= Qt.Key_Z) name = String.fromCharCode(event.key)
    return {
      key: name,
      meta: !!(event.modifiers & Qt.MetaModifier),
      alt: !!(event.modifiers & Qt.AltModifier),
      ctrl: !!(event.modifiers & Qt.ControlModifier),
      shift: !!(event.modifiers & Qt.ShiftModifier)
    }
  }

  component NavArrow: Rectangle {
    id: arrow
    property bool active: true
    property string glyph: "→"
    signal activated()

    width: Style.space(44)
    height: Style.space(44)
    radius: width / 2
    color: Util.alpha(root.foreground, arrow.active && hover.containsMouse ? 0.14 : 0.06)
    opacity: arrow.active ? 1 : 0.28
    border.width: 0

    Text {
      anchors.centerIn: parent
      text: arrow.glyph
      color: root.foreground
      font.family: root.fontFamily
      font.pixelSize: Style.font.heading
      font.bold: true
    }

    MouseArea {
      id: hover
      anchors.fill: parent
      enabled: arrow.active
      hoverEnabled: true
      cursorShape: Qt.PointingHandCursor
      onClicked: arrow.activated()
    }
  }

  component LessonDiagram: Item {
    id: diagram
    property string kind: "none"
    readonly property bool active: diagram.kind && diagram.kind !== "none"
    visible: diagram.active
    height: diagram.active ? Style.space(108) : 0
    clip: true

    readonly property color stage: Util.alpha(root.foreground, 0.05)
    readonly property color pane: Util.alpha(root.foreground, 0.12)
    readonly property color paneHi: Util.alpha(Color.accent, 0.28)
    readonly property int gap: Style.space(6)
    readonly property int rad: Math.min(root.cornerRadius, Style.space(8))

    Rectangle {
      anchors.fill: parent
      radius: Math.min(root.cornerRadius, Style.space(12))
      color: diagram.stage
      border.width: Math.max(1, Style.space(1))
      border.color: Util.alpha(root.foreground, 0.1)
    }

    // tiling / apps-open: a window splits the screen
    Item {
      id: tilingStage
      visible: diagram.kind === "tiling"
      anchors.fill: parent
      anchors.margins: Style.space(14)
      property real split: 0.62

      SequentialAnimation on split {
        running: tilingStage.visible && root.panelVisible && !root.paused
        loops: Animation.Infinite
        PauseAnimation { duration: 450 }
        NumberAnimation { to: 0.5; duration: 720; easing.type: Easing.OutCubic }
        PauseAnimation { duration: 900 }
        NumberAnimation { to: 0.62; duration: 520; easing.type: Easing.InOutCubic }
        PauseAnimation { duration: 400 }
      }

      Row {
        anchors.fill: parent
        spacing: diagram.gap
        Rectangle {
          width: (parent.width - diagram.gap) * tilingStage.split
          height: parent.height
          radius: diagram.rad
          color: diagram.paneHi
        }
        Rectangle {
          width: (parent.width - diagram.gap) * (1 - tilingStage.split)
          height: parent.height
          radius: diagram.rad
          color: diagram.pane
        }
      }
    }

    // snap: two tiles swap places
    Item {
      id: snapStage
      visible: diagram.kind === "snap"
      anchors.fill: parent
      anchors.margins: Style.space(14)
      property real t: 0

      SequentialAnimation on t {
        running: snapStage.visible && root.panelVisible && !root.paused
        loops: Animation.Infinite
        PauseAnimation { duration: 500 }
        NumberAnimation { to: 1; duration: 700; easing.type: Easing.InOutCubic }
        PauseAnimation { duration: 700 }
        NumberAnimation { to: 0; duration: 700; easing.type: Easing.InOutCubic }
        PauseAnimation { duration: 400 }
      }

      readonly property real tileW: (width - diagram.gap) / 2
      Rectangle {
        width: snapStage.tileW
        height: snapStage.height
        radius: diagram.rad
        color: diagram.paneHi
        x: snapStage.t * (snapStage.tileW + diagram.gap)
        y: 0
      }
      Rectangle {
        width: snapStage.tileW
        height: snapStage.height
        radius: diagram.rad
        color: diagram.pane
        x: (1 - snapStage.t) * (snapStage.tileW + diagram.gap)
        y: 0
      }
    }

    Item {
      id: wsStage
      visible: diagram.kind === "workspaces"
      anchors.fill: parent
      property int current: 0

      Row {
        anchors.centerIn: parent
        spacing: Style.space(8)

        Repeater {
          model: 5
          delegate: Rectangle {
            required property int index
            width: Style.space(52)
            height: Style.space(36)
            radius: diagram.rad
            color: wsStage.current === index ? diagram.paneHi : diagram.pane
            border.width: wsStage.current === index ? Math.max(1, Style.space(1)) : 0
            border.color: Color.accent
            Behavior on color { ColorAnimation { duration: 180 } }
          }
        }
      }

      Timer {
        interval: 700
        repeat: true
        running: wsStage.visible && root.panelVisible && !root.paused
        onTriggered: wsStage.current = (wsStage.current + 1) % 5
      }
    }

    Item {
      id: monitorStage
      visible: diagram.kind === "monitors"
      anchors.fill: parent
      anchors.margins: Style.space(14)
      property int focused: 0

      Row {
        anchors.centerIn: parent
        spacing: Style.space(16)

        Repeater {
          model: 2
          delegate: Rectangle {
            required property int index
            width: Style.space(120)
            height: Style.space(72)
            radius: diagram.rad
            color: monitorStage.focused === index ? diagram.paneHi : diagram.pane
            border.width: monitorStage.focused === index ? Math.max(2, Style.space(2)) : Math.max(1, Style.space(1))
            border.color: monitorStage.focused === index ? Color.accent : Util.alpha(root.foreground, 0.16)
            Behavior on color { ColorAnimation { duration: 220 } }
            Rectangle {
              anchors.horizontalCenter: parent.horizontalCenter
              anchors.bottom: parent.bottom
              anchors.bottomMargin: Style.space(8)
              width: Style.space(28)
              height: Style.space(4)
              radius: height / 2
              color: Util.alpha(root.foreground, 0.2)
            }
          }
        }
      }

      Timer {
        interval: 1100
        repeat: true
        running: monitorStage.visible && root.panelVisible && !root.paused
        onTriggered: monitorStage.focused = 1 - monitorStage.focused
      }
    }

    // move: a window drags across the stage
    Item {
      id: moveStage
      visible: diagram.kind === "move"
      anchors.fill: parent
      anchors.margins: Style.space(14)

      Rectangle {
        anchors.fill: parent
        radius: diagram.rad
        color: diagram.pane
      }
      Rectangle {
        id: moveWin
        width: Style.space(88)
        height: Style.space(56)
        radius: diagram.rad
        color: diagram.paneHi
        border.width: Math.max(1, Style.space(1))
        border.color: Color.accent
        y: (moveStage.height - height) / 2

        SequentialAnimation on x {
          running: moveStage.visible && root.panelVisible && !root.paused
          loops: Animation.Infinite
          NumberAnimation { from: Style.space(8); to: Style.space(220); duration: 1100; easing.type: Easing.InOutCubic }
          PauseAnimation { duration: 280 }
          NumberAnimation { to: Style.space(8); duration: 1100; easing.type: Easing.InOutCubic }
          PauseAnimation { duration: 280 }
        }
      }
    }

    // float: a window lifts off the tiles
    Item {
      id: floatStage
      visible: diagram.kind === "float"
      anchors.fill: parent
      anchors.margins: Style.space(14)
      property real lift: 0

      SequentialAnimation on lift {
        running: floatStage.visible && root.panelVisible && !root.paused
        loops: Animation.Infinite
        PauseAnimation { duration: 400 }
        NumberAnimation { to: 1; duration: 640; easing.type: Easing.OutCubic }
        PauseAnimation { duration: 700 }
        NumberAnimation { to: 0; duration: 480; easing.type: Easing.InCubic }
        PauseAnimation { duration: 360 }
      }

      Row {
        anchors.fill: parent
        spacing: diagram.gap
        opacity: 0.55 + 0.45 * (1 - floatStage.lift)
        Rectangle { width: (parent.width - diagram.gap) * 0.55; height: parent.height; radius: diagram.rad; color: diagram.pane }
        Rectangle { width: (parent.width - diagram.gap) * 0.45; height: parent.height; radius: diagram.rad; color: diagram.pane }
      }
      Rectangle {
        width: Style.space(132)
        height: Style.space(72)
        radius: diagram.rad
        color: diagram.paneHi
        border.width: Math.max(1, Style.space(1))
        border.color: Color.accent
        x: (parent.width - width) / 2
        y: (parent.height - height) / 2 - floatStage.lift * Style.space(14)
        opacity: 0.35 + 0.65 * floatStage.lift
      }
    }

    // resize: divider grows
    Item {
      id: resizeStage
      visible: diagram.kind === "resize"
      anchors.fill: parent
      anchors.margins: Style.space(14)
      property real split: 0.42

      SequentialAnimation on split {
        running: resizeStage.visible && root.panelVisible && !root.paused
        loops: Animation.Infinite
        NumberAnimation { to: 0.68; duration: 900; easing.type: Easing.InOutCubic }
        PauseAnimation { duration: 280 }
        NumberAnimation { to: 0.42; duration: 900; easing.type: Easing.InOutCubic }
        PauseAnimation { duration: 280 }
      }

      Row {
        anchors.fill: parent
        spacing: diagram.gap
        Rectangle {
          width: (parent.width - diagram.gap) * resizeStage.split
          height: parent.height
          radius: diagram.rad
          color: diagram.paneHi
        }
        Rectangle {
          width: (parent.width - diagram.gap) * (1 - resizeStage.split)
          height: parent.height
          radius: diagram.rad
          color: diagram.pane
        }
      }
    }
  }

  FileView {
    id: stateFile
    path: root.statePath
    atomicWrites: true
    printErrors: false
  }

  Process {
    id: monitorProbe
    command: ["hyprctl", "-j", "monitors"]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: {
        try {
          var data = JSON.parse(text)
          root.monitorCount = (data && data.length) ? data.length : 1
        } catch (e) {
          root.monitorCount = 1
        }
      }
    }
  }

  Process {
    id: clientProbe
    command: ["hyprctl", "-j", "clients"]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: {
        try {
          var data = JSON.parse(text)
          var n = 0
          if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
              if (data[i] && data[i].mapped !== false) n++
            }
          }
          if (root.spawnedDemos) n = Math.max(n, 2)
          root.clientCount = n
        } catch (e) {
          if (!root.spawnedDemos) root.clientCount = 0
        }
      }
    }
  }

  Process {
    id: laptopProbe
    command: ["omarchy-hw-laptop"]
    onExited: function(exitCode) {
      root.isLaptop = exitCode === 0
    }
  }

  Process {
    id: agentProbe
    command: ["omarchy-default-agent"]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: {
        root.hasAgent = String(text).replace(/^\s+|\s+$/g, "").length > 0
      }
    }
  }

  Timer {
    id: resumeTimer
    repeat: false
    onTriggered: {
      root.paused = false
      root.probeAll()
      root.refocus()
    }
  }

  Timer {
    id: practiceTimer
    interval: 850
    repeat: false
    onTriggered: {
      root.paused = false
      root.refocus()
      if (root.onLast) root.finish()
      else root.goForward()
    }
  }

  Timer {
    id: demoProbeTimer
    interval: 500
    repeat: false
    onTriggered: {
      clientProbe.running = false
      clientProbe.running = true
    }
  }

  Timer {
    id: beatTimer
    interval: 520
    repeat: true
    running: root.panelVisible && root.showKeycaps && !root.paused
    onTriggered: {
      var n = root.keycaps.length
      if (n < 1) return
      root.keyBeat = (root.keyBeat + 1) % (n + 1)
    }
  }

  PanelWindow {
    id: panel
    visible: root.panelVisible
    anchors { top: true; bottom: true; left: true; right: true }
    color: "transparent"
    WlrLayershell.namespace: "omarchy-tour"
    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: root.panelVisible ? WlrKeyboardFocus.Exclusive : WlrKeyboardFocus.None
    exclusionMode: ExclusionMode.Ignore
    mask: Region {
      x: root.paused ? card.x : 0
      y: root.paused ? card.y : 0
      width: root.paused ? card.width : panel.width
      height: root.paused ? card.height : panel.height
    }

    Rectangle {
      anchors.fill: parent
      color: root.scrim
      opacity: root.paused ? 0 : 1
      Behavior on opacity { NumberAnimation { duration: 220; easing.type: Easing.OutCubic } }
    }

    MouseArea {
      anchors.fill: parent
      enabled: !root.paused
      onClicked: {}
    }

    BorderSurface {
      id: card
      width: Math.min(Style.space(620), parent.width - Style.space(56))
      height: inner.implicitHeight + root.cardPad * 2
      radius: root.cornerRadius
      color: root.background
      borderSpec: root.borderSpec
      anchors.horizontalCenter: parent.horizontalCenter
      anchors.bottom: parent.bottom
      anchors.bottomMargin: Style.space(48)

      Column {
        id: inner
        x: root.cardPad
        y: root.cardPad
        width: parent.width - root.cardPad * 2
        spacing: Style.space(18)

        Row {
          visible: !root.choosing
          width: parent.width
          spacing: Style.space(12)

          NavArrow {
            glyph: "←"
            active: root.canGoBack
            anchors.verticalCenter: parent.verticalCenter
            onActivated: root.goBack()
          }

          Item {
            width: parent.width - Style.space(44) * 2 - Style.space(12) * 2
            height: Style.space(44)

            Rectangle {
              id: pathTrack
              anchors.verticalCenter: parent.verticalCenter
              width: parent.width
              height: Style.space(4)
              radius: height / 2
              color: Util.alpha(root.foreground, 0.12)

              Rectangle {
                width: pathTrack.width * ((root.stepIndex + 1) / Math.max(1, root.stepTotal))
                height: parent.height
                radius: height / 2
                color: Color.accent
                Behavior on width { NumberAnimation { duration: 220; easing.type: Easing.OutCubic } }
              }

              MouseArea {
                anchors.fill: parent
                anchors.topMargin: -Style.space(12)
                anchors.bottomMargin: -Style.space(12)
                cursorShape: Qt.PointingHandCursor
                onClicked: function(mouse) {
                  var total = Math.max(1, root.stepTotal)
                  var i = Math.floor(mouse.x / width * total)
                  if (i < 0) i = 0
                  if (i > total - 1) i = total - 1
                  root.applyStep(i)
                }
              }
            }
          }

          NavArrow {
            glyph: "→"
            active: root.canGoForward || root.onLast
            anchors.verticalCenter: parent.verticalCenter
            onActivated: root.goForward()
          }
        }

        Item {
          width: parent.width
          height: lessonPane.implicitHeight
          clip: true
          visible: !root.choosing

          Column {
            id: lessonPane
            width: parent.width
            spacing: Style.space(18)

            Behavior on x { enabled: root.slideEnabled; NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
            Behavior on opacity { enabled: root.slideEnabled; NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }

            Item {
              width: parent.width
              height: Math.max(titleText.implicitHeight, checkMark.height)

              Text {
                id: titleText
                width: parent.width - (root.practiced ? checkMark.width + Style.space(12) : 0)
                text: root.step ? root.step.title : ""
                color: root.foreground
                font.family: root.fontFamily
                font.pixelSize: Style.font.displayLarge
                font.bold: true
                wrapMode: Text.WordWrap
              }

              Rectangle {
                id: checkMark
                anchors.right: parent.right
                anchors.verticalCenter: titleText.verticalCenter
                width: Style.space(28)
                height: Style.space(28)
                radius: width / 2
                color: Color.accent
                visible: root.practiced
                opacity: root.practiced ? 1 : 0
                Behavior on opacity { NumberAnimation { duration: 160 } }

                Text {
                  anchors.centerIn: parent
                  text: "✓"
                  color: root.background
                  font.family: root.fontFamily
                  font.pixelSize: Style.font.body
                  font.bold: true
                }
              }
            }

            LessonDiagram {
              width: parent.width
              kind: root.diagramKind
              visible: !root.overviewing
            }

            Text {
              width: parent.width
              visible: !root.overviewing
              text: root.step ? root.step.body : ""
              color: Color.muted
              font.family: root.fontFamily
              font.pixelSize: Style.font.title
              wrapMode: Text.WordWrap
              lineHeight: 1.35
            }

            Flickable {
              id: recapFlick
              visible: root.overviewing
              width: parent.width
              height: visible ? Math.min(recapColumn.implicitHeight, Style.space(320)) : 0
              contentWidth: width
              contentHeight: recapColumn.implicitHeight
              clip: true
              boundsBehavior: Flickable.StopAtBounds
              flickableDirection: Flickable.VerticalFlick

              Column {
                id: recapColumn
                width: recapFlick.width
                spacing: Style.space(12)

                Repeater {
                  model: root.overviewing ? root.overviewItems.length : 0
                  delegate: Item {
                    required property int index
                    readonly property var recap: root.overviewItems[index] || ({ title: "", keys: "" })
                    width: recapColumn.width
                    height: recapTitle.implicitHeight

                    Text {
                      id: recapTitle
                      width: parent.width - recapKeys.implicitWidth - Style.space(16)
                      text: recap.title
                      color: root.foreground
                      font.family: root.fontFamily
                      font.pixelSize: Style.font.body
                      wrapMode: Text.WordWrap
                    }

                    Text {
                      id: recapKeys
                      anchors.right: parent.right
                      anchors.verticalCenter: recapTitle.verticalCenter
                      text: recap.keys
                      color: Color.muted
                      font.family: root.fontFamily
                      font.pixelSize: Style.font.bodySmall
                    }
                  }
                }
              }
            }

            Row {
              visible: root.showKeycaps && !root.overviewing
              spacing: Style.space(8)
              Repeater {
                model: root.keycaps
                delegate: Item {
                  id: keyWrap
                  required property string modelData
                  required property int index
                  readonly property bool struck: root.keyBeat === keyWrap.index
                  width: keyFace.width
                  height: keyFace.height + Style.space(4)

                  Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    height: keyFace.height - Style.space(2)
                    radius: Math.min(root.cornerRadius, Style.space(10))
                    color: Qt.rgba(0, 0, 0, 0.28)
                  }

                  Rectangle {
                    id: keyFace
                    y: keyWrap.struck ? Style.space(3) : 0
                    width: Math.max(Style.space(44), keyLabel.implicitWidth + Style.space(22))
                    height: Style.space(42)
                    radius: Math.min(root.cornerRadius, Style.space(10))
                    color: keyWrap.struck ? Color.accent : Util.alpha(root.foreground, 0.08)

                    Behavior on y { NumberAnimation { duration: 90; easing.type: Easing.OutCubic } }
                    Behavior on color { ColorAnimation { duration: 90 } }

                    Text {
                      id: keyLabel
                      anchors.centerIn: parent
                      text: keyWrap.modelData
                      color: keyWrap.struck ? root.background : root.foreground
                      font.family: root.fontFamily
                      font.pixelSize: Style.font.body
                      font.bold: true
                    }
                  }
                }
              }
            }
          }
        }

        Text {
          width: parent.width
          visible: root.choosing
          text: "Tour of Omarchy"
          color: root.foreground
          font.family: root.fontFamily
          font.pixelSize: Style.font.displayLarge
          font.bold: true
          wrapMode: Text.WordWrap
        }

        Column {
          visible: root.choosing
          width: parent.width
          spacing: Style.space(10)
          Repeater {
            model: root.lengthOptions
            delegate: Rectangle {
              id: lengthRow
              required property var modelData
              required property int index
              readonly property bool selected: root.highlightedLength === lengthRow.index
              width: inner.width
              height: Math.max(Style.space(72), lengthCopy.implicitHeight + Style.space(28))
              radius: Math.min(root.cornerRadius, Style.space(14))
              color: lengthRow.selected ? Util.alpha(Color.accent, 0.16) : Util.alpha(root.foreground, 0.04)
              border.width: lengthRow.selected ? Math.max(1, Style.space(1)) : 0
              border.color: Color.accent

              Row {
                anchors.fill: parent
                anchors.leftMargin: Style.space(18)
                anchors.rightMargin: Style.space(18)
                spacing: Style.space(16)

                Rectangle {
                  width: Style.space(10)
                  height: Style.space(10)
                  radius: width / 2
                  color: lengthRow.selected ? Color.accent : Util.alpha(root.foreground, 0.25)
                  anchors.verticalCenter: parent.verticalCenter
                }

                Column {
                  id: lengthCopy
                  anchors.verticalCenter: parent.verticalCenter
                  width: parent.width - Style.space(26)
                  spacing: Style.space(4)
                  Text {
                    width: parent.width
                    text: lengthRow.modelData.label
                    color: root.foreground
                    font.family: root.fontFamily
                    font.pixelSize: Style.font.heading
                    font.bold: true
                    wrapMode: Text.WordWrap
                  }
                  Text {
                    width: parent.width
                    text: lengthRow.modelData.detail
                    color: Color.muted
                    font.family: root.fontFamily
                    font.pixelSize: Style.font.body
                    wrapMode: Text.WordWrap
                  }
                }
              }

              MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onEntered: root.highlightedLength = lengthRow.index
                onClicked: root.startLength(lengthRow.modelData.id)
              }
            }
          }
        }

        Text {
          width: parent.width
          visible: root.showHints
          text: root.choosing
            ? "1  2  3  to choose     Enter  to begin     Esc  to close"
            : (root.overviewing
              ? "Enter  to finish     Esc  to close"
              : (TourModel.enterAction(root.step) === "overview"
                ? "Enter  to see the shortcuts     Esc  to close"
                : (TourModel.enterAction(root.step) === "finish"
              ? "Enter  to finish     Esc  to close"
              : (root.step && root.step.keys && root.step.keys.length
                ? "←  →  lessons     Enter  to show me     Esc  to close"
                : "←  →  lessons     Enter  to continue     Esc  to close"))))
          color: Color.muted
          font.family: root.fontFamily
          font.pixelSize: Style.font.bodySmall
          wrapMode: Text.WordWrap
          opacity: 0.85
        }
      }

      Behavior on height { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
    }

    Item {
      id: keyCatcher
      anchors.fill: card
      focus: true

      Keys.priority: Keys.BeforeItem
      Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Escape) {
          root.onEscape()
          event.accepted = true
          return
        }
        if ((event.key === Qt.Key_Return || event.key === Qt.Key_Enter)
            && !(event.modifiers & (Qt.MetaModifier | Qt.AltModifier | Qt.ControlModifier | Qt.ShiftModifier))) {
          root.onEnter()
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Up && root.choosing) {
          root.highlightedLength = Math.max(0, root.highlightedLength - 1)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Down && root.choosing) {
          root.highlightedLength = Math.min(2, root.highlightedLength + 1)
          event.accepted = true
          return
        }
        var ev = root.eventFromQt(event)
        if (root.choosing) {
          var picked = TourModel.lengthFromKey(ev.key)
          if (picked) {
            root.startLength(picked)
            event.accepted = true
            return
          }
        }
        if (!root.choosing && !ev.meta && !ev.alt && !ev.ctrl) {
          if (ev.key === "Left") {
            root.goBack()
            event.accepted = true
            return
          }
          if (ev.key === "Right") {
            root.goForward()
            event.accepted = true
            return
          }
        }
        if (!root.choosing && !root.paused && TourModel.matches(root.step, ev)) {
          root.keyBeat = 0
          root.practice(ev)
          event.accepted = true
          return
        }
        event.accepted = true
      }
    }
  }
}
