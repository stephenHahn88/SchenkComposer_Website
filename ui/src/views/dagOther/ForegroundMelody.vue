<template>
  <div>
    <b-row>
      <b-col></b-col>
      <b-col>
        <b-button
          variant="info"
          @click="generateMelody"
        >Generate</b-button>
      </b-col>
    </b-row>
    <b-row>
<!--      PRODUCTION RULES-->
      <b-col class="m-3 white-background border-10" style="overflow-y: scroll; height: 500px;">
        <h2>Production Rules</h2>
        <b-table
            class="mt-3"
            :items="productionRules"
            bordered
            hover
        ></b-table>
      </b-col>
<!--      PRODUCTION RULE KEYBOARD-->
      <b-col class="m-3 white-background border-10" style="overflow-x: scroll">
        <ProductionCalculator
          @submit="(rule) => addToTable(rule)"
        ></ProductionCalculator>
      </b-col>
    </b-row>
    <b-row>
<!--      RESULT VISUALIZATION-->
      <b-col class="m-3 white-background" style="border-radius: 10px;">
        <div id="myDiagramDiv" style="width:100%; height: 500px;"></div>
      </b-col>
    </b-row>
    <b-button @click="test">test</b-button>
  </div>
</template>

<script setup lang="ts">
import go from 'gojs'
import {inject, onMounted, ref, Ref} from "vue";
import {
  playNotesAndHarmony,
  flattenHarmony,
  flattenPhrase,
  flattenFgRhythm,
  flattenMgRhythm,
  ProductionRule
} from "@/data";
import ProductionCalculator from "@/views/dagOther/FGMComponents/ProductionCalculator.vue";

let {composerId, updateComposerId}: any = inject("composerId")
let {melodyId, updateMelodyId}: any = inject("melodyId")

let phraseStructure;
let fgRhythm;
let mgRhythm;
let mgHarmony;
let mgMelody: string[];
let fgRhythmFlattened: string[];
let mgHarmonyFlattened: string[];
let mgRhythmFlattened: string[];

let foregroundMelody = ref([])

onMounted(() => {
  getMelodyInfo()
})

const up = "\u2197"+"\uFE0E"
const down = "\u2198"+"\uFE0E"
const straight = "\u2192"+"\uFE0E"
const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"]

let productionRules = ref([
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
])


function addToTable(newRule: ProductionRule) {
  productionRules.value.push({
    from: newRule["from"]["value"].join(""),
    to: newRule["to"]["value"].join(""),
    count: parseInt(newRule["count"]["value"].join(""))
  })
}

async function getMelodyInfo() {
  phraseStructure = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/phrase-structure")).json()
  fgRhythm = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/fg-rhythm")).json()
  mgRhythm = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/mg-rhythm")).json()
  mgHarmony = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/harmonicProgression")).json()
  mgMelody = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/middleground-melody")).json()

  phraseStructure = flattenPhrase(phraseStructure)

  fgRhythmFlattened = flattenFgRhythm(fgRhythm, phraseStructure)
  mgRhythmFlattened = flattenMgRhythm(mgRhythm, phraseStructure)
  mgHarmonyFlattened = flattenHarmony(mgHarmony, phraseStructure)
}

async function generateMelody() {
  let mgMelodyComponent = mgMelody
      .map((s: string) => s.replaceAll("/", ""))
      .join("-")
  let fgRhythmComponent = fgRhythmFlattened
      .join("-")
      .replaceAll(" ", "s")
  let mgRhythmComponent = mgRhythmFlattened
      .join("-")
      .replaceAll(" ", "s")
  let mgHarmonyComponent = mgHarmonyFlattened
      .join("-")

  let mel = await (await fetch(`
    /model/generate-melody/
    ${encodeURIComponent(mgMelodyComponent)}/
    ${encodeURIComponent(fgRhythmComponent)}/
    ${encodeURIComponent(mgRhythmComponent)}/
    ${encodeURIComponent(mgHarmonyComponent)}
  `)).json()

  playNotesAndHarmony(mel.notes, mel.harmony)
}

//THE FOLLOWING IS BASED ON https://github.com/NorthwoodsSoftware/GoJS/blob/master/samples/parseTree.html
let strokeColor = "#000000"
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
    // @ts-ignore
    this.network.vertexes.each(v => y = Math.max(y, v.node.position.y));
    // @ts-ignore
    this.network.vertexes.each(v => {
      if (v.destinationEdges.count === 0) {
        // @ts-ignore
        v.node.moveTo(v.node.position.x, y);
        // @ts-ignore
        v.node.toEndSegmentLength = Math.abs(v.centerY - y)
      } else {
        // @ts-ignore
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

    { key: 1, text: up + sub[4], fill: variableColor, stroke: strokeColor, parent: 8 },
    { key: 2, text: up + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 3, text: down + sub[2], fill: variableColor, stroke: strokeColor, parent: 1 },
    { key: 4, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 5, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 2 },
    { key: 6, text: up + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },
    { key: 7, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 3 },

    { key: 8, text: down + sub[7], fill: variableColor, stroke: strokeColor },
    { key: 9, text: down + sub[3], fill: variableColor, stroke: strokeColor, parent: 8 },
    { key: 10, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 9},
    { key: 11, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 9},
    { key: 12, text: down + sub[1], fill: terminalColor, stroke: strokeColor, parent: 9},
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
* {
  font-size: 24px;
}

h2 {
  font-size: 32px;
}

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

.white-background {
  background-color: rgba(255, 255, 255, 0.6);
}

.border-10 {
  border-radius: 10px;
}

.hoverable:hover, .true {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>