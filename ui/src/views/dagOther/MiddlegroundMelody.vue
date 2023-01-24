<template>
  <div>
    <h1 style="color: white">Middleground Melody</h1>
    <b-row class="m-3 pl-3" style="background-color: rgba(255, 255, 255, 0.7); border-radius: 10px;">
      <div id="boo" style="overflow: auto"></div>

    </b-row>
    <b-row class="m-3">
      <b-col
          class="p-3"
          style="
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            overflow-y: scroll;
            height: 350px;
          "
      >
        <h2 style="color: white" v-if="savedNotes.length !== flattenedHarmonies.length">
          Next Note
          (Rhythm: {{ glyphs[currNoteIndex] }}; Harmony: {{ flattenedHarmonies[currNoteIndex] }})
        </h2>
        <h2 style="color: white" v-else>
          Middleground Melody Complete!
        </h2>
        <b-button
            v-for="availableNote in availableNotes"
            v-if="savedNotes.length !== flattenedHarmonies.length"
            :variant="octaveColor(availableNote.slice(-1))"
            class="m-1"
            @click="placeNextNote(availableNote)"
            style="width: 100%"
        >
          <strong>{{availableNote.split('/').join("")}}</strong>
          <img :src="getSrc(availableNote)" style="width:128px;">
        </b-button>
      </b-col>
      <b-col>
        <b-row><b-button variant="danger" class="mx-3 mb-3" style="width: 20%" @click="erase()">X</b-button></b-row>
        <b-row><b-button variant="info" class="m-3" style="width: 100%; height: 100px" @click="generateMgMelody">Generate</b-button></b-row>
        <b-row><b-button variant="success" class="m-3" style="width: 100%; height: 100px" @click="saveMelodyNotes">Save</b-button></b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, inject, onMounted, ref, Ref} from "vue";
import Vex from "vexflow"

const emit = defineEmits(['mgmelodyanimate'])

let {composerId, updateComposerId}: any = inject("composerId")
let {melodyId, updateMelodyId}: any = inject("melodyId")

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;
let letters = ['a','b','c','d']
let div: string | HTMLDivElement | HTMLCanvasElement | { lastElementChild: any; }[];

let key = "C"
let harmonies = ref({})
let durations = ref({})
let glyphs = ref([])
let flattenedHarmonies = ref([])
let flattenedPhrase = ref([])
let notesCMajor = {
  "I": ["C","E","G"],
  "ii": ["D","F","A"],
  "iii": ["E","G","B"],
  "IV": ["F","A","C"],
  "V": ["G","B","D"],
  "vi": ["A","C","E"],
  "viio6": ["B","D","F"]
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

let savedNotes: Ref<string[]> = ref([])

onMounted(async () => {
  await getRhythmAndProgression()
  drawStaff()
  await getSavedMelodyNotes()
  if (savedNotes.value.length !== flattenedHarmonies.value.length) {
    setAvailableNotes()
  }
})

async function getRhythmAndProgression() {
  let phraseStructure = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/phrase-structure")).json()
  let mgRhythm = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/mg-rhythm")).json()
  let hp = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/harmonicProgression")).json()

  flattenedPhrase.value = phraseStructure
      .filter((s: string) => s.at(0) !== "[")
      .map((s: string) => s.at(0))

  let mgRhythmFlattened = []
  let hpFlattened = []
  for (let letter of flattenedPhrase.value) {
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
      flattenedHarmonies.value = hpFlattened
      hpIdx++
    }
  }

  numMeasures = mgRhythmFlattened.length
  for (let i = 0; i < numMeasures; i++) {
    //@ts-ignore
    measureNotes[i] = []
  }
}

async function getSavedMelodyNotes() {
  let mel = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/middleground-melody")
  if (mel.status !== 404) {
    let notes = await mel.json()
    savedNotes.value = []
    currNoteIndex.value = 0
    for (let note of notes) {
      placeNextNote(note)
    }
  }
}

async function saveMelodyNotes() {
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "mgMelody": savedNotes.value })
  }
  //TODO get current composer and melody ID
  let response = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/middleground-melody", requestOptions)
  let json = await response.json()
  console.log(json)
  emit('mgmelodyanimate')
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

  renderer.resize(6000, 250)
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

  savedNotes.value.push(note)
  drawNotes()
  currNoteIndex.value += 1
  if (savedNotes.value.length !== flattenedHarmonies.value.length) {
    setAvailableNotes()
  }
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
  // @ts-ignore
  let n = notesCMajor[harmonies.value[currKey]]
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
  savedNotes.value = []
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

async function generateMgMelody() {
  let mgMel = await (await fetch("/model/middleground-melody/" + flattenedHarmonies.value.join("-"))).json()
  erase()
  savedNotes.value = []
  currNoteIndex.value = 0
  for (let note of mgMel["mgNotes"]) {
    placeNextNote(note)
  }
}
</script>

<style scoped>
.btn {
  font-size: 32px;
}
</style>