<template>
  <div>
    <b-row>
      <b-col>
        <h1>Harmonic Progression</h1>
      </b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col>
        <h2>
          <span :style="`color: ${textEmphasisColor}`">Fill out the transition matrix</span> and have SchenkComposer
          <span :style="`color: ${textEmphasisColor}`">generate a harmonic progression</span> for you.
          Or manually provide your own harmonic progressions.
        </h2>
      </b-col>
    </b-row>
    <b-row>
<!--      TRANSITION MATRIX BLOCK-->
      <b-col
          class="mx-1 py-4"
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
                  <b-button
                      class="ml-3 mb-2"
                      variant="danger"
                      @click="clear"
                      style="width: 40px; height: 40px"
                  >X</b-button>
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
              <b-row
                  v-for="(harmony_from, i) in harmonies"
              >
                <b-col
                    style="text-align: center"
                    class="mt-2"
                >
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
<!--              <b-row>-->
<!--                <b-button-->
<!--                    class="m-4"-->
<!--                    :variant="saveMatrixSuccess"-->
<!--                    @click="saveMatrix"-->
<!--                >Save</b-button>-->
<!--              </b-row>-->
            </b-container>
          </b-row>
        </b-container>
      </b-col>
<!--      SEQUENCE GENERATION-->
    </b-row>
    <b-row class="mt-4">
      <b-col
          class="mx-1 p-4"
          style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.3); overflow: auto"
      >
        <b-container >
          <b-row class="mb-5">
            <b-col cols="2">
              <h2>Harmonic Progression</h2>
            </b-col>
            <b-col class="ml-5 mt-3">
              <QuestionHover
                id="question-progression"
                title="Harmonic Progression"
                :text="[
                    `The harmonic progression tells the model which harmonies to improvise over`,
                    `Each section (a and b) is designated its own harmonic progression`,
                    `Different genres follow different harmonic patterns, or even different harmonic languages`,
                    `Here, each roman numeral specifies a harmony based on a scale degree. i.e. 'iii' is based on the third note of the major scale`
                ]"
              ></QuestionHover>
            </b-col>
            <b-col cols="3">
              <b-button
                  variant="warning"
                  @click="backspace()"
                  class="font-20 full-width"
              >&#8592</b-button>
            </b-col>
            <b-col cols="2">
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
<!--            <b-button-->
<!--                class="m-2"-->
<!--                variant="info"-->
<!--                @click="handleGenerate(_findActiveLetter())"-->
<!--            >Generate Row</b-button>-->
            <b-button
              class="m-2"
              variant="success"
              @click="generateAll"
            >Generate All Using Transition Matrix</b-button>
<!--            <b-button-->
<!--                class="m-2"-->
<!--                :variant="saveProgressionSuccess"-->
<!--                @click="saveProgression"-->
<!--            >Save all</b-button>-->
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <h2 style="color: red">{{status}}</h2>
      </b-col>
    </b-row>
<!--    SAVE AND RETURN-->
    <b-row class="my-4 p-4" style="height: 140px;">
      <b-col>
        <b-button
            variant="info"
            @click="pushRouter('/harmonic-rhythm')"
            class="my-2"
            style="width: 100%; height: 100%; font-size: 28px"
        >
          Return to Harmonic Rhythm
        </b-button>
      </b-col>
      <b-col>
        <b-button
            :variant="saveSuccess"
            @click="saveAll"
            class="my-2"
            style="width: 100%; height: 100%; font-size: 28px"
        >
          Save All and Continue
        </b-button>
      </b-col>
    </b-row>
<!--      MARKOV CHAIN GRAPH-->
    <b-row class="ml-2 mt-5 mb-2">
      <b-button @click="redraw" style="background-color: purple">Refresh</b-button>
      <h2 class="ml-5">Play around with the nodes of your matrix below!</h2>
    </b-row>
    <b-row
        class="mx-2 mb-2"
        style="border-radius: 10px; background-color: rgba(255, 255, 255, 0.8)">
      <svg id="mySVG" width="100%" height="600px"></svg>
    </b-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed, inject, defineEmits, reactive, provide} from "vue";
import _ from "lodash";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import Hexagon from "../../static/hexagon"
import PresetMatrices from "@/views/dagOther/HPComponents/PresetMatrices.vue";
import {pushRouter, _findPhraseEndHarmonies, textEmphasisColor} from "@/data";
import QuestionHover from "@/components/QuestionHover.vue"

const emit = defineEmits(['mgharmonyanimate'])

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")
let {currPage, updateCurrPage} = inject("currPage")

let harmonies = ref(['I','ii','iii','IV','V','vi','viio6'])
let openHarmonies = ref(['V'])
let closeHarmonies = ref(['I'])
let colors = ref(['green', 'navy', 'rgb(255, 130, 200)', 'orange', 'red', 'purple', 'black'])

provide('harmonies', harmonies)

// Transition matrix values
let transitions = reactive([])
for (let i = 0; i < Object.keys(harmonies.value).length; i++) {
  transitions.push(new Array(Object.keys(harmonies.value).length).fill(1))
}

