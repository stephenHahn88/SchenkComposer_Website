<template>
  <div>
    <h1>Melodic Rhythm</h1>
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
        @click="clickTab(letter)"
        v-if="phraseMeasures[letter] > 0"
      >
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <b-button variant="danger" class="m-2" @click="clearAll(letter)">X</b-button>
          <div :id="`boo_${letter}`" style="overflow: auto;"></div>
          <div class="mt-3">
            <p>Next harmonic rhythm: <strong>{{currHarmonicDuration}}</strong></p>
            <b-button
              v-for="rhythm in possibleRhythms"
              @click="placeNotes(rhythm, letter)"
              class="mx-3"
              variant="primary"
            >
              {{rhythm}}
            </b-button>
          </div>
        </b-row>
      </b-tab>
    </b-tabs>
    <b-row>
      <b-col></b-col>
      <b-col>
        <b-button
            @click="generate"
            style="width: 100%"
            variant="info"
        >
          Generate
        </b-button>
      </b-col>
      <b-col>
        <b-button
          @click="saveAll"
          style="width: 100%"
          variant="success"
        >Save All</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import {computed, onMounted, inject, ref, watch} from 'vue'
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")

let currHarmonicDuration = ref("𝅗𝅥.")
let possibleRhythms = computed(() => {
  switch (currHarmonicDuration.value) {
    case '𝅘𝅥𝅮': return ['𝅘𝅥𝅮', '𝅘𝅥𝅯 𝅘𝅥𝅯', '𝅘𝅥𝅰 𝅘𝅥𝅰 𝅘𝅥𝅰 𝅘𝅥𝅰', '𝅘𝅥𝅯 𝅘𝅥𝅰 𝅘𝅥𝅰']
    case '♩': return ['♩', '𝅘𝅥𝅮 𝅘𝅥𝅮', '𝅘𝅥𝅮 𝅘𝅥𝅯 𝅘𝅥𝅯', '𝅘𝅥𝅯 𝅘𝅥𝅯 𝅘𝅥𝅯 𝅘𝅥𝅯']
    case '♩.': return ['♩.', '♩ 𝅘𝅥𝅮', '𝅘𝅥𝅮 ♩', '𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮']
    case '𝅗𝅥': return ['𝅗𝅥', '♩ ♩', '♩. 𝅘𝅥𝅮', '𝅘𝅥𝅮 ♩ 𝅘𝅥𝅮', '𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮', '♩ 𝅘𝅥𝅮 𝅘𝅥𝅮']
    case '𝅗𝅥.': return ['𝅗𝅥.', '♩ ♩ ♩', '♩. ♩.', '♩. ♩ 𝅘𝅥𝅮', '𝅘𝅥𝅮 ♩ ♩ 𝅘𝅥𝅮', '♩ 𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮']
    case '𝅝': return ['𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩', '♩ ♩ ♩ ♩', '♩ 𝅗𝅥 ♩']
    case '𝅝.': return ['𝅝.', '𝅗𝅥. 𝅗𝅥.', '𝅗𝅥. 𝅗𝅥 ♩', '♩ 𝅗𝅥 𝅗𝅥 ♩', '𝅗𝅥 ♩ ♩ ♩']
    case '𝅜': return ['𝅜', '𝅝 𝅝', '𝅝. 𝅗𝅥', '𝅗𝅥 𝅗𝅥 𝅗𝅥 𝅗𝅥', '𝅗𝅥 𝅝 𝅗𝅥']
    case '𝅜.': return ['𝅜.', '𝅝. 𝅝.', '𝅝. 𝅝 𝅗𝅥', '𝅗𝅥 𝅝 𝅝 𝅗𝅥', '𝅝 𝅗𝅥 𝅗𝅥 𝅗𝅥']
  }
})

let renderers = []
let contexts = []
let measures = []
let divs = []

