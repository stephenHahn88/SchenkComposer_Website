<template>
  <div class="m-5">
    <h1>Meter And Hypermeter</h1>
<!--    PHRASE SEQUENCE-->
    <b-row>
      <b-col></b-col>
      <b-col
          v-for="subphrase in phraseStructure"
      >
        <b-row class="text">{{ subphrase.at(0) === '[' ? subphrase: '&nbsp;'}}</b-row>
        <b-row class="mb-3 pl-4 text">{{ subphrase.at(0) !== '[' ? subphrase: '&nbsp;'}}</b-row>
      </b-col>
    </b-row>
<!--    METER AND HYPERMETER-->
    <b-row>
<!--      METER-->
      <b-col>
        <b-row class="mb-1">
          <b-col>
            <b-dropdown :text="numerator" variant="primary">
              <b-dropdown-item v-for="num in [2, 3, 4, 6, 9, 12]" v-on:click="numerator=num.toString()"> {{ num }} </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-dropdown :text="denominator" variant="primary">
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
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col></b-col>
      <b-col></b-col>
      <b-col>
        <b-button
            style="width: 100%; background-color: green"
            @click="handleConfirm"
        >
          Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, ref, Ref} from 'vue'
import { Phrase, PhraseUnit } from '@/views/PhraseStructure.vue'

let phraseStructure = ref(['a', "a'", 'b', '[HC]', 'c', "c'", 'd', '[AC]'])
let numerator = ref("4")
let denominator = ref("4")

const emit = defineEmits(['meteranimate'])

const handleConfirm = () => {
  emit('meteranimate')
}

//TODO: Match input fields with same letter
</script>

<style scoped>
.text {
  font-size: 32px;
}
</style>