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
      <b-tab active title="A">
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <div id="boo_a" style="overflow: auto;"></div>
          <div class="mt-3">
            <b-button
                v-for="rhythm in possibleRhythms"
                v-on:click="placeNotes(rhythm, 'a')"
                class="mx-3"
            >
              {{ rhythm }}
            </b-button>
          </div>
        </b-row>
      </b-tab>
      <b-tab title="B" title-item-class="mytab">
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <div id="boo_b" style="overflow: auto;"></div>
          <div class="mt-3">
            <b-button
                v-for="rhythm in possibleRhythms"
                v-on:click="placeNotes(rhythm, 'b')"
                class="mx-3"
            >
              {{ rhythm }}
            </b-button>
          </div>
        </b-row>
      </b-tab>
      <b-tab title="C" title-item-class="mytab">
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <div id="boo_c" style="overflow: auto;"></div>
          <div class="mt-3">
            <b-button
                v-for="rhythm in possibleRhythms"
                v-on:click="placeNotes(rhythm, 'c')"
                class="mx-3"
            >
              {{ rhythm }}
            </b-button>
          </div>
        </b-row>
      </b-tab>
      <b-tab title="D" title-item-class="mytab">
        <b-row class="mb-3 mx-1 pb-3 pl-3 letter-group">
          <div id="boo_d" style="overflow: auto;"></div>
          <div class="mt-3">
            <b-button
                v-for="rhythm in possibleRhythms"
                v-on:click="placeNotes(rhythm, 'd')"
                class="mx-3"
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
import {onMounted, defineProps} from 'vue'
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

const emit = defineEmits(['mgrhythmanimate'])

const handleConfirm = () => {
  emit('mgrhythmanimate')
}

let possibleRhythms = ['♩ ♩ ♩ ♩', '𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩', '𝅗𝅥 ♩ ♩']

let renderer_a;
let context_a;
let measures_a;
let curr_measure_a = 0;

let renderer_b;
let context_b;
let measures_b;
let curr_measure_b = 0;

let renderer_c;
let context_c;
let measures_c;
let curr_measure_c = 0;

let renderer_d;
let context_d;
let measures_d;
let curr_measure_d = 0;

let totalMeasures;
let phrase;
let phraseMeasures;
let defaultWidth;

onMounted(() => {
  drawStaves()
})

function drawStaves() {
  phrase = ['a', "a'", 'b', '[HC]', 'c', "c'", 'd', '[AC]']
  phraseMeasures = { a: 2, b: 4, c: 2, d: 4 }
  defaultWidth = 800
  let rendererSize = defaultWidth * 2
  let xPart = defaultWidth / 4
  let height = 0

  // A
  totalMeasures = phraseMeasures['a']
  const div_a = document.getElementById('boo_a')
  renderer_a = new Renderer(div_a, Renderer.Backends.SVG)

  renderer_a.resize(rendererSize, 150)
  context_a = renderer_a.getContext()
  context_a.scale(1.4, 1.4)
  context_a.setFont('Arial', 18)

  measures_a = []
  for (let i = 0; i < totalMeasures; i++) {
    if (i === 0) {
      measures_a[i] = new Stave(xPart * i, height, xPart + 40)
      measures_a[i].addClef('treble').addTimeSignature('4/4')
    } else {
      measures_a[i] = new Stave(40 + xPart * i, height, xPart)
      measures_a[i].measure = i + 1
    }
    measures_a[i].setContext(context_a).draw()
  }

  // B
  totalMeasures = phraseMeasures['b']
  const div_b = document.getElementById('boo_b')
  renderer_b = new Renderer(div_b, Renderer.Backends.SVG)

  renderer_b.resize(rendererSize, 150)
  context_b = renderer_b.getContext()
  context_b.scale(1.4, 1.4)
  context_b.setFont('Arial', 18)

  measures_b = []
  for (let i = 0; i < totalMeasures; i++) {
    if (i === 0) {
      measures_b[i] = new Stave(xPart * i, height, xPart + 40)
      measures_b[i].addClef('treble').addTimeSignature('4/4')
    } else {
      measures_b[i] = new Stave(40 + xPart * i, height, xPart)
      measures_b[i].measure = i + 1
    }
    measures_b[i].setContext(context_b).draw()
  }

  // C
  totalMeasures = phraseMeasures['c']
  const div_c = document.getElementById('boo_c')
  renderer_c = new Renderer(div_c, Renderer.Backends.SVG)

  renderer_c.resize(rendererSize, 150)
  context_c = renderer_c.getContext()
  context_c.scale(1.4, 1.4)
  context_c.setFont('Arial', 18)

  measures_c = []
  for (let i = 0; i < totalMeasures; i++) {
    if (i === 0) {
      measures_c[i] = new Stave(xPart * i, height, xPart + 40)
      measures_c[i].addClef('treble').addTimeSignature('4/4')
    } else {
      measures_c[i] = new Stave(40 + xPart * i, height, xPart)
      measures_c[i].measure = i + 1
    }
    measures_c[i].setContext(context_c).draw()
  }

  // D
  totalMeasures = phraseMeasures['d']
  const div_d = document.getElementById('boo_d')
  renderer_d = new Renderer(div_d, Renderer.Backends.SVG)

  renderer_d.resize(rendererSize, 150)
  context_d = renderer_d.getContext()
  context_d.scale(1.4, 1.4)
  context_d.setFont('Arial', 18)

  measures_d = []
  for (let i = 0; i < totalMeasures; i++) {
    if (i === 0) {
      measures_d[i] = new Stave(xPart * i, height, xPart + 40)
      measures_d[i].addClef('treble').addTimeSignature('4/4')
    } else {
      measures_d[i] = new Stave(40 + xPart * i, height, xPart)
      measures_d[i].measure = i + 1
    }
    measures_d[i].setContext(context_d).draw()
  }
}

function placeNotes(rhythms, letter) {
  let notes = _parseRhythms(rhythms)
  switch (letter) {
    case 'a': Formatter.FormatAndDraw(context_a, measures_a[curr_measure_a], notes); curr_measure_a++; break;
    case 'b': Formatter.FormatAndDraw(context_b, measures_b[curr_measure_b], notes); curr_measure_b++; break;
    case 'c': Formatter.FormatAndDraw(context_c, measures_c[curr_measure_c], notes); curr_measure_c++; break;
    case 'd': Formatter.FormatAndDraw(context_d, measures_d[curr_measure_d], notes); curr_measure_d++; break;
  }
}

function _parseRhythms(rhythms) {
  let glyphs = rhythms.split(" ")
  let finalRhythms = []
  glyphs.forEach((glyph) => {
    switch (glyph) {
      case '♩':
        finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '4'}));
        break;
      case '𝅝':
        finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1'}));
        break;
      case '𝅗𝅥':
        finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '2'}));
        break;
      case '𝅗𝅥.':
        finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '2'})))
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
  background-color: rgb(150, 100, 100);
  font-size: 32px;
}

.letter-group {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}

</style>