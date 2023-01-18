<template>
  <b-container>
    <b-row>
      <b-col>
        <b-button
          variant="info"
          style="width: 100%"
          @click="returnToCurrPage"
        >Return to Melody</b-button>
      </b-col>
      <b-col>
        <SchenkComposerDAG></SchenkComposerDAG>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue"
import {pushRouter} from "@/data";
import {inject} from "vue"


let {currPage, updateCurrPage} = inject("currPage")

async function returnToCurrPage() {
  await pushRouter(currPage.value)
}

</script>

<style scoped>

</style>