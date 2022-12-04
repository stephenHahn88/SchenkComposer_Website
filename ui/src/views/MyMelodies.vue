<template>
  <div>
    <b-button class="m-2" @click="refresh" variant="info">&#8635; Refresh</b-button>
    <h2 style="color: white">Currently selected melody: {{melodyId}}</h2>
    <b-container
        style="overflow: auto; background-color: rgba(255, 255, 255, 0.6); border-radius: 10px;">
      <b-table
          class="mt-3"
          style="width: 2500px;"
          :items="melodies"
          :fields="fields"
          id="my-table"
          show-empty
          hover
          bordered
          head-variant="dark"
          table-variant="info"
          @row-clicked="(item) => handleRowClick(item['melodyId'])"
      >
      </b-table>
    </b-container>
    <b-button class="m-2" @click="" variant="success">Load</b-button>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, Ref, ref} from "vue";
import {Melody} from '../../../server/data'

const {composerId, updateComposerId}: any = inject("composerId")
const {melodyId, updateMelodyId}: any = inject("melodyId")
const melodies: Ref<Melody[]> = ref([])
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
    key: "transitionMatrix",
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
  }
]

function handleRowClick(item: string) {
  updateMelodyId(item)
}

async function refresh() {
  let data = await fetch(`/api/composer/${composerId.value}`)
  melodies.value = await data.json()
  console.log(melodies.value)
}

onMounted(refresh)

</script>

<style scoped>


</style>