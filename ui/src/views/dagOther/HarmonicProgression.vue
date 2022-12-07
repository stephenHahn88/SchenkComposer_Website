<template>
  <div>
    <h1>Harmonic Progression</h1>
    <b-row class="ml-2">
<!--      TRANSITION MATRIX BLOCK-->
      <b-col
          class="p-2"
          cols="6"
          style="background-color: rgba(0, 0, 0, 0.3); border-radius: 10px; overflow: auto"
      >
        <b-container>
          <b-row class="mb-5" style="height: 100px; width: 800px">
            <b-col cols="4"><h2>Transition Matrix</h2></b-col>
            <!--          PRESET MATRICES-->
            <b-col
                class="mr-3"
                style="
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
              "
            >
              <h3>Preset Matrices</h3>
              <b-button
                  v-for="preset in presetMatrices"
                  variant="info"
                  style="width: 100px;"
                  class="m-2"
                  @click="getPresetMatrix(preset)"
              >
                {{preset}}
              </b-button>
            </b-col>
          </b-row>
          <!--        MATRIX-->
          <b-row style="width: 800px">
            <b-container style="width: 740px; border-radius: 10px;">
              <b-row>
                <b-col class="mt-3">
                  <b-button variant="danger" @click="clear">X</b-button>
                </b-col>
                <b-col
                    v-for="(color, harmony_label, i) in harmonies" :key="i"
                    style="text-align: center"
                    class="mt-3"
                >
                  <p
                      :style='{ backgroundColor: harmonies[harmony_label], color: "white", borderRadius: "30px"}'
                  >{{harmony_label}}</p>
                </b-col>
              </b-row>
              <b-row
                  v-for="(color, harmony_from, i) in harmonies" :key="i"
                  class="harmony_row"
                  :class="harmony_from"
              >
                <b-col
                    style="text-align: center"
                >
                  <p
                      :style='{ backgroundColor: harmonies[harmony_from], color: "white", borderRadius: "30px"}'
                  >{{harmony_from}}</p>
                </b-col>
                <b-col
                    v-for="(color, harmony_to, j) in harmonies" :key="j"
                >
                  <b-form-input
                      class="my-2"
                      style="width:62px;"
                      v-model="transitions[harmony_from][harmony_to]"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row>
                <b-button
                    class="m-4"
                    variant="success"
                    @click="saveMatrix"
                >Save</b-button>
              </b-row>
            </b-container>
          </b-row>
        </b-container>
      </b-col>
<!--      SEQUENCE GENERATION-->
      <b-col
          class="mx-4 p-4"
          style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.3); overflow: auto"
      >
        <b-container style="width: 700px">
          <b-row class="mb-2">
            <b-col>
              <h2>Generation</h2>
            </b-col>
            <b-col></b-col>
            <b-col>
              <b-button
                  variant="warning"
                  @click="backspace()"
                  style="width: 100%; font-size: 20px"
              >&#8592</b-button>
            </b-col>
            <b-col>
              <b-button
                  variant="danger"
                  @click="erase()"
                  style="font-size: 20px"
              >X</b-button>
            </b-col>
          </b-row>
          <b-row
              v-for="letter in Object.keys(sequences)"
              @click="selectRow(letter)"
              class="hoverable p-1 mb-1"
              :class="sequences[letter]['selected']"
              v-if="phraseMeasures[letter] > 0"
          >
            <b-col>
              <p style="font-size: 32px;">{{letter}}:</p>
            </b-col>
            <b-col
                v-for="i in max"
                v-if="max - i < sequences[letter]['sequenceReverse'].length"
            >
              <p style="font-size: 32px;">{{sequences[letter]['sequenceReverse'][max - i]}}</p>
            </b-col>
            <b-col
                v-else
                style="font-size: 32px;"
            >
            </b-col>
          </b-row>
          <b-row>
            <b-col
                v-for="(color, harmony, i) in harmonies"
                :key="i"
            >
              <b-button
                  :style="{ backgroundColor: color}"
                  @click="addHarmony(harmony)"
              >{{harmony}}</b-button>
            </b-col>
          </b-row>
          <b-row class="mt-3 mr-3" style="justify-content: end">
            <b-button
                class="m-2"
                variant="info"
                @click="handleGenerate(_findActiveLetter())"
            >Generate Row</b-button>
            <b-button
              class="m-2"
              variant="info"
              @click="generateAll"
            >Generate All</b-button>
            <b-button
                class="m-2"
                variant="success"
                @click="saveProgression"
            >Save all</b-button>
          </b-row>
          <b-row>
            <b-button
              variant="info"
              @click="generateMelody"
            >Generate Melody</b-button>
          </b-row>
        </b-container>

      </b-col>
    </b-row>
