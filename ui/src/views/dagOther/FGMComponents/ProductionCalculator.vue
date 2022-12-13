<template>
  <b-container>
    <b-row class="m-1"><h2>Manual Production Rule Creator</h2></b-row>
    <!--        OUTPUT GOES HERE-->
    <b-row class="m-1 white-background border-10" style="width: 400px; height: 50px;">
      <b-col
          @click="selectPart('from')"
          :class="newRule['from']['selected'].toString()"
          class="hoverable"
      >
        From:<br/>
        {{newRule['from']['value'].join("")}}
      </b-col>
      <b-col
          @click="selectPart('to')"
          :class="newRule['to']['selected'].toString()"
          class="hoverable"
      >
        To:<br/>
        {{newRule['to']['value'].join("")}}
      </b-col>
      <b-col
          @click="selectPart('count')"
          :class="newRule['count']['selected'].toString()"
          class="hoverable"
      >
        Count:<br/>
        {{newRule['count']['value'].join("")}}
      </b-col>
    </b-row>
    <!--        BEGIN GRID OF KEYBOARD-->
    <b-row class="m-1 p-2 white-background border-10" style="width: 400px;">
      <b-col>
        <b-row>
          <b-col class="m-1"><b-button variant="primary" @click="addSymbol(up)">{{up}}</b-button></b-col>
          <b-col class="m-1"><b-button variant="primary" @click="addSymbol(straight)">{{straight}}</b-button></b-col>
          <b-col class="m-1"><b-button variant="primary" @click="addSymbol(down)">{{down}}</b-button></b-col>
        </b-row>
        <b-row>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[1])">1</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[2])">2</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[3])">3</b-button></b-col>
        </b-row>
        <b-row>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[4])">4</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[5])">5</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[6])">6</b-button></b-col>
        </b-row>
        <b-row>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[7])">7</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[8])">8</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[9])">9</b-button></b-col>
        </b-row>
        <b-row>
          <b-col class="m-1"><b-button variant="warning" @click="backspace()">&#8592</b-button></b-col>
          <b-col class="m-1"><b-button variant="dark" @click="addSymbol(sub[0])">0</b-button></b-col>
          <b-col class="m-1"><b-button variant="danger" @click="erase()">X</b-button></b-col>
        </b-row>
        <b-row>
          <b-col class="m-1"><b-button variant="success" @click="$emit('submit', newRule); eraseAll();">Add</b-button></b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import {ref, Ref, reactive} from "vue";
import {ProductionRule} from "@/data";

const up = "\u2197"+"\uFE0E"
const down = "\u2198"+"\uFE0E"
const straight = "\u2192"+"\uFE0E"
const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"]

let newRule: ProductionRule = reactive({
  "from": {value: [], selected: true},
  "to": {value: [], selected: false},
  "count": {value: [], selected: false}
})

function selectPart(part: "from" | "to" | "count") {
  for (let p in newRule) {
    newRule[p]["selected"] = (p === part);
  }
}

function _findActivePart(): string {
  for (let l in newRule) {
    if (newRule[l]['selected']) {
      return l
    }
  }
  return 'from'
}

function subToNum(subscript: string): string {
  return sub.indexOf(subscript).toString()
}

function addSymbol(symbol: string) {
  let part = _findActivePart()
  if (part === 'count') {
    newRule[part]['value'].push(subToNum(symbol))
  } else {
    newRule[part]['value'].push(symbol)
  }
}

function backspace() {
  let part = _findActivePart()
  newRule[part]['value'].pop()
}

function erase() {
  let part = _findActivePart()
  newRule[part]['value'] = []
}

function eraseAll() {
  for (let part in newRule) {
    newRule[part]['value'] = []
  }
}
</script>

<style scoped>
.btn {
  width: 100%;
  height: 100%;
  font-size: 18px;
}

.white-background {
  background-color: rgba(255, 255, 255, 0.6);
}

.border-10 {
  border-radius: 10px;
}

.hoverable:hover, .true {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>