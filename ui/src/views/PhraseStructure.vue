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
              v-on:click="erasePhrase()"
          >
            Erase
          </b-button>
        </b-col>
      </b-row>

      <h2>Subphrases</h2>
      <b-row>
        <b-col v-for="(letter, i) in letters" class="m-1">
          <b-button
              class="a"
              :id="letter"
              :disabled="letter_disabled[i]"
              v-on:click="letterPress(letter)"
          >
            {{letter}}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="(letter, i) in letters" class="m-1">
          <b-button
              class="a"
              :id="`${letter}'`"
              :disabled='letter_disabled[i+4]'
              v-on:click="letterPress(`${letter}'`)"
          >
            {{letter}}'
          </b-button>
        </b-col>
      </b-row>

      <h2>Cadences</h2>
      <b-row>
        <b-col>
          <b-button
              class="a"
              :disabled="cadence_disabled[0]"
              v-on:click="cadencePress('[AC]')"
          >
            Authentic Cadence
          </b-button>
        </b-col>
        <b-col>
          <b-button
              class="a"
              :disabled="cadence_disabled[1]"
              v-on:click="cadencePress('[HC]')"
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
            v-on:click="backspace()"
            :disabled="backspace_disabled"
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
          <b-button id="generate" style="height:100px;">Get SchenkComposer To Help</b-button>
        </b-col>
        <b-col>
          <b-button
              id="confirm"
              style="height:100px;"
              @click="handleConfirm"
          >
            Confirm
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, ref, Ref} from 'vue';
import {BButton} from "bootstrap-vue";

const emit = defineEmits(['psanimate'])

const handleConfirm = () => {
  emit('psanimate')
}

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

function erasePhrase() {
  phrase.value = []
  letter_disabled.value = [false, true, true, true, true, true, true, true]
  cadence_disabled.value = [true, true]
}

function checkButtonDisability() {
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

</script>

<style scoped>
h1, h2, p {
  color: white;
}

p {
  font-size: 32px;
}

#erase {
  background-color: red;
}
#erase:hover {
  background-color: rgb(200, 0, 0);
}

.btn {
  width: 100%;
  font-size: 28px;
}

.a, a:enabled {
  background-color: rgb(200, 0, 200);
}
.a:hover, .a:disabled, .a:active, .a:focus {
  background-color: rgb(150, 0, 150);
}

#AC {
  background-color: rgb(255, 0, 255);
  color: black;
}
#AC:hover, #AC:disabled {
  background-color: rgb(200, 0, 200);
}

#HC {
  background-color: rgb(50, 0, 50);
}
#HC:hover, #HC:disabled {
  background-color: rgb(100, 0, 100);
}

#backspace {
  background-color: rgb(150, 150, 0);
}
#backspace:hover {
  background-color: rgb(120, 120, 0);
}

#generate {
  background-color: rgb(250, 0, 250);
  color: black;
}
#generate:hover {
  background-color: rgb(200, 0, 200);
}

#confirm {
  background-color: rgb(0, 150, 0);
}
#confirm:hover, #confirm:disabled {
  background-color: rgb(0, 100, 0);
}
</style>