<!--      MARKOV CHAIN GRAPH-->
    <b-row class="ml-2 mt-5 mb-2">
      <b-button @click="redraw" style="background-color: purple">Refresh</b-button>
    </b-row>
    <b-row
        class="mx-2 mb-2"
        style="border-radius: 10px; background-color: rgba(255, 255, 255, 0.8)">
      <svg id="mySVG" width="100%" height="600px"></svg>
    </b-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed, inject, defineEmits} from "vue";
import _ from "lodash";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import Hexagon from "../../static/hexagon"
import {playNotesAndHarmony, flattenPhrase, flattenHarmony, flattenMgRhythm, flattenMgRhythmLetter} from "@/data";

const emit = defineEmits(['mgharmonyanimate'])

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")

// Color codes for harmonies
let harmonies = ref({
  'I': 'green',
  'II': 'navy',
  'III': 'rgb(255, 130, 200)',
  'IV': 'orange',
  "V": 'red',
  "VI": 'purple',
  "VII": 'black'
})

// Preset matrices from Flask server
let presetMatrices = ["Classical Major", "Rock"]

// Transition matrix values
let transitions = ref({
  'I': ref({'I': 0, 'II': 2, 'III': 1, 'IV': 2, "V": 2, "VI": 2, "VII": 1}),
  'II': ref({'I': 0, 'II': 0, 'III': 0, 'IV': 0, "V": 1, "VI": 0, "VII": 0}),
  'III': ref({'I': 0, 'II': 1, 'III': 0, 'IV': 6, "V": 0, "VI": 3, "VII": 0}),
  'IV': ref({'I': 0, 'II': 4, 'III': 0, 'IV': 0, "V": 5, "VI": 0, "VII": 1}),
  'V': ref({'I': 8, 'II': 0, 'III': 0, 'IV': 0, "V": 0, "VI": 2, "VII": 0}),
  'VI': ref({'I': 0, 'II': 5, 'III': 1, 'IV': 3, "V": 1, "VI": 0, "VII": 0}),
  'VII': ref({'I': 1, 'II': 0, 'III': 0, 'IV': 0, "V": 0, "VI": 0, "VII": 0})
})

//Maximum of maxLen
let max = computed(() => {
  let m = 0
  for (let letter in sequences.value) {
    if (sequences.value[letter]["maxLen"] > m) {
      m = sequences.value[letter]["maxLen"]
    }
  }
  return m
})

//
let sequences = ref({
  "a": ref({"sequenceReverse": [], "maxLen": 6, 'selected': 'inactive'}),
  "b": ref({"sequenceReverse": [], "maxLen": 4, 'selected': 'inactive'}),
  "c": ref({"sequenceReverse": [], "maxLen": 5, 'selected': 'inactive'}),
  "d": ref({"sequenceReverse": [], "maxLen": 3, 'selected': 'inactive'}),
})
let mgRhythm = ref({})

let phraseMeasures = ref({})
let phraseStructure = ref([])

//updates sequence maxlens
watch(mgRhythm, () => {
  for (let letter in sequences.value) {
    let count = 0
    for (let str of mgRhythm.value[letter]) {
      count += str.split(" ").length
    }
    sequences.value[letter]["maxLen"] = count
  }
})

// requirements for the graph
let mySVG;
let simulation;

// gather information for the length of harmonic progressions
onMounted(async () => {
  harmonies = ref({
    'I': 'green',
    'II': 'navy',
    'III': 'rgb(255, 130, 200)',
    'IV': 'orange',
    "V": 'red',
    "VI": 'purple',
    "VII": 'black'
  })

  mySVG = document.getElementById("mySVG");
  simulation = new ForceSimulation(mySVG);
  simulation.templateStore.add("hexagon", Hexagon)

  await getMgRhythm()
  phraseMeasures.value = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/hypermeter")).json()
  phraseStructure.value = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")).json()
  await getSavedProgressions()
  await getSavedMatrix()
  await saveMatrix()
  redraw()
})

