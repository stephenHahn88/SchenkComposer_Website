<template>
  <div>
    <b-button class="m-2" @click="refresh" variant="info">&#8635; Refresh</b-button>
    <h2 style="color: white">Currently selected melody: {{melodyId}}</h2>
    <b-button
        class="m-2"
        @click="playSelectedMelody"
        :disabled="playMelodyDisabled"
        variant="success"
    >
      &#9654 Play Selected Melody
    </b-button>
    <b-container
        style="overflow: auto; background-color: rgba(255, 255, 255, 0.6); border-radius: 10px;">
      <b-table
          class="mt-3"
          style="width: 4500px;"
          :items="melodies"
          :fields="fields"
          id="my-table"
          show-empty
          hover
          bordered
          head-variant="dark"
          table-variant="info"
          @row-clicked="(item) => handleRowClick(item)"
      >
      </b-table>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, Ref, ref} from "vue";
import {Melody} from '../../../server/data'
import {playNotesAndHarmony} from "@/data";

const {composerId, updateComposerId}: any = inject("composerId")
const {melodyId, updateMelodyId}: any = inject("melodyId")
const melodies: Ref<Melody[]> = ref([])

onMounted(refresh)

// Formatting for the table
const fields = [
  {
    key: "melodyId",
    sortable: true
  },
  {
    key: "composer",
    sortable: true
  },
  {
    key: "phraseStructure",
    formatter: (arr: string[] | null) => {
      if (arr === null) return
      return arr.join(" ")
    }
  },
  {
    key: "meter",
    sortable: true
  },
  {
    key: "hypermeter",
    label: "Hypermeter (Measures)",
    formatter: (obj: {"a": number, "b": number, "c": number, "d": number} | null) => {
      if (obj === null) return
      return `a:${obj.a} b:${obj.b} c:${obj.c} d:${obj.d}`
    }
  },
  {
    key: "mgRhythm",
    label: "Harmonic Rhythm",
    formatter: (obj: {'a': string[], 'b':string[],'c':string[],'d':string[]}) => {
      if (obj === null) return
      return `a: (${obj.a.join("|")}) b: (${obj.b.join("|")}) c: (${obj.c.join("|")}) d: (${obj.d.join("|")})`
    }
  },
  {
    key: "harmonicProgression",
    formatter: (obj: any | null) => {
      if (obj === null) return
      return `a: (${obj.a.join(" ")}) b: (${obj.b.join(" ")}) c: (${obj.c.join(" ")}) d: (${obj.d.join(" ")})`
    }
  },
  {
    key: "matrix",
    label: "Transition Matrix Counts",
    formatter: (mat: number[][] | null) => {
      if (mat === null) return
      let answer = ''
      for (let row of mat) {
        let temp = row.join(" ")
        answer = answer.concat(temp + " | ")
      }

      return answer
    }
  },
  {
    key: "matrixLabels",
    formatter: (harmonies: string[] | null) => {
      if (harmonies === null) return
      let answer = ""
      for (let i = 1; i < harmonies.length + 1; i++) {
        answer += `(${i}: ${harmonies[i-1]}) `
      }
      return answer.slice(0, answer.length-1)
    }
  },
  {
    key: "openHarmonies",
    formatter: (harmonies: string[] | null) => {
      if (harmonies === null) return
      return harmonies.join(", ")
    }
  },
  {
    key: "closeHarmonies",
    formatter: (harmonies: string[] | null) => {
      if (harmonies === null) return
      return harmonies.join(", ")
    }
  },
  {
    key: "mgMelody",
    label: "Middleground Melody",
    formatter: (mel: string[] | null) => {
      if (mel === null) return
      return mel.join(" ").replaceAll("/", "")
    }
  },
  {
    key: "fgRhythm",
    label: "Foreground Rhythm",
    formatter: (obj: {'a': string[][], 'b': string[][], 'c': string[][], 'd': string[][]} | null) => {
      if (obj === null) return
      return `
        a: (${obj.a.join(" | ").replaceAll(",", " ")})
        b: (${obj.b.join(" | ").replaceAll(",", " ")})
        c: (${obj.c.join(" | ").replaceAll(",", " ")})
        d: (${obj.d.join(" | ").replaceAll(",", " ")})
      `
    }
  },
  {
    key: "notes",
    label: "Notes"
  },
  {
    key: "harmonies",
    label: "Harmonies"
  },
  {
    key: "tempo",
    label: "Tempo"
  }
]


let playMelodyDisabled = ref(true)
let currNotes = ref([])
let currHarmonies = ref([])
let currTempo = ref(0)

function handleRowClick(item: any) {
  updateMelodyId(item["melodyId"])
  if (item["notes"] === undefined || item["harmonies"] === undefined || item["tempo"] === undefined) {
    playMelodyDisabled.value = true
    return
  }
  currNotes.value = item["notes"]
  currHarmonies.value = item["harmonies"]
  currTempo.value = item["tempo"]
  playMelodyDisabled.value = false
}

function playSelectedMelody() {
  playNotesAndHarmony(currNotes.value, currHarmonies.value, currTempo.value)
}

// Retrieve melodies of current composer
async function refresh() {
  let data = await (await fetch(`/api/composer/${composerId.value}`)).json()
  console.log(data)
  melodies.value = data
  console.log(melodies.value)
}
</script>

<style scoped>
</style>