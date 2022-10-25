<template>
  <div>
    <h1 class="m-5">Harmonic Progression</h1>
    <b-row>
<!--      TRANSITION MATRIX-->
      <b-col class="ml-5">
        <b-container style="width: 650px; background-color: rgba(200, 200, 200, 0.8)">
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
                  :style='{ backgroundColor: harmonies[harmony_label], color: "white"}'
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
                  :style='{ backgroundColor: harmonies[harmony_from], color: "white"}'
              >{{harmony_from}}</p>
            </b-col>
            <b-col
                v-for="(color, harmony_to, j) in harmonies" :key="j"
            >
              <b-form-input
                  class="my-2"
                  style="width:50px;"
                  v-model="transitions[harmony_from][harmony_to]"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
<!--      SEQUENCE GENERATION-->
      <b-col>
        
      </b-col>
    </b-row>
<!--      MARKOV CHAIN GRAPH-->
    <b-row class="ml-5 mt-5 mb-2">
      <b-button @click="redraw" style="background-color: purple">Refresh</b-button>
    </b-row>
    <b-row class="mx-5" style="border: solid purple;">
      <svg id="mySVG" width="2000px" height="600px"></svg>
    </b-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import _ from "lodash";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

import Hexagon from "../static/hexagon"

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

// watch(() => JSON.parse(JSON.stringify(transitions.value)), () => {
//   console.log(transitions)
//   redraw()
// })

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
      links.push({
        source: from,
        target: to,
        type: "solid",
        directed: true,
        label: `${_.round(_.round(
            parseFloat(transitions.value[from][to]) / total, 3
        ) * 100, 1)}%`,
        strength: "weak",
        width: 5
      })
    }
  }

  const graph = {
    nodes: nodes,
    links: links
  }
  simulation.render(graph)
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
      links.push({
        source: from,
        target: to,
        type: "solid",
        directed: true,
        label: `${_.round(_.round(
            parseFloat(transitions.value[from][to]) / total, 3
        ) * 100, 1)}%`,
        strength: "weak",
        width: 5
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
  font-size: 32px;
}

</style>