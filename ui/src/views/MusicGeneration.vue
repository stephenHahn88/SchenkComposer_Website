<template>
  <b-container style="border-radius: 20px">
    <b-overlay :show="loading" style="border-radius: 20px">
      <b-row class="p-4">
        <h1>Melody Generation</h1>
      </b-row>
<!--      <b-row class="m-2" id="check-done" style="background: rgba(255, 255, 255, 0.3); border-radius: 10px">-->
<!--        <b-col>-->
<!--          <h2>Generating with provided:</h2>-->
<!--        </b-col>-->
<!--        <b-col>-->
<!--          <b-button-group class="m-1">-->
<!--            <b-button-->
<!--                disabled-->
<!--                v-for="{text, variant} in options"-->
<!--                :variant="variant"-->
<!--            >{{text}}</b-button>-->
<!--          </b-button-group>-->
<!--        </b-col>-->
<!--      </b-row>-->
      <b-row class="m-2" style="height: 150px">
        <b-col>
          <b-button
            variant="info"
            class="m-4"
            @click="pushRouter('/harmonic-progression')"
            style="width: 100%; font-size: 32px"
          >
            Return to Harmonic Progression
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="warning"
              class="m-4"
              @click="generateMelody();"
              style="width: 100%; font-size: 32px"
          >Generate New Melody</b-button>
        </b-col>
        <b-col>
          <b-button
              variant="success"
              class="m-4"
              @click="replay"
              :disabled="replayDisabled"
              style="width: 100%; font-size: 32px;"
          >Replay Melody</b-button>
        </b-col>
      </b-row>
      <b-row class="m-2">
        <b-col></b-col>
        <b-col></b-col>
        <b-col>
          <b-button
              class="mb-4 ml-4"
              style="width: 100%"
              variant="dark"
              :disabled="downloadDisabled"
              @click="generateMidi"
          >
            Download Last as Midi
          </b-button>
        </b-col>
        <b-col>
          <b-button
              class="mb-4 ml-4"
              style="width: 100%"
              variant="dark"
              :disabled="downloadDisabled"
              @click="generateScore"
          >
            Download Last as XML
          </b-button>
        </b-col>
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
      <b-row class="mt-2 mx-2 p-2">
        <h3>Choose your layers: </h3>
      </b-row>
      <b-row class="mb-2 mx-2 p-2 text-center">
        <b-col>
          <b-form-checkbox-group
              v-model="selected"
              :options="checkboxOptions"
              value-field="item"
              text-field="name"
              size="lg"
              switches
              disabled-field="notEnabled"
              style="color: white; font-size: 24px;"
          ></b-form-checkbox-group>
        </b-col>
      </b-row>
      <b-row class="mt-2 mx-2 p-2">
          <h3> Choose your instrument </h3>
      </b-row>
      <b-row class="mb-4">
          <b-col
              class=""
              v-for="(val, key, i) in emojis"
          >
            <b-button
                style="width: 100%"
                variant="btn"
                @click="_setInstrument(key);"
            > <span style="font-size:30px;" v-html="val"></span>
            </b-button>
          </b-col>
      </b-row>
      <b-row class="m-1 pt-2 text-center">
        <b-col class = "modal-container">
            <p style="color: black;">
              <span class="animate-color">
                Help us improve this website! We'd love to hear your feedback
              </span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://duke.qualtrics.com/jfe/form/SV_ehOrmZJcLQfuq6q"
              >
                here
              </a>
            </p>
        </b-col>
      </b-row>
    </b-overlay>
    <MelodySurvey ref="melodySurvey"></MelodySurvey>
  </b-container>
</template>

<script setup>
import {flattenMgRhythmLetter, flattenPhrase, playNotesAndHarmony, _quarterLengthToGlyph, pushRouter} from "@/data";
import {inject, onMounted, ref} from "vue"
import MelodySurvey from "@/components/MelodySurvey.vue";

let {composerId, updateComposerId} = inject("composerId")
let {melodyId, updateMelodyId} = inject("melodyId")
let {currPage, updateCurrPage} = inject("currPage")

let loading = ref(false)
let melodySurvey = ref()

let selected = ref(['melody', 'harmony', 'bass'])
let checkboxOptions = ref([
  {item: 'melody', name: "Melody"},
  {item: 'harmony', name: "Harmony"},
  {item: 'bass', name: "Bass"}
])

