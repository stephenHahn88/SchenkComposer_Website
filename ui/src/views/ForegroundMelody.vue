<template>
  <div>
    <div id="myDiagramDiv" style="width:100%; height: 500px;"></div>
  </div>
</template>

<script setup lang="ts">
//THE FOLLOWING IS BASED ON https://github.com/NorthwoodsSoftware/GoJS/blob/master/samples/parseTree.html
import go from 'gojs'
import {onMounted} from "vue";

let nodeDataArray;

class FlatTreeLayout extends go.TreeLayout {
  commitLayout() {
    super.commitLayout();
    let y = -Infinity
    this.network.vertexes.each(v => y = Math.max(y, v.node.position.y));
    this.network.vertexes.each(v => {
      if (v.destinationEdges.count === 0) {
        v.node.moveTo(v.node.position.x, y);
        v.node.toEndSegmentLength = Math.abs(v.centerY - y)
      } else {
        v.node.toEndSegmentLength = 10;
      }
    })
  }
}

function init() {
  const $ = go.GraphObject.make;
  let myDiagram = $(go.Diagram, "myDiagramDiv", {
    allowCopy: false,
    allowDelete: false,
    allowMove: false,
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true,
    layout: $(
        FlatTreeLayout,
        {
          angle: 90,
          compaction: go.TreeLayout.CompactionNone
        }
    )
  })

  myDiagram.nodeTemplate = $(
      go.Node,
      "Vertical",
      { selectionObjectName: "BODY" },
      $(
          go.Panel,
          "Auto",
          { name: "BODY"},
          $(
              go.Shape, "RoundedRectangle",
              new go.Binding("fill"),
              new go.Binding("stroke")
          ),
          $(
              go.TextBlock,
              { font: "bold 12pt Arial, sans-serif", margin: new go.Margin(4, 2, 2, 2) },
              new go.Binding("text")
          )
      ),
      $(
          go.Panel,
          { height: 17 },
          $("TreeExpanderButton")
      )
  )

  myDiagram.linkTemplate = $(go.Link, $(go.Shape, {strokeWidth: 1.5}))

  let strokeColor = "#FFFFFF"
  let terminalColor = "#8888FF"
  let variableColor = "#FF00FF"
  let realizationColor = "#FFFFFF"
  nodeDataArray = [
    { key: 1, text: "Sentence", fill: variableColor, stroke: strokeColor },
    { key: 2, text: "NP", fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 3, text: "DT", fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 4, text: "A", fill: realizationColor, stroke: strokeColor, parent: 3 },
    { key: 5, text: "JJ", fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 6, text: "rare", fill: realizationColor, stroke: strokeColor, parent: 5 },
    { key: 7, text: "JJ", fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 8, text: "black", fill: realizationColor, stroke: strokeColor, parent: 7 },
    { key: 9, text: "NN", fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 10, text: "squirrel", fill: realizationColor, stroke: strokeColor, parent: 9 },
    { key: 11, text: "VP", fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 12, text: "VBZ", fill: terminalColor, stroke: strokeColor, parent: 11 },
    { key: 13, text: "has", fill: realizationColor, stroke: strokeColor, parent: 12 },
    { key: 14, text: "VP", fill: variableColor, stroke: strokeColor, parent: 11 },
    { key: 15, text: "VBN", fill: terminalColor, stroke: strokeColor, parent: 14 },
    { key: 16, text: "become", fill: realizationColor, stroke: strokeColor, parent: 15 },
    { key: 17, text: "NP", fill: variableColor, stroke: strokeColor, parent: 14 },
    { key: 18, text: "NP", fill: variableColor, stroke: strokeColor, parent: 17 },
    { key: 19, text: "DT", fill: terminalColor, stroke: strokeColor, parent: 18 },
    { key: 20, text: "a", fill: realizationColor, stroke: strokeColor, parent: 19 },
    { key: 21, text: "JJ", fill: terminalColor, stroke: strokeColor, parent: 18 },
    { key: 22, text: "regular", fill: realizationColor, stroke: strokeColor, parent: 21 },
    { key: 23, text: "NN", fill: terminalColor, stroke: strokeColor, parent: 18 },
    { key: 24, text: "visitor", fill: realizationColor, stroke: strokeColor, parent: 23 },
    { key: 25, text: "PP", fill: variableColor, stroke: strokeColor, parent: 17 },
    { key: 26, text: "TO", fill: terminalColor, stroke: strokeColor, parent: 25 },
    { key: 27, text: "to", fill: realizationColor, stroke: strokeColor, parent: 26 },
    { key: 28, text: "NP", fill: variableColor, stroke: strokeColor, parent: 25 },
    { key: 29, text: "DT", fill: terminalColor, stroke: strokeColor, parent: 28 },
    { key: 30, text: "a", fill: realizationColor, stroke: strokeColor, parent: 29 },
    { key: 31, text: "JJ", fill: terminalColor, stroke: strokeColor, parent: 28 },
    { key: 32, text: "suburban", fill: realizationColor, stroke: strokeColor, parent: 31 },
    { key: 33, text: "NN", fill: terminalColor, stroke: strokeColor, parent: 28 },
    { key: 34, text: "garden", fill: realizationColor, stroke: strokeColor, parent: 33 },
    { key: 35, text: ".", fill: terminalColor, stroke: strokeColor, parent: 1 },
    { key: 36, text: ".", fill: realizationColor, stroke: strokeColor, parent: 35 }
  ]

  myDiagram.model = new go.TreeModel({
    nodeDataArray: nodeDataArray
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.gojs-diagram {
  position: absolute;
  width: 1000px;
  height: 1000px;
}
</style>