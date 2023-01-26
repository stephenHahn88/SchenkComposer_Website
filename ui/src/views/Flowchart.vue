<template>
  <b-container>
    <b-row>
      <b-col>
        <b-row class="mb-4">
          <b-button
              variant="info"
              style="width: 100%; height: 100px; font-size: 32px"
              @click="returnToCurrPage"
          >Return to Melody</b-button>
        </b-row>
        <b-row>
          <p style="color: white; font-size: 32px">This represents the overall flow that SchenkComposer takes when writing a melody. Details may be found in our paper: LINK COMING SOON</p>
        </b-row>
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