let totalMeasures;
let phrase;
let phraseMeasures = ref({'a':2,'b':2,'c':4,'d':3});
let defaultWidth;
let meter = ref('4/4');
let mgRhythm = ref({
  'a':['𝅗𝅥. ♩', '♩ ♩ ♩ ♩'],
  'b':['𝅗𝅥. ♩', '♩ ♩ ♩ ♩'],
  'c':['𝅗𝅥. ♩', '♩ ♩ ♩ ♩'],
  'd':['𝅗𝅥. ♩', '♩ ♩ ♩ ♩'],
});

let storedNotes = ref({});

let currMgRhythmIdx = [0,0,0,0]
let currMeasureIdx = [0,0,0,0]
let selectedLetter = ref('a')
let letters = ['a','b','c','d']

const emit = defineEmits(['fgrhythmanimate'])

watch(storedNotes, () => {
  drawNotes()
}, { deep: true })

onMounted(async () => {
  await getPhraseInfo()
  updateCurrHarmonicDuration()
  _assignStoredNotes()
  drawStaves()
  await getSavedForegroundRhythm()
})

async function getPhraseInfo() {
  phrase = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/phrase-structure")).json()
  phraseMeasures.value = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/hypermeter")).json()
  letters = []
  for (let letter in phraseMeasures.value) {
    if (phraseMeasures.value[letter] > 0) {
      letters.push(letter)
    }
  }
  meter.value = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/meter")).json()
  mgRhythm.value = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/mg-rhythm")).json()
}

async function getSavedForegroundRhythm() {
  let temp = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/fg-rhythm")
  if (!temp.ok) return
  temp = await temp.json()
  storedNotes.value = temp
}

async function saveAll() {
  let requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "fgRhythm": storedNotes.value })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/fg-rhythm", requestOptions)
  let json = await response.json()
  console.log(json)
  emit('fgrhythmanimate')
}

function _assignStoredNotes() {
  storedNotes.value = {'a':[],'b':[],'c':[],'d':[]}
  for (let letter of ['a','b','c','d']) {
    for (let i = 0; i < mgRhythm.value[letter].length; i++) {
      storedNotes.value[letter].push([])
    }
  }
}

function drawStaves() {
  for (let [l, letter] of letters.entries()) {
    drawStaff(letter)
  }
}

