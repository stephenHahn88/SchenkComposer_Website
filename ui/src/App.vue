<template>
  <div class="background">
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
        <div class="p-2 ml-3" style="width: 700px; background-color: rgba(0, 0, 0, 0.6); border-radius: 30px;">
          <SchenkComposerDAG
              :phraseAnim="phrase_anim"
              :meter-anim="meter_anim"
              :mgrhythm-anim="mgrhythm_anim"
              :mgharmony-anim="mgharmony_anim"
          ></SchenkComposerDAG>
        </div>
      </b-col>
    </b-row>
    <!--      ROUTER VIEW-->
    <b-row>
      <b-col class="ml-4 mr-4 mt-5 p-3" style="background-color: rgba(0, 0, 0, 0.6); border-radius: 30px">
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

.background {
  position: relative;
}

.background::before {
  background-image: url("static/background_blue.jpg");
  margin: 0;
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;

  display: block;
  background-size:cover;
  width: 100%;
  height: 100%;

  -webkit-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
</style>