// get middleground rhythm
async function getMgRhythm() {
  let temp = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/mg-rhythm")
  if (!temp.ok) return
  mgRhythm.value = await temp.json()
}

// get previously saved matrix
async function getSavedMatrix() {
  let temp = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/matrix")
  if (!temp.ok) return
  let matrix = await temp.json()
  let numerals = ['I','II','III','IV','V','VI','VII']
  for (let [i, r] of numerals.entries()) {
    for (let [j, s] of numerals.entries()) {
      transitions.value[r][s] = parseFloat(matrix[i][j])
    }
  }
}

// get previously saved harmonic progressions
async function getSavedProgressions() {
  let temp = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/harmonicProgression")
  if (!temp.ok) return
  let progressions = await temp.json()
  for (let letter in sequences.value) {
    sequences.value[letter]["sequenceReverse"] = progressions[letter].slice().reverse()
  }
}

// get preset matrix from model
async function getPresetMatrix(preset) {
  preset = preset.replaceAll(" ", "_")
  let matrix = await fetch(`/model/matrix/${preset}`)
  matrix = await matrix.json()

  let mat = matrix["matrix"]
  let labels = [...matrix["labels"]]
  for (let [i, l] of labels.entries()) {
    labels[i] = l.replace(/[\[\]no1234567890]/g, "").toUpperCase()
  }
  console.log(labels)

  // TRANSPOSE MATRIX
  mat = _.zip(...mat)
  console.log(mat)
  // PLACE VALUES INCLUDED IN RETRIEVED MATRIX
  for (let [i, row] of mat.entries()) {
    for (let [j, val] of row.entries()) {
      transitions.value[labels[i]][labels[j]] = val
    }
  }
  // PLACE ZEROS ELSEWHERE
  for (let label in harmonies.value) {
    if (!labels.includes(label)) {
      for (let label2 in harmonies.value) {
        transitions.value[label][label2] = 0
        transitions.value[label2][label] = 0
      }
    }
  }
  console.log(transitions.value)
  redraw()
}

// save current matrix parameters
async function saveMatrix() {
  let matrix = _getMatrixAsArray()
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "matrix": matrix })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/matrix", requestOptions)
  response = await response.json()
  console.log(response)
}

// helper to turn transition refs to array
function _getMatrixAsArray() {
  let matrix = []
  for (let rowName in transitions.value) {
    let row = []
    for (let valName in transitions.value[rowName]) {
      row.push(transitions.value[rowName][valName])
    }
    matrix.push(row)
  }
  return matrix
}

function _harmonicSequencesToObject() {
  let progressions = {}
  for (let letter in sequences.value) {
    progressions[letter] = sequences.value[letter]["sequenceReverse"].slice().reverse()
  }
  return progressions
}

// save current harmonic progression input
async function saveProgression() {
  let progressions = _harmonicSequencesToObject()
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "harmonicProgression": progressions })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/harmonicProgression", requestOptions)
  response = await response.json()
  console.log(response)
  emit("mgharmonyanimate")
}

// generate harmonic progressions from model
async function handleGenerate(letter) {
  let phraseEndsForCadences = _findPhraseEndHarmonies()
  let len = sequences.value[letter]["maxLen"]
  let endHarmony;
  if (Object.keys(phraseEndsForCadences).includes(letter)) {
    endHarmony = phraseEndsForCadences[letter]
  } else {
    endHarmony = "IV"
  }
  let matrix = _getMatrixAsArray()
  let flattenedMatrix = []
  for (let r of matrix) {
    for (let e of r) {
      flattenedMatrix.push(e)
    }
  }
  let progression = await fetch(`/model/harmonic-progression/${endHarmony}/${len}/${flattenedMatrix.join("-")}`)
  progression = await progression.json()
  console.log(progression)
  sequences.value[letter]["sequenceReverse"] = progression["progression"].reverse()
}

function generateAll() {
  for (let letter of ['a','b','c','d']) {
    handleGenerate(letter)
  }
}

// helper function to find the ending harmony for each phrase
function _findPhraseEndHarmonies() {
  let answers = {}
  let curr;
  let prev;
  let i = 0
  for (let phraseUnit of phraseStructure.value) {
    if (i === 0) {curr = phraseUnit; i++; continue;}
    prev = curr
    curr = phraseUnit
    if (curr === "[HC]") {
      answers[prev.at(0)] = "V"
    } else if (curr === "[AC]") {
      answers[prev.at(0)] = "I"
    }
    i++
  }
  return answers
}

