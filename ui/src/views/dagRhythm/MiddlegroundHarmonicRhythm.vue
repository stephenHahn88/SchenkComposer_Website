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
      <b-col></b-col>
      <b-col></b-col>
      <b-col>
        <b-button
          @click="handleConfirm"
          style="width: 100%; background-color: green"
        >
          Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import {onMounted, defineProps, ref} from 'vue'
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

const emit = defineEmits(['mgrhythmanimate'])

const handleConfirm = () => {
  emit('mgrhythmanimate')
}

//TODO include something for all meters
let possibleRhythms = {
  "4/4": ['♩ ♩ ♩ ♩', '𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩', '𝅗𝅥 ♩ ♩'],
  "6/8": ['𝅗𝅥.', '♩. ♩.']
}


let renderers = []
let contexts = []
let measures = []
let curr_measures = [0, 0, 0, 0]
let noteGroups = {
  'a': [],
  'b': [],
  'c': [],
  'd': []
}

let totalMeasures;
let phrase;
let phraseMeasures;
let defaultWidth;
let meter = ref('4/4');

onMounted(async () => {
  await getPhraseInfo()
  drawStaves()
})

async function getPhraseInfo() {
  //TODO get melody and composer Ids
  phrase = await (await fetch("/api/composer/1/melody/1/phrase-structure")).json()
  phraseMeasures = await (await fetch("/api/composer/1/melody/1/hypermeter")).json()
  meter.value = await (await fetch("/api/composer/1/melody/1/meter")).json()
}

function drawStaves() {
  defaultWidth = 800
  let rendererSize = defaultWidth * 6
  let xPart = defaultWidth / 4
  let height = 0

  for (let [l, letter] of ["a","b","c","d"].entries()) {
    totalMeasures = phraseMeasures[letter]
    const div = document.getElementById(`boo_${letter}`)
    renderers[l] = new Renderer(div, Renderer.Backends.SVG)

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
}

function backspace(letter) {
  let l = ['a','b','c','d'].indexOf(letter)
  if (curr_measures[l] === 0) return
  contexts[l].svg.removeChild(noteGroups[letter].pop())
  curr_measures[l]--;
}

function placeNotes(rhythms, letter) {
  let l = ['a','b','c','d'].indexOf(letter)
  let notes = _parseRhythms(rhythms)
  noteGroups[letter].push(contexts[l].openGroup())
  Formatter.FormatAndDraw(contexts[l], measures[l][curr_measures[l]], notes)
  curr_measures[l]++
  contexts[l].closeGroup()
}

function _parseRhythms(rhythms) {
  let glyphs = rhythms.split(" ")
  let finalRhythms = []
  glyphs.forEach((glyph) => {
    switch (glyph) {
      case '♩': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '4'})); break;
      case '♩.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '4'}))); break;
      case '𝅗𝅥': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '2'})); break;
      case '𝅗𝅥.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '2'}))); break;
      case '𝅝': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1'})); break;
      case '𝅝.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1'}))); break;
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

.btn {
  font-size: 32px;
}

.letter-group {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}

</style>