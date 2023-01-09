<template>
  <b-container style="background: rgba(0, 0, 0, 0.6); border-radius: 20px">
    <b-row class="m-2" style="height: 150px">
      <b-button
          variant="success"
          class="m-4"
          @click="generateMelody"
          style="width: 100%; font-size: 32px"
      >Generate Melody</b-button>
    </b-row>
    <b-row class="m-2 p-2">
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
</template>

<script setup>
import {flattenMgRhythmLetter, flattenPhrase, playNotesAndHarmony} from "@/data";
import {inject, ref} from "vue"

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")

let tempo = ref(60)

async function generateMelody() {
  let ps = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")).json()
  ps = ps.result
  let ts = await (await fetch(`/api/composer/${encodeURIComponent(composerId.value)}/melody/${encodeURIComponent(melodyId.value)}/meter`)).json()
  ts = ts.result
  let mgr = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/mg-rhythm")).json()
  mgr = mgr.result
  let hp = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/harmonicProgression")).json()
  hp = hp.result

  let phraseFlat = flattenPhrase(ps)
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
    let mgRhythmComponent = flattenMgRhythmLetter(mgr, letter)
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
p {
  font-size: 24px;
}

p, h1, h2, h3, col {
  color: white;
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
</style>