let options = ref([
  {text: "Phrase", variant: "dark"},
  {text: "Meter", variant: "dark"},
  {text: "Hypermeter", variant: "dark"},
  {text: "Harmonic Rhythm", variant: "dark"},
  {text: "Harmonic Progression", variant: "dark"}
])
let tempo = ref(60)
let instrument = ref("piano")

let emojis = {
  piano: '&#127929;',
  casio: '&#127899;',
  marimba: '&#128276;'
}

let downloadDisabled = ref(true)
let replayDisabled = ref(true)
let currNotes = ref([])
let currArps = ref([])
let currHarmony = ref([])
let currBass = ref([])

onMounted(async () => {
  let response = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/notes-harmonies-tempo")).json()
  if (response.status !== 404) {
    currNotes.value = response.melody
    currArps.value = response.arps
    currHarmony.value = response.harmonies
    currBass.value = response.bass
    instrument.value = response.instrument
    selected.value = response.layers
    replayDisabled.value = false
    downloadDisabled.value = false
  } else {
    replayDisabled.value = true
    downloadDisabled.value = true
  }

  updateCurrPage("/generate-melody")
})

function _setInstrument(selected = "piano") {
  instrument.value = selected
}

function _updateVariant(text, variant) {
  for (let i in options.value) {
    if (text === options.value[i].text) {
      options.value[i].variant = variant
    }
  }
}

async function replay() {
  playNotesAndHarmony(
      currNotes.value,
      currArps.value,
      currHarmony.value,
      currBass.value,
      instrument.value,
      tempo.value,
      selected.value
  )
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "notes": currNotes.value,
      "harmonies": currHarmony.value,
      "arps": currArps.value,
      "bass": currBass.value,
      "tempo": tempo.value,
      "instrument": instrument.value,
      "layers": selected.value
    })
  }
  let response = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/notes-harmonies-tempo", requestOptions)
  response = await response.json()
  console.log(response)
}

async function generateMelody() {
  loading.value = true
  replayDisabled.value = true
  let ps = await getPhraseStructure()
  let mgr = await getMiddlegroundRhythm(ps)
  let hp = await getHarmonicProgression(mgr, ps)

  let {notes, middle, harmonies, bass} = await generateFromHarmony(ps, mgr, hp)
  currNotes.value = notes
  currArps.value = middle
  currHarmony.value = harmonies
  currBass.value = bass
  downloadDisabled.value = false

  playNotesAndHarmony(
      notes,
      middle,
      harmonies,
      bass,
      instrument.value,
      tempo.value,
      selected.value
  )
  loading.value = false
  await saveMelody(
      notes,
      middle,
      harmonies,
      bass
  )
  // Once the melody has been saved, open the melody survey
  melodySurvey.value.openSurvey()
  replayDisabled.value = false
}

async function getPhraseStructure() {
  let ps = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")).json()
  if (ps.status !== 200) {
    ps = await (await fetch("/api/phrase-structure")).json()
    ps = ps["phrase"]
    _updateVariant("Phrase", "dark")
    return ps
  }
  _updateVariant("Phrase", "success")
  return ps.result
}

async function getTimeSignature() {
  let ts = await (await fetch(`/api/composer/${encodeURIComponent(composerId.value)}/melody/${encodeURIComponent(melodyId.value)}/meter`)).json()
  if (ts.status !== 200) {
    _updateVariant("Meter", "dark")
    return "4/4"
  }
  _updateVariant("Meter", "success")
  return ts.result
}

async function getHypermeter() {
  let hm = await (await fetch(`/api/composer/${encodeURIComponent(composerId.value)}/melody/${encodeURIComponent(melodyId.value)}/hypermeter`)).json()
  if (hm.status !== 200) {
     _updateVariant("Hypermeter", "dark")
     return {"a": 2, "b": 4, "c": "# measures", "d": "# measures"}
  }
  _updateVariant("Hypermeter", "success")
  return hm.result
}

async function getMiddlegroundRhythm(ps) {
  let mgr = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/mg-rhythm")).json()
  let ts = await getTimeSignature()
  let hm = await getHypermeter()

  if (mgr.status !== 200) {
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "timeSignature": ts,
        "hypermeter": hm,
        "phraseStructure": ps
      })
    }
    let mgr = await (await fetch("/api/middleground-rhythm", options)).json()
    _updateVariant("Harmonic Rhythm", "dark")
    return mgr.mgRhythm
  }
  _updateVariant("Harmonic Rhythm", "success")
  return mgr.result
}

