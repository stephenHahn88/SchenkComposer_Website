<template>
  <div>
    <h1>Harmonic Progression</h1>
    <b-row class="ml-2">
<!--      TRANSITION MATRIX-->
      <b-col
          class="p-2"
          cols="6"
          style="background-color: rgba(0, 0, 0, 0.3); border-radius: 10px; overflow: auto">
        <h2>Transition Matrix</h2>
        <b-container style="width: 640px; border-radius: 10px;">
          <b-row>
            <b-col class="mt-3">
              <b-button variant="danger" @click="clear">X</b-button>
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
                  style="width:48px;"
                  v-model="transitions[harmony_from][harmony_to]"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
<!--      SEQUENCE GENERATION-->
      <b-col
          class="mx-4 p-4"
          style="border-radius: 10px; background-color: rgba(0, 0, 0, 0.3); overflow: auto"
      >
        <b-row class="mb-2">
          <b-col>
            <h2>Generation</h2>
          </b-col>
          <b-col></b-col>
          <b-col>
            <b-button
                variant="warning"
                @click="backspace()"
                style="width: 100%; font-size: 20px"
            >&#8592</b-button>
          </b-col>
          <b-col>
            <b-button
                variant="danger"
                @click="erase()"
                style="font-size: 20px"
            >X</b-button>
          </b-col>
        </b-row>
        <b-row
            v-for="letter in Object.keys(sequences)"
            @click="selectRow(letter)"
            class="hoverable p-1 mb-1"
            :class="sequences[letter]['selected']"
        >
          <b-col>
            <p style="font-size: 32px;">{{letter}}:</p>
          </b-col>
          <b-col
            v-for="i in max"
            v-if="max - i < sequences[letter]['sequenceReverse'].length"
          >
            <p style="font-size: 32px;">{{sequences[letter]['sequenceReverse'][max - i]}}</p>
          </b-col>
          <b-col
              v-else
              style="font-size: 32px;"
          >
          </b-col>
        </b-row>
        <b-row>
          <b-col
            v-for="(color, harmony, i) in harmonies"
            :key="i"
          >
            <b-button
                :style="{ backgroundColor: color}"
                @click="addHarmony(harmony)"
            >{{harmony}}</b-button>
          </b-col>
        </b-row>
        <b-row class="mt-3 mr-3" style="justify-content: end">
          <b-button variant="success">Generate</b-button>
        </b-row>
      </b-col>
    </b-row>
<!--      MARKOV CHAIN GRAPH-->
    <b-row class="ml-2 mt-5 mb-2">
      <b-button @click="redraw" style="background-color: purple">Refresh</b-button>
    </b-row>
    <b-row
        class="mx-2 mb-2"
        style="border-radius: 10px; background-color: rgba(255, 255, 255, 0.8)">
      <svg id="mySVG" width="100%" height="600px"></svg>
    </b-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import _ from "lodash";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

import Hexagon from "../../static/hexagon"

let harmonies = {
  'I': 'green',
  'ii': 'navy',
  'iii': 'rgb(255, 130, 200)',
  'IV': 'orange',
  "V": 'red',
  "vi": 'purple',
  "vii": 'black'
}

let transitions = ref({
  'I': ref({'I': 0, 'ii': 0.2, 'iii': 0.1, 'IV': 0.2, "V": 0.2, "vi": 0.2, "vii": 0.1}),
  'ii': ref({'I': 0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 1, "vi": 0, "vii": 0}),
  'iii': ref({'I': 0, 'ii': 0.1, 'iii': 0, 'IV': 0.6, "V": 0, "vi": 0.3, "vii": 0}),
  'IV': ref({'I': 0, 'ii': 0.4, 'iii': 0, 'IV': 0, "V": 0.5, "vi": 0, "vii": 0.1}),
  'V': ref({'I': 0.8, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0.2, "vii": 0}),
  'vi': ref({'I': 0, 'ii': 0.5, 'iii': 0.1, 'IV': 0.3, "V": 0.1, "vi": 0, "vii": 0}),
  'vii': ref({'I': 1.0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0, "vii": 0})
})