// updates ref to show selected row
function selectRow(letter) {
  for (let l in sequences.value) {
    if (l === letter) {
      sequences.value[l]['selected'] = 'active'
    } else {
      sequences.value[l]['selected'] = 'inactive'
    }
  }
}

// helper to find the currently active letter
function _findActiveLetter() {
  for (let l in sequences.value) {
    if (sequences.value[l]['selected'] === 'active') {
      return l
    }
  }
}

// add harmony to sequence
function addHarmony(harmony) {
  let letter = _findActiveLetter()
  if (sequences.value[letter]['sequenceReverse'].length >= sequences.value[letter]['maxLen']) return
  sequences.value[letter]['sequenceReverse'].push(harmony)
}

// remove harmony from sequence
function backspace() {
  let letter = _findActiveLetter()
  if (sequences.value[letter]['sequenceReverse'].length === 0) return
  sequences.value[letter]['sequenceReverse'].pop()
}

// erase sequence of current letter
function erase() {
  let letter = _findActiveLetter()
  sequences.value[letter]['sequenceReverse'] = []
}

// redraw entire graph
function redraw() {
  // build array of nodes, one for each harmony
  let nodes = []
  for (let harmony in harmonies.value) {
    nodes.push({
      id: harmony,
      shape: {
        type: "hexagon",
        scale: 0.5
      },
      payload: {
        title: harmony,
        color: harmonies.value[harmony]
      }
    })
  }

  // build array of links based on probabilites
  let links = []
  for (let from in transitions.value) {
    for (let to in transitions.value[from]) {
      // does not support arrows to self unfortunately
      if (from === to || transitions.value[from][to] === 0) {
        continue
      }
      // turn numbers in row of matrix into probability distribution
      let distribution = {...transitions.value[from]}
      distribution = _.mapValues(distribution, parseFloat)
      let total = _.sum(Object.values(distribution))
      let percent = _.round(_.round(
          parseFloat(transitions.value[from][to]) / total, 3
      ) * 100, 1)
      // add link with proper percentage and size
      links.push({
        source: from,
        target: to,
        type: "solid",
        directed: true,
        label: `${percent}%`,
        strength: "weak",
        width: 0.15 * percent
      })
    }
  }

  const graph = {
    nodes: nodes,
    links: links
  }
  simulation.render(graph)
}

// clear transition matrix values
function clear() {
  for (let from in transitions.value) {
    for (let to in transitions.value[from]) {
      transitions.value[from][to] = 0
    }
  }
}

async function generateMelody() {
  let ts = await (await fetch(`/api/composer/${encodeURIComponent(composerId.value)}/melody/${encodeURIComponent(melodyId.value)}/meter`)).json()
  let hp = _harmonicSequencesToObject()
  let phraseFlat = flattenPhrase(phraseStructure.value)

  let tsComponent = ts.split("/").join("-")

  let storedPhraseUnits = {}
  let notes = []
  let harmonies = []
  for (let letter of phraseFlat) {
    if (Object.keys(storedPhraseUnits).includes(letter)) {
      notes = notes.concat(storedPhraseUnits[letter]["notes"])
      harmonies = harmonies.concat(storedPhraseUnits[letter]["harmonies"])
      continue
    }
    let mgRhythmComponent = flattenMgRhythmLetter(mgRhythm.value, letter)
        .join("-")
        .replaceAll(" ", "s")
    let mgHarmonyComponent = hp[letter].join("-")
    let mel = await (await fetch(`
        /model/generate-melody/partial/
        ${encodeURIComponent(tsComponent)}/
        ${encodeURIComponent(mgRhythmComponent)}/
        ${encodeURIComponent(mgHarmonyComponent)}
    `.replaceAll(" ", ""))).json()

    notes = notes.concat(mel.notes)
    harmonies = harmonies.concat(mel.harmony)

    storedPhraseUnits[letter] = {}
    storedPhraseUnits[letter]["notes"] = mel.notes
    storedPhraseUnits[letter]["harmonies"] = mel.harmony
  }
  playNotesAndHarmony(notes, harmonies)
}
</script>

<style scoped>
svg {
  font-size: 32px;
}

p {
  font-size: 24px;
}

p, h1, h2, h3, col {
  color: white;
}

.hoverable:hover, .active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.hoverable:active {
  background-color: rgba(255, 255, 255, 0.3);
}

</style>