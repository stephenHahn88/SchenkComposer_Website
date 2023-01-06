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
          <PresetMatrices
            @get-preset-matrix="(preset) => getPresetMatrix(preset)"
          ></PresetMatrices>
          <!--        MATRIX-->
          <b-row style="width: 800px">
            <b-container style="width: 740px; border-radius: 10px;">
              <b-row>
                <b-col class="mt-3">
                  <b-button variant="danger" @click="clear">X</b-button>
                </b-col>
                <b-col
                    v-for="(harmony_label, i) in harmonies"
                    style="text-align: center"
                    class="mt-3"
                >
                  <p
                      :style='{ backgroundColor: colors[i], color: "white", borderRadius: "30px"}'
                  >{{harmony_label}}</p>
                </b-col>
              </b-row>
              <b-row v-for="(harmony_from, i) in harmonies">
                <b-col style="text-align: center">
                  <p
                      :style='{ backgroundColor: colors[i], color: "white", borderRadius: "30px"}'
                  >{{harmony_from}}</p>
                </b-col>
                <b-col
                    v-for="(harmony_to, j) in harmonies"
                >
                  <b-form-input
                      class="my-2"
                      style="width: 62px;"
                      v-model="transitions[i][j]"
                  ></b-form-input>
                </b-col>
              </b-row>
              <b-row>
                <b-button
                    class="m-4"
                    :variant="saveMatrixSuccess"
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
                  class="font-20 full-width"
              >&#8592</b-button>
            </b-col>
            <b-col>
              <b-button
                  variant="danger"
                  @click="erase()"
                  class="font-20"
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
              <p class="font-32">{{letter}}:</p>
            </b-col>
            <b-col
                v-for="i in max"
                v-if="max - i < sequences[letter]['sequenceReverse'].length"
            >
              <p class="font-32">{{sequences[letter]['sequenceReverse'][max - i]}}</p>
            </b-col>
            <b-col
                v-else
                class="font-32"
            >
            </b-col>
          </b-row>
          <b-row>
            <b-col
                v-for="(harmony, i) in harmonies"
                :key="i"
            >
              <b-button
                  :style="{backgroundColor: colors[i]}"
                  @click="addHarmony(harmony)"
              >{{harmony}}</b-button>
            </b-col>
          </b-row>
          <b-row
              class="mt-3 mr-3"
              style="justify-content: end"
          >
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
                :variant="saveProgressionSuccess"
                @click="saveProgression"
            >Save all</b-button>
          </b-row>
          <b-row class="mt-4" style="height: 150px">
            <b-button
              variant="primary"
              class="m-4"
              @click="generateMelody"
              :disabled="disableGenerate"
              style="width: 100%; font-size: 32px"
            >Generate Melody</b-button>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b-row><h3>Tempo</h3></b-row>
              <b-row>
                <input class="slider" type="range" min="20" max="120" v-model="tempo" style="width: 100%">
                <datalist id="tickmarks" class="mt-2">
                  <option value="20">Slow</option>
                  <option value="70">Moderate</option>
                  <option value="120">Fast</option>
                </datalist>
              </b-row>
            </b-col>
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
import {ref, onMounted, watch, computed, inject, defineEmits, reactive} from "vue";
import _ from "lodash";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import Hexagon from "../../static/hexagon"
import {playNotesAndHarmony, flattenPhrase, flattenHarmony, flattenMgRhythm, flattenMgRhythmLetter} from "@/data";
import PresetMatrices from "@/views/dagOther/HPComponents/PresetMatrices.vue";

const emit = defineEmits(['mgharmonyanimate'])

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")

let harmonies = ref(['I','ii','iii','IV','V','vi','vii'])
let openHarmonies = ref(['V'])
let closeHarmonies = ref(['I'])
let colors = ref(['green', 'navy', 'rgb(255, 130, 200)', 'orange', 'red', 'purple', 'black'])


// Transition matrix values
let transitions = reactive([])
for (let i = 0; i < Object.keys(harmonies.value).length; i++) {
  transitions.push(new Array(Object.keys(harmonies.value).length).fill(0))
}

