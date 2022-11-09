<template>
  <div>
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
      ></b-table>
    </b-container>
    <b-button class="m-2" @click="" variant="success">Load</b-button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Melody} from '../../../server/data'

const melodies: Ref<Melody[]> = ref([])
const fields = [
  "composer",
  {
    key: "meter",
    sortable: true
  },
  "harmonicProgression"
]

async function refresh() {
  let data = await fetch("/api/composer/2")
  melodies.value = await data.json()
  console.log(melodies.value)
}

onMounted(refresh)

</script>

<style scoped>
/*#my-table {*/
/*  color: white;*/
/*}*/

</style>