<template>
  <div>
<!--    NAVBAR-->
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="/">
<!--        NAVBAR IMAGE-->
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
          <b-nav-item></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row>
      <b-col class="mt-5">
<!--        DAG-->
        <div style="width: 750px">
          <SchenkComposerDAG
              :phraseAnim="phrase_anim"
              :meter-anim="meter_anim"
              :mgrhythm-anim="mgrhythm_anim"
              :mgharmony-anim="mgharmony_anim"
          ></SchenkComposerDAG>
        </div>
      </b-col>
<!--      ROUTER VIEW-->
      <b-col class="mr-5 mt-5">
        <router-view
            @psanimate="phraseStructureAnimate($event)"
            @meteranimate="meterAnimate($event)"
            @mgrhythmanimate="mgrhythmAnimate($event)"
            @mgharmonyanimate="mgharmonyAnimate($event)"
            @mgmelodyanimate="mgmelodyAnimate($event)"
            @fgrhythmanimate="fgrhythmAnimate($event)"
        />
      </b-col>
    </b-row>
    <b-row>

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

function phraseStructureAnimate() {
  phrase_anim.value = !phrase_anim.value
}
function meterAnimate() {
  meter_anim.value = !meter_anim.value
}
function mgrhythmAnimate() {
  mgrhythm_anim.value = !mgrhythm_anim.value
}
function mgharmonyAnimate() {
  mgharmony_anim.value = !mgharmony_anim.value
}
function mgmelodyAnimate() {
  mgmelody_anim.value = !mgmelody_anim.value
}
function fgrhythmAnimate() {
  fgrhythm_anim.value = !fgrhythm_anim.value
}


</script>

<style scoped>
.center-content {
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
}
</style>