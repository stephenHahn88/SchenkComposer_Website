<template>
  <div>
    <b-row>
      <h1>Harmonic Rhythm</h1>
    </b-row>
    <b-row class="mb-5">
      <h2>Determine <span :style="`color: ${textEmphasisColor}`">when the harmony changes</span> in your melody by pressing the note buttons below. Be sure to <span :style="`color: ${textEmphasisColor}`">fill in every measure</span></h2>
    </b-row>
      <b-row
          v-for="letter in ['a','b','c','d']"
          v-if="hypermeter[letter] > 0"
      >
        <h2 class="m-4">{{letter.toUpperCase()}}</h2>
        <b-row class="mb-2 mx-1 pb-3 px-3 letter-group" style="width:100%">
          <b-button variant="warning" @click="backspace(letter)" class="m-2">
            &#8592
          </b-button>
          <div :id="`boo_${letter}`" style="overflow: auto;"></div>
          <div class="mt-3">
            <QuestionHover
                :id="`question-rhythm-buttons-${letter}`"
                title="Rhythmic Buttons"
                :text="[
                        `The following buttons fill a measure of time`,
                        `Longer note values are recommended, especially in the measure before a cadence`
                      ]"
            ></QuestionHover>
            <b-button
                v-for="rhythm in possibleRhythms[meter]"
                v-on:click="placeNotes(rhythm, letter)"
                class="mb-3 ml-3 pl-5"
                variant="primary"
            >
              <img
                  class="p-0 m-0"
                  v-for="r in rhythm.split(' ')"
                  :src="`src/static/floatingNotes/${rhythmToSVGName[r]}.svg`" :alt="rhythm"
                  style="width: 45px; filter: invert(100%)"

              >
            </b-button>
          </div>
        </b-row>
      </b-row>
    <b-row class="mt-4">
      <b-col>
        <b-button
          @click="pushRouter('/meter-hypermeter')"
          style="width: 100%"
          variant="info"
        >
          Return to Meter and Hypermeter
        </b-button>
      </b-col>
      <b-col>
        <b-button
          @click="saveAll"
          style="width: 100%"
          :variant="saveSuccess"
        >
          Save and Continue
        </b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <h2 :style="saveSuccess.value === 'success' ? 'color: green': 'color: red'">{{status}}</h2>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import {onMounted, ref, inject} from 'vue'
import {_parseRhythms, pushRouter, textEmphasisColor} from "@/data";
import Vex from 'vexflow'
import QuestionHover from "@/components/QuestionHover.vue";

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

const emit = defineEmits(['mgrhythmanimate'])

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")
let {currPage, updateCurrPage} = inject("currPage")

// TODO: gather from data
let possibleRhythms = {
  //Simple subdivision
  "2/2": ['1', '1/2 1/2'], //['𝅝', '𝅗𝅥 𝅗𝅥'],
  "3/2": ['1.', '1 1/2', '1/2 1', '1/2 1/2 1/2'], //['𝅝.', '𝅝 𝅗𝅥', '𝅗𝅥 𝅝', '𝅗𝅥 𝅗𝅥 𝅗𝅥'],
  "4/2": ['2', '1 1', '1. 1/2', '1 1/2 1/2', '1/2 1/2 1/2 1/2'], //['𝅜', '𝅝 𝅝', '𝅝. 𝅗𝅥', '𝅝 𝅗𝅥 𝅗𝅥', '𝅗𝅥 𝅗𝅥 𝅗𝅥 𝅗𝅥'],

  "2/4": ['1/2', '1/4 1/4'], //['𝅗𝅥', '♩ ♩'],
  "3/4": ['1/2.', '1/2 1/4', '1/4 1/2', '1/4 1/4 1/4'], //['𝅗𝅥.', '𝅗𝅥 ♩', '♩ 𝅗𝅥', '♩ ♩ ♩'],
  "4/4": ['1', '1/2 1/2', '1/2. 1/4', '1/2 1/4 1/4', '1/4 1/4 1/4 1/4'], //['𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩', '𝅗𝅥 ♩ ♩', '♩ ♩ ♩ ♩'],

  "2/8": ['1/4', '1/8 1/8'], //['♩', '♪ ♪'],
  "3/8": ['1/4.', '1/4 1/8', '1/8 1/4', '1/8 1/8 1/8'], //['♩.', '♩ ♪', '♪ ♩', '♪ ♪ ♪'],
  "4/8": ['1/2', '1/4 1/4', '1/4. 1/8', '1/4 1/8 1/8', '1/8 1/8 1/8 1/8'], //['𝅗𝅥', '♩ ♩', '♩. ♪', '♩ ♪ ♪', '♪ ♪ ♪ ♪'],

  //Compound subdivision
  "6/2": ['2.', '1. 1.'], //['𝅜.', '𝅝. 𝅝.'],
  "6/4": ['1.', '1/2. 1/2.'], //['𝅝.', '𝅗𝅥. 𝅗𝅥.'],
  "6/8": ['1/2.', '1/4. 1/4.'], //['𝅗𝅥.', '♩. ♩.'],

  "9/2": ['2. 1.', '1. 1. 1.'], //['𝅜. 𝅝.', '𝅝. 𝅝. 𝅝.'],
  "9/4": ['1. 1/2.', '1/2. 1/2. 1/2.'], //['𝅝. 𝅗𝅥.', '𝅗𝅥. 𝅗𝅥. 𝅗𝅥.'],
  "9/8": ['1/2. 1/4.', '1/4. 1/4. 1/4.'], //['𝅗𝅥. ♩.', '♩. ♩. ♩.'],

  "12/2": ['4.', '2. 2.', '1. 1. 1. 1.'], //['𝆷.', '𝅜. 𝅜.', '𝅝. 𝅝. 𝅝. 𝅝.'],
  "12/4": ['2.', '1. 1.', '1/2. 1/2. 1/2. 1/2.'], //['𝅜.', '𝅝. 𝅝.', '𝅗𝅥. 𝅗𝅥. 𝅗𝅥. 𝅗𝅥.'],
  "12/8": ['1.', '1/2. 1/2.', '1/4. 1/4. 1/4. 1/4.'], //['𝅝.', '𝅗𝅥. 𝅗𝅥.', '♩. ♩. ♩. ♩.'],
}

