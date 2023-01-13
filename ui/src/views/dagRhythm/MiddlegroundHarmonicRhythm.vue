<template>
  <div>
    <h1>Harmonic Rhythm</h1>
    <b-tabs
        content-class="mt-3"
        fill
        pills
        no-fade
        style="font-size: 32px"
    >
      <b-tab
          v-for="letter in ['a','b','c','d']"
          :title="letter.toUpperCase()"
          v-if="hypermeter[letter] > 0"
      >
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <b-button variant="warning" @click="backspace(letter)" class="m-2">&#8592</b-button>
          <div :id="`boo_${letter}`" style="overflow: auto;"></div>
          <div class="mt-3">
            <b-button
                v-for="rhythm in possibleRhythms[meter]"
                v-on:click="placeNotes(rhythm, letter)"
                class="mx-3"
                variant="primary"
            >
              {{ rhythm }}
            </b-button>
          </div>
        </b-row>
      </b-tab>
    </b-tabs>
    <b-row>
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
  </div>
</template>

<script setup>
import {onMounted, ref, inject} from 'vue'
import {_parseRhythms, pushRouter} from "@/data";
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

const emit = defineEmits(['mgrhythmanimate'])

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")
let {currPage, updateCurrPage} = inject("currPage")

// TODO: gather from data
let possibleRhythms = {
  //Simple subdivision
  "2/2": ['𝅗𝅥 𝅗𝅥', '𝅝'],
  "3/2": ['𝅗𝅥 𝅗𝅥 𝅗𝅥', '𝅝.', '𝅗𝅥 𝅗𝅥', '𝅗𝅥 𝅗𝅥'],
  "4/2": ['𝅗𝅥 𝅗𝅥 𝅗𝅥 𝅗𝅥', '𝅝', '𝅝 𝅝', '𝅝. 𝅗𝅥', '𝅝 𝅗𝅥 𝅗𝅥'],

  "2/4": ['♩ ♩', '𝅗𝅥'],
  "3/4": ['♩ ♩ ♩', '𝅗𝅥.', '𝅗𝅥 ♩', '♩ 𝅗𝅥'],
  "4/4": ['♩ ♩ ♩ ♩', '𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩', '𝅗𝅥 ♩ ♩'],

  "2/8": ['♪ ♪', '♩'],
  "3/8": ['♪ ♪ ♪', '♩.', '♩ ♪', '♪ ♩'],
  "4/8": ['♪ ♪ ♪ ♪', '𝅗𝅥', '♩ ♩', '♩. ♪', '♩ ♪ ♪'],

  //Compound subdivision
  "6/2": ['𝅜.', '𝅝. 𝅝.'],
  "6/4": ['𝅝.', '𝅗𝅥. 𝅗𝅥.'],
  "6/8": ['𝅗𝅥.', '♩. ♩.'],

  "9/2": ['𝅜. 𝅝.', '𝅝. 𝅝. 𝅝.'],
  "9/4": ['𝅝. 𝅗𝅥.', '𝅗𝅥. 𝅗𝅥. 𝅗𝅥.'],
  "9/8": ['𝅗𝅥. ♩.', '♩. ♩. ♩.'],

  "12/2": ['𝆷.', '𝅜. 𝅜.', '𝅝. 𝅝. 𝅝. 𝅝.'],
  "12/4": ['𝅜.', '𝅝. 𝅝.', '𝅗𝅥. 𝅗𝅥. 𝅗𝅥. 𝅗𝅥.'],
  "12/8": ['𝅝.', '𝅗𝅥. 𝅗𝅥.', '♩. ♩. ♩. ♩.'],
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
  defaultWidth = 800
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
        measures_l[i] = new Stave(xPart * i, height, xPart + 40)
        measures_l[i].addClef('percussion').addTimeSignature(meter.value)
      } else {
        measures_l[i] = new Stave(40 + xPart * i, height, xPart)
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
  if (checkValidInput().status === "invalid") return
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
  await pushRouter("/harmonic-progression")
}
</script>


<style scoped>
h1 {
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