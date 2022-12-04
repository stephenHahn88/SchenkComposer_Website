<template>
  <div>
    <b-button @click="generateAll" variant="success">Generate All</b-button>
  </div>
</template>

<script setup lang="ts">
import * as Tone from 'tone'

const sampler = new Tone.Sampler({
  urls: {
    "C5": "C5.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    "A4": "A4.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

async function generateAll() {
  console.log("in app.vue")
  let result = await fetch("/model/generate-all")
  // console.log(result)
  result = await result.json()
  let notes = result["notes"]
  let harmonies = result["harmonies"]
  console.log(notes)
  console.log(harmonies)

  playNotesAndHarmony(notes, harmonies)
}

function playNotesAndHarmony(notes: string[], harmonies: string[]) {
  Tone.loaded().then(() => {
    const now = Tone.now()

    // PLACE NOTES
    let curr = now
    for (let note of notes) {
      let noteQL = _triggerNotes(note, curr)
      curr += noteQL
    }

    // PLACE HARMONIES
    curr = now
    for (let harmony of harmonies) {
      let noteQL = 0;
      for (let note of harmony) {
        noteQL = _triggerNotes(note, curr)
      }
      curr += noteQL
    }
  })
}

function _triggerNotes(note: string, curr: number) {
  let noteName = _getNoteName(note)
  let noteQL = _getNoteQuarterlen(note) / 2
  sampler.triggerAttack(noteName, curr)
  sampler.triggerRelease(noteName, curr + noteQL)
  return noteQL
}

function _getNoteName(noteString: string) {
  return noteString.split(": ")[0]
}

function _getNoteQuarterlen(noteString: string) {
  return eval(noteString.split(": ")[1])
}
</script>

<style scoped>

</style>