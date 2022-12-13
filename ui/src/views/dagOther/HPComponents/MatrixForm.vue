<template>
  <b-container style="width: 740px; border-radius: 10px;">
    <b-row>
      <b-col class="mt-3">
        <b-button variant="danger" @click="$emit('clear')">X</b-button>
      </b-col>
      <b-col
          v-for="(color, harmony_label, i) in harmonies" :key="i"
          style="text-align: center"
          class="mt-3"
      >
        <p
            :style='{ backgroundColor: harmonies[harmony_label], color: "white", borderRadius: "30px"}'
        >{{harmony_label}}</p>
      </b-col>
    </b-row>
    <b-row
        v-for="(color, harmony_from, i) in harmonies" :key="i"
        class="harmony_row"
        :class="harmony_from"
    >
      <b-col
          style="text-align: center"
      >
        <p
            :style='{ backgroundColor: harmonies[harmony_from], color: "white", borderRadius: "30px"}'
        >{{harmony_from}}</p>
      </b-col>
      <b-col
          v-for="(color, harmony_to, j) in harmonies" :key="j"
      >
        <b-form-input
            class="my-2"
            style="width: 62px;"
            v-model="transitions[harmony_from][harmony_to]"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-button
          class="m-4"
          variant="success"
          @click="$emit('save-matrix')"
      >Save</b-button>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";

// Color codes for harmonies
let harmonies = ref({
  'I': 'green',
  'II': 'navy',
  'III': 'rgb(255, 130, 200)',
  'IV': 'orange',
  "V": 'red',
  "VI": 'purple',
  "VII": 'black'
})

// Transition matrix values
let transitions = ref({
  'I': ref({'I': 0, 'II': 2, 'III': 1, 'IV': 2, "V": 2, "VI": 2, "VII": 1}),
  'II': ref({'I': 0, 'II': 0, 'III': 0, 'IV': 0, "V": 1, "VI": 0, "VII": 0}),
  'III': ref({'I': 0, 'II': 1, 'III': 0, 'IV': 6, "V": 0, "VI": 3, "VII": 0}),
  'IV': ref({'I': 0, 'II': 4, 'III': 0, 'IV': 0, "V": 5, "VI": 0, "VII": 1}),
  'V': ref({'I': 8, 'II': 0, 'III': 0, 'IV': 0, "V": 0, "VI": 2, "VII": 0}),
  'VI': ref({'I': 0, 'II': 5, 'III': 1, 'IV': 3, "V": 1, "VI": 0, "VII": 0}),
  'VII': ref({'I': 1, 'II': 0, 'III': 0, 'IV': 0, "V": 0, "VI": 0, "VII": 0})
})

</script>

<style scoped>
p {
  font-size: 24px;
  color: white;
}

.btn {
  font-size: 18px;
}
</style>