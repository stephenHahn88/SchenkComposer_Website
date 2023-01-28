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
      <b-col>
        <b-button
            style="width:100%; height: 100%"
            class="m-1"
            variant="success"
            @click="pushRouter('/phrase-structure')"
        >Get Started!</b-button>
      </b-col>
    </b-row>
    <b-row class="m-3" style="text-align: center">
      <b-col class="text-center">
        <iframe
          width="840"
          height="415"
          src="https://www.youtube.com/embed/1ybjbgzEBOg"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          style="border:none;"
        >
        </iframe>
      </b-col>
    </b-row>
    <b-row class="m-3">
      <b-col>
        <ul>
          <li>SchenkComposer is part of a research project conducted by Stephen Hahn, Rico Zhu, Simon Mak, Cynthia Rudin, and Yue Jiang.</li>
          <li>We are working towards generalizable, interpretable, and flexible models for music generation</li>
          <li>We would love to hear your feedback! Please fill out the survey linked on the "Generate Melody" page if you have time.</li>
          <hr class="bg-light">
          <li>This website is an interactive melody generator that guides you through a "top-down" composition style.</li>
          <li>You can track your progress by looking at the bubbles above.</li>
          <li>
            If you open the tutorial using the white button on the navbar (or just above here on the home page),
            there's a video explaining what to do, as well as some written explanation of the music and website.
          </li>
          <li>Most importantly, enjoy!</li>
        </ul>
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

ul, h1 {
  color: white;
}

ul {
  font-size: 24px;
}
</style>