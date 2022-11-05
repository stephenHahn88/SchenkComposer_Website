<template>
  <div>
    <b-row class="m-3 pl-3" style="background-color: rgba(255, 255, 255, 0.7); border-radius: 10px;">
      <div id="boo" style="overflow: auto"></div>

    </b-row>
    <b-row class="m-3">
      <b-button
          v-for="availableNote in availableNotes"
          :variant="octaveColor(availableNote.slice(-1))"
          class="m-1"
          @click="placeNextNote(availableNote)"
      >{{availableNote}}</b-button>
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
    "notes": ["C", "F", "A"],
    "duration": 2
  }),
  1.5: ref({
    "label": "V",
    "notes": ["D", "G", "B"],
    "duration": 2
  }),
  2: ref({
    "label": "I",
    "notes": ["C", "E", "G"],
    "duration": 2.5
  }),
  2.75: ref({
    "label": "V",
    "notes": ["D", "G", "B"],
    "duration": 4
  }),
  3: ref({
    "label": "vi",
    "notes": ["C", "E", "A"],
    "duration": 4.5
  })
})
let numMeasures: Ref<number> = computed(() => {
  return Math.floor(Math.max(...Object.keys(harmonies.value).map(h => parseFloat(h))))
})
let availableNotes: Ref<string[]> = ref(["A/4", "A/3", "A/5"])
let timeSignature = "4/4"
let currNoteIndex = 0


let renderer;
let context: Vex.RenderContext;
let measures: Vex.Stave[];
let measureNotes = {}
for (let i = 0; i < numMeasures.value; i++) {
  //@ts-ignore
  measureNotes[i] = []
}

let defaultWidth;

onMounted(() => {
  drawStaff()
  setAvailableNotes()
})

function drawStaff() {
  defaultWidth = 800
  let xPart = defaultWidth/4
  let height = 10

  const div = document.getElementById('boo') as HTMLDivElement
  renderer = new Renderer(div, Renderer.Backends.SVG)

  renderer.resize(800, 150)
  context = renderer.getContext()
  context.setFont('Arial', 18)

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
  // PLACE NOTES
  let keys = Object.keys(harmonies.value).sort((a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x))
  let measureIndex = Math.floor(keys[currNoteIndex]) - 1
  let currKey = keys[currNoteIndex]
  // @ts-ignore
  let duration = harmonies.value[currKey]["duration"]
  let undottedValues = [16, 8, 1, 2, 4]
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
  Formatter.FormatAndDraw(
      context,
      measures[measureIndex],
      // @ts-ignore
      measureNotes[measureIndex]
  )

  setAvailableNotes()
  currNoteIndex += 1
}

function setAvailableNotes() {
  let keys = Object.keys(harmonies.value).sort((a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x))
  let measureIndex = Math.floor(keys[currNoteIndex]) - 1
  let currKey = keys[currNoteIndex]

  // @ts-ignore
  let n = harmonies.value[currKey]["notes"]
  availableNotes.value = [
    ...n.map((v: string) => v+"/3"),
    ...n.map((v: string) => v+"/4"),
    ...n.map((v: string) => v+"/5")
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
</script>

<style scoped>

</style>