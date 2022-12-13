<template>
  <b-container>
    <b-row class="mb-5" style="height: 100px; width: 800px">
      <b-col cols="4"><h2>Transition Matrix</h2></b-col>
      <b-col
          class="mr-3 white-background"
          style="border-radius: 10px;"
      >
        <h3>Preset Matrices</h3>
        <b-button
            v-for="preset in presetMatrices"
            variant="info"
            style="width: 100px;"
            class="m-2"
            @click="$emit('get-preset-matrix', preset)"
        >
          {{preset}}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
// Preset matrices from Flask server
let presetMatrices = ["Classical Major", "Rock", "Pentatonic"]
</script>

<style scoped>
h2, h3 {
  color: white;
}

.white-background {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>