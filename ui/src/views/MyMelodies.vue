<template>
  <div>
    <b-button @click="refresh">Refresh</b-button>
    <b-table :items="melodies"></b-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Melody} from '../../../server/data'

const melodies: Ref<Melody[]> = ref([])

async function refresh() {
  console.log("yo")
  let data = await fetch("/api/composer")
  console.log(data)
  melodies.value = await data.json()
  console.log("hey")
}

onMounted(refresh)

</script>

<style scoped>

</style>