let mySVG;
let simulation;

let max = 6 //Maximum of maxLen
let sequences = ref({
  "a": ref({"sequenceReverse": [], "maxLen": 6, 'selected': 'inactive'}),
  "b": ref({"sequenceReverse": [], "maxLen": 4, 'selected': 'inactive'}),
  "c": ref({"sequenceReverse": [], "maxLen": 5, 'selected': 'inactive'}),
  "d": ref({"sequenceReverse": [], "maxLen": 3, 'selected': 'inactive'}),
})

function selectRow(letter) {
  for (let l in sequences.value) {
    if (l === letter) {
      sequences.value[l]['selected'] = 'active'
    } else {
      sequences.value[l]['selected'] = 'inactive'
    }
  }
}

function _findActiveLetter() {
  for (let l in sequences.value) {
    if (sequences.value[l]['selected'] === 'active') {
      return l
    }
  }
}

function addHarmony(harmony) {
  let letter = _findActiveLetter()
  sequences.value[letter]['sequenceReverse'].push(harmony)
}

function backspace() {
  let letter = _findActiveLetter()
  sequences.value[letter]['sequenceReverse'].pop()
}

function erase() {
  let letter = _findActiveLetter()
  sequences.value[letter]['sequenceReverse'] = []
}

onMounted(() => {
  harmonies = {
    'I': 'green',
    'ii': 'navy',
    'iii': 'rgb(255, 130, 200)',
    'IV': 'orange',
    "V": 'red',
    "vi": 'purple',
    "vii": 'black'
  }
  let transitions = ref({
    'I': ref({'I': 0, 'ii': 0.2, 'iii': 0.1, 'IV': 0.2, "V": 0.2, "vi": 0.2, "vii": 0.1}),
    'ii': ref({'I': 0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 1, "vi": 0, "vii": 0}),
    'iii': ref({'I': 0, 'ii': 0.1, 'iii': 0, 'IV': 0.6, "V": 0, "vi": 0.3, "vii": 0}),
    'IV': ref({'I': 0, 'ii': 0.4, 'iii': 0, 'IV': 0, "V": 0.5, "vi": 0, "vii": 0.1}),
    'V': ref({'I': 0.8, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0.2, "vii": 0}),
    'vi': ref({'I': 0, 'ii': 0.5, 'iii': 0.1, 'IV': 0.3, "V": 0.1, "vi": 0, "vii": 0}),
    'vii': ref({'I': 1.0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0, "vii": 0})
  })

  mySVG = document.getElementById("mySVG");
  simulation = new ForceSimulation(mySVG);
  simulation.templateStore.add("hexagon", Hexagon)

  redraw()
})

function redraw() {
  let nodes = []
  for (let harmony in harmonies) {
    nodes.push({
      id: harmony,
      shape: {
        type: "hexagon",
        scale: 0.5
      },
      payload: {
        title: harmony,
        color: harmonies[harmony]
      }
    })
  }

  let links = []
  for (let from in transitions.value) {
    for (let to in transitions.value[from]) {
      if (from === to || transitions.value[from][to] === 0) {
        continue
      }
      let distribution = {...transitions.value[from]}
      distribution = _.mapValues(distribution, parseFloat)
      let total = _.sum(Object.values(distribution))
      let percent = _.round(_.round(
          parseFloat(transitions.value[from][to]) / total, 3
      ) * 100, 1)
      links.push({
        source: from,
        target: to,
        type: "solid",
        directed: true,
        label: `${percent}%`,
        strength: "weak",
        width: 0.15 * percent
      })
    }
  }

  const graph = {
    nodes: nodes,
    links: links
  }
  simulation.render(graph)
}

function clear() {
  for (let from in transitions.value) {
    for (let to in transitions.value[from]) {
      transitions.value[from][to] = 0
    }
  }
}
</script>

<style scoped>
svg {
  font-size: 32px;
}

p {
  font-size: 24px;
}

p, h1, h2, col {
  color: white;
}

.hoverable:hover, .active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.hoverable:active {
  background-color: rgba(255, 255, 255, 0.3);
}

</style>