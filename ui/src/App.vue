<template>
  <div class="background">
<!--    NAVBAR-->
    <b-navbar class="white-background" toggleable="lg">
      <b-navbar-brand @click="router.push({path: '/'})">
        <img
            src="@/static/schenkcomposer_logo.svg"
            alt="SchenkComposer"
            class="d-inline-block align-top"
            style="height: 90px; width: auto;"
        >
      </b-navbar-brand>
      <b-navbar-brand>
        <b-button variant="success" @click="createNewMelody">
          Create New Melody Skeleton
        </b-button>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="router.push({path: '/login'})">Login</b-nav-item>
          <b-nav-item @click="router.push({path: '/my-melodies'})">{{username}}'s Melodies</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row>
      <b-col class="mt-5">
<!--        DAG FLOWCHART-->
        <b-container style="overflow: auto">
          <div class="p-2 ml-3 black-background radius-30" style="width: 650px; height: 500px;">
            <SchenkComposerDAG
                :phrase-anim="phrase_anim"
                :meter-anim="meter_anim"
                :mgrhythm-anim="mgrhythm_anim"
                :mgharmony-anim="mgharmony_anim"
                :fgrhythm-anim="fgrhythm_anim"
                :mgmelody-anim="mgmelody_anim"
            ></SchenkComposerDAG>
          </div>
        </b-container>
      </b-col>
<!--      TUTORIAL-->
      <b-col class="mt-5">
        <b-container class="overflow-auto" style="height: 500px;">
          <b-container class="p-5 black-background radius-30">
            <h1>Tutorial</h1>
            <router-view
                name="tutorial"
            />
          </b-container>
        </b-container>
      </b-col>
    </b-row>
    <!--      ROUTER VIEW-->
    <b-row>
      <b-col class="m-4 p-3 black-background" style="border-radius: 30px">
        <router-view/>
<!--            @psanimate="phraseStructureAnimate($event)"-->
<!--            @meteranimate="meterAnimate($event)"-->
<!--            @mgrhythmanimate="mgrhythmAnimate($event)"-->
<!--            @mgharmonyanimate="mgharmonyAnimate($event)"-->
<!--            @mgmelodyanimate="mgmelodyAnimate($event)"-->
<!--            @fgrhythmanimate="fgrhythmAnimate($event)"-->
<!--            name="default"-->
<!--        />-->
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";
import {ref, Ref, watch, provide, onMounted, computed} from 'vue'
import {router} from '@/main'
import {_makeid, delay} from "../../server/data"


// References for animation of the DAG Flowchart
let phrase_anim = ref(false)
let meter_anim = ref(false)
let mgrhythm_anim = ref(false)
let mgharmony_anim = ref(false)
let mgmelody_anim = ref(false)
let fgrhythm_anim = ref(false)

// Info to access and update particular melodies
let username: Ref<string> = ref("Anonymous")
let composerId: Ref<string> = ref("")
let melodyId: Ref<string> = ref("")

function updateUsername(newUsername: string) {
  username.value = newUsername
}
function updateComposerId(newComposerId: string) {
  composerId.value = newComposerId
}
function updateMelodyId(newMelodyId: string) {
  melodyId.value = newMelodyId
}

provide("username", {username, updateUsername})
provide("composerId", {composerId, updateComposerId})
provide("melodyId", {melodyId, updateMelodyId})

// Create anonymous melody upon opening the page
onMounted(async () => {
  document.title = "SchenkComposer"
  let link = document.createElement('link')
  link.type = "image/png"
  link.rel = "shortcut icon"
  link.href = "src/static/favicon/android-chrome-512x512.png"
  document.head.appendChild(link)
  await putMelody()
})

async function putMelody() {
  await delay(500)
  let mel = {
    _id: composerId.value + melodyId.value,
    composerId: composerId.value,
    melodyId: melodyId.value,
    composer: username.value
  }
  const requestOptions = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mel)
  }
  let response = await (await fetch("/api/create-melody", requestOptions)).json()
  console.log(response)
}

async function createNewMelody() {
  let result = await (await fetch("/api/composer/" + composerId.value)).json()
  let max = 0
  for (let mel of result) {
    if (parseInt(mel["melodyId"]) > max) {
      max = parseInt(mel["melodyId"])
    }
  }
  melodyId.value = (max + 1).toString()
  await putMelody()
  resetAnimation()
}

updateComposerId(_makeid(32))
updateMelodyId("1")

// Animation toggles //TODO find cleaner way to do all this?
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
function resetAnimation() {
  phrase_anim.value = false
  meter_anim.value = false
  mgrhythm_anim.value = false
  mgharmony_anim.value = false
  mgmelody_anim.value = false
  fgrhythm_anim.value = false
}
</script>

<style scoped>
h1 {
  color: white
}

.overflow-auto {
  overflow: auto;
}

.black-background {
  background-color: rgba(0, 0, 0, 0.6);
}

.white-background {
  background-color: rgba(255, 255, 255, 0.2);
}

.radius-30 {
  border-radius: 30px;
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