let saveMatrixSuccess = ref("danger")
let saveProgressionSuccess = ref("danger")

// Maximum of maxLen
let max = computed(() => {
  let m = 0
  for (let letter in sequences.value) {
    if (sequences.value[letter]["maxLen"] > m) {
      m = sequences.value[letter]["maxLen"]
    }
  }
  return m
})

// Store information for generated harmonic sequences
let sequences = ref({
  "a": ref({"sequenceReverse": [], "maxLen": 6, 'selected': 'inactive'}),
  "b": ref({"sequenceReverse": [], "maxLen": 4, 'selected': 'inactive'}),
  "c": ref({"sequenceReverse": [], "maxLen": 5, 'selected': 'inactive'}),
  "d": ref({"sequenceReverse": [], "maxLen": 3, 'selected': 'inactive'}),
})

let disableGenerate = computed(() => {
  for (let letter of ['a','b','c','d']) {
    if (phraseMeasures.value[letter] === undefined || phraseMeasures.value[letter] <= 0) continue
    if (sequences.value[letter]["sequenceReverse"].length !== sequences.value[letter]["maxLen"]) {
      return true
    }
  }
  return false
})
let tempo = ref(60)

let mgRhythm = ref({})
let phraseMeasures = ref({})
let phraseStructure = ref([])

// Updates sequence maxlens
watch(mgRhythm, () => {
  for (let letter in sequences.value) {
    let count = 0
    for (let str of mgRhythm.value[letter]) {
      count += str.split(" ").length
    }
    sequences.value[letter]["maxLen"] = count
  }
})

// Requirements for the graph
let mySVG;
let simulation;

// Gather information for the length of harmonic progressions
onMounted(async () => {
  harmonies.value = ['I','ii','iii','IV','V','vi','vii']

  mySVG = document.getElementById("mySVG");
  simulation = new ForceSimulation(mySVG);
  simulation.templateStore.add("hexagon", Hexagon)

  await getMgRhythm()
  let pm = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/hypermeter")).json()
  phraseMeasures.value = pm.result
  let ps = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")).json()
  phraseStructure.value = ps.result
  await getSavedProgressions()
  await getSavedMatrix()
  await saveMatrix()
  redraw()
})

// get middleground rhythm
async function getMgRhythm() {
  let temp = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/mg-rhythm")).json()
  if (temp.status !== 200) return
  mgRhythm.value = temp.result
}

// Get previously saved matrix
async function getSavedMatrix() {
  let results = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/matrix")).json()
  if (results.status !== 200) return
  harmonies.value = results.labels
  openHarmonies.value = results.openHarmonies
  closeHarmonies.value = results.closeHarmonies
  for (let [i, r] of harmonies.value.entries()) {
    for (let [j, s] of harmonies.value.entries()) {
      transitions[i][j] = parseFloat(results.matrix[i][j])
    }
  }
  saveMatrixSuccess.value = "success"
}

// Get previously saved harmonic progressions
async function getSavedProgressions() {
  let temp = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/harmonicProgression")).json()
  if (temp.status !== 200) return
  let progressions = temp.result
  for (let letter in sequences.value) {
    sequences.value[letter]["sequenceReverse"] = progressions[letter].slice().reverse()
  }
  saveProgressionSuccess.value = "success"
}

// Get preset matrix from model
async function getPresetMatrix(preset) {
  preset = preset.replaceAll(" ", "_")
  let matrix = await fetch(`/api/matrix/${preset}`)
  matrix = await matrix.json()

  let mat = matrix["matrix"]
  let labels = [...matrix["labels"]]
  for (let [i, l] of labels.entries()) {
    labels[i] = l//.replace(/[\[\]no1234567890]/g, "")
  }
  harmonies.value = labels
  openHarmonies.value = matrix["open"]
  closeHarmonies.value = matrix["close"]

  // TRANSPOSE MATRIX
  mat = _.zip(...mat)
  while (transitions.length > 0) transitions.pop()
  // PLACE VALUES INCLUDED IN RETRIEVED MATRIX
  for (let i = 0; i < harmonies.value.length; i++) {
    for (let j = 0; j < harmonies.value.length; j++) {
      transitions[i] = mat[i]
    }
  }
  redraw()
}

