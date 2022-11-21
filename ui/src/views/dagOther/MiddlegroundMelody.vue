<template>
  <div>
    <h1 style="color: white">Middleground Melody</h1>
    <b-row class="m-3 pl-3" style="background-color: rgba(255, 255, 255, 0.7); border-radius: 10px;">
      <div id="boo" style="overflow: auto"></div>

    </b-row>
    <b-row class="m-3">
      <b-col class="p-3" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; overflow-y: scroll; height: 350px;">
        <h2 style="color: white">Next Note (Harmony: {{harmonies[harmonyKeys[currNoteIndex]]['label']}})</h2>
        <b-button
            v-for="availableNote in availableNotes"
            :variant="octaveColor(availableNote.slice(-1))"
            class="m-1"
            @click="placeNextNote(availableNote)"
            style="width: 100%"
        ><strong>{{availableNote.split('/').join("")}}</strong><img :src="getSrc(availableNote)" style="width:128px;"></b-button>
      </b-col>
      <b-col>
        <b-row><b-button variant="danger" class="mx-3 mb-3" style="width: 20%" @click="erase()">X</b-button></b-row>
        <b-row><b-button variant="info" class="m-3" style="width: 100%; height: 100px">Generate</b-button></b-row>
        <b-row><b-button variant="success" class="m-3" style="width: 100%; height: 100px">Confirm</b-button></b-row>
      </b-col>
    </b-row>


  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, Ref} from "vue";
import Vex from "vexflow"

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

let key = "C"
let harmonies = ref({
  1: ref({
    "label": "IV",
    "notes": ["A", "F", "C"],
    "duration": 2
  }),
  1.5: ref({
    "label": "V",
    "notes": ["B", "G", "D"],
    "duration": 2
  }),
  2: ref({
    "label": "I",
    "notes": ["G", "E", "C"],
    "duration": 2.5
  }),
  2.75: ref({
    "label": "V",
    "notes": ["B", "G", "D"],
    "duration": 4
  }),
  3: ref({
    "label": "vi",
    "notes": ["A", "E", "C"],
    "duration": 4.5
  })
})
let harmonyKeys = Object.keys(harmonies.value).sort((a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x))

let numMeasures: Ref<number> = computed(() => {
  return Math.floor(Math.max(...Object.keys(harmonies.value).map(h => parseFloat(h))))
})
let availableNotes: Ref<string[]> = ref(["A/4", "A/3", "A/5"])
let timeSignature = "4/4"
let currNoteIndex = ref(0)
let noteGroup: any;

let renderer;
let context: Vex.RenderContext;
let measures: Vex.Stave[];

let measureNotes: any = {}
for (let i = 0; i < numMeasures.value; i++) {
  //@ts-ignore
  measureNotes[i] = []
}

onMounted(() => {
  drawStaff()
  setAvailableNotes()
})

function getSrc(availableNote: string) {
  let n = availableNote.split("/").join("").toLowerCase()
  return `src/static/staffNotes/${n}.svg`
}

function drawStaff() {
  let defaultWidth = 800
  let xPart = defaultWidth/4
  let height = 25

  const div = document.getElementById('boo') as HTMLDivElement
  renderer = new Renderer(div, Renderer.Backends.SVG)

  renderer.resize(2000, 250)
  context = renderer.getContext()
  context.scale(1.4, 1.4)
  context.setFont('Arial', 32)

  measures = []
  for (let i = 0; i < numMeasures.value; i++) {
    if (i === 0) {
      measures[i] = new Stave(xPart * i, height, xPart + 40)
      measures[i].addClef("treble").addTimeSignature(timeSignature)
    } else {
      measures[i] = new Stave(40 + xPart * i, height, xPart)
      // @ts-ignore
      measures[i].measure = i + 1
    }
    measures[i].setContext(context).draw()
  }
}

function placeNextNote(note: string) {
  if (currNoteIndex.value >= Object.keys(harmonies.value).length) return
  let measureIndex = Math.floor(harmonyKeys[currNoteIndex.value]) - 1
  let currKey = harmonyKeys[currNoteIndex.value]
  // @ts-ignore
  let duration = harmonies.value[currKey]["duration"]
  let undottedValues = [1, 2, 4, 8, 16]
  if (undottedValues.indexOf(duration) !== -1) {
    // @ts-ignore
    measureNotes[measureIndex].push(new StaveNote({keys: [note], duration: duration}))
  } else {
    duration = undottedValues.reduce((p, c) => {
      return (Math.abs(c - duration) < Math.abs(p - duration) ? c : p)
    })
    // @ts-ignore
    measureNotes[measureIndex].push(_dotted(new StaveNote({keys: [note], duration: duration})))
  }

  drawNotes()
  currNoteIndex.value += 1
  setAvailableNotes()
}

function drawNotes() {
  let measureIndex = Math.floor(harmonyKeys[currNoteIndex.value]) - 1

  // CHECK WHETHER NOTES NEED TO BE ERASED
  if (noteGroup) {
    // @ts-ignore
    context.svg.removeChild(noteGroup)
  }
  if (measureNotes[0].length === 0) {
    noteGroup = null
    return
  }
  noteGroup = context.openGroup()
  for (let i = 0; i <= measureIndex; i++) {
    Formatter.FormatAndDraw(
        context,
        measures[i],
        // @ts-ignore
        measureNotes[i]
    )
  }
  context.closeGroup()
}

function setAvailableNotes() {
  let currKey = harmonyKeys[currNoteIndex.value]

  // @ts-ignore
  let n = harmonies.value[currKey]["notes"]
  availableNotes.value = [
    ...n.map((v: string) => v+"/5"),
    ...n.map((v: string) => v+"/4"),
  ]
}

function _dotted(staveNote: Vex.Note, noteIndex = -1) {
  if (noteIndex < 0) {
    Dot.buildAndAttach([staveNote], {
      all: true,
    });
  } else {
    Dot.buildAndAttach([staveNote], {
      index: noteIndex,
    });
  }
  return staveNote;
}

function octaveColor(octave: string) {
  switch (octave) {
    case "3": return "dark"
    case "4": return "info"
    case "5": return "light"
  }
}

function erase() {
  if (measureNotes[0].length === 0) return
  measureNotes = {}
  for (let i = 0; i < numMeasures.value; i++) {
    //@ts-ignore
    measureNotes[i] = []
  }
  currNoteIndex.value = 0
  drawNotes()
  setAvailableNotes()
}
</script>

<style scoped>
.btn {
  font-size: 32px;
}
</style>