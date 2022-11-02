<template>
  <div>
    <b-row>
<!--      PRODUCTION RULES-->
      <b-col class="m-3" style="background-color: rgba(255, 255, 255, 0.6); border-radius: 10px; overflow-y: scroll; height: 400px;">
        <b-table
            class="mt-3"
            :items="productionRules"
            hover
        ></b-table>
      </b-col>
<!--      PRODUCTION RULE KEYBOARD-->
      <b-col class="m-3" style="background-color: rgba(255, 255, 255, 0.6); border-radius: 10px; overflow: scroll">
<!--        OUTPUT GOES HERE-->
        <b-row class="m-1" style="width: 400px; height: 50px; background-color: rgba(255, 255, 255, 0.6); border-radius: 10px;">
          <b-col
              @click="selectPart('from')"
              :class="newRule['from']['selected']"
              class="hoverable"
          >
            From:<br/>
            {{newRule['from']['value'].join("")}}
          </b-col>
          <b-col
              @click="selectPart('to')"
              :class="newRule['to']['selected']"
              class="hoverable"
          >
            To:<br/>
            {{newRule['to']['value'].join("")}}
          </b-col>
          <b-col
              @click="selectPart('count')"
              :class="newRule['count']['selected']"
              class="hoverable"
          >
            Count:<br/>
            {{newRule['count']['value'].join("")}}
          </b-col>
        </b-row>
<!--        BEGIN GRID OF KEYBOARD-->
        <b-row class="m-1 p-2" style="width: 400px; background-color: rgba(255, 255, 255, 0.6); border-radius:  10px;">
          <b-col>
            <b-row>
              <b-col class="m-1"><b-button variant="primary" @click="addSymbol(up)">{{up}}</b-button></b-col>
              <b-col class="m-1"><b-button variant="primary" @click="addSymbol(straight)">{{straight}}</b-button></b-col>
              <b-col class="m-1"><b-button variant="primary" @click="addSymbol(down)">{{down}}</b-button></b-col>
            </b-row>
            <b-row>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[1])">1</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[2])">2</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[3])">3</b-button></b-col>
            </b-row>
            <b-row>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[4])">4</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[5])">5</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[6])">6</b-button></b-col>
            </b-row>
            <b-row>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[7])">7</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[8])">8</b-button></b-col>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[9])">9</b-button></b-col>
            </b-row>
            <b-row>
              <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[0])">0</b-button></b-col>
              <b-col class="m-1"><b-button variant="warning" @click="backspace()"><-</b-button></b-col>
              <b-col class="m-1"><b-button variant="danger" @click="erase()">X</b-button></b-col>
            </b-row>
            <b-row>
              <b-col class="m-1"><b-button variant="success" @click="confirm()">Add</b-button></b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
<!--      RESULT VISUALIZATION-->
      <b-col class="m-3" style="background-color: rgba(255, 255, 255, 0.6); border-radius: 10px;">
        <div id="myDiagramDiv" style="width:100%; height: 500px;"></div>
      </b-col>
    </b-row>
    <b-button @click="test">test</b-button>
  </div>
</template>

<script setup lang="ts">
//THE FOLLOWING IS BASED ON https://github.com/NorthwoodsSoftware/GoJS/blob/master/samples/parseTree.html
import go from 'gojs'
import {onMounted, ref, Ref} from "vue";

const up = "\u2197"+"\uFE0E"
const down = "\u2198"+"\uFE0E"
const straight = "\u2192"+"\uFE0E"
const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"]

let productionRules = [
  {from: down+sub[4], to: up+sub[2]+down+sub[2], count: 3},
  {from: down+sub[5], to: up+sub[3]+down+sub[2], count: 4},
  {from: down+sub[3], to: up+sub[2]+down+sub[1], count: 2},
  {from: down+sub[4], to: up+sub[2]+down+sub[2], count: 3},
  {from: down+sub[5], to: up+sub[3]+down+sub[2], count: 4},
  {from: down+sub[3], to: up+sub[2]+down+sub[1], count: 2},
  {from: down+sub[5], to: up+sub[3]+down+sub[2], count: 4},
  {from: down+sub[3], to: up+sub[2]+down+sub[1], count: 2},
  {from: down+sub[4], to: up+sub[2]+down+sub[2], count: 3},
  {from: down+sub[5], to: up+sub[3]+down+sub[2], count: 4},
  {from: down+sub[3], to: up+sub[2]+down+sub[1], count: 2}
]

let newRule: Ref = ref({
  "from": ref({value: [], selected: "false"}),
  "to": ref({value: [], selected: "false"}),
  "count": ref({value: [], selected: "false"})
})

function selectPart(part: "from" | "to" | "count") {
  for (let p in newRule.value) {
    newRule.value[p]["selected"] = (p === part).toString();
  }
}

function _findActivePart(): string {
  for (let l in newRule.value) {
    if (newRule.value[l]['selected'] === 'true') {
      return l
    }
  }
}

function subToNum(subscript: string): string {
  return sub.indexOf(subscript).toString()
}
function addSymbol(symbol: string) {
  let part = _findActivePart()
  if (part === 'count') {
    newRule.value[part]['value'].push(subToNum(symbol))
  } else {
    newRule.value[part]['value'].push(symbol)
  }
}

function backspace() {
  let part = _findActivePart()
  newRule.value[part]['value'].pop()
}

function erase() {
  let part = _findActivePart()
  newRule.value[part]['value'] = []
}

let strokeColor = "#FFFFFF"
let terminalColor = "#8888FF"
let variableColor = "#FF00FF"
let realizationColor = "#FFFFFF"
let nodeDataArray = ref([
  { key: 1, text: up + sub[4], fill: variableColor, stroke: strokeColor },
  { key: 2, text: up + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
  { key: 3, text: down + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
  { key: 4, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
  { key: 5, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
  { key: 6, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },
  { key: 7, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },
])
let myDiagram: go.Diagram;

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

function drawTree() {
  const $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDiagramDiv", {
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
              { font: "bold 32pt Arial, sans-serif", margin: new go.Margin(10, 10, 5, 10) },
              new go.Binding("text")
          )
      ),
      $(
          go.Panel,
          { height: 17 },
          $("TreeExpanderButton")
      )
  )

  myDiagram.linkTemplate = $(
      go.Link,
      $(
          go.Shape,
          {strokeWidth: 5}
      )
  )

  nodeDataArray = ref([
    { key: 1, text: up + sub[4], fill: variableColor, stroke: strokeColor },
    { key: 2, text: up + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 3, text: down + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 4, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 5, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 6, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },
    { key: 7, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },
  ])

  myDiagram.model = new go.TreeModel({
    nodeDataArray: nodeDataArray.value
  })
}

onMounted(() => {
  drawTree()
})

function test() {
  console.log(nodeDataArray.value)
  nodeDataArray.value.pop()
  myDiagram.model = new go.TreeModel({
    nodeDataArray: nodeDataArray.value
  })
}
</script>

<style scoped>
.gojs-diagram {
  position: absolute;
  width: 1000px;
  height: 1000px;
}

.btn {
  width: 100%;
  height: 100%;
  font-size: 18px;
}


.hoverable:hover, .true {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>