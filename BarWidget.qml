import QtQuick
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui
import "TourModel.js" as TourModel

BarWidget {
  id: root
  moduleName: "io.github.julio.tour"

  readonly property string statePath: Quickshell.env("HOME") + "/.local/state/omarchy/tour.json"
  property bool nudge: true

  function summonTour() {
    root.markSeen()
    Quickshell.execDetached(["omarchy-shell", "shell", "toggle", "io.github.julio.tour", "{}"])
  }

  function markSeen() {
    var current = TourModel.parseState(stateFile.text())
    if (current.seen || current.completed || current.skipped) return
    Quickshell.execDetached(["mkdir", "-p", Quickshell.env("HOME") + "/.local/state/omarchy"])
    stateFile.setText(TourModel.serializeState(current.completed, current.length, current.skipped, true))
    root.nudge = false
  }

  function skipNudge() {
    if (!root.nudge) return
    Quickshell.execDetached(["mkdir", "-p", Quickshell.env("HOME") + "/.local/state/omarchy"])
    stateFile.setText(TourModel.serializeState(false, "standard", true, true))
    root.nudge = false
  }

  implicitWidth: button.implicitWidth
  implicitHeight: button.implicitHeight

  FileView {
    id: stateFile
    path: root.statePath
    watchChanges: true
    atomicWrites: true
    printErrors: false
    onLoaded: root.nudge = TourModel.chipNudge(TourModel.parseState(text()))
    onLoadFailed: root.nudge = true
    onFileChanged: reload()
  }

  Rectangle {
    id: pulse
    anchors.fill: parent
    visible: root.nudge
    radius: Math.max(4, Style.space(6))
    color: Color.accent

    SequentialAnimation on opacity {
      running: root.nudge
      loops: Animation.Infinite
      NumberAnimation { from: 0.55; to: 1; duration: 1400; easing.type: Easing.InOutSine }
      NumberAnimation { from: 1; to: 0.55; duration: 1400; easing.type: Easing.InOutSine }
    }
  }

  WidgetButton {
    id: button
    anchors.fill: parent
    bar: root.bar
    text: "Tour"
    active: false
    useActiveColor: false
    foreground: root.nudge ? Color.background : (root.bar ? root.bar.barForeground : Color.foreground)
    tooltipText: root.nudge
      ? "Desktop tour — left-click to start, right-click to hide the highlight"
      : "Desktop tour"
    onPressed: function(buttonCode) {
      if (buttonCode === Qt.LeftButton) root.summonTour()
      else if (buttonCode === Qt.RightButton) root.skipNudge()
    }
  }
}
