<template>
  <div>
    <b-row class="m-3">
      <b-col>
        <h1>Welcome to SchenkComposer</h1>
      </b-col>
      <b-col>
        <b-button
            v-b-toggle.collapse-tutorial
            variant="light"
            v-if="!tutorialOpen"
            @click="updateTutorialOpen(true)"
            class="m-1"
            style="width:100%; height: 100%"
        >Show Tutorial</b-button>
        <b-button
            v-b-toggle.collapse-tutorial
            variant="light"
            v-if="tutorialOpen"
            @click="updateTutorialOpen(false)"
            class="m-1"
            style="width:100%; height: 100%"
        >Hide Tutorial</b-button>
      </b-col>
      <b-col cols="6">
        <b-button
            style="width:100%; height: 100%"
            class="m-1"
            variant="success"
            @click="pushRouter('/phrase-structure')"
        >Get Started!</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {pushRouter} from '@/data';
import {ref, inject} from 'vue'

let {tutorialOpen, updateTutorialOpen}: any = inject('tutorialOpen')
</script>

<style scoped>
.btn {
  font-size: 32px;
}

h1 {
  color: white;
}
</style>