<template>
  <div class="m-5">
    <div id="boo"></div>
    <div>
      <b-button
        v-for="rhythm in possibleRhythms"
        v-on:click="placeNotes(rhythm, 0)"
      >
        {{ rhythm }}
      </b-button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, defineProps} from 'vue'
import Vex from 'vexflow'

const { Renderer, Stave, Formatter, StaveNote, Dot } = Vex.Flow;

let possibleRhythms = ['♩ ♩ ♩ ♩', '𝅝', '𝅗𝅥 𝅗𝅥', '𝅗𝅥. ♩']

let renderer;
let context;
let measures;
let totalMeasures;
let phrase;
let phraseMeasures;
let windowWidth;

onMounted(() => {
  totalMeasures = 6
  phrase = ['a', '[HC]', "a'", 'b', '[AC]']
  phraseMeasures = { a: 2, b: 4 }

  windowWidth = window.innerWidth
  const div = document.getElementById('boo')
  renderer = new Renderer(div, Renderer.Backends.SVG)

  renderer.resize(windowWidth, 200)
  context = renderer.getContext()
  context.setFont('Arial', 18)

  measures = []
  for (let i = 0; i < totalMeasures; i++) {

    if (i === 0) {
      measures[i] = new Stave((windowWidth / (totalMeasures + 1)) * i, 40, windowWidth / (totalMeasures + 1) + 40)
      measures[i].addClef('treble').addTimeSignature('4/4')
    } else {
      measures[i] = new Stave(40 + (windowWidth / (totalMeasures + 1)) * i, 40, windowWidth / (totalMeasures + 1))
    }
    measures[i].setContext(context).draw()
  }
})

function placeNotes(rhythms, letter) {
  // let notes = [new StaveNote({ keys: ["c/4"], duration: '4'})]
  // Formatter.FormatAndDraw(context, measures[0], notes)
  let notes = _parseRhythms(rhythms)
  Formatter.FormatAndDraw(context, measures[0], notes)
}

function _parseRhythms(rhythms) {
  let glyphs = rhythms.split(" ")
  let finalRhythms = []
  glyphs.forEach((glyph) => {
    switch (glyph) {
      case '♩':
        finalRhythms.push(new StaveNote({ keys: ["c/5"], duration: '4'}));
        break;
      case '𝅝':
        finalRhythms.push(new StaveNote({ keys: ["c/5"], duration: '1'}));
        break;
      case '𝅗𝅥':
        finalRhythms.push(new StaveNote({ keys: ["c/5"], duration: '2'}));
        break;
      case '𝅗𝅥.':
        finalRhythms.push(_dotted(new StaveNote({ keys: ["c/5"], duration: '2'})))
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

</style>