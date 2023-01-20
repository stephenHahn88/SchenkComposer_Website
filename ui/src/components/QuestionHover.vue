<template>
  <b-container style="m-0">
    <p
        :id="customId"
    >
      ?
    </p>
    <b-popover
        :target="customId"
        triggers="hover"
        placement="top"
    >
      <template #title>{{customTitle}}</template>
      <ul class="p-3" style="font-size: 16px;">
        <li v-for="text in customText">{{text}}</li>
      </ul>
    </b-popover>
  </b-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps(['title', 'text', 'id'])

let customId = ref(props.id)
let customTitle = ref(props.title)
let customText = ref(props.text)
</script>

<style scoped>
p {
  padding: 0 0 0 0;
  margin: 0 0 5px 0;
  border-radius: 100%;
  background: rgba(255, 0, 255, 0.5);
  width: 30px;
  height: 30px;
  font-size: 18px;
  color: white;
  text-align: center;
}
</style>