<template>
  <div>
    <b-form-input v-model="composerId"></b-form-input>
    <b-button class="m-2" @click="refresh" variant="info">&#8635; Refresh</b-button>
    <b-container
        style="overflow: auto; background-color: rgba(255, 255, 255, 0.6); border-radius: 10px;">
      <b-table
          class="mt-3"
          :items="melodies"
          :fields="fields"
          id="my-table"
          show-empty
          hover
          bordered
          head-variant="dark"
          table-variant="info"
      >
      </b-table>
    </b-container>
    <b-button class="m-2" @click="" variant="success">Load</b-button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Melody} from '../../../server/data'

const composerId = ref(1)
const melodies: Ref<Melody[]> = ref([])
const fields = [
  "melodyId",
  "composer",
  {
    key: "meter",
    sortable: true
  },
  "harmonicProgression",
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
  }
]

async function refresh() {
  let data = await fetch(`/api/composer/${composerId.value}`)
  melodies.value = await data.json()
  console.log(melodies.value)
}

onMounted(refresh)

</script>

<style scoped>


</style>