// save current matrix parameters
async function saveMatrix() {
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "matrix": transitions,
      "matrixLabels": harmonies.value,
      "openHarmonies": openHarmonies.value,
      "closeHarmonies": closeHarmonies.value
    })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/matrix", requestOptions)
  response = await response.json()
  console.log(response)
  saveMatrixSuccess.value = "success"
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
  saveProgressionSuccess.value = "success"
}

// generate harmonic progressions from model
async function handleGenerate(letter) {
  let phraseEndsForCadences = _findPhraseEndHarmonies()
  let len = sequences.value[letter]["maxLen"]
  let endHarmony;
  if (Object.keys(phraseEndsForCadences).includes(letter)) {
    endHarmony = phraseEndsForCadences[letter]
  } else {
    endHarmony = harmonies.value[Math.floor(Math.random() * harmonies.value.length)]
  }
  let flattenedMatrix = []
  for (let r of transitions) {
    for (let e of r) {
      flattenedMatrix.push(e)
    }
  }
  let progression = await fetch(`/api/harmonic-progression/${endHarmony}/${len}/${flattenedMatrix.join("-")}/${harmonies.value.join("-")}`)
  progression = await progression.json()
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
      answers[prev.at(0)] = openHarmonies.value[Math.floor(Math.random() * openHarmonies.value.length)]
    } else if (curr === "[AC]") {
      answers[prev.at(0)] = closeHarmonies.value[Math.floor(Math.random() * closeHarmonies.value.length)]
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
  for (let letter of ['a', 'b','c','d']) {
      sequences.value[letter]['sequenceReverse'] = []
  }
}

// redraw entire graph
function redraw() {
  // build array of nodes, one for each harmony
  let nodes = []
  for (let i = 0; i < harmonies.value.length; i++) {
    nodes.push({
      id: harmonies.value[i],
      shape: {
        type: "hexagon",
        scale: 0.5
      },
      payload: {
        title: harmonies.value[i].split(/[\[o]/)[0],
        color: colors.value[i]
      }
    })
  }

  // build array of links based on probabilites
  let links = []
  for (let from = 0; from < harmonies.value.length; from++) {
    for (let to = 0; to < harmonies.value.length; to++) {
      // does not support arrows to self unfortunately
      if (from === to || transitions[from][to] === 0) {
        continue
      }
      // turn numbers in row of matrix into probability distribution
      let distribution = transitions[from]
      distribution = distribution.map((item) => parseFloat(item))
      let total = _.sum(distribution)
      let percent = _.round(_.round(
          parseFloat(transitions[from][to]) / total, 3
      ) * 100, 1)
      // add link with proper percentage and size
      links.push({
        source: harmonies.value[from],
        target: harmonies.value[to],
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
  for (let i = 0; i < harmonies.value.length; i++) {
    for (let j = 0; j < harmonies.value.length; j++) {
      transitions[i][j] = 0
    }
  }
}

async function generateMelody() {
  let ts = await (await fetch(`/api/composer/${encodeURIComponent(composerId.value)}/melody/${encodeURIComponent(melodyId.value)}/meter`)).json()
  ts = ts.result
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
        /api/generate-melody/partial/
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
  playNotesAndHarmony(notes, harmonies, tempo.value)
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "notes": notes, "harmonies": harmonies, "tempo": tempo.value })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/notes-harmonies-tempo", requestOptions)
  response = await response.json()
  console.log(response)
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

datalist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  writing-mode: vertical-lr;
  width: 100%;
  color: white
}

option {
  padding: 0;
}

.font-32 {
  font-size: 32px;
}

.font-20 {
  font-size: 20px;
}

.full-width {
  width: 100%;
}

.hoverable:hover, .active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.hoverable:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.btn {
  font-size: 18px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #FF00FF;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #FF00FF;
  cursor: pointer;
}


</style>