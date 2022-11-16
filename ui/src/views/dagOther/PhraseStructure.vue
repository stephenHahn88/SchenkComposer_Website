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
          class="mb-5 mt-2 mx-1 p-2"
          style="height: 75px; border: 1px solid; border-radius: 5px; background-color: rgba(255, 255, 255, 0.5)">
        <p>{{ phrase.join(" ") }}</p>
      </b-row>
      <b-row class="mb-5">
        <b-col>
          <b-button variant="info" style="height:100px;">Generate</b-button>
        </b-col>
        <b-col>
          <b-button
              id="confirm"
              style="height:100px;"
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
import {computed, defineEmits, ref, Ref, onMounted} from 'vue';
import {BButton} from "bootstrap-vue";

const emit = defineEmits(['psanimate'])

let letters = ['a', 'b', 'c', 'd']

export type PhraseUnit = 'a' | 'b' | 'c' | 'd' | `a'` | `b'` | `c'` | `d'`
export type Cadence = '[AC]' | '[HC]'
export type Phrase = (PhraseUnit | Cadence)[]

let phrase: Ref<Phrase> = ref([])
let letter_disabled: Ref<boolean[]> = ref([
    false, true, true, true,
    true, true, true, true
])
let cadence_disabled: Ref<boolean[]> = ref([true, true])
let backspace_disabled = ref(true)

onMounted(async () => {
  //TODO get current melody and composer id
  let ps = await fetch("/api/composer/1/melody/1/phrase-structure")
  phrase.value = await ps.json()
  checkButtonDisability()
})

function erasePhrase() {
  phrase.value = []
  letter_disabled.value = [false, true, true, true, true, true, true, true]
  cadence_disabled.value = [true, true]
}

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

function cadencePress(cadence: string) {
  let cad = cadence as Cadence
  phrase.value.push(cad)
  cadence_disabled.value = [true, true]
}

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

async function savePhrase() {
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "phraseStructure": phrase.value })
  }
  //TODO get current composer and melody ID
  let response = await fetch("/api/composer/1/melody/1/phrase-structure", requestOptions)
  let json = await response.json()
  console.log(json)
  emit('psanimate')
}
</script>

<style scoped>
h1, h2, p {
  color: white;
}

p {
  font-size: 32px;
}

.btn {
  width: 100%;
  font-size: 28px;
}

#confirm {
  background-color: rgb(0, 150, 0);
}
#confirm:hover, #confirm:disabled {
  background-color: rgb(0, 100, 0);
}
</style>