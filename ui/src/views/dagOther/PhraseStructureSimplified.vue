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
      <!-- PHRASE TYPES -->
      <h2>Subphrases</h2>
      <b-row>
        <b-col class="m-1">
          <b-button
              variant="dark"
              @click="handleSentence"
          >
            Sentence
          </b-button>
        </b-col>
        <b-col class="m-1">
          <b-button
              variant="dark"
              @click="handlePeriod"
          >
            Period
          </b-button>
        </b-col>
      </b-row>
      <!--      OUTPUT-->
      <b-row
          class="mb-5 mt-2 mx-1 p-2 white-background radius-5 small-border"
          style="height: 75px;">
        <p>{{ phrase.join(" ") }}</p>
      </b-row>
      <!--      GENERATE AND SAVE -->
      <b-row class="mb-5">
        <b-col>
          <b-button
              :variant="saveSuccess"
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

let saveSuccess = ref("danger")

// Load phrase if already saved
onMounted(async () => {
  let ps = await (await fetch("/api/composer/" + encodeURIComponent(composerId.value) + "/melody/" + encodeURIComponent(melodyId.value) + "/phrase-structure")).json()
  if (ps.status === 404) return
  phrase.value = ps.result
  saveSuccess.value = "success"
})

function handleSentence() {
  phrase.value = ["a", "a", "b"]
  let random_bool = Math.random() < 0.5
  if (random_bool) {phrase.value.push("[HC]")}
  else {phrase.value.push("[AC]")}
}

function handlePeriod() {
  phrase.value = ["a", "[HC]", "b", "[AC]"]
}

function erasePhrase() {
  phrase.value = []
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
  saveSuccess.value = "success"
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