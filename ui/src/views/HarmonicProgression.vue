<template>
  <div>
    <b-row>

    </b-row>
    <b-row>
      <svg id="mySVG" width="1000px" height="400px"></svg>
    </b-row>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

import Hexagon from "../static/hexagon"

onMounted(() => {
  let harmonies = {
    'I': 'green',
    'ii': 'navy',
    'iii': 'grey',
    'IV': 'orange',
    "V": 'red',
    "vi": 'purple',
    "viio": 'black'
  }
  let transitions = {
    'I': {'I': 0, 'ii': 0.2, 'iii': 0.1, 'IV': 0.2, "V": 0.2, "vi": 0.2, "viio": 0.1},
    'ii': {'I': 0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 1, "vi": 0, "viio": 0},
    'iii': {'I': 0, 'ii': 0.1, 'iii': 0, 'IV': 0.6, "V": 0, "vi": 0.3, "viio": 0},
    'IV': {'I': 0, 'ii': 0.4, 'iii': 0, 'IV': 0, "V": 0.5, "vi": 0, "viio": 0.1},
    'V': {'I': 0.8, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0.2, "viio": 0},
    'vi': {'I': 0, 'ii': 0.5, 'iii': 0.1, 'IV': 0.3, "V": 0.1, "vi": 0, "viio": 0},
    'viio': {'I': 1.0, 'ii': 0, 'iii': 0, 'IV': 0, "V": 0, "vi": 0, "viio": 0}
  }

  const mySVG = document.getElementById("mySVG");
  const simulation = new ForceSimulation(mySVG);

  simulation.templateStore.add("hexagon", Hexagon)

  let nodes = []
  for (let harmony in harmonies) {
    nodes.push({
      id: harmony,
      shape: {
        type: "hexagon",
        scale: 1
      },
      payload: {
        title: harmony,
        color: harmonies[harmony]
      }
    })
  }

  let links = []
  for (let from in transitions) {
    for (let to in transitions[from]) {
      if (from === to || transitions[from][to] === 0) {
        continue
      }
      links.push({
        source: from,
        target: to,
        type: "solid",
        directed: true,
        label: transitions[from][to],
        strength: "strong"
      })
    }
  }

  const graph = {
    nodes: nodes,
    links: links
  }
  simulation.render(graph)
})



</script>

<style scoped>

</style>