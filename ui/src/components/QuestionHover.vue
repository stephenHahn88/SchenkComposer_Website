<template>
  <b-container>
    <b-button
        id="popover"
        style="border-radius: 100px; background: rgba(255, 0, 255, 0.5)"
    >
      ?
    </b-button>
    <b-popover
        target="popover"
        triggers="hover"
        placement="top"
    >
      <template #title>{{customTitle}}</template>
      {{customText}}
    </b-popover>

  </b-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'

let customTitle = ref("yo")
let customText = ref("hi")
</script>

<style scoped>

</style>