<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#">
        <img
            src="@/static/schenkcomposer_logo.svg"
            alt="SchenkComposer"
            class="d-inline-block align-top"
            style="height: 90px; width: auto;"
        >
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>yo</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row>
      <b-col>
        <div style="width: 750px; border: red">
          <SchenkComposerDAG
          ></SchenkComposerDAG>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <router-view />
      </b-col>
    </b-row>

  </div>
</template>

<script setup lang="ts">
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";
import {ref, Ref, watch} from 'vue'

let phrase_anim = ref(false)
let meter_anim = ref(false)
let mgrhythm_anim = ref(false)
let mgharmony_anim = ref(false)
let mgmelody_anim = ref(false)
let fgrhythm_anim = ref(false)

</script>

