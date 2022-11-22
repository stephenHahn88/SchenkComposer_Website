<template>
  <div>
    <h1 style="color: white">Middleground Melody</h1>
    <b-row class="m-3 pl-3" style="background-color: rgba(255, 255, 255, 0.7); border-radius: 10px;">
      <div id="boo" style="overflow: auto"></div>

    </b-row>
    <b-row class="m-3">
      <b-col class="p-3" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; overflow-y: scroll; height: 350px;">
        <h2 style="color: white">Next Note (Rhythm: {{glyphs[currNoteIndex]}}; Harmony: {{plainHarmonies[currNoteIndex]}})</h2>
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
let letters = ['a','b','c','d']
let div: string | HTMLDivElement | HTMLCanvasElement | { lastElementChild: any; }[];

let key = "C"
let harmonies = ref({})
let durations = ref({})
let glyphs = ref([])
let plainHarmonies = ref([])
let notesCMajor = {
  "I": ["C","E","G"],
  "II": ["D","F","A"],
  "III": ["E","G","B"],
  "IV": ["F","A","C"],
  "V": ["G","B","D"],
  "VI": ["A","C","E"],
  "VII": ["B","D","F"]
}

let numMeasures: number;
let availableNotes: Ref<string[]> = ref(["A/4", "A/5"])
let timeSignature = "4/4"
let currNoteIndex = ref(0)
let noteGroup: any;

let renderer;
let context: Vex.RenderContext;
let measures: Vex.Stave[];
let measureNotes: any = {}

onMounted(async () => {
  await getRhythmAndProgression()
  drawStaff()
  setAvailableNotes()
})

async function getRhythmAndProgression() {
  let mgRhythm = await (await fetch("/api/composer/1/melody/1/mg-rhythm")).json()
  let hp = await (await fetch("/api/composer/1/melody/1/harmonicProgression")).json()

  let mgRhythmFlattened = []
  let hpFlattened = []
  for (let letter in mgRhythm) {
    for (let measureString of mgRhythm[letter]) {
      mgRhythmFlattened.push(measureString)
    }
    for (let harmony of hp[letter]) {
      hpFlattened.push(harmony)
    }
  }

  let hpIdx = 0
  for (let [i, rhythm] of mgRhythmFlattened.entries()) {
    for (let [j, noteString] of rhythm.split(" ").entries()) {
      let newKey = parseFloat(`${i+1}.${j}`)
      //@ts-ignore
      harmonies.value[newKey] = hpFlattened[hpIdx]
      //@ts-ignore
      durations.value[newKey] = _noteToDuration(noteString)
      //@ts-ignore
      glyphs.value[hpIdx] = noteString
      //@ts-ignore
      plainHarmonies.value = hpFlattened
      hpIdx++
    }
  }

  numMeasures = mgRhythmFlattened.length
  for (let i = 0; i < numMeasures; i++) {
    //@ts-ignore
    measureNotes[i] = []
  }
}

function getSrc(availableNote: string) {
  let n = availableNote.split("/").join("").toLowerCase()
  return `src/static/staffNotes/${n}.svg`
}

function drawStaff() {
  let defaultWidth = 800
  let xPart = defaultWidth/4
  let height = 25

  div = document.getElementById('boo') as HTMLDivElement
  renderer = new Renderer(div, Renderer.Backends.SVG)

  renderer.resize(4000, 250)
  context = renderer.getContext()
  context.scale(1.4, 1.4)
  context.setFont('Arial', 32)

  measures = []
  for (let i = 0; i < numMeasures; i++) {
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
  let harmonyKeys = Object.keys(harmonies.value).sort(
      (a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x)
  )
  if (currNoteIndex.value >= Object.keys(harmonies.value).length) return
  let measureIndex = Math.floor(harmonyKeys[currNoteIndex.value]) - 1
  let currKey = harmonyKeys[currNoteIndex.value]
  // @ts-ignore
  let duration = durations.value[currKey]
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
  let harmonyKeys = Object.keys(harmonies.value).sort(
      (a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x)
  )
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
  let harmonyKeys = Object.keys(harmonies.value).sort(
      (a, b) => {return parseFloat(a) - parseFloat(b)}).map((x) => parseFloat(x)
  )
  let currKey = harmonyKeys[currNoteIndex.value]
  // console.log(currKey)
  // @ts-ignore
  let n = notesCMajor[harmonies.value[currKey]]
  // console.log(n)
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
  for (let i = 0; i < numMeasures; i++) {
    //@ts-ignore
    measureNotes[i] = []
  }
  currNoteIndex.value = 0
  drawNotes()
  setAvailableNotes()
}

function _noteToDuration(note: string) {
  switch (note) {
    case '𝅘𝅥𝅰': return 32
    case '𝅘𝅥𝅰.':return 32.5
    case '𝅘𝅥𝅯': return 16
    case '𝅘𝅥𝅯.':return 16.5
    case '𝅘𝅥𝅮': return 8
    case '𝅘𝅥𝅮.':return 8.5
    case '♩': return 4
    case '♩.':return 4.5
    case '𝅗𝅥': return 2
    case '𝅗𝅥.':return 2.5
    case '𝅝': return 1
    case '𝅝.':return 1.5
    // case '𝅜': return
    // case '𝅜.': return
    // case '𝆷': return
    // case '𝆷.':return
  }
}
</script>

<style scoped>
.btn {
  font-size: 32px;
}
</style>