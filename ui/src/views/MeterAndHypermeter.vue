<template>
  <div class="m-5">
    <h1>Meter And Hypermeter</h1>
<!--    PHRASE SEQUENCE-->
    <b-row>
      <b-col></b-col>
      <b-col
          v-for="subphrase in phraseStructure"
      >
        <b-row>{{ subphrase.at(0) === '[' ? subphrase: '&nbsp;'}}</b-row>
        <b-row class="mb-3 pl-4">{{ subphrase.at(0) !== '[' ? subphrase: '&nbsp;'}}</b-row>
      </b-col>
    </b-row>
<!--    METER AND HYPERMETER-->
    <b-row>
<!--      METER-->
      <b-col>
        <b-row class="mb-1">
          <b-col>
            <b-dropdown :text="numerator" variant="primary">
              <b-dropdown-item v-for="num in [2, 3, 4, 6, 9, 12]" v-on:click="numerator=num"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-dropdown :text="denominator" variant="primary">
              <b-dropdown-item v-for="num in [2, 4, 8]" v-on:click="denominator=num"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-col>
<!--      HYPERMETER-->
      <b-col
        v-for="subphrase in phraseStructure"
        class="mt-3"
      >
        <b-form-input v-if="subphrase.at(0) !== '['"></b-form-input>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {ref, Ref} from 'vue'
import { Phrase, PhraseUnit } from '@/views/PhraseStructure.vue'

let phraseStructure = ref(['a', "a'", 'b', '[HC]', 'c', "c'", 'd', '[AC]'])
let numerator = ref(4)
let denominator = ref(4)
</script>

<style scoped>
.transparent-background {
  background-color: rgba(255, 0, 255, 0.5);

}
</style>