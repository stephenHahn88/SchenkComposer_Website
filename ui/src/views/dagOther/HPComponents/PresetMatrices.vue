<template>
  <b-container>
    <b-row class="mb-5" style="height: 100px; width: 800px">
      <b-col cols="2"><h2>Transition Matrix</h2></b-col>
      <b-col class="ml-2 mt-2">
        <QuestionHover
          id="question-transition-matrix"
          title="Harmonic Transition Matrix"
          :text="[
                  `This square matrix defines the probabilities from one harmony to another`,
                  `The labels on the left are the 'from' harmonies`,
                  `The labels on top are 'to' harmonies`,
                  `For instance, the 2nd block in the 1st row represents the proportion of times the music goes from a '${labels[0]}' to a '${labels[1]}'`,
                  `You don't need to worry about having all rows sum to 1 - we do it for you!`
                ]"
        ></QuestionHover>
      </b-col>
      <b-col
          class="mr-3 white-background"
          style="border-radius: 10px;"
          cols="7"
      >
        <b-row class="mt-2">
          <b-col>
            <h3>Preset Matrices</h3>
          </b-col>
          <b-col cols="6">
            <QuestionHover
                id="question-preset-matrices"
                title="Preset Matrices"
                :text="[
                        `The following buttons each load a transition matrix that fits a particular style`,
                        `They are a great starting place if you aren't too familiar with harmony`
                       ]"
            ></QuestionHover>
          </b-col>
        </b-row>
        <b-row>
          <b-button
              v-for="preset in presetMatrices"
              variant="info"
              style="width: 100px;"
              class="m-2"
              @click="$emit('get-preset-matrix', preset)"
          >
            {{preset}}
          </b-button>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import QuestionHover from "@/components/QuestionHover.vue"
import {inject, Ref, ref, computed} from "vue"

// Preset matrices from Flask server
let presetMatrices = ["Classical Major", "Rock", "Pentatonic"]

let harmonies: Ref<string[]> = inject('harmonies') as Ref<string[]>
let labels = computed(() => {
  return [...harmonies.value]
})
</script>

<style scoped>
h2, h3 {
  color: white;
}

.white-background {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>