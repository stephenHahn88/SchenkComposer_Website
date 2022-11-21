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
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

let currHarmonicDuration = ref("𝅗𝅥.")
let possibleRhythms = computed(() => {
  switch (currHarmonicDuration.value) {
    case '𝅘𝅥𝅮': return ['𝅘𝅥𝅮', '𝅘𝅥𝅯 𝅘𝅥𝅯', '𝅘𝅥𝅰 𝅘𝅥𝅰 𝅘𝅥𝅰 𝅘𝅥𝅰', '𝅘𝅥𝅯 𝅘𝅥𝅰 𝅘𝅥𝅰']
    case '♩': return ['♩', '𝅘𝅥𝅮 𝅘𝅥𝅮', '𝅘𝅥𝅮 𝅘𝅥𝅯 𝅘𝅥𝅯', '𝅘𝅥𝅯 𝅘𝅥𝅯 𝅘𝅥𝅯 𝅘𝅥𝅯']
    case '♩.': return ['♩.', '♩ 𝅘𝅥𝅮', '𝅘𝅥𝅮 ♩', '𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮']
    case '𝅗𝅥': return ['𝅗𝅥', '♩ ♩', '♩. 𝅘𝅥𝅮', '𝅘𝅥𝅮 ♩ 𝅘𝅥𝅮', '𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮 𝅘𝅥𝅮']
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

watch(storedNotes, () => {
  drawNotes()
}, { deep: true })

onMounted(async () => {
  await getPhraseInfo()
  updateCurrHarmonicDuration()
  storedNotes.value = {'a':[],'b':[],'c':[],'d':[]}
  for (let letter of ['a','b','c','d']) {
    for (let i = 0; i < mgRhythm.value[letter].length; i++) {
      storedNotes.value[letter].push([])
    }
  }
  drawStaves()
})

async function getPhraseInfo() {
  //TODO get melody and composer Ids
  phrase = await (await fetch("/api/composer/1/melody/1/phrase-structure")).json()
  phraseMeasures.value = await (await fetch("/api/composer/1/melody/1/hypermeter")).json()
  meter.value = await (await fetch("/api/composer/1/melody/1/meter")).json()
  mgRhythm.value = await (await fetch("/api/composer/1/melody/1/mg-rhythm")).json()
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
      measures_l[i].addClef('treble').addTimeSignature(meter.value)
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