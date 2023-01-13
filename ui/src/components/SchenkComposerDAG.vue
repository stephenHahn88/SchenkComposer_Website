<template>
  <div>
    <b-container class="text-center">
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col>
          <b-button
              variant="success"
              id="ps"
              class="border border-light"
          >
            Phrase<br>Structure
          </b-button>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col>
          <b-button
              variant="danger"
              id="mh"
              class="border border-light"
          >
            Meter and <br>Hypermeter
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="danger"
              id="mghr"
              class="border border-light"
          >
            Harmonic<br>Rhythm
          </b-button>
        </b-col>
        <b-col>
          <b-button
              variant="info"
              id="mghp"
              class="border border-light"
          >
            Harmonic Progression
          </b-button>
        </b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col></b-col>
        <b-col>
          <b-button
              variant="warning"
              id="mgm"
              class="border border-light"
          >Middleground Melody</b-button>
        </b-col>
      </b-row>
      <b-row class="my-4 myRow">
        <b-col></b-col>
        <b-col>
          <b-button
              variant="danger"
              id="fgmr"
              class="border border-light"
          >Melodic<br>Rhythm</b-button>
        </b-col>
        <b-col>
          <b-button
              variant="warning"
              id="fgm"
              class="border border-light"
          >Foreground Melody</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import LeaderLine, { SocketType } from "leader-line-new"

import {router} from '@/main'
import {onMounted, onUpdated, Ref, ref, watch} from "vue";

let psDiv: Element;
let mhDiv: Element;
let mghrDiv: Element;
let mgmDiv: Element;
let mghpDiv: Element;
let fgmDiv: Element;
let fgmrDiv: Element;

function redirect(path:string) {
  router.push({path: path})
}

onMounted(() => {
  psDiv = document.getElementById("ps") as Element
  mhDiv = document.getElementById("mh") as Element
  mghrDiv = document.getElementById("mghr") as Element
  mgmDiv = document.getElementById("mgm") as Element
  mghpDiv = document.getElementById("mghp") as Element
  fgmDiv = document.getElementById("fgm") as Element
  fgmrDiv = document.getElementById("fgmr") as Element
  drawLines()
})



// HELPERS

function createLine(div1: Element, div2: Element, start: SocketType, end: SocketType, gravity: number[]) {
  return new LeaderLine(
      div1,
      div2,
      {
        path: 'magnet',
        startSocket: start,
        endSocket: end,
        startSocketGravity: gravity,
        size: 3,
        color: 'green'
      }
  )
}

function drawLines() {
  //From phrase structure
  createLine(psDiv, mhDiv, 'left', 'top', [-150, 0])
  createLine(psDiv, mghrDiv, 'bottom', 'top', [0, 0])
  createLine(psDiv, mghpDiv, 'right', 'top', [150, 0])
  //From Meter and Hypermeter
  createLine(mhDiv, mghrDiv, 'right', 'left', [0, 0])
  createLine(mhDiv, fgmrDiv, 'bottom','left', [0, 190])
  //From Middleground Harmonic Rhythm
  createLine(mghrDiv, fgmrDiv, 'bottom', 'top', [0, 0])
  createLine(mghrDiv, mghpDiv, 'right', 'left', [0, 0])
  createLine(mghrDiv, mgmDiv, 'bottom', 'left', [50, 70])
  //From Middleground Harmonic Progression
  createLine(mghpDiv, mgmDiv, 'bottom', 'top', [0, 0])
  //From Middleground Melody
  createLine(mgmDiv, fgmDiv, 'bottom', 'top', [0, 0])
  //From Foreground Melodic Rhythm
  createLine(fgmrDiv, fgmDiv, 'right','left',[0, 0])
}
</script>

<style scoped>
.btn {
  border-color: rgba(0,0,0,0);
  font-size: 24px;
}

.myRow {
  width: 600px;
}
</style>