let saveSuccess = ref("danger")
let status = ref("")

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
  "a": ref({"sequenceReverse": [], "maxLen": 6, 'selected': 'active'}),
  "b": ref({"sequenceReverse": [], "maxLen": 4, 'selected': 'inactive'}),
  "c": ref({"sequenceReverse": [], "maxLen": 5, 'selected': 'inactive'}),
  "d": ref({"sequenceReverse": [], "maxLen": 3, 'selected': 'inactive'}),
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
  updateCurrPage("/harmonic-progression")
  harmonies.value = ['I','ii','iii','IV','V','vi','viio6']

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
}

// Get previously saved harmonic progressions
async function getSavedProgressions() {
  let temp = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/harmonicProgression")).json()
  if (temp.status !== 200) return
  let progressions = temp.result
  for (let letter in sequences.value) {
    sequences.value[letter]["sequenceReverse"] = progressions[letter].slice().reverse()
  }
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

function _checkValidMatrix() {
  for (let row of transitions) {
    for (let t of row) {
      if (isNaN(t) || parseFloat(t) < 0) {
        return {status: "invalid"}
      }
    }
  }
  return {status: "valid"}
}

// save current matrix parameters
async function saveMatrix() {
  if (_checkValidMatrix().status === "invalid") {
    status.value = "The transition matrix must only hold numbers greater than or equal to 0"
    return {status: "invalid"}
  }
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
  return {status: "valid"}
}

function _harmonicSequencesToObject() {
  let progressions = {}
  for (let letter in sequences.value) {
    progressions[letter] = sequences.value[letter]["sequenceReverse"].slice().reverse()
  }
  return progressions
}

function _checkValidProgression() {
  for (let letter of ['a', 'b']) {
    if (sequences.value[letter].sequenceReverse.length !== sequences.value[letter].maxLen) {
      status.value = "Your harmonic progression is not full. Make sure both a and b sections are full of harmonies."
      return {status: "invalid"}
    }
  }
  return {status: "valid"}
}

// save current harmonic progression input
async function saveProgression() {
  if (_checkValidProgression().status === "invalid") {
    return {status: "invalid"}
  }
  let progressions = _harmonicSequencesToObject()
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "harmonicProgression": progressions })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/harmonicProgression", requestOptions)
  response = await response.json()
  console.log(response)
  return {status: "valid"}
}

async function saveAll() {
  let status = await saveMatrix()
  if (status.status === "invalid") return
  status = await saveProgression()
  if (status.status === "invalid") return
  saveSuccess.value = "success"
  await pushRouter("/generate-melody")
}

// generate harmonic progressions from model
async function handleGenerate(letter) {
  if (_checkValidMatrix().status === "invalid") {
    status.value = "The transition matrix must only hold numbers greater than or equal to 0"
    return
  }
  // gets phrase ends as object e.g. {'a': 'V', 'b': 'I', ...}
  let phraseEndsForCadences = _findPhraseEndHarmonies(phraseStructure.value, openHarmonies.value, closeHarmonies.value)
  let len = sequences.value[letter]["maxLen"]
  let endHarmony = _getEndHarmony(letter, phraseEndsForCadences)
  let flattenedMatrix = _flattenMatrix()

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "endHarmony": endHarmony,
      "length": len,
      "flattenedMatrix": flattenedMatrix,
      "harmonies": harmonies.value
    })
  }
  let progression = await fetch("/api/harmonic-progression", options)
  progression = await progression.json()
  sequences.value[letter]["sequenceReverse"] = progression["progression"].reverse()
}


function generateAll() {
  for (let letter of ['a','b','c','d']) {
    handleGenerate(letter)
  }
}


function _getEndHarmony(letter, phraseEndsForCadences) {
  let endHarmony;
  // If current letter has a cadence afterwards, retrieve it. Otherwise pick a random harmony
  if (Object.keys(phraseEndsForCadences).includes(letter)) {
    return phraseEndsForCadences[letter]
  }
  return harmonies.value[Math.floor(Math.random() * harmonies.value.length)]
}

function _flattenMatrix() {
  let flattenedMatrix = []
  for (let r of transitions) {
    for (let e of r) {
      flattenedMatrix.push(e)
    }
  }
  return flattenedMatrix
}

// helper function to find the ending harmony for each phrase
// function _findPhraseEndHarmonies(phrase, open, close) {
//   let answers = {}
//   let curr;
//   let prev;
//   let i = 0
//   for (let phraseUnit of phrase) {
//     if (i === 0) {curr = phraseUnit; i++; continue;}
//     prev = curr
//     curr = phraseUnit
//     if (curr === "[HC]") {
//       answers[prev.at(0)] = open[Math.floor(Math.random() * open.length)]
//     } else if (curr === "[AC]") {
//       answers[prev.at(0)] = close[Math.floor(Math.random() * close.length)]
//     }
//     i++
//   }
//   return answers
// }

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
      ) * 100)
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