<template>
  <div class="background">
<!--    NAVBAR-->
    <b-navbar toggleable="lg" style="background-color: rgba(255, 255, 255, 0.2)">
      <b-navbar-brand @click="router.push({path: '/'})">
<!--        NAVBAR IMAGE-->
        <img
            src="@/static/schenkcomposer_logo.svg"
            alt="SchenkComposer"
            class="d-inline-block align-top"
            style="height: 90px; width: auto;"
        >
      </b-navbar-brand>
      <b-navbar-brand>
        <b-button variant="success" @click="createNewMelody">
          Create New Melody
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
<!--        DAG-->
        <b-container style="overflow: auto">
          <div class="p-2 ml-3" style="width: 650px; background-color: rgba(0, 0, 0, 0.6); border-radius: 30px;">
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
      <b-col class="mt-5">
        <div class="p-2" style="background-color: rgba(0, 0, 0, 0.6); border-radius: 30px; overflow: auto">
          <MusicPlayer></MusicPlayer>
          <router-view
            name="tutorial"
          />
        </div>
      </b-col>
    </b-row>
    <!--      ROUTER VIEW-->
    <b-row>
      <b-col class="m-4 p-3" style="background-color: rgba(0, 0, 0, 0.6); border-radius: 30px">
        <router-view
            @psanimate="phraseStructureAnimate($event)"
            @meteranimate="meterAnimate($event)"
            @mgrhythmanimate="mgrhythmAnimate($event)"
            @mgharmonyanimate="mgharmonyAnimate($event)"
            @mgmelodyanimate="mgmelodyAnimate($event)"
            @fgrhythmanimate="fgrhythmAnimate($event)"
            name="default"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import SchenkComposerDAG from "@/components/SchenkComposerDAG.vue";
import {ref, Ref, watch, provide, onMounted} from 'vue'
import {router} from '@/main'
import MusicPlayer from "@/components/MusicPlayer.vue";
import {_makeid, delay} from "../../server/data"

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
}

onMounted(async () => {
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

updateComposerId(_makeid(32))
updateMelodyId("1")

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