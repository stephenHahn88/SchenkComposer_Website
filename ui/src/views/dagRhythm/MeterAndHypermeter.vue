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
          <b-col style="text-align: center">
            <b-dropdown :text="numerator" variant="danger" size="lg">
              <b-dropdown-item v-for="num in [2, 3, 4, 6, 9, 12]" v-on:click="numerator=num.toString()"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
        <b-row>
          <b-col style="text-align: center">
            <b-dropdown :text="denominator" variant="danger" size="lg">
              <b-dropdown-item v-for="num in [2, 4, 8]" v-on:click="denominator=num.toString()"> {{ num }} </b-dropdown-item>
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
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col></b-col>
      <b-col></b-col>
      <b-col>
        <b-button
            style="width: 100%; background-color: green"
            @click="saveMeter"
        >
          Save
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, onMounted, ref, Ref} from 'vue'
import { Phrase, PhraseUnit } from '@/views/dagOther/PhraseStructure.vue'

let phraseStructure = ref(['a', "a'", 'b', '[HC]', 'c', "c'", 'd', '[AC]'])
let numerator = ref("4")
let denominator = ref("4")
let hypermeterMeasures = ref({
  "a": 4,
  "b": 4,
  "c": 4,
  "d": 4
})

const emit = defineEmits(['meteranimate'])

onMounted(async () => {
  //TODO: get current melody and composer ids
  let phrase = await fetch("/api/composer/1/melody/1/phrase-structure")
  let json = await phrase.json()
  phraseStructure.value = json

  let hypermeter = await fetch("/api/composer/1/melody/1/hypermeter")
  if (hypermeter.status !== 404) {
    json = await hypermeter.json()
    hypermeterMeasures.value = json
  }

  let meter = await fetch("/api/composer/1/melody/1/meter")
  if (meter.status !== 404) {
    json = await meter.json()
    numerator.value = json.split("/")[0]
    denominator.value = json.split("/")[1]
  }
})

//TODO: Match input fields with same letter

async function saveMeter() {
  let requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "meter": `${numerator.value}/${denominator.value}` })
  }
  //TODO get current composer and melody ID
  let response = await fetch("/api/composer/1/melody/1/meter", requestOptions)
  let json = await response.json()
  console.log(json)

  requestOptions = {
    ...requestOptions,
    body: JSON.stringify({"hypermeter": hypermeterMeasures.value})
  }
  response = await fetch("/api/composer/1/melody/1/hypermeter", requestOptions)
  json = await response.json()
  console.log(json)

  emit('meteranimate')
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
</style>