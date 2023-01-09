<template>
  <div class="m-5">
    <h1>Meter And Hypermeter</h1>
<!--    PHRASE SEQUENCE-->
    <b-row>
      <b-col></b-col>
      <b-col
          v-for="subphrase in phraseStructure"
      >
        <b-row class="text"><p>{{ subphrase.at(0) === '[' ? subphrase: '&nbsp;'}}</p></b-row>
        <b-row class="mb-3 pl-4 text"><p>{{ subphrase.at(0) !== '[' ? subphrase: '&nbsp;'}}</p></b-row>
      </b-col>
    </b-row>
<!--    METER AND HYPERMETER-->
    <b-row>
<!--      METER-->
      <b-col class="p-3">
        <b-row class="mb-1">
          <b-col class="center-text">
            <b-dropdown :text="numerator" variant="danger" size="lg">
              <b-dropdown-item v-for="num in possibleNumerators" v-on:click="numerator=num.toString()"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="center-text">
            <b-dropdown :text="denominator" variant="danger" size="lg">
              <b-dropdown-item v-for="num in possibleDenominators" v-on:click="denominator=num.toString()"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-col>
<!--      HYPERMETER-->
      <b-col
        v-for="subphrase in phraseStructure"
        class="mt-3"
      >
        <b-form-input
            v-if="subphrase.at(0) !== '['"
            :class="subphrase.at(0)"
            class="text"
            v-model="hypermeterMeasures[subphrase.at(0)]"
            :number="true"
            placeholder="# measures"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button
            style="width: 100%"
            @click="pushRouter('/phrase-structure')"
            variant="info"
        >
          Return to Phrase Structure
        </b-button>
      </b-col>
      <b-col>
        <b-button
            style="width: 100%;"
            @click="saveMeter"
            :variant="saveSuccess"
        >
          Save
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, inject, onMounted, ref, Ref} from 'vue'
import { Phrase, PhraseUnit } from '@/views/dagOther/PhraseStructure.vue'
import {pushRouter} from "@/data"

let {composerId, updateComposerId}: any = inject("composerId")
let {melodyId, updateMelodyId}: any = inject("melodyId")

// Phrase structure from database
let phraseStructure: Ref<string[]> = ref([])

// Meter
let numerator = ref("4")
let denominator = ref("4")

let possibleNumerators = [4]//[2, 3, 4, 6, 9, 12]
let possibleDenominators = [4]//[2, 4, 8]

// Number of measures for each subphrase
let hypermeterMeasures = ref({
  "a": "# measures",
  "b": "# measures",
  "c": "# measures",
  "d": "# measures"
})

let saveSuccess = ref("danger")

const emit = defineEmits(['meteranimate'])

onMounted(async () => {
  await getSavedInfo()
})

// Retrieve any saved information including phrase info
async function getSavedInfo() {
  let phrase = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/phrase-structure")
  let json = await phrase.json()
  if (json.status == 404) return
  phraseStructure.value = json.result

  let hypermeter = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/hypermeter")).json()
  if (hypermeter.status !== 404) {
    hypermeterMeasures.value = hypermeter.result
  }

  let meter = await (await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/meter")).json()
  if (meter.status !== 404) {
    numerator.value = meter.result.split("/")[0]
    denominator.value = meter.result.split("/")[1]
  }

  if (hypermeter.status === 200 && meter.status === 200) {
    saveSuccess.value = "success"
  }
}

function lettersInPhrase() {
  let answer: Set<string> = new Set()
  for (let subphrase of phraseStructure.value) {
    if (subphrase.at(0) === "[") continue
    answer.add(subphrase.at(0) as string)
  }
  return Array.from(answer)
}

function checkValidInput() {
  for (let letter of lettersInPhrase()) {
    if (hypermeterMeasures.value[letter] == "# measures" ||
        hypermeterMeasures.value[letter] == "" ||
        isNaN(hypermeterMeasures.value[letter])
    ) {
      return {status: "invalid"}
    }
  }
  return {status: "valid"}
}

// Save current meter and hypermeter
async function saveMeter() {
  if (checkValidInput().status === "invalid") return
  let requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "meter": `${numerator.value}/${denominator.value}` })
  }
  let response = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/meter", requestOptions)
  let json = await response.json()
  console.log(json)

  requestOptions = {
    ...requestOptions,
    body: JSON.stringify({"hypermeter": hypermeterMeasures.value})
  }
  response = await fetch("/api/composer/"+encodeURIComponent(composerId.value)+"/melody/"+encodeURIComponent(melodyId.value)+"/hypermeter", requestOptions)
  json = await response.json()
  console.log(json)
  if (json.status !== 200) return

  saveSuccess.value = "success"
  // emit('meteranimate')
  await pushRouter("/harmonic-rhythm")
}
</script>

<style scoped>
.text {
  font-size: 32px;
  text-align: center;
}

h1, p {
  color: white;
}

.btn {
  font-size: 32px;
}

.a, .a:focus {
  color: white;
  background-color: rgba(255, 0, 0, 0.4);
}

.b, .b:focus {
  color: white;
  background-color: rgba(0, 255, 0, 0.4);
}

.c, .c:focus {
  color: white;
  background-color: rgba(0, 0, 255, 0.4);
}

.d, .d:focus {
  color: white;
  background-color: rgba(255, 0, 255, 0.4);
}

.center-text {
  text-align: center;
}
</style>