let rhythmToSVGName = {
  '1/8': 'eighth',
  '1/4': 'quarter',
  '1/4.': 'dquarter',
  '1/2': 'half',
  '1/2.': 'dhalf',
  '1': 'whole',
  '1.': 'dwhole'
}

// For vexflow notation
let renderers = []
let contexts = []
let measures = []
let defaultWidth;
let totalMeasures;
let currMeasures = [0, 0, 0, 0]
let noteGroups = {
  'a': [],
  'b': [],
  'c': [],
  'd': []
}

// Middleground stored and retrieved from database
let storedMeasures = {
  'a': [],
  'b': [],
  'c': [],
  'd': []
}

let phrase
let hypermeter = ref({});
let meter = ref('4/4');

let saveSuccess = ref("danger")
let status = ref("")

onMounted(async () => {
  updateCurrPage("/harmonic-rhythm")
  await getPhraseInfo()
  drawStaves()
  await getSavedRhythm()
})

// Retrieves phrase, meter, and hypermeter
async function getPhraseInfo() {
  let p = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")).json()
  phrase = p.result
  let h = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/hypermeter")).json()
  hypermeter.value = h.result
  let m = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/meter")).json()
  meter.value = m.result
}

// Get saved middleground rhythms if existing
async function getSavedRhythm() {
  let mgRhythm = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/mg-rhythm")).json()
  if (mgRhythm.status !== 200) return
  // Return if saved mgRhythm is empty
  if (Object.keys(mgRhythm).every((key) => {return mgRhythm[key].length === 0})) return
  // Empty all notes
  for (let letter of ['a','b','c','d']) {
    while (noteGroups[letter].length > 0) backspace(letter)
  }
  // Place notes from database
  for (let letter of ['a','b','c','d']) {
    for (let rhythm of mgRhythm.result[letter]) {
      placeNotes(rhythm, letter)
    }
  }
  storedMeasures = mgRhythm.result
  saveSuccess.value = "success"
}

function drawStaves() {
  defaultWidth = 440
  let rendererSize = defaultWidth * 6
  let xPart = defaultWidth / 4
  let height = 0

  for (let [l, letter] of ["a","b","c","d"].entries()) {
    if (hypermeter.value[letter] <= 0) continue
    totalMeasures = hypermeter.value[letter]
    const div = document.getElementById(`boo_${letter}`)
    renderers[l] = new Renderer(div, Renderer.Backends.SVG)

    renderers[l].resize(rendererSize, 150)
    contexts[l] = renderers[l].getContext()
    contexts[l].scale(1.4, 1.4)
    contexts[l].setFont('Arial', 18)

    // Create number of measures based on hypermeter
    let measures_l = []
    for (let i = 0; i < totalMeasures; i++) {
      if (i===0) {
        measures_l[i] = new Stave(xPart * i, height, xPart + 50)
        measures_l[i].addClef('percussion').addTimeSignature(meter.value)
      } else {
        measures_l[i] = new Stave(50 + xPart * i, height, xPart)
        measures_l[i].measure = i + 1
      }
      measures_l[i].setContext(contexts[l]).draw()
    }
    measures[l] = measures_l
  }
}

// Removes last measure of rhythms
function backspace(letter) {
  let l = ['a','b','c','d'].indexOf(letter)
  if (currMeasures[l] === 0) return
  contexts[l].svg.removeChild(noteGroups[letter].pop())
  storedMeasures[letter].pop()
  console.log(storedMeasures)
  currMeasures[l]--;
}

// Places rhythms in the context for the given letter
function placeNotes(rhythms, letter) {
  if (storedMeasures[letter].length === hypermeter.value[letter]) return
  let l = ['a','b','c','d'].indexOf(letter)
  let notes = _parseRhythms(rhythms)

  noteGroups[letter].push(contexts[l].openGroup())
  Formatter.FormatAndDraw(contexts[l], measures[l][currMeasures[l]], notes)
  currMeasures[l]++
  storedMeasures[letter].push(rhythms)
  contexts[l].closeGroup()
}

function checkValidInput() {
  for (let letter in storedMeasures) {
    if (hypermeter.value[letter] <= 0 || hypermeter.value[letter] === "# measures") continue
    if (storedMeasures[letter].length !== hypermeter.value[letter]) return {status: "invalid"}
  }
  return {status: "valid"}
}

// Save middleground rhythm to database
async function saveAll() {
  if (checkValidInput().status === "invalid") {
    status.value = "Some measures are not filled. Make sure to check all panels and scroll to the right if you have a long phrase."
    return
  }
  let requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "mgRhythm": storedMeasures })
  }
  let response = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/mg-rhythm", requestOptions)
  let json = await response.json()
  console.log(json)
  if (json.status !== 200) return

  emit('mgrhythmanimate')
  saveSuccess.value = "success"
  status.value = "Success!"
  await pushRouter("/harmonic-progression")
}
</script>


<style scoped>
h1, h2 {
  color: white;
}

.btn {
  font-size: 32px;
}

.letter-group {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}


</style>