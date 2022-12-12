<template>
  <div>
    <b-container text-center>
      <b-row>
        <b-col cols="10">
          <h1>Phrase Options</h1>
        </b-col>
        <b-col>
          <b-button
              id="erase"
              style="text-align: center;"
              @click="erasePhrase()"
              variant="danger"
          >
            X
          </b-button>
        </b-col>
      </b-row>
<!-- SUBPHRASE LETTERS -->
      <h2>Subphrases</h2>
      <b-row>
        <b-col v-for="(letter, i) in letters" class="m-1">
          <b-button
              variant="dark"
              :id="letter"
              :disabled="letter_disabled[i]"
              @click="letterPress(letter)"
          >
            {{letter}}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="(letter, i) in letters" class="m-1">
          <b-button
              variant="dark"
              :id="`${letter}'`"
              :disabled='letter_disabled[i+4]'
              @click="letterPress(`${letter}'`)"
          >
            {{letter}}'
          </b-button>
        </b-col>
      </b-row>
<!-- CADENCES -->
      <h2>Cadences</h2>
      <b-row>
        <b-col>
          <b-button
              variant="dark"
              :disabled="cadence_disabled[0]"
              @click="cadencePress('[AC]')"
          >
            Authentic Cadence
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="dark"
              :disabled="cadence_disabled[1]"
              @click="cadencePress('[HC]')"
          >
            Half Cadence
          </b-button>
        </b-col>
      </b-row>
<!--      OUTPUT-->
      <b-row class="mb-1 mt-3">
        <b-col cols="10"></b-col>
        <b-col>
          <b-button
            id="backspace"
            @click="backspace()"
            :disabled="backspace_disabled"
            variant="warning"
          >
            &#8592
          </b-button>
        </b-col>
      </b-row>
      <b-row
          class="mb-5 mt-2 mx-1 p-2 white-background radius-5 small-border"
          style="height: 75px;">
        <p>{{ phrase.join(" ") }}</p>
      </b-row>
<!--      GENERATE AND SAVE -->
      <b-row class="mb-5">
        <b-col>
          <b-button
              variant="info"
              class="height-100"
              @click="generatePhrase"
          >
            Generate
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="success"
              class="height-100"
              @click="savePhrase"
          >
            Save
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, ref, Ref, onMounted, inject, watch} from 'vue';
import {BButton} from "bootstrap-vue";

const emit = defineEmits(['psanimate'])

// Define types
export type PhraseUnit = 'a' | 'b' | 'c' | 'd' | `a'` | `b'` | `c'` | `d'`
export type Cadence = '[AC]' | '[HC]'
export type Phrase = (PhraseUnit | Cadence)[]

// Load composer and melody info
let {composerId, updateComposerId}: any = inject("composerId");
let {melodyId, updateMelodyId}: any = inject("melodyId")

// Possible letters
let letters = ['a', 'b', 'c', 'd']

// Output phrase
let phrase: Ref<Phrase> = ref([])

// Keep track of which buttons are disabled
let letter_disabled: Ref<boolean[]> = ref([
    false, true, true, true,
    true, true, true, true
])
let cadence_disabled: Ref<boolean[]> = ref([true, true])
let backspace_disabled = ref(true)

// Load phrase if already saved
onMounted(async () => {
  let ps = await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/phrase-structure")
  if (ps.status === 404) return
  phrase.value = await ps.json()
  checkButtonDisability()
})

// Remove all output
function erasePhrase() {
  phrase.value = []
  letter_disabled.value = [false, true, true, true, true, true, true, true]
  cadence_disabled.value = [true, true]
}

// Sets letter and backspace disability based on current phrase value
function checkButtonDisability() {
  backspace_disabled.value = phrase.value.length === 0
  if (phrase.value.includes('d')) {
    letter_disabled.value = [false, false, false, false, false, false, false, false];
    return
  }
  if (phrase.value.includes('c')) {
    letter_disabled.value = [false, false, false, false, false, false, false, true];
    return
  }
  if (phrase.value.includes('b')) {
    letter_disabled.value = [false, false, false, true, false, false, true, true];
    return
  }
  if (phrase.value.includes('a')) {
    letter_disabled.value = [false, false, true, true, false, true, true, true];
    return
  }
  letter_disabled.value = [false, true, true, true, true, true, true, true]
}

// Place letter into output
function letterPress(letter: string) {
  let unit = letter as PhraseUnit
  backspace_disabled.value = false
  phrase.value.push(unit)

  if (phrase.value.length > 10) {
    letter_disabled.value = [true, true, true, true, true, true, true, true]
    return
  }

  cadence_disabled.value = [false, false]
  if (letter.length < 2) {
    checkButtonDisability()
  }
}

// Place cadence into output
function cadencePress(cadence: string) {
  let cad = cadence as Cadence
  phrase.value.push(cad)
  cadence_disabled.value = [true, true]
}

// Remove last phrase unit
function backspace() {
  phrase.value = phrase.value.slice(0, -1)

  checkButtonDisability()
  if (phrase.value.at(-1) === '[AC]' || phrase.value.at(-1) === '[HC]') {
    cadence_disabled.value = [true, true]
  } else if (phrase.value.length > 0) {
    cadence_disabled.value = [false, false]
  }
  if (phrase.value.length <= 0) {
    backspace_disabled.value = true
    cadence_disabled.value = [true, true]
  }
}

// Save phrase to database
async function savePhrase() {
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "phraseStructure": phrase.value })
  }
  let response = await fetch(`/api/composer/${composerId.value}/melody/${melodyId.value}/phrase-structure`, requestOptions)
  let json = await response.json()
  console.log(json)
  emit('psanimate')
}

// Generate phrase from model
async function generatePhrase() {
  let modelPhrase = await (await fetch("/model/phrase-structure")).json()
  phrase.value = modelPhrase["phrase"]
  checkButtonDisability()
}
</script>

<style scoped>
h1, h2, p {
  color: white;
}

p {
  font-size: 32px;
}

.white-background {
  background-color: rgba(255, 255, 255, 0.4);
}

.radius-5 {
  border-radius: 5px;
}

.small-border {
  border: 1px solid;
}

.height-100 {
  height: 100px;
}

.btn {
  width: 100%;
  font-size: 28px;
}
</style>