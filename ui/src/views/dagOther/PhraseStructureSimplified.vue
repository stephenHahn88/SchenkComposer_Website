<template>
  <div>
    <b-container text-center>
      <b-row>
        <h1>Phrase Options</h1>
      </b-row>
      <b-row class="mb-5">
        <h2>Choose what <span :style="`color: ${textEmphasisColor}`">type of phrase</span> your melody should build into</h2>
      </b-row>
      <!-- PHRASE TYPES -->
<!--      <h2>Subphrases</h2>-->
      <b-row>
        <b-col cols="10"></b-col>
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
      <b-row>
        <b-col>
          <QuestionHover
              id="question1"
              title="Sentence"
              :text="[
                  `A sentence consists of two 'basic ideas' and a 'continuation'`,
                  `It takes the form of 'a a b' where 'a' represents the basic idea and 'b' represents the continuation`,
                  `Usually, the 'b' subphrase is twice as long as an individual 'a' section, creating a length ratio of 1:1:2`
              ]"
          ></QuestionHover>
        </b-col>
        <b-col>
          <QuestionHover
              id="question2"
              title="Period"
              :text="[
                  `A period consists of an 'antecedent' and a 'consequent' (or 'a' and 'b' here)`,
                  `Both subphrases ('a' and 'b') are followed by a cadence/phrase ending`,
                  `The phrase ending for 'b' is 'stronger,' meaning it feels more final or complete`,
                  `Most often, the 'a' and 'b' sections are the same length`
              ]"
          ></QuestionHover>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mx-1 mb-1">
          <b-button
              variant="dark"
              @click="handleSentence"
          >
            Sentence
          </b-button>
        </b-col>
        <b-col class="mx-1 mb-1">
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
            variant="info"
            class="height-100"
            @click="pushRouter('/')"
          >
            Return to Home
          </b-button>
        </b-col>
        <b-col>
          <b-button
              :variant="saveSuccess"
              class="height-100"
              @click="savePhrase"
          >
            Save and Continue
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <h2 style="color: red">{{status}}</h2>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, ref, Ref, onMounted, inject, watch} from 'vue';
import {BButton} from "bootstrap-vue";
import {pushRouter, textEmphasisColor} from "@/data"
import QuestionHover from "@/components/QuestionHover.vue"

const emit = defineEmits(['psanimate'])

// Define types
export type PhraseUnit = 'a' | 'b' | 'c' | 'd' | `a'` | `b'` | `c'` | `d'`
export type Cadence = '[AC]' | '[HC]'
export type Phrase = (PhraseUnit | Cadence)[]

// Load composer and melody info
let {composerId, updateComposerId}: any = inject("composerId");
let {melodyId, updateMelodyId}: any = inject("melodyId")
let {currPage, updateCurrPage}: any = inject("currPage")

// Possible letters
let letters = ['a', 'b', 'c', 'd']

// Output phrase
let phrase: Ref<Phrase> = ref([])

let saveSuccess = ref("danger")
let status = ref("")

// Load phrase if already saved
onMounted(async () => {
  updateCurrPage("/phrase-structure")
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
  if (phrase.value.length === 0) {
    status.value = "No value chosen. Please choose either sentence or period."
    return
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "phraseStructure": phrase.value })
  }
  let response = await fetch(`/api/composer/${composerId.value}/melody/${melodyId.value}/phrase-structure`, requestOptions)
  let json = await response.json()
  console.log(json)
  if (json.status !== 200) return

  saveSuccess.value = "success"
  // emit('psanimate')
  await pushRouter("/meter-hypermeter")
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