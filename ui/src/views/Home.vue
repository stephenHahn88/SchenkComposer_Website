<template>
  <div>
    <b-row class="m-3">
      <b-col>
        <h1>Welcome to SchenkComposer</h1>
      </b-col>
      <b-col>
        <b-button
            style="width:100%; height: 100%"
            variant="success"
            @click="pushRouter('/phrase-structure')"
        >Get Started!</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import {pushRouter} from '@/data';
</script>

<style scoped>
.btn {
  font-size: 32px;
}

h1 {
  color: white;
}
</style>