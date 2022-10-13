<template>
  <div>

    <div class="my-3 fixed-bottom text-center">
      <Keyboard
          :notes="[61, 64, 67]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Keyboard from '@/components/Keyboard.vue'
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";

</script>

<style scoped>

</style>