async function getHarmonicProgression(mgr, ps) {
  let hp = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/harmonicProgression")).json()
  console.log(mgr)
  if (hp.status !== 200) {
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'mgRhythm': mgr,
        'phraseStructure': ps
      })
    }
    let response = await (await fetch("/api/matrix-and-harmonic-progression", options)).json()
    _updateVariant("Harmonic Progression", "dark")
    return response["progressions"]
  }
  _updateVariant("Harmonic Progression", "success")
  return hp.result
}

function _quarterLengthsToNotation(quarterLengths) {
  let answer = []
  for (let ql of quarterLengths) {
    answer.push(_quarterLengthToGlyph(ql))
  }
  return answer
}

async function generateFromHarmony(ps, mgr, hp) {
  let phraseFlat = flattenPhrase(ps)

  let storedPhraseUnits = {}
  let notes = []
  let middle = []
  let harmonies = []
  let bass = []
  for (let letter of phraseFlat) {
    // If phrase unit has already been generated, append more of the same
    if (Object.keys(storedPhraseUnits).includes(letter)) {
      notes = notes.concat(storedPhraseUnits[letter]["notes"])
      harmonies = harmonies.concat(storedPhraseUnits[letter]["harmonies"])
      middle = middle.concat(storedPhraseUnits[letter]["middle"])
      bass = bass.concat(storedPhraseUnits[letter]["bass"])
      continue
    }
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "mgRhythm": flattenMgRhythmLetter(mgr, letter),
        "mgHarmony": hp[letter],
        "isCadential": letter === 'b'
      })
    }
    let mel = await (await fetch('api/generate-melody/from-harmony', options)).json()

    // Add new notes and harmonies
    notes = notes.concat(mel.notes)
    middle = middle.concat(mel.middle)
    harmonies = harmonies.concat(mel.harmony)
    bass = bass.concat(mel.bass)

    // Store new notes and harmonies for repetitions
    storedPhraseUnits[letter] = {}
    storedPhraseUnits[letter]["notes"] = mel.notes
    storedPhraseUnits[letter]["harmonies"] = mel.harmony
    storedPhraseUnits[letter]["middle"] = mel.middle
    storedPhraseUnits[letter]["bass"] = mel.bass
  }
  return {"notes": notes, "middle": middle, "harmonies": harmonies, "bass": bass}
}

async function generateMidi() {
  let midiOptions = {
    method: 'POST',
    headers: {
      'Accept': 'audio/midi',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "notes": currNotes.value,
      "harmony": currHarmony.value
    })
  }
  let midi = await (await fetch("api/generate-midi", midiOptions)).blob()
  let a = document.createElement("a")
  a.href = window.URL.createObjectURL(midi)
  a.download = `melody_${melodyId.value}`
  a.click()
}

async function generateScore() {
  let xmlOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/xml',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "notes": currNotes.value,
      "harmony": currHarmony.value
    })
  }
  let xml = await (await fetch("api/generate-xml", xmlOptions)).blob()
  let a = document.createElement("a")
  a.href = window.URL.createObjectURL(xml)
  a.download = `melody_${melodyId.value}`
  a.click()
}

async function hasNotesHarmonyTempo() {
  let response = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/notes-harmonies-tempo")).json()
  return response.status === 200
}


async function saveMelody(notes, middle, harmonies, bass) {
  if (await hasNotesHarmonyTempo()) {
    let response = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/parameters")).json()
    let highestJSON = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/highestId")).json()
    updateMelodyId((highestJSON["highest"] + 1).toString())
    let copyOptions = {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(response.result)
    }
    await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/parameters", copyOptions)
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "notes": notes,
      "harmonies": harmonies,
      "arps": middle,
      "bass": bass,
      "tempo": tempo.value,
      "instrument": instrument.value,
      "layers": selected.value
    })
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

.modal-container {
    padding: 30px 30px 30px 30px;
    margin-bottom: 30px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

/*ADAPTED FROM https://alvarotrigo.com/blog/css-text-animations/*/
.animate-color {
  background-image: linear-gradient(
      -225deg,
      #c832ff 0%,
      #c832ff 35%,
      #ffffff 40%,
      #ee11aa 50%,
      #ffffff 60%,
      #c832ff 65%,
      #c832ff 100%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 5s linear infinite reverse;
  display: inline-block;
  /*font-size: 190px;*/
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

</style>