function drawStaff(letter) {
  defaultWidth = 2000
  let rendererSize = defaultWidth * 6
  let xPart = defaultWidth / 4
  let height = 0

  let l = letters.indexOf(letter)
  if (phraseMeasures.value[letter] <= 0) return
  totalMeasures = phraseMeasures.value[letter]
  divs[l] = document.getElementById(`boo_${letter}`)
  renderers[l] = new Renderer(divs[l], Renderer.Backends.SVG)

  renderers[l].resize(rendererSize, 150)
  contexts[l] = renderers[l].getContext()
  contexts[l].scale(1.4, 1.4)
  contexts[l].setFont('Arial', 18)

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

function updateCurrHarmonicDuration() {
  let l = letters.indexOf(selectedLetter.value)
  if (_letterComplete()) return
  currHarmonicDuration.value = mgRhythm.value[selectedLetter.value][currMeasureIdx[l]].split(" ")[currMgRhythmIdx[l]]
}

function refresh(letter) {
  let l = letters.indexOf(letter)
  while(divs[l].lastElementChild){
    divs[l].removeChild(divs[l].lastElementChild);
  }
  drawStaff(letter)
}

function clearAll(letter) {
  let l = letters.indexOf(letter)
  while(divs[l].lastElementChild){
    divs[l].removeChild(divs[l].lastElementChild);
  }
  currMeasureIdx[l] = 0
  currMgRhythmIdx[l] = 0
  _emptyStoredNotes(letter)
  updateCurrHarmonicDuration()
  drawStaff(letter)
}

function _emptyStoredNotes(letter) {
  for (let measure of storedNotes.value[letter]) {
    while (measure.length > 0) {
      measure.pop()
    }
  }
}

function clickTab(letter) {
  selectedLetter.value = letter
  let l = letters.indexOf(letter)
  updateCurrHarmonicDuration()
}

function _letterComplete() {
  return currMeasureIdx[letters.indexOf(selectedLetter.value)] >= mgRhythm.value[selectedLetter.value].length
}

function placeNotes(rhythms, letter) {
  let l = letters.indexOf(letter)
  if (_letterComplete()) return
  let totalNumNotesInCurrMeasure = mgRhythm.value[letter][currMeasureIdx[l]].split(" ").length

  storedNotes.value[letter][currMeasureIdx[l]].push(rhythms)
  currMgRhythmIdx[l] += 1

  //Check that all notes in a measure have been accounted for
  if (currMgRhythmIdx[l] === totalNumNotesInCurrMeasure) {
    currMgRhythmIdx[l] = 0
    currMeasureIdx[l]++
  }

  updateCurrHarmonicDuration()
}

function drawNotes() {
  for (let letter of letters) {
    let l = letters.indexOf(letter)
    refresh(letter)

    for (let [i, measure] of storedNotes.value[letter].entries()) {
      let notes = _parseRhythms(measure.join(" "))
      try {
        Formatter.FormatAndDraw(contexts[l], measures[l][i], notes)
      } catch(err) {
        if (err instanceof TypeError) continue
        throw Error
      }
    }
  }
}

function _parseRhythms(rhythms) {
  let glyphs = rhythms.split(" ")
  let finalRhythms = []
  glyphs.forEach((glyph) => {
    switch (glyph) {
      case '𝅘𝅥𝅰': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '32'})); break;
      case '𝅘𝅥𝅰.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '32'}))); break;
      case '𝅘𝅥𝅯': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '16'})); break;
      case '𝅘𝅥𝅯.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '16'}))); break;
      case '𝅘𝅥𝅮': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '8'})); break;
      case '𝅘𝅥𝅮.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '8'}))); break;
      case '♩': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '4'})); break;
      case '♩.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '4'}))); break;
      case '𝅗𝅥': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '2'})); break;
      case '𝅗𝅥.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '2'}))); break;
      case '𝅝': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1'})); break;
      case '𝅝.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1'}))); break;
      case '𝅜': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/2'})); break;
      case '𝅜.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1/2'}))); break;
      case '𝆷': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/4'})); break;
      case '𝆷.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1/4'}))); break;
    }
  })
  return finalRhythms
}

function _dotted(staveNote, noteIndex = -1) {
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

async function generate() {
  let rhythms = mgRhythm.value[selectedLetter.value]
  let flattenedRhythms = []
  for (let m of rhythms) {
    m = m.split(" ")
    m.forEach((b) => flattenedRhythms.push(b))
  }
  let meterComponent = meter.value.split("/").join("-")
  let rhythmComponent = flattenedRhythms.join("-")
  let fgRhythm = await (await fetch(`model/foreground-rhythm/${encodeURIComponent(meterComponent)}/${encodeURIComponent(rhythmComponent)}`)).json()
  console.log(fgRhythm["fgRhythm"])
  clearAll(selectedLetter.value)
  for (let rhythmGroup of fgRhythm["fgRhythm"]) {
    let unit = []
    for (let ql of rhythmGroup) {
      unit.push(_quarterLengthToGlyph(ql))
    }
    placeNotes(unit.join(" "), selectedLetter.value)
  }
}

function _quarterLengthToGlyph(ql) {
  switch (ql) {
    case 0.125: return "𝅘𝅥𝅰"
    case 0.1875: return "𝅘𝅥𝅰."
    case 0.25: return "𝅘𝅥𝅯"
    case 0.375: return "𝅘𝅥𝅯."
    case 0.5: return "𝅘𝅥𝅮"
    case 0.75: return "𝅘𝅥𝅮."
    case 1.0: return "♩"
    case 1.5: return "♩."
    case 2.0: return "𝅗𝅥"
    case 3.0: return "𝅗𝅥."
    case 4.0: return "𝅝"
    case 6.0: return "𝅝."
  }
}
</script>

<style scoped>
h1 {
  color: white;
}

.letter-group {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}

.btn {
  font-size: 32px;
}
</style>